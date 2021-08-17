var serchNm = '';
var tabSttus = 'ALL';

var today = new Date();
var realTimeDt = today.getFullYear()+""+leadingZeros(today.getMonth()+1,2)+""+leadingZeros(today.getDate(),2);
var realTimeTm = leadingZeros(today.getHours(),2)+""+leadingZeros(today.getMinutes(),2)+""+leadingZeros(today.getSeconds(),2);

var cgmNow =  new Date();
var cgmFr = cgmNow.setHours(cgmNow.getHours()-3);
var cgmFrDate = cgmNow.getFullYear()+""+leadingZeros(cgmNow.getMonth()+1,2)+""+leadingZeros(cgmNow.getDate(),2) +""+leadingZeros(cgmNow.getHours(),2)+""+leadingZeros(cgmNow.getMinutes(),2)+""+leadingZeros(cgmNow.getSeconds(),2);


$(document).ready(function(){
	readyViewMode();
	adminEffectiveness(sessionStorage.getItem("ADMIN_ID"));
	sessionStorage.removeItem('TARGET_USER');
	pageCnrl(1);
	renewalSttusChart();
});

//전체화면으로 돌아감 (탭유형 초기화)
$(document).on('click','.ui-btn-left.sec',function(){
	$('.ui-btn.dounut').removeClass('tab_on');
	$('#searchBar').val('');
	tabSttus = 'ALL';
	serchNm = '';
	allDimentionGraphReset();
	pageCnrl(1);
});

//탭그래프를 눌러 스탯에 따른 리스트 출력 (탭유형 초기화)
$(document).on('click','.ui-btn.dounut',function(){
	var tabId = $(this).attr('id');
	if(tabSttus==tabId){ //이미 같은 탭일경우 해당 이벤트 재호출 방지
		return;
	}
	$('#searchBar').val('');
	tabSttus = tabId;
	serchNm = '';
	allDimentionGraphReset();
	$('.ui-btn.dounut').removeClass('tab_on');
	$(this).addClass('tab_on');

	for(var i=0;i<$('.ui-btn.dounut').length;i++){
		if($('.ui-btn.dounut').eq(i).attr('id')==tabId){
			pageCnrl(i+2);
		}
	}
});

//대상자 검색 메인 (클릭시 검색페이지로 이동)
$(document).on('click','#follow .ui-input-search',function(){
	location.href = '#follow_search';
	$('#followReSearch').val('');
	$('#follow_search').find('.user_list_box_ul').html('');
});

//대상자 검색 페이지내 검색바 (검색페이지 유지)
$(document).on('click','#follow_search .ui-input-search',function(){
	var viewMode = sessionStorage.getItem('viewMode');
	
	serchNm = $('#followReSearch').val();
	resetDate();
	
	//setTestDt();/////////////////////////테스트 세팅
	if(viewMode == 'default'){			
		setRealTimeCgmStatus('','follow_search');
	}else if(viewMode == 'detail'){			
		setRealTimeCgmStatusPartTwo('','follow_search');
	}
});

//검색어 입력
$(document).on('click','#followReSearch',function(e){
	e.stopPropagation(); 
})

$(document).on('click','.user.ui-btn',function(){
	var target_user_id = $(this).attr('name');
	sessionStorage.setItem('TARGET_USER',target_user_id);
	location.href = 'followtargetdtls.html'
});

function pageCnrl(x){
	// x 값에 따른 결과 페이지 변경
	// 1:전체페이지, 2: 긴급 저혈당, 3:고혈당, 4:데이터 끊김
	resetDate();
	//setTestDt();
	var pageNo = isNullToString(x,1);
	var viewMode = sessionStorage.getItem('viewMode');
	$('.tab_user_contBox').css({"display":"none"});
	if(pageNo==1){
		$('#allCgmList').css({"display":"block"});
		if(viewMode == 'default'){			
			setRealTimeCgmStatus(pageNo);
		}else if(viewMode == 'detail'){			
			setRealTimeCgmStatusPartTwo(pageNo);
		}
	}else if(pageNo==2){
		$('#emLowList').css({"display":"block"});
		if(viewMode == 'default'){			
			setRealTimeCgmStatus(pageNo);
		}else if(viewMode == 'detail'){			
			setRealTimeCgmStatusPartTwo(pageNo);
		}
	}else if(pageNo==3){
		$('#highCgmList').css({"display":"block"});
		if(viewMode == 'default'){			
			setRealTimeCgmStatus(pageNo);
		}else if(viewMode == 'detail'){			
			setRealTimeCgmStatusPartTwo(pageNo);
		}
	}else if(pageNo==4){
		$('#cgmDisconnect').css({"display":"block"});
		if(viewMode == 'default'){			
			setRealTimeCgmStatus(pageNo);
		}else if(viewMode == 'detail'){			
			setRealTimeCgmStatusPartTwo(pageNo);
		}
	}
}

