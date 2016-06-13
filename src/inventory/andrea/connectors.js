import Block from '../../models/Block';
import connectorList from './connectorList.json';

export default connectorList
  .map(connector => new Block(connector))
  .map(connector => connector.merge({
    metadata: {
      color: '#bababa',
    },
    rules: {
      hidden: true,
    },
  }))
  .map(connector => connector.setFrozen());
