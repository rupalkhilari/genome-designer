import { makeComponents, templateFromComponents } from './templateUtils';

//make the components separately so we can export them properly at end

/* has attP in illegal position. is this a real part? ask andrea
 const example9 = exampleOfTemplate(
 template9,
 ["5'HA-hAAVS1", 'IS_FB', 'CAGp', 'attP', 'BxB1', 'p2A', 'PuroR', 'SV40A', 'IS_FB', "3'HA-hAAVS1"]
 );
 */

const components1A = makeComponents('a-c', 3, 'd-f', 6, 7, 'h-k', 11, 'l-y', 25);
const components1B = makeComponents('a-c', 3, 'd-f', 6, 7, 'h-k', 11, 'l-y', 'y-z');
const components9 = makeComponents(1, 2, 3, 'd-e', 5, 6, 7, 8, 9, 'h-k', 11, 'l-w', 23, 24, 'y-z');

//all parts + connectors + list blocks used and created
export const blocks = [...new Set([
  ...components1A,
  ...components1B,
  ...components9,
])];

//export the templates
export const templates = [
  templateFromComponents(
    components1A,
    {
      metadata: {
        name: 'Template 1A',
        description: 'Episomal vector with one transcription unit for expression of a tagged protein',
      },
      notes: {
        Category: 'Stable transfection',
        Subcategory: 'Episomal vector',
        'Number of Transcription Units': 'One',
        'Transcription Unit Structure': 'Monocistronic',
        'Coding sequence design': 'Tagged protein',
        'Selection Marker': 'Absent',
      },
    },
  ),

  templateFromComponents(
    components1B,
    {
      metadata: {
        name: 'Template 1B',
        description: 'Vector with one transcription unit for expression of a tagged protein',
      },
      notes: {
        Category: 'Transient transfection',
        'Number of Transcription Units': 'One',
        'Transcription Unit Structure': 'Monocistronic',
        'Selection Marker': 'Absent',
        Application: 'Targeting of proteins to cellular compartments',
      },
    },
  ),

  templateFromComponents(
    components9,
    {
      metadata: {
        name: 'Template 9',
        description: 'Vector for genomic integration of a landing pad',
      },
      notes: {
        //todo
      },
    },
  ),
];
