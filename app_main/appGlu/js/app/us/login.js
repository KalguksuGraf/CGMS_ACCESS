var linkPage = "../../page/mn/dashboard.html";
var snsType;
var loginType;
var exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

var sessUserId = "";
var sessLoginType = "";
var sessPw = "";

$(document).ready(function() {
	localStorage.removeItem("curDe");
	adminAutoLogin();
	//세션정보 가져오기
	jappinf.getSessionUserInfo(function(resultCd,result){
		if(result != null){
			var paramEmail      = result.EMAIL;
			var paramLoginType  = result.LOGIN_TYPE;
			var paramPw         = result.PW;
			var paramSaveUserId = result.SAVE_USER_ID;
			var paramAutoLogin  = result.AUTO_LOGIN;
			var paramSnsType    = result.SNS_TYPE;
//			alert(JSON.stringify(result));
			
			if(paramLoginType == "EMAIL"){
				if(paramSaveUserId == "Y"){
					$("#loginEmail").val(paramEmail);
					$("#saveUserID").prop('checked', 'checked').checkboxradio('refresh');
				}
				if(paramAutoLogin == "Y"){
					$("#loginEmail").val(paramEmail);
					$("#loginPw").val(paramPw); 
					$("#autoLogin").prop('checked', 'checked');  	
					$("#saveUserID").prop('checked', 'checked').checkboxradio('refresh');
					emailLoginEvnet();
				}
			}else{
				if(paramAutoLogin == "Y"){
					$("#autoLogin").prop('checked', 'checked').checkboxradio('refresh');  	
					if(paramSnsType == "NAVER"){
						naverInit();
					}else{
						kakaoInit();
					}
				}
			}	
		}else{
			jappinf.getAppPref('email', function(resultCd, result){
				var key = Object.keys(result);
				if(resultCd==RESULTCODE.SUCC){
					console.log('getAppPref for email success')
					var getPref = result[key[0]];
					console.log('RESULT::: '+JSON.stringify(result));
					console.log('getPref::: '+getPref);
					if(getPref.length > 0){
						$("#loginEmail").val(getPref);
						$("#saveUserID").prop('checked', 'checked').checkboxradio('refresh');
					}
				}
			});
		}

	});	
	
});

function adminAutoLogin(){
	jappinf.getAppPref('ADMINEMAIL,ADMINPW', function(resultCd, result){
		if(resultCd==RESULTCODE.SUCC){
			console.log('getAppPref for email success')
			console.log( result.ADMINEMAIL+" "+result.ADMINPW)
			if(isNullToString(result.ADMINEMAIL,"")!="" && isNullToString(result.ADMINEMAIL,"")!=""){
				$("#autoLogin").prop('checked', 'checked');  	
				$("#saveUserID").prop('checked', 'checked').checkboxradio('refresh');
				cmmnAjax('appGlu/us/selectUserById.do', {
					EMAIL : result.ADMINEMAIL,
					PW : result.ADMINPW
				}, selectUserByCallback);
			}
		}
	});
}

/*******************************************************************************
 * EMAIL로 로그인
 ******************************************************************************/

function emailLoginEvnet() {
	// 테스트용
	if (isNullToString($("#loginEmail").val()) == "kyu") {
		loginType = "EMAIL";
		cmmnAjax('appGlu/us/selectUserById.do', {
			EMAIL : "lhk4343@naver.com",
			PW : "1"
		}, selectUserByCallback);
		return;
	} else if (isNullToString($("#loginEmail").val()) == "jsy") {
		loginType = "EMAIL";
		cmmnAjax('appGlu/us/selectUserById.do', {
			EMAIL : "jkjk@naver.com",
			PW : "12345678"
		}, selectUserByCallback);
		return;
	}else if (isNullToString($("#loginEmail").val()) == "healthGlu" && isNullToString($("#loginPw").val()) == "sev") {
		loginType = "EMAIL";
		cmmnAjax('appGlu/us/selectUserById.do', {
			EMAIL : "healthGlu@sev.com",
			PW : "sev"
		}, selectUserByCallback);
		return;
	}

	// 유효성 검사
	if (isNullToString($("#loginEmail").val()) == "") {
		$("#emailLoginDesc").removeClass("hidden");
		$("#emailLoginDesc").text("이메일을 입력해주세요");
		$("#loginEmail").focus();
		return false;
	} else if (exptext.test($("#loginEmail").val()) == false) {
		$("#emailLoginDesc").removeClass("hidden");
		$("#emailLoginDesc").text("이메일형식이 올바르지 않습니다.");
		$("#loginEmail").focus();
		return false;
	} else if (isNullToString($("#loginPw").val()) == "") {
		$("#emailLoginDesc").removeClass("hidden");
		$("#emailLoginDesc").text("비밀번호를 입력해주세요");
		$("#loginPw").focus();
		return false;
	} else {
		loginType = "EMAIL";
		cmmnAjax('appGlu/us/selectUserById.do', {
			EMAIL : $("#loginEmail").val(),
			PW : $("#loginPw").val()
		}, selectUserByCallback);
	}
}

