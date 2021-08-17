var lowVal = 80, highVal = 100;
var userId = sessionStorage.getItem("USER_ID");

$(document).on("pagebeforecreate",function(){
	reSensorIsCheked();
	var req = new Request();
	console.log('1. pagebeforecreate==');	
	if(jappinf.setCgmDataCallbackFn != undefined){
		jappinf.setCgmDataCallbackFn(cgmDataCallbackFn);  
	}		

	if(!isNull(req.getParameter("glucose"))){
		var inputValue = req.getParameter("glucose");
		jappinf.inputCorrect(inputValue, function(resultCd) {
			jappinf.shortToast('보정값이 설정되었습니다. 다음 혈당 데이터와 같이 표시 됩니다.');
			console.log('inputCorrect for success');
		});
	}
	selectCoretonTimeChk();
	gluNoticeDetect();
});
window.onload = function() {
	dashboardToolSet();
	selectSensorChk();
}


function dashboardToolSet() {
	jappinf.getAppPref("connectPUChk,connectTwoPUChk,pageId,SELFMEASRSET_YN_"+userId, function(resultCd, result){
		if(resultCd==RESULTCODE.SUCC){
			var key = Object.keys(result);
			var connectPUChk = result[key[0]];
			var connectTwoPUChk = result[key[1]];
			var pageId = result[key[2]];
			var selfYn = result[key[3]];
			console.log(" page == " + pageId + " connectPUChk == " + connectPUChk);
			if(isNullToString(pageId) != "") {
				if(pageId == "01") {
					$('.changeText').html('센서 작업이 멈추었습니다. <br> 작업을 마무리 해 주세요. <br><p style ="font-size:24px;"> 센서 시작.</p>');
					$('#connectFollow').popup('open');
				}else if(pageId == "02") {
					$('.changeText').html('센서 작업이 멈추었습니다. <br> 작업을 마무리 해 주세요. <br><p style ="font-size:24px;"> 센서 가동 준비.</p>');
					$('#connectFollow').popup('open');
				}else if(pageId == "03") {
					$('.changeText').html('센서 작업이 멈추었습니다. <br> 작업을 마무리 해 주세요. <br><p style ="font-size:24px;"> 첫번째 보정값 입력.</p>');
					$('#connectFollow').popup('open');
				}else if(pageId == "04") {
					$('.changeText').html('센서 작업이 멈추었습니다. <br> 작업을 마무리 해 주세요. <br><p style ="font-size:24px;"> 두번째 보정값 입력.</p>');
					$('#connectFollow').popup('open');
				}else if(pageId == "07") {
					$('.changeText').html('센서 작업이 멈추었습니다. <br> 작업을 마무리 해 주세요. <br><p style ="font-size:24px;"> 센서 일련번호 입력.</p>');
					$('#connectFollow').popup('open');
				}
			}else {
				if(connectPUChk != "Y") {
					$('.connectPU').show();
				}
			}
			if(isNullToString(selfYn) != "") {
				deviceutil.selfMeasrUpd();
			}
		
		}else{
			deviceutil.showErrorMsg('연결이 원활하지 않습니다.\n 다시 시도해 주십시오.');
		}
	});
}

function cgmDataCallbackFn(cgmData){
	console.log('cgmDataCallbackFn='+JSON.stringify(cgmData));
	selectCgmMainChart();	
};

$(document).on("pagebeforeshow",function(){
	console.log('2. pagebeforeshow==');
	selectCgmMainChart(); 
	
});

$(document).on("pageshow",function(){
	console.log('3. pageshow==');
	CorrectionKeyListener();
	//selectSensorChk();
	
});


$(window).trigger('orientationchange');

$(window).on('orientationchange',function(event){	
	var orientation = window.orientation;
	if(screen.width < screen.height){
		//alert('세로');
		$.mobile.changePage('#deshboard');
		$('.chart_dot')
		
	}else{
		//alert('가로');
		$.mobile.changePage('#deshboard_wide');
	}  
});


$('.chart_dot').bind("touchend",function(e){
	console.log(e.originalEvent.touches[0].screenX);
});

//센서 재등록 시행
$(document).on('click', '.connectFollowBtn', function() {
	dashBoardInit();
});

$(document).on('click', '.popupCloseBtn', function() {
	var today_ = new Date();
	var to_year = today_.getFullYear(); 
	var to_month = leadingZeros(today_.getMonth()+1,2); 
	var to_date_fix = leadingZeros(today_.getDate()); 
	var param = {
			'sessPopCheckDt' : to_year+""+to_month+""+to_date_fix
	}
	jappinf.setAppPref(param, function(resultCode){
		if(resultCode == RESULTCODE.SUCC){
			$('#error_01').popup('close');
			$('#error_02').popup('close');
			$('#error_03').popup('close');
			$('#error_04').popup('close');
			$('#error_05').popup('close');
			$('#error_06').popup('close');
			$('#error_07').popup('close');
			$('#error_08').popup('close');
		}
	});
	
});

function CorrectionKeyListener() {
$(".inputCorrection").on("propertychange change keyup paste", function() {
	var currentVal = $(this).val();
	if (currentVal == "") {
		$('.inputCorrectBtn').removeClass('blue').addClass('save');
	} else {
		$('.inputCorrectBtn').removeClass('save').addClass('blue');
	}
  });
}

$(document).on('click', '.inputCorrectBtn', function() {
	console.log("inputCorrectBtn click ::: ");
	if ($('.inputCorrection').val() == "") {
		alert('혈당값을 입력해주세요.');
		return;
	}
	$("#input_sugar").panel("close");

	var inputValue =  $('.inputCorrection').val();
	$('.inputCorrection').val('');
	jappinf.inputCorrect(inputValue, function(resultCd) {
		$('.correctNoti').removeClass('on').addClass('off');
		console.log('inputCorrect for success');
	});
});

$(document).on('click','#input_sugar_close',function(){
	$('.inputCorrection').val('');
	$('.inputCorrectBtn').removeClass('blue').addClass('save');
});

//알림 수신 감지
function gluNoticeDetect(){
	$('#newnotif').removeClass('on');
	var param = {
			SESS_USER_ID : userId
	}
	cmmnAjax('appGlu/mn/gluNoticeDetect.do',param,function(res){
		if(res.chkYn == "Y"){
			if(isNullToString(res.newNotices) != ""){
				$('#newnotif').addClass('on');
			}else{
				$('#newnotif').removeClass('on');
			}
		}else{
			console.log('New Notice Data Parsing Fail');
			$('#newnotif').removeClass('on');
		}
	});
}

