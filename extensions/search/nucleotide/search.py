from Bio import Entrez
import json
import sys

sys.path.append("extensions/convert/genbank")

from genbank_import_export import *

search_string = "carboxylase"
max_items = 2
outfile = "output.json"
db_name="nucleotide"

Entrez.email = "deepak.chandran@autodesk.com"
handle = Entrez.esearch(db=db_name, retmax=max_items, term=search_string)
record = Entrez.read(handle)
id_list = record['IdList']
handle.close()

all_blocks = []
tmpfile = "temp.gb"

for i in range(0,len(id_list)):
    handle = Entrez.efetch(db=db_name, id=id_list[i], rettype="gb", retmode="text")
    gbstr = handle.read()
    handle.close()
    fout = open(tmpfile, 'w')
    fout.write(gbstr)
    fout.close()

    blocks = genbank_to_block(tmpfile)['blocks']
    for j in blocks:
        all_blocks.append(blocks[j]);
    print(len(all_blocks))

json.dump(all_blocks, open(outfile,'w'))
