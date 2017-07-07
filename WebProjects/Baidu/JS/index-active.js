/* 
* @Author: anchen
* @Date:   2017-07-07 15:51:12
* @Last Modified by:   anchen
* @Last Modified time: 2017-07-07 16:35:56
*/
var active_flag = true;
(function(){
    $('.active-up').click(function(event) {
        /* Act on the event */
    alert("功能调试中");
        if (active_flag) {
            $('.active-icon').removeClass('active-up').addClass('active-down');
            $('.active—chart').animate({
                height: "43px"
            },400);
            $('.active-list').animate({
                height: "605px"
            },400);
            active_flag = !active_flag;
        }else{
            $('.active-icon').removeClass('active-down').addClass('active-up');
            $('.active—chart').animate({
                height: "333px"
            },400);
            $('.active-list').animate({
                height: "334px"
            },400);
            active_flag = !active_flag;
        }
    });
})()