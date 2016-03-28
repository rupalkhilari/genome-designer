/**
 * Expose selectors on the window, so they are accessible by 3rd party consumers
 */

import * as blocks from './blocks';
import * as inspector from './inspector';
import * as inventory from './inventory';
import * as projects from './projects';
import * as focus from './focus';

const exposed = {
  blocks,
  inspector,
  focus,
  inventory,
  projects,
};

export default exposed;
