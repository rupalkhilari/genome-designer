import json
from Bio import Seq
from Bio import SeqIO
from Bio import SeqFeature
import uuid

def add_features(block, allblocks, gb, start):
    if "type" in block["metadata"] and block["metadata"]["type"] == 'filler':
        return start + block["sequence"]["length"] + 1

    # Add Myself as a feature
    sf = SeqFeature.SeqFeature()
    if "type" in block["metadata"] and block["metadata"]["type"] != 'filler':
        sf.type = block["metadata"]["type"]
    elif "rules" in block and "sbol" in block["rules"]:
        sf.type = block["rules"]["sbol"]

    feature_strand = 1
    if "strand" in block["metadata"]:
        feature_strand = block["metadata"]["strand"]
    end = start + block["sequence"]["length"]
    sf.location = SeqFeature.FeatureLocation(start, end, strand=feature_strand)

    if "name" in block["metadata"] and block["metadata"]["name"] != "":
        sf.qualifiers["label"] = block["metadata"]["name"]

    if "description" in block["metadata"] and block["metadata"]["description"] != "":
        sf.qualifiers["GD_description"] = block["metadata"]["description"]

    if "genbank" in block["metadata"]:
        for annot_key, annot_value in block["metadata"]["genbank"].iteritems():
            sf.qualifiers[annot_key] = annot_value

    gb.features.append(sf)

    # Add My annotations as features
    for annotation in block["sequence"]["annotations"]:
        gb_annot = SeqFeature.SeqFeature()
        for key, value in annotation.iteritems():
            if key not in ["start", "end", "notes", "strand"]:
                gb_annot.qualifiers[key] = value
            elif key == "notes":
                for notes_key, notes_value in annotation["notes"].iteritems():
                    if notes_key == "genbank":
                        for gb_key, gb_value in notes_value:
                            gb_annot.qualifiers[gb_key] = gb_value

        if "start" in annotation:
            if "strand" in annotation:
                if annotation["strand"]:
                    strand = 1
                else:
                    strand = -1
            gb_annot.location = SeqFeature.FeatureLocation(annotation["start"], annotation["end"], strand)
        gb.features.append(gb_annot)

    # Add my children as features
    child_start = start
    for i in range(0, len(block["components"])):
        block_id = block["components"][i]
        bl = [b for b in allblocks if b["id"] == block_id][0]
        child_start = add_features(bl, allblocks, gb, child_start)

    return end

def project_to_genbank(filename, project, allblocks):
    blocks = project["components"]
    seq_obj_lst = []

    for block_id in blocks:
        block = [b for b in allblocks if b["id"] == block_id][0]
        if not block:
            continue

        if "genbank" in block["metadata"] and "original_id" in block["metadata"]["genbank"]:
            genbank_id = block["metadata"]["genbank"]["original_id"]
        else:
            genbank_id = block["metadata"]["name"]

        seq_obj = SeqIO.SeqRecord(Seq.Seq(block["sequence"]["sequence"],Seq.Alphabet.DNAAlphabet()), genbank_id)

        if "genbank" in block["metadata"]:
            if "annotations" in block["metadata"]["genbank"]:
                for annot_key, annot_value in block["metadata"]["genbank"]["annotations"].iteritems():
                    seq_obj.annotations[annot_key] = annot_value
            if "references" in block["metadata"]["genbank"]:
                for ref in block["metadata"]["genbank"]["references"]:
                    genbank_ref = SeqFeature.Reference()
                    genbank_ref.authors = ref['authors']
                    genbank_ref.comment = ref['comment']
                    genbank_ref.consrtm = ref['consrtm']
                    genbank_ref.journal = ref['journal']
                    genbank_ref.medline_id = ref['medline_id']
                    genbank_ref.pubmed_id = ref['pubmed_id']
                    genbank_ref.title = ref['title']
                    if "references" not in seq_obj.annotations:
                        seq_obj.annotations["references"] = []
                    seq_obj.annotations["references"].append(genbank_ref)
            if "feature_annotations" in block["metadata"]["genbank"]:
                sf = SeqFeature.SeqFeature()
                sf.type = "source"
                sf.location = SeqFeature.FeatureLocation(0, len(seq_obj.seq))
                for annot_key, annot_value in block["metadata"]["genbank"]["feature_annotations"].iteritems():
                    sf.qualifiers[annot_key] = annot_value
                seq_obj.features.append(sf)

        if "description" in block["metadata"]:
            seq_obj.description = block["metadata"]["description"]
        if "name" in block["metadata"]:
            seq_obj.name = block["metadata"]["name"]

        start = 0
        for child_id in block['components']:
            child_block = [b for b in allblocks if b["id"] == child_id][0]
            start = add_features(child_block, allblocks, seq_obj, start)

        seq_obj_lst.append(seq_obj)

    SeqIO.write(seq_obj_lst, open(filename, "w"), "genbank")