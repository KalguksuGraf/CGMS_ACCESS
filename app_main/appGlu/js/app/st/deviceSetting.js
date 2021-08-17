var currentCGMDevice;
var sensorStatus;
$(document).on("pagebeforecreate", function() {
	console.log('1. pagebeforecreate==');
});
$(document).on("pagebeforeshow", function(event, data) {
	console.log('2. pagebeforeshow==');
	var pageId = $.mobile.activePage.attr('id');
	initDeviceInfo();
	initSensorInfo();
	if(pageId == "device2") {
		warningNotiSetting();
	}
	if(pageId == "warning_info") {
		lowNotiSetting();
		highNotiSetting();
		coretonNotiSetting();
		changeSetting();
		$('.emcoretonNoticeValue').html($('#notice03').data("coretonSaveData"));
		$('.emLowNoticeValue').html($('#notice01').data("lowSaveData"));
		$('.emHighNoticeValue').html($('#notice02').data("highSaveData"));
	}
	if(pageId == "notice01") {
		$('.lowNoticeValue').html($('#notice01').data("lowSaveData"));
	}
	if(pageId == "notice02") {
		$('.highNoticeValue').html($('#notice02').data("highSaveData"));
	}
	if(pageId == "notice03") {
		$('.coretonNoticeValue').html($('#notice03').data("coretonSaveData"));
	}
	
});
$(document).on("pageshow", function() {
	console.log('3. pageshow==');	
});
$(document).on("ready", function() {
	console.log('4. ready==');

	

});

// ---- 2020-04-09 장수영 ----
function lowNotiSetting() {
	jappinf.getAppPref("lowNoticeSugarBtn,lowNoticeValue,lowNoticeRepeatRington,lowNoticeRington", function(resultCd, result) {
		if (resultCd == RESULTCODE.SUCC) {
			var key = Object.keys(result);
			var lowNoticeSugarBtn = result["lowNoticeSugarBtn"];
			var lowNoticeValue = result["lowNoticeValue"];
			var lowNoticeRepeatRington = result["lowNoticeRepeatRington"];
			var lowNoticeRington = result["lowNoticeRington"];
			
			console.log("get lowNotiSetting value = " + lowNoticeSugarBtn +  " value2 = " + lowNoticeValue + " lowNoticeRepeatRington = " + lowNoticeRepeatRington + " lowNoticeRington = "+lowNoticeRington);
			if(!isNull(lowNoticeValue)) {
				$('.lowNoticeValue').html(lowNoticeValue);
			}
			if(!isNull(lowNoticeRington)) {
				$('.lowNoticeRington').html(lowNoticeRington);
			}
			if(lowNoticeSugarBtn=="on") {
				$('.lowNoticeSugarBtn').val("on").slider().slider("refresh");
			}else {
				$('.lowNoticeSugarBtn').val("off").slider().slider("refresh");
			}
			if(!isNull(lowNoticeRepeatRington)) {
				console.log("####" + lowNoticeRepeatRington);
				$(".lowNoticeRepeatRington").val(lowNoticeRepeatRington).prop("selected", true);
			}
		
		} else {
			console.log("페이지 오류 입니다. 확인 바랍니다.");
		}

	});
}
function highNotiSetting() {
	jappinf.getAppPref("highNoticeSugarBtn,highNoticeValue,highNoticeRepeatRington,highNoticeRington", function(resultCd, result) {
		if (resultCd == RESULTCODE.SUCC) {
			var key = Object.keys(result);
			var highNoticeSugarBtn = result["highNoticeSugarBtn"];
			var highNoticeValue = result["highNoticeValue"];
			var highNoticeRepeatRington = result["highNoticeRepeatRington"];
			var highNoticeRington = result["highNoticeRington"];
			
			console.log("get highNotiSetting value = " + highNoticeSugarBtn +  " value2 = " + highNoticeValue + " lowNoticeRepeatRington = " + highNoticeRepeatRington + " lowNoticeRington = "+highNoticeRington);
			if(!isNull(highNoticeValue)) {
				$('.highNoticeValue').html(highNoticeValue);
			}
			if(!isNull(highNoticeRington)) {
				$('.highNoticeRington').html(highNoticeRington);
			}
			if(highNoticeSugarBtn=="on") {
				$('.highNoticeSugarBtn').val("on").slider().slider("refresh");
			}else {
				$('.highNoticeSugarBtn').val("off").slider().slider("refresh");
			}
			if(!isNull(highNoticeRepeatRington)) {
				console.log("####" + highNoticeRepeatRington);
				$(".highNoticeRepeatRington").val(highNoticeRepeatRington).prop("selected", true);
			}
		
		} else {
			console.log("페이지 오류 입니다. 확인 바랍니다.");
		} 

	});
}

