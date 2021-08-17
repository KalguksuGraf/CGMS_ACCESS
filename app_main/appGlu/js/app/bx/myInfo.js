var sessUserId = sessionStorage.getItem("USER_ID");

$(document).ready(function(){
	myInfoInit();
});

function myInfoInit(){
    cmmnAjax("appGlu/bx/selectUserInfo.do", {SESS_USER_ID:sessUserId}, function (data){
    	myInfoCallback(data);
    });	
}

function myInfoCallback(data){
	if (isNullToString(data.infoMap) != "") {
		var infoMap = data.infoMap;
		
		$("#myInfoUserNm").text(infoMap.USER_NM);	
		$("#myInfoBirth").text(infoMap.BIRTH + " 년");
		$("#myInfoGender").text(infoMap.GENDER_NM);
		$("#myInfoHeight").text(infoMap.HEIGHT + " cm");	
		$("#myInfoWeight").text(infoMap.WEIGHT + " kg");
		
		$("#editUserNm").val(infoMap.USER_NM);	
		$("#editBirth").val(infoMap.BIRTH);
		$("#editGender").val(infoMap.GENDER_NM);
		$("#editHeight").val(infoMap.HEIGHT);	
		$("#editWeight").val(infoMap.WEIGHT);
		$("#editWeight").val(infoMap.WEIGHT);				
		$("input[name=editGender][value=" + infoMap.GENDER + "]").prop('checked', 'checked');
	
		if(infoMap.ATTCH_FILE_SN != null){
			var imgUrl = ABSOLUTE_URL + 'common/attchFileDownload.do?attchFileSn='+infoMap.ATTCH_FILE_SN+'&attchFileDtlsSn='+infoMap.ATTCH_FILE_DTLS_SN;
			$("#profilePic").removeClass("noprofile");
			$("#profilePic").css("background-image","url("+imgUrl+")");			
		}else{
			$("#profilePic").addClass("noprofile");
			$("#profilePic").css("background-image","");		
		}
	
	}
}

function myInfoSaveConfirm(){
	if(isNullToString($("#editUserNm").val())==""){
		alert("별명 선택해 주세요",function(){});
		$("#editUserNm").focus();			
		return false;
	}else if(isNullToString($("#editBirth").val())==""){
		alert("출생년도 입력해주세요",function(){});
		$("#editBirth").focus();			
		return false;
	}else if(isNullToString($("#editHeight").val())==""){
		alert("키를 입력해주세요",function(){});
		$("#editHeight").focus();			
		return false;
	}else if(isNullToString($("#editWeight").val())==""){
		alert("체중을 입력해주세요",function(){});
		$("#editWeight").focus();			
		return false;		
	}else{
		$("#myInfoSavePopup").popup("open");				
	}	
}

function myInfoSave(){
	var param = {};	
	
	param['SESS_USER_ID']	= sessUserId;	
	param['USER_NM']    	= $("#editUserNm").val();	
	param['GENDER'] 	    = $('input:radio[name="editGender"]:checked').val();		
	param['BIRTH'] 	    	= $("#editBirth").val();
	param['HEIGHT'] 	    = $("#editHeight").val();
	param['WEIGHT'] 	    = $("#editWeight").val();

	
	cmmnAjax('appGlu/bx/updateUserInfo.do',param,function(result){
	    if(result.chkYn=='Y'){
		    cmmnAjax("appGlu/bx/selectUserInfo.do", {SESS_USER_ID:sessUserId}, myInfoSaveCallBack);
        }else{

        }
	});
}


