
var userId;
var symptmsDe;
var symptmsSn;

$(document).ready(function(){
	var req = new Request();
	userId = sessionStorage.getItem("USER_ID");
	symptmsDe = req.getParameter("symptmsDe");
	symptmsSn = req.getParameter("symptmsSn");
	selectSymptms();
});

// 증상 선택 이벤트
$("a[class^='symptmsSel']").on("click", function(){
	if($(this).hasClass("on")){
		$(this).removeClass("on");
		if($(this).hasClass("symptmsSel08")){
			$(".symptms09TxtCls").hide();
		}
	}else{
		$(this).addClass("on");
		if($(this).hasClass("symptmsSel08")){
			$(".symptms09TxtCls").show();
		}
	}
});

// 저장 버튼 클릭 이벤트
$("#saveBtn").on("click", function(){
	
	var arrIdx = 1;
	var symptmsClf = "";
	var symptmsCn = "";
	$("a[class^='symptmsSel']").each(function(){
		if($(this).hasClass("on")){
			if(symptmsClf.length > 0){
				symptmsClf += ",0" + (arrIdx-1);
			}else{
				symptmsClf += "0" + (arrIdx-1);
			}
			
			if(arrIdx == 9){
				symptmsCn = $("#symptmsCn").val();
			}
		}
		arrIdx++;
	});
	
	var updateParam = {
			  SESS_USER_ID 		: userId
			, SYMPTMS_DE		: symptmsDe
			, SYMPTMS_SN		: symptmsSn
			, UPD_SYMPTMS_DE 	: $("#symptmsDe").val().replace(/-/g, "")
			, UPD_SYMPTMS_TM	: $("#symptmsTm").val().replace(/:/g, "") + "00"
			, SYMPTMS_CLF_ARR	: symptmsClf
			, SYMPTMS_CN		: symptmsCn
	}
	
	cmmnAjax("appGlu/tl/updateSymptms.do", updateParam, function (result){
		if(result.chkYn == 'Y'){
			location.href = "./symptmsDetail.html?symptmsDe="+result.SYMPTMS_DE+"&symptmsSn="+result.SYMPTMS_SN
		}
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
		var symptmsDeVal = data.SYMPTMS_DE.substring(0,4) + "-" + data.SYMPTMS_DE.substring(4,6) + "-" + data.SYMPTMS_DE.substring(6,8);
		var symptmsTmVal = data.SYMPTMS_TM.substring(0,2) + ":" + data.SYMPTMS_TM.substring(2,4);
		
		$("#symptmsDe").val(symptmsDeVal);
		$("#symptmsTm").val(symptmsTmVal);
		
		if(!isNull(data.SYMPTMS_CLF_ARR)){			
			var symptmsClfArr = data.SYMPTMS_CLF_ARR.split(",");
			for(var i in symptmsClfArr){
				$(".symptmsSel" + symptmsClfArr[i]).addClass("on");
				
				if(symptmsClfArr[i] == "09"){
					$(".symptms09TxtCls").show();
					$("#symptmsCn").text(data.SYMPTMS_CN);
				}
			}
		}
	}
}

/**TimePicker 추가 input time타입 readonly처리해야함 (김태일)**/
var registTimeId = '';
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
/**TimePicker 추가 (김태일)**/