/*******************************************************************************
 * NAVER로 로그인
 ******************************************************************************/
$(document).on('click', '#naverIdLogin', function() {
	 joinFormClear();
	 naverInit();
});

function naverInit() {
	jappinf.getNaverUserInfo(function(resultCd, result) {
		if (resultCd == RESULTCODE.SUCC) {
			var snsId = result.id;
			var email = result.email;
			var snsType = "NAVER";
			var nickName = result.nickname;
			// var paramSnsType = result.SNS_TYPE;
			loginType = "SNS";

			$("#joinSnsType").val("NAVER");
			$("#joinSnsId").val(snsId);
			$("#joinSnsNm").val(nickName);
			$("#joinSnsEmail").val(email);
			cmmnAjax('appGlu/us/selectUserBySns.do', {
				SNS_ID : snsId,
				EMAIL : email,
				SNS_TYPE : snsType
			}, selectUserByCallback);
		} else {
			alert('로그인 실패하였습니다. 다시 시도해 주십시오.');
		}
	});
}

/*******************************************************************************
 * KAKAO로 로그인
 ******************************************************************************/
$(document).on('click', '#kakaoIdLogin', function() {
	 joinFormClear();	
	 kakaoInit();
});

function kakaoInit() {
	jappinf.getKakaoUserInfo(function(resultCd, result) {
		if (resultCd == RESULTCODE.SUCC) {
			var snsId = result.kakaoId;
			var email = result.kakaoEmail;
			var nickName = result.kakaoName;
			var snsType = "KAKAO";
			loginType = "SNS";
			$("#joinSnsType").val(snsType);
			$("#joinSnsId").val(snsId);
			$("#joinSnsNm").val(nickName);
			$("#joinSnsEmail").val(email);
			cmmnAjax('appGlu/us/selectUserBySns.do', {
				SNS_ID : snsId,
				EMAIL : email,
				SNS_TYPE : snsType
			}, selectUserByCallback);

		} else {
			alert('로그인 실패하였습니다. 다시 시도해 주십시오.');
		}
	});
}

/*******************************************************************************
 * 사용자 정보 조회(로그인 공통)
 ******************************************************************************/
function selectUserByCallback(data) {
	
	// SNS를 통한 로그인 시
	if (loginType == "SNS") {
		console.log("????? " + data.infoMap);
		if (isNullToString(data.infoMap) != "") {
			setSessionInfo(data);
		} else {
			$("#joinDiv").val("SNS");
			location.href = "./login.html#join9"
		}
		// 이메일을 통한 로그인 시
	} else {
		if (isNullToString(data.infoMap) != "") {
			if(isNullToString(data.infoMap.LOGIN_TYPE) == 'ADMIN'){
				setAdminSessionInfo(data);
			}else{				
				setSessionInfo(data);
			}
		} else {
			if ($("#emailLoginDesc").hasClass("hidden")) {
				$("#emailLoginDesc").removeClass("hidden");
			}
			$("#emailLoginDesc").text("계정을 찾을 수 없습니다");
			$("#loginPw").focus();
		}
	}
}

/*******************************************************************************
 * 사용자 가입 정보 입력 및 저장
 ******************************************************************************/
// 해당 클래스 항목 초기화
function joinInit() {
	location.href = "#";
	$(".dataInit").val("");
	joinFormClear();
}

