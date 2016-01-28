/**
 * Expose selectors on the window, so they are accessible by 3rd party consumers
 */

import * as blocks from './blocks';
import * as inspector from './inspector';
import * as inventory from './inventory';
import * as projects from './projects';
import * as ui from './ui';

const exposed = {
  blocks,
  inspector,
  inventory,
  projects,
  ui,
};

export default exposed;
