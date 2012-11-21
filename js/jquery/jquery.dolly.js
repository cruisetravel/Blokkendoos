/**
 * dolly by Ziao, a jQuery plugin for CruiseTravel. http://github.com/Ziao/Blokkendoos
 *
 * Usage:
 *
 * Call .dolly() on an element (something containing sets), passing along the following options in an object (all optional)
 * - maxSets (int). The max amount of sets, when this number has been reached trying to add more will not work.
 * - $target: (optional) a jQuery element (INSIDE THE MAIN SELECTOR) containing the target, where we want to pleuâh new rows.
 * - addFieldIds: (optional) boolean, when true, add generated ids to the fields
 *
 * In your HTML, use the following data attributes:
 * data-dolly-set="setname" to create a set (in combination with the next one)
 * data-dolly-template (no value) to specify that said set is a template; this one will be hidden using css and will not be included when the form is submitted
 * data-dolly-addset="setname" will add a row to the specified set, to be filled by the user, that demon.
 * data-dolly-fieldname="user[name]" placeholder for the actual fieldname; the template should have none or it will be included. Note that
 * data-dolly-enable with this attribute added, dolly removes the readonly attribute. Symfony shite. If this doesn't make sense to you, you probably don't need it.
 * you should NOT use the regular array formatting ([0]), as Dolly will do this automatically.
 */


(function ($) {

    var defaultOptions = {
        maxSets:     0,
        $target:     null,
        addFieldIds: false
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

            //remove required from the template and change it into data-dolly-required
            $el.find('[data-dolly-template] [required]').each(function () {
                $(this).removeAttr('required').attr('data-dolly-required', '');
            });

        },

        addSet: function ($el, options, setName) {

            var $clonedSets = $el.find('*[data-dolly-set=' + setName + ']:not([data-dolly-template])');

            if ($clonedSets.length > options.maxSets && options.maxSets > 0) {
                return;
            }

            //prepare the new set
            var $setTemplate = $el.find("*[data-dolly-template][data-dolly-set='" + setName + "']");
            var $set = $setTemplate.clone();
            $set.removeData('dolly-set-template');
            $set.removeAttr('data-dolly-template');

            //remove all name and id attributes
            $set.add($set.find('*')).removeAttr('id').removeAttr('name');

            //set the fieldnames for all inputs (array shite, 0-based)
            $set.find('*[data-dolly-fieldname]').each(function () {
                var $input = $(this);

                var fieldName = $input.data('dolly-fieldname');
                var fieldIndex = $setTemplate.data('dolly-last-index') + 0;
                fieldName = fieldName.substring(0, fieldName.lastIndexOf('[')) + '[' + ($clonedSets.length) + ']' + fieldName.substring(fieldName.lastIndexOf('['));
                $input.attr('name', fieldName);

                if (options.addFieldIds) {
                    var fieldId = fieldName.replace(/\[/g, '_').replace(/\]/g, '_').replace(/__/g, '_');
                    $input.attr('id', fieldId);
                }

                if ($input.is('[data-dolly-enable]')) {
                    $input.removeAttr('readonly');
                }
                if ($input.is('[data-dolly-required]')) {
                    $input.attr('required', 'required');
                }
            });

            //find out where to put it and do so
            if (options.$target) {
                options.$target.append($set);
            } else if ($clonedSets.length) {
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
            return methods.addSet($el, options, args[1]);
        }

        //});
    }

})(jQuery);