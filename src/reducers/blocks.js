import * as ActionTypes from '../constants/ActionTypes';
import dummyBlocks from '../inventory/andrea';
import exampleWithAnnotations from '../inventory/examples/exampleWithAnnotations';

//import fs from 'fs';

//testing
import Block from '../models/Block';

//testing, default should be {} (but need to hydrate to models)
//const [child1, child2, child3, child4, child5] = dummyBlocks;
const [child1, child2, child3, child4, child5, child6, child7] = dummyBlocks;
const withAnnotations = new Block(exampleWithAnnotations);

const initialState = {
  block1: new Block({
    id: 'block1',
    components: [withAnnotations.id, child1.id, child2.id, child3.id],
  }),
  block2: new Block({
    id: 'block2',
    components: [],
  }),
  [withAnnotations.id]: withAnnotations,
  [child1.id]: new Block(child1),
  [child2.id]: new Block(Object.assign({}, child2, {
    components: [child4.id, child5.id],
  })),
  [child3.id]: new Block(child3),
  [child4.id]: new Block(Object.assign({}, child4)),
  [child5.id]: new Block(Object.assign({}, child5, {
    components: [child6.id, child7.id],
  })),
  [child6.id]: new Block(Object.assign({}, child6)),
  [child7.id]: new Block(Object.assign({}, child7)),
};

const project_and_blocks = require('../../storage/imported_from_genbank.json');

const floBlockState = project_and_blocks.blocks;
var floState = {};
for (var id in floBlockState) {
  floState[id] = new Block(floBlockState[id]);
}
//const blocks_file = JSON.parse(
//  '{"project": {"id": "project-61a01969-581f-4913-bbce-cf3166cfc032", "parents": [], "metadata": {"name": "EU912544", "description": "Cloning vector pDM313, complete sequence.", "authors": [], "tags": {} }, "version": "305565734193b0301fbd687ecd37b6e0600b6e0c", "components": ["block-cf494ab4-d9d2-419f-8ab8-d32027fc6ce6"], "settings": {} }, "blocks": [{"id": "block-cf494ab4-d9d2-419f-8ab8-d32027fc6ce6", "parents": [], "metadata": {"name": "EU912544", "description": "Cloning vector pDM313, complete sequence.", "authors": [], "tags": {}, "mol_type": "other DNA", "end": 119, "source": "Cloning vector pDM313", "taxonomy": ["other sequences", "artificial sequences", "vectors"], "gi": "198078160", "db_xref": "taxon:555771", "organism": "Cloning vector pDM313", "note": "GFP-tag for C-terminal fusion", "start": 0, "accessions": ["EU912544"], "data_file_division": "SYN", "keywords": [""], "type": "source", "date": "06-FEB-2009", "sequence_version": 1 }, "sequence": {"md5": "3449c9e5e332f1dbb81505cd739fbf3f", "length": 0, "annotations": [] }, "source": {"id": "genbank"}, "rules": {}, "components": ["block-c940dc29-2bdb-4615-a7a9-429c291b54d5", "block-2e07932c-0c18-4706-8496-a788ded9d262", "block-bfa3aae3-8f9f-42c9-a0e1-9129a4b90217", "block-06f67045-88a2-44e2-b4d0-d63fcdd9af26"], "options": [], "notes": {} }, {"id": "block-2e07932c-0c18-4706-8496-a788ded9d262", "parents": [], "metadata": {"name": "", "description": "", "authors": [], "tags": {"sbol": "cds"}, "product": "penicillin beta-lactamase", "end": 99, "start": 40, "codon_start": "1", "transl_table": "11", "db_xref": "GI:198078162", "translation": "MSIQHFRVALIPFFAAFCLPVFAHPETLVKVKDAEDQLGARVGYIELDLNSGKILESFRPEERFPMMSTFKVLLCGAVLSRIDAGQEQLGRRIHYSQNDLVEYSPVTEKHLTDGMTVRELCSAAITMSDNTAANLLLTTIGGPKELTAFLHNMGDHVTRLDRWEPELNEAIPNDERDTTMPVAMATTLRKLLTGELLTLASRQQLIDWMEADKVAGPLLRSALPAGWFIADKSGAGERGSRGIIAALGPDGKPSRIVVIYTTGSQATMDERNRQIAEIGASLIKHW", "type": "CDS", "protein_id": "ACH81569.1", "strand": 1 }, "sequence": {"md5": "3449c9e5e332f1dbb81505cd739fbf3f", "length": 0, "annotations": [] }, "source": {"id": "genbank"}, "rules": {}, "components": [], "options": [], "notes": {} }, {"id": "block-c940dc29-2bdb-4615-a7a9-429c291b54d5", "parents": [], "metadata": {"name": "", "description": "", "authors": [], "tags": {}, "db_xref": "GI:198078161", "type": "promoter", "end": 39, "strand": 1, "start": 0 }, "sequence": {"md5": "3449c9e5e332f1dbb81505cd739fbf3f", "length": 0, "annotations": [] }, "source": {"id": "genbank"}, "rules": {}, "components": [], "options": [], "notes": {} }, {"id": "block-bfa3aae3-8f9f-42c9-a0e1-9129a4b90217", "parents": [], "metadata": {"name": "", "description": "", "authors": [], "tags": {}, "db_xref": "GI:198078162", "type": "terminator", "end": 109, "strand": 1, "start": 100 }, "sequence": {"md5": "3449c9e5e332f1dbb81505cd739fbf3f", "length": 0, "annotations": [] }, "source": {"id": "genbank"}, "rules": {}, "components": [], "options": [], "notes": {} }, {"id": "block-06f67045-88a2-44e2-b4d0-d63fcdd9af26", "parents": [], "metadata": {"name": "", "description": "", "authors": [], "tags": {}, "note": "pUC ori", "start": 110, "end": 119, "strand": 1, "type": "rep_origin"}, "sequence": {"md5": "3449c9e5e332f1dbb81505cd739fbf3f", "length": 0, "annotations": [] }, "source": {"id": "genbank"}, "rules": {}, "components": [], "options": [], "notes": {} } ] }');
//const floState = blocks_file.blocks;
//const floState = blocks_file.blocks.map(block => new Block(block))
//  .reduce((acc, block) => Object.assign(acc, { [block.id] : block }));

export default function blocks(state = floState, action) {

//export default function blocks(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.BLOCK_CREATE :
  //case ActionTypes.BLOCK_SAVE :
  case ActionTypes.BLOCK_LOAD :
  case ActionTypes.BLOCK_MERGE :
  case ActionTypes.BLOCK_RENAME :
  case ActionTypes.BLOCK_SET_COLOR :
  case ActionTypes.BLOCK_CLONE :
  case ActionTypes.BLOCK_SET_SBOL :
  case ActionTypes.BLOCK_ANNOTATE :
  case ActionTypes.BLOCK_REMOVE_ANNOTATION :
  case ActionTypes.BLOCK_SET_SEQUENCE :
  case ActionTypes.BLOCK_COMPONENT_ADD :
  case ActionTypes.BLOCK_COMPONENT_MOVE :
  case ActionTypes.BLOCK_COMPONENT_REMOVE : {
    const { block } = action;
    return Object.assign({}, state, {[block.id]: block});
  }
  case ActionTypes.BLOCK_DELETE : {
    const { blockId } = action;
    const nextState = Object.assign({}, state);
    delete nextState[blockId];
    return nextState;
  }
  default : {
    return state;
  }
  }
}