// 이메일을 통한 회원가입
function chkJoinEmail() {
	var chkYn = "N";
	var chkEmail = $("#joinEmail").val();
	var chkPw = $("#joinPw").val();
	var cnfirmPw = $("#joinPwCnfirm").val();
	loginType = "EMAIL";

	if (chkYn == "N") {
		if (isNullToString(chkEmail) == "") {
			$("#descJoinChk").removeClass("hidden");
			$("#descJoinChk").text("이메일이 입력되지 않았습니다.");
			$("#joinEmail").focus();
			return false;
		} else if (exptext.test(chkEmail) == false) {
			$("#descJoinChk").removeClass("hidden");
			$("#descJoinChk").text("이메일형식이 올바르지 않습니다.");
			$("#joinEmail").focus();
			return false;
		} else if (isNullToString(chkPw) == "") {
			$("#descJoinChk").removeClass("hidden");
			$("#descJoinChk").text("비밀번호가 입력되지 않았습니다.");
			$("#joinPw").focus();
			return false;
		} else if (chkPw.length < 8) {
			$("#descJoinChk").removeClass("hidden");
			$("#descJoinChk").text("비밀번호는 8자리 이상으로 설정해주세요.");
			$("#joinPw").focus();
			return false;
		} else if (chkPw.replace(/ /gi, "") != chkPw) {
			$("#descJoinChk").removeClass("hidden");
			$("#descJoinChk").text("비밀번호는 공백을 포함할 수 없습니다.");
			$("#joinPw").focus();
			return false;
		} else if (chkPw != cnfirmPw) {
			$("#descJoinChk").removeClass("hidden");
			$("#descJoinChk").text("비밀번호가 일치하지 않습니다.");
			$("#joinPwCnfirm").focus();
			return false;
		} else {
			cmmnAjax('appGlu/us/selectNewIdDupChk.do', {
				EMAIL : chkEmail
			}, function(data) {
				if (data.chkNum > 0) {
					$("#descJoinChk").removeClass("hidden");
					$("#descJoinChk").text("이미 등록된 이메일 입니다.");
					$("#joinEmail").focus();
					return false;
				} else {
					$("#descJoinChk").addClass("hidden");
					$("#joinDiv").val("EMAIL");
					$("#joinEmailDesc").addClass("hidden");
					$("#btnChkJoinEmail").addClass("hidden");
					chkYn = "Y";
					location.href = "#join9";
				}
			});
		}
	} else {
		$("#joinDiv").val("EMAIL");
		location.href = "#join9";
	}
}

