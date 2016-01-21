import { expect } from 'chai';
import { importProject, importBlock } from '../../extensions/convert/import';
import { exportProject, exportBlock } from '../../extensions/convert/export';

const EU912544 = `LOCUS       EU912544                3692 bp    DNA     circular SYN 06-FEB-2009
DEFINITION  Cloning vector pDM313, complete sequence.
ACCESSION   EU912544
VERSION     EU912544.1  GI:198078160
KEYWORDS    .
SOURCE      Cloning vector pDM313
  ORGANISM  Cloning vector pDM313
            other sequences; artificial sequences; vectors.
REFERENCE   1  (bases 1 to 3692)
  AUTHORS   Veltman,D.M., Akar,G., Bosgraaf,L. and Van Haastert,P.J.
  TITLE     A new set of small, extrachromosomal expression vectors for
            Dictyostelium discoideum
  JOURNAL   Plasmid 61 (2), 110-118 (2009)
   PUBMED   19063918
REFERENCE   2  (bases 1 to 3692)
  AUTHORS   Veltman,D.M., Akar,G., Bosgraaf,L. and van Haastert,P.J.M.
  TITLE     Direct Submission
  JOURNAL   Submitted (19-JUL-2008) Cell Biochemistry, Rijks Universiteit
            Groningen, Kerklaan 30, Haren 9751 NN, The Netherlands
FEATURES             Location/Qualifiers
     source          1..3692
                     /organism="Cloning vector pDM313"
                     /mol_type="other DNA"
                     /db_xref="taxon:555771"
                     /note="GFP-tag for C-terminal fusion"
     CDS             <10..723
                     /codon_start=1
                     /transl_table=11
                     /product="green fluorescent protein"
                     /protein_id="ACH81568.1"
                     /db_xref="GI:198078161"
                     /translation="GKGEELFTGVVPILVELDGDVNGHKFSVSGEGEGDATYGKLTLK
                     FICTTGKLPVPWPTLVTTFTYGVQCFSRYPDHMKRHDFFKSAMPEGYVQERTIFFKDD
                     GNYKTRAEVKFEGDTLVNRIELKGIDFKEDGNILGHKLEYNYNSHNVYIMADKQKNGI
                     KVNFKIRHNIEDGSVQLADHYQQNTPIGDGPVLLPDNHYLSTQSALSKDPNEKRDHMV
                     LLEFVTAAGITHGMDELYK"
     CDS             1556..2416
                     /codon_start=1
                     /transl_table=11
                     /product="penicillin beta-lactamase"
                     /protein_id="ACH81569.1"
                     /db_xref="GI:198078162"
                     /translation="MSIQHFRVALIPFFAAFCLPVFAHPETLVKVKDAEDQLGARVGY
                     IELDLNSGKILESFRPEERFPMMSTFKVLLCGAVLSRIDAGQEQLGRRIHYSQNDLVE
                     YSPVTEKHLTDGMTVRELCSAAITMSDNTAANLLLTTIGGPKELTAFLHNMGDHVTRL
                     DRWEPELNEAIPNDERDTTMPVAMATTLRKLLTGELLTLASRQQLIDWMEADKVAGPL
                     LRSALPAGWFIADKSGAGERGSRGIIAALGPDGKPSRIVVIYTTGSQATMDERNRQIA
                     EIGASLIKHW"
     rep_origin      2564..3231
                     /note="pUC ori"
ORIGIN
        1 actagtagtg gtaaaggaga agaacttttc actggagttg tcccaattct tgttgaatta
       61 gatggtgatg ttaatgggca caaattttct gtcagtggag agggtgaagg tgatgcaaca
      121 tacggaaaac ttacccttaa atttatttgc actactggaa aactacctgt tccatggcca
      181 acacttgtca ctacttttac gtatggtgtt caatgctttt caagataccc agatcatatg
      241 aaacggcatg actttttcaa gagtgccatg cccgaaggtt atgtacagga aagaactata
      301 tttttcaaag atgacgggaa ctacaagaca cgtgctgaag tcaagtttga aggtgatacc
      361 cttgttaata gaatcgagtt aaaaggtatt gattttaaag aagatggaaa cattcttgga
      421 cacaaattgg aatacaacta taactcacac aatgtataca tcatggcaga caaacaaaag
      481 aatggaatca aagttaactt caaaattaga cacaacattg aagatggaag cgttcaacta
      541 gcagaccatt atcaacaaaa tactccaatt ggcgatggcc ctgtcctttt accagacaac
      601 cattacctgt ccacacaatc tgccctttcg aaagatccca acgaaaagag agaccacatg
      661 gtccttcttg agtttgtaac agctgctggg attacacatg gcatggatga actatacaag
      721 taatctagac atcaagctta tcgataccgt cgacctcgag ggggggcccg gtacccaatt
      781 cgccctatag tgagtcgtat tacgcgcgct cactggccgt cgttttacaa cgtcgtgact
      841 gggaaaaccc tggcgttacc caacttaatc gccttgcagc acatccccct ttcgccagct
      901 ggcgtaatag cgaagaggcc cgcaccgatc gcccttccca acagttgcgc agcctgaatg
      961 gcgaatggaa attgtaagcg ttaatatttt gttaaaattc gcgttaaatt tttgttaaat
     1021 cagctcattt tttaaccaat aggccgaaat cggcaaaatc ccttataaat caaaagaata
     1081 gaccgagata gggttgagtg ttgttccagt ttggaacaag agtccactat taaagaacgt
     1141 ggactccaac gtcaaagggc gaaaaaccgt ctatcagggc gatggcccac tacgtgaacc
     1201 atcaccctaa tcaagttttt tggggtcgag gtgccgtaaa gcactaaatc ggaaccctaa
     1261 agggagcccc cgatttagag cttgacgggg aaagccggcg aacgtggcga gaaaggaagg
     1321 gaagaaagcg aaaggagcgg gcgctagggc gctggcaagt gtagcggtca cgctgcgcgt
     1381 aaccaccaca cccgccgcgc ttaatgcgcc gctacagggc gcgtcaggtg gcacttttcg
     1441 gggaaatgtg cgcggaaccc ctatttgttt atttttctaa atacattcaa atatgtatcc
     1501 gctcatgaga caataaccct gataaatgct tcaataatat tgaaaaagga agagtatgag
     1561 tattcaacat ttccgtgtcg cccttattcc cttttttgcg gcattttgcc ttcctgtttt
     1621 tgctcaccca gaaacgctgg tgaaagtaaa agatgctgaa gatcagttgg gtgcacgagt
     1681 gggttacatc gaactggatc tcaacagcgg taagatcctt gagagttttc gccccgaaga
     1741 acgttttcca atgatgagca cttttaaagt tctgctatgt ggcgcggtat tatcccgtat
     1801 tgacgccggg caagagcaac tcggtcgccg catacactat tctcagaatg acttggttga
     1861 gtactcacca gtcacagaaa agcatcttac ggatggcatg acagtaagag aattatgcag
     1921 tgctgccata accatgagtg ataacactgc ggccaactta cttctgacaa cgatcggagg
     1981 accgaaggag ctaaccgctt ttttgcacaa catgggggat catgtaactc gccttgatcg
     2041 ttgggaaccg gagctgaatg aagccatacc aaacgacgag cgtgacacca cgatgcctgt
     2101 agcaatggca acaacgttgc gcaaactatt aactggcgaa ctacttactc tagcttcccg
     2161 gcaacaatta atagactgga tggaggcgga taaagttgca ggaccacttc tgcgctcggc
     2221 ccttccggct ggctggttta ttgctgataa atctggagcc ggtgagcgtg ggtctcgcgg
     2281 tatcattgca gcactggggc cagatggtaa gccctcccgt atcgtagtta tctacacgac
     2341 ggggagtcag gcaactatgg atgaacgaaa tagacagatc gctgagatag gtgcctcact
     2401 gattaagcat tggtaactgt cagaccaagt ttactcatat atactttaga ttgatttaaa
     2461 acttcatttt taatttaaaa ggatctaggt gaagatcctt tttgataatc tcatgaccaa
     2521 aatcccttaa cgtgagtttt cgttccactg agcgtcagac cccgtagaaa agatcaaagg
     2581 atcttcttga gatccttttt ttctgcgcgt aatctgctgc ttgcaaacaa aaaaaccacc
     2641 gctaccagcg gtggtttgtt tgccggatca agagctacca actctttttc cgaaggtaac
     2701 tggcttcagc agagcgcaga taccaaatac tgtccttcta gtgtagccgt agttaggcca
     2761 ccacttcaag aactctgtag caccgcctac atacctcgct ctgctaatcc tgttaccagt
     2821 ggctgctgcc agtggcgata agtcgtgtct taccgggttg gactcaagac gatagttacc
     2881 ggataaggcg cagcggtcgg gctgaacggg gggttcgtgc acacagccca gcttggagcg
     2941 aacgacctac accgaactga gatacctaca gcgtgagcta tgagaaagcg ccacgcttcc
     3001 cgaagggaga aaggcggaca ggtatccggt aagcggcagg gtcggaacag gagagcgcac
     3061 gagggagctt ccagggggaa acgcctggta tctttatagt cctgtcgggt ttcgccacct
     3121 ctgacttgag cgtcgatttt tgtgatgctc gtcagggggg cggagcctat ggaaaaacgc
     3181 cagcaacgcg gcctttttac ggttcctggc cttttgctgg ccttttgctc acatgttctt
     3241 tcctgcgtta tcccctgatt ctgtggataa ccgtattacc gcctttgagt gagctgatac
     3301 cgctcgccgc agccgaacga ccgagcgcag cgagtcagtg agcgaggaag cggaagagcg
     3361 cccaatacgc aaaccgcctc tccccgcgcg ttggccgatt cattaatgca gctggcacga
     3421 caggtttccc gactggaaag cgggcagtga gcgcaacgca attaatgtga gttagctcac
     3481 tcattaggca ccccaggctt tacactttat gcttccggct cgtatgttgt gtggaattgt
     3541 gagcggataa caatttcaca caggaaacag ctatgaccat gattacgcca agcgcgcaat
     3601 taaccctcac taaagggaac aaaagctgga gctccaccgc ggtggcggcc gctctagaac
     3661 tagtggatcc cccgggctgc aggaattcga tg
//`;


