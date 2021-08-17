var userId = sessionStorage.getItem("USER_ID");

$(document).on("pagebeforecreate", function() {
	console.log('1. pagebeforecreate==');
	dashBoardinit();
});

$(document).on("pagebeforeshow", function() {
	console.log('2. pagebeforeshow==');
	var pageId = $.mobile.activePage.attr('id');
	console.log("XXX11111" + pageId);

});

$(document).on("pageshow", function() {
	console.log('3. pageshow==');
	meterNumListener();

});

$(document).on("ready", function() {
	console.log('4. ready==');
});

// ---- 2020-04-09 장수영 ----

$(document).on('click','.re_scan_sensor',function(){
	reScanInit();
});

function reScanInit(){
	jappinf.getAppPref("pageId,transId,stopScan,SELFMEASRSET_YN_"+userId+",transModelNm,G6STACH_SCAN", function(resultCd, result) {
		if (resultCd == RESULTCODE.SUCC) {
			console.log(result)
			var key = Object.keys(result);
			console.log(key);
			var getPref = result[key[0]];
			var getTransId = result[key[1]];
			getTransId = getTransId.toUpperCase();
			var stopScan = result[key[2]];
			var selfMeasrYn = result[key[3]];
			console.log(result[key[4]]);
			console.log("dashboard pageId = " + getPref + " selfMeasrYn == "+ selfMeasrYn);
			if(isNullToString(selfMeasrYn) != "") {
				deviceutil.selfMeasrUpd();
			}
			
			if (getPref == "00" && stopScan == "false") {
				console.log("dashboard pageId = " + getPref + " getTransId == "+ getTransId);
				location.href = "../mn/deviceReg01.html#device_search";
				jappinf.inputSerialNumber(getTransId, function(resultCd2,result2) {
					console.log("inputSerialNumber == "+ JSON.stringify(result2));
					$("#search_ok").popup().popup('open');
					var param = {};
					param["pageId"] = "01";
					jappinf.setAppPref(param, function(resultCd) {
						console.log('setAppPref for email success');
					});
					setTimeout('go_url()', 2000);

				});
			} else if(getPref == "00" && stopScan == "true") {
				var param = {};
				param["pageId"] = "";
				param["stopScan"] = "";
				param["transId"] = "";
				jappinf.setAppPref(param, function(resultCd) {
					location.href = "../mn/dashboard.html";
				});
				
			}
			if(getPref == "07" && stopScan == "true"){
				if(result[key[4]] == 'G6'&&(isNullToString(result[key[1]])!='')){
					var paramG6={};
					paramG6["transId"] = result[key[1]];
					paramG6["transModelNm"] = "G6";
					jappinf.setAppPref(paramG6, function(resultCd) {
						console.log('setAppPref for email success');
					});
					
					if(result[key[5]]=='Y'){
						location.href = '#enterG6SensorNum';
					}else{
						location.href = '#device_search';
						jappinf.inputSerialNumber(paramG6, function(resultCd2, result2) {
							console.log("inputSerialNumber == " + JSON.stringify(result2));
							$("#search_ok").popup().popup('open');
							setTimeout('test_go_url()', 2000);
						});
					}
				}else{
					if(result[key[4]].indexOf('G5')>-1 &&(isNullToString(result[key[1]])!='')){
						location.href = "../mn/deviceReg02.html";
					}else if(result[key[4]].indexOf('G5')>-1 &&(isNullToString(result[key[1]])=='')) {
						location.href = "#enterNum";						
					}
				}
			}
			
			if(getPref == "07" && isNullToString(getTransId,'')!=''){
				if(result[key[4]] == 'G6'&&(isNullToString(result[key[1]])!='')){
					var paramG6={};
					paramG6["transId"] = result[key[1]];
					paramG6["transModelNm"] = "G6";
					jappinf.setAppPref(paramG6, function(resultCd) {
						console.log('setAppPref for email success');
					});
					if(result[key[5]]=='Y'){
						location.href = '#enterG6SensorNum';
					}else{
						location.href = '#device_search';
						jappinf.inputSerialNumber(paramG6, function(resultCd2, result2) {
							console.log("inputSerialNumber == " + JSON.stringify(result2));
							$("#search_ok").popup().popup('open');
							setTimeout('test_go_url()', 2000);
						});
					}
				}else{
					if(result[key[4]].indexOf('G5')>-1 &&(isNullToString(result[key[1]])!='')){
						location.href = "../mn/deviceReg02.html";
					}else if(result[key[4]].indexOf('G5')>-1 &&(isNullToString(result[key[1]])=='')) {
						location.href = "#enterNum";						
					}
				}
			}
		} else {
			console.log("페이지 오류 입니다. 확인 바랍니다.");
		}
	});
}