function coretonNotiSetting() {
	jappinf.getAppPref("coretonBtn,coretonNoticeValue", function(resultCd, result) {
		if (resultCd == RESULTCODE.SUCC) {
			var key = Object.keys(result);
			var coretonBtn = result["coretonBtn"];
			var coretonNoticeValue = result["coretonNoticeValue"];
	
			
			console.log("get coretonBtn value = " + coretonBtn +  " coretonNoticeValue = " + coretonNoticeValue);
			if(!isNull(coretonNoticeValue)) {
				$('.coretonNoticeValue').html(coretonNoticeValue);
			}
		
			if(coretonBtn=="on") {
				$('.coretonBtn').val("on").slider().slider("refresh");
			}else {
				$('.coretonBtn').val("off").slider().slider("refresh");
			}
		
		} else {
			console.log("페이지 오류 입니다. 확인 바랍니다.");
		}

	});
}

function warningNotiSetting() {

	jappinf.getAppPref("ascentRateNoti,reductionRateNoti,noSignalNoti,lowNoticeValue,highNoticeValue,coretonNoticeValue,emLowNoticeValue", function(resultCd, result) {
		if (resultCd == RESULTCODE.SUCC) {
			var key = Object.keys(result);
			var ascentRateNoti = result["ascentRateNoti"];
			var reductionRateNoti = result["reductionRateNoti"];
			var noSignalNoti = result["noSignalNoti"];
			var lowNoticeValue = result["lowNoticeValue"];
			var highNoticeValue = result["highNoticeValue"];
			var coretonNoticeValue = result["coretonNoticeValue"];
			var emLowNoticeValue = result["emLowNoticeValue"];
			
			console.log("get setting value = " + ascentRateNoti +  " value2 = " + reductionRateNoti + " noSignalNoti = " + noSignalNoti + " lowNoticeValue = "+lowNoticeValue);
			if(!isNull(lowNoticeValue)) {
				$('.emLowNoticeValue').html(lowNoticeValue);
			}
			if(!isNull(highNoticeValue)) {
				$('.emHighNoticeValue').html(highNoticeValue);
			}
			if(!isNull(coretonNoticeValue)) {
				$('.emcoretonNoticeValue').html(coretonNoticeValue);
			}
			if(!isNull(emLowNoticeValue)) {
				$('.emrgnHyNoticeValue').html(emLowNoticeValue);
			}
			if(ascentRateNoti=="on") {
				$('.ascentRateNoti').val("on").slider().slider("refresh");
			}else {
				$('.ascentRateNoti').val("off").slider().slider("refresh");
			}
			if(reductionRateNoti == "on") {
				$('.reductionRateNoti').val("on").slider().slider("refresh");
			} else {
				$('.reductionRateNoti').val("off").slider().slider("refresh");
			}
			if(noSignalNoti == "on") {
				$('.noSignalNoti').val("on").slider().slider("refresh");
			} else {
				$('.noSignalNoti').val("off").slider().slider("refresh");
			}
		
		} else {
			console.log("페이지 오류 입니다. 확인 바랍니다.");
		}

	});
}

