from Bio.Seq import Seq
fin = open('inputs/DNA')
prot = Seq(fin.read())
fout = open('outputs/Protein','w')
fout.write(str(prot))
fout.close()
