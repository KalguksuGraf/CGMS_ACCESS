var localServerUrl = 'http://1.221.167.187:9088/';
//var localServerUrl = 'http://192.168.0.5:8080/';
var localServerUrlKtl = 'http://192.168.0.51:8081/'; 
var localServerUrlJsy = 'http://192.168.0.44:8080/'; 
var thejoinServerUrl  = 'http://www.thejoin.co.kr:9093/';

var ABSOLUTE_URL = localServerUrlKtl;

var CMMN_SPCL_CHAR = "[`~!.,/@#$%^&*():;?+<>='|\\\"_-]";
var CMMN_TRIM = "(\\s*)";

/********************************************************************
 * jQuery Ajax 공통 함수.
 * 사용 예제 : cmmnAjax("/noticeList.do", {param1 : "param1", param2 : "param2"}, callback, "GET", "TEXT");
 * @param	sUrl		- 요청 URL
 * 			aData		- 배열 형식의 전달 값 {}
 * 			sCallback	- Ajax 통신 후 처리되는 함수명(사용 시 함수명을 "" 없이 사용하세요. 문자열 안됨.)
 * 			aOption		- bAsync, sType, sDataType 등 option 설정
 * 			sType		- GET, POST
 * 			sDataType	- TEXT, JSON, JSONP
 * 			bAsync		- true, false 문자값으로 전달
 * @returns	fnCallback
 *******************************************************************/
function cmmnAjax(sUrl, aParams, fnCallback, aOption)
{
	if(isNullToString(sUrl) == ""){
		alert("url은 필수 항목입니다.");
		return;
	}else{
		sUrl = ABSOLUTE_URL + sUrl;
	}
		
	if(aOption == null) aOption = {};	
	if(aParams == null) aParams = {};
	
	$.ajax({
		async		    : eval(isNullToString(aOption.bAsync,"true")),
		type		    : isNullToString(aOption.sType,"POST"),
		url			    : sUrl,
		data		    : aParams,
		dataType	    : isNullToString(aOption.sDataType,"JSON"),
		contentType		: "application/x-www-form-urlencoded; charset=UTF-8",
		success		    : function (data) {

			//메시지 반환 시 메시지 출력
			if(isNullToString(data.msg, "") != "")
				alert(data.msg);
			if(typeof fnCallback === "function")
				fnCallback(data);
		},
		beforeSend	    : function (xhr) {
		},
		complete	    : function () {
		},
		error: function (xhr, ajaxOptions, thrownError) {
			console.log("Error: " + xhr.status + "\n" +
			      "Message: " + xhr.statusText + "\n" +
			      "Response: " + xhr.responseText + "\n" + thrownError);
		}
	});
}

$(document).ready(function(){
	if($("input:eq(0)").length > 0) {
		if($("input:eq(0)").val() == "") {
			$("input:eq(0)").focus();
		}
	}
});

$(document).on("click", ".footer > li > a:eq(0)", function(){
	var linkurl = document.location.href;
	if(String(linkurl).indexOf('follow') > -1){
		
	}else{		
		//dashBoardInit();
		location.href = "../mn/dashboard.html";
	}
});

