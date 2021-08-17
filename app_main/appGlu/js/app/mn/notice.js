
var firstIndex = 1;
var lastIndex = 20;
var indexRange = 20;

$(document).ready(function(){
	noticeListInit();
});

function noticeListInit(){
	var userId = sessionStorage.getItem("USER_ID");
    cmmnAjax("appGlu/bx/selectNotificationList.do", {SESS_USER_ID:userId, firstIndex:firstIndex, lastIndex:lastIndex}, function (data){
    	noticeListCallback(data);
    });	
}

function noticeListCallback(data){
	var sbf = new StringBuffer();	
	if (isNullToString(data.rsList) != ""){
		var rsList = data.rsList;
		for(var i=0; i<rsList.length; i++){
			var sndDt = rsList[i].SND_DE;
			var sndDe = sndDt.substring(0,4) + "." + sndDt.substring(4,6) + "." + sndDt.substring(6,8);
			var sndTm = (sndDt.substring(8,10) * 1 > 11 ? "오후 " : "오전 ") + (sndDt.substring(8,10) * 1 > 11 ? (sndDt.substring(8,10) * 1 - 12) : sndDt.substring(8,10) * 1) + ":" + sndDt.substring(10,12);
			var newClsNm = "";
			if(rsList[i].NOTICE_CNFM_YN == "N") newClsNm = "new";
			sbf.append('<li class="' + newClsNm + '">');
			sbf.append('<a href="'+isNullToString(rsList[i].LINK_PAGE)+'" class="" rel="external">');
			sbf.append('<div>')
			sbf.append('<h3>' + rsList[i].NOTICE_TITLE + '</h3>');
			sbf.append('<p class="">' + (rsList[i].CUR_DT_YN == "Y" ? sndTm : sndDe) + '</p>');
			sbf.append('</div>');		
			sbf.append('<p class="">' + rsList[i].NOTICE_CONT + '</p>');
			sbf.append('</a>');
			sbf.append('</li>');
		}
		
		if(firstIndex == 1){
			// 스크롤 이벤트
			$(document).scroll(function(){
				var scrollTop = $(window).scrollTop();
				var height = $(window).height();
				var totHeight = $(document).height();
				if(scrollTop + height >= totHeight){
					noticeListInit();
				}
			});
		}
		
		firstIndex += indexRange;
		lastIndex += indexRange;
		
	}else{
		if(firstIndex == 1){
			sbf.append('<li>');
			sbf.append('<a>');
			sbf.append('<h3>알림내역이 없습니다.</h3>');
			sbf.append('</a>');
			sbf.append('</li>');
		}
	}
	$("#noticeListView").append(sbf.toString());		
	$("#noticeListView").listview().listview("refresh");
}



