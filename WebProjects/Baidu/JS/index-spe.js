$(document).ready(function() {
    $( ".chart_date_input" ).datepicker();//初始日期组件
    let currDate = new Date();  //获取当前日期
    let table = $(".wrap")[0].getAttribute('data-table');
    initData(format(currDate.getTime()-60*24*60*60*1000,"yyyy-MM-dd"),format(currDate,"yyyy-MM-dd"),'发帖量',table); //获取图表数据点并初始化图标
    changeSelect();
    //getSumPage(); //初始化页码
    //getSumPage('/event/dailyEvent/pageCount'); //待归集事件
    getSumPage('/event/specialEvent/pageCount');//专题事件列表总页数
    updata(1);  //更新专题事件列表
    updata_topic();//获取专题列表
});
var currPage;
function initWholePage(){
    checkDate();//刷新图表
    getSumPage('/event/specialEvent/pageCount');//刷新页码
    updata_topic();  //刷新专题列表
    updata(1);  //更新专题事件列表 
}
function saveSpe(){  //添加专题
    let Tname = $("input[name='Tname']").val();
    let Tarea = $("input[name='Tarea']").val();
    let $Ttaps = $("input[name='tap']");
    if (Tname.length == 0 || Tarea.length == 0 ) {
        alert("请输入完整专题名和地域");
        return ;
    }
    else{
        for(el in $('.innerbox p:first-child') ){
            if ($('.innerbox p:first-child').eq(el).text().trim() == Tname) {
                alert("专题名重复！");
                return;
            }
        }
    }

    let sentry = [];
    let token = "Bearer "+localStorage.getItem("token");
    $Ttaps.each(function(index, el) {
        sentry.push($(el).val());
    });
    let obj = {
            id:0, //添加时传0
            name:Tname,//长度限制45
            region:Tarea,//长度限制45
            rules:sentry //长度限制255
    };
    $.ajax({
        url: '/event/topic/add',
        type: 'POST',
        contentType:"application/json;charset=utf-8",
        dataType: 'json',
        data: JSON.stringify(obj),
        beforeSend:function(request) {
            request.setRequestHeader("Authorization", token);
        },
        complete:(XML)=>{
            if(XML.readyState==4){
                initWholePage();//刷新图表 专题列表 专题事件列表和页码
                $('#rollback').trigger('click'); 
            }
            else{
                console.log(XML);
                alert("添加失败");
            }
        }
    });
}
function topic_del(){  //删除专题
    let goal = $(".innerbox input:checked");
    let logo = [];
    let token = "Bearer "+localStorage.getItem("token");
    $.each(goal,(index, val)=>{
         /* iterate through array or object */
            logo.push( $(val)[0].getAttribute('data-logo') );
            // $('.innerbox').filter(function(){
            //     return $(this).data('logo')==logo;
            // }).remove();
    });
    $.ajax({
        url: '/event/topic/delete',
        type: 'POST',
        dataType: 'json',
        contentType:"application/json;charset=utf-8",
        data:JSON.stringify(logo),
        beforeSend:function(request) {
            request.setRequestHeader("Authorization", token);
        },
        complete:(XML)=>{
            if(XML.readyState==4){
                initWholePage();
            }
            else{
                console.log(XML);
                alert("删除失败");
            }
        }
    });
    
}
function add_tap_input(){  //添加专题标签
    $('.add_input_right').append("<input type='text' name='tap' class='newTap'/>");
    let width_num = 100 / $('.add_input_right input').length-2;
    $('.add_input_right input').css('width',width_num+"%" );
}
function del_tap_input(){   //删除专题标签
    $('.add_input_right input:last()').remove();
    let width_num = 100 / $('.add_input_right input').length-2;
    $('.add_input_right input').css('width',width_num+"%" );
}
function topic_add(){     //添加专题
    $('.addWrap').show();
    popUps("addWrap");
}