function dashBoardInit() {
	if(jappinf.isNative()){
		jappinf.getAppPref("pageId,transId,transModelNm,sensorG6Id", function(resultCd, result) {
			if (resultCd == RESULTCODE.SUCC) {
				var key = Object.keys(result);
				var getPref = result[key[0]];
				console.log(" dashBoardInit === " + getPref);
				if (getPref == "01" || getPref == "02" || getPref == "03" || getPref == "04" ) {
					location.href = "../mn/deviceReg02.html";
				}else if(getPref == "07"){
					if(isNullToString(result[key[1]],'')!=''){
						console.log(isNullToString(result[key[2]],''));
						console.log(isNullToString(result[key[3]],''));
						var g_serise = result[key[2]];
						if(g_serise=='G6'){
							if(isNullToString(result[key[3]],'')!=''){
								location.href = "../mn/deviceReg02.html";
							}else{								
								location.href = "../mn/deviceReg01.html#device_search";
							}
						}else{
							location.href = "../mn/deviceReg01.html#device_search";
						}
					}else{
						jappinf.setAppPref({'pageId':''}, function(resultCd) {
							location.href = "../mn/dashboard.html";	
						});
					}
				}else if(isNullToString(getPref,'')==''&&isNullToString(result[key[1]],'')!=''){
					if(isNullToString(result[key[2]],'')!=''){
						var g_serise = result[key[2]];
						if(g_serise=='G6'){
							if(isNullToString(result[key[3]],'')!=''){
								location.href = "../mn/deviceReg02.html";
							}else{								
								location.href = "../mn/deviceReg01.html#device_search";
							}
						}else{
							location.href = "../mn/deviceReg01.html#device_search";
						}
					}else{
						location.href = "../mn/deviceReg02.html";
					}
				}else { //미연동 페이지
					location.href = "../mn/dashboard.html";	
				}
			} else {
				console.log("페이지 오류 입니다. 확인 바랍니다.");
			}
		});
	}else{
		location.href = "../mn/dashboard.html";    
	}
}

function backClick(pageId){
	var path = location.href;
	console.log(" backClick === " + pageId);
	if(path.indexOf("/tl/") > -1
			&& path.indexOf("Detail.html") > -1) {
		if(!isNull(localStorage.getItem("timelineDe"))){
			var timelineDe = localStorage.getItem("timelineDe");
			localStorage.removeItem("timelineDe");
			location.href = "../tl/timeline.html?de=" + timelineDe;
		}else{
			location.href = "../mn/dashboardWide.html?fullscreenchange=On";
		}
	}else if(path.indexOf("/fw/followtargetdtls.html") > -1){
		if($(".ui-panel-dismiss").hasClass("ui-panel-dismiss-open")){
			$('#push_cont').val('');
			$('#massage_reg').panel('close');
			} else {
				location.href = "../fw/followmain.html";
			}
		
	}else if(path.indexOf("/ff/followtimeline.html") > -1||
			 path.indexOf("/ff/followreport.html") > -1||
			 path.indexOf("/ff/followpushlist.html") > -1){
		if($(".ui-panel-dismiss").hasClass("ui-panel-dismiss-open")){
			$('#push_cont').val('');
			$('#massage_reg').panel('close');
			} else {
				location.href = "../fw/followtargetdtls.html";
			}
		
	} else if(path.indexOf("/bx/setting.html") > -1) {
		location.href = "../bx/myBoxMain.html";
	} else if(path.indexOf("/st/deviceSetting.html") > -1) {
		if(path.indexOf("#notice01_reg") > -1 ) {
			location.href = "../st/deviceSetting.html#notice01";
		}else if(path.indexOf("#notice02_reg") > -1 ) {
			location.href = "../st/deviceSetting.html#notice02";
		}else if(path.indexOf("#notice03_reg") > -1 ) {
			location.href = "../st/deviceSetting.html#notice03";
		}else if(path.indexOf("#notice03") > -1
				||path.indexOf("#notice02") > -1 
				|| path.indexOf("#notice01") > -1 ) {
			location.href = "../st/deviceSetting.html#warning_info";
		}else if(path.indexOf("#warning_info") > -1 ) {
			location.href = "../st/deviceSetting.html#device2";
		}else if(path.indexOf("#device2") > -1 ) {
			location.href = "../st/deviceSetting.html";
		}else {
			location.href = "../bx/myBoxMain.html";
		}
	} else if (path.indexOf("/bx/myBoxMain.html") > -1
			|| path.indexOf("/rt/report.html") > -1
			|| path.indexOf("/tl/timeline.html") > -1) {
		
			location.href = "../mn/dashboard.html";
		
	} else if (path.indexOf("/hr/register.html") > -1 ) {
		if(path.indexOf("#excs_search") > -1) {
			history.back();
		} else {
			location.href = "../mn/dashboard.html";
		}
	} else if (path.indexOf("/mn/dashboardWide.html") > -1) {
			location.href = "../mn/dashboard.html";
	} else if (path.indexOf("/mn/deviceReg01.html") > -1) {
		if(path.indexOf("#device_search") > -1 ) {
			location.href = "../mn/dashboard.html";
		} else if(path.indexOf("#enterNum") > -1 ) {
			history.back();
		}
	}
	else if (path.indexOf("/tl/mealEdit.html") > -1) {
		if (path.indexOf("#meal_edit1") > -1
				|| path.indexOf("#meal_edit2_1") > -1
				|| path.indexOf("#meal_edit2_2") > -1) {
			$.mobile.changePage("#meal_edit");
		} else {
			location.href = "../tl/mealDetail.html" + path.substring(path.indexOf("?"));
		}
	}
	else{
		history.back();
	}
}

