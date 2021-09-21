import { P as Promise } from '../common/index-f94d5a70.js';
import { o as objectAssign } from '../common/index-d01087d6.js';

/*!
 * @pixi/polyfill - v6.1.2
 * Compiled Thu, 12 Aug 2021 17:11:19 UTC
 *
 * @pixi/polyfill is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

// Support for IE 9 - 11 which does not include Promises
if (!self.Promise) {
    self.Promise = Promise;
}

// References:
if (!Object.assign) {
    Object.assign = objectAssign;
}

// References:
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// https://gist.github.com/1579671
// http://updates.html5rocks.com/2012/05/requestAnimationFrame-API-now-with-sub-millisecond-precision
// https://gist.github.com/timhall/4078614
// https://github.com/Financial-Times/polyfill-service/tree/master/polyfills/requestAnimationFrame
// Expected to be used with Browserfiy
// Browserify automatically detects the use of `global` and passes the
// correct reference of `global`, `self`, and finally `window`
var ONE_FRAME_TIME = 16;
// Date.now
if (!(Date.now && Date.prototype.getTime)) {
    Date.now = function now() {
        return new Date().getTime();
    };
}
// performance.now
if (!(self.performance && self.performance.now)) {
    var startTime_1 = Date.now();
    if (!self.performance) {
        self.performance = {};
    }
    self.performance.now = function () { return Date.now() - startTime_1; };
}
// requestAnimationFrame
var lastTime = Date.now();
var vendors = ['ms', 'moz', 'webkit', 'o'];
for (var x = 0; x < vendors.length && !self.requestAnimationFrame; ++x) {
    var p = vendors[x];
    self.requestAnimationFrame = self[p + "RequestAnimationFrame"];
    self.cancelAnimationFrame = self[p + "CancelAnimationFrame"]
        || self[p + "CancelRequestAnimationFrame"];
}
if (!self.requestAnimationFrame) {
    self.requestAnimationFrame = function (callback) {
        if (typeof callback !== 'function') {
            throw new TypeError(callback + "is not a function");
        }
        var currentTime = Date.now();
        var delay = ONE_FRAME_TIME + lastTime - currentTime;
        if (delay < 0) {
            delay = 0;
        }
        lastTime = currentTime;
        return self.setTimeout(function () {
            lastTime = Date.now();
            callback(performance.now());
        }, delay);
    };
}
if (!self.cancelAnimationFrame) {
    self.cancelAnimationFrame = function (id) { return clearTimeout(id); };
}

// References:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign
if (!Math.sign) {
    Math.sign = function mathSign(x) {
        x = Number(x);
        if (x === 0 || isNaN(x)) {
            return x;
        }
        return x > 0 ? 1 : -1;
    };
}

// References:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
if (!Number.isInteger) {
    Number.isInteger = function numberIsInteger(value) {
        return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
    };
}

if (!self.ArrayBuffer) {
    self.ArrayBuffer = Array;
}
if (!self.Float32Array) {
    self.Float32Array = Array;
}
if (!self.Uint32Array) {
    self.Uint32Array = Array;
}
if (!self.Uint16Array) {
    self.Uint16Array = Array;
}
if (!self.Uint8Array) {
    self.Uint8Array = Array;
}
if (!self.Int32Array) {
    self.Int32Array = Array;
}
