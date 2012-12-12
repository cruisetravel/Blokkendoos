/**
 * Dora by Ziao, a jQuery plugin for CruiseTravel. http://github.com/Ziao/Blokkendoos
 *
 * Dependencies:
 * - Livequery (must be loaded before Blokkendoos) -> http://github.com/brandonaaron/livequery
 *
 *
 * Usage:
 *
 * Call .blokkendoos() on an element, passing along the following options in an object (all optional)
 * - clone (boolean). Should elements be cloned (multiple instances possible) or moved (never more then 1 of a kind ends up in the grid). Default: False
 * - fadeEffect (boolean). When true, does a little fade animation when (re)placing blocks. Default: true
 * - onDrop (function). Callback when a block has been moved, gives the dropped $item and the $cell that it was dropped in as arguments
 *
 * Call .blokkendoos('data') on the same element to retrieve an object containing the data of which blocks are in what cells. Format: cell-id => block-id
 *
 * Call .blokkendoos('loadData') on the same element to populate the grid. The second argument should be an object with key = cellID and value = blockID. The third is optional
 * and contains a set of jQuery elements. When given, all existing blocks will be removed and replaced with these.
 * If the fourth argument is true, instead of moving the new blocks, clone them.
 *
 *
 * Requirements:
 * - Have one or more elements inside the wrapper with the attribute data-bd-stash (no value required). These 'stashes' will contain the available blocks
 * -- Inside the stash, create the blocks any way you like, but give them the attribute data-bd-block-id. The value of this must be unique.
 * -- Alternatively, use the loadData method.
 * - Have ONE element inside the wrapper with the attribute data-bd-grid (no value required). This is where the blocks can be dragged to
 * -- Define cells inside the grid. These are the positions that the blocks can be put in. Must have the attribute data-bd-cell-id. The value of this must be unique.
 *
 * - You can define of what type a block is by giving them data-bd-type="whatever"
 * - You can specify what blocktypes a stash or cell will accept/deny by using data-bd-accept="type1,type2,type3" or datab-bd-deny, but not both.
 */

(function ($) {

    var defaultOptions = {
        columnWidth:      300,
        columnGutter:     10,
        height:           200,
        scrollSpeed:      250,
        autoFocus:        true,
        keyboard:         true,
        searchLoadedOnly: true
    };

    var methods = {

        init: function ($el, argOptions) {
            var options = $.extend({}, defaultOptions, argOptions);
            var data = {};
            $el.data('dora-options', options);
            $el.data('dora-data', data);

            //References
            data.$container = $el.find('[data-dora-container]');
            data.$searchbox = $el.find('[data-dora-search]');
            data.$crumbtrail = $el.find('[data-dora-crumbtrail]');

            //Prepare the elements inside
            $el.addClass('dora');
            data.$container.css('height', options.height);
            $el.attr('tabindex', 0);
            if (options.autoFocus) {
                $el.focus();
            }

            if (options.root != null) {
                methods.loadFolder($el, options, data, options.root, 0);
            }

            //Handle keyboard shortcuts
            if (options.keyboard) {
                /**
                 * 8 = backspace
                 * 9 = tab
                 *
                 * 38 = up
                 * 40 = down
                 * 37 = left
                 * 39 = right
                 * 13 = return
                 *
                 * 48-57 = 0-9
                 * 65-90 = alphabet
                 */

                $el.keydown(function (e) {
                    // Up
                    if (e.which == 38) {
                        var $prevLi = $el.find('.focus').prev('li');
                        if ($prevLi.length) {
                            $el.find('.focus').removeClass('selected focus').prev('li').addClass('selected focus');
                            e.preventDefault();
                        }
                    }
                });
            }


            //Handle clicks
            $el.find('li').live('click', function () {
                var $li = $(this);
                methods.setFocus($el, options, data, $li, true);
                if ($li.hasClass('folder')) {
                    methods.openFolder($el, options, data, $li);
                } else {
                    options.loadObject($(this).data('dora'));
                }
            });


        },

        setFocus: function ($el, options, data, $li, setSelected) {
            if (setSelected) {
                $li.parent('ul').find('.selected').removeClass('selected');
                $li.addClass('selected');
            }
            $el.find('.focus').removeClass('focus');
            $li.addClass('focus');
            var level = $li.parent('ul').index() + 1;
            methods.scrollTo($el, options, data, level);
        },

        openFolder: function ($el, options, data, $li) {
            $li.parent('ul').find('.selected').removeClass('selected');
            $li.addClass('selected');

            var level = $li.parent('ul').index() + 1;
            var items = options.loadFolder($li.data('dora'));
            methods.loadFolder($el, options, data, items, level);
        },

        loadFolder: function ($el, options, data, items, level, setFocus) {

            //Remove all lists on this level and deeper
            $el.find('ul:nth-child(n+' + (level + 1) + ')').remove();

            var $ul = $("<ul></ul>");
            $ul.css({
                width: options.columnWidth,
                left: level * options.columnWidth + level * options.columnGutter
            });
            for (var i in items) {
                if (!items.hasOwnProperty(i)) continue;
                var item = items[i];
                var $li = $("<li></li>");
                $li.text(item.name);
                $li.addClass(item.type);
                $li.data('dora', item.data);
                $ul.append($li);
            }
            data.$container.append($ul);

            //Scroll the container as far right as possible
            methods.scrollTo($el, options, data, level);

            //Set focus to the first item
            if (setFocus) {
                $ul.find('li:first').addClass('selected focus');
            }

            //Update the crumbtrail
            methods.updateCrumbtrail($el, options, data);
        },

        scrollTo: function ($el, options, data, level) {
            level = level + 1;
            var elWidth = $el.innerWidth();
            var containerWidth = level * options.columnWidth + level * options.columnGutter;
            var scollTarget = containerWidth - elWidth;
            data.$container.stop().animate({
                scrollLeft: scollTarget
            }, options.scrollSpeed);
        },

        updateCrumbtrail: function ($el, options, data) {
            var text = 'Root';
            data.$container.find('ul').each(function () {
                text = text + ' › ' + $(this).find('.selected').text();
            });
            data.$crumbtrail.text(text);
        }
    };

    $.fn.dora = function () {
        var args = arguments;

        //return $(this).each(function () {
        var $el = $(this);
        var options = $el.data('bd-options');
        var data = $el.data('bd-data');

        if (!options) {
            methods.init($(this), args[0]);
            return $el;
        }

        //calling custom functions
        if (args[0] == 'data') {
            return methods.extractData($el, options, data);
        } else if (args[0] == 'removeBlock') {
            //args[1] = $block
            return methods.removeBlock($el, options, data, args[1]);
        }

        //});
    };

})(jQuery);