function hide(){
    $('.readlyWrap').hide();
    $('.addWrap').hide();
    $(document).unbind('click');
    $('.newTap').remove();
    $(".add_input input").val(" "); //清空所有输入框
    while($('.add_input_right input').length<3){
        $('.add_input_right').append("<input type='text' name='tap'/>");
    }
    $('.add_input_right input').css('width',"30%" );
}
function updata_topic(){  //获取专题列表
    $('.chartSec-left-innerbox div').remove();
    let token = "Bearer "+localStorage.getItem("token");
    $.ajax({
        url: '/event/topic/list',
        type: 'GET',
        dataType: 'json',
        beforeSend:function(request) {
            request.setRequestHeader("Authorization", token);
        },
        success:data=>{
            $.each(data,(index, val)=>{
                 /* iterate through array or object */
                let $div = $("<div class='innerbox'></div>");
                let $p = $("<p></p>");
                $div.append("<p>"+val.name+"</p>");
                $p.append("<span class='topLight'>"+val.region+"</span>");
                $.each(val.rules, (index, el) => {
                     /* iterate through array or object */
                     $p.append("<span>"+el+"</span>");
                });
                $div.append($p);
                $div.append("<input class='add_radio' data-logo="+val.id+" type='checkbox'/>");
                $('.chartSec-left-innerbox').append($div);
            });
        },
        error:XMLHttpRequest=>{
            if(XMLHttpRequest.status!=401){
               alert("列表数据获取失败");
            }
        }
    });
}
function show(obj){
    let oneTime = false;
    console.log('66');
    $('.readlyWrap').show();
    $('.tableAim').remove();
    let $tr = $("<tr class='tableAim'></tr>");
    $tr.append("<td>"+obj.theme+"</td>");
    $tr.append("<td><input class='input_mainView input_show' type='text' value="+obj.mainView+"></td>");
    $tr.append("<td>"+obj.followCount+"</td>");
    $tr.append("<td><input class='input_postType input_show' type='text' value="+obj.postType+"></td>");
    $tr.append("<td>"+format(obj.postTime)+"</td>");
    $tr.append("<td>"+obj.source+"</td>");
    $tr.insertBefore('.readlyBtn');
    $('.tableAim').data('id', obj.id);
    popUps("readlyWrap");  //弹窗蒙层
}
function reClass(id){/* 切换归集状态*/
    $('.pushN').each(function(index, val) {
         var $that = $(this);
         if( ($that.data('info').id)==id ){
            $that.removeClass('pushN');
            $('#rollback').trigger('click');
         }
    });
}    
function collEvent(){  /*  归集 */
    let id = $('.tableAim').data('id');
    let admini = $('.sel_push option:selected').text();
    console.log(admini);
    let token = "Bearer "+localStorage.getItem("token");
    $.ajax({
        url: "/event/dailyEvent/" + id +"/"+admini+ "/collect",
        type: 'POST',
        dataType: 'json',
        beforeSend:function(request) {
            request.setRequestHeader("Authorization", token);
        },
        complete:function(noe,msg){
            reClass(id);
            alert("归集成功");
        }
    });
} 

function updata(page){
    console.log(page);
    currPage = page;
    onPage(page);
    var $table = $('.tableEvent');
    let token = "Bearer "+localStorage.getItem("token");
    $table.children().remove();
    $.ajax({ 
        //url: 'http://127.0.0.1:8888/' + new Date().getTime(),
        //url:'/event/dailyEvent/page/' + page,
        url:'/event/specialEvent/' + page ,
        type: 'get',
        dataType: 'json',
        beforeSend:function(request) {
            request.setRequestHeader("Authorization", token);
        },
        success:data=>{
            $.each(data,(index,val)=>{
                let $tr = $("<tr></tr>");
                if (!val.collectionStatus) {
                    $tr.append("<td><span class='pushN'></span></td>");
                    $table.append($tr);
                    $(".pushN:last").data('info', val).click(function (event) {
                        event.preventDefault();
                        show(val);
                    });
                } else {
                    $tr.append('<td></td>')
                }
                $tr.append("<td><a title=\'"+val.theme+"\' class='Onlight' target='_blank' href=\'"+val.url+"\'>" + val.theme + "</a></td>");
                $tr.append("<td title=\'"+val.mainView+"\'>" + val.mainView + "</td>");
                $tr.append("<td>" + val.postType + "</td>");
                $tr.append("<td>" + format(val.postTime) + "</td>");
                $table.append($tr);
            });
        },
        error:XMLHttpRequest=>{
            error(XMLHttpRequest);
        }
    });
   
}