// 회원가입 부가 정보 유효성 검사
function joinComp() {
	var param = {};
	var saveUrl;
	var joinType = $("#joinDiv").val();
	var dupPass = false;

	
	if (joinType == "SNS") {
		param['TOKEN'] = $("#joinToken").val();
		param['SNS_TYPE'] = $("#joinSnsType").val();
		param['SNS_ID'] = $("#joinSnsId").val();
		param['SNS_NAME'] = $("#joinSnsNm").val();
		param['EMAIL'] = $("#joinSnsEmail").val();
		param['GENDER'] = $("#joinSnsGender").val();
		saveUrl = "appGlu/us/insertUserBySns.do";
			
		

	} else if (joinType == "EMAIL") {
		if (isNullToString($("#joinEmail").val()) == "") {
			$("#ms_skip").popup("close");
			alert("잘못된 접근입니다.\n이메일을 확인해 주십시오");
			return;
		} else if (isNullToString($("#joinPw").val()) == "") {
			$("#ms_skip").popup("close");
			alert("잘못된 접근입니다.\n비밀번호를 확인해 주십시오.");
			return;
		}

		param['EMAIL'] = $("#joinEmail").val();
		param['PW'] = $("#joinPw").val();
		saveUrl = "appGlu/us/insertUserById.do";

	} else {
		$("#ms_skip").popup("close");
		alert("잘못된 접근입니다.\n어플 종료 후 다시 시도해 주십시오.");
		return;
	}

	param['USER_NM'] = $("#joinNickNm").val();
	param['GENDER'] = $("input:radio[name='joinGender']:checked").val();
	param['BIRTH'] = $("#joinBirth").val().replace(/-/g, "");
	param['HEIGHT'] = $("#joinHeight").val();
	param['WEIGHT'] = $("#joinWeight").val();
	param['PROMO_CD'] = $("#joinPromoCd").val();
	param['LOGIN_TYPE'] = $("#joinDiv").val();
	param['FAV_CAT'] = $("input:radio[name='joinFavCat']:checked").val();
	param['FAV_CAT_RMK'] = isNullToString($('#favRmk').val());
	
	console.log("SDFDSFSFS1 ==== " + param['TOKEN']);
	console.log("SDFDSFSFS2222 ==== " + param['SNS_NAME']);
	console.log("SDFDSFSFS4444x ==== " + param['USER_NM']);
	console.log("SDFDSFSFS4444asdf ==== " + param['GENDER']);
	console.log("SDFDSFSFS4444bbd ==== " + param['BIRTH']);
	console.log("SDFDSFSFS4444434 ==== " + param['HEIGHT']);
	console.log("SDFDSFSFS4444ggdes ==== " + param['WEIGHT']);
	console.log("SDFDSFSFS4444asdvz ==== " + param['PROMO_CD']);
	console.log("SDFDSFSFS4444h4h4 ==== " + param['LOGIN_TYPE']);
	console.log("SDFDSFSFS4444nfnf ==== " + param['FAV_CAT']);
	
	

	cmmnAjax(saveUrl, param, function(result) {
		if (result.chkYn == 'Y') {
			if (loginType == "SNS") {
				cmmnAjax('appGlu/us/selectUserBySns.do', {
					SNS_ID : $("#joinSnsId").val(),
					EMAIL : $("#joinSnsEmail").val(),
					SNS_TYPE : $("#joinSnsType").val()
				}, confirmJoinInfo);
			} else {
				cmmnAjax('appGlu/us/selectUserById.do', {
					EMAIL : $("#joinEmail").val(),
					PW : $("#joinPw").val()
				}, confirmJoinInfo);
			}

		} else {
			alert("저장을 실패하였습니다.\n입력값을 확인해주세요.", function() {
			});
		}
	});
};

// 성별 선택 시 자동으로 다음 STEP로 이동
$('input[name="joinGender"]').on('click change', function(e) {
	location.href = "#join3";
});

$("#checkAll").click(function() {
	if ($("#checkAll").prop('checked')) {
		$('input[name="termCheckbox"]:checkbox').each(function() {
			$(this).prop('checked', true);
		});

	} else {
		$('input[name="termCheckbox"]:checkbox').each(function() {
			$(this).prop('checked', false);
		});
	}
	$('input[name="termCheckbox"]').checkboxradio("refresh");
});

$(document).on('change','input:radio[name="joinFavCat"]',function(){
	var favCd = $('input[name="joinFavCat"]:checked').val();
	$('#emptyExFavDcmf').addClass('hidden');
	if(favCd == "0099"){
		$('#favRmk').css({"display":"block"});
		$('#favRmk').focus();
	}else{
		$('#favRmk').val("");
		$('#favRmk').focusout();
		$('#favRmk').css({"display":"none"});
	}
});

