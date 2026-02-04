$.ajaxSetup({
    headers: {
        "X-CSRF-TOKEN": $('meta[name="_csrf"]').attr("content"),
    },
});

function isNotNull(str) {
    return !isNull(str);
}
function isNull(str) {
    if (str == null) return true;
    if (str == "NaN") return true;
    if (new String(str).valueOf() == "undefined") return true;
    var chkStr = new String(str);
    if (chkStr.valueOf() == "undefined") return true;
    if (chkStr == null) return true;
    if (chkStr.toString().length == 0) return true;
    return false;
}

function validationEmail(email) {
    if (email.length < 4) {
        return false;
    }
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}
function validationName(str,num) {
    if(str.replace(/ /g,'').length<num){
        return false;
    }
    return true;
}
function validationPhone(str,num) {
    if(str.replace(/ /g,'').length<num){
        return false;
    }
    return true;
}

function ComSubmit(opt_formId) {
    this.formId = isNull(opt_formId) == true ? "commonForm" : opt_formId;
    this.url = "";
    this.method = "GET";
    if (this.formId == "commonForm") {
        $("#commonForm")[0].reset();
    }

    this.setUrl = function setUrl(url) {
        this.url = url;
    };

    this.setMethod = function setMethod(url) {
        this.method = url;
    };
    this.addParam = function addParam(key, value) {
        if (
            $("#" + this.formId)
                .find('[name="' + key + '"]')
                .val()
        ) {
            $("#" + this.formId)
                .find('[name="' + key + '"]')
                .val(value)
                .attr("id", key);
        } else {
            $("#" + this.formId).append($("<input type='hidden' name='" + key + "' id='" + key + "' value='" + value + "' >"));
        }
    };

    this.submit = function submit() {
        var frm = $("#" + this.formId)[0];
        frm.action = this.url;
        frm.method = this.method;
        frm.submit();
    };
}
$(document).on("click", ".custom_select_area ul>li>a", function () {
    if ($(this).data("value")) {
        $(this).closest(".custom_select_area").find("[type=text]").val($(this).data("value"));
    } else {
        $(this).closest(".custom_select_area").find("[type=text]").val($(this).text());
    }
});

function decodeUrl(str, delimiter = "str") {
    var ret = "";
    if (str) {
        ret = decodeURIComponent(str.replace(/\+/g, " "));
        if (delimiter == "money") {
            ret = ret.toLocaleString("ko-KR");
        } else if (delimiter == "table" || delimiter == "html") {
        } else {
            ret = ret.replace(/(?:\r\n|\r|\n)/g, "<br>");
        }
    }
    return ret;
}

function getParamMap() {
    let queryString = location.search;
    let param = {};
    if (queryString.length) {
        let splited = queryString.replace("?", "").split(/[=?&]/);
        for (let i = 0; i < splited.length; i++) {
            param[splited[i]] = splited[++i];
        }
    }
    return param;
}


function updateQueryStringParam(key, value) {
    var baseUrl = [location.protocol, "//", location.host, location.pathname].join("");
    var urlQueryString = document.location.search;
    var newParam = key + "=" + value,
        params = "?" + newParam;
    // If the "search" string exists, then build params from it
    if (urlQueryString) {
        keyRegex = new RegExp("([?&])" + key + "[^&]*");
        // If param exists already, update it
        if (urlQueryString.match(keyRegex) !== null) {
            params = urlQueryString.replace(keyRegex, "$1" + newParam);
        } else {
            // Otherwise, add it to end of query string
            params = urlQueryString + "&" + newParam;
        }
    }
    var hash = "";
    if (window.location.hash) {
        hash = window.location.hash;
    }
    window.history.replaceState({}, "", baseUrl + params + hash);
}

function deleteQueryStringParam(key) {
    var baseUrl = [location.protocol, "//", location.host, location.pathname].join("");
    params = new URLSearchParams(document.location.search);
    params.delete(key);
    var queryString = "";
    if (params.toString().length > 0) {
        queryString = "?" + params.toString();
    }
    window.history.replaceState({}, "", baseUrl + queryString);
}

function toTitleYear(str, delimiter = "year") {
    var regExp = /\(([^)]+)\)/;
    var matches = regExp.exec(str);
    var ret = "";

    if (matches != null) {
        ret = matches[1];
    }
    if (ret.length > 0) {
        if (ret.split(".").length > 0) {
            var yearSplit = ret.split(".");
            ret = yearSplit[0];
        }
    }
    return ret;
}

