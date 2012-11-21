/**
 * Crush by Ziao, a jQuery plugin for CruiseTravel. http://github.com/Ziao/Blokkendoos
 *
 * Usage:
 *
 * Call .crush() on an element (something containing sets), passing along the following options in an object (all optional)
 * - maxSets (int). The max amount of sets, when this number has been reached trying to add more will not work.
 * - $target: (optional) a jQuery element (INSIDE THE MAIN SELECTOR) containing the target, where we want to pleuâh new rows.
 *
 * In your HTML, use the following data attributes:
 * data-crush-set="setname" to create a set (in combination with the next one)
 * data-crush-template (no value) to specify that said set is a template; this one will be hidden using css and will not be included when the form is submitted
 * data-crush-addset="setname" will add a row to the specified set, to be filled by the user, that demon.
 * data-crush-fieldname="user[name]" placeholder for the actual fieldname; the template should have none or it will be included. Note that
 * data-crush-enable with this attribute added, crush removes the disabled attribute. Symfony shite. If this doesn't make sense to you, you probably don't need it.
 * you should NOT use the regular array formatting ([0]), as Crush will do this automatically.
 */


(function ($) {

    var defaultOptions = {
        minScale:  0,
        maxScale:  1,
        setHeight: true
    };

    var methods = {
        init: function ($el, argOptions) {

            var options = $.extend({}, defaultOptions, argOptions);
            var data = {};
            $el.data('crush-options', options);
            $el.data('crush-data', data);

            data.$scalee = $el.children(':first');

            methods.scale($el, options, data);
            $(window).resize(function () {
                methods.scale($el, options, data);
            });

        },

        scale: function ($el, options, data) {
            var ratio = $el.width() / data.$scalee.outerWidth();

            data.$scalee.css({

                //Reference
                /*
                 zoom: 0.75;
                 -moz-transform: scale(0.75);
                 -moz-transform-origin: 0 0;
                 -o-transform: scale(0.75);
                 -o-transform-origin: 0 0;
                 -webkit-transform: scale(0.75);
                 -webkit-transform-origin: 0 0;
                 */

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
                msTransformOrigin:      '0 0'

            });

            var actualWidth = data.$scalee.outerWidth() * ratio;
            var actualHeight = data.$scalee.outerHeight() * ratio;

            $el.css('height', actualHeight);
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
        }

        //return methods.addSet($el, options, args[1], args[2]);

        //});
    }

})(jQuery);