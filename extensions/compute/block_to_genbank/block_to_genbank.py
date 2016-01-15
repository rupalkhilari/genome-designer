import requests
import json
from io import StringIO
from Bio import Seq
from Bio import SeqIO
from Bio import SeqFeature
import sys
import uuid

block_file = sys.argv[1]
genbank_file = sys.argv[2]

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

obj = json.load(open(block_file,"r"))
block = obj["block"]
blocks = obj["blocks"]
block_to_genbank(genbank_file, block, blocks)
