
var userId;
var drugTakngDe;
var drugTakngTm;

var currPageId; 
var selectTabIndex = 0;
var currDate = new Date();

var excsList;				// 운동 목록
var excsFavListStr = "";	// 운동 즐겨찾기 목록

var foodFavList = [{}];		// 음식 즐겨찾기 목록
var selFoodCd = "";			// 선택 음식 코드
var selFoodInfo =  {};

var foodLensList = [];
var base64Image = new StringBuffer();

var originalSize = jQuery(window).height();

var registTimeId = '';

//운동 swipe내 가상키보드 버튼 간섭 방지
jQuery(window).resize(function() {
    
    // 처음 사이즈와 현재 사이즈가 변경된 경우
    // 키보드가 올라온 경우
    if(jQuery(window).height() != originalSize) {
      //alert("가상 키보드가 오픈 되었습니다."); 
    	$('#excs_search').removeClass('btn_wrap');
    	$('#excs_search').css({"margin-top":"5em"});
    }
   
    // 처음 사이즈와 현재 사이즈가 동일한 경우
    // 키보드가 다시 내려간 경우
    else {
      //alert("가상 키보드의 사용지 종료되었습니다.");
    	$('#excs_search').addClass('btn_wrap');
    	$('#excs_search').css({"margin-top":"0em"});
    }
  });
//input time 세팅 (1)
$(document).ready(function(){
  $(".time_element").timepicki();
});
//input time 세팅 (2)
$(document).on('click','input[type="time"]',function(){
	registTimeId = $(this).attr('id');
	//$("#input_timeMedi a.delBtn").parent().css("width", "100%");
	$("#input_timeMedi a.delBtn").parent().hide();
	$("#input_timeMedi a.regBtn").parent().css("width", "100%");
	$('#input_timeMedi').panel("open");
});
//input time 세팅 (3)
$(document).on('click','#timeSaveBtn',function(){
	var allTime = $('#timpPick').val().replace(' ','');
	var periodTime = allTime.slice(allTime.length-2);
	var hourToHh = periodTime != 'AM' ? Number(allTime.substring(0,2)) == 12? "12":leadingZeros(Number(allTime.substring(0,2))+12):Number(allTime.substring(0,2)) == 12?"00":leadingZeros(Number(allTime.substring(0,2)),2);
	var minToMm = allTime.substring(3,5);
	
	$('#'+registTimeId).val(hourToHh+":"+minToMm);
	registTimeId = '';
	$('#input_timeMedi').panel("close");
});

////appGlu/page/hr/register.html?tabIndex=2 로 탭이동
$(document).on("pagebeforecreate",function(){ 
	var req = new Request();
	userId = getSessionInfo('USER_ID'); 

	$('input[type="date"][value=""]').val(currDate.format('yyyy-MM-dd'));
	$('input[type="time"][value=""]').val(currDate.format('HH:mm'));       
//	$('input[type="date"][value=""]').attr('placeholder',currDate.format('yyyy-MM-dd'));
//	$('input[type="time"][value=""]').attr('placeholder',currDate.format('HH:mm'));
	
	var curHour = Number(currDate.format("HH"));
	if(curHour >= 6 && curHour <= 9){
		$("#meal_03").val("10");
	}else if(curHour >= 12 && curHour <= 14){
		$("#meal_03").val("20");
	}else if(curHour >= 18 && curHour <= 20){
		$("#meal_03").val("30");
	}else{
		$("#meal_03").val("40");
	}
	$("#meal_03").selectmenu().selectmenu("refresh");

	if(!isNull(req.getParameter("tabIndex"))){
		var n = req.getParameter("tabIndex");
		setCurrentSlide($(".swiper11 .swiper-slide").eq(n), n);
	}
	if(!isNull(req.getParameter("glucose"))){
		getSelectTab().find('input[name="BLOOD_SUGAR"]').val(req.getParameter("glucose"));
	}
		
});


