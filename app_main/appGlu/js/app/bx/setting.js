
var userId = "";		// 사용자 ID
var selfMeasrClf = ""; 	// 자체활동량 사용유무 변수
var equipClf = "";

$(document).ready(function(){
	userId = sessionStorage.getItem("USER_ID");
	settingInit();
});

function settingInit(){
    cmmnAjax("appGlu/bx/selectUserInfo.do", {SESS_USER_ID:userId}, function (data){
    	settingCallback(data);
    });
    
    jappinf.getSessionUserInfo(function(resultCd,result){
    	appVersion = result.APP_VERSION;
    	osVersion = result.OS_VERSION;

    	if(appVersion != undefined && appVersion != null ){
    		$('#setAppInfo').html(appVersion);
    	}
    
    // 자체활동량 사용유무 가져오기
	jappinf.getAppPref("SELFMEASRSET_YN_"+userId, function(resultCd, result){
		if(resultCd==RESULTCODE.SUCC){
			var key = Object.keys(result);
			var getPref = result[key[0]];
			selfMeasrClf = getPref;
			
			if(isNullToString(selfMeasrClf) == "Y"){
				$("#selfMeasrSttus").text("켜짐");
			}else{
				$("#selfMeasrSttus").text("꺼짐");
			}
		}
	});
  });
}

function settingCallback(data){
	if (isNullToString(data.infoMap) != "") {
		var setMap = data.infoMap;

		if(setMap.LOGIN_TYPE == "EMAIL"){
			$("#setLoginInfo").text(setMap.EMAIL);	
			$("#setPwChgChk").removeClass("hidden");
		}else{				
			if(setMap.SNS_TYPE=="NAVER"){
				$("#setLoginInfo").html('<h1 class="list_icon id_naver">'+setMap.EMAIL+'</h1>');		
			}else if(setMap.SNS_TYPE=="KAKAO"){
				  if(setMap.EMAIL == null || setMap.EMAIL == "" || setMap.EMAIL=="null"){
						$("#setLoginInfo").html('<h1 class="list_icon id_kakao" style="height:19px;"></h1>');
				  }else{
					  $("#setLoginInfo").html('<h1 class="list_icon id_kakao">'+setMap.EMAIL+'</h1>');		
				  }
			}			
			$("#setPwChgChk").addClass("hidden");
		}		
        $("#pushSetSelect").val(setMap.PUSH_NOTICE_SET_YN == "Y" ? "on" : "off");
		try{$('#pushSetSelect').slider("refresh");}catch(err){}

	}	
}



// 비밀번호 저장 확인
function pwSaveConfirm(){
	if(isNullToString($("#prePwTxt").val()) == ""){
		alert("현재 비밀번호를 입력해주세요");
		$("#prePwTxt").focus();
		return;
	}else if(isNullToString($("#newPwTxt").val()) == ""){
		alert("새 비밀번호를 입력해주세요");
		$("#newPwTxt").focus();
		return;
	}else if($("#newPwTxt").val().length < 8){
		alert("새 비밀번호는 8이상으로 설정해주세요.");
		$("#newPwTxt").focus();
		return;
	}else if(isNullToString($("#newPwTxtConfirm").val()) == ""){
		alert("새 비밀번호 확인을 입력해주세요");
		$("#newPwTxtConfirm").focus();
		return;
	}else if($("#newPwTxt").val() !=  $("#newPwTxtConfirm").val()){
		alert("새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.");
		$("#newPwTxtConfirm").focus();
		return;
	}else{
		var param = {};	
		//세션값으로 변경
		param['SESS_USER_ID'] = sessUserId;
		param['CUR_PW']       = $("#prePwTxt").val();
		param['NEW_PW']       = $('#newPwTxt').val();		

		cmmnAjax("appGlu/bx/updateUserInfoPwd.do", param, pwUpdateCallBack);
	}		
}

//비밀번호 변경 완료후
function pwUpdateCallBack(data){

	if(data.chkYn == 'Y'){
		alert("비밀번호가 변경되었습니다. 변경된 비밀번호로 로그인 해주세요.");
		logout();
	}else{
		if(data.mainMap.mainMap.chkUserPw == "false"){
			alert("현재 비밀번호를 확인해주세요");
			$("#prePwTxt").val("");
			$("#prePwTxt").focus();	
		}else{
			alert("새로운 비밀번호 저장에 실패하였습니다.");
			$("#prePwTxt").val("");
			$("#newPwTxt").val("");
			$("#newPwTxtConfirm").val("");			
			$("#prePwTxt").focus();		
		}		

	}
	
}