// 계속버튼 클릭 시
$(document)
		.on(
				'click',
				'.nextStep',
				function() {
					var stepNo = $(this).parent().parent().parent().parent()
							.attr("id");
					var nextStepNo = $(this).parent().parent().parent()
							.parent().next().attr("id");
					var errorMsg = $("#" + stepNo).find(".join_desc1").text();
					var tmpGender = $("input:radio[name='joinGender']:checked")
							.val();
					var tmpFavCat = $("input:radio[name='joinFavCat']:checked")
							.val();

					$(".desc_error").addClass("hidden");

					if (stepNo == "join2") {
						// 성별 유효성 체크
						if (isNullToString(tmpGender) == "") {
							$("#" + stepNo).find(".desc_error").removeClass(
									"hidden");
							$("#" + stepNo).find(".desc_error").text(errorMsg);
							return false;
						} else {
							$("#" + stepNo).find(".desc_error").addClass(
									"hidden");
							location.href = "#" + nextStepNo;
						}
					} else if (stepNo == "join3") {
						// 별명 유효성 체크
						var joinNickNm = $("#joinNickNm").val();
						if (isNullToString(joinNickNm) == "") {
							$("#" + stepNo).find(".desc_error").removeClass(
									"hidden");
							$("#" + stepNo).find(".desc_error").text(errorMsg);
							$("#joinNickNm").focus();
							return false;
						} else if (joinNickNm.length < 2
								|| joinNickNm.length > 8) {
							$("#" + stepNo).find(".desc_error").removeClass(
									"hidden");
							$("#" + stepNo).find(".desc_error").text(
									"2~8자리로 입력하세요.");
							$("#joinNickNm").focus();
						} else {
							$("#" + stepNo).find(".desc_error").addClass(
									"hidden");
							location.href = "#" + nextStepNo;
						}
					} else if (stepNo == "join4") {
						// 출생년도 유효성 체크
						if (isNullToString($("#joinBirth").val()) == "") {
							$("#" + stepNo).find(".desc_error").removeClass(
									"hidden");
							$("#" + stepNo).find(".desc_error").text(errorMsg);
							$("#joinBirth").focus();
							return false;
						} else if (isNullToString($("#joinBirth").val()).length < 4) {
							$("#" + stepNo).find(".desc_error").removeClass(
									"hidden");
							$("#" + stepNo).find(".desc_error").text(
									errorMsg + ". (4자리)");
							$("#joinBirth").focus();
							return false;
						} else if (Number(isNullToString($("#joinBirth").val())) < 1900) {
							$("#" + stepNo).find(".desc_error").removeClass(
									"hidden");
							$("#" + stepNo).find(".desc_error").text(
									"출생년도를 확인해주세요");
							$("#joinBirth").focus();
							return false;
						} else {
							$("#" + stepNo).find(".desc_error").addClass(
									"hidden");
							location.href = "#" + nextStepNo;
						}
					} else if (stepNo == "join5") {
						// 키, 체중 유효성 체크
						if (isNullToString($("#joinHeight").val()) == "") {
							$("#" + stepNo).find(".desc_error").removeClass(
									"hidden");
							$("#" + stepNo).find(".desc_error").text(errorMsg);
							$("#joinHeight").focus();
							return false;
						} else if (isNullToString($("#joinWeight").val()) == "") {
							$("#" + stepNo).find(".desc_error").removeClass(
									"hidden");
							$("#" + stepNo).find(".desc_error").text(errorMsg);
							$("#joinWeight").focus();
							return false;
						} else if (Number(isNullToString($("#joinHeight").val())) <= 0) {
							$("#" + stepNo).find(".desc_error").removeClass(
									"hidden");
							$("#" + stepNo).find(".desc_error").text(
									"키와 체중의 값은 0보다 커야 합니다");
							$("#joinHeight").focus();
							return false;
						} else if (Number(isNullToString($("#joinWeight").val())) <= 0) {
							$("#" + stepNo).find(".desc_error").removeClass(
									"hidden");
							$("#" + stepNo).find(".desc_error").text(
									"키와 체중의 값은 0보다 커야 합니다");
							$("#joinWeight").focus();
							return false;
						} else {
							$("#" + stepNo).find(".desc_error").addClass(
									"hidden");
							location.href = "#join8";
						}
					} else if (stepNo == "join9") {
						var length = $('input:checkbox[name=termCheckbox]:checked').length;
						if (length < 2) {
							$("#" + stepNo).find(".desc_error").removeClass(
									"hidden");
							$("#" + stepNo).find(".desc_error").text(errorMsg);
							return false;
						} else {
							$("#" + stepNo).find(".desc_error").addClass(
									"hidden");
							location.href = "#join2";
						}
					} else if (stepNo == "join8") {
						var favRmk = $('#favRmk').val();
						if(isNullToString(tmpFavCat)=="0099"&&isNullToString(favRmk)==""){
							$('#favRmk').focus();
							$("#" + stepNo).find("#emptyExFavDcmf").removeClass(
							"hidden");
							return false;
						}
						if (isNullToString(tmpFavCat) == "") {
							$("#" + stepNo).find(".desc_error").removeClass(
									"hidden");
							$("#" + stepNo).find(".desc_error").text(errorMsg);
							return false;
						} else {
							// 이메일 중복 검사
							cmmnAjax('appGlu/us/selectNewIdDupChk.do', {
								EMAIL : $("#joinEmail").val()
							}, function(data) {
								if (data.chkNum > 0) {
									alert("이미 가입된 이메일입니다.");
								} else {
									$("#" + stepNo).find(".desc_error")
											.addClass("hidden");
									$("#ms_skip").popup("open");
								}
							});

						}
					}

				});