//상태영역 그래프(3EA) 및 리스트 세팅(No Graph)--세브란스 수정안에 따른 데이터 세팅
// x 값에 따른 결과 페이지 목록
// 1:전체페이지, 2: 긴급 저혈당, 3:고혈당, 4:데이터 끊김
function setRealTimeCgmStatus(x,y){
	var ser = '';
	
	if(isNullToString(x)!=""){
		var pageNo = isNullToString(x,1);
		//console.log("targetPage::"+$('.tab_user_contBox').eq(x-1).attr('id')+" TAB::"+tabSttus);
		farmSttus(tabSttus);
		$('.tab_user_contBox').eq(x-1).find('.user_list_box_ul').html('');
		var drawPage = $('.tab_user_contBox').eq(x-1).attr('id');
		var param = {
				CGM_STTUS : tabSttus =='ALL'?'':tabSttus
			  , SEARCH_DT : realTimeDt
			  , SEARCH_TM : realTimeTm
			  , SEARCH_REAL_TM : realTimeDt + "" + realTimeTm
		}
	}else if(isNullToString(y)!=""){
		var drawPage = y;
		ser = '_search';
		$('#'+drawPage).find('.user_list_box_ul').html('');
		var param = {
				SEARCH_TARGET_NM : serchNm
			  , SEARCH_DT : realTimeDt
			  , SEARCH_TM : realTimeTm
			  , SEARCH_REAL_TM : realTimeDt + "" + realTimeTm  
		}
	}
			
	
	cmmnAjax('appGlu/fw/selectRealTimeCgmStatus.do',param,function(res){
		if(res.chkYn == "Y"){
			var cgmSttus = res.stdMap;
			$('#tot_target').html("전체 "+cgmSttus.TOT+"명");
			drawSttusGraph(cgmSttus);
			
			var sbf = new StringBuffer();
			var totTex = 0;
			if(isNullToString(res.targetList)!=""){
				var targetList = res.targetList;
				
				$(targetList).each(function(index,dom){
					var imgurl = ''
					if(isNullToString(dom.ATTCH_FILE_SN)!=""){
						imgurl = ABSOLUTE_URL + 'common/attchFileDownload.do?attchFileSn='+dom.ATTCH_FILE_SN+'&attchFileDtlsSn='+dom.ATTCH_FILE_DTLS_SN;
					}else{
						imgurl = '../../images/app/noprofile@2x.png';
					}
					if(isNullToString(y)!=""&&totTex==0){
						sbf.append('<li data-role="list-divider" class="user_sch_value ui-li-divider">검색결과 '+targetList.length+'건</li>'); 
						totTex=1;
					}
					
					if(dom.RECENT_SENSOR_STTUS == 'LOW_EMER'){//긴급 저혈당
						sbf.append('<li>');
						sbf.append('<button class="user ui-btn" name="'+dom.USER_ID+'">');
						sbf.append('<ul>');
						sbf.append('<li>');
						sbf.append('<div class="meal_pic_div meal_pic_size" style="background-image:url('+imgurl+')"></div>');
						sbf.append('<p class="n">'+dom.USER_NM+'</p>');
						sbf.append('</li>');
						sbf.append('<li>');
						sbf.append('<p class="t"><em class="bullet_type b_solid g_1">긴급저혈당</em></p>');
						sbf.append('<p class="v"><span>'+dom.RECENT_CGM_VALUE+'</span> mg/dL</p>');
						sbf.append('</li>');
						sbf.append('</ul>');
						sbf.append('</button>');
						sbf.append('</li>');
					}else if(dom.RECENT_SENSOR_STTUS == 'NORMAL'){//정상
						sbf.append('<li>');
						sbf.append('<button class="user ui-btn" name="'+dom.USER_ID+'">');
						sbf.append('<ul>');
						sbf.append('<li>');
						sbf.append('<div class="meal_pic_div meal_pic_size" style="background-image:url('+imgurl+')"></div>');
						sbf.append('<p class="n">'+dom.USER_NM+'</p>');
						sbf.append('</li>');
						sbf.append('<li>');
						sbf.append('<p class="t"><em class="bullet_type b_line b_3">정상</em></p>');
						sbf.append('<p class="v"><span>'+dom.RECENT_CGM_VALUE+'</span> mg/dL</p>');
						sbf.append('</li>');
						sbf.append('</ul>');
						sbf.append('</button>');
						sbf.append('</li>');
					}else if(dom.RECENT_SENSOR_STTUS == 'HIGH'){//고혈당
						sbf.append('<li>');
						sbf.append('<button class="user ui-btn" name="'+dom.USER_ID+'">');
						sbf.append('<ul>');
						sbf.append('<li>');
						sbf.append('<div class="meal_pic_div meal_pic_size" style="background-image:url('+imgurl+')"></div>');
						sbf.append('<p class="n">'+dom.USER_NM+'</p>');
						sbf.append('</li>');
						sbf.append('<li>');
						sbf.append('<p class="t"><em class="bullet_type b_solid g_2">고혈당</em></p>');
						sbf.append('<p class="v"><span>'+dom.RECENT_CGM_VALUE+'</span> mg/dL</p>');
						sbf.append('</li>');
						sbf.append('</ul>');
						sbf.append('</button>');
						sbf.append('</li>');
					}else if(dom.RECENT_SENSOR_STTUS == 'LOW'){//저혈당
						sbf.append('<li>');
						sbf.append('<button class="user ui-btn" name="'+dom.USER_ID+'">');
						sbf.append('<ul>');
						sbf.append('<li>');
						sbf.append('<div class="meal_pic_div meal_pic_size" style="background-image:url('+imgurl+')"></div>');
						sbf.append('<p class="n">'+dom.USER_NM+'</p>');
						sbf.append('</li>');
						sbf.append('<li>');
						sbf.append('<p class="t"><em class="bullet_type b_line b_2">저혈당</em></p>');
						sbf.append('<p class="v"><span>'+dom.RECENT_CGM_VALUE+'</span> mg/dL</p>');
						sbf.append('</li>');
						sbf.append('</ul>');
						sbf.append('</button>');
						sbf.append('</li>');
					}else if(dom.RECENT_SENSOR_STTUS == 'NO_SENSOR'){//센서 없음
						sbf.append('<li>');
						sbf.append('<button class="user ui-btn" name="'+dom.USER_ID+'">');
						sbf.append('<ul>');
						sbf.append('<li>');
						sbf.append('<div class="meal_pic_div meal_pic_size" style="background-image:url('+imgurl+')"></div>');
						sbf.append('<p class="n">'+dom.USER_NM+'</p>');
						sbf.append('</li>');
						sbf.append('<li>');
						sbf.append('<p class="t"><em class="bullet_type b_line b_4">기기 수신 없음</em></p>');
						sbf.append('<p class="s"></p>');
						sbf.append('</li>');
						sbf.append('</ul>');
						sbf.append('</button>');
						sbf.append('</li>');
					}else if(dom.RECENT_SENSOR_STTUS == 'NO_TODAY'){//센서 중단(오늘 들어온 데이터가 없음)
						sbf.append('<li>');
						sbf.append('<button class="user ui-btn" name="'+dom.USER_ID+'">');
						sbf.append('<ul>');
						sbf.append('<li>');
						sbf.append('<div class="meal_pic_div meal_pic_size" style="background-image:url('+imgurl+')"></div>');
						sbf.append('<p class="n">'+dom.USER_NM+'</p>');
						sbf.append('</li>');
						sbf.append('<li>');
						sbf.append('<p class="t"><em class="bullet_type b_solid g_4">센서중단</em></p>');
						sbf.append('<p class="s">'+setDateFormat(dom.CORE_REC_MEASR_DT,"YYYY년 MM월 DD일 HH:MI")+' 부터</p>');
						sbf.append('</li>');
						sbf.append('</ul>');
						sbf.append('</button>');
						sbf.append('</li>');
					}else if(dom.RECENT_SENSOR_STTUS == 'DATA_DISC'){//데이터 끊김
						sbf.append('<li>');
						sbf.append('<button class="user ui-btn" name="'+dom.USER_ID+'">');
						sbf.append('<ul>');
						sbf.append('<li>');
						sbf.append('<div class="meal_pic_div meal_pic_size" style="background-image:url('+imgurl+')"></div>');
						sbf.append('<p class="n">'+dom.USER_NM+'</p>');
						sbf.append('</li>');
						sbf.append('<li>');
						sbf.append('<p class="t"><em class="bullet_type b_solid g_3">데이터 끊김</em></p>');
						//sbf.append('<p class="v"><span>--</span> mg/dL</p>');
						sbf.append('<p class="s">'+dom.RECENT_CONN_TIME+'분전 ('+dom.RECENT_CGM_VALUE+' mg/dL)</p>');
						sbf.append('</li>');
						sbf.append('</ul>');
						sbf.append('</button>');
						sbf.append('</li>');
					}
				});
				
			}else{
				// 사용자 리스트 없을시 
				sbf.append('<li>해당 대상자 없음</li>');
			}
			$('#'+drawPage).find('.user_list_box_ul').html(sbf.toString());
			$('#'+drawPage).find('.user_list_box_ul').listview().listview('refresh');
		}else{
			alert('데이터 전송중 오류가발생하였습니다.');
		}
	});
}

