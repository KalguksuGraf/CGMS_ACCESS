
var userId;
var mealDe;
var mealClf;
var mealClfSn;
var returnPage = localStorage.getItem('returnPage');
var callDe = '';

$(document).ready(function(){
	var req = new Request();
	userId = sessionStorage.getItem("USER_ID");
	mealDe = req.getParameter("mealDe");
	mealClf = req.getParameter("mealClf");
	mealClfSn = req.getParameter("mealClfSn");
	selectMeal();
});

// 편집 버튼 클릭 이벤트
$("#editBtn").on("click", function(){
	location.href = "./mealEdit.html?mealDe="+mealDe+"&mealClf="+mealClf+"&mealClfSn="+mealClfSn;
});

// 삭제 버튼 클릭 이벤트
$("#delBtn").on("click", function(){
	getConfirmPop("삭제하시겠습니까?", "삭제된 데이터는 복구할 수 없습니다.", function(){
		var deleteParam = {
				  SESS_USER_ID 		: userId
				, MEAL_DE			: mealDe
				, MEAL_CLF			: mealClf
				, MEAL_CLF_SN		: mealClfSn
		}

		cmmnAjax("appGlu/tl/deleteMealRec.do", deleteParam, function (result){
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

// 식사 상세 조회
function selectMeal(){
	cmmnAjax("appGlu/tl/selectMealDtlsList.do", {SESS_USER_ID:userId, MEAL_DE:mealDe, MEAL_CLF:mealClf, MEAL_CLF_SN:mealClfSn}, function (data){
		selectMealCallback(data);
    });
}

// 식사 상세 조회 콜백
function selectMealCallback(data){
	if(!isNull(data.mealDtlsList)){
		var mealDtlsList = data.mealDtlsList;		
		callDe = mealDtlsList[0].MEAL_DE;
		
		var mealDeTxt = setDateFormat(mealDtlsList[0].MEAL_DE, "YYYY년 MM월 DD일");
		var mealTmTxt = setDateFormat(mealDtlsList[0].MEAL_DE + mealDtlsList[0].MEAL_TM, "AP HH:MI");
		
		$("#mealDeTxt").text(mealDeTxt);
		$("#mealTmTxt").text(mealTmTxt);
		$("#mealClfNmTxt").text(mealDtlsList[0].MEAL_CLF_NM);
		
		$("#mealDtlsList").append('<li data-role="list-divider" class="meal_kcal">' + mealDtlsList[0].TOT_KCAL + 'kcal</li>');
				
		var imgUrl = ABSOLUTE_URL + 'common/attchFileDownload.do?attchFileSn='+mealDtlsList[0].ATTCH_FILE_SN+'&attchFileDtlsSn=1';
		$(".meal_bg_img").css("background-image", "url('" + imgUrl + "')");
		
		for(var i = 0; i < mealDtlsList.length; i++){
			$("#mealDtlsList").append('<li><span>' + mealDtlsList[i].FOOD_NM + '</span> <span>' + mealDtlsList[i].KCAL + 'kcal</span></li>');
		}

		$("#mealDtlsList").listview().listview("refresh");
	}
}