function changeSetting() {
	
	$('.lowNoticeSugarBtn').change(function() {
		console.log("111111");
		var param = {};
		if (this.value == "on") {
			console.log("저혈당  설정 ON" +  $('.lowNoticeValue').text());
			param["lowNoticeSugarBtn"] = "on";
			param["lowNoticeValue"] = $('.lowNoticeValue').text();
			param["lowNoticeRepeatRington"] = $('.lowNoticeRepeatRington').val();
			param["lowNoticeRington"] = $('.lowNoticeRington').html();
			jappinf.setAppPref(param, function(resultCd) {
				console.log('lowNoticeSugarBtn for on ');
			});
		}else {
			console.log("저혈당 설정 off");
			param["lowNoticeSugarBtn"] = "off";
			param["lowNoticeValue"] = $('.lowNoticeValue').text();
			param["lowNoticeRepeatRington"] = $('.lowNoticeRepeatRington').val();
			param["lowNoticeRington"] = $('.lowNoticeRington').html();
			jappinf.setAppPref(param, function(resultCd) {
				console.log('lowNoticeSugarBtn for off ');
			});
		}
		var noticesYn = param["lowNoticeSugarBtn"] == 'on' ? 'Y' : 'N';
		var value = noticesYn.concat('^').concat(param["lowNoticeValue"]);
		var obj = {
				SET_ITEM : '5011',
				SET_VAL : value
			};
		cmmnAjax("appGlu/ms/insertWarningNoti.do", obj, function(data) {
			console.log("what are you insertWarningNoti?");
		});
	});


	$('.highNoticeSugarBtn').change(function() {
		console.log("22222");
		var param = {};
		if (this.value == "on") {
			console.log("고혈당  설정 ON" +  $('.highNoticeValue').text());
			param["highNoticeSugarBtn"] = "on";
			param["highNoticeValue"] = $('.highNoticeValue').text();
			param["highNoticeRepeatRington"] = $('.highNoticeRepeatRington').val();
			param["highNoticeRington"] = $('.highNoticeRington').html();
			jappinf.setAppPref(param, function(resultCd) {
				console.log('highNoticeSugarBtn for on ');
			});
		}else {
			console.log("고혈당 설정 off");
			param["highNoticeSugarBtn"] = "off";
			param["highNoticeValue"] = $('.highNoticeValue').text();
			param["highNoticeRepeatRington"] = $('.highNoticeRepeatRington').val();
			param["highNoticeRington"] = $('.highNoticeRington').html();
			jappinf.setAppPref(param, function(resultCd) {
				console.log('highNoticeSugarBtn for off ');
			});
		}
		var noticesYn = param["highNoticeSugarBtn"] == 'on' ? 'Y' : 'N';
		$('#notice02').data("highSaveData",$('.highSaveData').val());
		var value = noticesYn.concat('^').concat(param["highNoticeValue"]);
		var obj = {
				SET_ITEM : '5012',
				SET_VAL : value
			};
		cmmnAjax("appGlu/ms/insertWarningNoti.do", obj, function(data) {
			console.log("what are you insertWarningNoti?");
		});
	});
	
	$('.coretonBtn').change(function() {
		var param = {};
		if (this.value == "on") {
			console.log("보정알림  설정 ON" +  $('.coretonNoticeValue').text());
			param["coretonBtn"] = "on";
			param["coretonNoticeValue"] = $('.coretonNoticeValue').text();
			
			jappinf.setAppPref(param, function(resultCd) {
				console.log('coretonBtn for on ');
				jappinf.coretonAlarm(function(resultCd) {
					console.log('coretonAlarm for on ');
				});
			});
		}else {
			console.log("보정알림  설정 off");
			param["coretonBtn"] = "off";
			param["coretonNoticeValue"] = $('.coretonNoticeValue').text();
			jappinf.setAppPref(param, function(resultCd) {
				console.log('coretonBtn for off ');
				jappinf.coretonAlarm(function(resultCd) {
					console.log('coretonAlarm for off ');
				});
			});
			
		}
	});

}

//---- 저혈당 셋팅 값들 시작 ----

$(document).one('click', '.lowNoticeRington', function() {
	jappinf.lowRingtonSet(function(resultCd,result){
		console.log("lowNoticeRington !!!! " + JSON.stringify(result));
		$('.lowNoticeRington').html(result.ringtoneTItle);
	});
});

