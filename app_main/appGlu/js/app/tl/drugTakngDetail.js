
var userId;
var drugTakngDe;
var drugTakngTm;
var returnPage = localStorage.getItem('returnPage');
var callDe = '';

$(document).ready(function(){
	var req = new Request();
	userId = sessionStorage.getItem("USER_ID");
	drugTakngDe = req.getParameter("drugTakngDe");
	drugTakngTm = req.getParameter("drugTakngTm");
	selectDrugTakng();
	console.log(localStorage.getItem('returnPage'))
});

// 편집 버튼 클릭 이벤트
$("#editBtn").on("click", function(){
	location.href = "./drugTakngEdit.html?drugTakngDe="+drugTakngDe+"&drugTakngTm="+drugTakngTm;
});

// 삭제 버튼 클릭 이벤트
$("#delBtn").on("click", function(){
	getConfirmPop("삭제하시겠습니까?", "삭제된 데이터는 복구할 수 없습니다.", function(){
		var deleteParam = {
				  SESS_USER_ID 		: userId
				, DRUG_TAKNG_DE	: drugTakngDe
				, DRUG_TAKNG_TM : drugTakngTm
		}

		cmmnAjax("appGlu/tl/deleteDrugTakng.do", deleteParam, function (result){
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

// 증상 상세 조회
function selectDrugTakng(){
	cmmnAjax("appGlu/tl/selectDrugTakng.do", {SESS_USER_ID:userId, DRUG_TAKNG_DE:drugTakngDe, DRUG_TAKNG_TM:drugTakngTm}, function (data){
		selectDrugTakngCallback(data);
    });
}

// 증상 상세 조회 콜백
function selectDrugTakngCallback(data){
	if(!isNull(data.rsList)){
		var rsList = data.rsList;
		callDe = rsList[0].DRUG_TAKNG_DE;
		var drugTakngDeTxt = setDateFormat(rsList[0].DRUG_TAKNG_DE, "YYYY년 MM월 DD일");
		var drugTakngTmTxt = setDateFormat(rsList[0].DRUG_TAKNG_DE + rsList[0].DRUG_TAKNG_TM, "AP HH:MI");
		
		$("#drugTakngDeTxt").text(drugTakngDeTxt);
		$("#drugTakngTmTxt").text(drugTakngTmTxt);
		
		var sb = new StringBuffer();
		for(var i in rsList){
			sb.append('<li>');
			sb.append('<div class="takemedi_box">');
			sb.append('<span class="bo_tit">');
			sb.append('<h3>' + rsList[i].DRUG_NM + '</h3>');
			sb.append('<p>' + rsList[i].DRUG_TAKNG_QY + '</p><p>' + rsList[i].DRUG_TAKNG_UNIT + '</p>');
			sb.append('</span>');
			sb.append('</div>');
			sb.append('</li>');
		}
		
		$("#drugTakngListView").html(sb.toString());
		$("#drugTakngListView").trigger("create");
	}
}