//실시간 대상자 상태 그래프(3EA)
function drawSttusGraph(m){
	var sttusMap = m;
	var emerClass = 'LOW_EMER';
	var highClass = 'HIGH';
	var dataDiscClass = 'DATA_DISC';
	
	var tot_target_per = Number(m.TOT/m.TOT*100);
	var emer_target_per = Number(m.LOW_EMER_CONT/m.TOT*100);
	var high_target_per = Number(m.HIGH_CONT/m.TOT*100);
	var dataDisc_target_per = Number(m.DATA_DISC_CONT/m.TOT*100);
	
	$('.g.chart').empty();
	
	var emerChartData = [];
	var highChartData = [];
	var dataDiscData  = [];
	
	//긴급 저혈당
	emerChartData.push({
		"avgCal1" : isNullToString(emer_target_per,0) //긴급 저혈당 인원
	 ,  "avgCal2" : isNullToString(tot_target_per,100)-isNullToString(emer_target_per,0)	// 전체 인원
	});
	emerChartData.push({
		"targetcont" : m.LOW_EMER_CONT
	});
	var emerChart = new AvgCalChart({
		 "donut":{"div":"#emerChart"}
	   , "colors":["#56028F","#CCCCCC"]
	   , "classname" : emerClass
	});
	
	//고혈당
	highChartData.push({
		"avgCal1" : isNullToString(high_target_per,0) //긴급 저혈당 인원
	 ,  "avgCal2" : isNullToString(tot_target_per,100)-isNullToString(high_target_per,0)	// 전체 인원
	});
	highChartData.push({
		"targetcont" : m.HIGH_CONT
	});
	var highChart = new AvgCalChart({
		 "donut":{"div":"#highChart"}
	   , "colors":["#FE9504","#CCCCCC"]
	   , "classname" : highClass
	});
	
	//데이터 끊김
	dataDiscData.push({
		"avgCal1" : isNullToString(dataDisc_target_per,0) //긴급 저혈당 인원
	 ,  "avgCal2" : isNullToString(tot_target_per,100)-isNullToString(dataDisc_target_per,0)	// 전체 인원
	});
	dataDiscData.push({
		"targetcont" : m.DATA_DISC_CONT
	});
	var dataDiscChart = new AvgCalChart({
		 "donut":{"div":"#dataDiscChart"}
	   , "colors":["#DC0000","#CCCCCC"]
	   , "classname" : dataDiscClass
	});
	
	emerChart.insertData(emerChartData);
	highChart.insertData(highChartData);
	dataDiscChart.insertData(dataDiscData);
}

