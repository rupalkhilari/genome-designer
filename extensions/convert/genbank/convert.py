import requests
import json
from io import StringIO
from Bio import Seq
from Bio import SeqIO
from Bio import SeqFeature
import sys
import uuid
import sys

to_genbank = sys.argv[1] == "to_genbank"

if to_genbank:
    genbank_file = sys.argv[3]
    block_file = sys.argv[2]
else:
    genbank_file = sys.argv[2]
    block_file = sys.argv[3]

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

def genbank_to_block(filename):
    all_blocks = {}
    block_parents = {}
    block_start_pos = {}
    features = []

    generator = SeqIO.parse(open(filename,"r"),"genbank")
    for record in generator:
        gb = record
        break

    sequence = str(gb.seq)

    all_blocks[gb.id] = create_block_json(gb.id, sequence, [])

    for f in gb.features:
        q = f.qualifiers
        if "block_id" in q:
            block_id = q["block_id"][0]
            if f.type == 'source':
                continue

            start = f.location.start.position
            end = f.location.end.position

            if f.type == "block":
                child_block = create_block_json(block_id, sequence[start:end], [])
                if q.get("parent_block",None):
                    words = q["parent_block"][0].split(",")
                    block_parents[block_id] = {
                        "id" : words[0],
                        "index" : int(words[1])
                    }

                all_blocks[block_id] = child_block
            else:
                feature = { "block_id": block_id, "start": start, "end": end, "strand": f.location.strand, "type": f.type }
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
    return { "block": all_blocks[gb.id], "blocks": all_blocks }

if to_genbank:
    block = json.load(open(block_file,"r"))
    block_to_genbank(genbank_file, block['block'], block['blocks'])
else:
    blocks = genbank_to_block(genbank_file)
    json.dump(blocks, open(block_file,'w'))
