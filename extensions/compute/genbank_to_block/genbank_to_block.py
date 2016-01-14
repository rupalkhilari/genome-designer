import requests
import json
from io import StringIO
from Bio import Seq
from Bio import SeqIO
from Bio import SeqFeature
import sys
import uuid
import sys

genbank_file = sys.argv[1]
block_file = sys.argv[2]

blocks = {
"1": {
    "id": "1",
    "components": ["2", "3", "4"],
    "sequence": { 
      "sequence": "",
      "features": []
    }
  },
"2": {
    "id": "2",
    "components": ["5", "6"],
    "sequence": { 
      "sequence": "",
      "features": []
    }
  },
"3": {
    "id": "3",
    "components": ["7"],
    "sequence": { 
      "sequence": "",
      "features": []
    }
  },
"4": {
    "id": "4",
    "components": [],
    "sequence": { 
      "sequence": "TT",
      "features": [{
        "start": 0,
        "end": 1,
        "type": "Double T"
      }]
    }
  },
"5": {
    "id": "5",
    "components": ["8", "9"],
    "sequence": { 
      "sequence": "",
      "features": []
    }
  },
"6": {
    "id": "6",
    "components": [],
    "sequence": { 
      "sequence": "G",
      "features": []
    }
  },
"7": {
    "id": "7",
    "components": [],
    "sequence": { 
      "sequence": "G",
      "features": []
    }
  },
"8": {
    "id": "8",
    "components": [],
    "sequence": { 
      "sequence": "A",
      "features": []
    }
  },
"9": {
    "id": "9",
    "components": ["10"],
    "sequence": { 
      "sequence": "",
      "features": []
    }
  },
"10": {
    "id": "10",
    "components": [],
    "sequence": { 
      "sequence": "C",
      "features": []
    }
  }
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

    block = {
        "id": gb.id,
        "components": [],
        "sequence" : {
            "sequence": sequence,
            "features": []
        }
      }

    all_blocks[gb.id] = block

    for f in gb.features:
        q = f.qualifiers
        if "block_id" in q:
            block_id = q["block_id"][0]
            if f.type == 'source':
                continue

            start = f.location.start.position
            end = f.location.end.position

            if f.type == "block":
                child_block = {
                    "id": block_id,
                    "components": [],
                    "sequence" : {
                        "sequence": sequence[start:end],
                        "features": []
                    }
                  }
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

    return all_blocks

#block = blocks["1"]
#block_to_genbank("test.gb", block, blocks)
blocks = genbank_to_block(genbank_file)
json.dump( blocks, open(block_file,"w") )
