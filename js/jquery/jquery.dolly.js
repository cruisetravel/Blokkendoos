/**
 * dolly by Ziao, a jQuery plugin for CruiseTravel. http://github.com/Ziao/Blokkendoos
 *
 * Usage:
 *
 * Call .dolly() on an element (something containing sets), passing along the following options in an object (all optional)
 * - maxSets (int). The max amount of sets, when this number has been reached trying to add more will not work.
 *
 * In your HTML, use the following data attributes:
 * data-dolly-set="setname" to create a set (in combination with the next one)
 * data-dolly-template (no value) to specify that said set is a template; this one will be hidden using css and will not be included when the form is submitted
 * data-dolly-addset="setname" will add a row to the specified set, to be filled by the user, that demon.
 * data-dolly-fieldname="user[name]" placeholder for the actual fieldname; the template should have none or it will be included. Note that
 * you should NOT use the regular array formatting ([0]), as Dolly will do this automatically.
 */


(function ($) {

    var defaultOptions = {
        maxSets:      0
    };

    var methods = {
        init: function ($el, argOptions) {
            var options = $.extend({}, defaultOptions, argOptions);
            $el.data('dolly-options', options);

            //make 'addset' buttons respond
            $el.find('*[data-dolly-addset]').click(function (e) {
                e.preventDefault();
                var setName = $(this).data('dolly-addset');

                methods.addSet($el, options, setName);
            });

        },

        addSet: function ($el, options, setName) {

            var $clonedSets = $el.find('*[data-dolly-set=' + setName + ']');

            if ($clonedSets.length > options.maxSets && options.maxSets > 0) {
                return;
            }

            //prepare the new set
            var $setTemplate = $el.find("*[data-dolly-template][data-dolly-set='" + setName + "']");
            var $set = $setTemplate.clone();
            $set.removeData('dolly-set-template');
            $set.removeAttr('data-dolly-template');
            $set.removeAttr('data-dolly-fieldname');

            //set the fieldnames for all inputs (array shite, 0-based)
            $set.find('*[data-dolly-fieldname]').each(function () {
                var fieldName = $(this).data('dolly-fieldname');
                var fieldIndex = $setTemplate.data('dolly-last-index') + 0;
                fieldName = fieldName.substring(0, fieldName.lastIndexOf('[')) + '[' + ($clonedSets.length - 1) + ']' + fieldName.substring(fieldName.lastIndexOf('['));
                $(this).attr('name', fieldName);
            });

            //find out where to put it and do so
            if ($clonedSets.length) {
                $clonedSets.last().after($set);
            } else {
                $setTemplate.after($set);
            }

            return $set;
        }
    }

    $.fn.dolly = function () {
        var args = arguments;

        //return $(this).each(function () {
        var $el = $(this);
        var options = $el.data('dolly-options');

        if (!options) {
            methods.init($(this), args[0]);
            return $el;
        }

        //calling custom functions
        if (args[0] == 'addset') {
            //args[1] = setName, args[2] (optional) object with data to map
            return methods.addSet($el, options, args[1], args[2]);
        }

        //});
    }

})(jQuery);