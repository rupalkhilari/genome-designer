import Box2D from '../geometry/box2d';
import Vector2D from '../geometry/vector2d';
import Line2D from '../geometry/line2d';
import Node2D from '../scenegraph2d/node2d';
import Role2D from '../scenegraph2d/role2d';
import LineNode2D from '../scenegraph2d/line2d';
import kT from './layoutconstants';
import objectValues from '../../../utils/object/values';
import invariant from 'invariant';

// just for internal tracking of what type of block a node represents.
const blockType = 'block';
const roleType = 'role';

const listStore = [
      {
        "id": "block-2e91d930-f887-4593-87cf-4ecbe18e4294",
        "parents": [],
        "metadata": {
          "name": "5'HA-hAAVS1",
          "description": "Homology arm for targeting of hAVVS1 locus",
          "authors": [],
          "tags": {},
          "color": "#e7aaa9",
          "egfPosition": "1",
          "category": "Homology Arm",
          "sub-category": "Human genomic locus"
        },
        "sequence": {
          "md5": "448ef159d7280f71ffb2b2910b5c2ec5",
          "length": 910,
          "annotations": [],
          "initialBases": "gcacc"
        },
        "source": {
          "source": "egf",
          "id": "5'HA-hAAVS1"
        },
        "rules": {
          "role": null
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-a3b05e68-9ba3-4330-9ac7-0d3fac71d062",
        "parents": [],
        "metadata": {
          "name": "5'-ITR-PB",
          "description": "transposon-specific inverted terminal repeat sequences (ITRs) recognized by PiggyBac transposase",
          "authors": [],
          "tags": {},
          "color": "#D28482",
          "egfPosition": "1",
          "category": "inverted terminal repeat sequences (ITRs)",
          "sub-category": "transposon-specific inverted terminal repeat sequences (ITRs)"
        },
        "sequence": {
          "md5": "de85e26aee9edc4f6033c5e7249fea9b",
          "length": 350,
          "annotations": [],
          "initialBases": "ACTAT"
        },
        "source": {
          "source": "egf",
          "id": "5'-ITR-PB"
        },
        "rules": {
          "role": null
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-7880b14a-7e95-44f4-8f15-f667b3ebc935",
        "parents": [],
        "metadata": {
          "name": "Insulator_FB",
          "description": "FII/BEAD-A (FB) element. (STEMCELLS2008;26:3257–3266 ). FII/BEAD-A (FB) contains the minimal enhancer-blocking components of the chicken b-globin 5'HS4 insulator and a homologous region from the human T-cell receptor  BEAD-1 insulator ",
          "authors": [],
          "tags": {},
          "color": "#E9BA9b",
          "egfPosition": "2",
          "category": "Insulators",
          "sub-category": "endogenous elements"
        },
        "sequence": {
          "md5": "29c089067c1d3baf030143274e69d2d1",
          "length": 141,
          "annotations": [],
          "initialBases": "GGCCG"
        },
        "source": {
          "source": "egf",
          "id": "Insulator_FB"
        },
        "rules": {
          "role": "insulator"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-957cb732-6beb-44cf-bfc5-ea8b24363f28",
        "parents": [],
        "metadata": {
          "name": "CAGp",
          "description": "strong synthetic promoter used to drive high levels of gene expression in mammalian expression vectors. constructed in the lab of Dr Jun-ichi Miyazaki [3][4] from the following sequences: (C) the cytomegalovirus (CMV) early enhancer element + (A) the promoter, the first exon and the first intron of chicken beta-actin gene + (G) the splice acceptor of the rabbit beta-globin gene. ",
          "authors": [],
          "tags": {},
          "color": "#efac7e",
          "egfPosition": "3",
          "category": "Promoters",
          "sub-category": "Constitutional Promoter"
        },
        "sequence": {
          "md5": "37e79e60986bfc41a253c0c63467da0a",
          "length": 690,
          "annotations": [],
          "initialBases": "GGATC"
        },
        "source": {
          "source": "egf",
          "id": "CAGp"
        },
        "rules": {
          "role": "promoter"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-fc1010d6-f8a9-48f2-a53d-ff85d71759f2",
        "parents": [],
        "metadata": {
          "name": "CMVp_Tet",
          "description": "Tetracycline repressible CMV promoter. CMV promoter with downstream operator sequences for TetRepressor.",
          "authors": [],
          "tags": {},
          "color": "#EFD79A",
          "egfPosition": "3",
          "category": "Promoters",
          "sub-category": "Repressible promoter"
        },
        "sequence": {
          "md5": "f6b4bc5ed816895e82b55f4445ade240",
          "length": 627,
          "annotations": [],
          "initialBases": "GACAT"
        },
        "source": {
          "source": "egf",
          "id": "CMVp_Tet"
        },
        "rules": {
          "role": "promoter"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-bfc57543-63aa-4339-8779-3be51a92af60",
        "parents": [],
        "metadata": {
          "name": "EF1ap",
          "description": "strong constitutive promoter derived from  endogenous promoter of human elongation factor EF-1α . EF-1 alpha is often useful in conditions where other promoters (such as CMV) have diminished activity or have been silenced (as in embryonic stem cells)",
          "authors": [],
          "tags": {},
          "color": "#F1D26C",
          "egfPosition": "3",
          "category": "Promoters",
          "sub-category": "Constitutional Promoter"
        },
        "sequence": {
          "md5": "5fa85522433d4cc8a68d6b6377131bdf",
          "length": 1224,
          "annotations": [],
          "initialBases": "GGCTC"
        },
        "source": {
          "source": "egf",
          "id": "EF1ap"
        },
        "rules": {
          "role": "promoter"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-4b3d998a-4a00-4561-be84-bbf9854b7382",
        "parents": [],
        "metadata": {
          "name": "TRE3Gp",
          "description": "3rd-generation Tet-responsive promoter that can be activated by binding of Tet-On® 3G",
          "authors": [],
          "tags": {},
          "color": "#E4E480",
          "egfPosition": "3",
          "category": "Promoters",
          "sub-category": "Inducible Promoter"
        },
        "sequence": {
          "md5": "eda2e401ecde95233b2250c932d6de9b",
          "length": 396,
          "annotations": [],
          "initialBases": "TTATA"
        },
        "source": {
          "source": "egf",
          "id": "TRE3Gp"
        },
        "rules": {
          "role": "promoter"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-df8339cb-4681-449b-b0a2-839c202cc044",
        "parents": [],
        "metadata": {
          "name": "Kt-L7Ae - Weiss",
          "description": "L7Ae:K-turn system. K-t = K-turn, recognition sequence for RNA-binding protein L7Ae  . L7Ae then binds the K-turn motifs in the 5′ UTR of RNA and block the ribosome binding to the mRNA.    doi:10.1038/nbt.3301  ",
          "authors": [],
          "tags": {},
          "color": "#D3D34F",
          "egfPosition": "4",
          "category": "RNA regulatory sequences",
          "sub-category": "Translational regulatory sequences"
        },
        "sequence": {
          "md5": "5236e8a0c708dbbce191925b189f4251",
          "length": 32,
          "annotations": [],
          "initialBases": "AAGGA"
        },
        "source": {
          "source": "egf",
          "id": "Kt-L7Ae - Weiss"
        },
        "rules": {
          "role": "regulatory"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-96ed1a87-a2c9-47d6-96e9-e44bb74d8935",
        "parents": [],
        "metadata": {
          "name": "attB - BxB1",
          "description": "attB site for BxB1 integrase.",
          "authors": [],
          "tags": {},
          "color": "#9CC6C0",
          "egfPosition": "5",
          "category": "Site-specific recombinases recognition sites",
          "sub-category": "Serine integrase recognition sequences"
        },
        "sequence": {
          "md5": "f917b6194e890923693fc45231068f5a",
          "length": 42,
          "annotations": [],
          "initialBases": "AAGGC"
        },
        "source": {
          "source": "egf",
          "id": "attB - BxB1"
        },
        "rules": {
          "role": null
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-098054a8-0c59-41f7-a30d-a2ea385818b4",
        "parents": [],
        "metadata": {
          "name": "attP - BxB1",
          "description": "attP site for BxB1 integrase",
          "authors": [],
          "tags": {},
          "color": "#6DA19C",
          "egfPosition": "5",
          "category": "Site-specific recombinases recognition sites",
          "sub-category": "Serine integrase recognition sequences"
        },
        "sequence": {
          "md5": "19e9faf646684e7e6bf4948a7971483e",
          "length": 56,
          "annotations": [],
          "initialBases": "CTGTG"
        },
        "source": {
          "source": "egf",
          "id": "attP - BxB1"
        },
        "rules": {
          "role": null
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-cc2582d8-2f5f-4da0-9b4c-db03650080eb",
        "parents": [],
        "metadata": {
          "name": "K1-K1 -L7Ae",
          "description": "L7Ae:K-turn system. K = K-turn, recognition sequence for RNA-binding protein L7Ae  . L7Ae then binds the K-turn motifs in the 5′ UTR of RNA and block the ribosome binding to the mRNA.   ",
          "authors": [],
          "tags": {},
          "color": "#B1CED0",
          "egfPosition": "5",
          "category": "RNA regulatory sequences",
          "sub-category": "Translational regulatory sequences"
        },
        "sequence": {
          "md5": "c6c155263ed9438f3d806b12991f856f",
          "length": 71,
          "annotations": [],
          "initialBases": "CAAAC"
        },
        "source": {
          "source": "egf",
          "id": "K1-K1 -L7Ae"
        },
        "rules": {
          "role": "regulatory"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-86310a28-b431-40f6-989a-8529a8531428",
        "parents": [],
        "metadata": {
          "name": "Kt-Kt -L7Ae-Weiss",
          "description": "L7Ae:K-turn system. K-t = K-turn, recognition sequence for RNA-binding protein L7Ae  . L7Ae then binds the K-turn motifs in the 5′ UTR of RNA and block the ribosome binding to the mRNA.    doi:10.1038/nbt.3301  ",
          "authors": [],
          "tags": {},
          "color": "#65AAB1",
          "egfPosition": "5",
          "category": "RNA regulatory sequences",
          "sub-category": "Translational regulatory sequences"
        },
        "sequence": {
          "md5": "c6f2208c6ff5201c10c791c2d31ca300",
          "length": 83,
          "annotations": [],
          "initialBases": "CAAAC"
        },
        "source": {
          "source": "egf",
          "id": "Kt-Kt -L7Ae-Weiss"
        },
        "rules": {
          "role": "regulatory"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-9b270ff0-7715-4b71-9521-d09c6c4acf21",
        "parents": [],
        "metadata": {
          "name": "ATG-BoxC (L7Ae)",
          "description": "BoxC recognized by RNA binding protein L7Ae.  L7Ae then binds theBoxC motif placed after the ATG and block translation of the CDS. dOI: 10.1038/nCHeMBIO.273",
          "authors": [],
          "tags": {},
          "color": "#8EC78D",
          "egfPosition": "6",
          "category": "RNA regulatory sequences",
          "sub-category": "Translational regulatory sequences"
        },
        "sequence": {
          "md5": "b16ab31d4a7454f057dbee7ba73108f6",
          "length": 73,
          "annotations": [],
          "initialBases": "AACCG"
        },
        "source": {
          "source": "egf",
          "id": "ATG-BoxC (L7Ae)"
        },
        "rules": {
          "role": "regulatory"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-528a7673-b3f9-476a-af13-1912f763df71",
        "parents": [],
        "metadata": {
          "name": "Nt-IgKL sequence",
          "description": "N-terminal leader sequence from mouse immunoglobulin κ light chain. Peptide tag that targets the protein to the secretion pathway for protein secretion",
          "authors": [],
          "tags": {},
          "color": "#53B15F",
          "egfPosition": "6",
          "category": "Peptide Tags",
          "sub-category": "Protein Tags for Subcellular targeting"
        },
        "sequence": {
          "md5": "bca44fc45cfe313bbaaa783d7b281e56",
          "length": 73,
          "annotations": [],
          "initialBases": "CCGCC"
        },
        "source": {
          "source": "egf",
          "id": "Nt-IgKL sequence"
        },
        "rules": {
          "role": "tag"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-a7b9b10c-d38e-401e-bca1-e382afae5495",
        "parents": [],
        "metadata": {
          "name": "Nt-MLS",
          "description": "N-Terminal mitochondrial leader sequence. Peptide tag that targets the protein to the mitochondria",
          "authors": [],
          "tags": {},
          "color": "#C5C4C1",
          "egfPosition": "6",
          "category": "Peptide Tags",
          "sub-category": "Protein Tags for Subcellular targeting"
        },
        "sequence": {
          "md5": "1f807b6e6e39ebb2ebdbfaff3ab6aff9",
          "length": 97,
          "annotations": [],
          "initialBases": "CCGCC"
        },
        "source": {
          "source": "egf",
          "id": "Nt-MLS"
        },
        "rules": {
          "role": "tag"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-2cc42ef2-b575-4a07-b21b-3f0438be98b6",
        "parents": [],
        "metadata": {
          "name": "Nt-myristoylation signal",
          "description": "N-Terminal myristoylation signal. N-myristoylation signal from Src Kinase - fusion proteins are targeted to and serve as markers of the plasma membrane. Anchors protein to the membrane ( Genesis. 2006 April ; 44(4): 202–218. doi:10.1002/dvg.20203.)",
          "authors": [],
          "tags": {},
          "color": "#A5A6A2",
          "egfPosition": "6",
          "category": "Peptide Tags",
          "sub-category": "Protein Tags for Subcellular targeting"
        },
        "sequence": {
          "md5": "713932335ac562b4417c065ae0fc8859",
          "length": 52,
          "annotations": [],
          "initialBases": "CCGCC"
        },
        "source": {
          "source": "egf",
          "id": "Nt-myristoylation signal"
        },
        "rules": {
          "role": "tag"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-c4d44671-4c3e-45da-b1ff-b85773958722",
        "parents": [],
        "metadata": {
          "name": "Nt-Palmytolination sequence",
          "description": "N-terminal GAP43-palmitoylation sequence. Petide tag for targeting the protein to the plasma membrane ",
          "authors": [],
          "tags": {},
          "color": "#e7aaa9",
          "egfPosition": "6",
          "category": "Peptide Tags",
          "sub-category": "Protein Tags for Subcellular targeting"
        },
        "sequence": {
          "md5": "6541c46ea9604f37b6d9150f08a98650",
          "length": 70,
          "annotations": [],
          "initialBases": "CCGCC"
        },
        "source": {
          "source": "egf",
          "id": "Nt-Palmytolination sequence"
        },
        "rules": {
          "role": "tag"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-498ce450-05a5-4450-aaa9-9818c971cfd9",
        "parents": [],
        "metadata": {
          "name": "Nt-SV40-NLS",
          "description": "N-terminal nuclear localization signal of SV40 large T antigen. Peptide tag for targeting the protein to the nucleus ",
          "authors": [],
          "tags": {},
          "color": "#D28482",
          "egfPosition": "6",
          "category": "Peptide Tags",
          "sub-category": "Protein Tags for Subcellular targeting"
        },
        "sequence": {
          "md5": "db0702badb02a63b1b19da15a1261403",
          "length": 34,
          "annotations": [],
          "initialBases": "CCGCC"
        },
        "source": {
          "source": "egf",
          "id": "Nt-SV40-NLS"
        },
        "rules": {
          "role": "tag"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-f0235061-1aa2-4eaa-bd39-6a6132805692",
        "parents": [],
        "metadata": {
          "name": "BxB1",
          "description": "BxB1 Serine integrase. Phage-encoded serine integrases (Xu et al. BMC Biotechnology 2013, 13:87)",
          "authors": [],
          "tags": {},
          "color": "#E9BA9b",
          "egfPosition": "7",
          "category": "Site-specific recombinases",
          "sub-category": "Serine Integrases"
        },
        "sequence": {
          "md5": "30dfda0c8d0722536397e65c79c2863c",
          "length": 1499,
          "annotations": [],
          "initialBases": "AGAGC"
        },
        "source": {
          "source": "egf",
          "id": "BxB1"
        },
        "rules": {
          "role": null
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-da3271db-e23a-4ffd-846d-86fb3c8ae8e5",
        "parents": [],
        "metadata": {
          "name": "L7Ae - Weiss",
          "description": "ribosomal protein L7Ae of Archaeoglobus fulgidus, which binds tightly to the K-turn RNA motif.  It can be used to inhibit tranlsation when Kt is placed in 5'UTR of a mRNA. doi:10.1038/nbt.3301",
          "authors": [],
          "tags": {},
          "color": "#efac7e",
          "egfPosition": "7",
          "category": "RNA-Binding proteins",
          "sub-category": "RNA-Binding proteins"
        },
        "sequence": {
          "md5": "d986ca08309abc03888ff03dd72931ee",
          "length": 356,
          "annotations": [],
          "initialBases": "TACGT"
        },
        "source": {
          "source": "egf",
          "id": "L7Ae - Weiss"
        },
        "rules": {
          "role": null
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-25ec1255-e71f-4717-b8dc-ec9c7d550065",
        "parents": [],
        "metadata": {
          "name": "L7Ae ",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#EFD79A",
          "egfPosition": "7",
          "category": "RNA-Binding proteins",
          "sub-category": "RNA-Binding proteins"
        },
        "sequence": {
          "md5": "bfab01e0f3b129b9a5839978d044e196",
          "length": 596,
          "annotations": [],
          "initialBases": "AGCCC"
        },
        "source": {
          "source": "egf",
          "id": "L7Ae "
        },
        "rules": {
          "role": null
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-f3f61872-f120-4746-a6e0-b09cebe2bc70",
        "parents": [],
        "metadata": {
          "name": "mKate2",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#F1D26C",
          "egfPosition": "7",
          "category": "Fluorescent Reporter",
          "sub-category": "Far-red Fluorescent Reporter"
        },
        "sequence": {
          "md5": "e3cfbc17fcb822d5aa4096c43cb8c2ba",
          "length": 695,
          "annotations": [],
          "initialBases": "gtgag"
        },
        "source": {
          "source": "egf",
          "id": "mKate2"
        },
        "rules": {
          "role": "reporter"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-a7e9f3b6-3333-48b8-8cd5-63da53c74fae",
        "parents": [],
        "metadata": {
          "name": "mNeoGreen",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#E4E480",
          "egfPosition": "7",
          "category": "Fluorescent Reporter",
          "sub-category": "Green Fluorescent Reporter"
        },
        "sequence": {
          "md5": "a4ed866adbe252629cabf886e7ac2bb1",
          "length": 707,
          "annotations": [],
          "initialBases": "GTGAG"
        },
        "source": {
          "source": "egf",
          "id": "mNeoGreen"
        },
        "rules": {
          "role": "reporter"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-9aff851b-f7f1-4172-8f86-f58ba696847c",
        "parents": [],
        "metadata": {
          "name": "mRuby2",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#D3D34F",
          "egfPosition": "7",
          "category": "Fluorescent Reporter",
          "sub-category": "Red Fluorescent Reporter"
        },
        "sequence": {
          "md5": "0cb8424ff9169cb5aa57c62f6f306b85",
          "length": 710,
          "annotations": [],
          "initialBases": "GTGTC"
        },
        "source": {
          "source": "egf",
          "id": "mRuby2"
        },
        "rules": {
          "role": "reporter"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-2a298a38-fe85-4c24-abdb-c675bfbda389",
        "parents": [],
        "metadata": {
          "name": "mTagBFP2",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#9CC6C0",
          "egfPosition": "7",
          "category": "Fluorescent Reporter",
          "sub-category": "Blue Fluorescent Reporter"
        },
        "sequence": {
          "md5": "c5c01775c9ad2d93e78e64ee87fe6e0e",
          "length": 710,
          "annotations": [],
          "initialBases": "GTGTC"
        },
        "source": {
          "source": "egf",
          "id": "mTagBFP2"
        },
        "rules": {
          "role": "reporter"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-4f6ae612-2e0f-4f79-a006-54189f892266",
        "parents": [],
        "metadata": {
          "name": "Linker 1",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#6DA19C",
          "egfPosition": "8",
          "category": "Peptide Linker",
          "sub-category": "Flexible Peptide Linker"
        },
        "sequence": {
          "md5": "0f9ce0a38e72603bef4d9747a7df9f1c",
          "length": 51,
          "annotations": [],
          "initialBases": "TCTGG"
        },
        "source": {
          "source": "egf",
          "id": "Linker 1"
        },
        "rules": {
          "role": "structural"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-e055a9ff-9266-49d3-b294-0446b3560a2c",
        "parents": [],
        "metadata": {
          "name": "Linker 2",
          "description": "The linker sequence avoid large hydrophobic residues to maintain good solubility in aque- ous solutions. This linker provided similar performance as a longer (GGGGS)4 linker. One advantage of this linker over the (GGGGS)4 linker is that it did not have high homologous repeats in its DNA coding sequence.   Nat. Biotechnol. 17 (1999) 691–695.",
          "authors": [],
          "tags": {},
          "color": "#B1CED0",
          "egfPosition": "8",
          "category": "Peptide Linker",
          "sub-category": "Flexible Peptide Linker"
        },
        "sequence": {
          "md5": "2eae97c75ac6f79d27ce7bbf0bfbf347",
          "length": 36,
          "annotations": [],
          "initialBases": "GGCAG"
        },
        "source": {
          "source": "egf",
          "id": "Linker 2"
        },
        "rules": {
          "role": "structural"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-c7e3c680-b0b5-4d4a-afde-2e6a113ef746",
        "parents": [],
        "metadata": {
          "name": "p2A-Porcine teschovirus-1 ",
          "description": "Nat. Biotechnol. (2004) 22, 589–594",
          "authors": [],
          "tags": {},
          "color": "#65AAB1",
          "egfPosition": "8",
          "category": "2A-like peptide sequences ",
          "sub-category": "2A peptide "
        },
        "sequence": {
          "md5": "a3eee2c4d1ccfcfeff0264b998fa4bda",
          "length": 57,
          "annotations": [],
          "initialBases": "GCTAC"
        },
        "source": {
          "source": "egf",
          "id": "p2A-Porcine teschovirus-1 "
        },
        "rules": {
          "role": null
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-5d171e17-657d-4907-869c-d591492d1130",
        "parents": [],
        "metadata": {
          "name": "Ct-KDEL",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#8EC78D",
          "egfPosition": "8a",
          "category": "Peptide Tags",
          "sub-category": "Protein Tags for Subcellular targeting"
        },
        "sequence": {
          "md5": "44468f0e7cd2fb33e2b8d9c87ea51b8d",
          "length": 50,
          "annotations": [],
          "initialBases": "AAGGA"
        },
        "source": {
          "source": "egf",
          "id": "Ct-KDEL"
        },
        "rules": {
          "role": "tag"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-ad036492-2e49-4256-85d7-3900c31118ec",
        "parents": [],
        "metadata": {
          "name": "IRES2",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#53B15F",
          "egfPosition": "8b",
          "category": "IRES (Internal Ribosome Entry Sequence)",
          "sub-category": ""
        },
        "sequence": {
          "md5": "e9cb8a2dd3ced2f2e01982f714fe7a34",
          "length": 614,
          "annotations": [],
          "initialBases": "CGCTC"
        },
        "source": {
          "source": "egf",
          "id": "IRES2"
        },
        "rules": {
          "role": "rbs"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-60122017-5281-4727-820a-9be842b6632f",
        "parents": [],
        "metadata": {
          "name": "BSDR",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#C5C4C1",
          "egfPosition": "9",
          "category": "Selection Markers",
          "sub-category": "Antibiotic Resistance"
        },
        "sequence": {
          "md5": "ebee7a29a7e98b7e733affc4e77ec5e4",
          "length": 401,
          "annotations": [],
          "initialBases": "CCGCC"
        },
        "source": {
          "source": "egf",
          "id": "BSDR"
        },
        "rules": {
          "role": "selection"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-c9eba448-079d-4804-8cfa-67f28b3b7795",
        "parents": [],
        "metadata": {
          "name": "PuroR",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#A5A6A2",
          "egfPosition": "9",
          "category": "Selection Markers",
          "sub-category": "Antibiotic Resistance"
        },
        "sequence": {
          "md5": "26d9eb092fc78588d0189fa297897e02",
          "length": 602,
          "annotations": [],
          "initialBases": "CCACC"
        },
        "source": {
          "source": "egf",
          "id": "PuroR"
        },
        "rules": {
          "role": "selection"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-f28ebdbf-09a3-4fdb-8bf7-56b131d670ee",
        "parents": [],
        "metadata": {
          "name": "NeoR",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#e7aaa9",
          "egfPosition": "9",
          "category": "Selection Markers",
          "sub-category": "Antibiotic Resistance"
        },
        "sequence": {
          "md5": "a635613fd2f1951cddbc136ddd365380",
          "length": 815,
          "annotations": [],
          "initialBases": "CCAGC"
        },
        "source": {
          "source": "egf",
          "id": "NeoR"
        },
        "rules": {
          "role": "selection"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-6833b2ff-bf97-4dcc-9b9f-9fda18a20954",
        "parents": [],
        "metadata": {
          "name": "DmrC",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#D28482",
          "egfPosition": "9",
          "category": "Dimerization domain",
          "sub-category": "Chemically induced dimerization domain"
        },
        "sequence": {
          "md5": "240db578bc90c118b9e246502cb8acd6",
          "length": 288,
          "annotations": [],
          "initialBases": "CCATC"
        },
        "source": {
          "source": "egf",
          "id": "DmrC"
        },
        "rules": {
          "role": "structural"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-e7b309ee-2a2e-45ad-97b5-e39e20edef84",
        "parents": [],
        "metadata": {
          "name": "Fyrefly Luciferase ",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#E9BA9b",
          "egfPosition": "9",
          "category": "Bioluminescent Reporters",
          "sub-category": "Luciferases"
        },
        "sequence": {
          "md5": "491416c64265a27ae2105441c1285f8c",
          "length": 1736,
          "annotations": [],
          "initialBases": "CCGAG"
        },
        "source": {
          "source": "egf",
          "id": "Fyrefly Luciferase "
        },
        "rules": {
          "role": "reporter"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-7705a773-8c0f-4b45-b0b0-1adf79508548",
        "parents": [],
        "metadata": {
          "name": "mNeoGreen",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#efac7e",
          "egfPosition": "9",
          "category": "Fluorescent Reporter",
          "sub-category": "Green Fluorescent Reporter"
        },
        "sequence": {
          "md5": "8fbcce109859f03770c4a0f458f1fcd3",
          "length": 713,
          "annotations": [],
          "initialBases": "CCGTG"
        },
        "source": {
          "source": "egf",
          "id": "mNeoGreen"
        },
        "rules": {
          "role": "reporter"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-6a7f432e-ad93-4d5e-be1f-8a2144f80221",
        "parents": [],
        "metadata": {
          "name": "mRuby2",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#EFD79A",
          "egfPosition": "9",
          "category": "Fluorescent Reporter",
          "sub-category": "Red Fluorescent Reporter"
        },
        "sequence": {
          "md5": "53098628e8bcdc569dbd69d51aed89cc",
          "length": 716,
          "annotations": [],
          "initialBases": "CCGTG"
        },
        "source": {
          "source": "egf",
          "id": "mRuby2"
        },
        "rules": {
          "role": "reporter"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-019f51e9-be70-46f8-92e6-3009662f2f61",
        "parents": [],
        "metadata": {
          "name": "mTagBFP2",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#F1D26C",
          "egfPosition": "9",
          "category": "Fluorescent Reporter",
          "sub-category": "Blue Fluorescent Reporter"
        },
        "sequence": {
          "md5": "27980cc4eb41877d74dd1e20dbed7437",
          "length": 713,
          "annotations": [],
          "initialBases": "CCGTG"
        },
        "source": {
          "source": "egf",
          "id": "mTagBFP2"
        },
        "rules": {
          "role": "reporter"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-53c0e6c6-f594-4137-8e2b-124a42eaa130",
        "parents": [],
        "metadata": {
          "name": "a-Tubulin",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#E4E480",
          "egfPosition": "9",
          "category": "Structural proteins",
          "sub-category": "Cytoskeleton proteins"
        },
        "sequence": {
          "md5": "fdea1cf19093ae3857198691d13c2299",
          "length": 1362,
          "annotations": [],
          "initialBases": "CCGTG"
        },
        "source": {
          "source": "egf",
          "id": "a-Tubulin"
        },
        "rules": {
          "role": "structural"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-77d8aabd-ed23-48a8-9738-cb129dcfe129",
        "parents": [],
        "metadata": {
          "name": "Tet-Aptazyme",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#D3D34F",
          "egfPosition": "10",
          "category": "RNA regulatory sequences",
          "sub-category": "Chemically induced Aptazyme"
        },
        "sequence": {
          "md5": "7fdda928c1cfef4d5e2e84b7daad69a5",
          "length": 171,
          "annotations": [],
          "initialBases": "AGACA"
        },
        "source": {
          "source": "egf",
          "id": "Tet-Aptazyme"
        },
        "rules": {
          "role": "regulatory"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-dc9e683f-8d9c-434d-b644-d78d8e399313",
        "parents": [],
        "metadata": {
          "name": "SV40 polyA",
          "description": "Simian virus 40 PolyA",
          "authors": [],
          "tags": {},
          "color": "#9CC6C0",
          "egfPosition": "11",
          "category": "PolyA transcription terminators",
          "sub-category": "Virus derived polyA"
        },
        "sequence": {
          "md5": "d1a66a599fc97130a3eb0e184c1507a7",
          "length": 131,
          "annotations": [],
          "initialBases": "ACTTG"
        },
        "source": {
          "source": "egf",
          "id": "SV40 polyA"
        },
        "rules": {
          "role": "terminator"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-a3e0161e-5131-4a71-9b6c-c8dd15b3a9ae",
        "parents": [],
        "metadata": {
          "name": "SV40p",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#6DA19C",
          "egfPosition": "14",
          "category": "Promoters",
          "sub-category": "Constitutional Promoter"
        },
        "sequence": {
          "md5": "49443df9621ffbe4a19da24aabf3e7d7",
          "length": 380,
          "annotations": [],
          "initialBases": "GTGTG"
        },
        "source": {
          "source": "egf",
          "id": "SV40p"
        },
        "rules": {
          "role": "promoter"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-588f35b2-48f8-47b5-b0c0-fa4cce4138bb",
        "parents": [],
        "metadata": {
          "name": "PuroR",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#B1CED0",
          "egfPosition": "15",
          "category": "Selection Markers",
          "sub-category": "Antibiotic Resistance"
        },
        "sequence": {
          "md5": "0141b325074c7188eeb093c0a1e8d8d7",
          "length": 611,
          "annotations": [],
          "initialBases": "CCGCC"
        },
        "source": {
          "source": "egf",
          "id": "PuroR"
        },
        "rules": {
          "role": "selection"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-0437f12d-3bfe-4527-973f-1c97c66d4bfe",
        "parents": [],
        "metadata": {
          "name": "bGH polyA",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#65AAB1",
          "egfPosition": "16",
          "category": "PolyA transcription terminators",
          "sub-category": "Endogenous  derived polyA"
        },
        "sequence": {
          "md5": "d19666635d5468cf52ba1e071312731c",
          "length": 257,
          "annotations": [],
          "initialBases": "CTCTG"
        },
        "source": {
          "source": "egf",
          "id": "bGH polyA"
        },
        "rules": {
          "role": "terminator"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-780cadae-7cf0-4944-84c2-145a99408d47",
        "parents": [],
        "metadata": {
          "name": "CMVp",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#8EC78D",
          "egfPosition": "18",
          "category": "Promoters",
          "sub-category": "Constitutional Promoter"
        },
        "sequence": {
          "md5": "8f283ca5fc89f7ecdf75c83a73494dd8",
          "length": 543,
          "annotations": [],
          "initialBases": "CGTTA"
        },
        "source": {
          "source": "egf",
          "id": "CMVp"
        },
        "rules": {
          "role": "promoter"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-47a7489b-94a4-40f6-8851-f2ae825a046e",
        "parents": [],
        "metadata": {
          "name": "EF1ap",
          "description": "strong constitutive promoter derived from  endogenous promoter of human elongation factor EF-1α . EF-1 alpha is often useful in conditions where other promoters (such as CMV) have diminished activity or have been silenced (as in embryonic stem cells)",
          "authors": [],
          "tags": {},
          "color": "#53B15F",
          "egfPosition": "18",
          "category": "Promoters",
          "sub-category": "Constitutional Promoter"
        },
        "sequence": {
          "md5": "5fa85522433d4cc8a68d6b6377131bdf",
          "length": 1224,
          "annotations": [],
          "initialBases": "GGCTC"
        },
        "source": {
          "source": "egf",
          "id": "EF1ap"
        },
        "rules": {
          "role": "promoter"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-aef73c43-c694-48d2-9204-43b8e3740d2a",
        "parents": [],
        "metadata": {
          "name": "mNeoGreen",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#C5C4C1",
          "egfPosition": "19",
          "category": "Fluorescent Reporter",
          "sub-category": "Green Fluorescent Reporter"
        },
        "sequence": {
          "md5": "398aebce8bfea8e72cbfe595aab48e14",
          "length": 716,
          "annotations": [],
          "initialBases": "CCGCC"
        },
        "source": {
          "source": "egf",
          "id": "mNeoGreen"
        },
        "rules": {
          "role": "reporter"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-b569f4e0-645e-4c19-92eb-1877079e1a32",
        "parents": [],
        "metadata": {
          "name": "mRuby2",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#A5A6A2",
          "egfPosition": "19",
          "category": "Fluorescent Reporter",
          "sub-category": "Red Fluorescent Reporter"
        },
        "sequence": {
          "md5": "575ccb3a58390b429ae42854a4d23560",
          "length": 719,
          "annotations": [],
          "initialBases": "CCGCC"
        },
        "source": {
          "source": "egf",
          "id": "mRuby2"
        },
        "rules": {
          "role": "reporter"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-bd877d95-15e5-41ce-a9c2-424aaa0b647a",
        "parents": [],
        "metadata": {
          "name": "mTagBFP2",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#e7aaa9",
          "egfPosition": "19",
          "category": "Fluorescent Reporter",
          "sub-category": "Blue Fluorescent Reporter"
        },
        "sequence": {
          "md5": "49f8cc602ebbe8b58d35d31c6e9238c6",
          "length": 719,
          "annotations": [],
          "initialBases": "CCGCC"
        },
        "source": {
          "source": "egf",
          "id": "mTagBFP2"
        },
        "rules": {
          "role": "reporter"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-2a40ebcf-ced7-46a5-990d-6dd8d4158d55",
        "parents": [],
        "metadata": {
          "name": "Tet-ON-3G",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#D28482",
          "egfPosition": "19",
          "category": "Transcription Factor ",
          "sub-category": "Inducible transcriptional activator"
        },
        "sequence": {
          "md5": "bf9ed9f9934d323f9e23e5e416c82958",
          "length": 761,
          "annotations": [],
          "initialBases": "CCGCC"
        },
        "source": {
          "source": "egf",
          "id": "Tet-ON-3G"
        },
        "rules": {
          "role": null
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-52555064-625f-4a63-9ed7-a7473806bfc6",
        "parents": [],
        "metadata": {
          "name": "Ct-minute-NES",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#E9BA9b",
          "egfPosition": "20",
          "category": "Peptide Tags",
          "sub-category": "Protein Tags for Subcellular targeting"
        },
        "sequence": {
          "md5": "34e0cbb8dea9528d05e73b6d0f6a0d46",
          "length": 35,
          "annotations": [],
          "initialBases": "GAATG"
        },
        "source": {
          "source": "egf",
          "id": "Ct-minute-NES"
        },
        "rules": {
          "role": "tag"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-17f2450f-df40-4f70-b3c5-d3b960ec6c58",
        "parents": [],
        "metadata": {
          "name": "Ct-NES",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#efac7e",
          "egfPosition": "20",
          "category": "Peptide Tags",
          "sub-category": "Protein Tags for Subcellular targeting"
        },
        "sequence": {
          "md5": "6014a8fe371e7512fb553f58fc66358e",
          "length": 44,
          "annotations": [],
          "initialBases": "GAGCC"
        },
        "source": {
          "source": "egf",
          "id": "Ct-NES"
        },
        "rules": {
          "role": "tag"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-4968f86f-bcab-4338-93f8-941225c32ecf",
        "parents": [],
        "metadata": {
          "name": "Linker 3",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#EFD79A",
          "egfPosition": "20",
          "category": "Peptide Linker",
          "sub-category": "Flexible Peptide Linker"
        },
        "sequence": {
          "md5": "df8ff54f03f5b683888c1317951444c2",
          "length": 37,
          "annotations": [],
          "initialBases": "GAGGC"
        },
        "source": {
          "source": "egf",
          "id": "Linker 3"
        },
        "rules": {
          "role": "structural"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-c0f83175-799e-4141-b180-51d7f39b8a8b",
        "parents": [],
        "metadata": {
          "name": "p2A-Porcine teschovirus-1 ",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#F1D26C",
          "egfPosition": "20",
          "category": "2A-like peptide sequences ",
          "sub-category": "2A peptide "
        },
        "sequence": {
          "md5": "7bc1e2a20c151872fb69bc02145d48b6",
          "length": 61,
          "annotations": [],
          "initialBases": "GCGCT"
        },
        "source": {
          "source": "egf",
          "id": "p2A-Porcine teschovirus-1 "
        },
        "rules": {
          "role": null
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-923b0ae3-04ff-48c3-bcad-83cb5134e8a9",
        "parents": [],
        "metadata": {
          "name": "DmrA",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#E4E480",
          "egfPosition": "21",
          "category": "Dimerization domain",
          "sub-category": "Chemically induced dimerization domain"
        },
        "sequence": {
          "md5": "4389356649feb4316f9a0e0fd3f5c31c",
          "length": 327,
          "annotations": [],
          "initialBases": "GGAGT"
        },
        "source": {
          "source": "egf",
          "id": "DmrA"
        },
        "rules": {
          "role": "structural"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-aafdec16-f3af-44a7-9a12-97e4d787c866",
        "parents": [],
        "metadata": {
          "name": "mKate2",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#D3D34F",
          "egfPosition": "21",
          "category": "Fluorescent Reporter",
          "sub-category": "Far-red Fluorescent Reporter"
        },
        "sequence": {
          "md5": "3b0097d953e54f5430d1daf986e0da43",
          "length": 696,
          "annotations": [],
          "initialBases": "gtgag"
        },
        "source": {
          "source": "egf",
          "id": "mKate2"
        },
        "rules": {
          "role": "reporter"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-e3ad7552-11d8-4b32-9692-30b746a5df07",
        "parents": [],
        "metadata": {
          "name": "mNeoGreen",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#9CC6C0",
          "egfPosition": "21",
          "category": "Fluorescent Reporter",
          "sub-category": "Green Fluorescent Reporter"
        },
        "sequence": {
          "md5": "5fc002897bf2f590de38ee87259b53ad",
          "length": 708,
          "annotations": [],
          "initialBases": "GTGAG"
        },
        "source": {
          "source": "egf",
          "id": "mNeoGreen"
        },
        "rules": {
          "role": "reporter"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-3dbef26f-915b-4917-9e42-a41183337fdc",
        "parents": [],
        "metadata": {
          "name": "mRuby2",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#6DA19C",
          "egfPosition": "21",
          "category": "Fluorescent Reporter",
          "sub-category": "Red Fluorescent Reporter"
        },
        "sequence": {
          "md5": "cc48e2aa1d228f42d918b286d5fca6fd",
          "length": 711,
          "annotations": [],
          "initialBases": "GTGTC"
        },
        "source": {
          "source": "egf",
          "id": "mRuby2"
        },
        "rules": {
          "role": "reporter"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-ad0c0784-2850-4077-b9ec-d5a49f6062c6",
        "parents": [],
        "metadata": {
          "name": "mTagBFP2",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#B1CED0",
          "egfPosition": "21",
          "category": "Fluorescent Reporter",
          "sub-category": "Blue Fluorescent Reporter"
        },
        "sequence": {
          "md5": "50c31c00646abd4cf75fbc96a3df6255",
          "length": 711,
          "annotations": [],
          "initialBases": "GTGTC"
        },
        "source": {
          "source": "egf",
          "id": "mTagBFP2"
        },
        "rules": {
          "role": "reporter"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-09d2c83f-09d6-4219-90be-8213863e4495",
        "parents": [],
        "metadata": {
          "name": "PuroR",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#65AAB1",
          "egfPosition": "21",
          "category": "Selection Markers",
          "sub-category": "Antibiotic Resistance"
        },
        "sequence": {
          "md5": "dba93610c5a03a915216dabab29b4971",
          "length": 600,
          "annotations": [],
          "initialBases": "ACCGA"
        },
        "source": {
          "source": "egf",
          "id": "PuroR"
        },
        "rules": {
          "role": "selection"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-9c5246aa-6ba6-491b-8a02-421a79674afc",
        "parents": [],
        "metadata": {
          "name": "PGK polyA",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#8EC78D",
          "egfPosition": "22",
          "category": "PolyA transcription terminators",
          "sub-category": "Endogenous  derived polyA"
        },
        "sequence": {
          "md5": "a96b3c3932dc15416811d2d67e0bb9a3",
          "length": 229,
          "annotations": [],
          "initialBases": "CCTTG"
        },
        "source": {
          "source": "egf",
          "id": "PGK polyA"
        },
        "rules": {
          "role": "terminator"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-d95ff418-ebb8-457b-9fd2-b860135ceecf",
        "parents": [],
        "metadata": {
          "name": "Insulator_FB",
          "description": "FII/BEAD-A (FB) element. (STEMCELLS2008;26:3257–3266 ). FII/BEAD-A (FB) contains the minimal enhancer-blocking components of the chicken b-globin 5'HS4 insulator and a homologous region from the human T-cell receptor  BEAD-1 insulator ",
          "authors": [],
          "tags": {},
          "color": "#53B15F",
          "egfPosition": "23",
          "category": "Insulators",
          "sub-category": "endogenous elements"
        },
        "sequence": {
          "md5": "29c089067c1d3baf030143274e69d2d1",
          "length": 141,
          "annotations": [],
          "initialBases": "GGCCG"
        },
        "source": {
          "source": "egf",
          "id": "Insulator_FB"
        },
        "rules": {
          "role": "insulator"
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-313f4452-d432-4637-bfd8-466aca35fc32",
        "parents": [],
        "metadata": {
          "name": "3'HA-hAAVS1",
          "description": "Homology arm for targeting of hAVVS1 locus",
          "authors": [],
          "tags": {},
          "color": "#C5C4C1",
          "egfPosition": "24",
          "category": "Homology Arm",
          "sub-category": "Human genomic locus"
        },
        "sequence": {
          "md5": "c5a0682845deab5c47253dc11e2db50f",
          "length": 633,
          "annotations": [],
          "initialBases": "CCGCC"
        },
        "source": {
          "source": "egf",
          "id": "3'HA-hAAVS1"
        },
        "rules": {
          "role": null
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-33431428-76b7-400d-9934-66a21fb2fcdd",
        "parents": [],
        "metadata": {
          "name": "3'-ITR-PB",
          "description": "transposon-specific inverted terminal repeat sequences (ITRs) recognized by PiggyBac transposase",
          "authors": [],
          "tags": {},
          "color": "#A5A6A2",
          "egfPosition": "24",
          "category": "inverted terminal repeat sequences (ITRs)",
          "sub-category": "transposon-specific inverted terminal repeat sequences (ITRs)"
        },
        "sequence": {
          "md5": "427fa75b9c85fc7f41c52f87f990c979",
          "length": 247,
          "annotations": [],
          "initialBases": "TGCAT"
        },
        "source": {
          "source": "egf",
          "id": "3'-ITR-PB"
        },
        "rules": {
          "role": null
        },
        "components": [],
        "options": [],
        "notes": {}
      },
      {
        "id": "block-df52d709-0ed3-4fe4-a5cd-bd4e181c34c3",
        "parents": [],
        "metadata": {
          "name": "SV40-ORI",
          "description": "",
          "authors": [],
          "tags": {},
          "color": "#e7aaa9",
          "egfPosition": "25",
          "category": "Episomal elements",
          "sub-category": "Viral"
        },
        "sequence": {
          "md5": "e1f70fd6d6a612271136c281c231f6cf",
          "length": 136,
          "annotations": [],
          "initialBases": "ATCCC"
        },
        "source": {
          "source": "egf",
          "id": "SV40-ORI"
        },
        "rules": {
          "role": null
        },
        "components": [],
        "options": [],
        "notes": {}
      }
    ].reduce((prev, obj) => {
      prev[obj.id] = obj;
      return prev;
    }, {});

/**
 * layout and scene graph manager for the construct viewer
 */
export default class Layout {

  constructor(constructViewer, sceneGraph, options) {
    // we need a construct viewer, a scene graph, a construct and options
    this.constructViewer = constructViewer;
    this.sceneGraph = sceneGraph;
    // extend this with options
    Object.assign(this, {
      baseColor: 'white',
      showHeader: true,
      insetX: 0,
      insetY: 0,
      initialRowXLimit: -Infinity,
      rootLayout: true,
    }, options);

    // prep data structures for layout`
    this.rows = [];
    this.nodes2parts = {};
    this.parts2nodes = {};
    this.partUsage = {};
    this.nestedLayouts = {};
    this.connectors = {};
    this.listNodes = {};

    // this reference is incremented for each update. Blocks, lines are given
    // the latest reference whenever they are updated. Any elements without
    // the latest reference at the end of an update are no longer needed and
    // will be removed.
    this.updateReference = 0;
  }

  /**
   * size the scene graph to just accomodate all the nodes that are present.
   * This is only performed for the root layout ( nested constructs should not
   * perform this operation, as per the rootLayout property )
   * @return {[type]} [description]
   */
  autoSizeSceneGraph() {
    if (this.rootLayout) {
      // start with a box at 0,0, to ensure we capture the top left of the view
      // and ensure we at least use the available
      const aabb = this.getBlocksAABB();
      this.sceneGraph.width = Math.max(aabb.right, kT.minWidth);
      this.sceneGraph.height = Math.max(aabb.bottom, kT.minHeight) + kT.bottomPad;
      this.sceneGraph.updateSize();
    }
  }
  /**
   * return the AABB for our block nodes only, including any nested layouts
   */
  getBlocksAABB() {
    // always include top left and available width to anchor the bounds
    let aabb = new Box2D(0, 0, this.sceneGraph.availableWidth, 0);
    // we should only autosize the nodes representing parts
    objectValues(this.parts2nodes).forEach(node => {
      aabb = aabb.union(node.getAABB());
      // add in any part list items for this block
      const blockId = this.elementFromNode(node);
      objectValues(this.listNodes[blockId]).forEach(node => {
        aabb = aabb.union(node.getAABB());
      });
    });
    // add any nested constructs
    objectValues(this.nestedLayouts).forEach(layout => {
      aabb = layout.getBlocksAABB().union(aabb);
    });
    return aabb;
  }

  /**
   * setup the bi drectional mapping between nodes / elements
   */
  map(part, node) {
    this.nodes2parts[node.uuid] = part;
    this.parts2nodes[part] = node;
  }
  /**
   * flag the part as currently in use i.e. should be rendered.
   * Parts that are found to be no longer be in use are removed after rendering
   * along with associated nodes
   */
  usePart(part) {
    this.partUsage[part] = this.updateReference;
  }

  /**
   * drop any parts that don't match the current update reference
   * Also drop nodes associated with the part.
   */
  dropParts() {
    const keys = Object.keys(this.partUsage);
    keys.forEach(part => {
      if (this.partUsage[part] < this.updateReference) {
        const node = this.parts2nodes[part];
        if (node) {
          delete this.nodes2parts[node.uuid];
          delete this.parts2nodes[part];
          delete this.partUsage[part];
          node.parent.removeChild(node);
        }
        // drop any associated list items with the part.
        //this.dropPartListItems(part);
      }
    });
  }

  /**
   * create a list part for the block
   */
  listBlockFactory(blockId) {
    const block = this.blocks[blockId];
    const props = Object.assign({}, {
      dataAttribute: {name: 'nodetype', value: 'part'},
      sg: this.sceneGraph,
    }, kT.partAppearance);
    return new Role2D(props);
  }
  /**
   * create / update the list items for the block
   */
  updateListForBlock(block, pW) {
    const parentNode = this.nodeFromElement(block.id);

    block.options.forEach((blockId, index) => {
      // ensure we have a hash of list nodes for this block.
      let nodes = this.listNodes[block.id];
      if (!nodes) {
        nodes = this.listNodes[block.id] = {};
      }
      // get the block in the list
      const listBlock = this.getListBlock(blockId);

      // create node as necessary for this block
      let listNode = nodes[blockId];
      if (!listNode) {
        listNode = nodes[blockId] = this.listBlockFactory(blockId);
        parentNode.appendChild(listNode);
      }
      // update position and other visual attributes of list part
      listNode.set({
        bounds: new Box2D(0, (index + 1) * kT.blockH, pW, kT.blockH),
        text: listBlock.metadata.name,
        fill: this.fillColor(block.id),
        color: this.fontColor(block.id),
        updateReference: this.updateReference,
      });
    });
  }

  /**
   * drop any list nodes that are not up tp date with the updateReference
   */
  dropListItems() {
    // outer loop will iterate over a hash of list node each block with list items
    Object.keys(this.listNodes).forEach(blockId => {
      const nodeHash = this.listNodes[blockId];
      Object.keys(nodeHash).forEach(key => {
        const node = nodeHash[key];
        if (node.updateReference !== this.updateReference) {
          node.parent.removeChild(node);
          delete nodeHash[key];
        }
      });
    });
  }

  /**
   * return the element from the data represented by the given node uuid.
   * This searches this construct and any nested construct to find the part
   */
  elementFromNode(node) {
    let part = this.nodes2parts[node.uuid];
    if (!part) {
      const nestedKeys = Object.keys(this.nestedLayouts);
      for (let i = 0; i < nestedKeys.length && !part; i += 1) {
        part = this.nestedLayouts[nestedKeys[i]].elementFromNode(node);
      }
    }
    return part;
  }
  /**
   * reverse mapping from anything with an 'uuid' property to a node
   * Looks into nested constructs as well.
   */
  nodeFromElement(element) {
    let node = this.parts2nodes[element];
    if (!node) {
      const nestedKeys = Object.keys(this.nestedLayouts);
      for (let i = 0; i < nestedKeys.length && !node; i += 1) {
        node = this.nestedLayouts[nestedKeys[i]].nodeFromElement(element);
      }
    }
    return node;
  }
  /**
   * return an array of {block, node} objects for this layout
   * and all nested layouts.
   */
  allNodesAndBlocks() {
    let list = Object.keys(this.parts2nodes).map(block => {
      return {block, node: this.parts2nodes[block]};
    });
    Object.keys(this.nestedLayouts).forEach(key => {
      list = list.concat(this.nestedLayouts[key].allNodesAndBlocks());
    });
    return list;
  }

  /**
   * create a node, if not already created for the given piece.
   * Add to our hash for tracking
   * @param  {[type]} part          [description]
   * @param  {[type]} appearance [description]
   * @return {[type]}            [description]
   */
  partFactory(part, appearance) {
    let node = this.nodeFromElement(part);
    if (!node) {
      const props = Object.assign({}, {
        dataAttribute: {name: 'nodetype', value: 'block'},
        sg: this.sceneGraph,
      }, appearance);
      props.roleName = this.isSBOL(part) ? this.blocks[part].rules.role : null;
      node = new Role2D(props);
      this.sceneGraph.root.appendChild(node);
      this.map(part, node);
    }
    // hide/or child expand/collapse glyph
    node.set({
      hasChildren: this.hasChildren(part),
    });
    // mark part as in use
    this.usePart(part);
  }
  /**
   * return one of the meta data properties for a part.
   */
  partMeta(part, meta) {
    return this.blocks[part].metadata[meta];
  }

  /**
   * used specified color, or filler color for filler block or light gray
   */
  fillColor(part) {
    const block = this.blocks[part];
    if (block.isFiller()) return '#4B505E';
    return block.metadata.color || 'lightgray';
  }
  /**
   * filler blocks get a special color
   */
  fontColor(part) {
    const block = this.blocks[part];
    if (block.isFiller()) return '#6B6F7C';
    return '#1d222d';
  }

  /**
   * return the property within the rule part of the blocks data
   */
  partRule(part, name) {
    return this.blocks[part].rules[name];
  }

  /**
   * return true if the block appears to be an SBOL symbol
   */
  isSBOL(part) {
    return !!this.blocks[part].rules.role;
  }

  /**
   * return true if the given block has children
   */
  hasChildren(blockId) {
    const block = this.blocks[blockId];
    invariant(block, 'expect to be able to find the block');
    return block.components && block.components.length;
  }

  /**
   * return the first child of the given block or null if it has no children
   */
  firstChild(blockId) {
    const block = this.blocks[blockId];
    invariant(block, 'expect to be able to find the block');
    return block.components && block.components.length ? block.components[0] : null;
  }

  /**
   * return the two nodes that we need to graphically connect to show a connection.
   * The given block is the source block
   */
  connectionInfo(sourceBlockId) {
    const destinationBlockId = this.firstChild(sourceBlockId);
    invariant(destinationBlockId, 'expected a child if this method is called');
    return {
      sourceBlock: this.blocks[sourceBlockId],
      destinationBlock: this.blocks[destinationBlockId],
      sourceNode: this.nodeFromElement(sourceBlockId),
      destinationNode: this.nodeFromElement(destinationBlockId),
    };
  }

  /**
   * return the part ID or if metadata is available use the name property if available.
   * If the part is an SBOL symbol then use the symbol name preferentially
   */
  partName(part) {
    return this.blocks[part].getName();
  }
  /**
   * create the banner / bar for the construct ( contains the triangle )
   * @return {[type]} [description]
   */
  bannerFactory() {
    if (this.showHeader && !this.banner) {
      this.banner = new Node2D({
        sg: this.sceneGraph,
        glyph: 'construct-banner',
        bounds: new Box2D(this.insetX, this.insetY, this.sceneGraph.availableWidth - this.insetX, kT.bannerHeight),
      });
      this.sceneGraph.root.appendChild(this.banner);
    }
    if (this.banner) {
      this.banner.set({
        fill: this.baseColor,
        stroke: this.baseColor,
      });
    }
  }
  /**
   * create title as necessary
   * @param  {[type]} part [description]
   * @return {[type]}   [description]
   */
  titleFactory() {
    if (this.showHeader) {
      if (!this.titleNode) {
        // node that carries the text
        this.titleNode = new Node2D(Object.assign({
          dataAttribute: {name: 'nodetype', value: 'construct-title'},
          sg: this.sceneGraph,
        }, kT.titleAppearance));
        // add the context menu dots
        this.titleNodeDots = new Node2D({
          sg: this.sceneGraph,
          glyph: 'dots',
        });
        this.titleNode.appendChild(this.titleNodeDots);
        this.sceneGraph.root.appendChild(this.titleNode);
      }

      // update title to current position and text and width
      const text = this.construct.getName('New Construct');
      const width = this.titleNode.measureText(text).x + kT.textPad + kT.contextDotsW;

      this.titleNode.set({
        text: text,
        color: this.baseColor,
        bounds: new Box2D(this.insetX, this.insetY + kT.bannerHeight, width, kT.titleH),
      });

      // set dots to the right of the text
      this.titleNodeDots.set({
        bounds: new Box2D(width - kT.contextDotsW, (kT.titleH - kT.contextDotsH) / 2, kT.contextDotsW, kT.contextDotsH),
        visible: this.titleNode.hover,
        dotColor: this.baseColor,
      });
    }
  }
  /**
   * create the vertical bar as necessary and update its color
   */
  verticalFactory() {
    if (!this.vertical) {
      this.vertical = new Node2D(Object.assign({
        sg: this.sceneGraph,
      }, kT.verticalAppearance));
      this.sceneGraph.root.appendChild(this.vertical);
    }
    this.vertical.set({
      fill: this.baseColor,
    });
  }
  /**
   * create or recycle a row on demand. resetRows
   * should be called whenever the update starts so this method
   * can track which rows are still in play or ready to be disposed.
   * When the update is complete, call disposeRows() to get rid
   * of any unused rows
   * @return {[type]} [description]
   */
  rowFactory(bounds) {
    // re-use existing if possible
    let row = null;
    if (this.rows.length) {
      row = this.rows.shift();
    } else {
      row = new Node2D(Object.assign({
        sg: this.sceneGraph,
      }, kT.rowAppearance));
      this.sceneGraph.root.appendChild(row);
    }
    // set bounds and update to current color
    row.set({
      bounds: bounds,
      fill: this.baseColor,
    });

    // save into new rows so we know this row is in use
    this.newRows.push(row);
    return row;
  }
  /**
   * setup an array to track which rows are still being used
   */
  resetRows() {
    this.newRows = [];
  }

  /**
   * a map of the extant layout objects, so we can dispose unused ones after layout
   */
  resetNestedConstructs() {
    this.newNestedLayouts = {};
  }
  /**
   * dispose and unused rows and move newRows to rows
   */
  disposeRows() {
    // cleanup unused rows
    while (this.rows.length) {
      this.sceneGraph.root.removeChild(this.rows.pop());
    }
    this.rows = this.newRows;
    this.newRows = null;
  }

  /**
   * dispose any nested constructs no longer referenced.
   */
  disposeNestedLayouts() {
    Object.keys(this.nestedLayouts).forEach(key => {
      this.nestedLayouts[key].dispose();
    });
    this.nestedLayouts = this.newNestedLayouts;
  }
  /**
   * store layout information on our cloned copy of the data, constructing
   * display elements as required
   * @return {[type]} [description]
   */
  update(construct, blocks, currentBlocks, currentConstructId) {
    this.construct = construct;
    this.currentConstructId = currentConstructId;
    this.blocks = blocks;
    this.currentBlocks = currentBlocks;
    this.baseColor = this.construct.metadata.color;

    // perform layout and remember how much vertical was required
    const heightUsed = this.layoutWrap();

    // update connections etc after layout
    this.postLayout();

    // auto size scene after layout
    this.autoSizeSceneGraph();

    // nest layouts need to the vertical space required
    return heightUsed;
  }

  /**
   * one of several different layout algorithms
   * @return {[type]} [description]
   */
  layoutWrap() {
    return this.layout({
      xlimit: this.sceneGraph.availableWidth - this.insetX - kT.rightPad,
      condensed: false,
    });
  }
  /**
   */

  measureText(node, str) {
    return node.getPreferredSize(str);
  }
  /**
   * return the point where layout of actual blocks begins
   * @return {[type]} [description]
   */
  getInitialLayoutPoint() {
    return new Vector2D(this.insetX + kT.rowBarW, this.insetY + (this.showHeader ? kT.bannerHeight + kT.titleH + kT.rowBarH : kT.rowBarH));
  }

  /**
   * get list block from ether
   */
  getListBlock(id) {
    const item = listStore[id];
    invariant(item, 'list item not found');
    return item;
  }
  /**
   * layout, configured with various options:
   * xlimit: maximum x extent
   * @return {[type]} [description]
   */
  layout(layoutOptions) {
    // set the new reference key
    this.updateReference += 1;
    // shortcut
    const ct = this.construct;
    // construct the banner if required
    this.bannerFactory();
    // create and update title
    this.titleFactory();
    // maximum x position
    const mx = layoutOptions.xlimit;
    // reset row factory
    this.resetRows();
    // reset nested constructs
    this.resetNestedConstructs();
    // layout all the various components, constructing elements as required
    // and wrapping when a row is complete
    const initialPoint = this.getInitialLayoutPoint();
    const startX = initialPoint.x;
    let xp = startX;
    const startY = initialPoint.y;
    let yp = startY;

    // used to determine when we need a new row
    let row = null;

    // additional vertical space consumed on every row for nested constructs
    let nestedVertical = 0;

    // additional height required by the tallest list on the row
    let maxListHeight = 0;

    // width of first row is effected by parent block, so we have to track
    // which row we are on.
    let rowIndex = 0;

    // update / make all the parts
    ct.components.forEach(part => {
      // create a row bar as neccessary
      if (!row) {
        row = this.rowFactory(new Box2D(this.insetX, yp - kT.rowBarH, 0, kT.rowBarH));
      }
      // resize row bar to current row width
      const rowStart = this.insetX;
      const rowEnd = row === 0 ? Math.max(xp, this.initialRowXLimit) : xp;
      const rowWidth = rowEnd - rowStart;
      row.set({translateX: rowStart + rowWidth / 2, width: rowWidth});

      // create the node representing the part
      this.partFactory(part, kT.partAppearance);

      // get the node representing this part and the actual block from the part id.
      const node = this.nodeFromElement(part);
      const block = this.blocks[part];
      const name = this.partName(part);
      const listN = block.options ? block.options.length : 0;

      // set role part name if any
      node.set({
        roleName: this.isSBOL(part) ? block.rules.role : null,
      });

      // measure element text or used condensed spacing
      let td = this.measureText(node, name);

      // if position would exceed x limit then wrap
      if (xp + td.x > mx) {
        xp = startX;
        yp += kT.rowH + nestedVertical + maxListHeight;
        nestedVertical = 0;
        maxListHeight = 0;
        row = this.rowFactory(new Box2D(xp, yp - kT.rowBarH, 0, kT.rowBarH));
        rowIndex += 1;
      }

      // measure the max required width of any list blocks
      block.options.forEach(blockId => {
        td.x = Math.max(td.x, this.measureText(node, this.getListBlock(blockId).metadata.name).x);
      });

      // update maxListHeight based on how many list items this block has
      maxListHeight = Math.max(maxListHeight, listN * kT.blockH);
      invariant(isFinite(maxListHeight) && maxListHeight >= 0, 'expected a valid number');

      // update part, including its text and color and with height to accomodate list items
      node.set({
        bounds: new Box2D(xp, yp, td.x, kT.blockH),
        text: name,
        fill: this.fillColor(part),
        color: this.fontColor(part),
      });

      // update any list parts for this blocks
      this.updateListForBlock(block, td.x);

      // render children ( nested constructs )
      if (this.hasChildren(part) && node.showChildren) {
        // establish the position
        const nestedX = this.insetX + kT.nestedInsetX;
        const nestedY = yp + nestedVertical + kT.blockH + kT.nestedInsetY;
        // get or create the layout object for this nested construct
        let nestedLayout = this.nestedLayouts[part];
        if (!nestedLayout) {
          nestedLayout = this.nestedLayouts[part] = new Layout(this.constructViewer, this.sceneGraph, {
            showHeader: false,
            insetX: nestedX,
            insetY: nestedY,
            rootLayout: false,
          });
        }

        // update base color of nested construct skeleton
        nestedLayout.baseColor = block.metadata.color || this.baseColor;

        // update minimum x extend of first rowH
        nestedLayout.initialRowXLimit = this.getConnectionRowLimit(part);

        // ensure layout has the latest position ( parent may have moved )
        nestedLayout.insetX = nestedX;
        nestedLayout.insetY = nestedY;

        // layout with same options as ourselves
        nestedVertical += nestedLayout.update(
          this.blocks[part],
          this.blocks,
          this.currentBlocks,
          this.currentConstructId) + kT.nestedInsetY;

        // remove from old collection so the layout won't get disposed
        // and add to the new set of layouts
        this.newNestedLayouts[part] = nestedLayout;
        delete this.nestedLayouts[part];
      }
      // set next part position
      xp += td.x;
    });

    // ensure final row has the final row width
    if (row) {
      const rowStart = this.insetX;
      const rowEnd = rowIndex === 0 ? Math.max(xp, this.initialRowXLimit) : xp;
      const rowWidth = rowEnd - rowStart;
      row.set({translateX: rowStart + rowWidth / 2, width: rowWidth});
    }

    // cleanup any dangling rows
    this.disposeRows();

    // cleanup and dangling nested constructs
    this.disposeNestedLayouts();

    // drop unused parts and nodes
    this.dropParts();

    // drop unused list items
    this.dropListItems();

    // create/show vertical bar
    this.verticalFactory();

    // position and size vertical bar
    const heightUsed = yp - startY + kT.blockH;
    this.vertical.set({
      bounds: new Box2D(this.insetX, startY, kT.rowBarW, heightUsed),
    });
    // filter the selections so that we eliminate those block we don't contain
    let selectedNodes = [];
    if (this.currentBlocks) {
      const containedBlockIds = this.currentBlocks.filter(blockId => {
        return !!this.nodeFromElement(blockId);
      });
      // get nodes for selected blocks
      selectedNodes = containedBlockIds.map(blockId => {
        return this.nodeFromElement(blockId);
      });
    }
    // apply selections to scene graph
    this.sceneGraph.ui.setSelections(selectedNodes);

    // for nesting return the height consumed by the layout
    return heightUsed + nestedVertical + kT.rowBarH;
  }

  /**
   * update connections after the layout
   */
  postLayout() {
    // update / make all the parts
    this.construct.components.forEach(part => {
      // render children ( nested constructs )
      if (this.hasChildren(part) && this.nodeFromElement(part).showChildren) {
        // update / create connection
        this.updateConnection(part);
      }
    });
    // dispose dangling connections
    this.disposeConnections();
  }

  // the connector drops from the center of the source part, so the initial
  // row limit for the child is the right edge of this point
  getConnectionRowLimit(sourcePart) {
    const cnodes = this.connectionInfo(sourcePart);
    const sourceRectangle = cnodes.sourceNode.getAABB();
    return sourceRectangle.center.x + kT.rowBarW / 2;
  }
  /**
   * update / create the connection between the part which must be the
   * parent of a nested construct.
   */
  updateConnection(part) {
    const cnodes = this.connectionInfo(part);
    // the source and destination node id's are used to as the cache key for the connectors
    const key = `${cnodes.sourceBlock.id}-${cnodes.destinationBlock.id}`;
    // get or create connection line
    let connector = this.connectors[key];
    if (!connector) {
      const line = new LineNode2D({
        line: new Line2D(new Vector2D(), new Vector2D()),
        strokeWidth: kT.rowBarW,
        sg: this.sceneGraph,
        parent: this.sceneGraph.root,
        dataAttribute: {name: 'connection', value: cnodes.sourceBlock.id},
      });
      connector = {line};
      this.connectors[key] = connector;
    }
    // update connector position
    const sourceRectangle = cnodes.sourceNode.getAABB();
    const destinationRectangle = cnodes.destinationNode.getAABB();
    connector.line.set({
      stroke: this.partMeta(cnodes.sourceBlock.id, 'color'),
      line: new Line2D(sourceRectangle.center, new Vector2D(sourceRectangle.center.x, destinationRectangle.y)),
    });
    // ensure the connectors are always behind the blocks
    connector.line.sendToBack();

    // update its reference
    connector.updateReference = this.updateReference;
  }

  /**
   * remove any connections that are no longer in use
   */
  disposeConnections() {
    Object.keys(this.connectors).forEach(key => {
      const connector = this.connectors[key];
      if (connector.updateReference !== this.updateReference) {
        this.removeNode(connector.line);
        delete this.connectors[key];
      }
    });
  }

  /**
   * remove any nodes we have created from the scenegraph. Recursively remove
   * the nodes of nested constructs as well
   */
  dispose() {
    invariant(!this.disposed, 'Layout already disposed');
    this.disposed = true;
    this.removeNode(this.banner);
    this.removeNode(this.titleNode);
    this.removeNode(this.vertical);
    this.rows.forEach( node => {
      this.removeNode(node);
    });
    Object.keys(this.parts2nodes).forEach(part => {
      this.removeNode(this.parts2nodes[part]);
    });
    Object.keys(this.connectors).forEach(key => {
      this.removeNode(this.connectors[key].line);
    });
    this.disposeNestedLayouts();
  }

  /**
   * remove a node
   */
  removeNode(node) {
    if (node && node.parent) {
      node.parent.removeChild(node);
    }
  }

}
