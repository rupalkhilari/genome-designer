/**
 * Expose some actions on the window, so they are accessible by 3rd party consumers
 *
 * We simply expose all actions for now, on an object grouped by realm of actions
 */

import * as blocks from './blocks';
import * as inspector from './inspector';
import * as inventory from './inventory';
import * as projects from './projects';
import * as ui from './ui';
import * as focus from './focus';

const exposed = {
  blocks,
  inspector,
  inventory,
  projects,
  ui,
  focus,
};

export default exposed;
