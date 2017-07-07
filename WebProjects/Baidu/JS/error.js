define(function(){

    var errorState ; 
    var catchError = function(XMLHttpRequest){
        errorState = XMLHttpRequest.status;
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
        else if(XMLHttpRequest.responseText=="没有该用户信息，请确认后登录"){
            alert("没有该用户信息，请确认后登录");
        }
        else if(XMLHttpRequest.responseText=="请验证用户名和密码"){
            alert("请验证用户名和密码");
        }
        else {
            console.log(XMLHttpRequest);
            alert("请求失败");
        }
    }

    return {
        catchError : catchError,
        errorState : errorState
    };
})