//탭 이벤트 및 그래프 선택 이벤트
function farmSttus(tab){
	var tab = tab
	switch (tab) {
	case 'ALL':
		$('.g.chart').css({"background":'#fff'});
		break;
	case 'LOW_EMER':
		$('.g.chart').css({"background":'#EAEAEA'});
		$('#'+tab+' div').css({"background":'#fff'});
		break;
	case 'HIGH':
		$('.g.chart').css({"background":'#EAEAEA'});
		$('#'+tab+' div').css({"background":'#fff'});
		break;
	case 'DATA_DISC':
		$('.g.chart').css({"background":'#EAEAEA'});
		$('#'+tab+' div').css({"background":'#fff'});
		break;
	default:
		break;
	}
}

//관리자 접근 권한
function adminEffectiveness(admin_id){
	cmmnAjax('appGlu/fw/selectUserInfo.do',{SESS_USER_ID:admin_id},function(res){
		if(res.chkYn =='Y'){
			if(res.ADMIN != 'Y'){
				alert('잘못된 접근입니다!');
				location.href = '../us/login.html'
			}
		}else{
			alert('잘못된 접근입니다!');
			location.href = '../us/login.html'
		}
	});
}

//대상일자 최신화 (리스트의 Default는  현재시각)
function resetDate(){
	//현재 시각 초기화
	today = new Date();
	realTimeDt = today.getFullYear()+""+leadingZeros(today.getMonth()+1,2)+""+leadingZeros(today.getDate(),2);
	realTimeTm = leadingZeros(today.getHours(),2)+""+leadingZeros(today.getMinutes(),2)+""+leadingZeros(today.getSeconds(),2);
	
	// 차감시각 초기화
	cgmNow =  new Date();
	cgmFr = cgmNow.setHours(cgmNow.getHours()-3);
	cgmFrDate = cgmNow.getFullYear()+""+leadingZeros(cgmNow.getMonth()+1,2)+""+leadingZeros(cgmNow.getDate(),2) +""+leadingZeros(cgmNow.getHours(),2)+""+leadingZeros(cgmNow.getMinutes(),2)+""+leadingZeros(cgmNow.getSeconds(),2);
}

