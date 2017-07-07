/**
 * 
 * @authors fxy (you@example.org)
 * @date    2017-06-30 15:37:20
 * @version $Id$
 */

require.config({
    paths : {
        "jquery" : "../jQ/jquery-3.2.1"
    }
});

require(['jquery','event-login'],function($,e){ //注册模块
    localStorage.removeItem("token");  //token
    localStorage.removeItem("userName"); //用户名
    if(localStorage.getItem("loginName")!=null){
        $('input[name=name]').val(localStorage.getItem("loginName"));
        $('input[name=pw]').val(localStorage.getItem("loginPw"));
        $("#check").attr("checked",true);
    }
    
});