// 마지막 입력한 보정값에서 얼마나 시간이 지났는지 체크.//G6사용자 기준 부착센서 맞게 입력시 절대 안뜨게 처리
function selectCoretonTimeChk() {
	var param = {
			SENSOR_SN : 1
		};
	cmmnAjax("appGlu/ms/selectCoretonTimeChk.do", param, function(data) {
		console.log("data.selectCoretonTimeChk == " + data.chkTime);
		if(data.chkTime >= 6) {
			$('.correctNoti').removeClass('off').addClass('on');
		} else {
			$('.correctNoti').removeClass('on').addClass('off');
		}
		
	});
}

function reSensorIsCheked(){
	jappinf.getAppPref("pageId", function(resultCd, result) {
		if (resultCd == RESULTCODE.SUCC) {
			var key = Object.keys(result);
			var getPref = result[key[0]];
			console.log(" dashBoardInit === " + getPref);
			if (getPref == "01" || getPref == "02" || getPref == "03" || getPref == "04" || getPref == "07") {
				$('.correctNoti').css({'display':'none'});
			} else { //미연동 페이지
				$('.correctNoti').css({'display':'block'});
			}
		} else {
			console.log("페이지 오류 입니다. 확인 바랍니다.");
		}
	});
	//sensorG6Id
	jappinf.getAppPref("sensorG6Id", function(resultCd, result) {			
		var key = Object.keys(result);
		var getPref = result[key[0]];
		if(getPref=='0000'||isNullToString(getPref,'')==''){
		}else{
			$('.correctNoti').hide();
		}
	});
}

function selectSensorChk() {
	var param = {
			SENSOR_SN : 1
		};
	var today_ = new Date();
	var to_year = today_.getFullYear(); 
	var to_month = leadingZeros(today_.getMonth()+1,2); 
	var to_date_fix = leadingZeros(today_.getDate()); 
	var todayPopupDt = to_year+""+to_month+""+to_date_fix;
	var sessPopCheckDt;
	
	jappinf.getAppPref("isSensor", function(resultCd, result){
		if(resultCd==RESULTCODE.SUCC){
			if(result['isSensor'] == "Y"){
				cmmnAjax("appGlu/ms/selectSensorChk.do", param, function(data) {
					console.log("data.chkTime == " + data.chkTime + "  transmitterNm == " + data.transmitterNm);
					if(data.transmitterNm == "DEXCOM_G5") {
						if(data.chkTime == "7") {
							$('#error_04').popup('open');
						}else if (data.chkTime == "0.5") {
							$('#error_03').popup('open');
						}else if (data.chkTime == "2") {
							$('#error_02').popup('open');
						}else if (data.chkTime == "6") {
							$('#error_01').popup('open');
						}else if (data.chkTime == "N") {
							
						}
					} 
						jappinf.getAppPref("sessPopCheckDt", function(resultCd, result){
							if(resultCd==RESULTCODE.SUCC){
								var key = Object.keys(result);
								sessPopCheckDt = isNullToString(result[key[0]],"");
								if(data.chkTime == "14") {
									if(sessPopCheckDt != todayPopupDt){
										$('#error_08').popup('open');
									}
								}else if(data.chkTime == "13") {
									if(sessPopCheckDt != todayPopupDt){
										$('#error_07').popup('open');
									}
								}else if(data.chkTime == "12") {
									if(sessPopCheckDt != todayPopupDt){
										$('#error_06').popup('open');
									}
								}else if(data.chkTime == "7") {
									if(sessPopCheckDt != todayPopupDt){
										$('#error_05').popup('open');
									}
								}else if (data.chkTime == "N") {
									
								}
							}
						});
				});
			}
		}
	});
}


