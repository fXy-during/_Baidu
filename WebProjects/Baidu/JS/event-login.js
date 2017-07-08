
define(['jquery','error'],function($,error){

    $("#check").click(function(event) {
        var userName = $("input[name=name]").val();
        var pw = $("input[name=pw]").val();
        if (this.checked) {
            localStorage.setItem("loginName",userName);
            localStorage.setItem("loginPw",pw);
        }
        else{
            localStorage.setItem("loginName",null);
        }
    });
    

    $('.login_btn').click(function(event) {
        /* Act on the event */
        var id = $('input[name=name]').val();
        var pw = $('input[name=pw]').val();
        var obj = {
            username : id,
            password : pw
        };
        $.ajax({
            url: '/event/login',
            type: 'post',
            dataType: 'json',
            contentType:"application/json;charset=utf-8",
            data: JSON.stringify(obj),
            complete:function(XML,msg){
                    if (msg=="success") {
                        var resp = JSON.parse(XML.responseText);
                        localStorage.setItem("token",resp.token);
                        localStorage.setItem("userName",resp.username);
                        console.log(localStorage.getItem("token"));
                        window.location.href="http://182.150.37.58:81/Baidu/BDo-Ana.html";
                    }
                    else{
                        error.catchError(XML);
                    }
                }
        });/*ajax*/
    });/*click*/

    var eventTap = "loginBtn && rememberID";

    return {
        eventTap : eventTap
    } 

});
