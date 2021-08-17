
var userId;
var measrSn;
var returnPage = localStorage.getItem('returnPage');
var callDe = '';

$(document).ready(function(){
	var req = new Request();
	userId = sessionStorage.getItem("USER_ID");
	measrSn = req.getParameter("measrSn");
	selectBloodSugar();
});

// 편집 버튼 클릭 이벤트
$("#editBtn").on("click", function(){
	location.href = "./sugarEdit.html?measrSn="+measrSn;
});

// 삭제 버튼 클릭 이벤트
$("#delBtn").on("click", function(){
	getConfirmPop("삭제하시겠습니까?", "삭제된 데이터는 복구할 수 없습니다.", function(){
		var deleteParam = {
				  SESS_USER_ID 	: userId
				, MEASR_SN		: measrSn
		}

		cmmnAjax("appGlu/tl/deleteBloodSugar.do", deleteParam, function (result){
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

// 혈당 상세 조회
function selectBloodSugar(){
	cmmnAjax("appGlu/tl/selectBloodSugar.do", {SESS_USER_ID:userId, MEASR_SN:measrSn}, function (data){
		selectBloodSugarCallback(data);
    });
}

// 혈당 상세 조회 콜백
function selectBloodSugarCallback(data){
	if(!isNull(data)){
		callDe = data.MEASR_DE;
		var measrDeTxt = setDateFormat(data.MEASR_DE, "YYYY년 MM월 DD일");
		var measrTmTxt = setDateFormat(data.MEASR_DE + data.MEASR_TM, "AP HH:MI");
		
		$("#measrDeTxt").text(measrDeTxt);
		$("#measrTmTxt").text(measrTmTxt);
		$("#bloodSugarTxt").text(data.BLOOD_SUGAR);
		$("#rmkTxt").text(data.RMK);
	}
}