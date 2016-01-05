import React, { Component, PropTypes } from 'react';
import { pushState } from 'redux-router';
import d3 from 'd3';

import Inspector from './Inspector';
import color from '../utils/generators/color';
import generateBlockTree from '../utils/test/treeBlock';
import { connect } from 'react-redux';

const width = 750;
const height = 600;
const radius = Math.min(width, height) / 2;

class SunburstPage extends Component {
  static propTypes = {
    construct: PropTypes.object.isRequired,
    currentBlock: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    uiSetCurrent: PropTypes.func.isRequired,
  }

  state = {
    selected: null,
  }

  componentDidMount() {
    const { construct } = this.props;
    drawSunburst(construct, this.refs.sunburstContainer, this.onMouseover);
  }

  onMouseover = (selected) => {
    this.setState({selected});
  }

  render() {
    return (
      <div className="ProjectPage">
        <div className="ProjectPage-content">
          <textarea value={!!this.state.selected ? this.state.selected.id : ''}/>
          <svg ref="sunburstSvg"
               width={width} height={height}>
            <g ref="sunburstContainer"
               id="container"
               transform={"translate(" + width / 2 + "," + height / 2 + ")"}>
              <circle r={radius}
                      style={{opacity: 0}}
                      ref="boundingCircle"></circle>
            </g>
          </svg>
        </div>
        <Inspector forceBlock={this.state.selected} />
      </div>
    );
  }
}

function drawSunburst(construct, svg, mouseover) {
  const partition = d3.layout.partition()
    .size([2 * Math.PI, radius * radius])
    .children(d => d.components)
    .value(d => d.sequence.length);

  const arc = d3.svg.arc()
    .startAngle(d => d.x)
    .endAngle(d => d.x + d.dx)
    .innerRadius(d => Math.sqrt(d.y))
    .outerRadius(d => Math.sqrt(d.y + d.dy));

  // For efficiency, filter nodes to keep only those large enough to see.
  // 0.005 radians = 0.29 degrees
  //.filter(d => d.dx > 0.005);
  const nodes = partition.nodes(construct);

  const path = d3.select(svg)
    .data([construct])
    .selectAll('path')
    .data(nodes)
    .enter().append('svg:path')
    .attr('display', d => d.depth ? null : 'none') //hide root node
    .attr('d', arc)
    .attr('fill-rule', 'evenodd')
    .style('fill', d => d.metadata.color)
    .style('opacity', 1)
    .on('mouseover', mouseover);
}

//redux things

let counter = 1;
const transformer = (block) => {
  return Object.assign({}, block, {
    metadata: {
      name: 'block ' + counter++,
      color: color(),
    },
    sequence: {
      length: Math.floor(Math.random() * 1000),
    },
  });
};

function mapStateToProps(state) {
  const construct = generateBlockTree(5, 4, transformer, 0.5);
  return {
    construct,
  };
}

export default connect(mapStateToProps, {
  pushState,
})(SunburstPage);
