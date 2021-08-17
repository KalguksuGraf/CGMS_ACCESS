
var prmoSvcCd;
var userId;

$(document).ready(function(){
	
});

// 서비스 코드 등록 버튼 이벤트
$(document).on("click", "#svcCdReqBtn", function(){
	userId = sessionStorage.getItem("USER_ID");
	
	$(".error_txt").hide();
	$(".svcCnfmDiv").hide();
	
	prmoSvcCd = $("#prmoSvcCd").val();
	
	if(prmoSvcCd == ""){
		alert("서비스 코드를 입력해 주세요.");
		$("#prmoSvcCd").focus();
		return;
	}
	getSvcOrgInfo(prmoSvcCd);
});

// 동의 버튼 이벤트
$(document).on("click", "#svcCnfmYesBtn", function(){
	svcReq();
});

// 아니오 버튼 이벤트
$(document).on("click", "#svcCnfmNoBtn", function(){
	$("#prmoSvcCd").val("");
	$(".svcCnfmDiv").hide();
});

function getSvcOrgInfo(prmoSvcCd){
	cmmnAjax("appGlu/bx/selectSvcOrgInfo.do", {PRMO_ORG_CD:prmoSvcCd,SESS_USER_ID:userId}, function(data){
    	if(isNullToString(data.svcOrgInfo) != ""){
    		if(data.svcOrgInfo.JOIN_MB_YN == "Y"){
    			if(data.svcOrgInfo.SVC_STAT == "00"){
    				$(".error_txt:eq(1)").show();
    				return;
    			}else if(data.svcOrgInfo.SVC_STAT == "01"){
    				$(".error_txt:eq(2)").show();
    				return;
    			}    			
    		}
    		
    		$(".svcCnfmDiv").show();
    		$("#svcOrgNm").text(data.svcOrgInfo.ORG_NM);
    		$("#svcPeriod").text(data.svcOrgInfo.PRMO_BGN_DE.substring(0,4) + "-" + data.svcOrgInfo.PRMO_BGN_DE.substring(4,6) + "-" + data.svcOrgInfo.PRMO_BGN_DE.substring(6,8)
    				+ " ~ " + data.svcOrgInfo.PRMO_END_DE.substring(0,4) + "-" + data.svcOrgInfo.PRMO_END_DE.substring(4,6) + "-" + data.svcOrgInfo.PRMO_END_DE.substring(6,8));
    	}else{
    		$(".error_txt:eq(0)").show();
    	}
    });
}

// 서비스 승인 요청
function svcReq(){	
	cmmnAjax("appGlu/bx/insertSvcJoinMb.do", {PRMO_ORG_CD:prmoSvcCd,SESS_USER_ID:userId}, function(data){
    	if(isNullToString(data.chkYn) == "Y"){
    		location.href = "../bx/myBoxMain.html";
    	}else{
    		alert("등록 오류가 발생하였습니다.");
    	}
    });
}