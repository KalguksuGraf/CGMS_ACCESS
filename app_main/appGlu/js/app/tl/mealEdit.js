
var userId;
var mealDe;
var mealClf;
var mealClfSn;

var addFoodList = [];		// 추가 음식 목록
var delFoodList = [];		// 삭제 음식 목록

var foodFavList = [];		// 음식 즐겨찾기 목록
var selFoodCd = "";			// 선택 음식 코드
var selFoodInfo =  {};

$(document).ready(function(){
	var req = new Request();
	userId = sessionStorage.getItem("USER_ID");
	mealDe = req.getParameter("mealDe");
	mealClf = req.getParameter("mealClf");
	mealClfSn = req.getParameter("mealClfSn");
	selectMeal();
});

//페이지 초기화
$(document).on("pagebeforeshow",function(){
	var currPageId = $.mobile.activePage.attr('id');
	
	// 음식 검색 페이지 초기화
	if(currPageId == "meal_edit1"){
		if(!isNull(bridge)){
			jappinf.getAppPref("foodFavList", function(resultCode, resultData){
				if(resultCode == RESULTCODE.SUCC){
					if(!isNull(resultData.foodFavList)){
						foodFavList = JSON.parse(resultData.foodFavList);
						setFoodList("");
					}
				}
			});
		}
	}
	// 음식 용량선택 페이지 초기화
	else if(currPageId == "meal_edit2_1"){
		cmmnAjax("appGlu/tl/selectFoodInfo.do", {FOOD_CD:selFoodCd}, function (data){
			selFoodInfo = data.foodInfo;
			
			$(".foodNmTxt").text(selFoodInfo.FOOD_NM);
			
			$("#selFoodList li:eq(0) h1").text("1/2" + selFoodInfo.UNIT_NM);
			$("#selFoodList li:eq(1) h1").text("1" + selFoodInfo.UNIT_NM);
			$("#selFoodList li:eq(2) h1").text("1 1/2" + selFoodInfo.UNIT_NM);
			$("#selFoodList li:eq(3) h1").text("2" + selFoodInfo.UNIT_NM);
			
			$("#selFoodList li:eq(0) p:eq(0)").text(Math.round(Number(selFoodInfo.TM_STND_AM) / 2) + "g");
			$("#selFoodList li:eq(1) p:eq(0)").text(selFoodInfo.TM_STND_AM + "g");
			$("#selFoodList li:eq(2) p:eq(0)").text(Math.round(Number(selFoodInfo.TM_STND_AM) * 1.5) + "g");
			$("#selFoodList li:eq(3) p:eq(0)").text(Math.round(Number(selFoodInfo.TM_STND_AM) * 2) + "g");
			
			$("#selFoodList li:eq(0) p:eq(1)").html(Math.round(Number(selFoodInfo.KCAL) / 2) + '<span class="fnt_sm02">kcal</span>');
			$("#selFoodList li:eq(1) p:eq(1)").html(selFoodInfo.KCAL + '<span class="fnt_sm02">kcal</span>');
			$("#selFoodList li:eq(2) p:eq(1)").html(Math.round(Number(selFoodInfo.KCAL) * 1.5) + '<span class="fnt_sm02">kcal</span>');
			$("#selFoodList li:eq(3) p:eq(1)").html(Math.round(Number(selFoodInfo.KCAL) * 2) + '<span class="fnt_sm02">kcal</span>');
			
			$("#meal_edit2_2 span.unitNm").text(selFoodInfo.UNIT_NM);
	    });
	}
});

