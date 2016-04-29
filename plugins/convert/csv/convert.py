import json
from io import StringIO
from Bio import Seq
from Bio import SeqIO
from Bio import SeqFeature
import sys
import uuid
import sys
from csv_import import *

to_csv = sys.argv[1] == "to_csv"

if not to_csv:
    csv_file = sys.argv[2]
    project_file = sys.argv[3]
    project = csv_to_project(csv_file)
    json.dump(project, open(project_file,'w'))
else:
    raise Exception('Exporting to CSV not implemented yet')
    csv_file = sys.argv[3]
    project_file = sys.argv[2]
    project = json.load(open(project_file, "r"))
    project_to_csv(csv_file, project['project'], project['blocks'])
