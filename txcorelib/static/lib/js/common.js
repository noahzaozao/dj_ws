/**
 * @description 获取数据
 * @param {URIString} url  需要请求数据的接口地址
 * @param {String} method  需要请求type
 * @param {Object} parm 提交的参数
 * */

window.canRequest = new Array(); //请求条件开关
function _dqRequest(url, method, param, callback) {

	if(window.canRequest[callback] == undefined || window.canRequest[callback]) {
		window.canRequest[callback] = false;
		window.deviceClientWidth = document.body.clientWidth;
		
		if(!param.hasOwnProperty("asyncType")) {
			//同步异步方式
			param.asyncType = true;
		}
		
		if(!param.hasOwnProperty("isLoading")) {
			//大屏设备 请求loading
			param.isLoading = false;
		}
		
		if(!param.hasOwnProperty("csrfmiddlewaretoken")) {
			//csrftoken
			param.csrfmiddlewaretoken = $("input[name='csrfmiddlewaretoken']").val();
		}
		
		//小屏幕设备
		var miniDevice =  window.deviceClientWidth<1200 ? true : false;
		
		//小屏幕导航展开，非退出登录接口禁止请求
		if(miniDevice && typeof header_app !='undefined' && (header_app.mobile_header_nav||header_app.mobile_header_user_data) && (url!="/api/user/logout") ) {
			if(url!="/api/setlang") {
				return;
			}
		}
		
		$.ajax(url, {
			headers: {
				'Accept-Language' : $("input[name='acceptlanguage']").val(),
			},
			data: param,
			crossDomain: true == !(document.all),
			xhrFields: {
				withCredentials: true
			},
			dataType: 'json', //要求服务器返回json格式数据
			type: method, //HTTP请求类型，要和服务端对应，要么GET,要么POST
			timeout: 130000, //超时时间设置为130秒;
			async: param.asyncType, //true异步，false同步
			beforeSend: function() {
				if(miniDevice || param.isLoading) {
					Vue.prototype._beforeSendAjax();
				}
			},
			complete: function (XHR, TS) {
				if(miniDevice || param.isLoading) {
					if(TS=='timeout') {
						toastr.error(gettext("请求数据超时"));
					}
                	Vue.prototype._completeAjax();
            	}
            },
			success: function(response) {
				delete window.canRequest[callback];
				if(response && response.hasOwnProperty('return_code')) {
					callback(response);
				} else {
				}
				if(miniDevice || param.isLoading) {
                	Vue.prototype._completeAjax();
            	}
			},
			error:function(xhr, type, errorThrownhr) {
				if(url=='/api/work/vote' && xhr.status==503) {
					toastr.error(gettext("您的操作太频繁了，请稍后再试。"));
				}
				delete window.canRequest[callback];
				if(miniDevice || param.isLoading) {
                	Vue.prototype._completeAjax();
                	toastr.error(gettext("请求数据发生错误"));
            	}
			}
		}); //ajax end
	}
} //获取数据结束


/**/
var _loding;
Vue.prototype._beforeSendAjax = function(callback) {
    _loding = Vue.prototype.$loading({
      lock: true,
      text: loadingText,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
      customClass: 'element-loading-mask'
    });
		
		if(typeof(callback)!="undefined") {
			setTimeout(function(){
				callback();
			}, 500);
		}
}
Vue.prototype._completeAjax = function() {
	_loding.close();
}

/**
*@description  配置toastr自定义参数
*/
function _toastrInitSet() {
	toastr.options = {  
	    closeButton: false,  
	    debug: false,  
	    progressBar: true,  
	    positionClass: "toast-top-center",  
	    onclick: null,  
	    showDuration: "300",  
	    hideDuration: "1000",  
	    timeOut: "2000",  
	    extendedTimeOut: "1000",  
	    showEasing: "swing",  
	    hideEasing: "linear",  
	    showMethod: "fadeIn",  
	    hideMethod: "fadeOut"  
	};  
}
_toastrInitSet();