function dashBoardinit() {
	jappinf.getAppPref("pageId,transId,stopScan,SELFMEASRSET_YN_"+userId+",transModelNm,G6STACH_SCAN", function(resultCd, result) {
		if (resultCd == RESULTCODE.SUCC) {
			console.log(result)
			var key = Object.keys(result);
			console.log(key);
			var getPref = result[key[0]];
			var getTransId = result[key[1]];
			getTransId = getTransId.toUpperCase();
			var stopScan = result[key[2]];
			var selfMeasrYn = result[key[3]];
			console.log(result[key[4]]);
			console.log("dashboard pageId = " + getPref + " selfMeasrYn == "+ selfMeasrYn);
			if(isNullToString(selfMeasrYn) != "") {
				deviceutil.selfMeasrUpd();
			}
			
			if (getPref == "00" && stopScan == "false") {
				console.log("dashboard pageId = " + getPref + " getTransId == "+ getTransId);
				location.href = "../mn/deviceReg01.html#device_search";
				jappinf.inputSerialNumber(getTransId, function(resultCd2,result2) {
					console.log("inputSerialNumber == "+ JSON.stringify(result2));
					$("#search_ok").popup().popup('open');
					var param = {};
					param["pageId"] = "01";
					jappinf.setAppPref(param, function(resultCd) {
						console.log('setAppPref for email success');
					});
					setTimeout('go_url()', 2000);

				});
			} else if(getPref == "00" && stopScan == "true") {
				var param = {};
				param["pageId"] = "";
				param["stopScan"] = "";
				param["transId"] = "";
				jappinf.setAppPref(param, function(resultCd) {
					location.href = "../mn/dashboard.html";
				});
				
			}
			if(getPref == "07" && stopScan == "true"){
				if(result[key[4]] == 'G6'&&(isNullToString(result[key[1]])!='')){
					var paramG6={};
					paramG6["transId"] = result[key[1]];
					paramG6["transModelNm"] = "G6";
					jappinf.setAppPref(paramG6, function(resultCd) {
						console.log('setAppPref for email success');
					});
					
					if(result[key[5]]=='Y'){
						location.href = '#enterG6SensorNum';
					}else{
						jappinf.inputSerialNumber(paramG6, function(resultCd2, result2) {
							console.log("inputSerialNumber == " + JSON.stringify(result2));
							$("#search_ok").popup().popup('open');
							setTimeout('test_go_url()', 2000);
						});
					}
				}else{
					if(result[key[4]].indexOf('G5')>-1 &&(isNullToString(result[key[1]])!='')){
						location.href = "../mn/deviceReg02.html";
					}else if(result[key[4]].indexOf('G5')>-1 &&(isNullToString(result[key[1]])=='')) {
						location.href = "#enterNum";						
					}
				}
			}
			
			if(getPref == "07" && isNullToString(getTransId,'')!=''){
				if(result[key[4]] == 'G6'&&(isNullToString(result[key[1]])!='')){
					var paramG6={};
					paramG6["transId"] = result[key[1]];
					paramG6["transModelNm"] = "G6";
					jappinf.setAppPref(paramG6, function(resultCd) {
						console.log('setAppPref for email success');
					});
					if(result[key[5]]=='Y'){
						location.href = '#enterG6SensorNum';
					}else{
						jappinf.inputSerialNumber(paramG6, function(resultCd2, result2) {
							console.log("inputSerialNumber == " + JSON.stringify(result2));
							$("#search_ok").popup().popup('open');
							setTimeout('test_go_url()', 2000);
						});
					}
				}else{
					if(result[key[4]].indexOf('G5')>-1 &&(isNullToString(result[key[1]])!='')){
						location.href = "../mn/deviceReg02.html";
					}else if(result[key[4]].indexOf('G5')>-1 &&(isNullToString(result[key[1]])=='')) {
						location.href = "#enterNum";						
					}
				}
			}
		} else {
			console.log("페이지 오류 입니다. 확인 바랍니다.");
		}
	});
}
//only G5
$(document).on('click', '.inputTransId', function() {
	console.log("transId ==  " + $('.transId').val());
	if ($('.transId').val() == "") {
		alert('트랜스미터기의 시리얼번호를 입력해주세요.');
		return;
	}
	var transId = $('.transId').val();
	transId = transId.toUpperCase();
	var param = {};
	param["pageId"] = "07";
	param["transId"] = isNullToString(transId,'');
	param["transModelNm"] = "G5";
	jappinf.setAppPref(param, function(resultCd) {
		console.log('setAppPref for email success');
	});

	jappinf.inputSerialNumber(param, function(resultCd2, result2) {
		console.log("inputSerialNumber == " + JSON.stringify(result2));
		$("#search_ok").popup().popup('open');
		var param = {};
		param["pageId"] = "01";
		jappinf.setAppPref(param, function(resultCd) {
			console.log('setAppPref for email success');
		});
		setTimeout('go_url()', 2000);
	});
});


