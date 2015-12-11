import Vector2D from '../geometry/vector2d';
import Box2D from '../geometry/box2d';
import UserInterface from '../scenegraph2d/userinterface';
import invariant from '../../../utils/environment/invariant';

/**
 * user interface overlay for construct viewer
 */
export default class ConstructViewerUserInterface extends UserInterface {
  constructor(sg) {
    super(sg);
  }

  /**
   * mouse down handler
   */
  mouseDown(point, e) {
    invariant(this.layout, 'you must supply a layout component after construction');
    const hits = this.sg.findNodesAt(point);
    // check the top hit
    const top = hits.length ? hits.pop() : null;
    if (top) {
      // check with layout if the user clicked a part
      if (this.layout.elementFromNode(top)) {

        // shift select is addiditive
        if (e.shiftKey) {
          this.addToSelections(top);
        } else {
          this.setSelections([top]);
        }
      }
    }
  }
}