/********************************************************************
 * javascript로 java에서 사용하는 stringbuffer 기능 구현
 * 사용 예제 :	var sbuf = new StringBuffer();
 * 			sbuf.append("text");
 * 			sbuf.append("text");
 * 			sbuf.toString();
 * @param
 * @returns
 *******************************************************************/
var StringBuffer = function() {
    this.buffer = new Array();
}

StringBuffer.prototype.append = function(obj) {
     this.buffer.push(obj);
}

StringBuffer.prototype.toString = function() {
     return this.buffer.join("");
}
/*******************************************************************/

function isNull(sParam) {
	if(sParam == null || sParam == undefined || sParam == "" || sParam == "undefined" || sParam == "null"){
		return true;
	}
	return false;
}

/********************************************************************
 * 입력된 변수의 값이 null 또는 "" 일때 치환 문자를 반환한다.
 * 사용 예제 :	if( isNullToString(sParam, "") != "" ) {
 * @param	sParam	- 타멧 문자열
 * 			sSubst	- 치환 문자
 * @returns	string
 *******************************************************************/
function isNullToString(sParam, sSubst)
{
	if(sSubst == null){ sSubst = "";}
	if(sParam == null || sParam == undefined || sParam == "" || sParam == "undefined" || sParam == "null"){
		return sSubst;
	}
	return sParam;
}

function getReplace(str, rep, tok){
	return str.replace(new RegExp(rep,"gi"),tok);
}

String.prototype.toTrim = function(){
	return this.replace(new RegExp(CMMN_TRIM,"gi"),"");
};

String.prototype.isNull = function(){
	return this == null || this == '';
};

String.prototype.isNotNull = function(){
	return this != null && this != '';
};

String.prototype.addComma = function(strTxt) {

	return this.concat(',').concat(strTxt);
}


Map = function(){
	 this.map = new Object();
};

Map.prototype = {
  put : function(key, value){
      this.map[key] = value;
  },
  get : function(key){
      return this.map[key];
  },
  containsKey : function(key){
   return key in this.map;
  },
  containsValue : function(value){
   for(var prop in this.map){
    if(this.map[prop] == value) return true;
   }
   return false;
  },
  isEmpty : function(key){
   return (this.size() == 0);
  },
  clear : function(){
   for(var prop in this.map){
    delete this.map[prop];
   }
  },
  remove : function(key){
   delete this.map[key];
  },
  keys : function(){
      var keys = new Array();
      for(var prop in this.map){
          keys.push(prop);
      }
      return keys;
  },
  values : function(){
   var values = new Array();
      for(var prop in this.map){
       values.push(this.map[prop]);
      }
      return values;
  },
  size : function(){
    var count = 0;
    for (var prop in this.map) {
      count++;
    }
    return count;
  }
};

ArrayList = function ArrayList(){
	this.list = [];
};

ArrayList.prototype ={

	add : function(item){
		this.list.push(item);
	},
	get : function(idx){
		return this.list[idx];
	},
	removeAll : function(){
		this.list = [];
	},
	size : function(){
		return this.list.length;
	},
	remove : function(index){
		var newList = [];
		for(var i=0;i<this.list.length;i++){
			if(i != index){
				newList.push(this.list[i]);
			}
		}
		this.list = newList;
	},
	removeItem : function(item){
		var newList = [];
		for(var i=0;i<this.list.length;i++){
			if(this.list[i] != this.list[item]){
				newList.push(this.list[i]);
			}
		}
		this.list = newList;
	}
};

