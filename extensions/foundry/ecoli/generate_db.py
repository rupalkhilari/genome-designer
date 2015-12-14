import sys, os
import re
from Bio import Entrez
from Bio.Seq import Seq
import pyaml
import json
import uuid

def gff_to_json(gff,outfile):
    Entrez.email = "deepak.chandran@autodesk.com"
    genome = Entrez.efetch(db="nucleotide", id="NC_000913.3", rettype="fasta", retmode="text")
    genome = genome.read().replace('\n','')
    blocks = []

    pattern1 = re.compile(r'.*\s+summary\s+"([^"]+)"')
    pattern2 = re.compile(r'.*\s+post-text\s+"([^"]+)"')

    for row in open(gff, 'r'):
        words = row.split('\t')
        if len(words) > 8 and words[2]=='gene':
          start = int(words[3])
          end = int(words[4])
          strand = words[6]
          seq = genome[start:end]
          name = 'NA'
          desc = ''
          if strand == '-':
            seq = str(Seq(seq).reverse_complement())

          annot = words[8].split(';')
          for item in annot:
            words = item.split('=')
            if words[0]=='gene':
              name = words[1]
            if words[0]=='Dbxref':
              words = words[1].split(',')
              for item2 in words:
                words2 = item2.split(':')
                if words2[0]=='GeneID':
                  res = Entrez.efetch('gene',id=words2[1])
                  res = res.read().replace('\n','')
                  m = pattern1.match(res)
                  if m:
                    desc = m.group(1)
                  else:
                    m = pattern2.match(res)
                    if m:
                      desc = m.group(1)       
          blocks.append( { 'metadata': { 'name':name, 'description': desc, 'type': 'CDS' }, 'sequence': seq } )

    with open(outfile, 'w') as fh:
        json.dump({"blocks":blocks}, fh)

def json_to_redis(jsonfile, outfile):
    blocks = json.load(open(jsonfile))["blocks"]

    for block in blocks:
        bid = str(uuid.uuid4())
        block["id"] = bid
        block["options"] = []
        block["rules"] = {}
        block["notes"] = {}
        seq = block["sequence"]
        seqfile = "./storage/" + bid + "/sequence"
        block["sequence"] = { "url" : seqfile, "annotations": [], "length": len(seq)  }

        os.system("redis-cli set \"" + bid + "\" \"" + json.dumps(block).replace("\"","\\\"") + "\"")

        directory = os.path.dirname(seqfile)
        if not os.path.exists(directory):
            os.makedirs(directory)
        fh = open(seqfile,"w")
        fh.write(seq)
        fh.close()

    with open(outfile, 'w') as fh:
        json.dump({"blocks":blocks}, fh)


what = sys.argv[1]
infile = sys.argv[2]
outfile = sys.argv[3]

if what == 'gff':
    gff_to_json(infile, outfile)
else:
    json_to_redis(infile, outfile)
