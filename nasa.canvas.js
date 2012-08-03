/**
 * Namespace Check
 * 
 * Here we check to see if nasa already exists as a namespace and is an object,
 * if both of these parameters are true we utilize it, otherwise we create a 
 * new namespace.
 */
var nasa = (typeof nasa === 'undefined' || typeof nasa !== 'object') ? {} : nasa;

/**
 * NASA Module
 * Copyright 2012 Nijiko Yonskai (@vizualover) 
 * License AOL <http://aol.nexua.org> (attribute-only-license)
 *
 * The following module was designed with humans in mind. All 
 * robots were harmed in the making of this.
 * 
 * @param  {Object} nasa The NASA Namespace
 * @return {Module}      NASA Module
 */
(function (name, definition, context) {
  if (typeof module !== 'undefined' && module.exports) module.exports = definition();
  else if (typeof define === 'function' && define.amd) define(name, definition);
  else context[name] = definition();
})('canvas', function() {
  return function (settings) {
    var $canvas, $context, $width, $height, pathed = false;

    /**
     * Segments Enum
     * 
     * @type {Object}
     */
    var $segments = {
      lineTo: 1,
      arc: 1,
      rect: 1,
      quadraticCurveTo: 1,
      bezierCurveTo: 1
    };

    settings = settings || {};
    if (!("width" in settings)) settings.width = 300;
    if (!("height" in settings)) settings.height = 150;
    if (!("scale" in settings)) settings.scale = true;
    settings.type = (settings.type === "webgl") ? "experimental-webgl" : "2d";

    return {
      /**
       * Canvas Reference for quick alterations not provided by the 
       * NASA Canvas Wrapper.
       * 
       * @type {Object}
       */
      _canvas: $canvas,

      /**
       * Canvas Context Reference for quick alterations not provided
       * by the NASA Canvas Wrapper.
       * 
       * @type {Object}
       */
      _context: $context,

      /**
       * Create a new DOM Canvas Object, Context Reference by type, 
       * and scales the Canvas where requested.
       * 
       * @return {Object} Canvas DOM Object
       * @method
       */
      create: function () {
        if ($canvas) throw new Error("Canvas element has already been created.");

        $canvas = document.createElement("canvas");
        $canvas.setAttribute("width", settings.width);
        $canvas.setAttribute("height", settings.height);

        if (settings.scale) {
          $canvas.style.width = settings.width;
          $canvas.style.height = settings.height;
        }

        if ($canvas.getContext) {
          $context = $canvas.getContext(settings.type);
        } else {
          throw new Error("Canvas not supported in this browser.");
        }

        return $canvas;
      },

      /**
       * Clears the canvas completely.
       *
       * Supports transform clearing when requested, arguments
       * applied after `preserve` are applied directly to the 
       * `clearRect` context function.
       * 
       * @param  {Boolean} preserve Allows the saving of transformation data.
       * @return {Object} Self
       * @method
       */
      clear: function (preserve) {
        var $arguments = [].slice.apply(arguments);
        if (preserve) $context.save(), $context.setTransform(1, 0, 0, 1, 0, 0);

        if ($arguments.length < 1) $context.clearRect(0, 0, settings.width, settings.height);
        else $arguments.splice(0, 1), $context.clearRect.apply($context, arguments);

        if (preserve) $context.restore();

        return this;
      },

      /**
       * Sets the styles to be applied to the current context.
       *
       * Styles Available are as follows with `styles` being the object passed:
       *
       * - styles.globalCompositeOperation
       * - styles.globalAlpha
       * - styles.fill.color
       * - styles.stroke.width
       * - styles.stroke.caps
       * - styles.stroke.joints
       * - styles.stroke.color
       * - styles.stroke.miter
       * - styles.shadow.offsetX
       * - styles.shadow.offsetY
       * - styles.shadow.blur
       * - styles.shadow.color
       * 
       * @param {Object} styles Object list of styles. See Above.
       * @return {Object} Self
       * @method
       */
      setStyles: function (styles) {
        styles = styles || {};

        if ("composite" in styles)         $context.globalCompositeOperation = styles.composite;
        if ("alpha" in styles)             $context.globalAlpha = styles.alpha;

        if (styles.fill) 
          if ("color" in styles.fill)      $context.fillStyle = styles.fill.color;

        if (styles.stroke) {
          if ("width" in styles.stroke)    $context.lineWidth = styles.stroke.width;
          if ("caps" in styles.stroke)     $context.lineCap = styles.stroke.caps;
          if ("joints" in styles.stroke)   $context.lineJoin = styles.stroke.joints;
          if ("color" in styles.stroke)    $context.strokeStyle = styles.stroke.color;
          if ("miter" in styles.stroke)    $context.miterLimit = styles.stroke.miter;
        }

        if (styles.shadow) {
          if ("offsetX" in styles.shadow)  $context.shadowOffsetX = styles.shadow.offsetX;
          if ("offsetY" in styles.shadow)  $context.shadowOffsetY = styles.shadow.offsetY;
          if ("blur" in styles.shadow)     $context.shadowBlur = styles.shadow.blur;
          if ("color" in styles.shadow)    $context.shadowColor = styles.shadow.color;
        }

        return this;
      },

      /**
       * Begin creating a path on the context at the given coordinates.
       * 
       * @param  {Number} x x-coordinate to move context to. __optional__
       * @param  {Number} y y-coordinate to move context to. __optional__
       * @return {Object}   Self
       * @method
       */
      startPath: function (x, y) {
        if (pathed) throw new Error("A path has already been defined, please end path before creating a new one.");
        if (x !== null && y !== null) $context.moveTo(x, y);

        $context.beginPath();
        pathed = true;

        return this;
      },

      /**
       * Create a path segment after starting a path.
       *
       * Useful for creating inner and outer segments or 
       * general shapes and the lot.
       * 
       * @param  {Object} segments Object containing segment name and array of arguments.
       * @return {Object} Self
       * @see $segments
       */
      defineSegments: function (segments) {
        if (!pathed) throw new Error("No path has been started, please create a path first.");
        var segment, type;
        segments = segments || {};

        for (var i = 0; i < segments.length; i++) {
          segment = segments[i];
          type = Object.keys(segment)[0];
          if(type in $segments) $context[segment.type].apply($context, segment);
        }

        return this;
      },

      /**
       * Close currently open path on the current context.
       *
       * By default this function will call `closePath` if
       * no `options` are passed along.
       *
       * **Supported Options Parameters:**
       *
       * - fill
       * - stroke
       * - close __default__
       *
       * **Example:**
       *
       *     canvas.endPath({ fill: true })
       * 
       * @param  {Object} options Settings to determine style of closure.
       * @return {Object} Self
       * @method
       */
      endPath: function (options) {
        if (!pathed) throw new Error("No path has been started, please create a path first.");
        options = options || { close: true };

        if (options.close) $context.closePath();
        if (options.fill) $context.fill();
        if (options.stroke) $context.stroke();

        pathed = false;
        return this;
      },

      /**
       * Reference method to create an arc.
       *
       * Use as you would the regular context `arc` function.
       * 
       * @return {Object} Self
       */
      arc: function () {
        if (arguments.length === 0) return this;

        $context.arc.apply($context, arguments);
        return this;
      },

      /**
       * Create a circle with no mathmatical effort.
       *
       * **Supported Options:**
       *
       * - **x:** __number__ x-coordinate for positioning circle (__default: 0__)
       * - **y:** __number__ y-coordinate for positioning circle (__default: 0__)
       * - **size:** __number__ determines the radius of the circle (__default: 10__)
       * - **angle:** __number__ determines how much of the circle to show. (__default: 0__)
       * - **clockwise:** __boolean__ determines circle rotation (__default: false__)
       * 
       * @param  {Object} options Options for creating circle. See Above.
       * @return {Object} Self
       */
      circle: function (options) {
        options = options || {};
        options.x = options.x || 0;
        options.y = options.y || 0;
        options.size = options.size || 10;
        options.angle = options.angle || 0;
        options.clockwise = options.clockwise || true;

        $context.arc([ options.x, options.y, options.size, options.angle, Math.PI * 2, options.clockwise ]);

        return this;
      },

      /**
       * Reference method for creating rectangles.
       *
       * **Supported Options:**
       *
       * - **path:** __array__ arguments for `rect` segment, create rectangle through #defineSegments
       * - **stroke:** __array__ arguments for `strokeRect`, create a stroked rectangle.
       * - **fill:** __array__ arguments for `fillRect`, create a filled rectangle.
       * 
       * @param  {Object} options Rectangle creation options, see above.
       * @return {Object} Self
       */
      rect: function (options) {
        options = options || {};

        if (options.path) this.defineSegments([{ rect: options.path }]);
        else if (options.stroke) $context.strokeRect.apply($context, options.stroke);
        else if (options.fill) $context.fillRect.apply($context, options.fill);

        return this;
      },

      /**
       * Apply context transformations easily.
       *
       * **Supported Options:**
       *
       * - translate
       *   - x
       *   - y
       * - scale
       *   - x
       *   - y
       * - rotate
       *   - x
       *   - y
       * 
       * @param  {Object} options Transformation options, see above.
       * @return {Object} Self
       */
      transform: function (options) {
        options = options || {};

        if ("translate" in options) $context.translate(options.translate.x, options.translate.y);
        if ("scale" in options) $context.scale(options.scale.x, options.scale.y);
        if ("rotate" in options) $context.rotate(options.rotate);

        return this;
      },

      /**
       * Alias for `$context.moveTo`
       *  
       * @param  {Number} x x-coordinate for moving context
       * @param  {Number} y y-coordinate for moving context
       * @return {Object}   Self
       */
      move: function (x, y) { 
        $context.moveTo(x, y); 
        return this; 
      },

      /**
       * Alias for `$context.save`
       * 
       * @return {Object} Self
       */
      pushState: function () {
        $context.save();
        return this;
      },

      /**
       * Alias for `$context.restore`
       * 
       * @return {Object} Self
       */
      popState: function () {
        $context.restore();
        return this;
      },

      /**
       * Alias for `$context.clip`
       * @return {Object} Self
       */
      clip: function () {
        $context.clip();
        return this;
      },

      /**
       * Convert the current canvas into either a bitmap or data blob (dataURL).
       * 
       * @param  {Object} options Options for conversion.
       * @return {Object}         Self
       */
      getImage: function (options) {
        var temp, tmp;
        options = options || {};

        if (options.bitmap)
          return $context[ options.hd ? 'getImageDataHD' : 'getImageData' ](
            options.bitmap.x || 0, options.bitmap.y || 0, 
            options.bitmap.width || settings.width,
            options.bitmap.height || settings.height
          );
        else if (options.dataURL) {
          if (
            ("x" in options.dataURL && "y" in options.dataURL) ||
            ("width" in options.dataURL && "height" in options.dataURL)
          ) {
            temp = document.createElement("canvas");
            temp.setAttribute("width", options.dataURL.width || settings.width);
            temp.setAttribute("height", options.dataURL.height || settings.height);
            tmp = temp.getContext("2d");
            tmp.drawImage($canvas, 
              options.dataURL.x || 0, options.dataURL.y || 0, 
              options.dataURL.width || settings.width, options.dataURL.height || settings.height,
              0, 0,
              options.dataURL.width || settings.width, options.dataURL.height || settings.height
            );
            return tmp[ options.hd ? 'toDataURLHD' : 'toDataURL' ](options.dataURL.type);
          }
        } else return $canvas[ options.hd ? 'toDataURLHD' : 'toDataURL' ](options.dataURL.type);
      },

      /**
       * Place image onto canvas through means of bitmap or data blob (dataURL).
       * 
       * @param  {Object} source  Bitmap or dataURL
       * @param  {Object} options Options for placement
       * @return {Object}         Self
       */
      putImage: function (source, options) {
        var args; options = options || {};

        if (options.bitmap)
          return $context[ options.hd ? 'putImageDataHD' : 'putImageData' ](
            source,
            options.bitmap.x || 0,
            options.bitmap.y || 0
          );
        else if (options.dataURL) {
          args = [ source ];

          if ("x" in options.dataURL && "y" in options.dataURL) 
            args.push(options.dataURL.x, options.dataURL.y);

          if ("width" in options.dataURL && "height" in options.dataURL) 
            args.push(options.dataURL.width,options.dataURL.height);

          if (
            ("sx" in options.dataURL && "sy" in options.dataURL) &&
            ("dx" in options.dataURL && "dy" in options.dataURL) &&
            ("sWidth" in options.dataURL && "sHeight" in options.dataURL) &&
            ("dWidth" in options.dataURL && "dHeight" in options.dataURL)
          ) {
            args.push(
              options.dataURL.sx,
              options.dataURL.sy,
              options.dataURL.sWidth,
              options.dataURL.sHeight,
              options.dataURL.dx,
              opts.dataURL.dy,
              opts.dataURL.dWidth,
              opts.dataURL.dHeight
            );
          }

          $context.drawImage.apply($context, args);
        }
      }
    };
  };
}, nasa);