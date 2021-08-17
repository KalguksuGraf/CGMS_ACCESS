
var userId;
var sleepDe;
var sleepSn;
var returnPage = localStorage.getItem('returnPage');
var callDe = '';

$(document).ready(function(){
	var req = new Request();
	userId = sessionStorage.getItem("USER_ID");
	sleepDe = req.getParameter("sleepDe");
	sleepSn = req.getParameter("sleepSn");
	selectSleep();
});

// 편집 버튼 클릭 이벤트
$("#editBtn").on("click", function(){
	location.href = "./sleepEdit.html?sleepDe="+sleepDe+"&sleepSn="+sleepSn;
});

// 삭제 버튼 클릭 이벤트
$("#delBtn").on("click", function(){
	getConfirmPop("삭제하시겠습니까?", "삭제된 데이터는 복구할 수 없습니다.", function(){
		var deleteParam = {
				  SESS_USER_ID 		: userId
	   		    , SLEEP_DE			: sleepDe
				, SLEEP_SN			: sleepSn
		}

		cmmnAjax("appGlu/tl/deleteSleep.do", deleteParam, function (result){
			if(result.chkYn == 'Y'){
				localStorage.removeItem('returnPage');
				if(returnPage == 'dashBoardWide'){					
					location.href = "../mn/dashboardWide.html?fullscreenchange=On";
				}else{
					localStorage.removeItem("timelineDe");
					location.href = '../tl/timeline.html?de=' + callDe;
				}
			}
		});
	});	
});

// 메모 상세 조회
function selectSleep(){
	cmmnAjax("appGlu/tl/selectSleep.do", {SESS_USER_ID:userId, SLEEP_DE:sleepDe, SLEEP_SN:sleepSn}, function (data){
		selectSleepCallback(data);
    });
}

// 메모 상세 조회 콜백
function selectSleepCallback(data){
	if(!isNull(data)){
		callDe = data.SLEEP_DE;
		var sleepDeTxt = setDateFormat(data.SLEEP_DE, "YYYY년 MM월 DD일");
		var sleepEndTmTxt = setDateFormat(data.SLEEP_DE + data.SLEEP_END_TM, "AP HH:MI");
		
		$("#sleepDeTxt").text(sleepDeTxt);
		$("#sleepEndTmTxt").text(sleepEndTmTxt);
		$("#sleepTmTxt").text(data.SLEEP_TM + "시간");
		
		var sleepEvl = Number(data.SLEEP_EVL);
		for(var i = 0; i < sleepEvl; i++){
			$("#sleepEvlTxt span:eq(" + i + ")").addClass("rate-full");
		}
	}
}