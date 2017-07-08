function initData(st,et,source_type,_table){
    var chart = echarts.init(document.getElementById("main"));
    var xAxis = [];
    var yAxis = [];
    var token = "Bearer "+localStorage.getItem("token");
    $('.startTime').val(st);
    $('.endTime').val(et);
    et = format((new Date(et)).getTime(),"MM/dd/yyyy");
    st = format((new Date(st)).getTime(),"MM/dd/yyyy");
    chart.showLoading({
        text : '数据获取中',
        maskColor:'#4c4c4c',
        textColor:'#fff'
    });
    var obj = {
            source: '西南石油大学',
            data : source_type,
            beginTime :st,
            endTime : et,
            table : _table
        };
    $.ajax({
        url: '/event/chart',
        //url: 'http://127.0.0.1:8888/' + new Date().getTime(),
        type: 'get',
        dataType: 'json',
        beforeSend:function(request) {
            request.setRequestHeader("Authorization", token);
        },
        data:{
            source: '西南石油大学',
            data : source_type,
            beginTime :st,
            endTime : et,
            table : _table
        },
        success : function(date) {
            chart.hideLoading();
            $.each(date, function(index, val) {
                 xAxis.push(val.x.slice(-5));
                 yAxis.push(val.y);
            });
            initEchart(xAxis,yAxis,chart);
        },
        error : function(xhr) { 
            if (xhr.status==400) {
                alert("日期错误或者没有相关数据");
            }else{
                alert("请求失败!");
            }
        }
    });
}
    $(".select_drop").hide();

    $('.select_btn').click(function(e) {
        /* 鼠标点击事件 */
        var $ul = $(e.currentTarget).find("ul");
        if ( !$ul.is(":animated") ){
            if ($ul.css('display')=="none") {
                $ul.slideDown(150);
            }else{
                $ul.slideUp(150);
            }
        }
    });

    $(".select_btn").hover(function(e) {
        /* 鼠标悬浮事件 */
        e.stopPropagation;
        var $ul = $(e.currentTarget).find("ul");
        if ( !$ul.is(":animated") ){
            $ul.slideDown(150);
        }
    }, function(e) {
        /* 鼠标离开事件 */
        e.stopPropagation;
            $(e.currentTarget).find("ul").slideUp(150);
        // var $ul = $(e.currentTarget).find("ul");
        // if ( !$ul.is(":animated") ){
        // }
    });

function currMonth(){ //选中当前月份
    var _month = (new Date()).getMonth();
    $('.toTable_month_table tr td').each(function(index, el) {
        $(el).removeClass('toTable_month_onlight');
        if ($(el).attr("data-month")==_month) {
            $(el).addClass('toTable_month_onlight');
        };
    });
}

