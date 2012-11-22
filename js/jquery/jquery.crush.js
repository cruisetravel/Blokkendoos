/**
 * Crush by Ziao, a jQuery plugin for CruiseTravel. http://github.com/Ziao/Blokkendoos
 *
 * Usage:
 *
 * Call .crush() on an element (something containing sets), passing along the following options in an object (all optional)
 * - minScale (float) the minimum to which the content will scale (0-1)
 * - maxScale (float) the maximum scale to which the content will scale (0-1)
 * - fitHeight (boolean) should the content be scaled so that it's height will fit in the parent?
 * - fitWidth (boolean) should the content be scaled so that it's width will fit in the parent?
 * - setParentHeight (boolean) should the container adjust it's height so that the content will fit? (Cannot be used together with fitHeight)
 * - centerContent (boolean) should the content be centered if it's smaller then its parent?
 * - responsive (boolean) should crush automatically rescale if the browser has been resized?
 *
 * Requirements:
 * - In your HTML, make sure that the element you are calling the plugin on has a position, be it relative, absolute, or whatever. Also, the first child must have position:abslute.
 * - Only the FIRST element inside this container will be scaled. If there are more children in there, the plugin may cause unexpected results.
 * - Now go, young warrior. Go and set the world on fire!
 *
 * Methods:
 * .crush('scale') will trigger a rescale. Useful when content has changed
 *
 */


(function ($) {

    var defaultOptions = {
        minScale:        0,
        maxScale:        1,
        fitHeight:       false,
        fitWidth:        true,
        setParentHeight: false,
        centerContent:   true,
        responsive:      true
    };

    var methods = {
        init: function ($el, argOptions) {

            var options = $.extend({}, defaultOptions, argOptions);
            var data = {};
            $el.data('crush-options', options);
            $el.data('crush-data', data);

            data.$scalee = $el.children(':first');

            methods.scale($el, options, data);
            if (options.responsive) {
                $(window).resize(function () {
                    methods.scale($el, options, data);
                });
            }

        },

        scale: function ($el, options, data) {

            if (options.fitHeight && options.setParentHeight) {
                $.error("You cannot set both fitHeight and setParentHeight");
            }

            if (options.fitWidth && !options.fitHeight) {
                var ratio = $el.width() / data.$scalee.outerWidth();
            } else if (!options.fitWidth && options.fitHeight) {
                var ratio = $el.height() / data.$scalee.outerHeight();
            } else {
                var ratio = Math.min($el.width() / data.$scalee.outerWidth(), $el.height() / data.$scalee.outerHeight());
            }

            ratio = Math.min(options.maxScale, ratio);
            ratio = Math.max(options.minScale, ratio);

            data.$scalee.css({

                //Good browsers
                transform: 'scale(' + ratio + ')',
                transformOrigin:       '0 0',

                //Chrome
                webkitTransform: 'scale(' + ratio + ')',
                webkitTransformOrigin: '0 0',

                //Firefox
                mozTransform: 'scale(' + ratio + ')',
                mozTransformOrigin:    '0 0',

                //Opera or whatever
                oTransform: 'scale(' + ratio + ')',
                oTransformOrigin:      '0 0',

                //Microsoft's shit, including IE7 and up!
                msTransform: 'scale(' + ratio + ')',
                msTransformOrigin:     '0 0'

            });

            var actualWidth = data.$scalee.outerWidth() * ratio;
            var actualHeight = data.$scalee.outerHeight() * ratio;

            if (options.setParentHeight) {
                $el.css('height', actualHeight);
            }

            if (options.centerContent) {
                data.$scalee.css({
                    left: ($el.innerWidth() - actualWidth) / 2
                })
            }
        }
    }

    $.fn.crush = function () {
        var args = arguments;

        //return $(this).each(function () {
        var $el = $(this);
        var options = $el.data('crush-options');
        var data = $el.data('crush-data');

        if (!options) {
            methods.init($(this), args[0]);
            return $el;
        }

        //calling custom functions
        if (args[0] == 'option') {
            //args[1] = optionName, args[2] optionValue
            options[arg[1]] = args[2];
            return true;
        } else if (args[0] == 'scale') {
            methods.scale($el, options, data);
            return true;
        }

        //return methods.addSet($el, options, args[1], args[2]);

        //});
    }

})(jQuery);