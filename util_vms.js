//base of backend url
const base_url = "http://47.93.63.243:8083";

// base b2b url
const b2b_url = "http://47.93.63.243:8083" 

//service for send sms/netiq code 
// server/tpmfserver/auth/sendAuthCode2 发送短信验证吗需要验证账号和密码
const send_code_url = base_url + "/server/tpmfserver/auth/sendAuthCode";
const send_code_url_onlyusename = base_url + "/server/tpmfserver/auth/sendAuthCode";
const send_code_captcha_get_url = base_url + '/server/tpmfserver/auth/sms/captcha/get';
const send_code_captcha_send_url = base_url + '/server/tpmfserver/auth/sms/captcha/send';
const get_sign_version_url = base_url + "/rest/getSignVersion";
const rmbm_encode_url = base_url + "/server1/aes/encode";
const oam_server_url = base_url + "/login";

const oam_server_multifactor_url = base_url + "/oam/server/authentication?type=multifactor";


const webeam_b2d_prefix = base_url + "/oamfed/sp/initiatesso?providerid=saml20-internetb2x.bmwgroup.net&returnurl=https://b2b.bmw-brilliance.cn/restdid/detectFedUser/";

const webeam_b2b_prefix = base_url + "/oamfed/sp/initiatesso?providerid=saml20-intranetb2x.bmwgroup.net&returnurl=https://b2b.bmw-brilliance.cn/restdid/detectFedUser/";

const webeam_b2bmfa_prefix = base_url + "/oamfed/sp/initiatesso?providerid=saml20-internetb2xmfaonly.bmwgroup.net&returnurl=https://b2b.bmw-brilliance.cn/restdid/detectFedUser/";


const get_joychat_image = base_url + "/serverqrcode/qrcode/img";

const confirmed_joychat = base_url + "/serverqrcode/qrcode/check/";

const Scan = base_url + "/serverqrcode/joychat/";

const createAccountUrl = b2b_url + "/user/register-webeam";

const i18n_lang_cookie_name = "i18n_lang";
const rmbm_u_cache_key = "rmbm_u";
const rmbm_p_cache_key = "rmbm_p";

const rmbm_p_input_char = "****************";

//标记用户选择isRememberMe之后是不是再次修改过密码框里面的密码
window.global_rmbm_p_changed = false;

/* ============================  global functions  start ============================ */
function getUrlVar(name) {
	let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	let r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return decodeURI(r[2]);
	}
	return null;
}