// 푸시 설정
function updatePushSetYn(objTag){
	cmmnAjax('appGlu/bx/updateUserInfoPushSet.do', { SESS_USER_ID:sessUserId, PUSH_NOTICE_SET_YN:objTag.value=='on' ? "Y" : "N" } ,function(result){
        location.href = "#mybox_setting";        	
        settingInit();
	});
}


// 로그아웃 버튼 클릭 시
function btnLogoutConfirm(){
	$("#logoutConfirmPopup").popup();
	$("#logoutConfirmPopup").popup('open');
}
// 로그아웃
function logout(){	
	sessionStorage.clear();	
	if(!isNull(bridge)){
		jappinf.logout(function(resultCd,result){	
			if(resultCd == RESULTCODE.SUCC){	
				//alert("로그아웃 되었습니다.");	
				location.href = "../us/login.html";	
			}	
		});
	}else{
		location.href = "../us/login.html";	
	}
}

// 자체활동량 설정 페이지 들어가기
$(document).on("click", ".setSelfMeasr", function(){
	jappinf.getAppPref("SELFMEASRSET_YN_"+userId, function(resultCd, result){
		if(resultCd==RESULTCODE.SUCC){
			var key = Object.keys(result);
			var getPref = result[key[0]];
			selfMeasrClf = getPref;
			setSelfMeasrSetting(selfMeasrClf);
			cmmnAjax("appGlu/ms/selectSelfmeasrCnfm.do", { SESS_USER_ID: userId }, function (data){
				console.log("XXX??" + data.chkYn);
				if(data.chkYn == "Y"){
					
					var clf = isNullToString(data.smMap.SELFMEASR_CLF);
					if(isNullToString(clf) == "-1" || isNullToString(clf) == "0"){
						if($("#selfMeasr_agrePage").length < 1){
							$("#mybox_setting").last().after('<div data-role="page" id="selfMeasr_agrePage"></div>');
						}
						cmmnAjax('appGlu/page/cm/selfMeasr_agrePage.html', null, function(data){
							if(data != null){
								$("#selfMeasr_agrePage").html(data);
							}
							console.log("XXXX??? oko11115 ");
							$.mobile.changePage("#selfMeasr_agrePage");
						}, {'sDataType':'html'});
					}else{
						console.log("XXXX??? okok55555 ");
						$.mobile.changePage("#setSelfMeasrPage");
					}
				}
			});
		}
	});
});

//자체활동량 설정에 따른 화면 변경
function setSelfMeasrSetting(selfMeasrClf_){
	$("#selfMeasrSttus").text(selfMeasrClf_ == "Y" ? "켜짐" : "꺼짐");
	$("#useSttus").text(selfMeasrClf_ == "Y" ? "걸음수 측정 사용중" : "걸음수 측정 미사용중");
	$("#setSelfMeasrBtn").find('a').text(selfMeasrClf_ == "Y" ? "걸음수 측정 해제" : "걸음수 측정 사용");
}

//자체활동량 ON/OFF
$(document).on("click", "#setSelfMeasrBtn", function(){
	var param = {};
	
	if(selfMeasrClf == "Y"){	// 측정 해제
		jappinf.unbind("SELFMEASR", function(resultCd,result){
			if(resultCd==RESULTCODE.SUCC){
				
				jappinf.getAppPref("SELFMEASRSET_YN_"+userId, function(resultCd, result){
					if(resultCd==RESULTCODE.SUCC){
						var key = Object.keys(result);
						var getPref = result[key[0]];
						selfMeasrClf = getPref;
						
						setSelfMeasrSetting(selfMeasrClf);
						cmmnAjax("../../app/st/updateMainItemSet.do"
								, { EQUIP_CLF : '10', ITEM_CLF : '1030', SELFMEASR_CLF : selfMeasrClf }
								, function(){}
								, { "bAsync" : false }
						);
						
						alert("걸음수 측정이 해제되었습니다");
					}
				});
			}
		});
	}else{
		cmmnAjax("../../app/st/updateMainItemSet.do", { EQUIP_CLF : '10', ITEM_CLF : '1020', SELFMEASR_CLF : 'Y' }, function(){
			setSelfMeasrSetting(selfMeasrClf);
			console.log("걸음수 측정이 설정되었습니다A");
			deviceutil.pairSelfMeasr();
		});
	}
});

/** **********************
 * 자체활동량 관련 기능
 * ********************** */

//자체활동량 사용 동의
$(document).on("click", "#selfMeasr_agrePage .btn_block_box", function(){
	console.log("111 btn_block_box clicked!!");
	var href = location.href;

	if(equipClf.indexOf("10") != -1){
		alert("스마트 밴드를 먼저 해제하십시오.");
		return;
	}
	
	deviceutil.pairSelfMeasr();
});