// 회원가입 완료 시
function confirmJoinInfo(data) {
	location.href = "#join7";

	if (data.infoMap.EMAIL == null || data.infoMap.EMAIL == ""
			|| data.infoMap.EMAIL == "null") {
		$("#confirmEmail").text("");
	} else {
		$("#confirmEmail").text(data.infoMap.EMAIL);
	}
	$("#confirmGender").text(data.infoMap.GENDER_NM);
	$("#confirmBirth").text(data.infoMap.BIRTH);
	$("#confirmUserNm").text(data.infoMap.USER_NM);
	$("#confirmFavCat").text(data.infoMap.FAV_CAT_NM);

	if (loginType == "EMAIL") {
		$("#confirmPw").text(data.infoMap.PW);
	} else {
		$("#confirmSnsId").text(data.infoMap.SNS_ID);
		$("#confirmSnsType").text(data.infoMap.SNS_TYPE);
	}

	$('#join7').data('sessionUserInfo', data.infoMap);

	var autoLogin = "N";
	var saveUserId = "N";

	if ($('#autoLogin').is(':checked')) {
		autoLogin = "Y";
	}
	if ($('#saveUserID').is(':checked')) {
		saveUserId = "Y";
	}

	var sessionUserInfo = {};
	sessionUserInfo.USER_ID = data.infoMap.USER_ID;
	sessionUserInfo.USER_NM = data.infoMap.USER_NM;
	sessionUserInfo.PW = data.infoMap.PW
	sessionUserInfo.BIRTH = data.infoMap.BIRTH;
	sessionUserInfo.USER_AGE = data.infoMap.USER_AGE;
	sessionUserInfo.EMAIL = data.infoMap.EMAIL;
	sessionUserInfo.GENDER = data.infoMap.GENDER;
	sessionUserInfo.WEIGHT = data.infoMap.WEIGHT;
	sessionUserInfo.HEIGHT = data.infoMap.HEIGHT;
	sessionUserInfo.LOGIN_TYPE = data.infoMap.LOGIN_TYPE;
	sessionUserInfo.AUTO_LOGIN = autoLogin;
	sessionUserInfo.SAVE_USER_ID = saveUserId;
	sessionUserInfo.SNS_ID = data.infoMap.SNS_ID;
	sessionUserInfo.SNS_TYPE = data.infoMap.SNS_TYPE;
	sessionUserInfo.ORG_CD = data.infoMap.ORG_CD;
	sessionUserInfo.TOKEN = data.infoMap.TOKEN;
	sessionUserInfo.ITEM2000 = data.infoMap.ITEM2000;
	sessionUserInfo.ITEM2201 = data.infoMap.ITEM2201;
	sessionUserInfo.ITEM2202 = data.infoMap.ITEM2202;
	sessionUserInfo.ITEM2203 = data.infoMap.ITEM2203;
	sessionUserInfo.ITEM2204 = data.infoMap.ITEM2204;
	sessionUserInfo.ITEM2205 = data.infoMap.ITEM2205;
	sessionUserInfo.ITEM2206 = data.infoMap.ITEM2206;
	sessionUserInfo.ITEM2207 = data.infoMap.ITEM2207;

//	sessionStorage.setItem("USER_ID", data.infoMap.USER_ID);
//	sessionStorage.setItem("LOGIN_TYPE", data.infoMap.LOGIN_TYPE);
	
	Object.keys(sessionUserInfo).forEach(function(key){
		sessionStorage.setItem(key, sessionUserInfo[key]);
	});
	
	if(jappinf.isNative()){
		jappinf.setSessionUserInfo(function(resultCd, result) {
			if (resultCd == RESULTCODE.SUCC) {
				if(result != null){
					cmmnAjax('/appGlu/us/updateUserMobileInfo.do', result, function(){});
				}
				console.log('sessionUserInfo save success');
				loginSettingPageNo();
				//location.href = "../mn/dashboard.html";

			} else {
				console.log('sessionUserInfo save fail');
			}
		}, sessionUserInfo);
		
	}else{
		//location.href = "../mn/dashboard.html";
	}

}

