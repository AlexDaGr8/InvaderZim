$.fn.keywordSearch = function (showNumResults, paging) {
    var unhiddenList = [];
    if (showNumResults) {
        $('<h2></h2>')
        .attr({ id: 'numResults' })
        .css("margin-bottom", "10px")
        .html('Number of Records: ' + $(this).find(' tbody tr').length)
        .insertBefore(this);
    }

    $('<input/>')
    .attr({ type: "text", id: 'keyword', placeholder: 'Keyword Search' })
    .addClass('input-medium').css("float", "left")
    .on('input', { tableName: this }, function (ev) {
        var input = $('#keyword').val();
        input = input.toLowerCase();
        console.log(ev.data.tableName)
        var trList = $(ev.data.tableName).find(' tbody tr');
        var count = 0;
        unhiddenList = [];
        $.each(trList, function (i, v) {
            $(v).css("display", "none");
            var tdList = $(v).find('td');
            var bool = false;
            $.each(tdList, function (i, val) {
                if ($(val).text().toLowerCase().indexOf(input) > -1) {
                    $(val).parent().css("display", "");
                    bool = true;
                }
            })
            if (bool) {
                count++;
                unhiddenList.push($(v));
            }
            $('#numResults').html('Number of Records: ' + count);
        });
        if (paging) {
            paging.update(unhiddenList);
        }
    })
    .insertBefore(this);
}