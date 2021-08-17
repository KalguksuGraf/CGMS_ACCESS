var listLength = 0;

//달력 세팅
$(document).on("pagebeforeshow", function(event){
	buildCalendar({ "futureOpt" : false , "dateFmt" : "YYYY. MM. DD" });
	$('.on_month').html(to_month+'월 전체');
	$('#forMonth').html(to_month+'월');
	var param = {
			TARGET_USER_ID : sessionStorage.getItem('TARGET_USER')
		  ,	TARGET_MONTH   : String(leadingZeros(to_year,2)) +""+ String(leadingZeros(to_month, 2))
	}
	targetMD = 'M';
	selectTargetPushList(param);
});

$(document).ready(function(){
	$('#forMonth').addClass('close');
});

//오늘 날짜로 초기화
$(document).on('click','.month_today_btn a.on_today',function(){
	today_ = new Date();
	to_year = today_.getFullYear(); 
	to_month = today_.getMonth()+1;
	buildCalendar({ "futureOpt" : false , "dateFmt" : "YYYY. MM. DD" });
	
	var setToday = to_year+""+leadingZeros(to_month, 2)+""+leadingZeros(to_date_fix,2)
	$('#forMonth').html(setDateFormat(setToday, 'YYYY. MM. DD'));
	$("#step_item_panel" ).panel( "close" );
	toUrlAjax(link,'',setToday);
	
});

$(document).on('click','.btn_next, .btn_prev',function(){
	$('.on_month').empty();
	$('.on_month').html(Number(today_.getMonth()+1)+'월 전체');
});

$(document).on('click','a.on_month',function(){
	var param = {
		TARGET_USER_ID : sessionStorage.getItem('TARGET_USER')
	  ,	TARGET_MONTH : to_year+""+leadingZeros(to_month,2)
	  , TARGET_DATE  : ''
	}
	$('#forMonth').html(to_month+'월');
	$("#step_item_panel" ).panel( "close" );
	$('a[name="day"]').removeClass('current-today');
	selectTargetPushList(param);
});


$(document).on('click','#forMonth',function(){
	if($(this).hasClass('open')){
		$(this).removeClass('open');
		$(this).addClass('close')
	}else if($(this).hasClass('close')){
		$(this).removeClass('close');
		$(this).addClass('open')
	}
});

function pushListNew(){ 
	var nt_today = new Date();//오늘 날짜
	var nt_year = today_.getFullYear(); //연년 클래스 변수
	var nt_month = today_.getMonth()+1;; // 연월 클래스 변수
	var nt_dd = today_.getDate(); //오늘날짜 클래스 변수
	
	if(nt_year == to_year){
		if(targetMD == 'M'){
			if(leadingZeros(nt_month,2) == leadingZeros(to_month, 2)){
				//이 경우에만 푸시내역 추가
				var param = {
						TARGET_USER_ID : sessionStorage.getItem('TARGET_USER')
					  ,	TARGET_MONTH : String(leadingZeros(to_year,2))+""+String(leadingZeros(to_month, 2))
				}
				setNeweastPushList(param);
			}else{}
		}else if(targetMD == 'D'){
			var sd = $('#calendar').find('.current-today').attr('id');
			if(leadingZeros(nt_month,2) == leadingZeros(to_month, 2)){
				if(leadingZeros(nt_dd,2) == leadingZeros(sd, 2)){
					//이 경우에만 푸시내역 추가
					var param = {
							TARGET_USER_ID : sessionStorage.getItem('TARGET_USER')
						  , TARGET_DATE  : String(leadingZeros(to_year,2))+""+String(leadingZeros(to_month, 2))+""+String(leadingZeros(sd, 2))
					}
					setNeweastPushList(param);
				}
			}else{}
		}
	}
}