// 튜토리얼 페이지 이동
function callTutorial() {
	location.href = "#tutorial01";
}

// SNS 연동이 완료 되었을 경우, 세션정보 설정 및 화면 이동
function setSessionInfo(data) {
	var autoLogin = "N";
	var saveUserId = "N";

	if ($('#autoLogin').is(':checked')) {
		autoLogin = "Y";
	}
	if ($('#saveUserID').is(':checked')) {
		saveUserId = "Y";

		var param = {};
		param["email"] = data.infoMap.EMAIL;
		jappinf.setAppPref(param, function(resultCd) {
			console.log('setAppPref for email success');
		});
	} else {
		var param = {};
		param["email"] = "";
		jappinf.setAppPref(param, function(resultCd) {
		});
	}

	var sessionUserInfo = {};

	sessionUserInfo.USER_ID = data.infoMap.USER_ID;
	sessionUserInfo.USER_NM = data.infoMap.USER_NM;
	sessionUserInfo.PW = data.infoMap.PW
	sessionUserInfo.BIRTH = data.infoMap.BIRTH;
	sessionUserInfo.USER_AGE = data.infoMap.USER_AGE;
	sessionUserInfo.EMAIL = data.infoMap.EMAIL;
	sessionUserInfo.GENDER = data.infoMap.GENDER;
	sessionUserInfo.WEIGHT = data.infoMap.WEIGHT;
	sessionUserInfo.HEIGHT = data.infoMap.HEIGHT;
	sessionUserInfo.LOGIN_TYPE = data.infoMap.LOGIN_TYPE;
	sessionUserInfo.AUTO_LOGIN = autoLogin;
	sessionUserInfo.SAVE_USER_ID = saveUserId;
	sessionUserInfo.SNS_ID = data.infoMap.SNS_ID;
	sessionUserInfo.SNS_TYPE = data.infoMap.SNS_TYPE;
	sessionUserInfo.ORG_CD = data.infoMap.ORG_CD;
	sessionUserInfo.ITEM2000 = data.infoMap.ITEM2000;
	sessionUserInfo.ITEM2201 = data.infoMap.ITEM2201;
	sessionUserInfo.ITEM2202 = data.infoMap.ITEM2202;
	sessionUserInfo.ITEM2203 = data.infoMap.ITEM2203;
	sessionUserInfo.ITEM2204 = data.infoMap.ITEM2204;
	sessionUserInfo.ITEM2205 = data.infoMap.ITEM2205;
	sessionUserInfo.ITEM2206 = data.infoMap.ITEM2206;
	sessionUserInfo.ITEM2207 = data.infoMap.ITEM2207;
	
	Object.keys(sessionUserInfo).forEach(function(key){
		sessionStorage.setItem(key, sessionUserInfo[key]);
	});
	
	if(jappinf.isNative()){
		jappinf.setSessionUserInfo(function(resultCd, result) {
			if (resultCd == RESULTCODE.SUCC) {
				if(result != null){
					cmmnAjax('/appGlu/us/updateUserMobileInfo.do', result, function(){});
				}
				console.log('sessionUserInfo save success');
				location.href = "../mn/dashboard.html";

			} else {
				console.log('sessionUserInfo save fail');
			}
		}, sessionUserInfo);
		
	}else{
		location.href = "../mn/dashboard.html";
	}

}