/********************************************************************
 * input type = "number"  에서 최대 자리수 제한하기
 * 사용 예제 : maxlength="10" oninput="maxLengthCheck(this)"
 * @param	object
 * @returns	null
 *******************************************************************/
function maxLengthCheck(object){
	if(object.value.length > object.maxLength){
		object.value = object.value.slice(0, object.maxLength);
	}
}

/********************************************************************
 * input type = "number"  에서 최대 자리수 제한하기(소수점 한자리)
 * 사용 예제 : maxlength="10" oninput="maxLengthCheck(this)"
 * @param	object
 * @returns	null
 *******************************************************************/
function number_filter2(event, obj){
	var id = obj.attr('id');
	var val = obj.val();
	var val2 = val.replace(/[^0-9.]/gi, '');
	var dotchk = false;

	var _pat0 = /^(\d{1,3})([.]{1}\d{0,1}?)?$/;
	if(!_pat0.test(val2)){
    	val2 = val2.substring(0, val2.length-1);
    }else{
    	if(event.keyCode==110) dotchk = true;
    }
    event.srcElement.value = val2

	var cPos = document.getElementById(id).value.length;
	cPos = dotchk==true ? cPos+1 : cPos;
	document.getElementById(id).setSelectionRange(cPos, cPos);
}

/********************************************************************
 * input type = "number"  에서 최대 자리수 제한하기
 * 사용 예제 : maxlength="10" oninput="commaSplit(this)"
 * @param	object
 * @returns	null
 *******************************************************************/
function commaSplit(n) {// 콤마 나누는 부분
    var txtNumber = '' + n;
    var rxSplit = new RegExp('([0-9])([0-9][0-9][0-9][,.])');
    var arrNumber = txtNumber.split('.');
    arrNumber[0] += '.';
    do {
        arrNumber[0] = arrNumber[0].replace(rxSplit, '$1,$2');
    }
    while (rxSplit.test(arrNumber[0]));
    if(arrNumber.length > 1) {
        return arrNumber.join('');
    } else {
        return arrNumber[0].split('.')[0];
    }
}

/********************************************************************
 * jQuery Ajax 공통코드 조회 함수.
 * 사용 예제 : searchCmmnCd("#selectTag","CM001","","","===전체===|*","in|10,20,30");
 * @param	sSelector	- # 혹은 . 를 꼭 붙이세요.
 * 			sLclasCd	- 공통코드 대분류 코드값
 * 			sSclasCd	- 공통코드 소분류 코드값, 간혹 코드값이 필요한 상황에 사용. 단건 셀렉트임...
 * 			sBindData	- 기본 설정할 값 지정
 * 			sInst		- 첫 줄에 추가할 내용 입력. 예) 전체, 선택 등
 * @returns
 *******************************************************************/
function searchCmmnCd(sSelector, sLclasCd, sSclasCd, sBindData, sInst, sFilter)
{
	if(isNullToString(sSelector) == "") return;
	if(isNullToString(sLclasCd) == "") return;

	var bSync = isNullToString(sSclasCd) == "";
	var rtnVal = "";
	$.ajax({
		async: bSync,
		type: "POST",
		url: ABSOLUTE_URL + "/common/selectCmmnCd.do",
		data : { lclasCd : sLclasCd, sclasCd : sSclasCd },//params,
		dataType: "JSON",
		success: function (data) {

			if(!bSync){
				rtnVal = isNullToString(data[0].SCLAS_NM);
			}else{
				var oCmb = $(sSelector);
				//선택한 태그 초기화
				oCmb.empty();

				if(isNullToString(sInst) != ""){
					var aSplit = sInst.split("|");
					oCmb.append("<option value='" + isNullToString(aSplit[1]) + "'>" + isNullToString(aSplit[0]) + "</option>");
				}
				if(isNullToString(sFilter) != ""){
					data = getFilterData(data,sFilter);
				}

				for (var i = 0; i < data.length; i++){
					oCmb.append("<option value='" + isNullToString(data[i].SCLAS_CD) + "'>" + isNullToString(data[i].SCLAS_NM) + "</option>");
				}

				if(isNullToString(sBindData) != "")
					oCmb.val(sBindData);

				if($.mobile) oCmb.selectmenu('refresh');
			}

		},
		error: function (xhr, ajaxOptions, thrownError) {
			alert("Error: " + xhr.status + "\n" +
			      "Message: " + xhr.statusText + "\n" +
			      "Response: " + xhr.responseText + "\n" + thrownError);
		}
	});

	if(!bSync) return rtnVal;
}

