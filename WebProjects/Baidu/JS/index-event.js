$(document).ready(function() {
    $( ".chart_date_input" ).datepicker();//初始日期组件
    let currDate = new Date();  //获取当前日期
    let table = $(".wrap")[0].getAttribute('data-table');
    initData(format(currDate.getTime()-60*24*60*60*1000,"MM/dd/yyyy"),format(currDate,"MM/dd/yyyy"),'发帖量',table); //获取图表数据点并初始化图标
    changeSelect();  
    //getSumPage(); //初始化页码 
    getSumPage('/event/handledEvent/pageCount'); //初始化页码
    updata(1);
});
function toHide(){
    $('.readlyWrap').hide();
    $('.tableEvent tr').removeClass('Onlight_tr');
    reindex();
    $(document).unbind('click');
}
function reindex(){
    $('.tableAim td:eq(0)').remove();
    $('.tableAim td:eq(2)').remove();
    $('.tableAim td:eq(2)').remove();
}
function deal(){  //发送归集请求
    let id = $('.tableAim').data('id');
    let handled = $('.select_handled').text();
    let feedback = $('.select_feedback').text();
    if(handled=="未处置" || feedback=="未反馈"){
        alert("错误处置条件,请检查再试");
        return;
    }
    let currDate = new Date();
    let detail = $('.event_add_detail_input').val();
    let remark = $('.event_add_remark_input').val();
    let obj = {
        id: id,
        theme: "null",
        mainView: "null",
        url: "null",
        handledCondition: handled,
        feedbackCondition: feedback,
        collectedTime: 0,
        handledTime: 0,
        recorder: "null",
        detail: detail,
        remark: remark
    }
    let token = "Bearer "+localStorage.getItem("token");
    //console.log(handled+feedback+detail+remark);
    $.ajax({
        url:  "/event/handledEvent/"+id+"/handle",
        type: 'POST',
        dataType: 'json',
        contentType:"application/json;charset=utf-8",
        data:JSON.stringify(obj),
        beforeSend:function(request) {
            request.setRequestHeader("Authorization", token);
        },
        complete:(XML)=>{
            if(XML.readyState==4){
                $('.Onlight_tr td:eq(7)').text(detail);
                $('.Onlight_tr td:eq(8)').text(remark);
                $(".Onlight_tr td:eq(2)").text(handled);
                $(".Onlight_tr td:eq(3)").text(feedback);
                $(".Onlight_tr td:eq(5)").text( format(currDate.getTime() ) );
                alert("处置成功");
                $('#rollback').trigger('click'); 
            }
            else{
                console.log(XML);
                alert("处置失败");
            }
        }
    });
}

function feedback_input_show(){   //显示具体处置、备注输入框
    $('.event_add_detail').remove();
    $('.event_add_remark').remove();
    $('.tableAim').append("<td class='event_add_detail'><input type='text' class='event_add_detail_input' placeholder="+$('.tableAim').data('detail')+"></td>");
    $('.tableAim').append("<td class='event_add_remark'><input type='text' class='event_add_remark_input' placeholder="+$('.tableAim').data('remark')+"></td>");
}
function feedback_input_hide(){  //隐藏输入框
    $('.event_add_detail').hide();
    $('.event_add_remark').hide();
}
function initFeedBack(){
    let handled = $('.Onlight_tr td:eq(2)').text();
    let feedback = $('.Onlight_tr td:eq(3)').text();
    console.log(handled);
    if (feedback=="已反馈") {
        feedback_input_show(); //显示具体处置、备注输入框
        $('.select_handled').text(handled);
        $('.select_feedback').text(feedback);
    }
    else{
        $('.select_handled').text("未处置");
        $('.select_feedback').text("未反馈");
        feedback_input_hide(); //隐藏输入框
    }
}
$(".select_feedback_ul li").click(function(event) {
    /* Act on the event */
    if ( $(event.target).text()=="已反馈" ) {
        feedback_input_show();
    }
    else{
        feedback_input_hide();
    }
});
function toShow(){
    $('.tableEvent tr:last td:gt(0)').click(function(event) {
        $('.tableEvent tr').removeClass('Onlight_tr');
        $(this).parent().addClass('Onlight_tr');
        if($('.tableAim').children().length>2){
            reindex();
        }
        $('.readlyWrap').show();
        $parent = $(this).parent();  //列表中的tr
        let $sentry_one = $('.tableAim td:first');
        let $sentry_two = $('.tableAim td:eq(1)');
        $sentry_one.before('<td>'+$parent.data('val').theme+'</td>');
        $('.tableAim').data('detail',$parent.data('val').detail);
        $('.tableAim').data('remark',$parent.data('val').remark);
        $('.tableAim').data('feedbackCondition',$parent.data('val').feedbackCondition);
        $('.tableAim').data('id', $parent.data('val').id);
        initFeedBack();  
        popUps("readlyWrap");
        // $(document).click(function(event) { //弹框蒙层点击事件
        //     /* Act on the event */
        //     //event.stopPropagation();
        //     let $aim = $(event.target);
        //     if($aim.parents().filter('section').prop('className')!='readlyWrap' && oneTime ){
        //         $('#rollback').trigger('click');
        //     }
        //     else{
        //         oneTime = true;
        //     }
        // });
    });
}
function updata(page){
    console.log(page);
    currPage=page;
    onPage(page);
    var $table = $('.tableEvent');
    $table.children().remove();
    let token = "Bearer "+localStorage.getItem("token");
    $.ajax({ //http://127.0.0.1:8888/ /event/dailyEvent/page/+page
        //url: 'http://127.0.0.1:8888/' + new Date().getTime(),
        url:'/event/handledEvent/' + page,
        //+ new Date().getTime(),
        type: 'get',
        dataType: 'json',
    beforeSend:function(request) {
            request.setRequestHeader("Authorization", token);
        },
    success:function(data) {
        $.each(data, function(index, val) {
             let $tr =$("<tr></tr>");
             $tr.append("<td><a title=\'"+val.theme+"\' class='Onlight' target='_blank' href=\'"+val.url+"\'>" + val.theme + "</a></td>");
                 $tr.append("<td title=\'"+val.mainView+"\'>"+val.mainView+"</td>");
                 $tr.append("<td>"+val.handledCondition+"</td>");
                 $tr.append("<td >"+val.feedbackCondition+"</td>");
                 $tr.append("<td>"+format(val.collectedTime)+"</td>");
                 $tr.append("<td>"+format(val.handledTime)+"</td>");
                 $tr.append("<td>"+val.recorder+"</td>");
                 $tr.append("<td>"+val.detail+"</td>");
                 $tr.append("<td>"+val.remark+"</td>");
                 $table.append($tr);
                 $tr.data('val', val);
                toShow();
        });
       
    },
    error:function(data){
         error(data);
        }
    });
}