//그래프 간섭 막기위한 초기화(리스트 내 팝업 그래프 세팅시 적용)
function allDimentionGraphReset(){ 
	$('.thum_graph').empty();
	$('.user_list_box_ul').empty(); 
	$('.popup_chart_area').empty();
}

//상태영역 그래프(3EA) 및 리스트 세팅(Yes Graph)--기획안에 따른 데이터 세팅
//x 값에 따른 결과 페이지 목록
// 1:전체페이지, 2: 긴급 저혈당, 3:고혈당, 4:데이터 끊김
function setRealTimeCgmStatusPartTwo(x,y){
	var ser = '';
	
	if(isNullToString(x)!=""){
		var pageNo = isNullToString(x,1);
		//console.log("targetPage::"+$('.tab_user_contBox').eq(x-1).attr('id')+" TAB::"+tabSttus);
		farmSttus(tabSttus);
		$('.tab_user_contBox').eq(x-1).find('.user_list_box_ul').html('');
		var drawPage = $('.tab_user_contBox').eq(x-1).attr('id');
		var param = {
				CGM_STTUS : tabSttus =='ALL'?'':tabSttus
			  , SEARCH_DT : realTimeDt
			  , SEARCH_TM : realTimeTm
			  , SEARCH_REAL_TM : realTimeDt + "" + realTimeTm
			  , SEARCH_BEFORE_TM : cgmFrDate
		}
	}else if(isNullToString(y)!=""){
		var drawPage = y;
		ser = '_search';
		$('#'+drawPage).find('.user_list_box_ul').html('');
		var param = {
				SEARCH_TARGET_NM : serchNm
			  , SEARCH_DT : realTimeDt
			  , SEARCH_TM : realTimeTm
			  , SEARCH_REAL_TM : realTimeDt + "" + realTimeTm  
			  , SEARCH_BEFORE_TM : cgmFrDate
		}
	}
			
	
	cmmnAjax('appGlu/fw/selectRealTimeCgmStatus2.do',param,function(res){
		if(res.chkYn == "Y"){
			var cgmSttus = res.stdMap;
			$('#tot_target').html("전체 "+cgmSttus.TOT+"명");
			drawSttusGraph(cgmSttus);
			
			var sbf = new StringBuffer();
			var totTex = 0;
			if(isNullToString(res.targetList)!=""){
				var targetList = res.targetList;
				
				$(targetList).each(function(index,dom){
					var htmls = '';
					var imgurl = ''
					var gender_nm = dom.GENDER=='M'?'남성':'여성'	;
					var onOff = isNullToString(dom.USER_TIMELINE)!=""?'block':'block';
					
					if(isNullToString(dom.ATTCH_FILE_SN)!=""){
						imgurl = ABSOLUTE_URL + 'common/attchFileDownload.do?attchFileSn='+dom.ATTCH_FILE_SN+'&attchFileDtlsSn='+dom.ATTCH_FILE_DTLS_SN;
					}else{
						imgurl = '../../images/app/noprofile@2x.png';
					}
					
					if(isNullToString(y)!=""&&totTex==0){
						htmls += '<li data-role="list-divider" class="user_sch_value ui-li-divider">검색결과 '+targetList.length+'건</li>' 
						totTex=1;
					}
					
					if(dom.RECENT_SENSOR_STTUS == 'LOW_EMER'){//긴급 저혈당
						htmls += '<li class="detailpart">';
						htmls += ('<button class="user ui-btn" name="'+dom.USER_ID+'">');
						htmls += ('<ul>');
						htmls += ('<li>');
						htmls += ('<div class="meal_pic_div meal_pic_size" style="background-image:url('+imgurl+')"></div>');
						htmls += ('</li>');
						htmls += ('<li>');
						htmls += ('<div class="txt">');
						htmls += ('<p class="n">'+dom.USER_NM+'</p>');
						htmls += ('<p class="s"><span>'+gender_nm+'</span>'+dom.BIRTH+'년생'+' ('+dom.AGE+'세)</p>');
						htmls += ('<p class="t"><em class="bullet_type b_solid g_1">긴급저혈당</em></p>');
						htmls += ('</div>');
						htmls += ('</li>');
						htmls += ('<li>');
						htmls += ('<div class="thum_graph" id="timelineDtlsChart' + index + ser + '"></div>');
						htmls += ('</li>');
						htmls += ('</ul>');
						htmls += ('</button>');
						htmls += ('</li>');
					}else if(dom.RECENT_SENSOR_STTUS == 'NORMAL'){//정상
						htmls += '<li class="detailpart">';
						htmls += ('<button class="user ui-btn" name="'+dom.USER_ID+'">');
						htmls += ('<ul>');
						htmls += ('<li>');
						htmls += ('<div class="meal_pic_div meal_pic_size" style="background-image:url('+imgurl+')"></div>');
						htmls += ('</li>');
						htmls += ('<li>');
						htmls += ('<div class="txt">');
						htmls += ('<p class="n">'+dom.USER_NM+'</p>');
						htmls += ('<p class="s"><span>'+gender_nm+'</span>'+dom.BIRTH+'년생'+' ('+dom.AGE+'세)</p>');
						htmls += ('<p class="t"><em class="bullet_type b_line b_3">정상</em></p>');
						htmls += ('</div>');
						htmls += ('</li>');
						htmls += ('<li>');
						htmls += ('<div class="thum_graph" id="timelineDtlsChart' + index + ser + '"></div>');
						htmls += ('</li>');
						htmls += ('</ul>');
						htmls += ('</button>');
						htmls += ('</li>');
					}else if(dom.RECENT_SENSOR_STTUS == 'HIGH'){//고혈당
						htmls += '<li class="detailpart">';
						htmls += ('<button class="user ui-btn" name="'+dom.USER_ID+'">');
						htmls += ('<ul>');
						htmls += ('<li>');
						htmls += ('<div class="meal_pic_div meal_pic_size" style="background-image:url('+imgurl+')"></div>');
						htmls += ('</li>');
						htmls += ('<li>');
						htmls += ('<div class="txt">');
						htmls += ('<p class="n">'+dom.USER_NM+'</p>');
						htmls += ('<p class="s"><span>'+gender_nm+'</span>'+dom.BIRTH+'년생'+' ('+dom.AGE+'세)</p>');
						htmls += ('<p class="t"><em class="bullet_type b_solid g_3">고혈당</em></p>');
						htmls += ('</div>');
						htmls += ('</li>');
						htmls += ('<li>');
						htmls += ('<div class="thum_graph" id="timelineDtlsChart' + index + ser + '"></div>');
						htmls += ('</li>');
						htmls += ('</ul>');
						htmls += ('</button>');
						htmls += ('</li>');
					}else if(dom.RECENT_SENSOR_STTUS == 'LOW'){//저혈당
						htmls += '<li class="detailpart">';
						htmls += ('<button class="user ui-btn" name="'+dom.USER_ID+'">');
						htmls += ('<ul>');
						htmls += ('<li>');
						htmls += ('<div class="meal_pic_div meal_pic_size" style="background-image:url('+imgurl+')"></div>');
						htmls += ('</li>');
						htmls += ('<li>');
						htmls += ('<div class="txt">');
						htmls += ('<p class="n">'+dom.USER_NM+'</p>');
						htmls += ('<p class="s"><span>'+gender_nm+'</span>'+dom.BIRTH+'년생'+' ('+dom.AGE+'세)</p>');
						htmls += ('<p class="t"><em class="bullet_type b_line b_2">저혈당</em></p>');
						htmls += ('</div>');
						htmls += ('</li>');
						htmls += ('<li>');
						htmls += ('<div class="thum_graph" id="timelineDtlsChart' + index + ser + '"></div>');
						htmls += ('</li>');
						htmls += ('</ul>');
						htmls += ('</button>');
						htmls += ('</li>');
					}else if(dom.RECENT_SENSOR_STTUS == 'NO_SENSOR'){//센서 없음
						htmls += '<li class="detailpart">';
						htmls += ('<button class="user ui-btn" name="'+dom.USER_ID+'">');
						htmls += ('<ul>');
						htmls += ('<li>');
						htmls += ('<div class="meal_pic_div meal_pic_size" style="background-image:url('+imgurl+')"></div>');
						htmls += ('</li>');
						htmls += ('<li>');
						htmls += ('<div class="txt">');
						htmls += ('<p class="n">'+dom.USER_NM+'</p>');
						htmls += ('<p class="s"><span>'+gender_nm+'</span>'+dom.BIRTH+'년생'+' ('+dom.AGE+'세)</p>');
						htmls += ('<p class="t"><em class="bullet_type b_line b_4">기기  수신 없음</em></p>');
						htmls += ('</div>');
						htmls += ('</li>');
						htmls += ('<li>');
						htmls += ('<div class="thum_graph" id="timelineDtlsChart' + index + ser + '"></div>');
						htmls += ('</li>');
						htmls += ('</ul>');
						htmls += ('</button>');
						htmls += ('</li>');
					}else if(dom.RECENT_SENSOR_STTUS == 'NO_TODAY'){//센서 중단(오늘 들어온 데이터가 없음)
						htmls += '<li class="detailpart">';
						htmls += ('<button class="user ui-btn" name="'+dom.USER_ID+'">');
						htmls += ('<ul>');
						htmls += ('<li>');
						htmls += ('<div class="meal_pic_div meal_pic_size" style="background-image:url('+imgurl+')"></div>');
						htmls += ('</li>');
						htmls += ('<li>');
						htmls += ('<div class="txt">');
						htmls += ('<p class="n">'+dom.USER_NM+'</p>');
						htmls += ('<p class="s"><span>'+gender_nm+'</span>'+dom.BIRTH+'년생'+' ('+dom.AGE+'세)</p>');
						htmls += ('<p class="t"><em class="bullet_type b_solid g_4">센서중단</em></p>');
						htmls += ('</div>');
						htmls += ('</li>');
						htmls += ('<li>');
						htmls += ('<div class="thum_graph" id="timelineDtlsChart' + index + ser + '"></div>');
						htmls += ('</li>');
						htmls += ('</ul>');
						htmls += ('</button>');
						htmls += ('</li>');
					}else if(dom.RECENT_SENSOR_STTUS == 'DATA_DISC'){//데이터 끊김
						htmls += '<li class="detailpart">';
						htmls += ('<button class="user ui-btn" name="'+dom.USER_ID+'">');
						htmls += ('<ul>');
						htmls += ('<li>');
						htmls += ('<div class="meal_pic_div meal_pic_size" style="background-image:url('+imgurl+')"></div>');
						htmls += ('</li>');
						htmls += ('<li>');
						htmls += ('<div class="txt">');
						htmls += ('<p class="n">'+dom.USER_NM+'</p>');
						htmls += ('<p class="s"><span>'+gender_nm+'</span>'+dom.BIRTH+'년생'+' ('+dom.AGE+'세)</p>');
						htmls += ('<p class="t"><em class="bullet_type b_solid g_2">데이터 끊김</em></p>');
						htmls += ('</div>');
						htmls += ('</li>');
						htmls += ('<li>');
						htmls += ('<div class="thum_graph" id="timelineDtlsChart' + index + ser + '"></div>');
						htmls += ('</li>');
						htmls += ('</ul>');
						htmls += ('</button>');
						htmls += ('</li>');
					}
					$('#'+drawPage).find('.user_list_box_ul').append(htmls);
					if(isNullToString(dom.USER_TIMELINE)!=""){
						setTimelineDtlsChart("#timelineDtlsChart" + index + ser , dom, ser);
					}else{
						$("#timelineDtlsChart" + index + ser).addClass('no_d');
					}
				});
				
			}else{
				// 사용자 리스트 없을시 
				sbf.append('<li>해당 대상자 없음</li>');
				$('#'+drawPage).find('.user_list_box_ul').html(sbf.toString());
				$('#'+drawPage).find('.user_list_box_ul').listview().listview('refresh');
			}
		}else{
			alert('데이터 전송중 오류가발생하였습니다.');
		}
	});
}

