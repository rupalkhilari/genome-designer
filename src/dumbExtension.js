import React from 'react';
import { render as reactRender } from 'react-dom';
import {SequenceEditor} from './extensions/onion2/SequenceEditor';
import {onionFile} from './extensions/onion2/OnionFile';
/* create simple component */

class SimpleComponent extends React.Component {
	componentWillMount() {
		const self = this;
		let lastBlockId;

		this.setState({
			block: null,
			rendered: Date.now(),
		});

		const storeSubscriber = (store) => {
			const { currentInstance } = store.ui;
			const block = !!currentInstance ? store.blocks[currentInstance] : null;

			if (block.id !== lastBlockId) {
				//note that right now, blocks dont have a sequence... this will work but nothing will be returned
				block.getSequence()
					.then(sequence => {
						self.setState({
							block,
							sequence,
						});
					});
				lastBlockId = block.id;
			}
		};

		this.subscriber = window.gd.store.subscribe(storeSubscriber);
	}

	componentWillUnmount() {
		this.subscriber();
	}

	render() {


		return (
			<div
				height = "50%"
				style={{overflow:"scroll"}}
			>
				<div>
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
					></SequenceEditor>
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
	//reactRender(<OnionCommander></OnionCommander>, container)
	//reactRender(<SequenceEditor>helloworld</SequenceEditor>, container)
};

const manifest = {
	id: 'onion-0.0.0',
	name: 'onion',
	render,
};

window.gd.registerExtension('sequenceDetail', manifest);