function setAdminSessionInfo(data){
	var autoLogin = "N";
	var saveUserId = "N";

	if ($('#autoLogin').is(':checked')) {
		autoLogin = "Y";
	}
	if ($('#saveUserID').is(':checked')) {
		saveUserId = "Y";

		var param = {};
		param["ADMINEMAIL"] = data.infoMap.EMAIL;
		param["ADMINPW"] = data.infoMap.PW;
		jappinf.setAppPref(param, function(resultCd) {
			console.log('setAppPref for email success');
		});
	} else {
		var param = {};
		param["ADMINEMAIL"] = "";
		param["ADMINPW"] = "";
		jappinf.setAppPref(param, function(resultCd) {
		});
	}

	var sessionUserInfo = {};

	sessionUserInfo.ADMIN_ID = data.infoMap.USER_ID;
	sessionUserInfo.LOGIN_TYPE = data.infoMap.LOGIN_TYPE;
	
	Object.keys(sessionUserInfo).forEach(function(key){
		sessionStorage.setItem(key, sessionUserInfo[key]);
	});
	
	if(jappinf.isNative()){
		location.href = "../fw/followmain.html";
	}else{
		location.href = "../fw/followmain.html";
	}

}
// 튜토리얼 페이지 완료 시 메인 화면으로 이동
function startApp() {
	if (loginType == "EMAIL") {
		cmmnAjax('appGlu/us/selectUserById.do', {
			EMAIL : $("#confirmEmail").text(),
			PW : $("#confirmPw").text()
		}, selectUserByCallback);
	} else {
		cmmnAjax('appGlu/us/selectUserBySns.do', {
			SNS_ID : $("#confirmSnsId").text(),
			EMAIL : $("#confirmEmail").text(),
			SNS_TYPE : $("#confirmSnsType").text()
		}, selectUserByCallback);
	}
}

/*******************************************************************************
 * 로그아웃
 ******************************************************************************/
function snsLogout() {
	naverLogin.logout();
	Kakao.Auth.logout();
	window.location.reload();
}

function emailMoveTab(obj, event) {
	var KeyCode = event.keyCode ? event.keyCode : event.which ? event.which
			: event.charCode;
	if (KeyCode == 13) {
		obj.focus();
	}
}

function loginPwKeyPress(event) {
	var KeyCode = event.keyCode ? event.keyCode : event.which ? event.which
			: event.charCode;
	if (KeyCode == 13) {
		emailLoginEvnet();
	}
}

function joinPwKeyPress(event) {
	var KeyCode = event.keyCode ? event.keyCode : event.which ? event.which
			: event.charCode;
	if (KeyCode == 13) {
		chkJoinEmail();
	}
}

// 회원가입 폼 비우기
function joinFormClear() {
	snsType = "";
	loginType = "";

	$("#joinEmail").val("");
	$("#joinPw").val("");
	$("#descJoinChk").addClass("hidden");
	$("#joinToken").val("");
	$("#joinSnsType").val("");
	$("#joinSnsId").val("");
	$("#joinSnsNm").val("");
	$("#joinSnsEmail").val("");
	$("#joinSnsGender").val("");
	$("#joinNickNm").val("");
	$("input:radio[name='joinGender']").prop('checked', false).checkboxradio()
			.checkboxradio('refresh');
	$("input:radio[name='joinGender']:checked").prev().removeClass(
			'ui-radio-on').addClass('ui-radio-off');
	$("#joinBirth").val("");
	$("#joinHeight").val("");
	$("#joinWeight").val("");
	$("#joinPromoCd").val("");
	$("#joinDiv").val("");
	
	$('#favRmk').val(""); //기타 질환 입력칸
	$('#favRmk').css({"display":"none"});
	
	// 관심사항
	$("input:radio[name='joinFavCat']").each(function() {
		$(this).prop('checked', false);
		$(this).prev().removeClass('ui-radio-on').addClass('ui-radio-off');
	});
	$("input:radio[name='joinFavCat']:eq(0)").prev().addClass('ui-radio-on');
	$("input:radio[name='joinFavCat']:eq(0)").prop('checked', 'checked')
			.checkboxradio().checkboxradio('refresh');

	// 약관동의
	$("#checkAll").prop('checked', false);
	$("#checkAll").prev().removeClass('ui-checkbox-on').addClass(
			'ui-checkbox-off');
	$('input[name="termCheckbox"]:checkbox').each(
			function() {
				$(this).prop('checked', false);
				$(this).prev().removeClass('ui-checkbox-on').addClass(
						'ui-checkbox-off');
			});

}

$(document).on('click', '.termsBox', function() {
	var index = $(this).index();
	console.log('index::: ' + $(this).index());
	if (index == 0) {
		// ../../app/bx/terms.html#terms1
	} else if (index == 1) {
		// ../../app/bx/terms.html#terms2
	}
})