function setNeweastPushList(param){
	//console.log(param);
	if(listLength == 0){
		selectTargetPushList(param);
	}else{
		cmmnAjax('appGlu/ff/selectTargetPushList.do',param,function(res){			
			if(res.succYn == 'Y'){
				var overRoll = res.targetPushList.length - listLength;
				var sbf = new StringBuffer();
				var pushList = res.targetPushList;
				listLength = res.targetPushList.length;
				for(var i=0 ; i<=overRoll ; i++){
					var sndDate = pushList[i].COM_SND_DT;
					var sndYr = setDateFormat(sndDate,'YYYY년');
					var sndMn = setDateFormat(sndDate,'MM월 DD일');
					var sndTm = setDateFormat(sndDate,'HH:MI');
					
					sbf.append('<li>');
					sbf.append('<div class="box">');
					sbf.append('<ul>');
					sbf.append('<li>');
					if(pushList[i].NOTICE_CNFM_YN == "Y"){
						sbf.append('<div class="message_view open"></div>');					
						sbf.append('<p class="v open">읽음</p>');
					}else{					
						sbf.append('<div class="message_view off"></div>');
						sbf.append('<p class="v off">읽지않음</p>');
					}
					sbf.append('<li>');
					sbf.append('<div class="txt">');
					sbf.append('<p class="t">'+sndMn+'<span>'+sndTm+'</span></p>');
					sbf.append('<p class="c">'+pushList[i].PUSH_CONT+'</p>');
					sbf.append('</div>');
					sbf.append('</li>');
					sbf.append('</ul>');
					sbf.append('</div>');
					sbf.append('</li>');
				}
				$('.push_list_box li').eq(0).before(sbf.toString());
			}
		});
	}
}

function selectTargetPushList(param){
	//console.log(param);
	$('.push_list_box').empty();
	cmmnAjax('appGlu/ff/selectTargetPushList.do',param,function(res){
		//console.log(res);
		var sbf = new StringBuffer();
		if(res.succYn == 'Y'){
			listLength = res.targetPushList.length;
			if(isNullToString(res.targetPushList) != ""){
				var pushList = res.targetPushList;
				$(pushList).each(function(index,dom){
					//var sndDate = setDateFormat(dom.COM_SND_DT,"YYYY년 MM월 DD일 HH:MI:SS");
					var sndDate = dom.COM_SND_DT;
					var sndYr = setDateFormat(sndDate,'YYYY년');
					var sndMn = setDateFormat(sndDate,'MM월 DD일');
					var sndTm = setDateFormat(sndDate,'HH:MI');
					
					sbf.append('<li>');
					sbf.append('<div class="box">');
					sbf.append('<ul>');
					sbf.append('<li>');
					if(dom.NOTICE_CNFM_YN == "Y"){
						sbf.append('<div class="message_view open"></div>');					
						sbf.append('<p class="v open">읽음</p>');
					}else{					
						sbf.append('<div class="message_view off"></div>');
						sbf.append('<p class="v off">읽지않음</p>');
					}
					sbf.append('<li>');
					sbf.append('<div class="txt">');
					sbf.append('<p class="t">'+sndMn+'<span>'+sndTm+'</span></p>');
					sbf.append('<p class="c">'+dom.PUSH_CONT+'</p>');
					sbf.append('</div>');
					sbf.append('</li>');
					sbf.append('</ul>');
					sbf.append('</div>');
					sbf.append('</li>');
				});
			}else{
				//해당일내 푸시내역 없음
				sbf.append('<li>');
				sbf.append('<div class="box" id="nopush">');
				sbf.append('<ul>');
				sbf.append('<li>');
				sbf.append('<div class=""></div>');
				sbf.append('<p class="v open"></p>');
				sbf.append('</li>');
				sbf.append('<li>');
				sbf.append('<div class="txt">');
				sbf.append('<p class="t">해당 기간내 조회된 내역이 없습니다.<span></span></p>');
				sbf.append('<p class="c"></p>');
				sbf.append('</div>');
				sbf.append('</li>');
				sbf.append('</ul>');
				sbf.append('</div>');
				sbf.append('</li>');
			}
		}else{
			sbf.append('<li>');
			sbf.append('<div class="box" id="nopush">');
			sbf.append('<ul>');
			sbf.append('<li>');
			sbf.append('<div class=""></div>');
			sbf.append('<p class="v open"></p>');
			sbf.append('</li>');
			sbf.append('<li>');
			sbf.append('<div class="txt">');
			sbf.append('<p class="t">정보를 불러오는데 실패하였습니다<span></span></p>');
			sbf.append('<p class="c"></p>');
			sbf.append('</div>');
			sbf.append('</li>');
			sbf.append('</ul>');
			sbf.append('</div>');
			sbf.append('</li>');
		}
		$('.push_list_box').html(sbf.toString());
		//$('.push_list_box').listview('refresh');
	});
}