// 페이지 초기화
$(document).on("pagebeforeshow",function(){
	currPageId = $.mobile.activePage.attr('id');
	
	// 운동 검색 페이지 초기화
	if(currPageId == "exe_search"){
		cmmnAjax("appGlu/tl/selectExcsSchList.do", {SCH_EXCS_NM:""}, function (data){
			if(!isNull(bridge)){
				jappinf.getAppPref("excsFavListStr", function(resultCode, resultData){
					if(resultCode == RESULTCODE.SUCC){
						excsFavListStr = resultData.excsFavListStr;
					}
					
					$("#excsSearchList").empty();
					if(!isNull(data.excsList)){
						excsList = data.excsList;
						setExcsList(excsList, "");
					}
				});
			}else{
				$("#excsSearchList").empty();
				if(!isNull(data.excsList)){
					excsList = data.excsList;
					setExcsList(excsList, "");
				}
			}
	    });
	}
	// 음식 검색 페이지 초기화
	else if(currPageId == "meal_edit1"){
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

$(document).on("pageshow",function(){
	if(currPageId == "main"){
		initSwipe();
	}
});

$(document).on("ready",function(){
	$(":jqmData(role='navbar')").navbar();
    $(":jqmData(role='popup')").popup(); 
    $(':jqmData(role="panel")').panel();
    
//    initSwipe();
      
}); 


function initSwipe(){ 

	var swiper11 = new Swiper('.swiper11', {
		slidesPerView: 5.7,
		paginationClickable: true,
		spaceBetween: 8,
		freeMode: true,
		loop: false,
		onTab:function(swiper){
			var n = swiper11.clickedIndex;

		}
	});
	var swiper12 = new Swiper ('.swiper12', {
		direction: 'horizontal',
		loop: false,
		autoHeight: true,
		onSlideChangeStart: function(swiper){
			var n = swiper.activeIndex;
			setCurrentSlide($(".swiper11 .swiper-slide").eq(n), n);
			swiper11.slideTo(n, 500, false);
		}
	});  
	
	swiper11.slides.each(function(index, val){ 
		var ele = $(this);
		ele.on("click",function(){
			setCurrentSlide(ele, index);
			swiper12.slideTo(index, 500, false);
			//mySwiper.initialSlide=index; 
			
		});
	});

}

function setCurrentSlide(ele, index){
	$(".swiper11 .swiper-slide").removeClass("selected"); 
	ele.addClass("selected");
	//swiper11.initialSlide=index;
	selectTabIndex = index; 
	
	//초기화
	$('.swiper12 .swiper-slide').each(function(){
		$(this).removeData();   
		$(document).find('input, textarea').val('');
		$('input[type="date"]').val(currDate.format('yyyy-MM-dd'));
		$('input[type="time"]').val(currDate.format('HH:mm'));        
		$('input[type="date"]').attr('placeholder',currDate.format('yyyy-MM-dd'));
		$('input[type="time"]').attr('placeholder',currDate.format('HH:mm'));    
		//$('#input_symptom, #input_takeMedi').find('input, textarea').val('');
		//$(this).find('input, textarea').val('');  
		$('.symptom_box li a').removeClass('on');   
	}); 
	
	if(selectTabIndex == 2){ //복약 리스트 가져오기
		var param = {};
		param["SESS_USER_ID"]=userId;  
		cmmnAjax("appGlu/tl/selectDrugUserSetList.do", param, function (result){
			if(result.chkYn == 'Y'){
				//alert('rsList====='+JSON.stringify(result.rsList));    
				var selTab = getSelectTab();
				var sb = new StringBuffer();
				selTab.find('.nodate, .item_reg_list').remove();   
				
				var ul = $('<ul class="item_reg_list set_chack_box" style="height:55vh;overflow-y:visible;"></ul>')
				
				for(var i in result.rsList ){ 
					var value = result.rsList[i].SET_VAL.split('^');
					var li = $('<li class="ui-btn-icon-right">'
								+'<div class="list_check_box">'
								+'<div class="div_check">'
								+'<label>'
								+'<input name="SET_'+i+'" type="checkbox">'
								+'</label>'
								+'</div>'
								+'</div>'
								+'<a class="list_aArea medi_list ui-btn-icon-right" href="">'
								+'<div>'
								+'<span class="bo_tit">'
								+'<input type="hidden" name="SET_VAL" value="'+result.rsList[i].SET_VAL+'">'
								+'<h3>'+value[0]+'</h3>'
								+'<p>'+value[1].concat(value[2])+'</p>'
								+'</span>'
								+'</div>'
								+'</li>').data("SET_ITEM", result.rsList[i].SET_ITEM);
					ul.append(li);
				}     
				
				ul.on("click", "span.bo_tit", function(){
					var setItem = $(this).closest("li").data("SET_ITEM");
					var setVal = $(this).find("input[name='SET_VAL']").val().split("^");
					$("#input_takeMedi input.setItem").val(setItem);
					for(var i in setVal){
						$("#input_takeMedi input:eq(" + (Number(i) + 1) + ")").val(setVal[i]);
					}
					
					$("#input_takeMedi").panel("open");
				});
				
				ul.insertBefore(selTab.find('.btn_wrap'));     
				
				selTab.trigger("create");      				 
				
				
			}else{
				alert('실패'); 
			}
	    });
	}else if(selectTabIndex == 5){ //
		getSelectTab().find('input[type="time"]').val('07:00');     
		getSelectTab().find('input[type="time"]').attr('placeholder','07:00');  
	}
}

//증상 입력 이벤트
$('.symptom_box').find('li').on('click',function(){
	var selectIndex = $('.symptom_box').find('li').index($(this)); 
	//alert(selectIndex);   
	//$('.symptom_box').find('a').removeClass('on'); 
	if($(this).find('a').hasClass('on')){
		$(this).find('a').removeClass('on');
	}else{
		$(this).find('a').addClass('on');
	}
	
	//기타증상 선택 시 
	if(selectIndex==8){
		
	}
	
	var selValues = '';
	$('.symptom_box').find('li').each(function(cnt,item){       
		//alert('2222:'+$(item).find('a')); 
		if($(this).find('a').hasClass('on')){    
			if(selValues!=''){
				selValues = selValues.concat(',');   
			}
			selValues=selValues.concat('0'.concat(cnt));   
		}
		
	}); 
	$('#symptmsRegi').data('SYMPTMS_CLF_ARR',selValues);     
	//alert('123123'+JSON.stringify($('#symptmsRegi').data()));
	 
});

$('#saveSymptom').on('click',function(){ 
	$('#symptmsRegi').data('SYMPTMS_CN',$('#input_symptom textarea').val());
	$('#input_symptom').panel('close');      
});

function getSelectTab(index){
	return $('.swiper12 .swiper-slide').eq(index||selectTabIndex);
}

/// 복약 등록 버튼 클릭 이벤트
$('#input_takeMedi a.regBtn').on('click',function(){  
	var param = {};          
	param["SESS_USER_ID"]=userId;  
	var setVal = null;
	$('#input_takeMedi').find('input:not(.setItem), textarea').each(function(){
		var key = $(this).attr('name'); 
		var value = $(this).val();
		
		if(isNullToString(value) == ""){
			return false;
		}
		
		setVal = setVal != null ? setVal.concat('^').concat(value) : value;				
	});
	
	if(setVal == null || setVal.split('^').length < 3){
		alert('값을 입력해 주세요.'); 	
		return;
	}
	
	param['SET_VAL']=setVal;
	//alert('param='+JSON.stringify(param));
	//return;   
	
	cmmnAjax("appGlu/tl/insertDrugUserSet.do", param, function (result){
		if(result.chkYn == 'Y'){
			alert('저장이 완료되었습니다.');
			setCurrentSlide($(".swiper11 .swiper-slide").eq(2), 2);
			$('#input_takeMedi').panel("close");
		}
    });
});

// 복약 삭제 버튼 클릭 이벤트
$('#input_takeMedi a.delBtn').on('click',function(){  
	var param = {};          
	param["SESS_USER_ID"] = userId;
	param["SET_CLF"] = "4010";
	param["SET_ITEM"] = $("#input_takeMedi input.setItem").val();
	
	cmmnAjax("appGlu/tl/deleteDrugUserSet.do", param, function (result){
		if(result.chkYn == 'Y'){
			alert('삭제가 완료되었습니다.');
			setCurrentSlide($(".swiper11 .swiper-slide").eq(2), 2);
			$('#input_takeMedi').panel("close");
		}
    });
});

// 약 등록 패널 열기 이벤트
$("#input_takeMedi").on("panelbeforeopen", function(){
	var setItem = $("#input_takeMedi input.setItem").val();
	if(setItem == ""){
		$("#input_takeMedi a.delBtn").parent().hide();
		$("#input_takeMedi a.regBtn").parent().css("width", "100%");
	}else{
		$("#input_takeMedi a.delBtn").parent().show();
		$("#input_takeMedi a.regBtn").parent().css("width", "48%");
	}
});

// 약 등록 패널 닫기 이벤트
$("#input_takeMedi").on("panelbeforeclose", function(){
	$("#input_takeMedi input").val("");
});

//수면이벤트
$('.ratyli').find('span').on('click',function(){
	if($(this).hasClass('rate-full')){
		$(this).removeClass('rate-full');
	}else{
		$(this).addClass('rate-full');
	} 
	var cnt = 0;
	$('.ratyli').find('span').each(function(){
		if($(this).hasClass('rate-full')){
			cnt++;
		}
	});
	
	getSelectTab().data('SLEEP_EVL',cnt);
});

// 저장 버튼 클릭 이벤트
$("#saveBtn").on("click", function(){ 
	
	var selectTab = getSelectTab();
	var param = selectTab.data()||{};          
	param["SESS_USER_ID"]=userId;  
	
	var validChk = false;
	selectTab.find('input, textarea, hidden, select').each(function(){
		if($("label[for=" + $(this).attr("id") + "]").hasClass("required_check") && isNull($(this).val())){
			var title = $("label[for=" + $(this).attr("id") + "]").text();
			alert(title+"을(를) 입력해주세요.");
			validChk = true;
			return false;
		}
		
		var key = $(this).attr('name');
		
		var value = $(this).val();
		if($(this).attr('type') == 'date'){
			value = value.replace(/-/g, "");
		}
		if($(this).attr('type') == 'time'){  
			value = value.replace(/:/g, "").concat('00');    
		}
		console.log('key='+key+' value='+value);   
		param[key] = value;
	});
	
	if(validChk){
		return;
	}
	
	if(selectTabIndex == 1){ //식사
		param["FOOD_LIST"] = JSON.stringify(foodLensList);
		foodLensList = [];
		param["base64Img"] = base64Image.toString();
		console.log("base64Image == " + base64Image);
	}
	//복약
	else if(selectTabIndex == 2){ 
		var setList = [];
		selectTab.find('input[type="checkbox"]').each(function(i){
			if($(this).is(':checked')){
				var setVal = selectTab.find('input[name="SET_VAL"]').eq(i).val() + "^" + $(this).closest("li").data("SET_ITEM");
				setList.push(setVal);
			}
		});
		param["SET_VAL"] = setList;
	}
	//운동
	else if(selectTabIndex == 3){
		param['EXCS_END_TM'] = setAddTm(param['EXCS_BGN_TM'].substring(0,2)+":"+param['EXCS_BGN_TM'].substring(2,4),param['EXCS_TM']).replace(":","")+"00";
		console.log(param);
		
	}
	// 수면
	else if(selectTabIndex == 5){
		if($("#SLEEP_EVL .rate-full").length == 0){
			alert("수면상태평가를 입력해주세요.");
			return;
		}else{
			param["SLEEP_EVL"] = $("#SLEEP_EVL .rate-full").length;
		}
	}
	
	console.log('param='+JSON.stringify(param));    
	
	//alert('저장방지');  
	//return;
	
	var serverUrl = null;
//	if(selectTabIndex == 0){ //혈당입력
//		serverUrl = "appGlu/tl/insertBloodSugarManu.do";
//	}else 
		
	if(selectTabIndex == 0){ //증상입력
		serverUrl = "appGlu/tl/insertSymptms.do";	 	
	}else if(selectTabIndex == 1){ //식사입력
		serverUrl = "appGlu/tl/insertMealRec.do";
	}else if(selectTabIndex == 2){ //복약입력
		serverUrl = "appGlu/tl/insertDrugTakng.do";
	}else if(selectTabIndex == 3){ //운동입력
		serverUrl = "appGlu/tl/insertExcsRec.do";
	}else if(selectTabIndex == 4){ //혈압입력
		serverUrl = "appGlu/tl/insertBloodPressManu.do";
	}else if(selectTabIndex == 5){ //수면입력
		serverUrl = "appGlu/tl/insertSleep.do";	
	}else if(selectTabIndex == 6){ //메모입력
		serverUrl = "appGlu/tl/insertMemo.do";	
	}	 
		
	//alert(JSON.stringify(param)); 
	
	if(serverUrl==null){
		alert('서버정보가 정확하지 않습니다.');  
		return;
	}

	
	cmmnAjax(serverUrl, param, function (result){
		if(result.chkYn == 'Y'){
			alert('저장이 완료되었습니다.');
			location.href = "../mn/dashboard.html";
		}
    });
		
	/*var drugNmArr = "";
	var drugTakngQyArr = "";
	
	$("#drugTakngListView li").each(function(){
		if(drugNmArr.length > 0){
			drugNmArr += "|";
			drugTakngQyArr += "|"; 
		}
		drugNmArr += $(this).find("h3").text();
		drugTakngQyArr += $(this).find("p").text();
	});
	
	var updateParam = {
			  SESS_USER_ID 		: userId
			, ORG_DRUG_TAKNG_DE	: drugTakngDe
			, ORG_DRUG_TAKNG_TM : drugTakngTm
			, DRUG_TAKNG_DE		: $("#drugTakngDe").val().replace(/-/g, "")
			, DRUG_TAKNG_TM		: $("#drugTakngTm").val().replace(/:/g, "") + "00"
			, DRUG_NM_ARR		: drugNmArr
			, DRUG_TAKNG_QY_ARR	: drugTakngQyArr
	}

	cmmnAjax("appGlu/tl/insertBloodSugarManu.do", updateParam, function (result){
		if(result.chkYn == 'Y'){
			alert('1');
		}
    });*/
});

// 복약 상세 조회
//function selectDrugTakng(){
//	cmmnAjax("appGlu/tl/selectDrugTakng.do", {SESS_USER_ID:userId, DRUG_TAKNG_DE:drugTakngDe, DRUG_TAKNG_TM:drugTakngTm}, function (data){
//		selectDrugTakngCallback(data);
//    });
//}

// 복약 상세 조회 콜백
//function selectDrugTakngCallback(data){
//	if(!isNull(data.rsList)){
//		var rsList = data.rsList;
//		
//		var DrugTakngDeVal = rsList[0].DRUG_TAKNG_DE.substring(0,4) + "-" + rsList[0].DRUG_TAKNG_DE.substring(4,6) + "-" + rsList[0].DRUG_TAKNG_DE.substring(6,8);
//		var DrugTakngTmVal = rsList[0].DRUG_TAKNG_TM.substring(0,2) + ":" + rsList[0].DRUG_TAKNG_TM.substring(2,4);
//		
//		$("#drugTakngDe").val(DrugTakngDeVal);
//		$("#drugTakngTm").val(DrugTakngTmVal);
//		
//		var sb = new StringBuffer();
//		for(var i in rsList){
//			sb.append('<li>');
//			sb.append('<input type="hidden" class="drugTakngSn" value="' + rsList[i].DRUG_TAKNG_SN + '" />');
//			sb.append('<div class="takemedi_box">');
//			sb.append('<a class="bo_tit mod" href="#input_takeMedi" data-rel="popup" data-position-to="window" data-transition="pop">');
//			sb.append('<h3>' + rsList[i].DRUG_NM + '</h3>');
//			sb.append('<p>' + rsList[i].DRUG_TAKNG_QY + '</p>');
//			sb.append('</a>');
//			sb.append('<button class="delBtn"><em>삭제</em></button>');
//			sb.append('</div>');
//			sb.append('</li>');
//		}
//		
//		$("#drugTakngListView").html(sb.toString());
//		$("#drugTakngListView").trigger("create");
//	}
//}

// 운동검색 버튼 클릭 이벤트
$("#excsSchBtn").on("click", function(){
	$.mobile.changePage("#exe_search");
});

// 운동검색 운동이름 입력 이벤트
$("#excsSchTxt").on("input", function(){
	if(!isNull(excsList)){
		setExcsList(excsList, $(this).val());
	}
});
// 운동검색 운동이름 x 버튼 클릭 이벤트
$(document).on("click", "#exe_search .ui-input-clear", function(){
	setExcsList(excsList, "");
});

// 운동검색 운동 선택 이벤트
$(document).on("click", "#excsSearchList li a.excsNm", function(){
	var excsCd = $(this).parent().data("EXCS_CD");
	var excsNm = $(this).parent().data("EXCS_NM");
		
	var selectTab = getSelectTab();
	selectTab.find("input[name=EXCS_CD]").val(excsCd);
	selectTab.find("input[name=EXCS_NM]").val(excsNm);
	
	$.mobile.changePage("#main");
});

// 운동 검색 즐겨찾기 버튼 클릭 이벤트
$(document).on("click", "#excsSearchList li a.favBtn", function(){
	var excsCd = $(this).parent().data("EXCS_CD");
	var excsNm = $(this).parent().data("EXCS_NM");
	
	if($(this).hasClass("searchfav_on")){
		excsFavListStr = excsFavListStr.replaceAll("|" + excsCd + "|", "");
		
		if(!isNull(bridge)){
			jappinf.setAppPref({"excsFavListStr":excsFavListStr}, function(resultCode){
				if(resultCode == RESULTCODE.SUCC){
					setExcsList(excsList, $("#excsSchTxt").val());
				}
			});
		}else{
			setExcsList(excsList, $("#excsSchTxt").val());
		}
	}else{
		excsFavListStr += "|" + excsCd + "|";
		
		if(!isNull(bridge)){
			jappinf.setAppPref({"excsFavListStr":excsFavListStr}, function(resultCode){
				if(resultCode == RESULTCODE.SUCC){
					setExcsList(excsList, $("#excsSchTxt").val());
				}
			});
		}else{
			setExcsList(excsList, $("#excsSchTxt").val());
		}
	}
});

// 운동검색 목록 세팅
function setExcsList(setExcsList, setExcsNm){
	$("#excsSearchList").empty();
	for(var i = 0; i < setExcsList.length; i++){
		if(setExcsList[i].EXCS_NM.indexOf(setExcsNm) > -1){
			var li = $('<li><a href="" class="excsNm">' + setExcsList[i].EXCS_NM + '</a><a href="" class="searchfav_off favBtn">즐겨찾기</a></li>')
				.data("EXCS_CD", excsList[i].EXCS_CD)
				.data("EXCS_NM", excsList[i].EXCS_NM);
			
			if(excsFavListStr.indexOf(setExcsList[i].EXCS_CD) > -1){
				li.find("a.favBtn").removeClass("searchfav_off");
				li.find("a.favBtn").addClass("searchfav_on");
				if($("#excsSearchList .searchfav_off:eq(0)").length > 0){
					$("#excsSearchList .searchfav_off:eq(0)").parent().before(li);
				}else{
					$("#excsSearchList").append(li);
				}
			}else{
				$("#excsSearchList").append(li);
			}
		}
	}
	
	if($("#excsSearchList li").length == 0){
		$("#excsSearchList").append('<li><div class="health_nodata">검색결과가 없습니다.</div></li>');
	}
	
	$("#excsSearchList").listview().listview("refresh");
}

// 수면상태평가 클릭 이벤트
$("#SLEEP_EVL span").on("click", function(){
	$("#SLEEP_EVL span").removeClass("rate-full");
	$(this).addClass("rate-full");
	$(this).prevAll().addClass("rate-full");
});

// 음식 사진 버튼 클릭 이벤트
$("#foodLensBtn").on("click", function(){
	if(!isNull(foodLensList)){
		getConfirmPop("다시 입력하시겠습니까?", "", function(){
			getFoodLens();
		});		
	}else{
		getFoodLens();
	}
});

function getFoodLens(){
	var inputValue = {"MEAL_DE":$("#meal_01").val().replaceAll("-", ""), "MEAL_CLF":$("#meal_03").val()};
	jappinf.getFoodLens(inputValue, function(resultCd, result) {
		if(resultCd == RESULTCODE.SUCC){
			base64Image = new StringBuffer();
			$(".meal_register_txt").hide();
			
			foodLensList = result.foodList;
			
			$("#meal_01").val(setDateFormat(result.MEAL_DE,"YYYY-MM-DD"));
			
			$("#meal_03").val(result.MEAL_CLF);
			$("#meal_03").selectmenu("refresh");
			
			base64Image.append(result.base64Img);
			$(".meal_pic_img").css("background-image", "url(data:image/png;base64,"+result.base64Img+")");
			$(".meal_pic_img").show();
			$("#mealDtlsList").empty();
			$("#mealDtlsList").closest(".input_warp").show();
			
			var totKcal = 0;
			for(var i in foodLensList){
				var li = $('<li><span>' + foodLensList[i].FOOD_NM + '</span> <span>' + Number(foodLensList[i].KCAL) + 'kcal <button class="delMealDtlsBtn"><em>삭제</em></button> </span></li>');
				$("#mealDtlsList").append(li);
				totKcal += Number(foodLensList[i].KCAL);
			}
			
			$("#mealDtlsList").prepend('<li data-role="list-divider" class="meal_kcal">' + totKcal + 'kcal</li>');
			$("#mealDtlsList").listview().listview("refresh");
		}
	});
}

// 음식 상세 삭제 버튼 클릭 이벤트
$(document).on("click", ".delMealDtlsBtn", function(){
	$(this).closest("li").remove();
	for(var i in foodLensList){
		if(foodLensList[i].FOOD_NM == $(this).parent().prev().text()){
			foodLensList.splice(i, 1);
		}
	}
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
	
	foodLensList.push(selFoodInfo);
	
	var li = $('<li><span>' + selFoodInfo.FOOD_NM + '</span> <span>' + selFoodInfo.KCAL + 'kcal <button class="delMealDtlsBtn"><em>삭제</em></button> </span></li>');
	$("#mealDtlsList").append(li);
	$("#mealDtlsList").listview().listview("refresh");
	
	$.mobile.changePage("#main");
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