$(document).on('click', '.lowSaveBtn', function() {
	var beforeHighNoticeValue = $('.emHighNoticeValue').html();
	var beforeLowNoticeValue  = $('.emLowNoticeValue').html();
	var beforeEmLowNoticeValue = $('.emrgnHyNoticeValue').html();
	
	if(Number($('.lowSaveData').val())>Number(beforeHighNoticeValue)){
		$('#alert_num').val(beforeLowNoticeValue);
		alert('저혈당 설정수치는 고혈당 설정수치보다 낮아야합니다.')
		return;
	}
	if(Number($('.lowSaveData').val())<Number(beforeEmLowNoticeValue)){
		$('#alert_num').val(beforeLowNoticeValue);
		alert('저혈당 설정수치는 긴급저혈당 설정수치보다 높아야합니다.')
		return;
	}
	$('#notice01').data("lowSaveData",$('.lowSaveData').val());
	var param = {};
	param["lowNoticeValue"] = $('#notice01').data("lowSaveData");
	jappinf.setAppPref(param, function(resultCd) {
		console.log('lowNoticeValue save change value ');
	});
	var noticesYn = $('.lowNoticeSugarBtn').val() == 'on' ? 'Y' : 'N';
	var value = noticesYn.concat('^').concat(param["lowNoticeValue"]);
	var obj = {
			SET_ITEM : '5011',
			SET_VAL : value
		};
	cmmnAjax("appGlu/ms/insertWarningNoti.do", obj, function(data) {
		console.log("what are you insertWarningNoti?");
	});
});


$(document).on('change','.lowNoticeRepeatRington',function() {
	var param = {};
	param["lowNoticeRepeatRington"] = this.value;
	jappinf.setAppPref(param, function(resultCd) {
		console.log('lowNoticeRepeatRington save change value ');
	});
});
// 저혈당 셋팅 값들 끝 ----

// 고혈당 셋팅 값들  ----


$(document).on('click', '.highNoticeRington', function() {
	jappinf.highRingtonSet(function(resultCd,result){
		console.log("highNoticeRington !!!! " + JSON.stringify(result));
		$('.highNoticeRington').html(result.ringtoneTItle);
	});
});

$(document).on('click', '.highSaveBtn', function() {
	var beforeHighNoticeValue = $('.emHighNoticeValue').html();
	var beforeLowNoticeValue  = $('.emLowNoticeValue').html();
	var beforeEmLowNoticeValue = $('.emrgnHyNoticeValue').html();
	
	if(Number($('.highSaveData').val())<Number(beforeLowNoticeValue)){
		$('#alert_num2').val(beforeHighNoticeValue);
		alert('고혈당 설정수치는 저혈당 설정수치보다 높아야합니다.')
		return;
	}
	if(Number($('.highSaveData').val())<Number(beforeEmLowNoticeValue)){
		$('#alert_num2').val(beforeHighNoticeValue);
		alert('고혈당 설정수치는 긴급 저혈당 설정수치보다 높아야합니다.')
		return;
	}
	$('#notice02').data("highSaveData",$('.highSaveData').val());
	var param = {};
	param["highNoticeValue"] = $('#notice02').data("highSaveData");
	jappinf.setAppPref(param, function(resultCd) {
		console.log('highNoticeValue save change value ');
	});
	
	var noticesYn = $('.highNoticeSugarBtn').val() == 'on' ? 'Y' : 'N';
	var value = noticesYn.concat('^').concat(param["highNoticeValue"]);
	var obj = {
			SET_ITEM : '5012',
			SET_VAL : value
		};
	cmmnAjax("appGlu/ms/insertWarningNoti.do", obj, function(data) {
		console.log("what are you insertWarningNoti?");
	});
});

$(document).on('change','.highNoticeRepeatRington',function() {코드로
	var param = {};
	param["highNoticeRepeatRington"] = this.value;
	jappinf.setAppPref(param, function(resultCd) {
		console.log('highNoticeRepeatRington save change value ');
	});
});

// 고혈당 셋팅 값들 끝 ----

$(document).on('click', '.coretonSaveBtn', function() {
	if($('.coretonSaveData').val() < 5) {
		alert('최소 5분 이상으로 시간을 설정해 주세요.');
		return;
	}
	$('#notice03').data("coretonSaveData",$('.coretonSaveData').val());
	var param = {};
	param["coretonNoticeValue"] = $('#notice03').data("coretonSaveData");
	jappinf.setAppPref(param, function(resultCd) {
		console.log('coretonNoticeValue save change value ');
		window.history.back();
	});
});

