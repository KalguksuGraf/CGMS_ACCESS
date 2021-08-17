
var userId;
var drugTakngDe;
var drugTakngTm;

var editMediLi;

$(document).ready(function(){
	var req = new Request();
	userId = sessionStorage.getItem("USER_ID");
	drugTakngDe = req.getParameter("drugTakngDe");
	drugTakngTm = req.getParameter("drugTakngTm");
	selectDrugTakng();
});

// 저장 버튼 클릭 이벤트
$("#saveBtn").on("click", function(){
	
	var drugNmArr = "";
	var drugTakngQyArr = "";
	var drugTakngUnitArr = "";
	var setItemArr = "";
	
	$("#drugTakngListView li").each(function(){
		if($(this).find("input[type='checkbox']").prop("checked")){
			if(drugNmArr.length > 0){
				drugNmArr += "|";
				drugTakngQyArr += "|"; 
				drugTakngUnitArr += "|";
				setItemArr += "|";
			}
			drugNmArr += $(this).find("h3").text();
			drugTakngQyArr += $(this).find("p:eq(0)").text();
			drugTakngUnitArr += $(this).find("p:eq(1)").text();
			setItemArr += $(this).data("SET_ITEM");
		}
	});
	
	var updateParam = {
			  SESS_USER_ID 		: userId
			, ORG_DRUG_TAKNG_DE	: drugTakngDe
			, ORG_DRUG_TAKNG_TM : drugTakngTm
			, DRUG_TAKNG_DE		: $("#drugTakngDe").val().replace(/-/g, "")
			, DRUG_TAKNG_TM		: $("#drugTakngTm").val().replace(/:/g, "") + "00"
			, DRUG_NM_ARR		: drugNmArr
			, DRUG_TAKNG_QY_ARR	: drugTakngQyArr
			, DRUG_TAKNG_UNIT_ARR : drugTakngUnitArr
			, SET_ITEM_ARR		: setItemArr
	}

	cmmnAjax("appGlu/tl/updateDrugTakng.do", updateParam, function (result){
		if(result.chkYn == 'Y'){
			location.href = "./drugTakngDetail.html?drugTakngDe="+result.DRUG_TAKNG_DE+"&drugTakngTm="+result.DRUG_TAKNG_TM;
		}
    });
});

// 복약 상세 조회
function selectDrugTakng(){
	cmmnAjax("appGlu/tl/selectDrugTakng.do", {SESS_USER_ID:userId, DRUG_TAKNG_DE:drugTakngDe, DRUG_TAKNG_TM:drugTakngTm}, function (data){
		selectDrugTakngCallback(data);
    });
}

// 복약 상세 조회 콜백
function selectDrugTakngCallback(data){
	if(!isNull(data.rsList)){
		$("#drugTakngListView").empty();
		
		var rsList = data.rsList;
		var setList = data.setList;
		
		var DrugTakngDeVal = rsList[0].DRUG_TAKNG_DE.substring(0,4) + "-" + rsList[0].DRUG_TAKNG_DE.substring(4,6) + "-" + rsList[0].DRUG_TAKNG_DE.substring(6,8);
		var DrugTakngTmVal = rsList[0].DRUG_TAKNG_TM.substring(0,2) + ":" + rsList[0].DRUG_TAKNG_TM.substring(2,4);
		
		$("#drugTakngDe").val(DrugTakngDeVal);
		$("#drugTakngTm").val(DrugTakngTmVal);
		
		var sb = new StringBuffer();
		for(var i in setList){			
			var value = setList[i].SET_VAL.split('^');
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
						+'<input type="hidden" name="SET_VAL" value="'+setList[i].SET_VAL+'">'
						+'<h3>'+value[0]+'</h3>'
						+'<p>'+value[1]+'</p><p>'+value[2]+'</p>'
						+'</span>'
						+'</div>'
						+'</li>').data("SET_ITEM", setList[i].SET_ITEM);
			
			for(var j in rsList){
				if(setList[i].SET_ITEM == rsList[j].SET_ITEM){
					li.find("input:checkbox").prop("checked", true);
				}
			}
			
			$("#drugTakngListView").append(li);
		}
		
		$("#drugTakngListView").trigger("create");
		
		$("#drugTakngListView").on("click", "span.bo_tit", function(){
			editMediLi = $(this).closest("li");
			
			var setItem = editMediLi.data("SET_ITEM");
			var setVal = $(this).find("input[name='SET_VAL']").val().split("^");
			$("#input_takeMedi input.setItem").val(setItem);
			for(var i in setVal){
				$("#input_takeMedi input:eq(" + (Number(i) + 1) + ")").val(setVal[i]);
			}
			
			$("#input_takeMedi").panel("open");
		});
	}
}

// 복약 등록 버튼 클릭 이벤트
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
	
	param['SET_VAL'] = setVal;
	
	cmmnAjax("appGlu/tl/insertDrugUserSet.do", param, function (result){
		if(result.chkYn == 'Y'){
			alert('저장이 완료되었습니다.');
			selectDrugTakng();
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
			selectDrugTakng();
			$('#input_takeMedi').panel("close");
		}
    });
});

//약 등록 패널 열기 이벤트
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