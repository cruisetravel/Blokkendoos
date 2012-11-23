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
 * Methods :
 * .dolly('addset', setName) will add the specified set
 * .dolly('removeset', $set) will remove the set and recompute fieldnames
 * .dolly('numsets', setName) returns the number times that the set has been cloned
 * .dolly('setfieldnames') will recompute all the fieldnames, use this after serious DOM manipulations
 *
 * In your HTML, use the following data attributes:
 * data-dolly-set="setname" to create a set (in combination with the next one)
 * data-dolly-template (no value) to specify that said set is a template; this one will be hidden using css and will not be included when the form is submitted
 * data-dolly-addset="setname" will add a row to the specified set, to be filled by the user, that demon.
 * data-dolly-fieldname="user[name]" placeholder for the actual fieldname; the template should have none or it will be included. Note that
 * data-dolly-enable with this attribute added, dolly removes the readonly attribute. Symfony shite. If this doesn't make sense to you, you probably don't need it.
 * you should NOT use the regular array formatting ([0]), as Dolly will do this automatically.
 * if you have an element (in your template) with the attribute data-dolly-removeset, clicking it will remove the set. You are responsible for attaching custom handlers for this
 *
 * Notes:
 * Keep in mind that you should NEVER use the field indexes for anything serious. Keep track of actual ID's in hidden inputs or whatever.
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
            $el.find('*[data-dolly-addset]').live('click', function (e) {
                e.preventDefault();
                var setName = $(this).data('dolly-addset');

                methods.addSet($el, options, setName);
            });

            //make removeset buttons respond (data-dolly-removeset
            $el.find('[data-dolly-removeset]').live('click', function (e) {
                e.preventDefault();
                methods.removeSet($el, options, $(this).parents('[data-dolly-set]'));
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
            $set.removeData('dolly-template');
            $set.removeAttr('data-dolly-template');

            //remove all name and id attributes
            $set.add($set.find('*')).removeAttr('id').removeAttr('name');

            //set the fieldnames for all inputs (array shite, 0-based)
            $set.find('*[data-dolly-fieldname]').each(function () {
                var $input = $(this);

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

            methods.setFieldNames($el, options);

            return $set;
        },

        setFieldName: function (options, $input, index) {
            //name attribute
            var fieldName = $input.data('dolly-fieldname');
            fieldName = fieldName.substring(0, fieldName.lastIndexOf('[')) + '[' + index + ']' + fieldName.substring(fieldName.lastIndexOf('['));
            $input.attr('name', fieldName);

            //id attribute
            if (options.addFieldIds) {
                var fieldId = fieldName.replace(/\[/g, '_').replace(/\]/g, '_').replace(/__/g, '_');
                fieldId = fieldId.substr(0, fieldId.length - 1);
                $input.attr('id', fieldId);
            }

            return $input;
        },

        setFieldNames: function ($el, options) {
            var $sets = $el.find('[data-dolly-set]:not([data-dolly-template])');
            var setCounts = {};

            //Some tricky shit will happen here. Keep track of how many sets (per type) we encounter. We use these counts as field-indexes
            $sets.each(function () {
                var setName = $(this).data('dolly-set');
                if (!setCounts[setName]) setCounts[setName] = 0;
                var setCount = setCounts[setName]++;

                $(this).find(':input').each(function () {
                    methods.setFieldName(options, $(this), setCount);
                });
            });
        },

        removeSet: function ($el, options, $set) {
            $set.remove();
            methods.setFieldNames($el, options);
            return true;
        },

        numSets: function ($el, options, setName) {
            return $el.find('[data-dolly-set=' + setName + ']:not([data-dolly-template])').length;
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
            //args[1] = setName
            return methods.addSet($el, options, args[1]);
        } else if (args[0] == 'removeset') {
            //args[1] = $set
            return methods.removeSet($el, options, args[1]);
        } else if (args[0] == 'numets') {
            //args[1] = setName
            return methods.numSets($el, options, args[1]);
        } else if (args[0] == 'setfieldnames') {
            //no args
            return methods.setFieldNames($el, options);
        }


        //});
    }

})(jQuery);