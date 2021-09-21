import { D as DisplayObject } from '../common/display-8c72214c.js';
import { P as Point } from '../common/math-c2cd7001.js';
import '../common/settings-c0bf7028.js';
import '../common/isMobile-1deec544.js';
import '../common/utils-7d588553.js';
import '../common/index-0e075eab.js';
import '../common/_commonjsHelpers-eb5a497e.js';
import '../common/earcut-2ad6c5fa.js';
import '../common/url-7f7905a6.js';
import '../common/punycode-ef5905fd.js';
import '../common/index-63ada304.js';
import '../common/constants-24df4963.js';

/*!
 * @pixi/mixin-get-global-position - v6.1.2
 * Compiled Thu, 12 Aug 2021 17:11:19 UTC
 *
 * @pixi/mixin-get-global-position is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

/**
 * Returns the global position of the displayObject. Does not depend on object scale, rotation and pivot.
 *
 * @method getGlobalPosition
 * @memberof PIXI.DisplayObject#
 * @param {PIXI.Point} [point=new PIXI.Point()] - The point to write the global value to.
 * @param {boolean} [skipUpdate=false] - Setting to true will stop the transforms of the scene graph from
 *  being updated. This means the calculation returned MAY be out of date BUT will give you a
 *  nice performance boost.
 * @return {PIXI.Point} The updated point.
 */
DisplayObject.prototype.getGlobalPosition = function getGlobalPosition(point, skipUpdate) {
    if (point === void 0) { point = new Point(); }
    if (skipUpdate === void 0) { skipUpdate = false; }
    if (this.parent) {
        this.parent.toGlobal(this.position, point, skipUpdate);
    }
    else {
        point.x = this.position.x;
        point.y = this.position.y;
    }
    return point;
};
