import requests
import json
from io import StringIO
from Bio import Seq
from Bio import SeqIO
from Bio import SeqFeature
import sys
import uuid

sbol_type_table = {
    "CDS": "cds",
    "regulatory": "promoter", #promoter is actually a subclass of regulatory
    "promoter": "promoter",
    "terminator": "terminator",
    "gene": "cds"
}

def get_sequence_and_features(block, allblocks):
    features = block["sequence"]["features"]
    for f in features:
        f["block_id"] = block["id"]

    if len(block["components"])==0:
        return { "sequence": block["sequence"]["sequence"], "features": features}
    else:
        seq = ""
        for i in range(0, len(block["components"])):
            block_id = block["components"][i]
            bl = allblocks[block_id]
            pos = len(seq)
            output = get_sequence_and_features(bl, allblocks)
            seq += output["sequence"]

            features.append( {
                "block_id": block_id,
                "start" : pos,
                "end" : len(seq),
                "type" : "block",
                "parent_block" : block["id"] + "," + str(i),
            })

            for feature in output["features"]:
                features.append( {
                    "block_id": feature["block_id"],
                    "start" : feature["start"] + pos,
                    "end" : feature["end"] + pos,
                    "type" : feature["type"],
                    "parent_block" : feature.get("parent_block",None)
                })
        return { "sequence": seq, "features": features }

def project_to_genbank(filename, project, allblocks):
    blocks = project["components"]
    seq_obj_lst = []

    for bid in blocks:
        block = allblocks.get(bid)
        if not block:
            continue

        output = get_sequence_and_features(block, allblocks)
        seq = output["sequence"]
        features = output["features"]

        seq_obj = SeqIO.SeqRecord(Seq.Seq(seq,Seq.Alphabet.DNAAlphabet()),block["id"])
        for feature in features:
            sf = SeqFeature.SeqFeature()
            sf.type = feature["type"]
            sf.location = SeqFeature.FeatureLocation(feature["start"],feature["end"])
            sf.qualifiers["block_id"] = feature.get("block_id","")
            sf.qualifiers["parent_block"] = feature.get("parent_block",None)
            seq_obj.features.append(sf)
        seq_obj_lst.append(seq_obj)

    SeqIO.write(seq_obj_lst, open(filename, "w"), "genbank")

def create_block_json(id, sequence, features):
    return {
        "id": id,
        "metadata" : {},
        "rules": {},
        "components": [],
        "sequence" : {
            "sequence": sequence,
            "features": features
        }
      }

# Determines the kind of relationship between 2 blocks, using only the start and end positions
def relationship(block1, block2, full_size):
    set1 = set([i for i in range(block1["metadata"]["start"], block1["metadata"]["end"])])
    set2 = set([i for i in range(block2["metadata"]["start"], block2["metadata"]["end"])])
    if set1 < set2:
        return "child"
    if set1 == set2:
        return "equal"
    if set2 < set1:
        return "parent"
    if not set1.isdisjoint(set2):
        return "partial"
    if block1["metadata"]["end"]-1 < block2["metadata"]["start"]:
        return "before"
    if block1["metadata"]["start"] > block2["metadata"]["end"]-1:
        return "after"
    raise Exception("This relationship between blocks can never happen")
    return "disjoint"

# Takes a block and makes it a feature of another block, instead of a full block on itself.
def convert_block_to_feature(all_blocks, to_convert, parent, to_remove_list):
    feature = { }
    for key, value in to_convert["metadata"].iteritems():
        feature[key] = value

    parent["sequence"]["features"].append(feature)
    to_remove_list.append(to_convert)

    # And also convert to features all the components of the removed block, recursively
    for to_convert_child_id in to_convert["components"]:
        to_convert_child = all_blocks[to_convert_child_id]
        convert_block_to_feature(all_blocks, to_convert_child, parent, to_remove_list)

