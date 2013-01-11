$(function () {


    var rootFolder;
    $.ajax('api/dora/getfolder', {
        data:    {folder: '.'},
        success: function (data) {
            rootFolder = data.data;
        },
        async:   false
    });

    $("#dorafy").dora({
        /*root: [
         { name: 'Rederijen', type: 'folder', data: 'referenties, ids, etc.' },
         { name: 'Aanleghavens', type: 'folder', data: 'referenties, ids, etc.' },
         { name: 'Dekplannen', type: 'folder', data: 'referenties, ids, etc.' },
         { name: 'Vaargebieden', type: 'folder', data: 'referenties, ids, etc.' },
         { name: 'Schepen', type: 'folder', data: 'referenties, ids, etc.' },
         { name: 'Meer meuk', type: 'object', data: 'referenties, ids, etc.' }
         ],*/

        height:      300,
        columnWidth: 300,
        root:        rootFolder,

        loadObject: function (object) {
            //console.log("Loading object", object);
            alert("Opening " + object.location + ". (See console)");
        },

        loadFolder: function (folder) {
            //console.log("Loading folder", folder);
            var items;
            $.ajax('api/dora/getfolder', {
                data:    {folder: folder.location},
                success: function (data) {
                    items = data.data;
                },
                async:   false //Very important!
            });
            return items;
        }
    });


    /*
     $("[data-dora]").keydown(function (e) {


     //Pressing tab, backspace, up, or down on the searchfield focuses back on the explorer
     $('[data-dora-search]').keydown(function (e) {
     if (e.which == 8 | e.which == 9 | e.which == 38 | e.which == 40) {
     $('[data-dora]').focus();
     e.preventDefault();
     return false;
     }
     });

     // Up
     if (e.which == 38) {
     $('[data-dora] .focus').removeClass('selected focus').prev('li').addClass('selected focus');
     }

     // A-Z and 0-9 trigger the searchfield
     if ((e.which >= 48 & e.which <= 57) | (e.which >= 65 & e.which <= 90)) {
     $('[data-dora-search]').focus();
     }
     });
     */
});