function myInfoSaveCallBack(data){

    var sessionUserInfo = {};
   
    sessionUserInfo.USER_ID 	 = data.infoMap.USER_ID;
    sessionUserInfo.USER_NM 	 = data.infoMap.USER_NM;
    sessionUserInfo.PW           = data.infoMap.PW
    sessionUserInfo.BIRTH   	 = data.infoMap.BIRTHDAY;
    sessionUserInfo.USER_AGE   	 = data.infoMap.USER_AGE;
    sessionUserInfo.EMAIL   	 = data.infoMap.EMAIL;    
    sessionUserInfo.GENDER  	 = data.infoMap.GENDER;
    sessionUserInfo.WEIGHT  	 = data.infoMap.WEIGHT;
    sessionUserInfo.HEIGHT  	 = data.infoMap.HEIGHT;
    sessionUserInfo.LOGIN_TYPE 	 = data.infoMap.LOGIN_TYPE;
    sessionUserInfo.ORG_CD		 = data.infoMap.ORG_CD;
    
//    sessionStorage.setItem("USER_ID", data.infoMap.USER_ID);
//	sessionStorage.setItem("LOGIN_TYPE", data.infoMap.LOGIN_TYPE);
    
    Object.keys(sessionUserInfo).forEach(function(key){
		sessionStorage.setItem(key, sessionUserInfo[key]);
	});
	
    location.href = "#";        	
    myInfoInit();
}

$(document).on("change", "#uploadUserInfoPic", function(e) {
	readURL(this);
	
	/*
	
	var image = e.target.files[0];

	if (window.File && window.FileReader && window.FileList && window.Blob) {
		$("#attchFileYn").val("Y");

        var reader = new FileReader();
        // Closure to capture the file information.
        reader.addEventListener("load", function (e) {
            var imageData = e.target.result;
            var imageElement = document.createElement("img");
            
            
            imageElement.setAttribute("src", imageData);
            //document.getElementById("container1").appendChild(imageElement);
            window.loadImage(imageData, function (img) {
            	var convertImg = setImagePreview(img);
            	pictureSuccess(convertImg);

            });
        });
        reader.readAsDataURL(image);	
	}else{
	}
	*/
});

function readURL(input) {
	if (input.files && input.files[0]) {
		$("#attchFileYn").val("Y");
		
		$(".pic_box").empty();
		$(".pic_box").css("display", "block");
		var sbf = new StringBuffer();
		var reader = new FileReader();
		reader.readAsDataURL(input.files[0]);		
		
		reader.onload = function (e) {		
			sbf.append('<div id="mealRecFoodPic" style="background-image:url('+e.target.result+');"></div>');
			sbf.append('<a href="#" class="pic_box_delete ui-link" onClick="deleteImgFile()">사진 삭제</a>');
			$(".pic_box").append(sbf.toString());			
		}
		pictureSuccess(input.files[0]);
	}
}

//이미지 선택시 바로 저장
function pictureSuccess(dataURL){
	if(dataURL != null){
		var afn = profileAttchFileUpload();	
		var param = { SESS_USER_ID	:sessUserId
				    , ATTCH_FILE_SN :$("#attchFileSn").val()
					};

		cmmnAjax('appGlu/bx/updateUserInfoPic.do',param,function(result){
			var updateMsg = "저장되었습니다.";
			
		    if(result.chkYn=='Y'){
	            alert(updateMsg,function(){});
	            myInfoInit();
	        }else{
	        	alert("저장실패하였습니다.\n입력값을 확인해주세요.",function(){});
	        }
		});

		
		$("#profilePic").removeClass("noprofile");
		$("#profilePic").css("background-image","url("+dataURL+")");
	}
}

//이미지 파일 등록
function profileAttchFileUpload(){
	var form = new FormData();

	form.append("attchFileSn",$("#attchFileSn").val());
	form.append("attchFileDel",$("#attchFileDtlsSn").val());
	form.append("attchFileSn0",$("#uploadUserInfoPic")[0].files[0]);

	$.ajax({
		async:false,
		url: ABSOLUTE_URL + "common/attchFileUpload.do",
		data: form,
 		dataType: 'JSON',
		processData: false,
		contentType: false,
		type: 'POST',
		success: function (response) {
			
			$("#attchFileSn").val(response.attchFileSn);
		},
		error: function (jqXHR) {
			console.log('error');
		}
	});

	return attchFileSn;	
}
