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
    "regulatory": "promoter" #promoter is actually a subclass of regulatory
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

def block_to_genbank(filename, block, allblocks):
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

    SeqIO.write(seq_obj, open(filename, "w"), "genbank")

def create_block_json(id, sequence, features):
    return {
        "id": id,
        "metadata" : {
            "authors": [],
            "tags": {},
            "version": ""
        },
        "rules": {},
        "components": [],
        "sequence" : {
            "sequence": sequence,
            "features": features
        }
      }

def genbank_to_block(filename, convert_features=False):
    all_blocks = {}
    block_parents = {}
    block_start_pos = {}
    features = []
    newblocks = 0

    generator = SeqIO.parse(open(filename,"r"),"genbank")
    for record in generator:
        gb = record
        break

    sequence = str(gb.seq)
    root_id = str(uuid.uuid4())

    #Collect all the neccessary metadata
    root_block = create_block_json(root_id, sequence, [])
    root_block["metadata"]["description"] = gb.description
    root_block["metadata"]["name"] = gb.name
    for annot in gb.annotations:
        try:
            json.dumps(gb.annotations[annot])
            root_block["metadata"][annot] = gb.annotations[annot]
        except:
            pass

    all_blocks[root_id] = root_block
    all_blocks[gb.id] = root_block

    for f in gb.features:
        qualifiers = f.qualifiers
        start = f.location.start.position
        end = f.location.end.position

        feature = {}
        for q in qualifiers:
            if q != "block_id" and q != "parent_block":
                try:
                    json.dumps(qualifiers[q][0])
                    feature[q] = qualifiers[q][0]
                except:
                    pass
        feature["start"] = start
        feature["end"] = end
        feature["strand"] = f.location.strand
        feature["type"] = f.type

        sbol_type = sbol_type_table.get(f.type)

        if "block_id" in qualifiers:
            block_id = qualifiers["block_id"][0]
            if f.type == 'source':
                continue

            if f.type == "block":
                child_block = create_block_json(block_id, sequence[start:end], [])
                if qualifiers.get("parent_block",None):
                    words = qualifiers["parent_block"][0].split(",")
                    block_parents[block_id] = {
                        "id" : words[0],
                        "index" : int(words[1])
                    }
                else:
                    block_parents[block_id] = {
                        "id" : root_id,
                        "index" : newblocks
                    }
                    newblocks += 1
                child_block["metadata"]["tags"]["sbol"] = sbol_type
                all_blocks[block_id] = child_block
            else:
                feature["block_id"] = block_id
                features.append(feature)
        else:
            if sbol_type and convert_features:
                block_id = str(uuid.uuid4())
                child_block = create_block_json(block_id, sequence[start:end], [])
                child_block["metadata"]["tags"]["sbol"] = sbol_type
                all_blocks[block_id] = child_block
                block_parents[block_id] = {
                    "id" : root_id,
                    "index" : newblocks
                }
                newblocks += 1
            else:
                feature["block_id"] = root_id
                features.append(feature)

    for block_id in block_parents:
        parent = block_parents[ block_id ]
        if block_id in all_blocks and parent["id"] in all_blocks:
            all_blocks[ parent["id"] ]["components"].insert(int(parent["index"]), block_id)
            all_blocks[ parent["id"] ]["sequence"]["sequence"] = ""

    for feature in features:
        block_id = feature["block_id"]
        del feature["block_id"]
        if block_id in all_blocks:
            all_blocks[ block_id ]["sequence"]["features"].append(feature)
    return { "block": all_blocks[root_id], "blocks": all_blocks }
