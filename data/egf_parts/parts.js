import Block from '../../src/models/Block';
import partList from './partList.json';

export default partList
  .map(part => new Block(part))
  .map(part => part.setFrozen(true));