(function(){  //初始化月份选择、绑定事件
    var $mouth_wrap = $("<tbody></tbody>");
    var $tr;
    for(i = 1,j = 2; j<=12; i++,j++){
        if (i==1||i==5||i==9) {
            $tr = $('<tr></tr>');
            $mouth_wrap.append($tr);
        }
        $tr.append("<td data-month="+i+">"+i+"-"+j+"月</td>");
    }
    $(".toTable_month_table").append($mouth_wrap);
    currMonth();
    $('.toTable_month_table tr td').click(function(event) {
        /* 月份选择 */
        $('.toTable_month_table tr td').removeClass('toTable_month_onlight');
        $(this).addClass('toTable_month_onlight');
    });
    $(".toTable").click(function(event) {
        /* 显示时间段选择框 */
        $('.toTable_month').fadeIn(200);
        popUps("toTable_month");
    });
    var _year = true;
    $('.toTable_month_year').click(function(event) {
        /* 切换年份 */
        if (_year) {
            $(this).text("2016").removeClass('year_17').addClass('year_16');
            _year = !_year;
        }
        else{
            $(this).text("2017").removeClass('year_16').addClass('year_17');
            _year = !_year;
        }
      
    });

    $('.initForm').click(function(event) {
        /* 下载文档 */
        var token = "Bearer " + localStorage.getItem("token");
        var _month = $(".toTable_month_onlight").attr("data-month");
        var year = _year ? 2017 : 2016;
        var url = "/event/report/" + year + "/" + _month;
        var fileName = "西南石油大学"+ year + "年" + _month +"-"+(_month+1)+"月舆情报表"; //
        $.ajax({
            url: url,
            type: 'GET',
            beforeSend:function(request) {
                request.setRequestHeader("Authorization" , token);
            },
            success:function(data){
                var a = document.createElement('a');
                a.setAttribute('href' , url);
                a.setAttribute('download' ,  fileName);
                console.log(a);
                a.click();
                $(a).remove();
            },
            error:function(xml){
                error(xml);
            }
        });
    });

})();
(function(){
    var $user = $('.header_user');
    var userName = localStorage.getItem("userName");
    $user.append("<span>欢迎 普通用户 "+userName+" </span>");
    $user.append("<span><a href='javascript:void(0);' onclick='signOut(true);'>注销</a></span>");
    $user.append("<a href='javascript:void(0);' class='big-link' data-reveal-id='control-wrap' data-animation='fade'>权限管理</a>");
    $('.chart_date_input').keydown(function(event) {
        /* Act on the event */
        return false;
    });
})();
function signOut(flag){
    if (flag) {
        if (confirm("确认注销,并返回登录界面？")) {
            localStorage.removeItem("userName");
            localStorage.removeItem("token");
            window.location.href = "http://182.150.37.58:81/Baidu/BDo-Login.html";
        }
    }
    else{
        localStorage.removeItem("userName");
            localStorage.removeItem("token");
            window.location.href = "http://182.150.37.58:81/Baidu/BDo-Login.html";
    }
}
function checkDate(){
    var startTime = $('.startTime').val(); //开始时间
    var endTime = $('.endTime').val();  //结束时间
    var source_type = $('#source_name').text();
    var table = $(".wrap")[0].getAttribute('data-table'); //
    if (startTime!=""&&endTime!=""){
        var et = endTime.substr(0, 4)+endTime.substr(5, 2)+endTime.substr(8, 2);
        var st = startTime.substr(0, 4)+startTime.substr(5, 2)+startTime.substr(8, 2);
        if(Number(et)-Number(st)>0){
                initData(startTime,endTime,source_type,table);
                //alert("日期选择正确");
        }
        else{
            alert("日期选择错误");
        }
    }
}
function initEchart(xAxis,data,chart){  //图表初始化
    var maxY = eval("Math.max(" + data.toString() + ")");
    var MaxY = Math.ceil((maxY+(maxY/4))/10)*10;
    var source_type = $('#source_name').text();
    var option ={
        tooltip:{
            show:true,
            trigger:'axis'
        },
        grid:{
            top:'7%',
            bottom:'10%',
            left:'3%',
            right:'3%'
        },
        // toolbox: {
        //     show: true,
        //     right:'3%',
        //     feature: {
        //         myTool:{
        //             show:true,
        //             title:'导出报表',
        //             icon:'image://http://echarts.baidu.com/images/favicon.png',
        //             onclick:function(){
        //                 alert("暂时未实行该功能");
        //             }
        //         },
        //         dataZoom: {
        //             yAxisIndex: 'none'
        //         },
        //         dataView: {readOnly: false},
        //         magicType: {type: ['line', 'bar']},
        //         restore: {},
        //         saveAsImage: {}
        //         }
        // },
        xAxis: {
            type: 'category',
            data: xAxis,
            boundaryGap : true,
            axisLine: { lineStyle: { color: '#777' } },
            //interval:2,
            axisTick:{    //x轴刻度
                interval:0
            },
            // min: 0,
            // max: 21,
            axisLabel:{ //x轴标签
                //interval:2,
                textStyle:{
                    color:'#000',
                    fontSize:12
                }
            },
            axisPointer: {
                show: true
            }
    },
        yAxis: {
            type: 'value',
            min:0,
            max:MaxY,
            splitNumber:5,
            axisLabel:{ 
                textStyle:{
                    color:'#000',
                    fontSize:12
                }
            }
        },
        series:{
            markPoint: {
                data: [
                    {type: 'max', name: '最大值'}
                ]
            },
            name:source_type,
            type:'line',
            lineStyle:{normal:{color: '#d71f1b',width:2} },
            itemStyle:{normal:{color: '#720603'}},
            data: data
            }
    }
    chart.setOption(option);
    window.onresize = function () {
        chart.resize();  //echarts 图表自适应
    }
}
function getSumPage(uri){   //  获取总页数
    var $pageWrap = $(".page_wrap");
    $pageWrap.children().remove();
    $pageWrap.append('<div class="zxf_pagediv"></div>');
    //重置事件绑定
    var token = "Bearer "+localStorage.getItem("token");
     $.ajax({
         url: uri,
         type: 'get',
         dataType: 'json',
         beforeSend:function(request) {
            request.setRequestHeader("Authorization", token);
         },
         success:function(page){
            sumPage = page;
            $(".zxf_pagediv").createPage({
                pageNum: page,//总页码
                current: 1,//当前页
                shownum: 9,//分页数
                activepaf: "",
                backfun: function(e) {
                        updata(e.current);
                }
            });
            // $("#page_test").Page({
            //   totalPages: page,//分页总数
            //   liNums: 7,//分页的数字按钮数(建议取奇数)
            //   activeClass: 'activP', //active 类样式定义
            //   callBack : function(page){
            //         updata(page);
            //   }
            // });
         },
         fail:function(){
            alert("总页数请求失败");
        }
     });
}
function onPage(aim){
    $(".page_num:eq("+(aim-1)+")").addClass('onPage').parent().siblings().children('.page_num').removeClass('onPage');
}
function pageGoto(e){
    var toPage = $('.pageInput').val();
    var onPage = $('.pagingUI li a:contains('+toPage+')');
    if(e && e.keyCode==13){ // enter 键
        updata($('.pageInput').val());
        if (onPage.length == 1){
            onPage.trigger('click');
        }
        // else{
        //     $.each($('.pagingUI li a'), function(index, val) {
        //          /* iterate through array or object */
                 
        //     });
        // }
    }
}
function hideOnlight(){
    $('.select_drop li').show();
    $('.select_drop li').each(function(index, val) {
         /* iterate through array or object */
         if($(val).text()==$(val).parent().siblings().text()){
            $(val).hide();
        };
    });
}
function changeSelect(){  
    var type = new Array;
    type["微博"] = ["微博数据来源1","微博数据来源2","微博数据来源3"];
    type["微信"] = ["微信数据来源1","微信数据来源2","微信数据来源3"];
    type["百度贴吧"] = ["发帖量","跟帖量"];

    var typeName = $('.source_type').text();
    $(".source_name_ul").children().remove();
    for(var ver in type[typeName]){
        $(".source_name_ul").append("<li>"+type[typeName][ver]+"</li>");
    }
    $('#source_name').text($('.source_name_ul li:first-child').text());  // 统计量
    hideOnlight();

    $(".select_drop li").click(function(e) {
        $(e.target).parent().siblings(".select_tap").text($(e.target).text());
        $(".select_btn").trigger('mouseleave');
        hideOnlight();
    });  //选中li即显示

    $(".select_type li").click(function(event) {
        changeSelect();
    });  //数据来源 点击切换数据类型
    $(".source_name_ul li").click(function(event) {
        checkDate();
    });
    // var source = document.getElementById("source_name");
    // source.options.length = 0 ;
    // for(var ver in type[typeName]){
    //     source.options.add(new Option(type[typeName][ver],ver+1));
    // }
}
// function pageSel(Page){
//     var pageList = makePageList(sumPage);  //获取下拉框页字符数组
//     var select = document.getElementById("selec");  
//      for(var i=0;i<pageList.length;i++) 
//     { 
//         select.options.add(new Option(pageList[i],i+1));
//     }   //下拉框添加选项
// }
// function pageCis(Page){
//     var $li = $("<li></li>");
//     Page=Page>15?15:Page;