//리스트내 그래프 클릭시 팝업만 뜨게
$(document).on('click','.graphsvg',function(e){
	e.stopPropagation();
});


//리스트내 미니 그래프 및 팝업 그래프 그리는 함수 (현재 setRealTimeCgmStatusPartTwo 함수 에서만 쓰임)
//div::영역, dom::타임라인 데이터및 사용자별 혈당 목표치, ser:: main page 외부영역에 적용 되는지 여부
function setTimelineDtlsChart(div, dom ,ser){
	var chartData = [];
	
	var minVal = Number.MAX_VALUE;
	var maxVal = Number.MIN_VALUE;
	var list = dom.USER_TIMELINE.split(",");
	
	var high_val = dom.HIGH_VAL;
	var low_val = dom.LOW_VAL;
	var emer_val = dom.EMER_VAL;
	
	var meastTm = realTimeTm;
	var frstMeasrHH = Number(realTimeTm.substring(0,2)) - 3;
	var frstMeasrMI = Number(realTimeTm.substring(2,4));
	var frstMinute = frstMeasrHH * 60 + frstMeasrMI;
	
	for (var i=0; i<list.length; i++) {
		var dataArr = list[i].split("|");
		if(dataArr[0] > 0){
			if(Number(minVal) > Number(dataArr[0])) minVal = Number(dataArr[0]);
		    if(Number(maxVal) < Number(dataArr[0])) maxVal = Number(dataArr[0]);
		    
		    var measrTm = dataArr[1].substring(0, 4);
	    	var measrHH = measrTm.substring(0,2);
	    	var measrMI = measrTm.substring(2,4);
	    	var minute = (Number(measrHH) * 60 + Number(measrMI)) - frstMinute;
//	    	console.log(realTimeDt+""+realTimeTm+" "+cgmFrDate)
	    	var data = {
	    			"x" : minute
	    			, "y" : Number(dataArr[0])
	    	}
	    	chartData.push(data);
		}
	}
	
	if(minVal == Number.MAX_VALUE){
		minVal = 0;
	}

	if(maxVal == Number.MIN_VALUE){
		maxVal = 0;
	}
	
	var cgmDtlsChart = new FollowDtlsChart({
		  "div"			: div
		, "width"		: $(div).width()
		, "height"		: $(div).height()
		, "minMax"		: [minVal, maxVal]
		, "columns"		: [ "y" ]
		, "baseColumns"	: "x"
		, "colors"		:["#fff","rgba(204, 204, 204, 1)", "rgba(255, 223, 59, 1)", "rgba(201, 0, 48, 1)", "rgba(248, 24, 115, 1)"]
		, "highVal"		: high_val
		, "lowVal"		: low_val
		, "typeColor"	: ["rgba(255,94,127,1)", "rgba(213,24,131,1)", "rgba(23,209,186,1)", "rgba(92,130,235,1)", "rgba(96,210,126,1)", "rgba(255,164,84,1)", "rgba(55,31,120,1)", "rgba(123,123,123,1)"]
		, "margin"		: {top:1, right:1, bottom:1, left:1}
		, "tm"			: cgmFrDate
		, "type"		: ''
		, "ser"			: ser	
	});
	
	cgmDtlsChart.insertData(chartData);
}


