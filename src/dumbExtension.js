import React from 'react';
import { render as reactRender } from 'react-dom';
import {SequenceEditor} from './extensions/onion2/SequenceEditor';
import {onionFile} from './extensions/onion2/OnionFile';
import {PlasmidViewer} from './extensions/onion2/PlasmidViewer';
/* create simple component */

class SimpleComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            pvCursorPos:0,
            pvStartCursorPos:0
        }
    }


    componentWillMount() {
        const self = this;
        let lastBlock;

        this.setState({
            block: null,
            rendered: Date.now(),
        });

        const storeSubscriber = (store) => {
            const { currentInstance } = store.ui;
            const block = !!currentInstance ? store.blocks[currentInstance] : null;

            // all instances in the store are immutables, so you can just do a reference equality check to see if it has changed
            // this would also be a good place to convert to the onion format
            // it would be a great place to memoize
            // (i.e. return same value if input === previous input, rather than storing it explicitly in the component,
            // and then you can reuse the selector for all things you retrieve from the store)
            if (block !== lastBlock) {
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

    onSetCursor(pos){
        this.setState({pvCursorPos:pos});
    }
    onSelecting(pos1,pos2){
        this.setState({pvCursorPos:pos1,pvStartCursorPos:pos2});
    }

    render() {
        let divHeight = 400;
        let pvPara = {theme:"default",
            rotateAngle:0,
            plasmidR:250,
            cursorPos:0,
            selectedFeature:-1,
            seqLength:onionFile.seq.length,
            features:onionFile.features,
            enzymes:onionFile.enzymes,
            plasmidName:onionFile.name}
        return (
            <div>
                <div
                    style={{
                        width:600,
                        height:divHeight,
                        overflowY:"scroll",
                        border:"1px solid black",
                        display:"inline-block"
                    }}
                >
                    <p>Rendered at {new Date(this.state.rendered).toUTCString()}</p>
                    {this.state.block && (
                        <div>
                            <p>block: {this.state.block.metadata.name}</p>
                            <p>sequence: {this.state.sequence}</p>
                        </div>
                    )}
                    <SequenceEditor
                        sequence={onionFile.seq}
                        showComplement={true}
                        features={onionFile.features}
                        onSetCursor={this.onSetCursor.bind(this)}
                        onSelecting={this.onSelecting.bind(this)}
                    ></SequenceEditor>
                </div>
                <div
                    style={{
                        width:400,
                        height:divHeight,
                        overflow:"hidden",
                        border:"1px solid black",
                        display:"inline-block"
                    }}
                >
                    <PlasmidViewer
                        mode={"normal"}
                        plasmidR = {128}
                        width={400}
                        height={400}
                        theme={"NAL"}
                        rotateAngle={0}
                        cursorPos={this.state.pvCursorPos}
                        selectedFeature={-1}
                        selectionStart={Math.min(this.state.pvCursorPos,this.state.pvStartCursorPos)}
                        selectionLength={Math.abs(this.state.pvCursorPos-this.state.pvStartCursorPos)}
                        features={onionFile.features}
                        seqLength={onionFile.seq.length}
                        enzymes={onionFile.enzymes}
                        name={onionFile.name}
                        showViewAngle={false}
                        onWheel={()=>{}}
                    ></PlasmidViewer>

                </div>
            </div>
    );
    }
    }

        /* register with store */
    //note that if you were using redux, you could wrap your component in a Provider, and pass in window.gd.store
    //we'll just register directly for this example

        /* rendering + registering extension */

    const render = (container) => {
        reactRender(<SimpleComponent />, container);
    };

    const manifest = {
        id: 'onion-0.0.0',
        name: 'onion',
        render,
    };

    window.gd.registerExtension('sequenceDetail', manifest);
