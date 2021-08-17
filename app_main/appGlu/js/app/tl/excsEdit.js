
var userId;
var excsRecSn;

$(document).ready(function(){
	var req = new Request();
	userId = sessionStorage.getItem("USER_ID");
	excsRecSn = req.getParameter("excsRecSn");
	selectExcsRec();
});
$(document).on("pagebeforeshow",function(){
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
});
// 저장 버튼 클릭 이벤트
$("#saveBtn").on("click", function(){
	var isEffect= modifExcsEft();
	if(isEffect){
		var updateParam = {
				  SESS_USER_ID 		: userId
				, EXCS_REC_SN		: excsRecSn
				, EXCS_CD			: $("#excsCd").val()
				, EXCS_DE			: $("#excsDe").val().replace(/-/g, "")
				, EXCS_BGN_TM		: $("#excsBgnTm").val().replace(/:/g, "") + "00"
				, EXCS_TM			: $("#excsTm").val()
		}
		
		cmmnAjax("appGlu/tl/updateExcsRec.do", updateParam, function (result){
			if(result.chkYn == "Y"){
				location.href = "./excsDetail.html?excsRecSn="+excsRecSn;
			}
	    });
	}
});

//수정 입력 조건시 공란 확인
function modifExcsEft(){
	var excsCd = isNullToString($("#excsCd").val());
	var excsDe = isNullToString($("#excsDe").val());
	var excsBgnTm = isNullToString($("#excsBgnTm").val());
	var excsTm = isNullToString($("#excsTm").val());
	if(excsCd==""){
		alert('운동명을 입력해 주세요.');
		return false;
	}else if(excsDe==""){
		alert('날짜를 입력해 주세요.');
		return false;
	}else if(excsBgnTm==""){
		alert('운동시간을 입력해 주세요.');
		return false;
	}else if(excsTm==""){
		alert('운동시간을 입력해 주세요');
		return false;
	}
	return true;
}

// 혈당 상세 조회
function selectExcsRec(){
	cmmnAjax("appGlu/tl/selectExcsRec.do", {SESS_USER_ID:userId, EXCS_REC_SN:excsRecSn}, function (data){
		selectExcsRecCallback(data);
    });
}

// 혈당 상세 조회 콜백
function selectExcsRecCallback(data){
	if(!isNull(data)){
		var excsDeVal = data.EXCS_DE.substring(0,4) + "-" + data.EXCS_DE.substring(4,6) + "-" + data.EXCS_DE.substring(6,8);
		var excsBgnTmVal = data.EXCS_BGN_TM.substring(0,2) + ":" + data.EXCS_BGN_TM.substring(2,4);
				
		$("#excsDe").val(excsDeVal);
		$("#excsBgnTm").val(excsBgnTmVal);
		$("#excsCd").val(data.EXCS_CD);
		$("#excsNm").val(data.EXCS_NM);
		$("#excsTm").val(data.EXCS_TM);
	}
}

var excsList;
var excsFavListStr = "";
//운동검색 버튼 클릭 이벤트
$("#excsSchBtn").on("click", function(){
//	cmmnAjax("appGlu/tl/selectExcsSchList.do", {SCH_EXCS_NM:""}, function (data){
//		if(!isNull(bridge)){
//			jappinf.getAppPref("excsFavListStr", function(resultCode, resultData){
//				if(resultCode == RESULTCODE.SUCC){
//					excsFavListStr = resultData.excsFavListStr;
//				}
//				
//				$("#excsSearchList").empty();
//				if(!isNull(data.excsList)){
//					excsList = data.excsList;
//					setExcsList(excsList, "");
//				}
//				
//				$.mobile.changePage("#exe_search");
//			});
//		}else{
//			$("#excsSearchList").empty();
//			if(!isNull(data.excsList)){
//				excsList = data.excsList;
//				setExcsList(excsList, "");
//			}
//			
//		}
//	});
	$.mobile.changePage("#ext_search");
});

//운동이름 입력 이벤트
$("#excsSchTxt").on("input", function(){
	if(!isNull(excsList)){
		setExcsList(excsList, $(this).val());
	}
});
// 운동이름 x 버튼 클릭 이벤트
$(document).on("click", ".exe_search_wrap .ui-input-clear", function(){
	setExcsList(excsList, "");
});

//운동 선택 이벤트
$(document).on("click", "#excsSearchList li a.excsNm", function(){
	var excsCd = $(this).parent().data("EXCS_CD");
	var excsNm = $(this).parent().data("EXCS_NM");
	
	$("#excsCd").val(excsCd);
	$("#excsNm").val(excsNm);
	
	$.mobile.changePage("#ext_edit");
});

//즐겨찾기 버튼 클릭 이벤트
$(document).on("click", "#excsSearchList li a.favBtn", function(){
	var excsCd = $(this).parent().data("EXCS_CD");
	var excsNm = $(this).parent().data("EXCS_NM");
	
	console.log("excsCd : " + "|" + excsCd + "|");
	
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

// 운동목록 세팅
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
	$("#excsSearchList").listview().listview("refresh");
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

/**가상 키보드 화면 간섭방지 (김태일)**/
var originalSize = jQuery(window).height();
jQuery(window).resize(function() {
    if(jQuery(window).height() != originalSize) {
    	$('#excs_search').removeClass('btn_wrap');
    	$('#excs_search').css({"margin-top":"5em"});
    }
    else {
    	$('#excs_search').addClass('btn_wrap');
    	$('#excs_search').css({"margin-top":"0em"});
    }
  });
/**가상 키보드 화면 간섭방지 (김태일)**/