function renewalSttusChart(){
	setInterval(function() {
		resetDate();
		var param = {
				SEARCH_TARGET_NM : serchNm
			  , SEARCH_DT : realTimeDt
			  , SEARCH_TM : realTimeTm
			  , SEARCH_REAL_TM : realTimeDt + "" + realTimeTm  
			  , SEARCH_BEFORE_TM : cgmFrDate 
		}
		cmmnAjax('appGlu/fw/renewalSttus.do',param,function(res){
			if(res.chkYn == 'Y'){
				console.log('CGM Sttus Renewal!')
				var cgmSttus = res.stdMap;
				drawSttusGraph(cgmSttus);
				if(tabSttus != 'ALL'){
					farmSttus(tabSttus);
				}
			}
		});
	}, 300000);// 60000 = 1분
} 

//로그아웃 버튼 클릭 시
function btnLogoutConfirm(){
	$("#logoutConfirmPopup").popup();
	$("#logoutConfirmPopup").popup('open');
}
//팔로우 ADMIN 로그아웃
function adminLogout(){
	sessionStorage.clear();	
	if(jappinf.isNative()){
		var param = {};
		param["ADMINEMAIL"] = "";
		param["ADMINPW"] = "";
		jappinf.setAppPref(param, function(resultCd) {
			if(resultCd == RESULTCODE.SUCC){	
				location.href = "../us/login.html";	
			}else{
				alert('디바이스내 정보가 없습니다</br>로그인 페이지로 이동 합니다.');
				location.href = "../us/login.html";	
			}	
		});
	}else{
		location.href = "../us/login.html";	
	}
}
function readyViewMode(){
	$('#viewMode').attr('class','');
	if(isNullToString(sessionStorage.getItem('viewMode')) != ""){
		var viewMode = sessionStorage.getItem('viewMode');
		$("#viewselect").val(viewMode == "detail" ? "on" : "off");
		try{$('#viewselect').slider("refresh");}catch(err){}
	}else{
		sessionStorage.setItem('viewMode','default');
	}
}
function changeViewMode(objTag){
	var viewChange = objTag.value == 'on' ? 'detail':'default';
	sessionStorage.setItem('viewMode',viewChange);
	allDimentionGraphReset();
	pageCnrl(1);
}

//테스트 일자 세팅 (운용시 인용되는 곳 비활성 처리 해야함)
function setTestDt(){
	realTimeDt = '20200628';
	realTimeTm = '025959';
	cgmFrDate = '20200627235959';
}