from Bio.Seq import Seq
import sys
fin = open(sys.argv[1])
prot = Seq(fin.read()).translate()
fout = open(sys.argv[2],'w')
fout.write(str(prot))
fout.close()
