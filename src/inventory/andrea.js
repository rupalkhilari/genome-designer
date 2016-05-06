import merge from 'lodash.merge';
import Block from '../models/Block';
/* eslint-disable quotes */

const parts = [
  {
    id: "00c96f0f-7217-430c-b019-c2f00c691d04",
    metadata: {
      name: "attP",
      description: "",
    },
    sequence: {
      length: 60,
      md5: "4f258b0b8a3c52b34b26aa34d82b1be2",
    },
    rules: {
      sbol: "insulator",
    },
    tags: {
      position: "2",
      flanks: "ATGG-GACT",
    },
  },
  {
    id: "14bbec9a-6126-414b-ab63-d21c1bdc6f7c",
    metadata: {
      name: "Tubulin",
      description: "",
    },
    sequence: {
      length: 1370,
      md5: "cea5c653d9a9d059efc906799b83d7c2",
    },
    rules: {
      sbol: "cds",
    },
    tags: {
      position: "9",
      flanks: "GCGT-TGCT",
    },
  },
  {
    id: "1eb0b8f2-8218-43c7-becf-694b23077ed6",
    metadata: {
      name: "SV40p",
      description: "constitutive promoter",
    },
    sequence: {
      length: 388,
      md5: "3738256730833453268112b67ec2633e",
    },
    rules: {
      sbol: "promoter",
    },
    tags: {
      position: "14",
      flanks: "CTAC-GCAA",
    },
  },
  {
    id: "1edf18d8-e962-4643-9996-981be9538b78",
    metadata: {
      name: "mRuby2",
      description: "fluorescent reporter",
    },
    sequence: {
      length: 718,
      md5: "86c92af1fc161a9bf9981cdaec4cddb5",
    },
    rules: {
      sbol: "cds",
    },
    tags: {
      position: "7",
      flanks: "CAGC-AGGC",
    },
  },
  {
    id: "22a5fd32-2b6e-4301-a32c-d0e3a718bde5",
    metadata: {
      name: "Kozak-ATG",
      description: "N-terminal Tag",
    },
    sequence: {
      length: 51,
      md5: "5e2d5819ba4ed439518519a0840c90b5",
    },
    rules: {
      sbol: null,
    },
    tags: {
      position: "6",
      flanks: "CCAG-CAGC",
    },
  },
  {
    id: "2bb633ba-26ee-410d-b610-a11297e9cf61",
    metadata: {
      name: "Linker-2",
      description: "Flexible peptide Linker",
    },
    sequence: {
      length: 44,
      md5: "09455435ee55b1c03846759493b97f4b",
    },
    rules: {
      sbol: null,
    },
    tags: {
      position: "8",
      flanks: "AGGC-GCGT",
    },
  },
  {
    id: "2f663c8d-7cbb-4d90-83ba-eee792340f92",
    metadata: {
      name: "UTR-5’",
      description: "",
    },
    sequence: {
      length: 79,
      md5: "e4618f004a9e557d4a68da0bcd5548be",
    },
    rules: {
      sbol: null,
    },
    tags: {
      position: "5",
      flanks: "TCCG-CCAG",
    },
  },
  {
    id: "32a4df46-cd6c-4c8a-945c-e4083a608492",
    metadata: {
      name: "mTagBFP2",
      description: "fluorescent reporter",
    },
    sequence: {
      length: 721,
      md5: "be2263139187f27750fb3a3c36017b81",
    },
    rules: {
      sbol: "cds",
    },
    tags: {
      position: "9",
      flanks: "GCGT-TGCT",
    },
  },
  {
    id: "3699b698-b571-4e02-b316-449be3100ea0",
    metadata: {
      name: "5'arm-hAAVS1",
      description: "",
    },
    sequence: {
      length: 916,
      md5: "6cbc5808cc4f0fc0b489753f47743675",
    },
    rules: {
      sbol: null,
    },
    tags: {
      position: "1",
      flanks: "TAGG-ATGG",
    },
  },
  {
    id: "39481d3b-a332-473a-a08e-16c107322b21",
    metadata: {
      name: "attB",
      description: "",
    },
    sequence: {
      length: 46,
      md5: "66b06a6a0be6985b44d36029643f34bb",
    },
    rules: {
      sbol: "insulator",
    },
    tags: {
      position: "2",
      flanks: "ATGG-GACT",
    },
  },
  {
    id: "3e9eead5-e05f-4f7c-bf10-d089ed56a8fa",
    metadata: {
      name: "SV40-polyA",
      description: "",
    },
    sequence: {
      length: 139,
      md5: "9b4cd1a9911ef800564bf6d0c864e154",
    },
    rules: {
      sbol: "terminator",
    },
    tags: {
      position: "11",
      flanks: "GGTA-CGTC",
    },
  },
  {
    id: "483fa0fd-9141-4926-8f0e-18e0aa74831f",
    metadata: {
      name: "SV40 intron",
      description: "introns",
    },
    sequence: {
      length: 129,
      md5: "95da87f1aa57a7102d89fac8b5f5283e",
    },
    rules: {
      sbol: "rnaStability",
    },
    tags: {
      position: "4",
      flanks: "GGAC-TCCG",
    },
  },
  {
    id: "49aa354e-5a4f-4be0-866c-80058b6df104",
    metadata: {
      name: "Kozak-ATG-NLS",
      description: "N-terminal Tag",
    },
    sequence: {
      length: 42,
      md5: "3a639d1e41a86411e772629dc489bff5",
    },
    rules: {
      sbol: null,
    },
    tags: {
      position: "6",
      flanks: "CCAG-CAGC",
    },
  },
  {
    id: "4ac5d78b-ad39-4c0d-ac3d-5316b100589d",
    metadata: {
      name: "Tet-ON-3G",
      description: "transcriptional activator",
    },
    sequence: {
      length: 769,
      md5: "1096eb2200eb786a8127617b6e2b981e",
    },
    rules: {
      sbol: "cds",
    },
    tags: {
      position: "19",
      flanks: "GTGC-AGCG",
    },
  },
  {
    id: "4c2c4eea-5b01-4994-b9ef-55c9cc1e2110",
    metadata: {
      name: "IRES2",
      description: "",
    },
    sequence: {
      length: 622,
      md5: "c0b330c11d0cdcfe89990e51142061b9",
    },
    rules: {
      sbol: null,
    },
    tags: {
      position: "8b",
      flanks: "ATCC-GCGT",
    },
  },
  {
    id: "4d291ac3-93b0-4446-8944-ed10295a50f3",
    metadata: {
      name: "Insulator_FB",
      description: "",
    },
    sequence: {
      length: 149,
      md5: "f585e5f6fa811687e1cd623037e37a3b",
    },
    rules: {
      sbol: "insulator",
    },
    tags: {
      position: "23",
      flanks: "CGAA-CACG",
    },
  },
  {
    id: "50908c51-7a25-4eec-aab3-826e651e5d04",
    metadata: {
      name: "Linker-1",
      description: "Flexible peptide Linker",
    },
    sequence: {
      length: 59,
      md5: "f8c0736644172fed89a28bace2f6222a",
    },
    rules: {
      sbol: null,
    },
    tags: {
      position: "8",
      flanks: "AGGC-GCGT",
    },
  },
  {
    id: "510135fe-e1e3-4e6b-8291-c9acdaf4822a",
    metadata: {
      name: "CMVp-Tet",
      description: "repressible promoter",
    },
    sequence: {
      length: 635,
      md5: "f5fd7f5830d993627fa3f795e257e3b9",
    },
    rules: {
      sbol: "promoter",
    },
    tags: {
      position: "3",
      flanks: "GACT-GGAC",
    },
  },
  {
    id: "51baef4f-aa1c-49c6-b88f-2126ad82e25b",
    metadata: {
      name: "DmrC",
      description: "dimerization domain",
    },
    sequence: {
      length: 296,
      md5: "c02b4a60b713818aa07099ac2cfb2b75",
    },
    rules: {
      sbol: "cds",
    },
    tags: {
      position: "9",
      flanks: "GCGT-TGCT",
    },
  },
  {
    id: "54edc24e-ad6d-40c8-9bbb-6903086de9ca",
    metadata: {
      name: "Tet-Aptazyme",
      description: "",
    },
    sequence: {
      length: 179,
      md5: "281bc8734912cd7e5989833c0fe82306",
    },
    rules: {
      sbol: null,
    },
    tags: {
      position: "10",
      flanks: "TGCT-GGTA",
    },
  },
  {
    id: "56aa560a-fb74-40f9-88bb-6fd87402ce25",
    metadata: {
      name: "EF1ap",
      description: "constitutive promoter",
    },
    sequence: {
      length: 1232,
      md5: "af6e48afddb054354d26f782fe695543",
    },
    rules: {
      sbol: "promoter",
    },
    tags: {
      position: "18",
      flanks: "CGGT-GTGC",
    },
  },
  {
    id: "56b35617-9a76-4647-b2ac-ccd0b36c3d82",
    metadata: {
      name: "SV40-ORI",
      description: "",
    },
    sequence: {
      length: 144,
      md5: "a7a976597b46fabbeec4a9c5659739d3",
    },
    rules: {
      sbol: "originReplication",
    },
    tags: {
      position: "25",
      flanks: "ACTG-ACGA",
    },
  },
  {
    id: "692b3588-969d-4b89-9d52-1107c425377c",
    metadata: {
      name: "PGK-polyA",
      description: "",
    },
    sequence: {
      length: 237,
      md5: "6cec4b1b41dd1a4837d1ce05d5ef354b",
    },
    rules: {
      sbol: "terminator",
    },
    tags: {
      position: "22",
      flanks: "GTTG-CGAA",
    },
  },
  {
    id: "6d8febae-9b16-4c63-9949-11a3c326fada",
    metadata: {
      name: "PuroR",
      description: "selection marker",
    },
    sequence: {
      length: 610,
      md5: "a51fadee25a979575422a1f20fd4c392",
    },
    rules: {
      sbol: "cds",
    },
    tags: {
      position: "9",
      flanks: "GCGT-TGCT",
    },
  },
  {
    id: "6f19d954-9bb5-4bad-81c2-160192dcf3b6",
    metadata: {
      name: "3'arm-hAAVS1",
      description: "",
    },
    sequence: {
      length: 916,
      md5: "6072cbd207134ecbc5f91f18658b3e97",
    },
    rules: {
      sbol: null,
    },
    tags: {
      position: "24",
      flanks: "CACG-ACTG",
    },
  },
  {
    id: "70eb52ca-5324-4caf-a5ac-7dbd62195255",
    metadata: {
      name: "CMVp",
      description: "constitutive promoter",
    },
    sequence: {
      length: 551,
      md5: "1235fc072bd9280dc0be32b765520c58",
    },
    rules: {
      sbol: "promoter",
    },
    tags: {
      position: "18",
      flanks: "CGGT-GTGC",
    },
  },
  {
    id: "72b6f3ea-f0a9-47c8-a0a8-03a08344cd18",
    metadata: {
      name: "mTagBFP2",
      description: "fluorescent reporter",
    },
    sequence: {
      length: 727,
      md5: "2d0d8c32106c25c1d71aa7230d0ce1f4",
    },
    rules: {
      sbol: "cds",
    },
    tags: {
      position: "19",
      flanks: "GTGC-AGCG",
    },
  },
  {
    id: "7891b07c-163b-429c-8401-5e90f52dad7e",
    metadata: {
      name: "Kozak-ATG-BoxC",
      description: "N-terminal Tag",
    },
    sequence: {
      length: 81,
      md5: "cc50f0dff0b543f940ff9f6c2c2d2b25",
    },
    rules: {
      sbol: null,
    },
    tags: {
      position: "6",
      flanks: "CCAG-CAGC",
    },
  },
  {
    id: "8203f39f-d750-4d58-ba2a-452acdae1a85",
    metadata: {
      name: "TRES3Gp",
      description: "inducible promoter",
    },
    sequence: {
      length: 404,
      md5: "90f016b03ca6978def0bd1a497a4b143",
    },
    rules: {
      sbol: "promoter",
    },
    tags: {
      position: "3",
      flanks: "GACT-GGAC",
    },
  },
  {
    id: "87acbec7-26b1-40fc-9d5f-f2c7164cd56c",
    metadata: {
      name: "p2A",
      description: "",
    },
    sequence: {
      length: 65,
      md5: "9aaaedf8a5d72a70e8fd7adb96bb7f6b",
    },
    rules: {
      sbol: null,
    },
    tags: {
      position: "8",
      flanks: "AGGC-GCGT",
    },
  },
  {
    id: "8ad0e972-8d51-48e9-96a2-a126bacd6127",
    metadata: {
      name: "CAGp",
      description: "constitutive promoter",
    },
    sequence: {
      length: 699,
      md5: "fd6a2acc185ae03021d2b25f49348aed",
    },
    rules: {
      sbol: "promoter",
    },
    tags: {
      position: "3",
      flanks: "GACT-GGAC",
    },
  },
  {
    id: "8c938562-0846-4cc7-a07f-bd3df2644196",
    metadata: {
      name: "DmrA",
      description: "dimerization domain",
    },
    sequence: {
      length: 335,
      md5: "2df0828c3568851ffba2a658a097f695",
    },
    rules: {
      sbol: "cds",
    },
    tags: {
      position: "21",
      flanks: "TGGA-GTTG",
    },
  },
  {
    id: "8fc2fee4-1f48-4840-ad5f-79d28d1bffa1",
    metadata: {
      name: "mRuby2",
      description: "fluorescent reporter",
    },
    sequence: {
      length: 724,
      md5: "e30810872a149fe02a920ecc715014ab",
    },
    rules: {
      sbol: "cds",
    },
    tags: {
      position: "9",
      flanks: "GCGT-TGCT",
    },
  },
  {
    id: "946728f7-56ea-4de7-a254-e98cbbcfed00",
    metadata: {
      name: "Insulator_FB",
      description: "",
    },
    sequence: {
      length: 149,
      md5: "9a2f6ceb517e53b8850746ea011caac7",
    },
    rules: {
      sbol: "insulator",
    },
    tags: {
      position: "2",
      flanks: "ATGG-GACT",
    },
  },
  {
    id: "97b5abee-1bde-4570-bcea-b648593d854f",
    metadata: {
      name: "Chimaric intron",
      description: "introns",
    },
    sequence: {
      length: 1071,
      md5: "f69f84e5e96437ccbb34343b8e669778",
    },
    rules: {
      sbol: "rnaStability",
    },
    tags: {
      position: "4",
      flanks: "GGAC-TCCG",
    },
  },
  {
    id: "9e085e2e-4afa-42cd-855f-94e1de6a27a2",
    metadata: {
      name: "p2A",
      description: "",
    },
    sequence: {
      length: 69,
      md5: "e73cb9f5f2e6a345726a29ca01288452",
    },
    rules: {
      sbol: null,
    },
    tags: {
      position: "20",
      flanks: "AGCG-TGGA",
    },
  },
  {
    id: "9e0de678-ccd1-45c1-a0a9-a3b14d639ae2",
    metadata: {
      name: "mNeonGreen",
      description: "fluorescent reporter",
    },
    sequence: {
      length: 721,
      md5: "325ed8db05cbd0cfe24cd03e8968a80a",
    },
    rules: {
      sbol: "cds",
    },
    tags: {
      position: "9",
      flanks: "GCGT-TGCT",
    },
  },
  {
    id: "a3529a1c-ecf9-49cb-bfcc-d5b63813c31e",
    metadata: {
      name: "bGH-polyA",
      description: "",
    },
    sequence: {
      length: 265,
      md5: "57a9f20987dac8e15bedf989318342bd",
    },
    rules: {
      sbol: "terminator",
    },
    tags: {
      position: "16",
      flanks: "CCCT-GCTC",
    },
  },
  {
    id: "a7ec5d0e-c30c-42ef-bb15-30cacdf96207",
    metadata: {
      name: "PuroR",
      description: "selection marker",
    },
    sequence: {
      length: 608,
      md5: "4e78bc98d78a3091d5dc7271d2fb49d5",
    },
    rules: {
      sbol: "cds",
    },
    tags: {
      position: "21",
      flanks: "TGGA-GTTG",
    },
  },
  {
    id: "a974dcfe-8b34-4ba6-b7d2-16e390b69c45",
    metadata: {
      name: "Linker-3",
      description: "Flexible peptide Linker",
    },
    sequence: {
      length: 45,
      md5: "d749d845d7aeff880f70c90b1e8035c7",
    },
    rules: {
      sbol: null,
    },
    tags: {
      position: "8",
      flanks: "AGGC-GCGT",
    },
  },
  {
    id: "acf519a1-5ed7-4811-90b5-ac73af83f6e6",
    metadata: {
      name: "C-KDEL",
      description: "C-terminal Tag",
    },
    sequence: {
      length: 58,
      md5: "75ce29753e6679b536c3d1bf1fa2a1d5",
    },
    rules: {
      sbol: null,
    },
    tags: {
      position: "8a",
      flanks: "AGGC-ATCC",
    },
  },
  {
    id: "adc07c78-8391-4e59-8ac9-43f3c6e2ef13",
    metadata: {
      name: "mTagBFP2",
      description: "fluorescent reporter",
    },
    sequence: {
      length: 718,
      md5: "ff99edbd7e50460932935e629f609645",
    },
    rules: {
      sbol: "cds",
    },
    tags: {
      position: "7",
      flanks: "CAGC-AGGC",
    },
  },
  {
    id: "afc92218-9f0a-4835-a559-fe0495064861",
    metadata: {
      name: "mNeonGreen",
      description: "fluorescent reporter",
    },
    sequence: {
      length: 724,
      md5: "e42d09bf740fb9c14a74f42b08038df3",
    },
    rules: {
      sbol: "cds",
    },
    tags: {
      position: "19",
      flanks: "GTGC-AGCG",
    },
  },
  {
    id: "bb36711d-d62d-42f1-8d32-3aad7f3a34d8",
    metadata: {
      name: "Kozak-ATG-IgKL",
      description: "N-terminal Tag",
    },
    sequence: {
      length: 81,
      md5: "1490f178b8a304f4d1e80101d672881e",
    },
    rules: {
      sbol: null,
    },
    tags: {
      position: "6",
      flanks: "CCAG-CAGC",
    },
  },
  {
    id: "bb86088c-1ea6-401d-805e-cdca1a8b3dec",
    metadata: {
      name: "Recombinases",
      description: "",
    },
    sequence: {
      length: 1507,
      md5: "a8bd04300aa591522df5d1b6ae7f618e",
    },
    rules: {
      sbol: "cds",
    },
    tags: {
      position: "7",
      flanks: "CAGC-AGGC",
    },
  },
  {
    id: "c5c3b2e5-e4bd-4bcd-9ad2-1f39335d97a1",
    metadata: {
      name: "mNeonGreen",
      description: "fluorescent reporter",
    },
    sequence: {
      length: 715,
      md5: "16f0ac7d4a4309315e2835fa941f9d44",
    },
    rules: {
      sbol: "cds",
    },
    tags: {
      position: "7",
      flanks: "CAGC-AGGC",
    },
  },
  {
    id: "ccce1b06-8f6a-4570-bcb7-c862dc321f2a",
    metadata: {
      name: "C-NES",
      description: "C-terminal Tag",
    },
    sequence: {
      length: 52,
      md5: "1933d65993c27567ed0e4a89cd322bd7",
    },
    rules: {
      sbol: null,
    },
    tags: {
      position: "20-21",
      flanks: "AGCG-GTTG",
    },
  },
  {
    id: "d56dd515-2257-42b6-bbe1-0d5f2bd797f5",
    metadata: {
      name: "Kozak-ATG-Palm",
      description: "N-terminal Tag",
    },
    sequence: {
      length: 78,
      md5: "64351238ae7f842ac51213691d8737e3",
    },
    rules: {
      sbol: null,
    },
    tags: {
      position: "6",
      flanks: "CCAG-CAGC",
    },
  },
  {
    id: "da7c669f-80e7-435e-9f24-260ca10cc395",
    metadata: {
      name: "PuroR",
      description: "selection marker",
    },
    sequence: {
      length: 619,
      md5: "03e7cd14e2bf0df9cc7e39c11ffa93c4",
    },
    rules: {
      sbol: "cds",
    },
    tags: {
      position: "15",
      flanks: "GCAA-CCCT",
    },
  },
  {
    id: "e01d6c60-496e-438d-980a-857b6d0bab1a",
    metadata: {
      name: "L7Ae",
      description: "translational repressor",
    },
    sequence: {
      length: 604,
      md5: "b8ccf79e53ef92d00feafaab8f48af86",
    },
    rules: {
      sbol: "cds",
    },
    tags: {
      position: "7",
      flanks: "CAGC-AGGC",
    },
  },
  {
    id: "ec1118cc-147c-435c-a9f1-92c926ddcead",
    metadata: {
      name: "mRuby2",
      description: "fluorescent reporter",
    },
    sequence: {
      length: 727,
      md5: "37b462bb90992e1a8610833c97d052dc",
    },
    rules: {
      sbol: "cds",
    },
    tags: {
      position: "19",
      flanks: "GTGC-AGCG",
    },
  },
  {
    id: "fa57ebb1-db51-4969-8fdb-d37ef3c77180",
    metadata: {
      name: "Kozak-ATG-MLS",
      description: "N-terminal Tag",
    },
    sequence: {
      length: 105,
      md5: "2d39ff20eb947e0ad129b204fc5cb2ff",
    },
    rules: {
      sbol: null,
    },
    tags: {
      position: "6",
      flanks: "CCAG-CAGC",
    },
  },
].map((part) => new Block(part));

//add dummy annotations to the first block
merge(parts[0], {
  sequence: {
    annotations: [
      {
        name: 'GFP',
        tags: {},
        notes: {},
        start: 0,
        end: 50,
      },
      {
        name: 'mCherry',
        tags: {},
        notes: {},
        start: 40,
        end: 80,
      },
      {
        name: 'BglII',
        tags: {},
        notes: {},
        sequence: 'agatct',
      },
    ],
  },
});

export default parts;
