import { C as Container } from './display-8c72214c.js';
import { a as autoDetectRenderer } from './core-c3d46723.js';

/*!
 * @pixi/app - v6.1.2
 * Compiled Thu, 12 Aug 2021 17:11:19 UTC
 *
 * @pixi/app is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

/**
 * Convenience class to create a new PIXI application.
 *
 * This class automatically creates the renderer, ticker and root container.
 *
 * @example
 * // Create the application
 * const app = new PIXI.Application();
 *
 * // Add the view to the DOM
 * document.body.appendChild(app.view);
 *
 * // ex, add display objects
 * app.stage.addChild(PIXI.Sprite.from('something.png'));
 *
 * @class
 * @memberof PIXI
 */
var Application = /** @class */ (function () {
    /**
     * @param {object} [options] - The optional renderer parameters.
     * @param {boolean} [options.autoStart=true] - Automatically starts the rendering after the construction.
     *     **Note**: Setting this parameter to false does NOT stop the shared ticker even if you set
     *     options.sharedTicker to true in case that it is already started. Stop it by your own.
     * @param {number} [options.width=800] - The width of the renderers view.
     * @param {number} [options.height=600] - The height of the renderers view.
     * @param {HTMLCanvasElement} [options.view] - The canvas to use as a view, optional.
     * @param {boolean} [options.useContextAlpha=true] - Pass-through value for canvas' context `alpha` property.
     *   If you want to set transparency, please use `backgroundAlpha`. This option is for cases where the
     *   canvas needs to be opaque, possibly for performance reasons on some older devices.
     * @param {boolean} [options.autoDensity=false] - Resizes renderer view in CSS pixels to allow for
     *   resolutions other than 1.
     * @param {boolean} [options.antialias=false] - Sets antialias
     * @param {boolean} [options.preserveDrawingBuffer=false] - Enables drawing buffer preservation, enable this if you
     *  need to call toDataUrl on the WebGL context.
     * @param {number} [options.resolution=PIXI.settings.RESOLUTION] - The resolution / device pixel ratio of the renderer.
     * @param {boolean} [options.forceCanvas=false] - prevents selection of WebGL renderer, even if such is present, this
     *   option only is available when using **pixi.js-legacy** or **@pixi/canvas-renderer** modules, otherwise
     *   it is ignored.
     * @param {number} [options.backgroundColor=0x000000] - The background color of the rendered area
     *  (shown if not transparent).
     * @param {number} [options.backgroundAlpha=1] - Value from 0 (fully transparent) to 1 (fully opaque).
     * @param {boolean} [options.clearBeforeRender=true] - This sets if the renderer will clear the canvas or
     *   not before the new render pass.
     * @param {string} [options.powerPreference] - Parameter passed to webgl context, set to "high-performance"
     *  for devices with dual graphics card. **(WebGL only)**.
     * @param {boolean} [options.sharedTicker=false] - `true` to use PIXI.Ticker.shared, `false` to create new ticker.
     *  If set to false, you cannot register a handler to occur before anything that runs on the shared ticker.
     *  The system ticker will always run before both the shared ticker and the app ticker.
     * @param {boolean} [options.sharedLoader=false] - `true` to use PIXI.Loader.shared, `false` to create new Loader.
     * @param {Window|HTMLElement} [options.resizeTo] - Element to automatically resize stage to.
     */
    function Application(options) {
        var _this = this;
        /**
         * The root display container that's rendered.
         * @member {PIXI.Container}
         */
        this.stage = new Container();
        // The default options
        options = Object.assign({
            forceCanvas: false,
        }, options);
        this.renderer = autoDetectRenderer(options);
        // install plugins here
        Application._plugins.forEach(function (plugin) {
            plugin.init.call(_this, options);
        });
    }
    /**
     * Register a middleware plugin for the application
     * @static
     * @param {PIXI.IApplicationPlugin} plugin - Plugin being installed
     */
    Application.registerPlugin = function (plugin) {
        Application._plugins.push(plugin);
    };
    /**
     * Render the current stage.
     */
    Application.prototype.render = function () {
        this.renderer.render(this.stage);
    };
    Object.defineProperty(Application.prototype, "view", {
        /**
         * Reference to the renderer's canvas element.
         * @member {HTMLCanvasElement}
         * @readonly
         */
        get: function () {
            return this.renderer.view;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "screen", {
        /**
         * Reference to the renderer's screen rectangle. Its safe to use as `filterArea` or `hitArea` for the whole screen.
         * @member {PIXI.Rectangle}
         * @readonly
         */
        get: function () {
            return this.renderer.screen;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Destroy and don't use after this.
     * @param {Boolean} [removeView=false] - Automatically remove canvas from DOM.
     * @param {object|boolean} [stageOptions] - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [stageOptions.children=false] - if set to true, all the children will have their destroy
     *  method called as well. 'stageOptions' will be passed on to those calls.
     * @param {boolean} [stageOptions.texture=false] - Only used for child Sprites if stageOptions.children is set
     *  to true. Should it destroy the texture of the child sprite
     * @param {boolean} [stageOptions.baseTexture=false] - Only used for child Sprites if stageOptions.children is set
     *  to true. Should it destroy the base texture of the child sprite
     */
    Application.prototype.destroy = function (removeView, stageOptions) {
        var _this = this;
        // Destroy plugins in the opposite order
        // which they were constructed
        var plugins = Application._plugins.slice(0);
        plugins.reverse();
        plugins.forEach(function (plugin) {
            plugin.destroy.call(_this);
        });
        this.stage.destroy(stageOptions);
        this.stage = null;
        this.renderer.destroy(removeView);
        this.renderer = null;
    };
    /** Collection of installed plugins. */
    Application._plugins = [];
    return Application;
}());

/**
 * Middleware for for Application's resize functionality
 * @private
 * @class
 */
var ResizePlugin = /** @class */ (function () {
    function ResizePlugin() {
    }
    /**
     * Initialize the plugin with scope of application instance
     * @static
     * @private
     * @param {object} [options] - See application options
     */
    ResizePlugin.init = function (options) {
        var _this = this;
        Object.defineProperty(this, 'resizeTo', 
        /**
         * The HTML element or window to automatically resize the
         * renderer's view element to match width and height.
         * @member {Window|HTMLElement}
         * @name resizeTo
         * @memberof PIXI.Application#
         */
        {
            set: function (dom) {
                self.removeEventListener('resize', this.queueResize);
                this._resizeTo = dom;
                if (dom) {
                    self.addEventListener('resize', this.queueResize);
                    this.resize();
                }
            },
            get: function () {
                return this._resizeTo;
            },
        });
        /**
         * Resize is throttled, so it's safe to call this multiple times per frame and it'll
         * only be called once.
         *
         * @memberof PIXI.Application#
         * @method queueResize
         * @private
         */
        this.queueResize = function () {
            if (!_this._resizeTo) {
                return;
            }
            _this.cancelResize();
            // // Throttle resize events per raf
            _this._resizeId = requestAnimationFrame(function () { return _this.resize(); });
        };
        /**
         * Cancel the resize queue.
         *
         * @memberof PIXI.Application#
         * @method cancelResize
         * @private
         */
        this.cancelResize = function () {
            if (_this._resizeId) {
                cancelAnimationFrame(_this._resizeId);
                _this._resizeId = null;
            }
        };
        /**
         * Execute an immediate resize on the renderer, this is not
         * throttled and can be expensive to call many times in a row.
         * Will resize only if `resizeTo` property is set.
         *
         * @memberof PIXI.Application#
         * @method resize
         */
        this.resize = function () {
            if (!_this._resizeTo) {
                return;
            }
            // clear queue resize
            _this.cancelResize();
            var width;
            var height;
            // Resize to the window
            if (_this._resizeTo === self) {
                width = self.innerWidth;
                height = self.innerHeight;
            }
            // Resize to other HTML entities
            else {
                var _a = _this._resizeTo, clientWidth = _a.clientWidth, clientHeight = _a.clientHeight;
                width = clientWidth;
                height = clientHeight;
            }
            _this.renderer.resize(width, height);
        };
        // On resize
        this._resizeId = null;
        this._resizeTo = null;
        this.resizeTo = options.resizeTo || null;
    };
    /**
     * Clean up the ticker, scoped to application
     *
     * @static
     * @private
     */
    ResizePlugin.destroy = function () {
        self.removeEventListener('resize', this.queueResize);
        this.cancelResize();
        this.cancelResize = null;
        this.queueResize = null;
        this.resizeTo = null;
        this.resize = null;
    };
    return ResizePlugin;
}());

Application.registerPlugin(ResizePlugin);

export { Application as A };
