$(document).ready(function() {
    $( ".chart_date_input" ).datepicker();//初始日期组件
    var currDate = new Date();  //获取当前日期
    var table = $(".wrap")[0].getAttribute('data-table');
    initData(format(currDate.getTime()-60*24*60*60*1000,"yyyy-MM-dd"),format(currDate,"yyyy-MM-dd"),'发帖量',table); //获取图表数据点并初始化图标 
    changeSelect();  
    getSumPage('/event/dailyEvent/pageCount'); //初始化页码
    updata(1);
});
var currPage = 1;
function hide(){
    $('.readlyWrap').hide();
    $(document).unbind('click');
}
function show(obj){
    var oneTime = false;
    $('.readlyWrap').show();
    $('.tableAim').remove();
    var $tr = $("<tr class='tableAim'></tr>");
    $tr.append("<td>"+obj.theme+"</td>");
    $tr.append("<td><input class='input_mainView input_show' type='text' value="+obj.mainView+"></td>");
    $tr.append("<td>"+obj.followCount+"</td>");
    $tr.append("<td><input class='input_postType input_show' type='text' value="+obj.postType+"></td>");
    $tr.append("<td>"+format(obj.postTime)+"</td>");
    $tr.append("<td>"+obj.source+"</td>");
    $tr.insertBefore('.readlyBtn');
    $('.tableAim').data('id', obj.id);
    // $(document).click(function(event) {
    //         /* Act on the event */
    //         //event.stopPropagation();
    //         var $aim = $(event.target);
    //         if($aim.parents().filter('section').prop('className')!='readlyWrap' && oneTime ){
    //             $('#rollback').trigger('click');
    //         }
    //         else{
    //             oneTime = true;
    //         }
            
    //     });
    popUps("readlyWrap");
}
function reClass(id){
    $('.pushN').each(function(index, val) {
         var $that = $(this);
         if( ($that.data('info').id)==id ){
            $that.removeClass('pushN');
            $('#rollback').trigger('click');
         }
    });
}
function collEvent(){
    var id = $('.tableAim').data('id');
    //var admini = $('.sel_push option:selected').text();
    var token = "Bearer "+localStorage.getItem("token");
    var userName = localStorage.getItem("userName");
    $.ajax({
        url: "/event/dailyEvent/" + id +"/"+userName+ "/collect",
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
    $table.children().remove();
    var token = "Bearer "+localStorage.getItem("token");
    $.ajax({ 
        //url: 'http://127.0.0.1:8888/' + new Date().getTime(),
        url:'/event/dailyEvent/page/' + page,
        type: 'get',
        dataType: 'json',
        beforeSend:function(request) {
            request.setRequestHeader("Authorization", token);
        },
        success:function(data){
            $.each(data,function(index,val){
                var $tr = $("<tr></tr>");
                if (!val.collectionStatus) {
                    $tr.append("<td><span class='pushN'></span></td>");
                    $table.append($tr);
                    $(".pushN:last").data('info', val).click(function (event) {
                        event.preventDefault();
                        show(val);
                    });
                } else {
                    $tr.append('<td></td>');
                }
                $tr.append("<td><a title=\'"+val.theme+"\' class='Onlight' target='_blank' href=\'"+val.url+"\'>" + val.theme + "</a></td>");
                $tr.append("<td title=\'"+val.mainView+"\'>" + val.mainView + "</td>");
                $tr.append("<td>" + val.followCount + "</td>");
                $tr.append("<td>" + val.postType + "</td>");
                $tr.append("<td>" + format(val.postTime) + "</td>");
                $tr.append("<td>" + val.source + "</td>");
                $table.append($tr);
            });
        },
        error:function(data){
            error(data);
        }
    });
   
}
        