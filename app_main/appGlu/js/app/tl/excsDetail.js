
var userId;
var excsRecSn;
var returnPage = localStorage.getItem('returnPage');
var callDe = '';

$(document).ready(function(){
	var req = new Request();
	userId = sessionStorage.getItem("USER_ID");
	excsRecSn = req.getParameter("excsRecSn");
	selectExcsRec();
});

// 편집 버튼 클릭 이벤트
$("#editBtn").on("click", function(){
	location.href = "./excsEdit.html?excsRecSn="+excsRecSn;
});

//삭제 버튼 클릭 이벤트
$("#delBtn").on("click", function(){
	getConfirmPop("삭제하시겠습니까?", "삭제된 데이터는 복구할 수 없습니다.", function(){
		var deleteParam = {
				  SESS_USER_ID 		: userId
				, EXCS_REC_SN		: excsRecSn
		}

		cmmnAjax("appGlu/tl/deleteExcsRec.do", deleteParam, function (result){
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
function selectExcsRec(){
	cmmnAjax("appGlu/tl/selectExcsRec.do", {SESS_USER_ID:userId, EXCS_REC_SN:excsRecSn}, function (data){
		selectExcsRecCallback(data);
    });
}

// 메모 상세 조회 콜백
function selectExcsRecCallback(data){
	if(!isNull(data)){
		callDe = data.EXCS_DE;
		var excsDeTxt = setDateFormat(data.EXCS_DE, "YYYY년 MM월 DD일");
		var excsBgnTmTxt = setDateFormat(data.EXCS_DE + data.EXCS_BGN_TM, "AP HH:MI");
		
		$("#excsDeTxt").text(excsDeTxt);
		$("#excsBgnTmTxt").text(excsBgnTmTxt);
		$("#excsNmTxt").text(data.EXCS_NM);
		$("#excsTmTxt").html(data.EXCS_TM);
	}
}