const sampleBlocks = {
  '1': {
    'id': '1',
    'components': ['2', '3', '4'],
    'sequence': {
      'sequence': '',
      'features': [],
    },
  },
  '2': {
    'id': '2',
    'components': ['5', '6'],
    'sequence': {
      'sequence': '',
      'features': [],
    },
  },
  '3': {
    'id': '3',
    'components': ['7'],
    'sequence': {
      'sequence': '',
      'features': [],
    },
  },
  '4': {
    'id': '4',
    'components': [],
    'sequence': {
      'sequence': 'TT',
      'features': [{
        'start': 0,
        'end': 1,
        'type': 'Double T',
      }],
    },
  },
  '5': {
    'id': '5',
    'components': ['8', '9'],
    'sequence': {
      'sequence': '',
      'features': [],
    },
  },
  '6': {
    'id': '6',
    'components': [],
    'sequence': {
      'sequence': 'G',
      'features': [],
    },
  },
  '7': {
    'id': '7',
    'components': [],
    'sequence': {
      'sequence': 'G',
      'features': [],
    },
  },
  '8': {
    'id': '8',
    'components': [],
    'sequence': {
      'sequence': 'A',
      'features': [],
    },
  },
  '9': {
    'id': '9',
    'components': ['10'],
    'sequence': {
      'sequence': '',
      'features': [],
    },
  },
  '10': {
    'id': '10',
    'components': [],
    'sequence': {
      'sequence': 'C',
      'features': [],
    },
  },
};