$('.reductionRateNoti').change(function() {
	var param = {};
	if (this.value == "on") {
		param["reductionRateNoti"] = "on";
		jappinf.setAppPref(param, function(resultCd) {
			console.log('reductionRate for on ');
		});
	}else {
		param["reductionRateNoti"] = "off";
		jappinf.setAppPref(param, function(resultCd) {
			console.log('reductionRate for off ');
		});
	}
});
$('.ascentRateNoti').change(function() {
	var param = {};
	if (this.value == "on") {
		param["ascentRateNoti"] = "on";
		jappinf.setAppPref(param, function(resultCd) {
			console.log('ascentRate for on ');
		});
	}else {
		param["ascentRateNoti"] = "off";
		jappinf.setAppPref(param, function(resultCd) {
			console.log('ascentRate for off ');
		});
	}
});

$('.noSignalNoti').change(function() {
	var param = {};
	if (this.value == "on") {
		param["noSignalNoti"] = "on";
		jappinf.setAppPref(param, function(resultCd) {
			console.log('noSignalNoti for on ');
		});
	}else {
		param["noSignalNoti"] = "off";
		jappinf.setAppPref(param, function(resultCd) {
			console.log('noSignalNoti for off ');
		});
	}
});


function initDeviceInfo() {
	// 페어 디바이스정보 가져오기
	console.log('initDeviceInfo called ...');
	jappinf.getPairedDeviceList(function(resultCd, result) {
		console.log('getPairedDeviceList>>resultCd[' + resultCd + ']result::' + JSON.stringify(result));
		if (result != null && result !="") {
			$.each(result,function(i,item){
				console.log(item)
				if(4 == item.DEVICE_TYPE){
					currentCGMDevice = item;
				}
				console.log()
			});
		} else {
			currentCGMDevice = null;
		}
	});
}
function initSensorInfo() {
	console.log('initSensorInfo called ...');
	jappinf.getAppPref("isSensor", function(resultCd, result) {
		console.log("?SDFDSF " + JSON.stringify(result));
		if(resultCd == RESULTCODE.SUCC) {
			console.log("???FFF??" +result['isSensor'] );
			if(!isNull(result['isSensor'])) {
				sensorStatus = result['isSensor'];
			}else {
				sensorStatus = "N";
			}
		}
		
	});
}

$(document).on('click',	'.deviceSetBtn',function() {
	var index = $("li").index(this);
	var deviceNm;
	
	if(index == 1){//G6
		deviceNm = "DEXCOM_G6"; 
		$('.device_detail_box').find('div').css('background-image','url("../../images/app/device/DexcomG6.jpg")');
		$('.device_detail_list').find('li:eq(0)').text("DEXCOM G6");
	} else if (index == 2) {//G5
		deviceNm = "DEXCOM_G5"; 
		$('.device_detail_box').find('div').css('background-image','url("../../images/app/device/DexcomG5.png")');
		$('.device_detail_list').find('li:eq(0)').text("DEXCOM G5");
		
	} else if (index == 3) {//LIBRE
		deviceNm = "LIBRE_1"; 
		$('.device_detail_box').find('div').css('background-image','url("../../images/app/device/Libre1.png")');
		$('.device_detail_list').find('li:eq(0)').text("LIBRE");
	}
	changeToFun(deviceNm);		

	
});