// 저장 버튼 클릭 이벤트
$("#saveBtn").on("click", function(){
	
	var updateParam = {
			  SESS_USER_ID 		: userId
			, MEAL_DE			: mealDe
			, MEAL_CLF			: mealClf
			, MEAL_CLF_SN		: mealClfSn
			, UPD_MEAL_DE		: $("#mealDe").val().replace(/-/g, "")
			, UPD_MEAL_TM		: $("#mealTm").val().replace(/:/g, "") + "00"
			, UPD_MEAL_CLF		: $("#mealClf").val()
			, ADD_FOOD_LIST 	: JSON.stringify(addFoodList)
			, DEL_FOOD_LIST 	: JSON.stringify(delFoodList)
	}
	
	cmmnAjax("appGlu/tl/updateMealRec.do", updateParam, function (result){
		if(result.chkYn == "Y"){
			location.href = "./mealDetail.html?mealDe="+result.MEAL_DE+"&mealClf="+result.MEAL_CLF+"&mealClfSn="+result.MEAL_CLF_SN;
		}
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
	if(!isNull(data)){
		var mealDtlsList = data.mealDtlsList;
		
		var mealDeVal = mealDtlsList[0].MEAL_DE.substring(0,4) + "-" + mealDtlsList[0].MEAL_DE.substring(4,6) + "-" + mealDtlsList[0].MEAL_DE.substring(6,8);
		var mealTmVal = mealDtlsList[0].MEAL_TM.substring(0,2) + ":" + mealDtlsList[0].MEAL_TM.substring(2,4);
				
		$("#mealDe").val(mealDeVal);
		$("#mealTm").val(mealTmVal);
		$("#mealClf").val(mealDtlsList[0].MEAL_CLF);
		$("#mealClf").selectmenu("refresh");
		
		$("#mealDtlsList").append('<li data-role="list-divider" class="meal_kcal">' + mealDtlsList[0].TOT_KCAL + 'kcal</li>');
		
		var imgUrl = ABSOLUTE_URL + 'common/attchFileDownload.do?attchFileSn='+mealDtlsList[0].ATTCH_FILE_SN+'&attchFileDtlsSn=1';
		$(".meal_bg_img").css("background-image", "url('" + imgUrl + "')");
		
		for(var i = 0; i < mealDtlsList.length; i++){
			var li = $('<li><span>' + mealDtlsList[i].FOOD_NM + '</span> <span>' + mealDtlsList[i].KCAL + 'kcal <button class="delMealDtlsBtn curFood"><em>삭제</em></button> </span></li>')
					.data("FOOD_SN", mealDtlsList[i].FOOD_SN);
			$("#mealDtlsList").append(li);
		}

		$("#mealDtlsList").listview().listview("refresh");
		
	}
}

// 음식 삭제 버튼 클릭 이벤트
$(document).on("click", ".delMealDtlsBtn", function(){
	// 저장된 음식
	if($(this).hasClass("curFood")){
		delFoodList.push({FOOD_SN:$(this).closest("li").data("FOOD_SN")});
	}
	// 추가된 음식
	else{
		for(var i in addFoodList){
			if(addFoodList[i].FOOD_NM == $(this).parent().prev().text()){
				addFoodList.splice(i, 1);
			}
		}
	}
	
	$(this).closest("li").remove();
});

// 음식 추가 버튼 클릭 이벤트
$("#mealDtlsAddBtn").on("click", function(){
	$.mobile.changePage("#meal_edit1");
});

// 음식검색 목록 세팅
function setFoodList(setFoodNm){
	$("#foodSearchList").empty();
		
	var foodFavListStr = "";
	for(var i = 0; i < foodFavList.length; i++){
		var li = $('<li><a href="" class="foodNm">' + foodFavList[i].FOOD_NM + '</a><a href="" class="searchfav_on favBtn">즐겨찾기</a></li>')
			.data("FOOD_CD", foodFavList[i].FOOD_CD)
			.data("FOOD_NM", foodFavList[i].FOOD_NM);
		
		$("#foodSearchList").append(li);
		
		foodFavListStr += "|" + foodFavList[i].FOOD_CD + "|";
	}
	
	$("#foodSearchList").listview().listview("refresh");
	
	if(!isNull(setFoodNm)){
		cmmnAjax("appGlu/tl/selectFoodSchList.do", {SCH_FOOD_NM:setFoodNm}, function (data){
			var foodList = data.foodList;
			
			for(var i = 0; i < foodList.length; i++){
				if(foodFavListStr.indexOf(foodList[i].FOOD_CD) > -1){
					continue;
				}
				
				var li = $('<li><a href="" class="foodNm">' + foodList[i].FOOD_NM + '</a><a href="" class="searchfav_off favBtn">즐겨찾기</a></li>')
					.data("FOOD_CD", foodList[i].FOOD_CD)
					.data("FOOD_NM", foodList[i].FOOD_NM);
				
				$("#foodSearchList").append(li);
			}
			
			if($("#foodSearchList li").length == 0){
				$("#foodSearchList").append('<li><div class="health_nodata">검색결과가 없습니다.</div></li>');
			}
			
			$("#foodSearchList").listview().listview("refresh");
	    }, {bAsync:"false"});
	}
}

// 음식검색 음식이름 입력 이벤트
$("#foodSchTxt").on("input", function(){
	setFoodList($(this).val());
});
// 음식검색 음식이름 x 버튼 클릭 이벤트
$(document).on("click", "#meal_edit1 .ui-input-clear", function(){
	setFoodList("");
});

// 음식검색 음식 선택 이벤트
$(document).on("click", "#foodSearchList li a.foodNm", function(){
	selFoodCd = $(this).parent().data("FOOD_CD");
	$.mobile.changePage("#meal_edit2_1");
});

// 음식 검색 즐겨찾기 버튼 클릭 이벤트
$(document).on("click", "#foodSearchList li a.favBtn", function(){
	var foodCd = $(this).parent().data("FOOD_CD");
	var foodNm = $(this).parent().data("FOOD_NM");
	
	if($(this).hasClass("searchfav_on")){
		for(var i = 0; i < foodFavList.length; i++){
			if(foodFavList[i].FOOD_CD == foodCd){
				foodFavList.splice(i, 1);
				break;
			}
		}
		$(this).parent().remove();
		
		if(!isNull(bridge)){
			jappinf.setAppPref({"foodFavList":JSON.stringify(foodFavList)}, function(resultCode){
				if(resultCode == RESULTCODE.SUCC){
					setFoodList($("#foodSchTxt").val());
				}
			});
		}else{
			setFoodList($("#foodSchTxt").val());
		}
	}else{
		foodFavList.push({FOOD_CD:foodCd,FOOD_NM:foodNm});
		
		if(!isNull(bridge)){
			jappinf.setAppPref({"foodFavList":JSON.stringify(foodFavList)}, function(resultCode){
				if(resultCode == RESULTCODE.SUCC){
					setFoodList($("#foodSchTxt").val());
				}
			});
		}else{
			setFoodList($("#foodSchTxt").val());
		}
	}
});

// 섭취량 직접입력
$("#meal_edit2_2 #meal_edit03").on("input", function(){
	$("#meal_edit2_2 #meal_edit04").val("");
	
	var calKcal = Math.round($(this).val() * Number(selFoodInfo.KCAL));
	$("#meal_edit2_2 #meal_edit05").val(calKcal);
});

// 식재료량 직접입력
$("#meal_edit2_2 #meal_edit04").on("input", function(){
	$("#meal_edit2_2 #meal_edit03").val("");
	
	var calKcal = Math.round($(this).val() / Number(selFoodInfo.TM_STND_AM) * Number(selFoodInfo.KCAL));
	$("#meal_edit2_2 #meal_edit05").val(calKcal);
});

// 섭취량 선택
function addFoodDtls(baseValue){
	for(var i in addFoodList){
		if(addFoodList[i].FOOD_NM == selFoodInfo.FOOD_NM){
			addFoodList.splice(i, 1);
		}
	}
	
	$("#mealDtlsList li").each(function(){
		if($(this).find("span:eq(0)").text() == selFoodInfo.FOOD_NM){
			$(this).remove();
		}		
	});
	
	selFoodInfo["INTAKE_TM"] 	= baseValue;
	selFoodInfo["INTAKE_AM"] 	= (Number(selFoodInfo.TM_STND_AM) * baseValue / 10) * 10;
	selFoodInfo["KCAL"] 		= (Number(selFoodInfo.KCAL) * baseValue / 10) * 10;
	selFoodInfo["CARB"] 		= (Number(selFoodInfo.CARB) * baseValue / 10) * 10;
	selFoodInfo["PROTEIN"] 		= (Number(selFoodInfo.PROTEIN) * baseValue / 10) * 10;
	selFoodInfo["FAT"] 			= (Number(selFoodInfo.FAT) * baseValue / 10) * 10;
	selFoodInfo["SUGAR"] 		= (Number(selFoodInfo.SUGAR) * baseValue / 10) * 10;
	selFoodInfo["SODI"] 		= (Number(selFoodInfo.SODI) * baseValue / 10) * 10;
	selFoodInfo["CHOLE"] 		= (Number(selFoodInfo.CHOLE) * baseValue / 10) * 10;
	selFoodInfo["GRS_ACD"] 		= (Number(selFoodInfo.GRS_ACD) * baseValue / 10) * 10;
	selFoodInfo["TRAN_FAT"] 	= (Number(selFoodInfo.TRAN_FAT) * baseValue / 10) * 10;
	
	addFoodList.push(selFoodInfo);
	
	var li = $('<li><span>' + selFoodInfo.FOOD_NM + '</span> <span>' + selFoodInfo.KCAL + 'kcal <button class="delMealDtlsBtn"><em>삭제</em></button> </span></li>');
	$("#mealDtlsList").append(li);
	$("#mealDtlsList").listview().listview("refresh");
	
	$.mobile.changePage("#meal_edit");
}

// 직접입력 저장 버튼 클릭
function addFoodDtlsManu(){
	var baseValue = "";
	
	if(!isNull($("#meal_edit2_2 #meal_edit04").val())){
		baseValue = (Number($("#meal_edit2_2 #meal_edit04").val()) / Number(selFoodInfo.TM_STND_AM) / 10) * 10;
	}
	
	if(!isNull($("#meal_edit2_2 #meal_edit03").val())){
		baseValue = $("#meal_edit2_2 #meal_edit03").val();
	}
	
	addFoodDtls(baseValue);
}

// 팝업 삭제 버튼 클릭 이벤트
$(document).on("click", "#delImgPopBtn", function(){
	
	var deleteParam = {
			  SESS_USER_ID 		: userId
			, MEAL_DE			: mealDe
			, MEAL_CLF			: mealClf
			, MEAL_CLF_SN		: mealClfSn
	}
	
	cmmnAjax("appGlu/tl/deleteMealRec.do", deleteParam, function (result){
		if(result.chkYn == "Y"){
			location.href = "../mn/dashboardWide.html?fullscreenchange=On";
		}
  });
});

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