var siteCryptoPassphrase = "pass12word";
function jsonEncypt(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), siteCryptoPassphrase).toString();
}
function jsonDecypt(data) {
    var bytes = CryptoJS.AES.decrypt(data, siteCryptoPassphrase);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
function strEncypt(data) {
    return CryptoJS.DES.encrypt(data, siteCryptoPassphrase).toString();
}
function strDecypt(data) {
    var bytes = CryptoJS.DES.decrypt(data, siteCryptoPassphrase);
    return bytes.toString(CryptoJS.enc.Utf8);
}

function setDownloadCookie(data) {
    $.cookie("siteDownloadCookie", jsonEncypt(data), { path: "/" });
}

function getDownloadCookie() {
    if ($.cookie("siteDownloadCookie")) {
        return jsonDecypt($.cookie("siteDownloadCookie"));
    } else {
        return null;
    }
}
function removeDownloadCookie() {
    $.removeCookie("siteDownloadCookie", { path: "/" });
}
function trim(str) {
    str = str.replace(/ /g, "");
    return str;
}

function requestPrivacy(frm) {
    var myInfo = getDownloadCookie();
    var formName = $("[name=" + frm + "]");
    if (myInfo != null) {
        formName.find("[name=company]").val(myInfo.company);
        formName.find("[name=email]").val(myInfo.email);
        formName.find("[name=name]").val(myInfo.name);
        formName.find("[name=nation]").val(myInfo.nation);
        formName
            .find(".custom_select_area .current")
            .attr("title", myInfo.nation)
            .text(formName.find(".custom_select_area ul [data-value=" + myInfo.nation + "]").text());
        formName
            .find(".custom_select_area ul [data-value=" + myInfo.nation + "]")
            .closest("li")
            .addClass("active");
        formName.find("[name=department]").val(myInfo.department);
        formName.find("[name=tel]").val(myInfo.tel);
        if (myInfo.agree === true) {
            formName.find("[name=agree]").prop("checked", true);
        }
    }
}
function thisLang(){
    return document.location.pathname.split("/").slice(1, 2).toString();
}

function fromYearMonthStamp(UNIX_timestamp, delimiter = '-') {
    var source = new Date(UNIX_timestamp);
    var year = source.getFullYear();
    var month = source.getMonth() + 1;
    var day = source.getDate();
    if (month.toString().length < 2) {
        month = '0' + month;
    }
    if (day.toString().length < 2) {
        day = '0' + day;
    }
    return [year, month, day].join(delimiter);
}
function fromTimeStamp(UNIX_timestamp, delimiter = '-') {
    var source = new Date(UNIX_timestamp);
    var year = source.getFullYear();
    var month = source.getMonth() + 1;
    var day = source.getDate();
    if (month.toString().length < 2) {
        month = '0' + month;
    }
    if (day.toString().length < 2) {
        day = '0' + day;
    }
    return [year, month, day].join(delimiter);
}

function toStringByFormatting(source, delimiter = '-') {
    var year = source.getFullYear();
    var month = source.getMonth() + 1;
    var day = source.getDate();
    if (month.toString().length < 2) {
        month = '0' + month;
    }
    if (day.toString().length < 2) {
        day = '0' + day;
    }
    return [year, month, day].join(delimiter);
}

function toStringByTimeFormatting(UNIX_timestamp, delimiter = '-', type = 'hhmmss') {
    var source = new Date(UNIX_timestamp);
    var year = source.getFullYear();
    var month = source.getMonth() + 1;
    var day = source.getDate();
    var week = source.getDay(); // 요일
    if (month.toString().length < 2) {
        month = '0' + month;
    }
    if (day.toString().length < 2) {
        day = '0' + day;
    }
    var date = [year, month, day].join(delimiter);

    var hours = source.getHours();
    var minutes = source.getMinutes();
    var seconds = source.getSeconds();
    if (hours.toString().length < 2) {
        hours = '0' + hours;
    }
    if (minutes.toString().length < 2) {
        minutes = '0' + minutes;
    }
    if (seconds.toString().length < 2) {
        seconds = '0' + seconds;
    }

    var weekDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var ret = '';
    var time = [hours, minutes, seconds].join(":");
    if (type == 'hhmm') {
        time = [hours, minutes].join(":");
    } else if (type == 'onlyhhmm') {
        time = [hours, minutes].join(":");
        ret = time;
    } else if (type == 'weekhhmm') {
        time = [hours, minutes].join(":");
        date = date + '(' + weekDay[week] + ')'
        ret = date + ' ' + time;
    } else if (type == 'yearmonthdayweek') {
        date = [year, month, day].join(delimiter);
        time = [hours, minutes].join(":");
        date = date + ' (' + weekDay[week] + ')'
        ret = date;
    } else if (type == 'monthdayweek') {
        date = [month, day].join(delimiter);
        time = [hours, minutes].join(":");
        date = date + ' (' + weekDay[week] + ')'
        ret = date;
    } else if (type == 'monthdayweektime') {
        date = [month, day].join(delimiter);
        time = [hours, minutes].join(":");
        date = date + '(' + weekDay[week] + ')'
        ret = date + ' ' + time;
    } else if (type == 'datehhmm') {
        time = [hours, minutes].join(":");
        ret = date + ' ' + time;
    } else if (type == 'date') {
        ret = date;
    } else {
        ret = date + ' ' + time;
    }
    return ret;
}


function toStringByDateShort(UNIX_timestamp, delimiter = 'mm') {
    var source = new Date(UNIX_timestamp);
    var year = source.getFullYear();
    var month = source.getMonth() + 1;
    var day = source.getDate();
    if (month.toString().length < 2) {
        month = '0' + month;
    }
    if (day.toString().length < 2) {
        day = '0' + day;
    }
    var ret = '';
    if (delimiter == 'yyyy') {
        ret = year;
    } else if (delimiter == 'mm') {
        ret = month;
    } else if (delimiter == 'dd') {
        ret = day;
    }
    return ret;
}

function toStringByKorean(source, delimiter = 'long') {
    var year = source.getFullYear();
    var month = source.getMonth() + 1;
    var day = source.getDate();
    if (delimiter == 'short') {
        year = year.toString().substr(-2);
    }
    if (month.toString().length < 2) {
        month = '0' + month;
    }
    if (day.toString().length < 2) {
        day = '0' + day;
    }
    return year + '년 ' + month + '월 ' + day + '일';
}

function toStringByEnglish(source, delimiter = 'long') {
    var year = source.getFullYear();
    var month = source.getMonth() + 1;
    var day = source.getDate();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (delimiter == 'short') {
        year = year.toString().substr(-2);
    }
    if (day.toString().length < 2) {
        day = '0' + day;
    }
    return monthNames[source.getMonth()] + ' ' + day + ', ' + year; //year+'년 '+month+'월 '+day+'일';
}
function youtubeId(url) {
    var tag = "";
    if(url)  {
        if(url.indexOf("youtube.com") > -1|| url.indexOf("youtu.be") > -1) {
            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
            var matchs = url.match(regExp);
            if (matchs) {
                tag = matchs[7];
            }
            return tag;
        }else{
            return url;
        }
    }
}
let openSearchCount = 0;
function openSearch(){
    let jsonData = {};
    if(openSearchCount===0){
        $.ajax({
            type: 'POST',
            url:'/'+thisLang()+'/keyword',
            data: jsonData,
            dataType: 'json',
            async: true,
            cache :false,
            success: function(data){
                let ticker = '';
                let count = 0;
                $.each(data.list,function(index,item){
                    ticker += '<a href="/'+thisLang()+'/search?q='+item+'" class="tag">#'+decodeUrl(item)+'</a>';
                    count++;
                });
                if(count===0){
                    $('.tag_wrap').hide();
                }else{
                    $('.tag_wrap dd').html(ticker);
                }
                openSearchCount++;
            },
            error:function(xhr,status,error){
                console.log( "관리자에게 문의하시기 바랍니다." );
            }
        });
    }

}

function paginationJs(page_no,page_count,total_count,total_page,type='type2',theme='theme1'){
    // page_count = recordCountPerPage : 한 페이지당 게시되는 게시물 건 수.
    // page_size = pageSize : 한 페이지당 게시되는 게시물 건 수.
    var jsPaging = '';
    page_size = 10;
    var ismobile = false;
    if(windowWidth < 767 || isTouchDevice){
        ismobile = true;
        page_size = 5;
    }
    if(total_count>0){
        var last = Math.ceil(page_no / page_size) * page_size;
        if (last > total_page) last = total_page;
        var first = last - (page_size - 1) <= 0 ? 1 : last - (page_size - 1);

        if(ismobile){
            jsPaging += '    <div class="paging_wrap">';
            jsPaging += '        <div class="btns">';
            if(page_no>1){
                jsPaging += '            <a href="javascript:fn_page(1);" class="first_page">처음 페이지</a>';
            }else{
                jsPaging += '            <a href="javascript:void(0);" class="first_page">처음 페이지</a>';
            }
            if(page_no>1){
                jsPaging += '            <a href="javascript:fn_page('+(page_no-1)+');" class="prev_page">이전 페이지</a>';
            }else{
                jsPaging += '            <a href="javascript:void(0);" class="prev_page">이전 페이지</a>';
            }
            jsPaging += '        </div>';
            jsPaging += '        <div class="numbers">';
            jsPaging += '            <ul>';
            for(var i=first; i<=last; i++){
                if(page_no==i){
                    jsPaging += '        <li class="active"><span class="num">'+i+'</span></li>';
                }else{
                    jsPaging += '        <li><a href="javascript:fn_page('+i+');" class="num">'+i+'</a></li>';
                }
            }
            jsPaging += '            </ul>';
            jsPaging += '            <div class="total">'+total_page+'</div>';
            jsPaging += '        </div>';

            jsPaging += '        <div class="btns">';
            if(page_no<total_page){
                jsPaging += '            <a href="javascript:fn_page('+(page_no+1)+');" class="next_page">다음 페이지</a>';
            }else{
                jsPaging += '            <a href="javascript:void(0);" class="next_page">다음 페이지</a>';
            }
            if(page_no<total_page){
                jsPaging += '            <a href="javascript:fn_page('+total_page+');" class="last_page">마지막 페이지</a>';
            }else{
                jsPaging += '            <a href="javascript:void(0);" class="last_page">마지막 페이지</a>';
            }
            jsPaging += '        </div>';
            jsPaging += '    </div>';
        }else{
            jsPaging += '    <div class="paging_wrap">';
            jsPaging += '        <div class="btns">';
            if(page_no>1){
                jsPaging += '            <a href="javascript:fn_page(1);" class="first_page">처음 페이지</a>';
            }else{
                jsPaging += '            <a href="javascript:void(0);" class="first_page">처음 페이지</a>';
            }
            if(page_no>1){
                jsPaging += '            <a href="javascript:fn_page('+(page_no-1)+');" class="prev_page">이전 페이지</a>';
            }else{
                jsPaging += '            <a href="javascript:void(0);" class="prev_page">이전 페이지</a>';
            }
            jsPaging += '        </div>';
            jsPaging += '        <div class="numbers">';
            jsPaging += '            <ul>';
            for(var i=first; i<=last; i++){
                if(page_no==i){
                    jsPaging += '        <li class="active"><span class="num">'+i+'</span></li>';
                }else{
                    jsPaging += '        <li><a href="javascript:fn_page('+i+');" class="num">'+i+'</a></li>';
                }
            }
            jsPaging += '            </ul>';
            jsPaging += '            <div class="total">'+total_page+'</div>';
            jsPaging += '        </div>';

            jsPaging += '        <div class="btns">';
            if(page_no<total_page){
                jsPaging += '            <a href="javascript:fn_page('+(page_no+1)+');" class="next_page">다음 페이지</a>';
            }else{
                jsPaging += '            <a href="javascript:void(0);" class="next_page">다음 페이지</a>';
            }
            if(page_no<total_page){
                jsPaging += '            <a href="javascript:fn_page('+total_page+');" class="last_page">마지막 페이지</a>';
            }else{
                jsPaging += '            <a href="javascript:void(0);" class="last_page">마지막 페이지</a>';
            }
            jsPaging += '        </div>';
            jsPaging += '    </div>';
        }

    }else{
        let prevPage = page_no - 1;
        if(prevPage<=1){
            prevPage=1;
        }
        let nextPage = page_no + 1;
        if(nextPage>total_page){
            nextPage = total_page;
        }
		jsPaging += '<div class="paging_wrap">';
        jsPaging += '        <div class="btns">';
        jsPaging += '            <a href="javascript:;" class="first_page">처음 페이지</a>';
        jsPaging += '            <a href="javascript:;" class="prev_page">이전 페이지</a>';
        jsPaging += '        </div>';
        jsPaging += '        <div class="numbers">';
        jsPaging += '        <ul>';
        jsPaging += '        <li class="active"><span>1</span></li>';
        jsPaging += '        </ul>';
        jsPaging += '        <div class="total">'+total_page+'</div>';
        jsPaging += '        </div>';
        jsPaging += '        <span class="btns">';
        jsPaging += '            <a href="javascript:;" class="next_page">다음 페이지</a>';
        jsPaging += '            <a href="javascript:;" class="last_page">마지막 페이지</a>';
        jsPaging += '        </span>';
        jsPaging += '</div>';
    }
    return jsPaging;
}

function totalSearch() {
    if($('#header').find('.search_input').val() == ''){
        $('#header').find('.not_entered').show();
    }else{
        $('#header').find('.not_entered').hide();
        location.href = '/kr/search?q=' + $('#searchKeyword').val();
    }
}
function unescapeHtml(str) {
    if (str == null) {
        return "";
    }
    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&#39;/g, "'");
}