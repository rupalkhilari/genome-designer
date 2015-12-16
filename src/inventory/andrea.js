import merge from 'lodash.merge';
import BlockSchema from '../schemas/Block';

/* eslint-disable quotes */

const parts = [
  {
    metadata: {
      name: "5'arm-hAAVS1",
      description: "",
    },
    rules: {
      sbol: null,
    },
    sequence: "andrea/3699b698-b571-4e02-b316-449be3100ea0",
    tags: {
      position: "1",
      flanks: "TAGG-ATGG",
    },
    id: "3699b698-b571-4e02-b316-449be3100ea0",
  },
  {
    metadata: {
      name: "3'arm-hAAVS1",
      description: "",
    },
    rules: {
      sbol: null,
    },
    sequence: "andrea/6f19d954-9bb5-4bad-81c2-160192dcf3b6",
    tags: {
      position: "24",
      flanks: "CACG-ACTG",
    },
    id: "6f19d954-9bb5-4bad-81c2-160192dcf3b6",
  },
  {
    metadata: {
      name: "Insulator_FB",
      description: "",
    },
    rules: {
      sbol: "insulator",
    },
    sequence: "andrea/946728f7-56ea-4de7-a254-e98cbbcfed00",
    tags: {
      position: "2",
      flanks: "ATGG-GACT",
    },
    id: "946728f7-56ea-4de7-a254-e98cbbcfed00",
  },
  {
    metadata: {
      name: "Insulator_FB",
      description: "",
    },
    rules: {
      sbol: "insulator",
    },
    sequence: "andrea/4d291ac3-93b0-4446-8944-ed10295a50f3",
    tags: {
      position: "23",
      flanks: "CGAA-CACG",
    },
    id: "4d291ac3-93b0-4446-8944-ed10295a50f3",
  },
  {
    metadata: {
      name: "attB",
      description: "",
    },
    rules: {
      sbol: "insulator",
    },
    sequence: "andrea/39481d3b-a332-473a-a08e-16c107322b21",
    tags: {
      position: "2",
      flanks: "ATGG-GACT",
    },
    id: "39481d3b-a332-473a-a08e-16c107322b21",
  },
  {
    metadata: {
      name: "attP",
      description: "",
    },
    rules: {
      sbol: "insulator",
    },
    sequence: "andrea/00c96f0f-7217-430c-b019-c2f00c691d04",
    tags: {
      position: "2",
      flanks: "ATGG-GACT",
    },
    id: "00c96f0f-7217-430c-b019-c2f00c691d04",
  },
  {
    metadata: {
      name: "CAGp",
      description: "constitutive promoter",
    },
    rules: {
      sbol: "promoter",
    },
    sequence: "andrea/8ad0e972-8d51-48e9-96a2-a126bacd6127",
    tags: {
      position: "3",
      flanks: "GACT-GGAC",
    },
    id: "8ad0e972-8d51-48e9-96a2-a126bacd6127",
  },
  {
    metadata: {
      name: "SV40p",
      description: "constitutive promoter",
    },
    rules: {
      sbol: "promoter",
    },
    sequence: "andrea/1eb0b8f2-8218-43c7-becf-694b23077ed6",
    tags: {
      position: "14",
      flanks: "CTAC-GCAA",
    },
    id: "1eb0b8f2-8218-43c7-becf-694b23077ed6",
  },
  {
    metadata: {
      name: "CMVp",
      description: "constitutive promoter",
    },
    rules: {
      sbol: "promoter",
    },
    sequence: "andrea/70eb52ca-5324-4caf-a5ac-7dbd62195255",
    tags: {
      position: "18",
      flanks: "CGGT-GTGC",
    },
    id: "70eb52ca-5324-4caf-a5ac-7dbd62195255",
  },
  {
    metadata: {
      name: "EF1ap",
      description: "constitutive promoter",
    },
    rules: {
      sbol: "promoter",
    },
    sequence: "andrea/56aa560a-fb74-40f9-88bb-6fd87402ce25",
    tags: {
      position: "18",
      flanks: "CGGT-GTGC",
    },
    id: "56aa560a-fb74-40f9-88bb-6fd87402ce25",
  },
  {
    metadata: {
      name: "TRES3Gp",
      description: "inducible promoter",
    },
    rules: {
      sbol: "promoter",
    },
    sequence: "andrea/8203f39f-d750-4d58-ba2a-452acdae1a85",
    tags: {
      position: "3",
      flanks: "GACT-GGAC",
    },
    id: "8203f39f-d750-4d58-ba2a-452acdae1a85",
  },
  {
    metadata: {
      name: "CMVp-Tet",
      description: "repressible promoter",
    },
    rules: {
      sbol: "promoter",
    },
    sequence: "andrea/510135fe-e1e3-4e6b-8291-c9acdaf4822a",
    tags: {
      position: "3",
      flanks: "GACT-GGAC",
    },
    id: "510135fe-e1e3-4e6b-8291-c9acdaf4822a",
  },
  {
    metadata: {
      name: "Chimaric intron",
      description: "introns",
    },
    rules: {
      sbol: "rnaStability",
    },
    sequence: "andrea/97b5abee-1bde-4570-bcea-b648593d854f",
    tags: {
      position: "4",
      flanks: "GGAC-TCCG",
    },
    id: "97b5abee-1bde-4570-bcea-b648593d854f",
  },
  {
    metadata: {
      name: "SV40 intron",
      description: "introns",
    },
    rules: {
      sbol: "rnaStability",
    },
    sequence: "andrea/483fa0fd-9141-4926-8f0e-18e0aa74831f",
    tags: {
      position: "4",
      flanks: "GGAC-TCCG",
    },
    id: "483fa0fd-9141-4926-8f0e-18e0aa74831f",
  },
  {
    metadata: {
      name: "UTR-5’",
      description: "",
    },
    rules: {
      sbol: null,
    },
    sequence: "andrea/2f663c8d-7cbb-4d90-83ba-eee792340f92",
    tags: {
      position: "5",
      flanks: "TCCG-CCAG",
    },
    id: "2f663c8d-7cbb-4d90-83ba-eee792340f92",
  },
  {
    metadata: {
      name: "Kozak-ATG",
      description: "N-terminal Tag",
    },
    rules: {
      sbol: null,
    },
    sequence: "andrea/22a5fd32-2b6e-4301-a32c-d0e3a718bde5",
    tags: {
      position: "6",
      flanks: "CCAG-CAGC",
    },
    id: "22a5fd32-2b6e-4301-a32c-d0e3a718bde5",
  },
  {
    metadata: {
      name: "Kozak-ATG-IgKL",
      description: "N-terminal Tag",
    },
    rules: {
      sbol: null,
    },
    sequence: "andrea/bb36711d-d62d-42f1-8d32-3aad7f3a34d8",
    tags: {
      position: "6",
      flanks: "CCAG-CAGC",
    },
    id: "bb36711d-d62d-42f1-8d32-3aad7f3a34d8",
  },
  {
    metadata: {
      name: "Kozak-ATG-MLS",
      description: "N-terminal Tag",
    },
    rules: {
      sbol: null,
    },
    sequence: "andrea/fa57ebb1-db51-4969-8fdb-d37ef3c77180",
    tags: {
      position: "6",
      flanks: "CCAG-CAGC",
    },
    id: "fa57ebb1-db51-4969-8fdb-d37ef3c77180",
  },
  {
    metadata: {
      name: "Kozak-ATG-NLS",
      description: "N-terminal Tag",
    },
    rules: {
      sbol: null,
    },
    sequence: "andrea/49aa354e-5a4f-4be0-866c-80058b6df104",
    tags: {
      position: "6",
      flanks: "CCAG-CAGC",
    },
    id: "49aa354e-5a4f-4be0-866c-80058b6df104",
  },
  {
    metadata: {
      name: "Kozak-ATG-Palm",
      description: "N-terminal Tag",
    },
    rules: {
      sbol: null,
    },
    sequence: "andrea/d56dd515-2257-42b6-bbe1-0d5f2bd797f5",
    tags: {
      position: "6",
      flanks: "CCAG-CAGC",
    },
    id: "d56dd515-2257-42b6-bbe1-0d5f2bd797f5",
  },
  {
    metadata: {
      name: "Kozak-ATG-BoxC",
      description: "N-terminal Tag",
    },
    rules: {
      sbol: null,
    },
    sequence: "andrea/7891b07c-163b-429c-8401-5e90f52dad7e",
    tags: {
      position: "6",
      flanks: "CCAG-CAGC",
    },
    id: "7891b07c-163b-429c-8401-5e90f52dad7e",
  },
  {
    metadata: {
      name: "C-KDEL",
      description: "C-terminal Tag",
    },
    rules: {
      sbol: null,
    },
    sequence: "andrea/acf519a1-5ed7-4811-90b5-ac73af83f6e6",
    tags: {
      position: "8a",
      flanks: "AGGC-ATCC",
    },
    id: "acf519a1-5ed7-4811-90b5-ac73af83f6e6",
  },
  {
    metadata: {
      name: "C-NES",
      description: "C-terminal Tag",
    },
    rules: {
      sbol: null,
    },
    sequence: "andrea/ccce1b06-8f6a-4570-bcb7-c862dc321f2a",
    tags: {
      position: "20-21",
      flanks: "AGCG-GTTG",
    },
    id: "ccce1b06-8f6a-4570-bcb7-c862dc321f2a",
  },
  {
    metadata: {
      name: "mNeonGreen",
      description: "fluorescent reporter",
    },
    rules: {
      sbol: "cds",
    },
    sequence: "andrea/c5c3b2e5-e4bd-4bcd-9ad2-1f39335d97a1",
    tags: {
      position: "7",
      flanks: "CAGC-AGGC",
    },
    id: "c5c3b2e5-e4bd-4bcd-9ad2-1f39335d97a1",
  },
  {
    metadata: {
      name: "mRuby2",
      description: "fluorescent reporter",
    },
    rules: {
      sbol: "cds",
    },
    sequence: "andrea/1edf18d8-e962-4643-9996-981be9538b78",
    tags: {
      position: "7",
      flanks: "CAGC-AGGC",
    },
    id: "1edf18d8-e962-4643-9996-981be9538b78",
  },
  {
    metadata: {
      name: "mTagBFP2",
      description: "fluorescent reporter",
    },
    rules: {
      sbol: "cds",
    },
    sequence: "andrea/adc07c78-8391-4e59-8ac9-43f3c6e2ef13",
    tags: {
      position: "7",
      flanks: "CAGC-AGGC",
    },
    id: "adc07c78-8391-4e59-8ac9-43f3c6e2ef13",
  },
  {
    metadata: {
      name: "mNeonGreen",
      description: "fluorescent reporter",
    },
    rules: {
      sbol: "cds",
    },
    sequence: "andrea/9e0de678-ccd1-45c1-a0a9-a3b14d639ae2",
    tags: {
      position: "9",
      flanks: "GCGT-TGCT",
    },
    id: "9e0de678-ccd1-45c1-a0a9-a3b14d639ae2",
  },
  {
    metadata: {
      name: "mRuby2",
      description: "fluorescent reporter",
    },
    rules: {
      sbol: "cds",
    },
    sequence: "andrea/8fc2fee4-1f48-4840-ad5f-79d28d1bffa1",
    tags: {
      position: "9",
      flanks: "GCGT-TGCT",
    },
    id: "8fc2fee4-1f48-4840-ad5f-79d28d1bffa1",
  },
  {
    metadata: {
      name: "mTagBFP2",
      description: "fluorescent reporter",
    },
    rules: {
      sbol: "cds",
    },
    sequence: "andrea/32a4df46-cd6c-4c8a-945c-e4083a608492",
    tags: {
      position: "9",
      flanks: "GCGT-TGCT",
    },
    id: "32a4df46-cd6c-4c8a-945c-e4083a608492",
  },
  {
    metadata: {
      name: "mNeonGreen",
      description: "fluorescent reporter",
    },
    rules: {
      sbol: "cds",
    },
    sequence: "andrea/afc92218-9f0a-4835-a559-fe0495064861",
    tags: {
      position: "19",
      flanks: "GTGC-AGCG",
    },
    id: "afc92218-9f0a-4835-a559-fe0495064861",
  },
  {
    metadata: {
      name: "mRuby2",
      description: "fluorescent reporter",
    },
    rules: {
      sbol: "cds",
    },
    sequence: "andrea/ec1118cc-147c-435c-a9f1-92c926ddcead",
    tags: {
      position: "19",
      flanks: "GTGC-AGCG",
    },
    id: "ec1118cc-147c-435c-a9f1-92c926ddcead",
  },
  {
    metadata: {
      name: "mTagBFP2",
      description: "fluorescent reporter",
    },
    rules: {
      sbol: "cds",
    },
    sequence: "andrea/72b6f3ea-f0a9-47c8-a0a8-03a08344cd18",
    tags: {
      position: "19",
      flanks: "GTGC-AGCG",
    },
    id: "72b6f3ea-f0a9-47c8-a0a8-03a08344cd18",
  },
  {
    metadata: {
      name: "Tet-ON-3G",
      description: "transcriptional activator",
    },
    rules: {
      sbol: "cds",
    },
    sequence: "andrea/4ac5d78b-ad39-4c0d-ac3d-5316b100589d",
    tags: {
      position: "19",
      flanks: "GTGC-AGCG",
    },
    id: "4ac5d78b-ad39-4c0d-ac3d-5316b100589d",
  },
  {
    metadata: {
      name: "L7Ae",
      description: "translational repressor",
    },
    rules: {
      sbol: "cds",
    },
    sequence: "andrea/e01d6c60-496e-438d-980a-857b6d0bab1a",
    tags: {
      position: "7",
      flanks: "CAGC-AGGC",
    },
    id: "e01d6c60-496e-438d-980a-857b6d0bab1a",
  },
  {
    metadata: {
      name: "Tubulin",
      description: "",
    },
    rules: {
      sbol: "cds",
    },
    sequence: "andrea/14bbec9a-6126-414b-ab63-d21c1bdc6f7c",
    tags: {
      position: "9",
      flanks: "GCGT-TGCT",
    },
    id: "14bbec9a-6126-414b-ab63-d21c1bdc6f7c",
  },
  {
    metadata: {
      name: "PuroR",
      description: "selection marker",
    },
    rules: {
      sbol: "cds",
    },
    sequence: "andrea/6d8febae-9b16-4c63-9949-11a3c326fada",
    tags: {
      position: "9",
      flanks: "GCGT-TGCT",
    },
    id: "6d8febae-9b16-4c63-9949-11a3c326fada",
  },
  {
    metadata: {
      name: "PuroR",
      description: "selection marker",
    },
    rules: {
      sbol: "cds",
    },
    sequence: "andrea/da7c669f-80e7-435e-9f24-260ca10cc395",
    tags: {
      position: "15",
      flanks: "GCAA-CCCT",
    },
    id: "da7c669f-80e7-435e-9f24-260ca10cc395",
  },
  {
    metadata: {
      name: "PuroR",
      description: "selection marker",
    },
    rules: {
      sbol: "cds",
    },
    sequence: "andrea/a7ec5d0e-c30c-42ef-bb15-30cacdf96207",
    tags: {
      position: "21",
      flanks: "TGGA-GTTG",
    },
    id: "a7ec5d0e-c30c-42ef-bb15-30cacdf96207",
  },
  {
    metadata: {
      name: "DmrC",
      description: "dimerization domain",
    },
    rules: {
      sbol: "cds",
    },
    sequence: "andrea/51baef4f-aa1c-49c6-b88f-2126ad82e25b",
    tags: {
      position: "9",
      flanks: "GCGT-TGCT",
    },
    id: "51baef4f-aa1c-49c6-b88f-2126ad82e25b",
  },
  {
    metadata: {
      name: "DmrA",
      description: "dimerization domain",
    },
    rules: {
      sbol: "cds",
    },
    sequence: "andrea/8c938562-0846-4cc7-a07f-bd3df2644196",
    tags: {
      position: "21",
      flanks: "TGGA-GTTG",
    },
    id: "8c938562-0846-4cc7-a07f-bd3df2644196",
  },
  {
    metadata: {
      name: "Recombinases",
      description: "",
    },
    rules: {
      sbol: "cds",
    },
    sequence: "andrea/bb86088c-1ea6-401d-805e-cdca1a8b3dec",
    tags: {
      position: "7",
      flanks: "CAGC-AGGC",
    },
    id: "bb86088c-1ea6-401d-805e-cdca1a8b3dec",
  },
  {
    metadata: {
      name: "p2A",
      description: "",
    },
    rules: {
      sbol: null,
    },
    sequence: "andrea/87acbec7-26b1-40fc-9d5f-f2c7164cd56c",
    tags: {
      position: "8",
      flanks: "AGGC-GCGT",
    },
    id: "87acbec7-26b1-40fc-9d5f-f2c7164cd56c",
  },
  {
    metadata: {
      name: "p2A",
      description: "",
    },
    rules: {
      sbol: null,
    },
    sequence: "andrea/9e085e2e-4afa-42cd-855f-94e1de6a27a2",
    tags: {
      position: "20",
      flanks: "AGCG-TGGA",
    },
    id: "9e085e2e-4afa-42cd-855f-94e1de6a27a2",
  },
  {
    metadata: {
      name: "Linker-1",
      description: "Flexible peptide Linker",
    },
    rules: {
      sbol: null,
    },
    sequence: "andrea/50908c51-7a25-4eec-aab3-826e651e5d04",
    tags: {
      position: "8",
      flanks: "AGGC-GCGT",
    },
    id: "50908c51-7a25-4eec-aab3-826e651e5d04",
  },
  {
    metadata: {
      name: "Linker-2",
      description: "Flexible peptide Linker",
    },
    rules: {
      sbol: null,
    },
    sequence: "andrea/2bb633ba-26ee-410d-b610-a11297e9cf61",
    tags: {
      position: "8",
      flanks: "AGGC-GCGT",
    },
    id: "2bb633ba-26ee-410d-b610-a11297e9cf61",
  },
  {
    metadata: {
      name: "Linker-3",
      description: "Flexible peptide Linker",
    },
    rules: {
      sbol: null,
    },
    sequence: "andrea/a974dcfe-8b34-4ba6-b7d2-16e390b69c45",
    tags: {
      position: "8",
      flanks: "AGGC-GCGT",
    },
    id: "a974dcfe-8b34-4ba6-b7d2-16e390b69c45",
  },
  {
    metadata: {
      name: "IRES2",
      description: "",
    },
    rules: {
      sbol: null,
    },
    sequence: "andrea/4c2c4eea-5b01-4994-b9ef-55c9cc1e2110",
    tags: {
      position: "8b",
      flanks: "ATCC-GCGT",
    },
    id: "4c2c4eea-5b01-4994-b9ef-55c9cc1e2110",
  },
  {
    metadata: {
      name: "Tet-Aptazyme",
      description: "",
    },
    rules: {
      sbol: null,
    },
    sequence: "andrea/54edc24e-ad6d-40c8-9bbb-6903086de9ca",
    tags: {
      position: "10",
      flanks: "TGCT-GGTA",
    },
    id: "54edc24e-ad6d-40c8-9bbb-6903086de9ca",
  },
  {
    metadata: {
      name: "SV40-polyA",
      description: "",
    },
    rules: {
      sbol: "terminator",
    },
    sequence: "andrea/3e9eead5-e05f-4f7c-bf10-d089ed56a8fa",
    tags: {
      position: "11",
      flanks: "GGTA-CGTC",
    },
    id: "3e9eead5-e05f-4f7c-bf10-d089ed56a8fa",
  },
  {
    metadata: {
      name: "bGH-polyA",
      description: "",
    },
    rules: {
      sbol: "terminator",
    },
    sequence: "andrea/a3529a1c-ecf9-49cb-bfcc-d5b63813c31e",
    tags: {
      position: "16",
      flanks: "CCCT-GCTC",
    },
    id: "a3529a1c-ecf9-49cb-bfcc-d5b63813c31e",
  },
  {
    metadata: {
      name: "PGK-polyA",
      description: "",
    },
    rules: {
      sbol: "terminator",
    },
    sequence: "andrea/692b3588-969d-4b89-9d52-1107c425377c",
    tags: {
      position: "22",
      flanks: "GTTG-CGAA",
    },
    id: "692b3588-969d-4b89-9d52-1107c425377c",
  },
  {
    metadata: {
      name: "SV40-ORI",
      description: "",
    },
    rules: {
      sbol: "originReplication",
    },
    sequence: "andrea/56b35617-9a76-4647-b2ac-ccd0b36c3d82",
    tags: {
      position: "25",
      flanks: "ACTG-ACGA",
    },
    id: "56b35617-9a76-4647-b2ac-ccd0b36c3d82",
  },
].map((part) => {
  return merge(
    BlockSchema.scaffold(),
    part
  );
});

export default parts;
