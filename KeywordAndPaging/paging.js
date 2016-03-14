var Paging = function (perPage, tableSelector) {
    this.numberPerPage = perPage;
    this.currentPage = 1;
    this.paging = this;
    this.tableId = tableSelector;
}

Paging.prototype.create = function (margin) {
    var before = $("<div class='pagination pagination-centered' id='pagingBefore'><ul></ul></div>");
    if (margin != null && margin != "") {
        before.css({ position: "relative", float: "left", margin: margin })
    }
    before.insertBefore($(this.tableId));
    var after = $("<div class='pagination pagination-centered' id='pagingAfter'><ul></ul></div>");
    after.insertAfter($(this.tableId));
};

Paging.prototype.update = function (trList) {
    if (trList != null) this.trList = trList;
    else this.trList = $(this.tableId).find("tbody tr");
    this.trListLength = this.trList.length;
    var min = 0;
    var max = this.numberPerPage;
    this.currentPage = 1;
    this.numberPages = Math.ceil(this.trListLength / this.numberPerPage);
    this.inside = "<a href='javascript:;'>Page <input onClick='this.select();' style='width:25px' type='text' id='currentPage' class='current_Page_Span' value='" + this.currentPage + "'/> of " + this.numberPages + "</a>";
    $('div.pagination ul').html("");
    $('div.pagination ul').append("<li><a href='javascript:;'>&laquo;</a></li>");
    $.each(this.trList, function (i, v) {
        $(this).addClass('hidden');
        if (i >= min && i <= max) {
            $(this).removeClass('hidden');
        }
    });
    $('div.pagination ul').append("<li>" + this.inside + "</li>");
    $('div.pagination ul').append("<li><a href='javascript:;'>&raquo;</a></li>");
    if (this.currentPage <= 1 && this.currentPage >= (this.trList.length / this.numberPerPage)) {
        $("#pagingBefore li").first().addClass("disabled").css("pointer-events", "none");
        $("#pagingBefore li").last().addClass("disabled").css("pointer-events", "none");
        $("#pagingAfter li").first().addClass("disabled").css("pointer-events", "none");
        $("#pagingAfter li").last().addClass("disabled").css("pointer-events", "none");
    }
    else if (this.currentPage <= 1) {
        $("#pagingBefore li").first().addClass("disabled").css("pointer-events", "none");
        $("#pagingAfter li").first().addClass("disabled").css("pointer-events", "none");
    }
    this.paging.addListeners();
};

Paging.prototype.addListeners = function () {
    var paging = this.paging;
    $('#pagingBefore li:first-child a').click(function (i) { paging.changePage("prev"); });
    $('#pagingBefore li:last-child a').click(function (i) { paging.changePage("next"); });
    $('#pagingBefore input').on('input', function () { paging.changePage($('#pagingBefore input').val()); });
    $('#pagingAfter li:first-child a').click(function (i) { paging.changePage("prev"); });
    $('#pagingAfter li:last-child a').click(function (i) { paging.changePage("next"); });
    $('#pagingAfter input').on('input', function () { paging.changePage($('#pagingAfter input').val()); });
}

Paging.prototype.changePage = function (current) {
    if (current === "prev") {
        this.currentPage = +this.currentPage - 1;
    }
    else if (current === "next") {
        this.currentPage = +this.currentPage + 1;
    }
    //else if (+current > 0 && +current < (this.trList.length / this.numberPerPage)) this.currentPage = current;
    else {
        if (+current >= 1 && +current <= Math.ceil(this.trList.length / this.numberPerPage)) this.currentPage = current;
    }
    var min = (this.currentPage * this.numberPerPage) - this.numberPerPage;
    var max = (this.currentPage * this.numberPerPage);
    $.each(this.trList, function (i, v) {
        $(this).addClass('hidden');
        if (i >= min && i <= max) {
            $(this).removeClass('hidden');
        }
    });
    //$('.current_Page_Span').html(this.currentPage);
    $('.current_Page_Span').val(this.currentPage);
    if (this.currentPage <= 1 && this.currentPage >= (this.trList.length / this.numberPerPage)) {
        $("#pagingBefore li").first().addClass("disabled").css("pointer-events", "none");
        $("#pagingBefore li").last().addClass("disabled").css("pointer-events", "none");
        $("#pagingAfter li").first().addClass("disabled").css("pointer-events", "none");
        $("#pagingAfter li").last().addClass("disabled").css("pointer-events", "none");
    }
    else if (this.currentPage <= 1) {
        $("#pagingBefore li").first().addClass("disabled").css("pointer-events", "none");
        $("#pagingBefore li").last().removeClass("disabled").css("pointer-events", "auto");
        $("#pagingAfter li").first().addClass("disabled").css("pointer-events", "none");
        $("#pagingAfter li").last().removeClass("disabled").css("pointer-events", "auto");
    }
    else if (this.currentPage >= (this.trList.length / this.numberPerPage)) {
        $("#pagingBefore li").first().removeClass("disabled").css("pointer-events", "auto");
        $("#pagingBefore li").last().addClass("disabled").css("pointer-events", "none");
        $("#pagingAfter li").first().removeClass("disabled").css("pointer-events", "auto");
        $("#pagingAfter li").last().addClass("disabled").css("pointer-events", "none");
    }
    else {
        $("#pagingBefore li").first().removeClass("disabled").css("pointer-events", "auto");
        $("#pagingBefore li").last().removeClass("disabled").css("pointer-events", "auto");
        $("#pagingAfter li").first().removeClass("disabled").css("pointer-events", "auto");
        $("#pagingAfter li").last().removeClass("disabled").css("pointer-events", "auto");
    }
};