function changeToFun(deviceNm,isSensor) {
	$('.list_cm01').empty();
	$('.btn_area_box01').empty();
	console.log(currentCGMDevice)
	if(currentCGMDevice == null) {
		if(deviceNm == "DEXCOM_G5"||deviceNm == "DEXCOM_G6") {
			if(sensorStatus == "Y") {
				$('.btn_area_box01').append('<a href="#device_disconnect" class="ui-btn" data-rel="popup" data-position-to="window" data-transition="pop">센서 중단</a>'
								+'<a href="#device_nofairing" class="ui-btn" data-rel="popup" data-position-to="window" data-transition="pop">페어링 중단</a>');
			} else {
				$('.btn_area_box01').append('<a href="#device_connect" class="ui-btn" data-rel="popup" data-position-to="window" data-transition="pop">센서 시작</a>'
								+'<a href="#device_fairing" class="ui-btn '+deviceNm+'" id="G_sensor_start" data-rel="popup" data-position-to="window" data-transition="pop">페어링 시작</a>');
			}
			$('.list_cm01').append('<li> <a href="#warning_info"><h1>경고</h1></a></li>'
								+ '<li> <a href="#help_info"><h1>도움말</h1></a></li>');
			
		} else if(deviceNm == "LIBRE_1") {
			$('.list_cm01').append('<li> <a href="#warning_info"><h1>목표 설정</h1></a></li>' 
					+'<li> <a href="#help_info"><h1>도움말</h1></a></li>');
			$('.btn_area_box01').append('<a href="#device_startnfc" class="ui-btn" data-rel="popup" data-position-to="window" data-transition="pop">NFC 시작</a>');
			$('.emNoti_1').remove();
			$('.emNoti_4').remove();
			$('.emNoti_5').remove();
			$('.emNoti_6').remove();
			$('.emNoti_7').remove();
		}
	} else if (currentCGMDevice.MODEL_NM == "DEXCOM_G5"||currentCGMDevice.MODEL_NM == "Dexcom_G6") {
		if(deviceNm == "DEXCOM_G5"||deviceNm == "DEXCOM_G6") {
			if(sensorStatus == "Y") {
				$('.btn_area_box01').append('<a href="#device_disconnect" class="ui-btn" data-rel="popup" data-position-to="window" data-transition="pop">센서 중단</a>'
								+'<a href="#device_nofairing" class="ui-btn" data-rel="popup" data-position-to="window" data-transition="pop">페어링 중단</a>');
			} else {
				$('.btn_area_box01').append('<a href="#device_connect" class="ui-btn" data-rel="popup" data-position-to="window" data-transition="pop">센서 시작</a>'
								+'<a href="#device_fairing" class="ui-btn '+deviceNm+'" id="G_sensor_start" data-rel="popup" data-position-to="window" data-transition="pop">페어링 시작</a>');
			}
			$('.list_cm01').append('<li> <a href="#warning_info"><h1>경고</h1></a></li>'
								+ '<li> <a href="#help_info"><h1>도움말</h1></a></li>');
			
		} else if(deviceNm == "LIBRE_1") {
			$('.list_cm01').append('<li> <a href="#warning_info"><h1>목표 설정</h1></a></li>' 
					+'<li> <a href="#help_info"><h1>도움말</h1></a></li>');
			$('.btn_area_box01').append('<a href="#device_startnfc" class="ui-btn" data-rel="popup" data-position-to="window" data-transition="pop">NFC 시작</a>');
			$('.emNoti_1').remove();
			$('.emNoti_4').remove();
			$('.emNoti_5').remove();
			$('.emNoti_6').remove();
			$('.emNoti_7').remove();
		}
	} else if( currentCGMDevice.MODEL_NM == "LIBRE_1" ) {
		if(deviceNm == "DEXCOM_G5"||deviceNm == "DEXCOM_G6") {
			$('.list_cm01').append('<li> <a href="#warning_info"><h1>경고</h1></a></li>'
								+ '<li> <a href="#help_info"><h1>도움말</h1></a></li>');
			$('.btn_area_box01').append('<a href="#device_connect" class="ui-btn" data-rel="popup" data-position-to="window" data-transition="pop">센서 시작</a>'
								+'<a href="#device_fairing" class="ui-btn '+deviceNm+'" id="G_sensor_start"data-rel="popup" data-position-to="window" data-transition="pop">페어링 시작</a>');
		} else if(deviceNm == "LIBRE_1") {
			$('.list_cm01').append('<li> <a href="#warning_info"><h1>목표 설정</h1></a></li>' 
									+'<li> <a href="#help_info"><h1>도움말</h1></a></li>');
			$('.btn_area_box01').append('<a href="#device_stopnfc" class="ui-btn" data-rel="popup" data-position-to="window" data-transition="pop">NFC 중단</a>');
			$('.emNoti_1').remove();
			$('.emNoti_4').remove();
			$('.emNoti_5').remove();
			$('.emNoti_6').remove();
			$('.emNoti_7').remove();
		}
	}
}