const sampleGenbank = 'LOCUS       1                          6 bp    DNA              UNK 01-JAN-1980\nDEFINITION  .\nACCESSION   1\nVERSION     1\nKEYWORDS    .\nSOURCE      .\n  ORGANISM  .\n            .\nFEATURES             Location/Qualifiers\n     block           1..3\n                     /parent_block="1,0"\n                     /block_id="2"\n     block           1..2\n                     /parent_block="2,0"\n                     /block_id="5"\n     block           1\n                     /parent_block="5,0"\n                     /block_id="8"\n     block           2\n                     /parent_block="5,1"\n                     /block_id="9"\n     block           2\n                     /parent_block="9,0"\n                     /block_id="10"\n     block           3\n                     /parent_block="2,1"\n                     /block_id="6"\n     block           4\n                     /parent_block="1,1"\n                     /block_id="3"\n     block           4\n                     /parent_block="3,0"\n                     /block_id="7"\n     block           5..6\n                     /parent_block="1,2"\n                     /block_id="4"\n     Double_T        5\n                     /parent_block\n                     /block_id="4"\nORIGIN\n        1 acggtt\n//\n';

describe('Extensions: Genbank import/export', () => {
  it('import self-generated genbank file', function importGB(done) {
    this.timeout(5000);
    importBlock('genbank', sampleGenbank, result => {
      const output = JSON.parse(result);
      expect(result.block !== undefined);
      expect(output.blocks.length === 10);
      expect(output.block.id === '1');
      expect(output.block.components.length === 3);
      expect(output.block.components[0] === 2);
      expect(output.blocks['5'].components[0] === 8);
      expect(output.blocks['5'].components[1] === 9);
      done();
    });
  });

  it('import sample file from NCBI', function importGB(done) {
    this.timeout(5000);
    importBlock('genbank', EU912544, result => {
      const output = JSON.parse(result);
      expect(result.block !== undefined);
      expect(output.blocks.length === 2);
      done();
    });
  });

  it('export from blocks', function exportGB(done) {
    this.timeout(5000);
    exportBlock('genbank', {block: sampleBlocks['1'], blocks: sampleBlocks}, result => {
      expect(result === sampleGenbank);
      done();
    });
  });
});