function selectCgmMainChart(){
	
	
	var de = setDateFormat("", "YYYYMMDD");
	var req = new Request();
	if(!isNull(req.getParameter("de"))){
		de = req.getParameter("de");
	}

		var result = {"stdMap":{"HIGH_VAL":155,"LOW_VAL":110,"EMER_VAL":55},"chkYn":"Y","rsList":[{"MEASR_DE":"20210202","X":2.8,"Y":105,"MEASR_TM":"001434","TREND":"Flat"},{"MEASR_DE":"20210202","X":3.8,"Y":103,"MEASR_TM":"001934","TREND":"Flat"},{"MEASR_DE":"20210202","X":4.8,"Y":99,"MEASR_TM":"002434","TREND":"Flat"},{"MEASR_DE":"20210202","X":5.8,"Y":95,"MEASR_TM":"002934","TREND":"Flat"},{"MEASR_DE":"20210202","X":6.8,"Y":96,"MEASR_TM":"003435","TREND":"Flat"},{"MEASR_DE":"20210202","X":7.8,"Y":100,"MEASR_TM":"003934","TREND":"Flat"},{"MEASR_DE":"20210202","X":8.8,"Y":101,"MEASR_TM":"004434","TREND":"Flat"},{"MEASR_DE":"20210202","X":12.8,"Y":76,"MEASR_TM":"010433","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":13.8,"Y":86,"MEASR_TM":"010934","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":14.8,"Y":90,"MEASR_TM":"011434","TREND":"Flat"},{"MEASR_DE":"20210202","X":17.8,"Y":86,"MEASR_TM":"012937","TREND":"Flat"},{"MEASR_DE":"20210202","X":18.8,"Y":89,"MEASR_TM":"013435","TREND":"Flat"},{"MEASR_DE":"20210202","X":20.8,"Y":87,"MEASR_TM":"014435","TREND":"Flat"},{"MEASR_DE":"20210202","X":21.8,"Y":82,"MEASR_TM":"014935","TREND":"Flat"},{"MEASR_DE":"20210202","X":22.8,"Y":77,"MEASR_TM":"015434","TREND":"Flat"},{"MEASR_DE":"20210202","X":23.8,"Y":73,"MEASR_TM":"015934","TREND":"Flat"},{"MEASR_DE":"20210202","X":24.8,"Y":71,"MEASR_TM":"020434","TREND":"Flat"},{"MEASR_DE":"20210202","X":25.8,"Y":68,"MEASR_TM":"020934","TREND":"Flat"},{"MEASR_DE":"20210202","X":26.8,"Y":64,"MEASR_TM":"021434","TREND":"Flat"},{"MEASR_DE":"20210202","X":27.8,"Y":62,"MEASR_TM":"021933","TREND":"Flat"},{"MEASR_DE":"20210202","X":28.8,"Y":56,"MEASR_TM":"022434","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":29.8,"Y":61,"MEASR_TM":"022935","TREND":"Flat"},{"MEASR_DE":"20210202","X":30.8,"Y":71,"MEASR_TM":"023434","TREND":"SingleUp"},{"MEASR_DE":"20210202","X":31.8,"Y":79,"MEASR_TM":"023935","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":32.8,"Y":85,"MEASR_TM":"024435","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":33.8,"Y":86,"MEASR_TM":"024934","TREND":"Flat"},{"MEASR_DE":"20210202","X":34.8,"Y":86,"MEASR_TM":"025434","TREND":"Flat"},{"MEASR_DE":"20210202","X":35.8,"Y":84,"MEASR_TM":"025934","TREND":"Flat"},{"MEASR_DE":"20210202","X":36.8,"Y":84,"MEASR_TM":"030435","TREND":"Flat"},{"MEASR_DE":"20210202","X":37.8,"Y":84,"MEASR_TM":"030935","TREND":"Flat"},{"MEASR_DE":"20210202","X":38.8,"Y":83,"MEASR_TM":"031434","TREND":"Flat"},{"MEASR_DE":"20210202","X":39.8,"Y":84,"MEASR_TM":"031934","TREND":"Flat"},{"MEASR_DE":"20210202","X":41.8,"Y":71,"MEASR_TM":"032934","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":48.8,"Y":79,"MEASR_TM":"040433","TREND":"Flat"},{"MEASR_DE":"20210202","X":49.8,"Y":83,"MEASR_TM":"040934","TREND":"Flat"},{"MEASR_DE":"20210202","X":50.8,"Y":81,"MEASR_TM":"041434","TREND":"Flat"},{"MEASR_DE":"20210202","X":51.8,"Y":79,"MEASR_TM":"041934","TREND":"Flat"},{"MEASR_DE":"20210202","X":52.8,"Y":80,"MEASR_TM":"042434","TREND":"Flat"},{"MEASR_DE":"20210202","X":53.8,"Y":83,"MEASR_TM":"042933","TREND":"Flat"},{"MEASR_DE":"20210202","X":54.8,"Y":87,"MEASR_TM":"043434","TREND":"Flat"},{"MEASR_DE":"20210202","X":55.8,"Y":90,"MEASR_TM":"043933","TREND":"Flat"},{"MEASR_DE":"20210202","X":56.8,"Y":90,"MEASR_TM":"044433","TREND":"Flat"},{"MEASR_DE":"20210202","X":57.8,"Y":91,"MEASR_TM":"044934","TREND":"Flat"},{"MEASR_DE":"20210202","X":58.8,"Y":94,"MEASR_TM":"045433","TREND":"Flat"},{"MEASR_DE":"20210202","X":59.8,"Y":92,"MEASR_TM":"045933","TREND":"Flat"},{"MEASR_DE":"20210202","X":60.8,"Y":92,"MEASR_TM":"050434","TREND":"Flat"},{"MEASR_DE":"20210202","X":63.8,"Y":81,"MEASR_TM":"051934","TREND":"Flat"},{"MEASR_DE":"20210202","X":64.8,"Y":83,"MEASR_TM":"052434","TREND":"Flat"},{"MEASR_DE":"20210202","X":65.8,"Y":86,"MEASR_TM":"052935","TREND":"Flat"},{"MEASR_DE":"20210202","X":66.8,"Y":88,"MEASR_TM":"053434","TREND":"Flat"},{"MEASR_DE":"20210202","X":67.8,"Y":89,"MEASR_TM":"053934","TREND":"Flat"},{"MEASR_DE":"20210202","X":68.8,"Y":91,"MEASR_TM":"054434","TREND":"Flat"},{"MEASR_DE":"20210202","X":69.8,"Y":95,"MEASR_TM":"054934","TREND":"Flat"},{"MEASR_DE":"20210202","X":79.8,"Y":104,"MEASR_TM":"063933","TREND":"Flat"},{"MEASR_DE":"20210202","X":80.8,"Y":105,"MEASR_TM":"064437","TREND":"Flat"},{"MEASR_DE":"20210202","X":81.8,"Y":107,"MEASR_TM":"064934","TREND":"Flat"},{"MEASR_DE":"20210202","X":82.8,"Y":104,"MEASR_TM":"065437","TREND":"Flat"},{"MEASR_DE":"20210202","X":83.8,"Y":102,"MEASR_TM":"065936","TREND":"Flat"},{"MEASR_DE":"20210202","X":84.8,"Y":104,"MEASR_TM":"070433","TREND":"Flat"},{"MEASR_DE":"20210202","X":85.8,"Y":109,"MEASR_TM":"070935","TREND":"Flat"},{"MEASR_DE":"20210202","X":86.8,"Y":107,"MEASR_TM":"071437","TREND":"Flat"},{"MEASR_DE":"20210202","X":89.8,"Y":109,"MEASR_TM":"072933","TREND":"Flat"},{"MEASR_DE":"20210202","X":90.8,"Y":108,"MEASR_TM":"073434","TREND":"Flat"},{"MEASR_DE":"20210202","X":91.8,"Y":117,"MEASR_TM":"073934","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":92.8,"Y":122,"MEASR_TM":"074434","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":93.8,"Y":122,"MEASR_TM":"074933","TREND":"Flat"},{"MEASR_DE":"20210202","X":94.8,"Y":119,"MEASR_TM":"075433","TREND":"Flat"},{"MEASR_DE":"20210202","X":95.8,"Y":122,"MEASR_TM":"075934","TREND":"Flat"},{"MEASR_DE":"20210202","X":96.8,"Y":144,"MEASR_TM":"080436","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":97.8,"Y":176,"MEASR_TM":"080935","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":98.8,"Y":228,"MEASR_TM":"081434","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":99.8,"Y":275,"MEASR_TM":"081933","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":100.8,"Y":320,"MEASR_TM":"082433","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":101.8,"Y":354,"MEASR_TM":"082933","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":102.8,"Y":387,"MEASR_TM":"083434","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":103.8,"Y":394,"MEASR_TM":"083933","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":104.8,"Y":392,"MEASR_TM":"084433","TREND":"Flat"},{"MEASR_DE":"20210202","X":105.8,"Y":389,"MEASR_TM":"084933","TREND":"Flat"},{"MEASR_DE":"20210202","X":106.8,"Y":388,"MEASR_TM":"085433","TREND":"Flat"},{"MEASR_DE":"20210202","X":107.8,"Y":394,"MEASR_TM":"085933","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":108.8,"Y":396,"MEASR_TM":"090433","TREND":"Flat"},{"MEASR_DE":"20210202","X":109.8,"Y":385,"MEASR_TM":"090933","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":110.8,"Y":377,"MEASR_TM":"091433","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":111.8,"Y":365,"MEASR_TM":"091934","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":112.8,"Y":348,"MEASR_TM":"092433","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":113.8,"Y":329,"MEASR_TM":"092933","TREND":"DoubleDown"},{"MEASR_DE":"20210202","X":114.8,"Y":316,"MEASR_TM":"093433","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":115.8,"Y":304,"MEASR_TM":"093934","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":116.8,"Y":295,"MEASR_TM":"094436","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":117.8,"Y":269,"MEASR_TM":"094933","TREND":"DoubleDown"},{"MEASR_DE":"20210202","X":118.8,"Y":247,"MEASR_TM":"095433","TREND":"DoubleDown"},{"MEASR_DE":"20210202","X":119.8,"Y":220,"MEASR_TM":"095933","TREND":"DoubleDown"},{"MEASR_DE":"20210202","X":120.8,"Y":200,"MEASR_TM":"100433","TREND":"DoubleDown"},{"MEASR_DE":"20210202","X":121.8,"Y":183,"MEASR_TM":"100933","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":122.8,"Y":170,"MEASR_TM":"101432","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":123.8,"Y":162,"MEASR_TM":"101933","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":124.8,"Y":152,"MEASR_TM":"102432","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":125.8,"Y":150,"MEASR_TM":"102933","TREND":"Flat"},{"MEASR_DE":"20210202","X":126.8,"Y":143,"MEASR_TM":"103433","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":127.8,"Y":138,"MEASR_TM":"103933","TREND":"Flat"},{"MEASR_DE":"20210202","X":128.8,"Y":134,"MEASR_TM":"104433","TREND":"Flat"},{"MEASR_DE":"20210202","X":129.8,"Y":129,"MEASR_TM":"104932","TREND":"Flat"},{"MEASR_DE":"20210202","X":130.8,"Y":126,"MEASR_TM":"105433","TREND":"Flat"},{"MEASR_DE":"20210202","X":131.8,"Y":122,"MEASR_TM":"105933","TREND":"Flat"},{"CORETON_VALUE":111,"MEASR_DE":"20210202","X":132.8,"Y":102,"MEASR_TM":"110433","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":133.8,"Y":97,"MEASR_TM":"110933","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":134.8,"Y":90,"MEASR_TM":"111433","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":135.8,"Y":88,"MEASR_TM":"111933","TREND":"Flat"},{"MEASR_DE":"20210202","X":137.8,"Y":84,"MEASR_TM":"112932","TREND":"Flat"},{"MEASR_DE":"20210202","X":138.8,"Y":78,"MEASR_TM":"113433","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":139.8,"Y":74,"MEASR_TM":"113932","TREND":"Flat"},{"MEASR_DE":"20210202","X":140.8,"Y":75,"MEASR_TM":"114433","TREND":"Flat"},{"MEASR_DE":"20210202","X":141.8,"Y":72,"MEASR_TM":"114932","TREND":"Flat"},{"MEASR_DE":"20210202","X":142.8,"Y":70,"MEASR_TM":"115433","TREND":"Flat"},{"MEASR_DE":"20210202","X":143.8,"Y":71,"MEASR_TM":"115933","TREND":"Flat"},{"MEASR_DE":"20210202","X":144.8,"Y":58,"MEASR_TM":"120433","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":145.8,"Y":70,"MEASR_TM":"120933","TREND":"SingleUp"},{"MEASR_DE":"20210202","X":146.8,"Y":72,"MEASR_TM":"121433","TREND":"Flat"},{"MEASR_DE":"20210202","X":147.8,"Y":79,"MEASR_TM":"121933","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":148.8,"Y":82,"MEASR_TM":"122433","TREND":"Flat"},{"MEASR_DE":"20210202","X":149.8,"Y":133,"MEASR_TM":"122933","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":150.8,"Y":164,"MEASR_TM":"123433","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":151.8,"Y":169,"MEASR_TM":"123933","TREND":"Flat"},{"MEASR_DE":"20210202","X":152.8,"Y":201,"MEASR_TM":"124432","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":153.8,"Y":225,"MEASR_TM":"124933","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":154.8,"Y":242,"MEASR_TM":"125432","TREND":"SingleUp"},{"MEASR_DE":"20210202","X":155.8,"Y":250,"MEASR_TM":"125933","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":157.6,"Y":0,"MEASR_TM":"130826"},{"MEASR_DE":"20210202","X":158.6,"Y":0,"MEASR_TM":"131325"},{"MEASR_DE":"20210202","X":159.6,"Y":0,"MEASR_TM":"131828"},{"MEASR_DE":"20210202","X":159.8,"Y":298,"MEASR_TM":"131933","TREND":"SingleUp"},{"MEASR_DE":"20210202","X":160.6,"Y":0,"MEASR_TM":"132325"},{"MEASR_DE":"20210202","X":160.8,"Y":291,"MEASR_TM":"132439","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":161.6,"Y":0,"MEASR_TM":"132825"},{"MEASR_DE":"20210202","X":161.8,"Y":291,"MEASR_TM":"132933","TREND":"Flat"},{"MEASR_DE":"20210202","X":162.6,"Y":0,"MEASR_TM":"133325"},{"MEASR_DE":"20210202","X":162.8,"Y":297,"MEASR_TM":"133433","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":163.6,"Y":0,"MEASR_TM":"133825"},{"MEASR_DE":"20210202","X":163.8,"Y":303,"MEASR_TM":"133934","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":164.6,"Y":0,"MEASR_TM":"134328"},{"MEASR_DE":"20210202","X":164.8,"Y":314,"MEASR_TM":"134433","TREND":"SingleUp"},{"MEASR_DE":"20210202","X":165.6,"Y":0,"MEASR_TM":"134824"},{"MEASR_DE":"20210202","X":165.8,"Y":317,"MEASR_TM":"134933","TREND":"Flat"},{"MEASR_DE":"20210202","X":166.6,"Y":0,"MEASR_TM":"135326"},{"MEASR_DE":"20210202","X":166.8,"Y":319,"MEASR_TM":"135433","TREND":"Flat"},{"MEASR_DE":"20210202","X":167.6,"Y":0,"MEASR_TM":"135825"},{"MEASR_DE":"20210202","X":167.8,"Y":324,"MEASR_TM":"135933","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":168.8,"Y":329,"MEASR_TM":"140432","TREND":"Flat"},{"MEASR_DE":"20210202","X":169.8,"Y":337,"MEASR_TM":"140933","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":170.8,"Y":340,"MEASR_TM":"141433","TREND":"Flat"},{"MEASR_DE":"20210202","X":171.8,"Y":339,"MEASR_TM":"141933","TREND":"Flat"},{"MEASR_DE":"20210202","X":172.8,"Y":332,"MEASR_TM":"142433","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":173.8,"Y":327,"MEASR_TM":"142933","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":174.8,"Y":319,"MEASR_TM":"143433","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":175.8,"Y":305,"MEASR_TM":"143932","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":176.8,"Y":293,"MEASR_TM":"144433","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":177.8,"Y":269,"MEASR_TM":"144933","TREND":"DoubleDown"},{"MEASR_DE":"20210202","X":178.8,"Y":249,"MEASR_TM":"145433","TREND":"DoubleDown"},{"MEASR_DE":"20210202","X":179.8,"Y":230,"MEASR_TM":"145933","TREND":"DoubleDown"},{"MEASR_DE":"20210202","X":180.8,"Y":213,"MEASR_TM":"150433","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":181.8,"Y":200,"MEASR_TM":"150933","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":182.8,"Y":189,"MEASR_TM":"151433","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":183.8,"Y":176,"MEASR_TM":"151933","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":184.8,"Y":167,"MEASR_TM":"152433","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":186.8,"Y":151,"MEASR_TM":"153432","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":187.8,"Y":137,"MEASR_TM":"153932","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":188.8,"Y":126,"MEASR_TM":"154433","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":189.8,"Y":115,"MEASR_TM":"154932","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":190.8,"Y":115,"MEASR_TM":"155433","TREND":"Flat"},{"MEASR_DE":"20210202","X":191.8,"Y":110,"MEASR_TM":"155933","TREND":"Flat"},{"MEASR_DE":"20210202","X":192.8,"Y":104,"MEASR_TM":"160432","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":193.8,"Y":102,"MEASR_TM":"160932","TREND":"Flat"},{"MEASR_DE":"20210202","X":194.8,"Y":97,"MEASR_TM":"161433","TREND":"Flat"},{"MEASR_DE":"20210202","X":195.8,"Y":90,"MEASR_TM":"161933","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":196.8,"Y":88,"MEASR_TM":"162433","TREND":"Flat"},{"MEASR_DE":"20210202","X":197.8,"Y":88,"MEASR_TM":"162933","TREND":"Flat"},{"MEASR_DE":"20210202","X":198.8,"Y":87,"MEASR_TM":"163433","TREND":"Flat"},{"MEASR_DE":"20210202","X":199.8,"Y":88,"MEASR_TM":"163933","TREND":"Flat"},{"MEASR_DE":"20210202","X":200.8,"Y":91,"MEASR_TM":"164433","TREND":"Flat"},{"MEASR_DE":"20210202","X":201.8,"Y":96,"MEASR_TM":"164932","TREND":"Flat"},{"MEASR_DE":"20210202","X":202.8,"Y":96,"MEASR_TM":"165432","TREND":"Flat"},{"MEASR_DE":"20210202","X":203.8,"Y":97,"MEASR_TM":"165933","TREND":"Flat"},{"MEASR_DE":"20210202","X":204.8,"Y":98,"MEASR_TM":"170433","TREND":"Flat"},{"MEASR_DE":"20210202","X":205.8,"Y":104,"MEASR_TM":"170932","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":206.8,"Y":99,"MEASR_TM":"171433","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":207.8,"Y":94,"MEASR_TM":"171933","TREND":"Flat"},{"MEASR_DE":"20210202","X":208.8,"Y":90,"MEASR_TM":"172432","TREND":"Flat"},{"MEASR_DE":"20210202","X":209.8,"Y":86,"MEASR_TM":"172933","TREND":"Flat"},{"MEASR_DE":"20210202","X":210.8,"Y":84,"MEASR_TM":"173432","TREND":"Flat"},{"MEASR_DE":"20210202","X":211.8,"Y":93,"MEASR_TM":"173933","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":212.8,"Y":121,"MEASR_TM":"174432","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":213.8,"Y":157,"MEASR_TM":"174933","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":214.8,"Y":164,"MEASR_TM":"175432","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":215.8,"Y":168,"MEASR_TM":"175933","TREND":"Flat"},{"MEASR_DE":"20210202","X":217.8,"Y":174,"MEASR_TM":"180932","TREND":"Flat"},{"MEASR_DE":"20210202","X":218.8,"Y":176,"MEASR_TM":"181432","TREND":"Flat"},{"MEASR_DE":"20210202","X":219.8,"Y":170,"MEASR_TM":"181933","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":220.8,"Y":161,"MEASR_TM":"182433","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":221.8,"Y":152,"MEASR_TM":"182933","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":222.8,"Y":143,"MEASR_TM":"183433","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":223.8,"Y":135,"MEASR_TM":"183932","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":224.8,"Y":127,"MEASR_TM":"184432","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":225.8,"Y":121,"MEASR_TM":"184932","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":226.8,"Y":115,"MEASR_TM":"185432","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":227.8,"Y":102,"MEASR_TM":"185933","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":228.8,"Y":90,"MEASR_TM":"190432","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":229.8,"Y":84,"MEASR_TM":"190933","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":230.8,"Y":79,"MEASR_TM":"191432","TREND":"Flat"},{"MEASR_DE":"20210202","X":231.8,"Y":75,"MEASR_TM":"191933","TREND":"Flat"},{"MEASR_DE":"20210202","X":232.8,"Y":71,"MEASR_TM":"192432","TREND":"Flat"},{"MEASR_DE":"20210202","X":233.8,"Y":72,"MEASR_TM":"192932","TREND":"Flat"},{"MEASR_DE":"20210202","X":234.8,"Y":76,"MEASR_TM":"193432","TREND":"Flat"},{"MEASR_DE":"20210202","X":235.8,"Y":82,"MEASR_TM":"193932","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":236.8,"Y":98,"MEASR_TM":"194433","TREND":"SingleUp"},{"MEASR_DE":"20210202","X":237.8,"Y":123,"MEASR_TM":"194933","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":238.8,"Y":148,"MEASR_TM":"195434","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":239.8,"Y":161,"MEASR_TM":"195932","TREND":"SingleUp"},{"MEASR_DE":"20210202","X":240.8,"Y":168,"MEASR_TM":"200432","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":241.8,"Y":165,"MEASR_TM":"200932","TREND":"Flat"},{"MEASR_DE":"20210202","X":242.8,"Y":163,"MEASR_TM":"201433","TREND":"Flat"},{"MEASR_DE":"20210202","X":243.8,"Y":159,"MEASR_TM":"201933","TREND":"Flat"},{"MEASR_DE":"20210202","X":244.6,"Y":0,"MEASR_TM":"202324"},{"MEASR_DE":"20210202","X":244.8,"Y":161,"MEASR_TM":"202432","TREND":"Flat"},{"MEASR_DE":"20210202","X":245.6,"Y":0,"MEASR_TM":"202824"},{"MEASR_DE":"20210202","X":245.8,"Y":165,"MEASR_TM":"202932","TREND":"Flat"},{"MEASR_DE":"20210202","X":246.8,"Y":166,"MEASR_TM":"203432","TREND":"Flat"},{"MEASR_DE":"20210202","X":247.6,"Y":0,"MEASR_TM":"203824"},{"MEASR_DE":"20210202","X":247.8,"Y":165,"MEASR_TM":"203932","TREND":"Flat"},{"MEASR_DE":"20210202","X":248.6,"Y":0,"MEASR_TM":"204324"},{"MEASR_DE":"20210202","X":248.8,"Y":163,"MEASR_TM":"204433","TREND":"Flat"},{"MEASR_DE":"20210202","X":249.6,"Y":0,"MEASR_TM":"204824"},{"MEASR_DE":"20210202","X":249.8,"Y":165,"MEASR_TM":"204932","TREND":"Flat"},{"MEASR_DE":"20210202","X":250.6,"Y":0,"MEASR_TM":"205324"},{"MEASR_DE":"20210202","X":250.8,"Y":165,"MEASR_TM":"205432","TREND":"Flat"},{"MEASR_DE":"20210202","X":251.8,"Y":159,"MEASR_TM":"205932","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":252.8,"Y":153,"MEASR_TM":"210432","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":253.8,"Y":147,"MEASR_TM":"210932","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":254.6,"Y":0,"MEASR_TM":"211324"},{"MEASR_DE":"20210202","X":254.8,"Y":144,"MEASR_TM":"211432","TREND":"Flat"},{"MEASR_DE":"20210202","X":255.8,"Y":142,"MEASR_TM":"211932","TREND":"Flat"},{"MEASR_DE":"20210202","X":256.8,"Y":141,"MEASR_TM":"212432","TREND":"Flat"},{"MEASR_DE":"20210202","X":257.8,"Y":140,"MEASR_TM":"212932","TREND":"Flat"},{"MEASR_DE":"20210202","X":258.8,"Y":141,"MEASR_TM":"213432","TREND":"Flat"},{"MEASR_DE":"20210202","X":259.8,"Y":145,"MEASR_TM":"213932","TREND":"Flat"},{"MEASR_DE":"20210202","X":260.8,"Y":132,"MEASR_TM":"214434","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":261.8,"Y":126,"MEASR_TM":"214941","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":266.8,"Y":106,"MEASR_TM":"221451","TREND":"Flat"},{"MEASR_DE":"20210202","X":267.8,"Y":103,"MEASR_TM":"221932","TREND":"Flat"},{"MEASR_DE":"20210202","X":268.8,"Y":105,"MEASR_TM":"222432","TREND":"Flat"},{"MEASR_DE":"20210202","X":269.8,"Y":108,"MEASR_TM":"222932","TREND":"Flat"},{"MEASR_DE":"20210202","X":270.8,"Y":107,"MEASR_TM":"223432","TREND":"Flat"},{"MEASR_DE":"20210202","X":271.8,"Y":103,"MEASR_TM":"223932","TREND":"Flat"},{"MEASR_DE":"20210202","X":272.8,"Y":100,"MEASR_TM":"224432","TREND":"Flat"},{"MEASR_DE":"20210202","X":273.8,"Y":99,"MEASR_TM":"224931","TREND":"Flat"},{"MEASR_DE":"20210202","X":275.8,"Y":90,"MEASR_TM":"225938","TREND":"Flat"},{"MEASR_DE":"20210202","X":277.8,"Y":100,"MEASR_TM":"230932","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":278.8,"Y":89,"MEASR_TM":"231433","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":279.8,"Y":87,"MEASR_TM":"231932","TREND":"Flat"},{"MEASR_DE":"20210202","X":280.8,"Y":85,"MEASR_TM":"232432","TREND":"Flat"},{"MEASR_DE":"20210202","X":281.8,"Y":85,"MEASR_TM":"232932","TREND":"Flat"},{"MEASR_DE":"20210202","X":282.8,"Y":85,"MEASR_TM":"233432","TREND":"Flat"},{"MEASR_DE":"20210202","X":283.8,"Y":85,"MEASR_TM":"233932","TREND":"Flat"},{"MEASR_DE":"20210202","X":284.8,"Y":84,"MEASR_TM":"234432","TREND":"Flat"},{"MEASR_DE":"20210202","X":285.8,"Y":83,"MEASR_TM":"234932","TREND":"Flat"},{"MEASR_DE":"20210202","X":286.8,"Y":82,"MEASR_TM":"235432","TREND":"Flat"},{"MEASR_DE":"20210202","X":287.8,"Y":82,"MEASR_TM":"235932","TREND":"Flat"},{"MEASR_DE":"20210202","X":516.8,"Y":113,"MEASR_TM":"434","TREND":"Flat"},{"MEASR_DE":"20210202","X":1116.8,"Y":106,"MEASR_TM":"934","TREND":"FortyFiveDown"}]}
		var chartData = [];
		var dotSize = 3;
		var width = $(".mainChart").width();
		
		var minVal = 0;//Number.MAX_VALUE;
		var maxVal = Number.MIN_VALUE;
		var list = result.rsList;
		var stdVal = result.stdMap;
		var param = {
				emLowNoticeValue : stdVal.EMER_VAL ,
				lowNoticeValue : stdVal.LOW_VAL ,
				highNoticeValue : stdVal.HIGH_VAL ,
			};

		jappinf.setAppPref(param, function(resultCode){
			if(resultCode == RESULTCODE.SUCC){
				console.log("Notice Value Save Succ");
			}
		});
		
		
		if(!isNull(list)){
			// 트렌드 처리
			var trend = isNullToString(list[list.length - 1].TREND);
			$(".chart_circle3 p:eq(0)").text(list[list.length - 1].Y);
			
			// 초기화
			$("#circle_arrow").removeClass();
			$("#chart_circle2").removeClass();
			$("#chart_circle2").addClass("chart_circle2");
			// 초기화 끝
			
			if(trend.length > 0){
				$("#circle_arrow").addClass("circle_arrow");
			}
			
			if(trend.indexOf("Up") > -1){
				$("#chart_circle2").addClass("bg03");
				if(trend == "SingleUp"){
					$("#circle_arrow").addClass("c1");
					$("#circle_arrow").addClass("icon_c11");
				}else if(trend == "DoubleUp"){
					$("#circle_arrow").addClass("c1");
					$("#circle_arrow").addClass("icon_c12");
				}else if(trend == "FortyFiveUp"){
					$("#circle_arrow").addClass("c2");
					$("#circle_arrow").addClass("icon_c21");
				}
			}else if(trend.indexOf("Down") > -1){
				$("#chart_circle2").addClass("bg02");
				if(trend == "SingleDown"){
					$("#circle_arrow").addClass("c5");
					$("#circle_arrow").addClass("icon_c51");
				}else if(trend == "DoubleDown"){
					$("#circle_arrow").addClass("c5");
					$("#circle_arrow").addClass("icon_c52");
				}else if(trend == "FortyFiveDown"){
					$("#circle_arrow").addClass("c4");
					$("#circle_arrow").addClass("icon_c41");
				}
			}else{
				$("#chart_circle2").addClass("bg01");
				if(trend == "Flat"){
					$("#circle_arrow").addClass("c3");
					$("#circle_arrow").addClass("icon_c31");
				}
			}
		}else{
			$("#chart_circle2").addClass("bg01");
		}
		
		/**그래프 끊김 없이 이을때 (김태일)**/
//		for (var i=0; i<list.length; i++) {
////			if( minVal > list[i].Y ) minVal = list[i].Y;
//		    if( maxVal < list[i].Y ) maxVal = list[i].Y;
//
//		    if(list[i].Y > 0){
//		    	var measrTm = list[i].MEASR_TM.substring(0, 4);
//		    	var measrHH = measrTm.substring(0,2);
//		    	var measrMI = measrTm.substring(2,4);
//		    	var minute = Number(measrHH) * 60 + Number(measrMI);
//		    	var data = {
//		    			"x" : minute
//		    			, "y" : list[i].Y
//		    			, "y2": ((isNullToString(list[i].CORETON_VALUE) == "")? null : list[i].CORETON_VALUE)
//		    			, "phase":"cotoha"
//		    	};
//		    	
//		    	chartData.push(data);
//		    }
//		}
		/**그래프 끊김 없이 이을때 (김태일)**/
		
		/**일정시간 이격시 그래프 noDraw처리 (김태일)**/
		var cuData = [];
		
		for (var i=0; i<list.length; i++) { // 유효데이터 재설정
			if( maxVal < list[i].Y ) maxVal = list[i].Y;
			 if(list[i].Y > 0){
				 cuData.push(list[i])
			 }
		}
		/**일정시간 이격시 그래프 noDraw처리 (김태일)**/

//		if(minVal == Number.MAX_VALUE || minVal < 50){
//			minVal = 0;
//		}else{
//			minVal -= 50;
//		}
		if(maxVal == Number.MIN_VALUE){
			maxVal = 200;
		}else{
			maxVal += 50;
		}
				
		var mainChart = new MainChart({
			  "div"			: ".mainChart"
			, "width"		: 2000
			, "height"		: 199.5- 6
			, "minMax"		: [minVal, maxVal+70]
			, "columns"		: [ "y", "y2" ]
			, "baseColumns"	: "x"
			, "margin"		: {top:0, right:20,bottom:30, left:20}
			, "colors"	:["#fff","rgba(204, 204, 204, 1)", "rgba(255, 223, 59, 1)", "rgba(201, 0, 48, 1)", "rgba(248, 24, 115, 1)"]
			, "dotSize"		: dotSize
			, "highVal"		: stdVal.HIGH_VAL
			, "lowVal"		: stdVal.LOW_VAL
			, "bubbleYn"	: true
			, "typeColor"	: ["rgba(255,94,127,1)", "rgba(213,24,131,1)", "rgba(23,209,186,1)", "rgba(92,130,235,1)", "rgba(96,210,126,1)", "rgba(255,164,84,1)", "rgba(55,31,120,1)", "rgba(123,123,123,1)"]
		});
		
		/**그래프 끊김 없이 이을때 (김태일)**/		
//		mainChart.insertData(chartData);
		/**그래프 끊김 없이 이을때 (김태일)**/
		
		
		/**일정시간 이격시 그래프 noDraw처리 (김태일)**/
		var phase = 'A';
		var changerDef = 10800; // 이격 시키고 싶은 만큼의 시간단위 입력 (초)
		
		for (var i=0; i<cuData.length; i++) {
			
			if(i!=0 && phase!=chartData[0].phase){
				mainChart.insertData(chartData);
				chartData = [];
			}
			
		    	var measrTm = cuData[i].MEASR_TM.substring(0, 4);
		    	var measrHH = measrTm.substring(0,2);
		    	var measrMI = measrTm.substring(2,4);
		    	var minute = Number(measrHH) * 60 + Number(measrMI);
		    	
		    	var data = {
		    			"x" : minute
		    			, "y" : cuData[i].Y
		    			, "y2": ((isNullToString(cuData[i].CORETON_VALUE) == "")? null : cuData[i].CORETON_VALUE)
		    			, "phase" : phase
		    	};
		    	
		    	chartData.push(data);
		    	
		    	if(i!=cuData.length-1&&cuData.length>1){
		    		var phaseChanger  = diffTimeBtwn(cuData[i].MEASR_DE+""+cuData[i].MEASR_TM,cuData[i+1].MEASR_DE+""+cuData[i+1].MEASR_TM,1).replace(/:/gi,"");
		    		var hourChanger = Number(phaseChanger.substring(0,2))*3600;
		    		var minuteChanger =  Number(phaseChanger.substring(2,4))*60;
		    		var secondChanger = Number(phaseChanger.substring(5,7));
		    		var countPhase = hourChanger+minuteChanger+secondChanger
		    		
		    		if(countPhase>changerDef){
		    			phase = phase+'A';
		    		}
		    	}
		    	
		    	if(i==cuData.length-1){
		    		mainChart.insertData(chartData);
		    	}
		    
		}
		/**일정시간 이격시 그래프 noDraw처리 (김태일)**/
		
		
			var sb = new StringBuffer();
			var data = {"stdMap":{"HIGH_VAL":155,"LOW_VAL":110,"EMER_VAL":55},"timelineList":[{"DE":"20200513","VALUE1":"메트포르민염(0.5g)","CGM_DATA":"97.61|070038,94.69|070538,85.44|071029,83.86|071529,77.94|072029,80.28|073029,80.52|073529,82.3|074031,85.37|074530,89.91|075030,96.05|075529,95.71|080029,114.68|080529,134.34|081029,153.86|081528,169.04|082027,175.96|082529,180.47|083028,187.71|083528,196.98|084028,194.9|084528,191.5|085028,185.18|085528,177.46|090028,172.28|090529,165.61|091029,159.04|091529,152.27|092028,149.03|092528,143.21|093028,141.41|093528,140.43|094028,142.5|094529,144.01|095028,143.61|095528","TM":"080000","TYPE":"DT"},{"DE":"20200513","VALUE1":"메트포르민염(0.5g)","CGM_DATA":"94.69|070538,85.44|071029,83.86|071529,77.94|072029,80.28|073029,80.52|073529,82.3|074031,85.37|074530,89.91|075030,96.05|075529,95.71|080029,114.68|080529,134.34|081029,153.86|081528,169.04|082027,175.96|082529,180.47|083028,187.71|083528,196.98|084028,194.9|084528,191.5|085028,185.18|085528,177.46|090028,172.28|090529,165.61|091029,159.04|091529,152.27|092028,149.03|092528,143.21|093028,141.41|093528,140.43|094028,142.5|094529,144.01|095028,143.61|095528,141.7|100028","TM":"080100","TYPE":"DT"},{"DE":"20200513","KEY1":"2","VALUE1":"설렁탕","CGM_DATA":"81.6|111028,79.18|111532,82.56|112028,121.89|112529,154.72|120530,149.57|121027,143.86|121525,137.83|122026,136.21|122526,142.62|123028,141.01|123529,154.28|124029,165.18|124530,178.49|125028,188.91|125529,197.23|130028,197.06|130529,203.31|131029,210.04|131529,219.43|132029,223.21|132529,226.8|133029,228.21|133529,225.4|134028,226.72|134529,216.64|135029,215.97|135529,211.66|140029,208.25|140529","TM":"121000","TYPE":"MM"},{"DE":"20200513","KEY1":"3","VALUE1":"아이스라떼","CGM_DATA":"154.72|120530,149.57|121027,143.86|121525,137.83|122026,136.21|122526,142.62|123028,141.01|123529,154.28|124029,165.18|124530,178.49|125028,188.91|125529,197.23|130028,197.06|130529,203.31|131029,210.04|131529,219.43|132029,223.21|132529,226.8|133029,228.21|133529,225.4|134028,226.72|134529,216.64|135029,215.97|135529,211.66|140029,208.25|140529,205.15|141029,200.82|141529,197.91|142029,194.91|142530,190.81|143029,184.51|143528","TM":"124000","TYPE":"MM"},{"DE":"20200513","KEY1":"762826","VALUE1":"80","CGM_DATA":"208.25|140529,205.15|141029,200.82|141529,197.91|142029,194.91|142530,190.81|143029,184.51|143528,180.43|144029,178.46|144528,171.46|145028,165.06|145529,161.43|150029,164.4|150529,160.61|151028,156.16|151529,152.22|152028,149.91|152529,148.8|153029,149.06|153529,151.78|154034,149.08|154528,150.14|155028,152.51|155529,154.74|160029,160.2|160529,164.65|161029,170.92|161529,178.88|162028,185.8|162528,190.16|163028,186.38|163530,186.52|164028,188.96|164529,197.11|165028,201.7|165528,205.46|170028","TM":"150100","VALUE2":"120","TYPE":"BP"},{"DE":"20200513","KEY1":"1","VALUE1":"딸기요거트","CGM_DATA":"161.43|150029,164.4|150529,160.61|151028,156.16|151529,152.22|152028,149.91|152529,148.8|153029,149.06|153529,151.78|154034,149.08|154528,150.14|155028,152.51|155529,154.74|160029,160.2|160529,164.65|161029,170.92|161529,178.88|162028,185.8|162528,190.16|163028,186.38|163530,186.52|164028,188.96|164529,197.11|165028,201.7|165528,205.46|170028,209.31|170529,215.4|171028,222.86|171529,231.78|172029,237.62|172529,243.46|173028,247.13|173528,247.66|174027,243.88|174528,230.38|175034,218.03|175528","TM":"160000","TYPE":"MM"},{"DE":"20200513","KEY1":"4","VALUE1":"콩나물국밥","CGM_DATA":"198.04|181029,190.75|181527,183.34|182027,176.33|182528,168.9|183026,162.18|183528,155.21|184029,147.4|184529,138.39|185028,133.2|185529,129.7|190028,126.17|190528,122.81|191029,120.13|191527,114.38|192526,116.6|193027,128.63|193526,141.13|194027,163.24|194529,186.43|195029,204.11|195528,225.36|200028,242.95|200528,259.29|201028,271.69|201528,273.36|202028,269.68|202528,260.65|203028,257.24|203529,254.42|204029,244.33|204530,236.73|205028,232.8|205529,227.57|210028,222.68|210528","TM":"191000","TYPE":"MM"}]}
			if(isNullToString(data.timelineList) != ""){
				var timelineList = data.timelineList;
				
				var typeData = [];
				for(var i = 0; i < timelineList.length; i++){
					if(isNullToString(timelineList[i].DE) == ""
						|| isNullToString(timelineList[i].TM) == ""){
						continue;
					}
					
					typeData.push({
						"type"	: timelineList[i].TYPE
						,"tm"	: timelineList[i].TM.substring(0,4)
					});
				}
				
				mainChart.insertTypeData(typeData);
			}
}

