
var userId;
var freeMemoDe;
var freeMemoSn;

$(document).ready(function(){
	var req = new Request();
	userId = sessionStorage.getItem("USER_ID");
	freeMemoDe = req.getParameter("freeMemoDe");
	freeMemoSn = req.getParameter("freeMemoSn");
	selectMemo();
});

// 저장 버튼 클릭 이벤트
$("#saveBtn").on("click", function(){
	
	var updateParam = {
			  SESS_USER_ID 		: userId
			, FREE_MEMO_SN		: freeMemoSn
			, FREE_MEMO_DE		: freeMemoDe
			, UPD_FREE_MEMO_DE	: $("#freeMemoDe").val().replace(/-/g, "")
			, UPD_FREE_MEMO_TM	: $("#freeMemoTm").val().replace(/:/g, "") + "00"
			, FREE_MEMO_CN		: $("#freeMemoCn").val()
	}
	
	cmmnAjax("appGlu/tl/updateMemo.do", updateParam, function (result){
		if(result.chkYn == "Y"){
			location.href = "./memoDetail.html?freeMemoDe="+result.FREE_MEMO_DE+"&freeMemoSn="+result.FREE_MEMO_SN;
		}
    });
});

// 메모 상세 조회
function selectMemo(){
	cmmnAjax("appGlu/tl/selectMemo.do", {SESS_USER_ID:userId, FREE_MEMO_DE:freeMemoDe, FREE_MEMO_SN:freeMemoSn}, function (data){
		selectMemoCallback(data);
    });
}

// 메모 상세 조회 콜백
function selectMemoCallback(data){
	if(!isNull(data)){
		var freeMemoDeVal = data.FREE_MEMO_DE.substring(0,4) + "-" + data.FREE_MEMO_DE.substring(4,6) + "-" + data.FREE_MEMO_DE.substring(6,8);
		var freeMemoTmVal = data.FREE_MEMO_TM.substring(0,2) + ":" + data.FREE_MEMO_TM.substring(2,4);
				
		$("#freeMemoDe").val(freeMemoDeVal);
		$("#freeMemoTm").val(freeMemoTmVal);
		$("#freeMemoCn").val(data.FREE_MEMO_CN);
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