
var userId;
var sleepDe;
var sleepSn;

$(document).ready(function(){
	var req = new Request();
	userId = sessionStorage.getItem("USER_ID");
	sleepDe = req.getParameter("sleepDe");
	sleepSn = req.getParameter("sleepSn");
	selectSleep();
});

// 저장 버튼 클릭 이벤트
$("#saveBtn").on("click", function(){
	
	var updateParam = {
			  SESS_USER_ID 		: userId
   		    , SLEEP_DE			: sleepDe
			, SLEEP_SN			: sleepSn	
			, UPD_SLEEP_DE		: $("#sleepDe").val().replace(/-/g, "")
			, SLEEP_END_TM		: $("#sleepEndTm").val().replace(/:/g, "") + "00"
			, SLEEP_EVL			: $("#sleepEvl .rate-full").length
			, SLEEP_TM			: $("#sleepTm").val()
	}
	
	cmmnAjax("appGlu/tl/updateSleep.do", updateParam, function (result){
		if(result.chkYn == "Y"){
			location.href = "./sleepDetail.html?sleepDe="+result.SLEEP_DE+"&sleepSn="+result.SLEEP_SN;
		}
    });
});

// 수면평가 클릭 이벤트
$("#sleepEvl span").on("click", function(){
	$("#sleepEvl span").removeClass("rate-full");
	$(this).addClass("rate-full");
	$(this).prevAll().addClass("rate-full");
});

// 혈당 상세 조회
function selectSleep(){
	cmmnAjax("appGlu/tl/selectSleep.do", {SESS_USER_ID:userId, SLEEP_DE:sleepDe, SLEEP_SN:sleepSn}, function (data){
		selectSleepCallback(data);
    });
}

// 혈당 상세 조회 콜백
function selectSleepCallback(data){
	if(!isNull(data)){
		var sleepDeVal = data.SLEEP_DE.substring(0,4) + "-" + data.SLEEP_DE.substring(4,6) + "-" + data.SLEEP_DE.substring(6,8);
		var sleepEndTmVal = data.SLEEP_END_TM.substring(0,2) + ":" + data.SLEEP_END_TM.substring(2,4);
				
		$("#sleepDe").val(sleepDeVal);
		$("#sleepEndTm").val(sleepEndTmVal);
		$("#sleepTm").val(data.SLEEP_TM);

		var sleepEvl = Number(data.SLEEP_EVL);
		for(var i = 0; i < sleepEvl; i++){
			$("#sleepEvl span:eq(" + i + ")").addClass("rate-full");
		}
	}
}

/**TimePicker 추가 input time타입 readonly처리해야함 (김태일)**/
var registTimeId = '';

$(document).ready(function(){
  $(".time_element").timepicki();
});

$(document).on('click','input[type="time"]',function(){
	registTimeId = $(this).attr('id');
	//$("#input_timeMedi a.delBtn").parent().css("width", "100%");
	$("#input_timeMedi a.delBtn").parent().hide();
	$("#input_timeMedi a.regBtn").parent().css("width", "100%");
	$('#input_timeMedi').panel("open");
});

$(document).on('click','#timeSaveBtn',function(){
	var allTime = $('#timpPick').val().replace(' ','');
	var periodTime = allTime.slice(allTime.length-2);
	var hourToHh = periodTime != 'AM' ? Number(allTime.substring(0,2)) == 12? "12":leadingZeros(Number(allTime.substring(0,2))+12):Number(allTime.substring(0,2)) == 12?"00":leadingZeros(Number(allTime.substring(0,2)),2);
	var minToMm = allTime.substring(3,5);
	
	$('#'+registTimeId).val(hourToHh+":"+minToMm);
	registTimeId = '';
	$('#input_timeMedi').panel("close");
});
/**TimePicker 추가 (김태일)**/