$(function () {

    if ($.fn.blokkendoos) {
        $('#blokkendoos').blokkendoos({
            clone:      false,
            fadeEffect: true
        });

        $('#blokkendoos2').blokkendoos({
            clone:      false,
            fadeEffect: true
        });


        $("#getdata").click(function () {
            console.log($('#blokkendoos').blokkendoos('data'));
        });

        $("#getdata2").click(function () {
            console.log($('#blokkendoos2').blokkendoos('data'));
        });

        $("#loaddata").click(function () {
            $("#blokkendoos2").blokkendoos('loadData', {
                cell1: 'red5', //this one is denied
                cell2: 'red6',
                cell3: 'pink5',
                cell4: 'red7',
                cell6: 'blue5'
            }, $('#new-blocks [data-bd-block-id]'));
        });
    }

    if ($.fn.dolly) {
        $('#mijn-dolly-toren').dolly({
            maxSets: 10
        });
    }


});