$(document).on("click", "input[type='date']", function(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yyyy = today.getFullYear();
	if(dd < 10) {
		dd = '0' + dd;
	}
	if(mm < 10) {
		mm = '0' + mm;
	}
	today = yyyy + '-' + mm + '-' + dd;
	$(".dataInitToday").prop("max", today);
});

$(document).on("pageshow", "div", function(){
	var firstInput = $(".ui-page-active").find("input:eq(0)");
	if(firstInput.length > 0) {
		if(firstInput.val() == "") {
			firstInput.focus();
		}
	}
});

function Request(){
	var requestParam ="";
	 
	//getParameter 펑션
	this.getParameter = function(param){
		//현재 주소를 decoding
		var url = unescape(location.href); 
		//파라미터만 자르고, 다시 &그분자를 잘라서 배열에 넣는다. 
		var paramArr = (url.substring(url.indexOf("?")+1,url.length)).split("&"); 
 
		for(var i = 0 ; i < paramArr.length ; i++){
			var temp = paramArr[i].split("="); //파라미터 변수명을 담음
 
			if(temp[0].toUpperCase() == param.toUpperCase()){
				// 변수명과 일치할 경우 데이터 삽입
				requestParam = paramArr[i].split("=")[1]; 
				break;
			}
		}
		
		return requestParam;
	}
}


//파일 저장
function downloadFile(local_file_nm, svr_file_path, svr_file_nm){
	console.log(local_file_nm +", "+ svr_file_path +", "+ svr_file_nm);
	location.href = "/common/attchFileDownload.do?LOCAL_FILE_NM="+local_file_nm+"&SVR_FILE_PATH="+svr_file_path+"&SVR_FILE_NM="+svr_file_nm;
}


///추가
var now = new Date();
var year = now.getFullYear();
var month = now.getMonth() + 1;
var day = now.getDate();
var nalsu = new Array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
//2월은 윤년 체크
if (year % 4 === 0 % year % 100 !== 0 || year % 400 === 0) {
  nalsu[2] = 28;
}
Date.prototype.format = function(f) {

  if (!this.valueOf()) return " ";

  var weekKorName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  var weekKorShortName = ["일", "월", "화", "수", "목", "금", "토"];
  var weekEngName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var weekEngShortName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var d = this;


  return f.replace(/(yyyy|yy|MM|dd|KS|KL|ES|EL|HH|hh|mm|ss|a\/p)/gi, function($1) {

    switch ($1) {
      case "yyyy":
        return d.getFullYear(); // 년 (4자리)
      case "yy":
        return (d.getFullYear() % 1000).zf(2); // 년 (2자리)
      case "MM":
        return (d.getMonth() + 1).zf(2); // 월 (2자리)
      case "dd":
        return d.getDate().zf(2); // 일 (2자리)
      case "KS":
        return weekKorShortName[d.getDay()]; // 요일 (짧은 한글)
      case "KL":
        return weekKorName[d.getDay()]; // 요일 (긴 한글)
      case "ES":
        return weekEngShortName[d.getDay()]; // 요일 (짧은 영어)
      case "EL":
        return weekEngName[d.getDay()]; // 요일 (긴 영어)
      case "HH":
        return d.getHours().zf(2); // 시간 (24시간 기준, 2자리)
      case "hh":
        return ((h = d.getHours() % 12) ? h : 12).zf(2); // 시간 (12시간 기준, 2자리)
      case "mm":
        return d.getMinutes().zf(2); // 분 (2자리)
      case "ss":
        return d.getSeconds().zf(2); // 초 (2자리)
      case "a/p":
        return d.getHours() < 12 ? "AM" : "PM"; // 오전/오후 구분

      default:
        return $1;

    }

  });
};