$(document).on("click", ".zoom_in.ui-btn", function(){
	location.href = "../mn/dashboardWide.html?fullscreenchange=On";
});

$(document).on("click", ".pairPUCloseBtn", function(){
	var param = {};
	param["connectPUChk"] = "N";
	jappinf.setAppPref(param, function(resultCode){
		if(resultCode == RESULTCODE.SUCC){
			$('.connectPU').hide();
		}
	});
});
$(document).on("click", ".neverAgainPUBtn", function(){
	var param = {};
	param["connectPUChk"] = "Y";
	jappinf.setAppPref(param, function(resultCode){
		if(resultCode == RESULTCODE.SUCC){
			$('.connectPU').hide();
		}
	});
});


$(document).on("click", ".pairOpen", function(){
	$('.connectPU').hide();
	$('.selectBsDevicePU').show();
	
});

$(document).on("click", ".selectGSeries", function(){
	$('.selectBsDevicePU').hide();
	$('.connecG5ConsentChkPu').show();
	
});

$(document).on("click", ".selectLibre1", function(){
	$('.selectBsDevicePU').hide();
	$('.connecLibre1ConsentChkPu').show();
});

$(document).on("click", ".connecG5ConsentChk_Y", function(){
	location.href = "./deviceReg01.html#enterNum";
});

$(document).on("click", ".connecG6ConsentChk_Y", function(){
	location.href = "./deviceReg01.html#enterG6Num";
//	$('.connecG5ConsentChkPu').hide();
});

$(document).on("click", ".connecLibre1ConsentChk_Y", function(){
	jappinf.startNfcMode(function(resultCd2) {
		console.log("startNfcMode == ");
		var param = {};
		param["pageId"] = "02";
		jappinf.setAppPref(param, function(resultCd) {
			setSensor();
			console.log('setAppPref for email success');
			location.href = "deviceReg02.html"
		});
	});
});

$(document).on("click", ".connecLibre1ConsentChk_N", function(){
	$('.connecLibre1ConsentChkPu').hide();
});


$(document).on('click','.selectBsDevicePU, .connecG5ConsentChkPu, .connecLibre1ConsentChkPu',function(e){
	var container = $(this);
	if (container.has(e.target).length == 0){
		container.css({"display":"none"});
		}else{
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