var pairGstartNm = '';
$(document).on('click','#G_sensor_start',function(){
	pairGstartNm = '';
	var sensor_g_nm = $(this).attr('class').split(' ')[1];
	pairGstartNm = sensor_g_nm;
});

$(document).on('click', '.sensorStopBtn', function() {
	jappinf.stopSensor(function(resultCd2, result2) {
		console.log("stopSensor == " + resultCd2);
		if (resultCd2 == RESULTCODE.SUCC) {
			var param = {};
			param["pageId"] = "01";
			param['isSensor'] = 'N';
			jappinf.setAppPref(param, function(resultCd) {
				console.log('setAppPref for pageId 01');
			});
			$("#device_disconnect").popup().popup('close');
			$('.btn_area_box01').empty();
			$('.btn_area_box01').append('<a href="#device_connect" class="ui-btn" data-rel="popup" data-position-to="window" data-transition="pop">센서 시작</a>'
									+'<a href="#device_nofairing" class="ui-btn" data-rel="popup" data-position-to="window" data-transition="pop">페어링 중단</a>');
		} else {
			alert("센서 중단에 실패하였습니다. 다시 시도해 주세요.")
		}
	});
});

$(document).on('click', '.removeBondBtn', function() {
	var broadcastId = currentCGMDevice.MACADDRESS;
	console.log("removeBond ==click ok == ? " + broadcastId);

	jappinf.removeBond(broadcastId, function(resultCd2, result2) {
		console.log("removeBond == " + resultCd2);
		if (resultCd2 == RESULTCODE.SUCC) {
			var removepairparam = {};
			removepairparam['pageId'] = '';
			removepairparam['isSensor'] = 'N';
			removepairparam['transId'] = '';
			removepairparam['transModelNm'] ='';
			removepairparam['G6STACH_SCAN'] = '';
			removepairparam['sensorG6Id'] = '';
			jappinf.setAppPref(removepairparam, function(resultCd) {
				console.log('setAppPref for pageId 01');
			});
			$("#device_nofairing").popup().popup('close');
			location.href = "deviceSetting.html";
		} else {
			alert("페어링 해제에 실패하였습니다. 다시 시도해 주세요.");
		}
	});
});

//센서 시작 버튼 클릭.
$(document).on('click', '.startSensor', function() {
	console.log("startSensor == ok");
	jappinf.getAppPref("isSensor", function(resultCd, result) {
		if(resultCd == RESULTCODE.SUCC) {
			if(result['isSensor'] == "Y") {
				alert("이미 연결되어 있는 센서를 해제하십시오.");
			} else if(currentCGMDevice == null) {
				alert('DEXCOM 페어링 시작을 먼저 해주세요');
			} else {
				jappinf.setAppPref({'isSensor':'Y'}, function(resultCd) {
					console.log('setAppPref for email success');
					location.href = "../mn/deviceReg02.html";
				});
			}
		}
	});
});
//NFC 시작 버튼 클릭.
	$(document).on("click", ".startNFCMode", function(){
		if(currentCGMDevice != null) {
			alert("이미 연결되어 있는 센서를 해제하십시오.");
		} else {
			jappinf.startNfcMode(function(resultCd2) {
				console.log("startNfcMode == ");
				var param = {};
				param["pageId"] = "02";
				jappinf.setAppPref(param, function(resultCd) {
					setSensor();
					console.log('setAppPref for email success');
					location.href = "../mn/deviceReg02.html"
				});
			});
		}
	});

//페어링 시작 버튼 클릭.
$(document).on("click", ".startPairing", function(){
	if(currentCGMDevice != null) {
		alert("이미 연결되어 있는 센서를 해제하십시오.");
	} else {
		if(pairGstartNm=='DEXCOM_G5'){
			location.href = "../mn/deviceReg01.html#enterNum";
		}else if(pairGstartNm=='DEXCOM_G6'){
			location.href = "../mn/deviceReg01.html#enterG6Num";
		}
		//location.href = "../mn/deviceReg01.html#enterNum";
	}
});

function setSensor() {
	var param = {
		SENSOR_SN : 1
	};
	cmmnAjax("appGlu/ms/insertSsData.do", param, function(data) {
		console.log("what are you insertSsData?");
	});
}


// ---- 2020-04-09 장수영 ----