# Takes a BioPython SeqRecord and converts it to our blocks structures,
# with temporary ids
def genbank_to_block_helper(gb, convert_features=False):
    all_blocks = {}
    sequence = str(gb.seq)
    full_length = len(sequence)
    root_id = str(uuid.uuid4())

    #Collect all the neccessary metadata
    root_block = create_block_json(root_id, sequence, [])
    root_block["metadata"]["description"] = gb.description
    root_block["metadata"]["name"] = gb.name
    root_block["metadata"]["type"] = "source"
    root_block["metadata"]["start"] = 0
    root_block["metadata"]["end"] = full_length-1
    root_block["sequence"]["length"] = full_length
    for annot in gb.annotations:
        try:
            json.dumps(gb.annotations[annot])
            root_block["metadata"][annot] = gb.annotations[annot]
        except:
            pass

    all_blocks[root_id] = root_block

    # Create a block for each feature
    for f in sorted(gb.features, key = lambda feat: len(feat)):
        qualifiers = f.qualifiers
        start = f.location.start.position
        end = f.location.end.position
        strand = f.location.strand
        sbol_type = sbol_type_table.get(f.type)

        if f.type == 'source':
            for key, value in qualifiers.iteritems():
                root_block["metadata"][key] = value[0]
        else:
                block_id = str(uuid.uuid4())
                child_block = create_block_json(block_id, sequence[start:end], [])
                for q in f.qualifiers:
                    if q == "name":
                        child_block["name"] = f.qualifiers[q][0]
                    else:
                        try:
                            json.dumps(qualifiers[q][0])
                            child_block["metadata"][q] = f.qualifiers[q][0]
                        except:
                            pass
                child_block["metadata"]["start"] = start
                child_block["metadata"]["end"] = end-1
                child_block["sequence"]["length"] = end-start
                child_block["metadata"]["strand"] = strand

                if sbol_type:
                    child_block["rules"]["sbol"] = sbol_type

                child_block["metadata"]["type"] = f.type

                if "name" not in child_block:
                    if sbol_type == 'cds' and "gene" in f.qualifiers:
                            child_block["metadata"]["name"] = f.qualifiers["gene"][0]
                    else:
                        if sbol_type:
                            child_block["metadata"]["name"] = sbol_type
                        elif f.type:
                            child_block["metadata"]["name"] = f.type

                all_blocks[block_id] = child_block

    # Build the hierarchy
    # Going through the blocks from shorter to longer, so hopefully we will maximize
    # the ones that convert to blocks instead of features
    to_remove = []
    sorted_blocks = sorted(all_blocks.values(), key=lambda block: block["metadata"]["end"]-block["metadata"]["start"])
    for block in sorted_blocks:
        if block == root_block:
            continue

        inserted = False
        bigger_blocks = [b for b in sorted_blocks if b["metadata"]["end"]-b["metadata"]["start"] > block["metadata"]["end"]-block["metadata"]["start"]]
        for other_block in bigger_blocks:
            rel = relationship(block, other_block, full_length)
            if rel == "child":
                    i = 0
                    is_partial_overlap = False
                    for sib_id in other_block["components"]:
                        sibling = all_blocks[sib_id]
                        relationship_to_sibling = relationship(block, sibling, full_length)
                        if relationship_to_sibling == "after":
                            i += 1
                        elif relationship_to_sibling != "before": # Partial match! Just an annotation of the parent
                            is_partial_overlap = True
                            break
                    if not is_partial_overlap:
                        other_block["components"].insert(i, block["id"])
                    else:
                        convert_block_to_feature(all_blocks, block, other_block, to_remove)
                    inserted = True
                    break

        if not inserted: # This should never happen because the block should be at least child of root!
            raise Exception('Error processing a block!')

    for removing in to_remove:
        print "removing", removing["metadata"]["type"]
        all_blocks.pop(removing["id"])

    # Plug the holes: For each block that has children, make sure all the sequence is accounted for
    current_block_structures = [block for block in all_blocks.values()]
    for block in current_block_structures:
        current_position = block["metadata"]["start"]
        i = 0
        for i,child_id in enumerate(block["components"]):
            child = all_blocks[child_id]
            if child["metadata"]["start"] > current_position:
                block_id = str(uuid.uuid4())
                filler_block = create_block_json(block_id, sequence[current_position:child["metadata"]["start"]], [])
                filler_block["metadata"]["type"] = "filler"
                filler_block["metadata"]["name"] = "Filler"
                filler_block["metadata"]["start"] = current_position
                filler_block["metadata"]["end"] = child["metadata"]["start"]-1
                all_blocks[block_id] = filler_block
                block["components"].insert(i, block_id)
            current_position = child["metadata"]["end"] + 1
        if i > 0 and current_position < block["metadata"]["end"]:
            block_id = str(uuid.uuid4())
            filler_block = create_block_json(block_id, sequence[current_position:block["metadata"]["end"]+1], [])
            filler_block["metadata"]["type"] = "filler"
            filler_block["metadata"]["name"] = "Filler"
            filler_block["metadata"]["start"] = current_position
            filler_block["metadata"]["end"] = block["metadata"]["end"]
            all_blocks[block_id] = filler_block
            block["components"].insert(i+1, block_id)

    return { "root": all_blocks[root_id], "blocks": all_blocks }


def genbank_to_project(filename, convert_features=False):
    project = { "components": []}
    generator = SeqIO.parse(open(filename,"r"),"genbank")
    for record in generator:
        gb = record
        results = genbank_to_block_helper(gb, convert_features)
        project["components"].append(results["root"]["id"])
        project["name"] = results["root"]["metadata"]["name"]
        project["description"] = results["root"]["metadata"]["description"]

    return { "project": project, "blocks": results["blocks"] }

