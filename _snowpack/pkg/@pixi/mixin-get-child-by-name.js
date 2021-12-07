import { D as DisplayObject, C as Container } from '../common/display-8c72214c.js';
import '../common/settings-c0bf7028.js';
import '../common/isMobile-1deec544.js';
import '../common/math-c2cd7001.js';
import '../common/utils-7d588553.js';
import '../common/index-0e075eab.js';
import '../common/_commonjsHelpers-eb5a497e.js';
import '../common/earcut-2ad6c5fa.js';
import '../common/url-7f7905a6.js';
import '../common/punycode-ef5905fd.js';
import '../common/index-63ada304.js';
import '../common/constants-24df4963.js';

/*!
 * @pixi/mixin-get-child-by-name - v6.1.2
 * Compiled Thu, 12 Aug 2021 17:11:19 UTC
 *
 * @pixi/mixin-get-child-by-name is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

/**
 * The instance name of the object.
 *
 * @memberof PIXI.DisplayObject#
 * @member {string} name
 */
DisplayObject.prototype.name = null;
/**
 * Returns the display object in the container.
 *
 * Recursive searches are done in a preorder traversal.
 *
 * @method getChildByName
 * @memberof PIXI.Container#
 * @param {string} name - Instance name.
 * @param {boolean}[deep=false] - Whether to search recursively
 * @return {PIXI.DisplayObject} The child with the specified name.
 */
Container.prototype.getChildByName = function getChildByName(name, deep) {
    for (var i = 0, j = this.children.length; i < j; i++) {
        if (this.children[i].name === name) {
            return this.children[i];
        }
    }
    if (deep) {
        for (var i = 0, j = this.children.length; i < j; i++) {
            var child = this.children[i];
            if (!child.getChildByName) {
                continue;
            }
            var target = this.children[i].getChildByName(name, true);
            if (target) {
                return target;
            }
        }
    }
    return null;
};