//G6 테스트(트랜스미터)
$(document).on('click', '.inputTransG6Id', function() {
	console.log("transId ==  " + $('.transG6Id').val());
	if ($('.transG6Id').val() == "") {
		alert('트랜스미터기의 시리얼번호를 입력해주세요.');
		return;
	}
	var transId = $('.transG6Id').val();
	transId = transId.toUpperCase();
	var param = {};
	param["pageId"] = "07";
	param["transId"] = isNullToString(transId,'');
	param["transModelNm"] = "G6";
	jappinf.setAppPref(param, function(resultCd) {
		console.log('setAppPref for email success');
	});

	jappinf.inputSerialNumber(param, function(resultCd2, result2) {
		console.log("inputSerialNumber == " + JSON.stringify(result2));
		$("#search_ok").popup().popup('open');
		setTimeout('test_go_url()', 2000);
	});
});

//G6 테스트(부착센서)
$(document).on('click', '.inputTransG6SensorId', function() {
	console.log("sensorId ==  " + $('.transG6SensorId').val());
	if ($('.transG6SensorId').val() == "") {
		alert('센서의 시리얼번호를 입력해주세요.');
		return;
	}
	var sensorG6Id = $('.transG6SensorId').val();
	sensorG6Id = sensorG6Id.toUpperCase();
	var param = {};
	param["pageId"] = "01";
	param["sensorG6Id"] = sensorG6Id;
	param["transModelNm"] = "G6";
	jappinf.setAppPref(param, function(resultCd) {
		console.log('setAppPref for email success');
	});

	jappinf.realStartSensor(param, function(resultCd2, result2) {
		console.log("inputSerialNumber == " + JSON.stringify(result2));
		if (resultCd2 == RESULTCODE.SUCC) {
			location.href = "deviceReg02.html";
		} else {
			console.log("realStartSensor ==  fail");
		}
	});
});



$(document).on('click', '.stopScanBtn', function() {
	console.log("stopScanBtn == click ");
	jappinf.stopScan(function(resultCd2, result2) {
		if (resultCd2 == RESULTCODE.SUCC) {
			console.log("stopScan == SUCC");
		} else {
			console.log("stopScan == FAIL");
		}
	});
});

function meterNumListener() {
	$(".transId").on("propertychange change keyup paste", function() {
		var currentVal = $(this).val();
		if (currentVal == "") {
			$('.inputTransId').removeClass('in');
		} else {
			$('.inputTransId').addClass('in');
		}
	});
	
	$(".transG6Id").on("propertychange change keyup paste", function() {
		var currentVal = $(this).val();
		if (currentVal == "") {
			$('.inputTransG6Id').removeClass('in');
		} else {
			$('.inputTransG6Id').addClass('in');
		}
	});
	
	$(".transG6SensorId").on("propertychange change keyup paste", function() {
		var currentVal = $(this).val();
		if (currentVal == "") {
			$('.inputTransG6SensorId').removeClass('in');
		} else {
			$('.inputTransG6SensorId').addClass('in');
		}
	});
}

function go_url() {
	location.href = "deviceReg02.html"
}

function test_go_url() {
	var param = {};
	param['G6STACH_SCAN'] = 'Y';
	param['isSensor'] = 'Y';
	jappinf.setAppPref(param, function(resultCd) {
		console.log('setAppPref for email success');
		location.href = "#enterG6SensorNum"
	});
}




// ---- 2020-04-09 장수영 ----

