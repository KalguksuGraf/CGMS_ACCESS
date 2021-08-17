//팔로우앱 대상자 푸시 전송 js

var urlLink = document.location.href;
$(document).on('keyup','#push_cont',function(){
	var content = $(this).val();
	if(content.length > 20){
		$(this).val(content.substring(0, 20));
	}
});

$(document).on('click','#target_pushSnd',function(){
	var push_cont = $('#push_cont').val();
	if(isNullToString(push_cont) == ""){
		alert('전송할 내용을 입력해 주세요.');
		return;
	}
	
	var param = {
			USER_ID : sessionStorage.getItem('TARGET_USER')
		  , TITLE         : push_cont
		  , CONT          : push_cont
		  , NOTICE_CLF	       : "A"
		  , REQ_CLF			   : "10"
		  , RCV_CLF 		   : "I"	 
		  ,	LINK_PAGE          : "/appGlu/page/mn/dashboard.html"	
		  , SESS_MNGR_ID	   : sessionStorage.getItem("ADMIN_ID")	  
	} 
	
	cmmnAjax('appGlu/ff/followInsertNotice.do',param,function(res){
		if(res.succYn == "Y"){
			var userStr = res.USER_ID;
			
			var pushParam = {
					msgSn : res.sndsn
				  , msgCode : res.NOTICE_CLF
				  , userList : userStr
			      , title : res.TITLE
				  , body : res.CONT	
				  , sender : "FOLLOW"
			}
			cmmnAjax('/common/sendPushToGluUserList.do',pushParam,function(res){
				if(res.chkYn == "Y"){
					alert("전송되었습니다");
					if(String(urlLink).indexOf('followpushlist.html') > -1){
						pushListNew();
					}
				}else{
					alert('알림 전송에 실패하였습니다.');
				}
				$('#push_cont').val('');
				$('#massage_reg').panel('close');
			});
			
		}else{
			alert('알림 전송에 실패하였습니다.')
		}
		
	});
});

