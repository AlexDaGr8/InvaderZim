var trs = $('.table').find('tbody tr');

$.each(trs, function(i,v) {
  $(v).prepend("<td>"+i+"</td>");
});

$(function() {
    // create paging obj
    // params are number of records to show per page and the selector to grab correct table
    var pageing = new Paging(10,"#testTable");
    
    // keyword params send true if you want number of records shown else false
    // second param is the paging obj you created for paging. if you dont use paging dont include it
    $('#testTable').keywordSearch(true, pageing);
    
    // create paging elements. You can send it custom margins to position were needed
    // if you send it nothing it will use text-align: center which doesnt always show it in the center if using keywordsearch
    pageing.create("0 0 0 34%");
    
    // update the paging to start it and thats it
    pageing.update();
});