from Bio import Entrez
import json
import sys

sys.path.append("extensions/convert/genbank")

from genbank_import_export import *

db_name =  sys.argv[1]
search_string = sys.argv[2]
max_items = sys.argv[3]
outfile =  sys.argv[4]

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

    block = genbank_to_block(tmpfile)['block']
    all_blocks.append(block);
    print(len(all_blocks))

json.dump(all_blocks, open(outfile,'w'))
