var userId = sessionStorage.getItem("USER_ID");

$(document).on("pagebeforecreate", function() {
	console.log('1. pagebeforecreate==');
	dashBoardinit();
	if (!isNull(localStorage.getItem("countTime"))) {
		changeCount(localStorage.getItem("countTime"));
	}
});
$(document).on("pagebeforeshow", function() {
	console.log('2. pagebeforeshow==');
	var req = new Request();
	if (!isNull(req.getParameter("glucose"))) {
		var inputValue = req.getParameter("glucose");
		var pageId = req.getParameter("pageId");
		gmateCorrection(inputValue, pageId);
	}
});
$(document).on("pageshow", function() {
	console.log('3. pageshow==');
	CorrectionKeyListener();
});
$(document).on("ready", function() {
	console.log('4. ready==');
});

// ---- 2020-04-09 장수영 ----

function dashBoardinit() {
	var startDiv = $('.startDiv');
	var warmupDiv = $('.warmupDiv');
	var firCorrectionValue = $('.firCorrectionValue');
	var secCorrectionValue = $('.secCorrectionValue');

	jappinf.getAppPref("deviceType,pageId,SELFMEASRSET_YN_" + userId, function(
			resultCd, result) {
		if (resultCd == RESULTCODE.SUCC) {

			var key = Object.keys(result);
			var getPref = result[key[1]];
			var selfMeasrYn = result[key[2]];

			if (getPref == "05") { // 05 == 연동완료
				console.log("dashboard pageNm = " + getPref);
				location.href = "../mn/dashboard.html";
			} else if (getPref == "01") { // 01 == 센서시작
				console.log("dashboard pageNm = " + getPref);
				$('.startDiv').show();
				$('.warmupDiv').hide();
				$('.firCorrectionValue').hide();
				$('.secCorrectionValue').hide();
			} else if (getPref == "02") { // 02 == 워밍업
				console.log("dashboard pageNm = " + getPref);
				$('.startDiv').hide();
				$('.warmupDiv').show();
				$('.firCorrectionValue').hide();
				$('.secCorrectionValue').hide();
			} else if (getPref == "03") { // 03 == 보정값 첫번째 입력
				console.log("dashboard pageNm = " + getPref);
				$('.startDiv').hide();
				$('.warmupDiv').hide();
				$('.firCorrectionValue').show();
				$('.secCorrectionValue').hide();
			} else if (getPref == "04") { // 04 == 보정값 두번째 입력
				console.log("dashboard pageNm = " + getPref);
				$('.startDiv').hide();
				$('.warmupDiv').hide();
				$('.firCorrectionValue').hide();
				$('.secCorrectionValue').show();
			} else { // 미연동 페이지
				console.log("페이지를 찾지 못하였습니다. no Value");
			}

		} else {
			console.log("페이지 오류 입니다. 확인 바랍니다.");
		}

		if (isNullToString(selfMeasrYn) != "") {
			deviceutil.selfMeasrUpd();
		}
	});

}

$(document).on('click', '.stopSensor', function() {
	jappinf.stopSensor(function(resultCd2, result2) {
		console.log("stopSensor == ok" + resultCd2);
		var param = {};
		param["pageId"] = "01";
		jappinf.setAppPref(param, function(resultCd) {
			console.log('setAppPref for pageId 01');
		});

	});
});

$(document).on(
		'click',
		'.inputCorrection',
		function() {
			var fValue = $('.firValue').val();
			var sValue = $('.secValue').val();
			console.log("inputCorrection :: fValue = " + fValue
					+ " ::  sValue = " + sValue);
			jappinf.inputCorrection(fValue, sValue, function(resultCd2) {
				console.log("inputCorrection == ok" + resultCd2);
			});
		});

$(document).on('click', '.resetAllCalibrations', function() {
	console.log("resetAllCalibrations click ::: ");
	jappinf.resetAllCalibrations(function(resultCd2, result2) {
		console.log("resetAllCalibrations == ok" + resultCd2);

	});
});

$(document).on('click', '.startSensor', function() {
	console.log("startSensor == aaaaok");
	var startDiv = $('.startDiv');
	var warmupDiv = $('.warmupDiv');
	var firCorrectionValue = $('.firCorrectionValue');
	var secCorrectionValue = $('.secCorrectionValue');
	jappinf.startSensor(function(resultCd2, result2) {
		console.log("startSensor == ok" + resultCd2);
		$('.startDiv').hide();
		$('.warmupDiv').show();
		$('.firCorrectionValue').hide();
		$('.secCorrectionValue').hide();

		var param = {};
		param["pageId"] = "02";
		param["isSensor"] = 'Y';
		jappinf.setAppPref(param, function(resultCd) {
			setSensor();
			console.log('setAppPref for pageId 02');
		});

	});
});

