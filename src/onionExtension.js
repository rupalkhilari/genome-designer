import React from 'react';
import { render as reactRender } from 'react-dom';

import {SequenceEditor} from './extensions/onion2/SequenceEditor';
import {onionFile} from './extensions/onion2/OnionFile';
import {PlasmidViewer} from './extensions/onion2/PlasmidViewer';
import {InfoBar} from './extensions/onion2/InfoBar';
/* create simple component */

class OnionViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pvCursorPos: 0,
      pvStartCursorPos: 0,
    };
  }

  componentWillMount() {
    const self = this;
    let lastBlock;

    this.setState({
      block: null,
      rendered: Date.now(),
    });

    const storeSubscriber = (store) => {
      const { currentBlock } = store.ui;
      const block = !!currentBlock ? store.blocks[currentBlock] : null;

      // all instances in the store are immutables, so you can just do a reference equality check to see if it has changed
      // this would also be a good place to convert to the onion format
      // it would be a great place to memoize
      // (i.e. return same value if input === previous input, rather than storing it explicitly in the component,
      // and then you can reuse the selector for all things you retrieve from the store)
      if (!!block && block !== lastBlock) {
        //note that right now, blocks dont have a sequence... this will work but nothing will be returned
        block.getSequence()
          .then(sequence => {
            self.setState({
              block,
              sequence,
            });
          });
        lastBlock = block;
      }
    };

    this.subscriber = window.gd.store.subscribe(storeSubscriber);
  }

  componentWillUnmount() {
    this.subscriber();
  }

  onSetCursor(pos) {
    this.setState({pvCursorPos: pos,pvStartCursorPos:pos});
  }

  onSelecting(pos1, pos2) {
    this.setState({pvCursorPos: pos1, pvStartCursorPos: pos2});
  }

  convertFeatures(block) {
    let src = block.sequence.annotations;
    let dst = [];
    for (let i in src) {
      let s = src[i];
      dst.push({start: s.start, end: s.end, text: s.description, color: "#A5A6A2"});
    }

    return dst;

  }

  render() {
    //console.log(this.state);
    let divHeight = 400;
    let sequence;
    let features;
    if (this.state && this.state.sequence && this.state.block && this.state.block.sequence && this.state.block.sequence.annotations != undefined) {
      sequence = this.state.sequence ? this.state.sequence : onionFile.seq;
      features = this.convertFeatures(this.state.block);
      if (!sequence || !features) {
        sequence = onionFile.seq;
        features = onionFile.features;
      }
    } else {
      sequence = onionFile.seq;
      features = onionFile.features;
    }

    //if sequence has been changed, cursor should be reset
    if(this.state && this.state.sequence && (this.state.pvCursorPos>this.state.sequence.length || this.state.pvStartCursorPos>this.state.sequence.length)){
      this.state.pvCursorPos = 0;
      this.state.pvStartCursorPos = 0;
    }
   // console.log(this.state.block);

	  let selectionStart = Math.min(this.state.pvCursorPos, this.state.pvStartCursorPos);
	  let selectionLength = Math.abs(this.state.pvCursorPos - this.state.pvStartCursorPos);
	  let selectedSeq = sequence.substr(selectionStart,selectionLength);
    return (
      <div style={{minWidth: '1000px'}}>
        <div style={{
          width:600,
          height:divHeight-30,
          overflowY:"scroll",
          border:"1px solid black",
          display:"inline-block",
        }}>
          <SequenceEditor
            sequence={sequence}
            showComplement={true}
            features={features}
            onSetCursor={this.onSetCursor.bind(this)}
            onSelecting={this.onSelecting.bind(this)}/>
        </div>

        <div style={{
          width:400,
          height:divHeight-30,
          overflow:"hidden",
          border:"1px solid black",
          display:"inline-block",
        }}>
          <PlasmidViewer
            mode={"normal"}
            plasmidR={128}
            width={400}
            height={400}
            theme={"NAL"}
            rotateAngle={0}
            cursorPos={this.state.pvCursorPos}
            selectedFeature={-1}
            selectionStart={selectionStart}
            selectionLength={selectionLength}
            features={features}
            seqLength={sequence.length}
            enzymes={onionFile.enzymes}
            name={onionFile.name}
            showViewAngle={false}
            onWheel={()=> {}}/>

        </div>
		<InfoBar
			width="1000"
		  	startPos={selectionStart}
			endPos={selectionStart+selectionLength}
			seq={selectedSeq}
		></InfoBar>
      </div>
    );
  }
}

/* register with store */
//note that if you were using redux, you could wrap your component in a Provider, and pass in window.gd.store
//we'll just register directly for this example

/* rendering + registering extension */

const render = (container) => {
  reactRender(<OnionViewer />, container);
};

const manifest = {
  id: 'onion-0.0.0',
  name: 'Sequence Detail',
  render,
};

window.gd.registerExtension('sequenceDetail', manifest);
