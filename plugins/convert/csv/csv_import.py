import json
from Bio import SeqIO
import uuid
import csv

# This table converts annotation types in genbank to role_types in our tool
# Ex: if genbank says "gene", turn it into an role_type of "cds" as we import
role_type_table = {
    "CDS": "cds",
    "regulatory": "promoter", #promoter is actually a subclass of regulatory
    "promoter": "promoter",
    "terminator": "terminator",
    "gene": "cds",
    "mat_peptide": "cds"
}

# Creates a scaffold structure for a block
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

# Given a structure representing a line in the csv file, create a block
def line_to_block(line):
    block_id = str(uuid.uuid4())
    block = create_block_json(block_id, line["Sequence"], [])
    block["metadata"]["name"] = line["Name"]
    block["metadata"]["description"] = line["Description"]
    if "SBOL Type" in line:
        block["rules"]["role"] = line["SBOL Type"].lower()
    if "Background Color" in line:
        block["metadata"]["color"] = line["Background Color"]
    return {"id": block_id, "block": block}

# Given a file, create project and blocks structures to import into GD
def csv_to_project(filename):
    root_id = str(uuid.uuid4())
    root_block = create_block_json(root_id, "", [])

    blocks = { root_id: root_block }
    project = { "components": [root_id]}

    with open(filename, "rb" ) as theFile:
        reader = csv.DictReader(theFile)
        for line in reader:
            # line is { 'workers': 'w0', 'constant': 7.334, 'age': -1.406, ... }
            # e.g. print( line[ 'workers' ] ) yields 'w0'
            new_block = line_to_block(line)
            blocks[new_block["id"]] = new_block["block"]
            root_block["components"].append(new_block["id"])
    return { "project": project, "blocks": blocks }
