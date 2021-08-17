
var userId;
var measrSn;

$(document).ready(function(){
	var req = new Request();
	userId = sessionStorage.getItem("USER_ID");
	measrSn = req.getParameter("measrSn");
	selectBloodSugar();
});

// 저장 버튼 클릭 이벤트
$("#saveBtn").on("click", function(){
	
	var updateParam = {
			  SESS_USER_ID 	: userId
			, MEASR_SN		: measrSn
			, MEASR_DE		: $("#measrDe").val().replace(/-/g, "")
			, MEASR_TM		: $("#measrTm").val().replace(/:/g, "") + "00"
			, BLOOD_SUGAR	: $("#bloodSugar").val()
			, RMK			: $("#rmk").val()
			, MEAL_CLF		: ""
	}
	
	cmmnAjax("appGlu/tl/updateBloodSugar.do", updateParam, function (result){
		if(result.chkYn == 'Y'){
			location.href = "./sugarDetail.html?measrSn="+measrSn;
		}
    });
});

// 혈당 상세 조회
function selectBloodSugar(){
	cmmnAjax("appGlu/tl/selectBloodSugar.do", {SESS_USER_ID:userId, MEASR_SN:measrSn}, function (data){
		selectBloodSugarCallback(data);
    });
}

// 혈당 상세 조회 콜백
function selectBloodSugarCallback(data){
	if(!isNull(data)){
		var measrDeVal = data.MEASR_DE.substring(0,4) + "-" + data.MEASR_DE.substring(4,6) + "-" + data.MEASR_DE.substring(6,8);
		var measrTmVal = data.MEASR_TM.substring(0,2) + ":" + data.MEASR_TM.substring(2,4);
				
		$("#measrDe").val(measrDeVal);
		$("#measrTm").val(measrTmVal);
		$("#bloodSugar").val(data.BLOOD_SUGAR);
		$("#rmk").text(data.RMK);
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