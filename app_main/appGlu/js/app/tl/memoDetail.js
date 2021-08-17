
var userId;
var freeMemoDe;
var freeMemoSn;
var returnPage = localStorage.getItem('returnPage');
var callDe = '';

$(document).ready(function(){
	var req = new Request();
	userId = sessionStorage.getItem("USER_ID");
	freeMemoDe = req.getParameter("freeMemoDe");
	freeMemoSn = req.getParameter("freeMemoSn");
	selectMemo();
});

// 편집 버튼 클릭 이벤트
$("#editBtn").on("click", function(){
	location.href = "./memoEdit.html?freeMemoDe="+freeMemoDe+"&freeMemoSn="+freeMemoSn;
});

// 삭제 버튼 클릭 이벤트
$("#delBtn").on("click", function(){
	getConfirmPop("삭제하시겠습니까?", "삭제된 데이터는 복구할 수 없습니다.", function(){
		var deleteParam = {
				  SESS_USER_ID 		: userId
				, FREE_MEMO_SN		: freeMemoSn
				, FREE_MEMO_DE		: freeMemoDe
		}

		cmmnAjax("appGlu/tl/deleteMemo.do", deleteParam, function (result){
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
function selectMemo(){
	cmmnAjax("appGlu/tl/selectMemo.do", {SESS_USER_ID:userId, FREE_MEMO_DE:freeMemoDe, FREE_MEMO_SN:freeMemoSn}, function (data){
		selectMemoCallback(data);
    });
}

// 메모 상세 조회 콜백
function selectMemoCallback(data){
	if(!isNull(data)){
		callDe = data.FREE_MEMO_DE;
		var freeMemoDeTxt = setDateFormat(data.FREE_MEMO_DE, "YYYY년 MM월 DD일");
		var freeMemoTmTxt = setDateFormat(data.FREE_MEMO_DE + data.FREE_MEMO_TM, "AP HH:MI");
		
		$("#freeMemoDeTxt").text(freeMemoDeTxt);
		$("#freeMemoTmTxt").text(freeMemoTmTxt);
		$("#freeMemoTxt").html(data.FREE_MEMO_CN.replace(/\n/g, "<br/>"));
	}
}