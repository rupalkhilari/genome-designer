import merge from 'lodash.merge';
import Block from '../../models/Block';
/* eslint-disable quotes */

//todo - need to include source.source = egf and source.id for all of these so tracked properly

const parts = [
  {
    metadata: {
      name: "attP",
      description: "",
    },
    sequence: {
      length: 60,
      md5: "4f258b0b8a3c52b34b26aa34d82b1be2",
    },
    rules: {
      role: "insulator",
    },
    tags: {
      position: "2",
      flanks: "ATGG-GACT",
    },
  },
  {
    metadata: {
      name: "Tubulin",
      description: "",
    },
    sequence: {
      length: 1370,
      md5: "cea5c653d9a9d059efc906799b83d7c2",
    },
    rules: {
      role: "cds",
    },
    tags: {
      position: "9",
      flanks: "GCGT-TGCT",
    },
  },
  {
    metadata: {
      name: "SV40p",
      description: "constitutive promoter",
    },
    sequence: {
      length: 388,
      md5: "3738256730833453268112b67ec2633e",
    },
    rules: {
      role: "promoter",
    },
    tags: {
      position: "14",
      flanks: "CTAC-GCAA",
    },
  },
  {
    metadata: {
      name: "mRuby2",
      description: "fluorescent reporter",
    },
    sequence: {
      length: 718,
      md5: "86c92af1fc161a9bf9981cdaec4cddb5",
    },
    rules: {
      role: "cds",
    },
    tags: {
      position: "7",
      flanks: "CAGC-AGGC",
    },
  },
  {
    metadata: {
      name: "Kozak-ATG",
      description: "N-terminal Tag",
    },
    sequence: {
      length: 51,
      md5: "5e2d5819ba4ed439518519a0840c90b5",
    },
    rules: {
      role: null,
    },
    tags: {
      position: "6",
      flanks: "CCAG-CAGC",
    },
  },
  {
    metadata: {
      name: "Linker-2",
      description: "Flexible peptide Linker",
    },
    sequence: {
      length: 44,
      md5: "09455435ee55b1c03846759493b97f4b",
    },
    rules: {
      role: null,
    },
    tags: {
      position: "8",
      flanks: "AGGC-GCGT",
    },
  },
  {
    metadata: {
      name: "UTR-5'",
      description: "",
    },
    sequence: {
      length: 79,
      md5: "e4618f004a9e557d4a68da0bcd5548be",
    },
    rules: {
      role: null,
    },
    tags: {
      position: "5",
      flanks: "TCCG-CCAG",
    },
  },
  {
    metadata: {
      name: "mTagBFP2",
      description: "fluorescent reporter",
    },
    sequence: {
      length: 721,
      md5: "be2263139187f27750fb3a3c36017b81",
    },
    rules: {
      role: "cds",
    },
    tags: {
      position: "9",
      flanks: "GCGT-TGCT",
    },
  },
  {
    metadata: {
      name: "5'arm-hAAVS1",
      description: "",
    },
    sequence: {
      length: 916,
      md5: "6cbc5808cc4f0fc0b489753f47743675",
    },
    rules: {
      role: null,
    },
    tags: {
      position: "1",
      flanks: "TAGG-ATGG",
    },
  },
  {
    metadata: {
      name: "attB",
      description: "",
    },
    sequence: {
      length: 46,
      md5: "66b06a6a0be6985b44d36029643f34bb",
    },
    rules: {
      role: "insulator",
    },
    tags: {
      position: "2",
      flanks: "ATGG-GACT",
    },
  },
  {
    metadata: {
      name: "SV40-polyA",
      description: "",
    },
    sequence: {
      length: 139,
      md5: "9b4cd1a9911ef800564bf6d0c864e154",
    },
    rules: {
      role: "terminator",
    },
    tags: {
      position: "11",
      flanks: "GGTA-CGTC",
    },
  },
  {
    metadata: {
      name: "SV40 intron",
      description: "introns",
    },
    sequence: {
      length: 129,
      md5: "95da87f1aa57a7102d89fac8b5f5283e",
    },
    rules: {
      role: "rnaStability",
    },
    tags: {
      position: "4",
      flanks: "GGAC-TCCG",
    },
  },
  {
    metadata: {
      name: "Kozak-ATG-NLS",
      description: "N-terminal Tag",
    },
    sequence: {
      length: 42,
      md5: "3a639d1e41a86411e772629dc489bff5",
    },
    rules: {
      role: null,
    },
    tags: {
      position: "6",
      flanks: "CCAG-CAGC",
    },
  },
  {
    metadata: {
      name: "Tet-ON-3G",
      description: "transcriptional activator",
    },
    sequence: {
      length: 769,
      md5: "1096eb2200eb786a8127617b6e2b981e",
    },
    rules: {
      role: "cds",
    },
    tags: {
      position: "19",
      flanks: "GTGC-AGCG",
    },
  },
  {
    metadata: {
      name: "IRES2",
      description: "",
    },
    sequence: {
      length: 622,
      md5: "c0b330c11d0cdcfe89990e51142061b9",
    },
    rules: {
      role: null,
    },
    tags: {
      position: "8b",
      flanks: "ATCC-GCGT",
    },
  },
  {
    metadata: {
      name: "Insulator_FB",
      description: "",
    },
    sequence: {
      length: 149,
      md5: "f585e5f6fa811687e1cd623037e37a3b",
    },
    rules: {
      role: "insulator",
    },
    tags: {
      position: "23",
      flanks: "CGAA-CACG",
    },
  },
  {
    metadata: {
      name: "Linker-1",
      description: "Flexible peptide Linker",
    },
    sequence: {
      length: 59,
      md5: "f8c0736644172fed89a28bace2f6222a",
    },
    rules: {
      role: null,
    },
    tags: {
      position: "8",
      flanks: "AGGC-GCGT",
    },
  },
  {
    metadata: {
      name: "CMVp-Tet",
      description: "repressible promoter",
    },
    sequence: {
      length: 635,
      md5: "f5fd7f5830d993627fa3f795e257e3b9",
    },
    rules: {
      role: "promoter",
    },
    tags: {
      position: "3",
      flanks: "GACT-GGAC",
    },
  },
  {
    metadata: {
      name: "DmrC",
      description: "dimerization domain",
    },
    sequence: {
      length: 296,
      md5: "c02b4a60b713818aa07099ac2cfb2b75",
    },
    rules: {
      role: "cds",
    },
    tags: {
      position: "9",
      flanks: "GCGT-TGCT",
    },
  },
  {
    metadata: {
      name: "Tet-Aptazyme",
      description: "",
    },
    sequence: {
      length: 179,
      md5: "281bc8734912cd7e5989833c0fe82306",
    },
    rules: {
      role: null,
    },
    tags: {
      position: "10",
      flanks: "TGCT-GGTA",
    },
  },
  {
    metadata: {
      name: "EF1ap",
      description: "constitutive promoter",
    },
    sequence: {
      length: 1232,
      md5: "af6e48afddb054354d26f782fe695543",
    },
    rules: {
      role: "promoter",
    },
    tags: {
      position: "18",
      flanks: "CGGT-GTGC",
    },
  },
  {
    metadata: {
      name: "SV40-ORI",
      description: "",
    },
    sequence: {
      length: 144,
      md5: "a7a976597b46fabbeec4a9c5659739d3",
    },
    rules: {
      role: "originReplication",
    },
    tags: {
      position: "25",
      flanks: "ACTG-ACGA",
    },
  },
  {
    metadata: {
      name: "PGK-polyA",
      description: "",
    },
    sequence: {
      length: 237,
      md5: "6cec4b1b41dd1a4837d1ce05d5ef354b",
    },
    rules: {
      role: "terminator",
    },
    tags: {
      position: "22",
      flanks: "GTTG-CGAA",
    },
  },
  {
    metadata: {
      name: "PuroR",
      description: "selection marker",
    },
    sequence: {
      length: 610,
      md5: "a51fadee25a979575422a1f20fd4c392",
    },
    rules: {
      role: "cds",
    },
    tags: {
      position: "9",
      flanks: "GCGT-TGCT",
    },
  },
  {
    metadata: {
      name: "3'arm-hAAVS1",
      description: "",
    },
    sequence: {
      length: 916,
      md5: "6072cbd207134ecbc5f91f18658b3e97",
    },
    rules: {
      role: null,
    },
    tags: {
      position: "24",
      flanks: "CACG-ACTG",
    },
  },
  {
    metadata: {
      name: "CMVp",
      description: "constitutive promoter",
    },
    sequence: {
      length: 551,
      md5: "1235fc072bd9280dc0be32b765520c58",
    },
    rules: {
      role: "promoter",
    },
    tags: {
      position: "18",
      flanks: "CGGT-GTGC",
    },
  },
  {
    metadata: {
      name: "mTagBFP2",
      description: "fluorescent reporter",
    },
    sequence: {
      length: 727,
      md5: "2d0d8c32106c25c1d71aa7230d0ce1f4",
    },
    rules: {
      role: "cds",
    },
    tags: {
      position: "19",
      flanks: "GTGC-AGCG",
    },
  },
  {
    metadata: {
      name: "Kozak-ATG-BoxC",
      description: "N-terminal Tag",
    },
    sequence: {
      length: 81,
      md5: "cc50f0dff0b543f940ff9f6c2c2d2b25",
    },
    rules: {
      role: null,
    },
    tags: {
      position: "6",
      flanks: "CCAG-CAGC",
    },
  },
  {
    metadata: {
      name: "TRES3Gp",
      description: "inducible promoter",
    },
    sequence: {
      length: 404,
      md5: "90f016b03ca6978def0bd1a497a4b143",
    },
    rules: {
      role: "promoter",
    },
    tags: {
      position: "3",
      flanks: "GACT-GGAC",
    },
  },
  {
    metadata: {
      name: "p2A",
      description: "",
    },
    sequence: {
      length: 65,
      md5: "9aaaedf8a5d72a70e8fd7adb96bb7f6b",
    },
    rules: {
      role: null,
    },
    tags: {
      position: "8",
      flanks: "AGGC-GCGT",
    },
  },
  {
    metadata: {
      name: "CAGp",
      description: "constitutive promoter",
    },
    sequence: {
      length: 699,
      md5: "fd6a2acc185ae03021d2b25f49348aed",
    },
    rules: {
      role: "promoter",
    },
    tags: {
      position: "3",
      flanks: "GACT-GGAC",
    },
  },
  {
    metadata: {
      name: "DmrA",
      description: "dimerization domain",
    },
    sequence: {
      length: 335,
      md5: "2df0828c3568851ffba2a658a097f695",
    },
    rules: {
      role: "cds",
    },
    tags: {
      position: "21",
      flanks: "TGGA-GTTG",
    },
  },
  {
    metadata: {
      name: "mRuby2",
      description: "fluorescent reporter",
    },
    sequence: {
      length: 724,
      md5: "e30810872a149fe02a920ecc715014ab",
    },
    rules: {
      role: "cds",
    },
    tags: {
      position: "9",
      flanks: "GCGT-TGCT",
    },
  },
  {
    metadata: {
      name: "Insulator_FB",
      description: "",
    },
    sequence: {
      length: 149,
      md5: "9a2f6ceb517e53b8850746ea011caac7",
    },
    rules: {
      role: "insulator",
    },
    tags: {
      position: "2",
      flanks: "ATGG-GACT",
    },
  },
  {
    metadata: {
      name: "Chimaric intron",
      description: "introns",
    },
    sequence: {
      length: 1071,
      md5: "f69f84e5e96437ccbb34343b8e669778",
    },
    rules: {
      role: "rnaStability",
    },
    tags: {
      position: "4",
      flanks: "GGAC-TCCG",
    },
  },
  {
    metadata: {
      name: "p2A",
      description: "",
    },
    sequence: {
      length: 69,
      md5: "e73cb9f5f2e6a345726a29ca01288452",
    },
    rules: {
      role: null,
    },
    tags: {
      position: "20",
      flanks: "AGCG-TGGA",
    },
  },
  {
    metadata: {
      name: "mNeonGreen",
      description: "fluorescent reporter",
    },
    sequence: {
      length: 721,
      md5: "325ed8db05cbd0cfe24cd03e8968a80a",
    },
    rules: {
      role: "cds",
    },
    tags: {
      position: "9",
      flanks: "GCGT-TGCT",
    },
  },
  {
    metadata: {
      name: "bGH-polyA",
      description: "",
    },
    sequence: {
      length: 265,
      md5: "57a9f20987dac8e15bedf989318342bd",
    },
    rules: {
      role: "terminator",
    },
    tags: {
      position: "16",
      flanks: "CCCT-GCTC",
    },
  },
  {
    metadata: {
      name: "PuroR",
      description: "selection marker",
    },
    sequence: {
      length: 608,
      md5: "4e78bc98d78a3091d5dc7271d2fb49d5",
    },
    rules: {
      role: "cds",
    },
    tags: {
      position: "21",
      flanks: "TGGA-GTTG",
    },
  },
  {
    metadata: {
      name: "Linker-3",
      description: "Flexible peptide Linker",
    },
    sequence: {
      length: 45,
      md5: "d749d845d7aeff880f70c90b1e8035c7",
    },
    rules: {
      role: null,
    },
    tags: {
      position: "8",
      flanks: "AGGC-GCGT",
    },
  },
  {
    metadata: {
      name: "C-KDEL",
      description: "C-terminal Tag",
    },
    sequence: {
      length: 58,
      md5: "75ce29753e6679b536c3d1bf1fa2a1d5",
    },
    rules: {
      role: null,
    },
    tags: {
      position: "8a",
      flanks: "AGGC-ATCC",
    },
  },
  {

    metadata: {
      name: "mTagBFP2",
      description: "fluorescent reporter",
    },
    sequence: {
      length: 718,
      md5: "ff99edbd7e50460932935e629f609645",
    },
    rules: {
      role: "cds",
    },
    tags: {
      position: "7",
      flanks: "CAGC-AGGC",
    },
  },
  {

    metadata: {
      name: "mNeonGreen",
      description: "fluorescent reporter",
    },
    sequence: {
      length: 724,
      md5: "e42d09bf740fb9c14a74f42b08038df3",
    },
    rules: {
      role: "cds",
    },
    tags: {
      position: "19",
      flanks: "GTGC-AGCG",
    },
  },
  {

    metadata: {
      name: "Kozak-ATG-IgKL",
      description: "N-terminal Tag",
    },
    sequence: {
      length: 81,
      md5: "1490f178b8a304f4d1e80101d672881e",
    },
    rules: {
      role: null,
    },
    tags: {
      position: "6",
      flanks: "CCAG-CAGC",
    },
  },
  {

    metadata: {
      name: "Recombinases",
      description: "",
    },
    sequence: {
      length: 1507,
      md5: "a8bd04300aa591522df5d1b6ae7f618e",
    },
    rules: {
      role: "cds",
    },
    tags: {
      position: "7",
      flanks: "CAGC-AGGC",
    },
  },
  {

    metadata: {
      name: "mNeonGreen",
      description: "fluorescent reporter",
    },
    sequence: {
      length: 715,
      md5: "16f0ac7d4a4309315e2835fa941f9d44",
    },
    rules: {
      role: "cds",
    },
    tags: {
      position: "7",
      flanks: "CAGC-AGGC",
    },
  },
  {

    metadata: {
      name: "C-NES",
      description: "C-terminal Tag",
    },
    sequence: {
      length: 52,
      md5: "1933d65993c27567ed0e4a89cd322bd7",
    },
    rules: {
      role: null,
    },
    tags: {
      position: "20-21",
      flanks: "AGCG-GTTG",
    },
  },
  {
    metadata: {
      name: "Kozak-ATG-Palm",
      description: "N-terminal Tag",
    },
    sequence: {
      length: 78,
      md5: "64351238ae7f842ac51213691d8737e3",
    },
    rules: {
      role: null,
    },
    tags: {
      position: "6",
      flanks: "CCAG-CAGC",
    },
  },
  {
    metadata: {
      name: "PuroR",
      description: "selection marker",
    },
    sequence: {
      length: 619,
      md5: "03e7cd14e2bf0df9cc7e39c11ffa93c4",
    },
    rules: {
      role: "cds",
    },
    tags: {
      position: "15",
      flanks: "GCAA-CCCT",
    },
  },
  {
    metadata: {
      name: "L7Ae",
      description: "translational repressor",
    },
    sequence: {
      length: 604,
      md5: "b8ccf79e53ef92d00feafaab8f48af86",
    },
    rules: {
      role: "cds",
    },
    tags: {
      position: "7",
      flanks: "CAGC-AGGC",
    },
  },
  {
    metadata: {
      name: "mRuby2",
      description: "fluorescent reporter",
    },
    sequence: {
      length: 727,
      md5: "37b462bb90992e1a8610833c97d052dc",
    },
    rules: {
      role: "cds",
    },
    tags: {
      position: "19",
      flanks: "GTGC-AGCG",
    },
  },
  {
    metadata: {
      name: "Kozak-ATG-MLS",
      description: "N-terminal Tag",
    },
    sequence: {
      length: 105,
      md5: "2d39ff20eb947e0ad129b204fc5cb2ff",
    },
    rules: {
      role: null,
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
