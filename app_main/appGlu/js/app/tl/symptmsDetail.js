
var userId;
var symptmsDe;
var symptmsSn;
var symptmsCdNm = ["식은땀", "어지럼증", "두통", "피로", "불안함", "흥분", "공복감", "두근거림", "기타증상"];
var returnPage = localStorage.getItem('returnPage');
var callDe = '';

$(document).ready(function(){
	var req = new Request();
	userId = sessionStorage.getItem("USER_ID");
	symptmsDe = req.getParameter("symptmsDe");
	symptmsSn = req.getParameter("symptmsSn");
	selectSymptms();
});

// 편집 버튼 클릭 이벤트
$("#editBtn").on("click", function(){
	location.href = "./symptmsEdit.html?symptmsDe="+symptmsDe+"&symptmsSn="+symptmsSn;
});

// 삭제 버튼 클릭 이벤트
$("#delBtn").on("click", function(){
	getConfirmPop("삭제하시겠습니까?", "삭제된 데이터는 복구할 수 없습니다.", function(){
		var deleteParam = {
				  SESS_USER_ID 		: userId
				, SYMPTMS_DE		: symptmsDe
				, SYMPTMS_SN		: symptmsSn
		}

		cmmnAjax("appGlu/tl/deleteSymptms.do", deleteParam, function (result){
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
function selectSymptms(){
	cmmnAjax("appGlu/tl/selectSymptms.do", {SESS_USER_ID:userId, SYMPTMS_DE:symptmsDe, SYMPTMS_SN:symptmsSn}, function (data){
		selectSymptmsCallback(data);
    });
}

// 증상 상세 조회 콜백
function selectSymptmsCallback(data){
	if(!isNull(data)){	
		callDe = data.SYMPTMS_DE;
		var symptmsDeTxt = setDateFormat(data.SYMPTMS_DE, "YYYY년 MM월 DD일");
		var symptmsTmTxt = setDateFormat(data.SYMPTMS_DE + data.SYMPTMS_TM, "AP HH:MI");
		
		$("#symptmsDeTxt").text(symptmsDeTxt);
		$("#symptmsTmTxt").text(symptmsTmTxt);
		
		if(!isNull(data.SYMPTMS_CLF_ARR)){			
			var symptmsClfArr = data.SYMPTMS_CLF_ARR.split(",");
			for(var i in symptmsClfArr){
				var symptmsHtml = '<div class="swiper-slide">'
								+ '<div class="box_div">'
								+ '<span class="icon icon' + symptmsClfArr[i] + '"></span>'
								+ '<span>' + symptmsCdNm[Number(symptmsClfArr[i])] + '</span></div></div>';
				$(".swiper2 .swiper-wrapper").append(symptmsHtml);
				
				if(symptmsClfArr[i] == "08"){
					$(".symptms09TxtCls").show();
					$("#symptmsCnTxt").text(data.SYMPTMS_CN);
				}
			}
		}
		
		var swiper2 = new Swiper('.swiper2', {
			slidesPerView: 'auto',
			centeredSlides: false,
			spaceBetween: 16,
			freeMode: true,
			loop: false,
		});
	}
}

