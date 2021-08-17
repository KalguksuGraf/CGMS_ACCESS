
$(document).ready(function(){
	var userId = sessionStorage.getItem("USER_ID");
	var loginType = sessionStorage.getItem("LOGIN_TYPE");
	cmmnAjax("appGlu/bx/selectUserInfo.do", {SESS_USER_ID:userId, SESS_LOGIN_TYPE:loginType}, function (data){
    	myboxMainCallback(data);
    });
	
	initSvcJoinInfo();
});

function myboxMainCallback(data){
	if (isNullToString(data.infoMap) != "") {
		var infoMap = data.infoMap;
		
		$("#myBoxUserNm").text(infoMap.USER_NM);	
		if(infoMap.PASS_DT > 0){
			$("#myBoxPassDt").text("헬스앤유와 함께한 "+infoMap.PASS_DT+" 일");
		}else{
			$("#myBoxPassDt").text("헬스앤유와 함께한 첫날!!!");
		}
		
		
		if(infoMap.ATTCH_FILE_SN != null){
			var imgUrl = ABSOLUTE_URL + 'common/attchFileDownload.do?attchFileSn='+infoMap.ATTCH_FILE_SN+'&attchFileDtlsSn='+infoMap.ATTCH_FILE_DTLS_SN;
			$("#mainProfilePic").removeClass("noprofile");
			$("#mainProfilePic").css("background-image","url("+imgUrl+")");			
		}else{
//			$("#mainProfilePic").addClass("noprofile");	
		}

//		if(sessOrgCd != null && sessOrgCd != '' && sessOrgCd != "null"){
//			var imgUrl = ABSOLUTE_URL + 'images/app/code/code02_'+sessOrgCd+'.png';
//			$(".mybox_code").css("background-image","url("+imgUrl+")");
//		}else{
			$(".mybox_code").parent().addClass("nocode");
//		}
	
	}
}

function initSvcJoinInfo(){	
	var userId = sessionStorage.getItem("USER_ID");
	cmmnAjax("appGlu/bx/selectSvcJoinInfo.do", {SESS_USER_ID:userId}, function(data){
    	if(isNullToString(data.svcJoinInfo) != ""){
    		var svcJoinInfo = data.svcJoinInfo;
    		
    		for(var i = 0; i < svcJoinInfo.length; i++){
    			var sb = new StringBuffer();
    			var svcStatCls = "on";
    			if(svcJoinInfo[i].SVC_STAT == "03"){
    				svcStatCls = "hold";
    			}
    			
        		sb.append('<li class="list_icon list_icon_hospital" style="padding:.67em 1em;">');
        		sb.append('<div class="no_btn" style="padding-left:2.5em;">');
        		sb.append('<h1 style="font-size:1em;">'+svcJoinInfo[i].PRMO_NM+'<span class="'+svcStatCls+'">['+svcJoinInfo[i].SVC_STAT_NM+']</span></h1>');
        		sb.append('</div>');
        		sb.append('</li>');
        		
        		$(".myBoxMainList").append(sb.toString());
    		}
    		
    		$(".myBoxMainList").listview().listview("refresh");
    	}
    });
}