//     for(var i = 1;i<=5;i++){
//         $(".pageCis").append("<li><a class='page_num'>"+i+"</a></li>");
//     }
//     if (sumPage>5){$(".pageCis").append("<li><a class='page_char'>...</a></li>")};
// }
// function makePageList(sumPage){
//     var pageList = [];
//     for(var i = 1;i<=sumPage;i++){
//         pageList.push("第"+i+"页");
//     }
//     return pageList;
// }
// function nextPage(){
//     if(currPage==sumPage){
//             alert("已至最后页");
//         }
//         else{
//             updata(++currPage);
//         }
// }
// function prePage(){
//     if(currPage==1){
//             alert("已至第一页");
//         }
//         else{
//             updata(--currPage);
//         }
// }
function popUps(ancestor){  //弹窗
    var oneTime = false;
    $(document).click(function(event) {
        /* Act on the event */
        //event.stopPropagation();
        var $aim = $(event.target);
        if($aim.parents().filter('section').prop('className')!=ancestor && oneTime ){
            $('#rollback').trigger('click');
            $('.toTable_month').fadeOut(200);
        }
        else{
            oneTime = true;
        }
    });
}
function format(mTime,mat){  //将毫秒时间时间格式化为mat
    if (arguments.length==1) {
        var format = "MM-dd hh:mm"; //默认日期格式
    }
    else{
        var format = mat; 
    }
    if (mTime==null) {
        return " "; 
    }
    var time = new Date(mTime);
    var o = {
      "M+" : time.getMonth()+1, //month
      "d+" : time.getDate(), //day
      "h+" : time.getHours(), //hour
      "m+" : time.getMinutes(), //minute
      "s+" : time.getSeconds(), //second
      "q+" : Math.floor((time.getMonth()+3)/3), //quarter
      "S" : time.getMilliseconds() //millisecond
      }
      if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
      (time.getFullYear()+"").substr(4- RegExp.$1.length));
      for(var k in o)if(new RegExp("("+ k +")").test(format))
      format = format.replace(RegExp.$1,
      RegExp.$1.length==1? o[k] :
      ("00"+ o[k]).substr((""+ o[k]).length));
      return format;
}
function error(XMLHttpRequest){
    if(XMLHttpRequest.status==500){
       alert("服务器内部错误");
    }
    else if(XMLHttpRequest.status==401){
        if ( confirm("请登录") ) {
            signOut(false);
        }
        else{
            signOut(false);
        }
    }
    else if (XMLHttpRequest.status==404) {
        alert("沒有该资源");
    }
    else {
        alert("请求失败");
        console.log(XMLHttpRequest);
    }
}