$(document).on('click', '.firCorrectionBtn', function() {
	console.log("firCorrectionBtn click ::: ");
	if ($('.firCorrection').val() == "") {
		alert('혈당값을 입력해주세요.');
		return;
	}
	$("#input_sugar01").panel("close");

	var param = {};
	param["firCorrection"] = $('.firCorrection').val();
	param["pageId"] = "04";
	jappinf.setAppPref(param, function(resultCd) {
		console.log('setAppPref for pageId 04');
		$('.startDiv').hide();
		$('.warmupDiv').hide();
		$('.firCorrectionValue').hide();
		$('.secCorrectionValue').show();
	});
});

$(document).on('click', '.secCorrectionBtn', function() {
	console.log("secCorrectionBtn click ::: ");
	if ($('.secCorrection').val() == "") {
		alert('혈당값을 입력해주세요.');
		return;
	}
	$('#input_sugar02').panel("close")

	var param = {};
	param["secCorrection"] = $('.secCorrection').val();
	jappinf.setAppPref(param, function(resultCd) {
		console.log('setAppPref for pageId 05');
		jappinf.inputCorrection(function(resultCd2, result2) {
			console.log("inputCorrection == ok" + resultCd2);
			if(resultCd2 == RESULTCODE.SUCC) {
				location.href = "../mn/dashboard.html";
			}else {
				location.href = "../mn/deviceReg02.html";
			}
			
		});
	});
});

function CorrectionKeyListener() {
	$(".firCorrection").on("propertychange change keyup paste", function() {
		var currentVal = $(this).val();
		if (currentVal == "") {
			$('.firCorrectionBtn').removeClass('blue').addClass('save');
		} else {
			$('.firCorrectionBtn').removeClass('save').addClass('blue');
		}
	});
	$(".secCorrection").on("propertychange change keyup paste", function() {
		var currentVal = $(this).val();
		if (currentVal == "") {
			$('.secCorrectionBtn').removeClass('blue').addClass('save');
		} else {
			$('.secCorrectionBtn').removeClass('save').addClass('blue');
		}
	});
}

function changeCount(countTime) {
	console.log('countTime ===  ' + countTime);
	$('.warmUpTimer').text(countTime);
	if (countTime == "00:00") {
		localStorage.removeItem("countTime")
		
		jappinf.getAppPref("deviceModel",function(resultCd, result) {
			if (resultCd == RESULTCODE.SUCC) {
				var key = Object.keys(result);
				var getPref = result[key[0]];
				if(getPref == "DexcomG5") {
					$('.startDiv').hide();
					$('.warmupDiv').hide();
					$('.firCorrectionValue').show();
					$('.secCorrectionValue').hide();
					var param = {};
					param["pageId"] = "03";
					jappinf.setAppPref(param, function(resultCd) {
						console.log('setAppPref for pageId 03');
					});
				}else {
					var param = {};
					param["pageId"] = "05";
					jappinf.setAppPref(param, function(resultCd) {
						console.log('setAppPref for pageId 03');
						location.href = "../mn/dashboard.html";
					});
				}
			}
		});
		
		
	
	}
}

function setSensor() {
	var param = {
		SENSOR_SN : 1
	};
	cmmnAjax("appGlu/ms/insertSsData.do", param, function(data) {
		console.log("what are you insertSsData?");
	});
}

//
//function sensorReplace() {
// var param = {
// SENSOR_SN : 1
// };
// cmmnAjax("appGlu/ms/selectSensorChk.do", param, function(data) {
// console.log("3333 == " + data.chkTime);
// });
// }

function gmateCorrection(result, pageId) {
	console.log(" result ======???? =-= " + result + " pageId = " + pageId);
	if (pageId == "03") {
		$('#input_sugar01').panel("open")
		$('.firCorrection').val(result);
		$('.firCorrectionBtn').removeClass('save').addClass('blue');
	} else if (pageId == "04") {
		$('#input_sugar02').panel("open")
		$('.secCorrection').val(result);
		$('.secCorrectionBtn').removeClass('save').addClass('blue');
	}

}

// ---- 2020-04-09 장수영 ----