function getUrlVars() {
	let vars = [], hash;
	let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for (const element of hashes) {
		hash = element.split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

function _getUrl4FedWebEAM() {
	let var_resource_url = getUrlVar("resource_url");
	console.log(var_resource_url)
	if (var_resource_url != null) {
		let str_url = decodeURI(var_resource_url)
		console.log(str_url)
		let str = str_url.replace("%3A%2F%2F", "%2F");
		console.log(str)
		return str;
	}
	return null;
}

function _getUrl4refresh() {
	let var_resource_url = getUrlVar("resource_url");
	if (var_resource_url != null) {
		return var_resource_url;
	}
	return null;
}

function getWebEAMB2D() {
	return webeam_b2d_prefix + _getUrl4FedWebEAM();
}

function getWebEAMB2B() {
	return webeam_b2b_prefix + _getUrl4FedWebEAM();
}

function getWebEAMB2BMFA() {
	return webeam_b2bmfa_prefix + _getUrl4FedWebEAM();
}

function getB2bUrl(){
	return createAccountUrl;
}

function getGpmUrl(){
	let url = _getUrl4refresh();
	url = unescape(unescape(url));
	console.log(url.indexOf('https://gpm-china.bmw.com.cn'))
	if (url.indexOf('https://gpm-china.bmw.com.cn')==-1) {
		return false;
	} else {
		return true;
	}
}


/*
*global ajax json post
*
*postUrl  : the url you want to request
*postData : json Object to you want to post
*successCallback : function(data)  callback when the post get reponse from server successfully.
*                           data :  json Object ,  response body from server
*failureCallback : function(ajax_res_error)  callback when met some error from server or met some network exception.
*                           ajax_res_error :  string  , error message about the exception.
*/
function ajaxJsonPost(postUrl, postData, successCallback, failureCallback) {
	try {
		$.ajax({
			type: "POST",
			url: postUrl,
			data: JSON.stringify(postData),
			contentType: "application/json; charset=utf-8",
			dataType: "json"
		})
			.done(function (data, textStatus, jqXHR) {
				globalJsonSuccessCallbackHandler(data, textStatus, jqXHR, successCallback);
			})
			.fail(function (jqXHR, textStatus, errorThrown) {
				globalJsonFailureCallback(jqXHR, textStatus, errorThrown, failureCallback);
			})
	} catch (error) {
		alert('error : ' + JSON.stringify(error))
	}
}

/*
*global successCallback for ajaxJsonPost
*
*data  : jqeury data 
*textStatus : jqeury textStatus 
*jqXHR : jqeury jqXHR 
*successCallback : function(data)  callback when the post get reponse from server successfully.
*                           data :  json Object ,  response body from server
*/
function globalJsonSuccessCallbackHandler(data, textStatus, jqXHR, successCallback) {
	successCallback(data);
}

/*
*global failureCallback for ajaxJsonPost
*
*data  : jqeury data 
*textStatus : jqeury textStatus 
*jqXHR : jqeury jqXHR 
*failureCallback : function(ajax_res_error)  callback when met some error from server or met some network exception.
*                           ajax_res_error :  string  , error message about the exception.
*/
function globalJsonFailureCallback(jqXHR, textStatus, errorThrown, failureCallback) {
	try {
		console.log("===================globalJsonFailureCallback=======================");
		console.log(JSON.stringify(jqXHR));
		console.log(JSON.stringify(textStatus));
		console.log(JSON.stringify(errorThrown));
		console.log("===================globalJsonFailureCallback=======================");

	} catch (error) {
		
	}
	let ajax_res_error = "";
	if (jqXHR.status === 0) {
		ajax_res_error = "No connection.Pleases Verify Network.";
	} else if (jqXHR.status == 401) {
		ajax_res_error = "Unauthorized. [401]";
	} else if (jqXHR.status == 404) {
		ajax_res_error = "Requested Resource Not Found. [404]";
	} else if (jqXHR.status == 405) {
		ajax_res_error = "Requested Method Not Allowed [405]";
	} else if (jqXHR.status == 500) {
		ajax_res_error = "Internal Server Error [500].";
	} else if (textStatus === "parsererror") {
		ajax_res_error = "Requested JSON parse failed.";
	} else if (textStatus === "timeout") {
		ajax_res_error = "Time out error.";
	} else if (textStatus === "abort") {
		ajax_res_error = "Ajax request aborted.";
	} else {
		ajax_res_error = 'Uncaught Error.' + jqXHR.responseText;
	}
	failureCallback(ajax_res_error);
}

//i18n setting
//https://gitee.com/minus16/i18n.js/blob/master/index.js
function loadI18n() {
	let defaultLang = navigator.language || navigator.userLanguage;
	defaultLang = defaultLang.split('-')[0];
	if (!(defaultLang == "en" || defaultLang == "zh")) {
		defaultLang = "en";
	}

	//load default lang
	i18n("[i18n]", {
		defaultLang: defaultLang, //set default lang as Browser languages
		filePath: "./i18n/",
		filePrefix: "i18n_",
		fileSuffix: "",
		forever: false,// set lang to cookie or not.
		get: true, // set true , we can use  i18n.get("i18n_key")
		only: ['value', 'html', 'placeholder', 'title'], // 全局设置i18n-only，默认值：['value', 'html', 'placeholder', 'title']
		callback: function () {
		}
	});
}
let phone_no = "";
function swithI18nEn() {
	i18n("[i18n]", { lang: "en", forever: true });
	let ntabsCur = localStorage.getItem('ntabsCur') || 0
	if (ntabsCur == 1 && phone_no && msgType=="send") {
		let send_sms_notification = i18n.get("sms-b07");
		send_sms_notification = send_sms_notification.replaceAll("{num}", phone_no);
		smsalert(send_sms_notification, 'success', 'sms-b07');
	}
}

function swithI18nZh() {
	i18n("[i18n]", { lang: "zh", forever: true });
	let ntabsCur = localStorage.getItem('ntabsCur') || 0
	if (ntabsCur == 1 && phone_no && msgType=="send") {
		let send_sms_notification = i18n.get("sms-b07");
		send_sms_notification = send_sms_notification.replaceAll("{num}", phone_no);
		smsalert(send_sms_notification, 'success', 'sms-b07');
	}

}

function getI18nLang() {
	let i18n_lang_cookie = Cookies.get(i18n_lang_cookie_name);
	if (i18n_lang_cookie) {
		if (!(i18n_lang_cookie == "en" || i18n_lang_cookie == "zh")) {
			return "en";
		} else {
			return i18n_lang_cookie;
		}

	} else {
		let defaultLang = navigator.language || navigator.userLanguage;
		defaultLang = defaultLang.split('-')[0];
		if (!(defaultLang == "en" || defaultLang == "zh")) {
			defaultLang = "en";
		}
		return defaultLang;
	}

}


/* ============================  global functions  end ============================ */

/*
*send NetIq code function
*
*
*username  : UserLogin who will send out the SMS 
*netIqPassword  : the password of userlogin that used for send netIq code
*sendNetIqUICallback : function(success, msg)   callback when get message from server or meet some exception
*                             success: boolean ,  ture if get NetIQ successfully from server.
*                             msg :string , message from server or error message when met some exception
*/
function sendNetIqCode(username, netIqPassword, sendNetIqUICallback) {
	ajaxJsonPost(send_code_url, { "username": username, "password": netIqPassword, "authType": "NetIq" },
		//send NetIq code callback
		function (res_data) {
			let send_netiq_code = res_data.code;
			let send_netiq_notification = "";
			let send_netiq_i18n = "";
			let send_netiq_success = false;
			switch (send_netiq_code) {
				case "S01":
					send_netiq_success = true;
					send_netiq_notification = i18n.get("NetIq-b05");
					send_netiq_i18n = "NetIq-b05";
					break;
				case "B01":
					send_netiq_notification = i18n.get("NetIq-b06");
					send_netiq_i18n = "NetIq-b06";
					break;
				case "B07":
					send_netiq_notification = i18n.get("NetIq-b07");
					send_netiq_i18n = "NetIq-b07";
					break;
				case "B08":
					send_netiq_notification = i18n.get("NetIq-b08");
					send_netiq_i18n = "NetIq-b08";
					break;
				case "B09":
					send_netiq_notification = i18n.get("NetIq-b09");
					send_netiq_i18n = "NetIq-b09";
					break;
				case "B10":
					send_netiq_notification = i18n.get("NetIq-b10");
					send_netiq_i18n = "NetIq-b10";
					break;
				default:
					break;
			}
			sendNetIqUICallback(send_netiq_success, send_netiq_notification, send_netiq_i18n);
		}, 
		function (ajax_res_error) {
			let send_netiq_i18n = 'error-01';
			sendNetIqUICallback(false, ajax_res_error, send_netiq_i18n);
		});
}

function getSignVersion(getSignVersionUICallback) {
	ajaxJsonPost(get_sign_version_url, { "userLogin": "", "phoeNumber": "", "userType": "" },
		//send sms callback
		function (res_data) {
			getSignVersionUICallback(res_data);

		}, function (ajax_res_error) {
			getSignVersionUICallback(ajax_res_error);
		});
}

/************************************************SMS login & isRememberMe   start************************************************************/

/**
*send SMS code function
*
*username  : UserLogin who will send out the SMS 
*sendSMSUICallback : function(success,msg)   callback when get message from server or meet some exception
*                             success: boolean ,  ture if get SMS successfully from server.
*                             msg :string , message from server or error message when met some exception
*/
function sendSMSCode(username, password, sendSMSUICallback) {
	//ajaxJsonPost("http://localhost/LLKK" , {"username": username, "authType": "SMS"} , 
	try {
		ajaxJsonPost(send_code_url, { "username": username, "authType": "SMS", 'password': password },
		//send sms callback
		function (res_data) {
			let send_sms_code = res_data.code;
			let send_sms_notification = "";
			let send_sms_num = "";
			let send_sms_i18n = "";
			let send_sms_sucess = false;
			switch (send_sms_code) {
				case "S01":
					send_sms_notification = i18n.get("sms-b07");
					send_sms_num = res_data.phoneNo;
					phone_no = res_data.phoneNo;
					send_sms_notification = send_sms_notification.replaceAll("{num}", send_sms_num);
					send_sms_sucess = true;
					send_sms_i18n = 'sms-b07';
					break;
				case "B01":
					send_sms_notification = i18n.get("sms-b01");
					send_sms_i18n = 'sms-b01';
					break;
				case "B02":
					send_sms_notification = i18n.get("sms-b02");
					send_sms_i18n = 'sms-b02';
					break;
				case "B03":
					send_sms_notification = i18n.get("sms-b03");
					send_sms_i18n = 'sms-b03';
					break;
				case "B04":
					send_sms_notification = i18n.get("sms-b04");
					send_sms_i18n = 'sms-b04';
					break;
				case "B05":
					send_sms_notification = i18n.get("sms-b05");
					send_sms_i18n = 'sms-b05';
					break;
				case "B06":
					send_sms_notification = i18n.get("sms-b06");
					send_sms_i18n = 'sms-b06';
					send_sms_num = res_data.phoneNo;
					send_sms_notification = send_sms_notification.replaceAll("{num}", send_sms_num);
					break;
				case "B10":
					send_sms_notification = i18n.get("sms-b10");
					send_sms_i18n = 'sms-b10';
					break;
				default:
					break;
			}
			sendSMSUICallback(send_sms_sucess, send_sms_notification, send_sms_i18n);
		}, 
		function (ajax_res_error) {
			console.log(ajax_res_error)
			let send_sms_i18n = 'error-01';
			sendSMSUICallback(false, ajax_res_error, send_sms_i18n);
		});
	} catch (error) {
		console.log(error)
	}
}

function sendSMSCode_onlyusename(username, password, sendSMSUICallback) {
	//ajaxJsonPost("http://localhost/LLKK" , {"username": username, "authType": "SMS"} , 
	try {
		ajaxJsonPost(send_code_url_onlyusename, { "username": username, "authType": "SMS", 'password': password },
		//send sms callback
		function (res_data) {
			let send_sms_code = res_data.code;
			let send_sms_notification = "";
			let send_sms_num = "";
			let send_sms_i18n = "";
			let send_sms_sucess = false;
			switch (send_sms_code) {
				case "S01":
					send_sms_notification = i18n.get("sms-b07");
					send_sms_num = res_data.phoneNo;
					phone_no = res_data.phoneNo;
					send_sms_notification = send_sms_notification.replaceAll("{num}", send_sms_num);
					send_sms_sucess = true;
					send_sms_i18n = 'sms-b07';
					break;
				case "B01":
					send_sms_notification = i18n.get("sms-b01");
					send_sms_i18n = 'sms-b01';
					break;
				case "B02":
					send_sms_notification = i18n.get("sms-b02");
					send_sms_i18n = 'sms-b02';
					break;
				case "B03":
					send_sms_notification = i18n.get("sms-b03");
					send_sms_i18n = 'sms-b03';
					break;
				case "B04":
					send_sms_notification = i18n.get("sms-b04");
					send_sms_i18n = 'sms-b04';
					break;
				case "B05":
					send_sms_notification = i18n.get("sms-b05");
					send_sms_i18n = 'sms-b05';
					break;
				case "B06":
					send_sms_notification = i18n.get("sms-b06");
					send_sms_i18n = 'sms-b06';
					send_sms_num = res_data.phoneNo;
					send_sms_notification = send_sms_notification.replaceAll("{num}", send_sms_num);
					break;
				case "B10":
					send_sms_notification = i18n.get("sms-b10");
					send_sms_i18n = 'sms-b10';
					break;
				default:
					break;
			}
			sendSMSUICallback(send_sms_sucess, send_sms_notification, send_sms_i18n);
		}, 
		function (ajax_res_error) {
			console.log(ajax_res_error)
			let send_sms_i18n = 'error-01';
			sendSMSUICallback(false, ajax_res_error, send_sms_i18n);
		});
	} catch (error) {
		console.log(error)
	}
}


function clearRememberMeCache() {
	Cookies.remove(rmbm_u_cache_key, { path: "" }); Cookies.remove(rmbm_p_cache_key, { path: "" });
}

function setRememberMeCache(rmbm_u, rmbm_key) {
	Cookies.set(rmbm_u_cache_key, rmbm_u, { path: "" });
	Cookies.set(rmbm_p_cache_key, rmbm_key, { path: "" });
}

function getRmbmUFromCache() {
	Cookies.get(rmbm_u_cache_key);
}
function getRmbmPFromCache() {
	Cookies.get(rmbm_p_cache_key);
}


/**
* 登录页面加载的时候需要执行该方法，该方法根据是否用户选择了isRememberMe，来控制用户的用户名、密码框的显示。
*/

function initFromUISMSLogin(id_username, id_password, id_sms_code, id_rmbm_checked) {
	let rmbm_u_from_cache = getRmbmUFromCache();
	let rmbm_p_from_cache = getRmbmPFromCache()
	try {
		if (rmbm_u_from_cache && rmbm_p_from_cache) {
			//将用户名填入用户名输入框
			$(id_username).val(rmbm_u_from_cache);
			//将rmbm_p_input_char自动填入密码输入框
			$(id_password).val(rmbm_p_input_char);
			//将isRememberMe选中;
			$(id_rmbm_checked).prop("checked", true);
			//页面刚加载的时候global_rmbm_p_changed为false;
			window.global_rmbm_p_changed = false;
			//增加事件，如果用户选择了isRememberMe ， 但是用户有修改了密码框，则需要标记用户已经变动了密码
			$(id_password).on("input", function () {
				window.global_rmbm_p_changed = true;
			});
		} else {
			//如果有任何一个不存在，则把一对都清除
			clearRememberMeCache();
			//关闭
			$(id_password).off("input");
		}
	} catch (err) {  }
}

// 记住密码
function callFromUISMSLoginWithRMBM(id_username, id_password, id_sms_code, id_rmbm_checked, id_oam_form, callSMSLoginUICallback) {
	//1 用户选择了isRememberMe  id_password没有变 getRmbmPFromCache有值   ： 不需要动态算密码
	//2 用户选择了isRememberMe  id_password没有变 getRmbmPFromCache没有值 ： 出意外了，需要动态算密码
	//3 用户选择了isRememberMe  id_password变了   getRmbmPFromCache有值   ： 需要动态算密码
	//4 用户选择了isRememberMe  id_password变了   getRmbmPFromCache没有值 ： 需要动态算密码
	//5 用户没有选择isRememberMe                                          ： 不需要动态算密码
	let u_isRememberMe = $(id_rmbm_checked).prop("checked");
	let u_username = $(id_username).val();
	let u_password = $(id_password).val();
	let u_smsCode = $(id_sms_code).val();
	let u_userKey = "";

	if (u_isRememberMe) {
		let rmbm_u_from_cache = getRmbmUFromCache();
		let rmbm_p_from_cache = getRmbmPFromCache();
		if (!window.global_rmbm_p_changed) {
			if (rmbm_p_from_cache) {
				//1 no need encode password :)
				_submit_oam_form(id_oam_form, {
					"username": u_username,
					"password": u_password,
					"isRememberMe": true,
					"userKey": u_userKey,
					"smsCode": u_smsCode
				});
			} else {
				//2 need encode password :(
				_encodePassword4RMBM(u_username, u_password, function (encodeSuccss) {
					if (encodeSuccss) {
						_submit_oam_form(id_oam_form, {
							"username": u_username,
							"password": u_password,
							"isRememberMe": true,
							"userKey": getRmbmPFromCache(),
							"smsCode": u_smsCode
						});
					} else {
						callSMSLoginUICallback();
					}
				});
			}
		} else {
			if (rmbm_p_from_cache) {
				//3 need encode password :(
				_encodePassword4RMBM(u_username, u_password, function (encodeSuccss) {
					if (encodeSuccss) {
						_submit_oam_form(id_oam_form, {
							"username": u_username,
							"password": u_password,
							"isRememberMe": true,
							"userKey": getRmbmPFromCache(),
							"smsCode": u_smsCode
						});
					} else {
						callSMSLoginUICallback();
					}
				});
			} else {
				//4 need encode password :(
				_encodePassword4RMBM(u_username, u_password, function (encodeSuccss) {
					if (encodeSuccss) {
						_submit_oam_form(id_oam_form, {
							"username": u_username,
							"password": u_password,
							"isRememberMe": true,
							"userKey": getRmbmPFromCache(),
							"smsCode": u_smsCode
						});
					} else {
						callSMSLoginUICallback();
					}
				});
			}
		}
	} else {
		//5 no need encode password :)
		_submit_oam_form(id_oam_form, {
			"username": u_username,
			"password": u_password,
			"isRememberMe": false,
			"userKey": u_userKey,
			"smsCode": u_smsCode
		});
	}

}


function callFromUISMSLogin(id_username, id_password, id_sms_code, id_oam_form) {
	try {
		let u_username = $(id_username).val();
		let u_password = $(id_password).val();
		let u_sms_code = $(id_sms_code).val();


		_submit_oam_form(id_oam_form, {
			"username": u_username,
			"password": u_password,
			"authCode": u_sms_code,
			"authType": "sms"
		});
	} catch (err) {  }
}


// 内网登录
function callFromUILogin(id_username, id_password, id_oam_form) {
	try {
		let u_username = $(id_username).val();
		let u_password = $(id_password).val();


		_submit_oam_form(id_oam_form, {
			"username": u_username,
			"password": u_password,
		});
	} catch (err) {  }
}

/*
authType: rsa
*/


function callFromUIRSALogin(id_username, id_auth_code, id_oam_form) {
	try {
		let u_username = $(id_username).val();
		let u_auth_code = $(id_auth_code).val();

		_submit_oam_form(id_oam_form, {
			"username": u_username,
			"authCode": u_auth_code,
			"authType": "rsa"
		});
	} catch (err) {  }
}

/*
authType: netiq
*/

function callFromUINetIQLogin(id_username, id_netiq_password, id_netiq_code, id_oam_form) {
	try {
		let u_username = $(id_username).val();
		let u_netiq_password = $(id_netiq_password).val();
		let u_netiq_code = $(id_netiq_code).val();

		_submit_oam_form(id_oam_form, {
			"username": u_username,
			"password": u_netiq_password,
			"authCode": u_netiq_code,
			"authType": "netiq"
		});
	} catch (err) {  }
}

/*
authType: joychatqr
*/

function callFromUIQrCodeLogin(qrticket) {
	try {
		/*
			smsCode: jkjkjk
		*/
		let id_oam_form = "#oam_sumbit_form";
		_submit_oam_form(id_oam_form, {
			"username": qrticket,
			"authType": "joychatqr"
		});
	} catch (err) { }
}

function _submit_oam_form(id_oam_form, form_data) {
	$(id_oam_form).attr("action", oam_server_url);
	Object.keys(form_data).forEach(form_name => {
		let form_value = form_data[form_name];
		$(id_oam_form).append('<input type="text" name="' + form_name + '" value="' + form_value + '" /> ');
	});

	$(id_oam_form).submit();
}


/*****************************************************login from login page to url*******************************************************************************/

/*
authType: sms
*/

function callFromUISMSLogin_url(id_username, id_password, id_sms_code, id_oam_form, url) {
	try {
		let u_username = $(id_username).val();
		let u_password = $(id_password).val();
		let u_sms_code = $(id_sms_code).val();


		_submit_oam_form_url(id_oam_form, {
			"username": u_username,
			"password": u_password,
			"authCode": u_sms_code,
			"authType": "sms"
		}, url);
	} catch (err) {}
}



/*
authType: rsa
*/


function callFromUIRSALogin_url(id_username, id_pin_code, id_rsa_code, id_oam_form, url) {
	try {
		let u_username = $(id_username).val();
		let u_pin_code = $(id_pin_code).val();
		let u_rsa_code = $(id_rsa_code).val();
		let u_auth_code = u_pin_code + u_rsa_code;

		_submit_oam_form_url(id_oam_form, {
			"username": u_username,
			"authCode": u_auth_code,
			"authType": "rsa"
		}, url);
	} catch (err) { }
}


function callFromUINetIQLogin_url(id_username, id_netiq_password, id_netiq_code, id_oam_form, url) {
	try {
		let u_username = $(id_username).val();
		let u_netiq_password = $(id_netiq_password).val();
		let u_netiq_code = $(id_netiq_code).val();

		_submit_oam_form_url(id_oam_form, {
			"username": u_username,
			"password": u_netiq_password,
			"authCode": u_netiq_code,
			"authType": "netiq"
		}, url);
	} catch (err) { }
}


function _submit_oam_form_url(id_oam_form, form_data, url) {
	$(id_oam_form).attr("action", oam_server_multifactor_url);
	Object.keys(form_data).forEach(form_name => {
		let form_value = form_data[form_name];
		$(id_oam_form).append('<input type="text" name="' + form_name + '" value="' + form_value + '" /> ');
	});

	$(id_oam_form).append('<input type="text" name="successurl" value="' + url + '" /> ');

	$(id_oam_form).submit();
}


/*****************************************************login from login page to url*******************************************************************************/



function _encodePassword4RMBM(rmbm_u, rmbm_p, encodePasswordCallback) {
	ajaxJsonPost(rmbm_encode_url, { "value": rmbm_p },
		//send sms callback
		function (res_data) {

			let encode_password_code = res_data.code;
			let encoded_password = "";
			if (encode_password_code == 20000) {
				encoded_password = res_data.result;
				//const rmbm_u_cache_key = "rmbm_u";
				//const rmbm_p_cache_key = "rmbm_p";
				alert(rmbm_u);
				alert(encoded_password);
				setRememberMeCache(rmbm_u, encoded_password);
				encodePasswordCallback(true);
			}
		}, function (ajax_res_error) {
			encodePasswordCallback(false);
		});
}


/************************************************SMS login & isRememberMe   end************************************************************/



function processOAMError() {
	let oam_error_msg = { msg: "", i18n: "" };
	let p_error_code = getUrlVar("p_error_code");
	console.log("p_error_code",p_error_code)
	let plugin_error_response = getUrlVar("PLUGIN_ERROR_RESPONSE");
	if (plugin_error_response == "PluginErrorCode%3DsmsCode+is+error") {
		oam_error_msg.msg = i18n.get("oam-11");
		oam_error_msg.i18n = "oam-11";
		clearRememberMeCache();
	} else if (plugin_error_response == "PluginErrorCode%3DnetiqCode+is+error") {
		oam_error_msg.msg = i18n.get("oam-11");
		oam_error_msg.i18n = "oam-11";
		clearRememberMeCache();
	} else {
		if (p_error_code == "OAM-1") {
			oam_error_msg.msg = i18n.get("oam-1");
			oam_error_msg.i18n = "oam-1";
			clearRememberMeCache();
		} else if (p_error_code == "OAM-2") {
			console.log("i18n.get('oam-2')------------------",i18n.get("oam-2"))
			oam_error_msg.msg = i18n.get("oam-2");
			oam_error_msg.i18n = "oam-2";
			clearRememberMeCache();
		} else if (p_error_code == "OAM-3") {
			oam_error_msg.msg = i18n.get("oam-3");
			oam_error_msg.i18n = "oam-3";
			clearRememberMeCache();
		} else if (p_error_code == "OAM-4") {
			oam_error_msg.msg = i18n.get("oam-4");
			oam_error_msg.i18n = "oam-4";
			clearRememberMeCache();
		} else if (p_error_code == "OAM-5") {
			oam_error_msg.msg = i18n.get("oam-5");
			oam_error_msg.i18n = "oam-5";
			clearRememberMeCache();
		} else if (p_error_code == "OAM-6") {
			oam_error_msg.msg = i18n.get("oam-6");
			oam_error_msg.i18n = "oam-6";
			clearRememberMeCache();
		} else if (p_error_code == "OAM-7") {
			oam_error_msg.msg = i18n.get("oam-7");
			oam_error_msg.i18n = "oam-7";
			clearRememberMeCache();
		} else if (p_error_code == "OAM-8") {
			oam_error_msg.msg = i18n.get("oam-8");
			oam_error_msg.i18n = "oam-8";
			clearRememberMeCache();
		} else if (p_error_code == "OAM-9") {
			oam_error_msg.msg = i18n.get("oam-9");
			oam_error_msg.i18n = "oam-9";
			clearRememberMeCache();
		} else if (p_error_code == "OAM-10") {
			oam_error_msg.msg = i18n.get("oam-10");
			oam_error_msg.i18n = "oam-10";
			clearRememberMeCache();
		} else {
			/*  
					let username = this.$cookies.get("username");
					let password = this.$cookies.get("password");
					if (username && password) {
						this.passwordType = "password";
						if(this.targetid=="did_atc"){
							this.isEditPassword=0
							this.checked = false
						}else{
						this.checked = true;
						this.isEditPassword = 1
						this.user.username = username;
						this.user.password = password;
						this.user.userKey = password;
						if (this.targetid == "joychat" || (this.targetid == "concur" && this.isPhone)) {
							this.$nextTick(function(){
								document.getElementById("joychatpassword").value = password
							})
						}
						}
					} else {
						this.passwordType = "password";
						this.user = {
							username: "",
							password: "",
							code: "",
						};
						this.isEditPassword = 0
						this.checked = false;
					}
			*/

		}
	}
	console.log(oam_error_msg)
	return oam_error_msg;
}

let joychart_token;
let Now_timer = new Date().getTime()
let apply_joychart_Time
let times

// 获取二维码图片
function getjoychartimage(imageID) {
	ajaxJsonPost(get_joychat_image, "", function (res_data) {
		let joychart_baseimage = res_data.data.qrcode
		apply_joychart_Time = res_data.data.expiresAt
		joychart_token = res_data.data.qrTicket
		$(imageID).attr('src', joychart_baseimage)
		$(imageID).css('visibility', '')
		clearInterval()
		timer();
	})
}

function checkjoychart() {
	ajaxJsonPost(confirmed_joychat + joychart_token, " joychart_token", function (data) {
		times = false;
		if (data.data.status == 0) {
			// 透明图层全部不显示
			document.getElementById("background").style.display = "none";
			document.getElementById("background-load").style.display = "none";
			document.getElementById("qr_loading_show").style.display="none";
			document.getElementById("qr_error_show").style.display="none";
		} else if (Now_timer > apply_joychart_Time) {
			// 加载超时，请刷新二维码
			document.getElementById("qrcode_p_error").innerHTML = i18n.get("joychat_QRcode_expired");
			document.getElementById("qrcode_p_error").setAttribute("i18n","joychat_QRcode_expired");
			document.getElementById("background").style.display = "block";
			document.getElementById("background-load").style.display = "none";
			document.getElementById("qr_loading_show").style.display="none";
			document.getElementById("qr_error_show").style.display="block"
			times = true;
			clearInterval(starttimer)
		} else if (data.data.status == -1) {
			// 内部错误
			document.getElementById("qrcode_p_error").innerHTML =  i18n.get("joychat_Login_error");
			document.getElementById("qrcode_p_error").setAttribute("i18n","joychat_Login_error")
			document.getElementById("background").style.display = "block";
			document.getElementById("background-load").style.display = "none";
			document.getElementById("qr_loading_show").style.display="none";
			document.getElementById("qr_error_show").style.display="block";
			times = true;
			clearInterval(starttimer)
		} else if (data.data.status == 1) {
			// 已经扫描
			document.getElementById("qrcode_p").innerHTML = i18n.get("joychat_Login_wait");
			document.getElementById("background").style.display = "none";
			document.getElementById("background-load").style.display = "block";
			document.getElementById("qr_loading_show").style.display="block";
			document.getElementById("qr_error_show").style.display="none";
			document.getElementById("qrcode_p").setAttribute("i18n","joychat_Login_wait")
			times = false;
		} else if (data.data.status == 2) {
			// 已点击登录
			document.getElementById("background").style.display = "none";
			document.getElementById("background-load").style.display = "block";
			document.getElementById("qr_loading_show").style.display="block";
			document.getElementById("qr_error_show").style.display="none";
			document.getElementById("qrcode_p").setAttribute("i18n","joychat_Login_enter");
			document.getElementById("qrcode_p").innerHTML = i18n.get("joychat_Login_enter");
			callFromUIQrCodeLogin(joychart_token);
			times = true;
			clearInterval(starttimer)
		} else if (data.data.status == 3) {
			// 确认超时
			document.getElementById("qrcode_p_error").innerHTML = i18n.get("joychat_Login_Timeout")
			document.getElementById("qrcode_p_error").setAttribute("i18n","joychat_Login_Timeout")
			document.getElementById("background").style.display = "block";
			document.getElementById("background-load").style.display = "none";
			document.getElementById("qr_loading_show").style.display="none";
			document.getElementById("qr_error_show").style.display="block";
			times = true;
			clearInterval(starttimer)
		} else if (data.data.status == 4) {
			// 二维码过期
			document.getElementById("qrcode_p_error").innerHTML = i18n.get("joychat_QRcode_expired")
			document.getElementById("qrcode_p_error").setAttribute("i18n","joychat_QRcode_expired")
			document.getElementById("background").style.display = "block";
			document.getElementById("background-load").style.display = "none";
			document.getElementById("qr_loading_show").style.display="none";
			document.getElementById("qr_error_show").style.display="block";
			times = true;
			clearInterval(starttimer)
		} else if (data.data.status == 5) {
			// 已经拒绝
			document.getElementById("qrcode_p_error").innerHTML =i18n.get("joychat_Login_refuse")
			document.getElementById("background").style.display = "block";
			document.getElementById("background-load").style.display = "none";
			document.getElementById("qrcode_p_error").setAttribute("i18n","joychat_Login_refuse")
			document.getElementById("qr_loading_show").style.display="none";
			document.getElementById("qr_error_show").style.display="block";
			times = true;
			clearInterval(starttimer)
		}

	})
}

let starttimer;
function timer() {
	clearInterval(starttimer)
	starttimer = setInterval(() => {
		checkjoychart();
		if (times) {
			clearInterval(starttimer)
		}
	}, 1000);
}


function confirmed_button(checkStatus) {
	const url = Scan + checkStatus;
	ajaxJsonPost(url, "", function (data) {
		try {
			if (data.code == 200) {
				logout_joychat();
			} else {
				setTimeout(function () {
					logout_joychat();
				}, 3000)
			}
		} catch (error) {
			alert(JSON.stringify(error))
		}

	})
}

function logout_joychat() {
	document.addEventListener("deviceready", function () {
		// 调用cordova方法，返回joychat
		cordova.exec(
			function () { },
			function () { },
			"WorkPlus_WebView",
			"exit", []
		);
	}, false);
}

/**
 * 定时页面刷新,重定向到地址栏的resource_url
 */
setInterval(function () {
	let url = _getUrl4refresh();
	url = unescape(unescape(url));
	window.location.href = url;
}, 1000 * 800);