String.prototype.string = function(len) {
  var s = '',
    i = 0;
  while (i++ < len) {
    s += this;
  }
  return s;
};
String.prototype.zf = function(len) {
  return "0".string(len - this.length) + this;
};
Number.prototype.zf = function(len) {
  return this.toString().zf(len);
};


String.prototype.toDate = function() {

  var dateString = this;
  if (dateString == undefined || dateString.length < 4) {
    return;
  }
  var yyyy;

  var MM;
  var dd = "00";
  var hh = "00";
  var mm = "00";
  var ss = "00";
  if (dateString.length >= 4) {
    yyyy = dateString.substring(0, 4);
    if (dateString.length >= 6) {
      MM = dateString.substring(4, 6) - 1;
      if (dateString.length >= 8) {
        dd = dateString.substring(6, 8);
        if (dateString.length >= 10) {
          hh = dateString.substring(8, 10);
          if (dateString.length >= 12) {
            mm = dateString.substring(10, 12);
            if (dateString.length == 14) {
              ss = dateString.substring(12, 14);
            }
          }
        }
      }
    }
  }

  return new Date(yyyy, MM, dd, hh, mm, ss);

}


function getSessionInfo(key){
	var info = sessionStorage.getItem(key);
	
	return info;
}

String.prototype.replaceAll = function(org, dest) {
    return this.split(org).join(dest);
}

function getConfirmPop(title, msg, confirmCallback, cancelCallback){
	var title = isNullToString(title);
	var msg = isNullToString(msg).replace(/\r\n/g, "<br/>");
	
	if($.mobile.activePage.find("#confirmPop").length > 0){
		$.mobile.activePage.find("#confirmPop").remove();
	}
	
	var sb = new StringBuffer();
	
	sb.append('<div data-role="popup" id="confirmPop" data-overlay-theme="b" class="alert01" style="max-width:400px;">');
	sb.append('<div data-role="main">');
	sb.append('<h3>' + title + '</h3>');
	sb.append('<p>' + msg + '</p>');
	sb.append('<ul class="btn_box01">');
	sb.append('<li><a class="ui-btn ui-btn-inline cancelBtn" href="#">취소</a></li>');
	sb.append('<li><a class="ui-btn ui-btn-inline fnred confirmBtn" href="#">확인</a></li>');
	sb.append('</ul>');
	sb.append('</div>');
	sb.append('</div>');
	
	$.mobile.activePage.append(sb.toString());
	
	$.mobile.activePage.find("#confirmPop").popup().popup("open");
	
	$("#confirmPop .confirmBtn").on("click", function(){
		if(typeof(confirmCallback) == "function"){
			confirmCallback();
		}
		
		$.mobile.activePage.find("#confirmPop").popup("close");
	});
	
	$("#confirmPop .cancelBtn").on("click", function(){
		if(typeof(cancelCallback) == "function"){
			cancelCallback();
		}
		
		$.mobile.activePage.find("#confirmPop").popup("close");
	});
}

function getAlertPop(title, msg, confirmCallback){
	var title = isNullToString(title);
	var msg = isNullToString(msg).replace(/\r\n/g, "<br/>");
	
	if($.mobile.activePage.find("#alertPop").length > 0){
		$.mobile.activePage.find("#alertPop").remove();
	}
	
	var sb = new StringBuffer();
	
	sb.append('<div data-role="popup" id="alertPop" data-overlay-theme="b" class="alert01" style="max-width:400px;">');
	sb.append('<div data-role="main">');
	sb.append('<h3>' + title + '</h3>');
	sb.append('<p>' + msg + '</p>');
	sb.append('<ul class="btn_box01">');
	sb.append('<li style="width:100%";><a class="ui-btn ui-btn-inline confirmBtn" href="#">확인</a></li>');
	sb.append('</ul>');
	sb.append('</div>');
	sb.append('</div>');
	
	$.mobile.activePage.append(sb.toString());
	
	$.mobile.activePage.find("#alertPop").popup().popup("open");
	
	$("#alertPop .confirmBtn").on("click", function(){
		if(typeof(confirmCallback) == "function"){
			confirmCallback();
		}
		
		$.mobile.activePage.find("#alertPop").popup("close");
	});
}

