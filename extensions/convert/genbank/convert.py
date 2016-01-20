import requests
import json
from io import StringIO
from Bio import Seq
from Bio import SeqIO
from Bio import SeqFeature
import sys
import uuid
import sys
from genbank_import_export import *

to_genbank = sys.argv[1] == "to_genbank"

if to_genbank:
    genbank_file = sys.argv[3]
    block_file = sys.argv[2]
    block = json.load(open(block_file,"r"))
    block_to_genbank(genbank_file, block['block'], block['blocks'])
else:
    genbank_file = sys.argv[2]
    block_file = sys.argv[3]
    blocks = genbank_to_block(genbank_file)
    json.dump(blocks, open(block_file,'w'))
