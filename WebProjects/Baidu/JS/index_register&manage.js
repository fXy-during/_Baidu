(function(){
    onRole();
    $('.control-section-admini').css({
        left: "-400px",
        opacity: 0
    });
    
    $('.control-btn-manage').click(function(event) {
        /* Act on the event */
        $('.control-btn-register').removeClass('Onlight_control_title');
        $('.control-tri-top').removeClass('Onlight_tri_top');

        $('.control-btn-manage').addClass('Onlight_control_title');
        $('.control-tri-bottem').addClass('Onlight_tri_bottem');
        

        $('.control-section-admini').animate({
            left: 0,
            opacity : 1
        }, 500);

        $('.control-section-register').animate({
            left: "400px",
            opacity : 0
        }, 500);
        $('.control-section-admini').show();
        setTimeout(function(){
            $('.control-section-register').hide();
        }, 400);

    });

    $('.control-btn-register').click(function(event) {
        /* Act on the event */
        $('.control-btn-manage').removeClass('Onlight_control_title');
        $('.control-tri-bottem').removeClass('Onlight_tri_bottem');
        
        $('.control-btn-register').addClass('Onlight_control_title');
        $('.control-tri-top').addClass('Onlight_tri_top');

        $('.control-section-admini').animate({
            left: "-400px",
            opacity : 0
        }, 500);
        
        $('.control-section-register').animate({
            left: 0,
            opacity : 1
        }, 500);
        $('.control-section-register').show();
        setTimeout(function(){
            $('.control-section-admini').hide();
        }, 400);

    });

    $('.control-btn-register').trigger('click');

    $('.control-btn-role-save').click(function(event) {
        /* Act on the event */
        alert("功能暂未开放");
    });

})()
function onRole(){
    $('.changeRole').unbind('click');
    $('.changeRole').click(function(e) {
        /* Act on the event */
            let type = $(e.target).parents('.control-flag').attr('data-type');
            let $tar = $(e.target).parents('li');
            if (type == "normal") {
                $tar.remove();
                $('.ul-special').append($tar.children('span').removeClass('control-icon-up').addClass('control-icon-down').end());
                onRole();
            }else{
                $tar.remove();
                $('.ul-normal').append($tar.children('span').removeClass('control-icon-down').addClass('control-icon-up').end());
                onRole();
            }
    });
}