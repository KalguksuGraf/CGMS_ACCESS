/*
 * 2020.01.14
 * 윤달계산 필요없는 달력함수입니다
 * 
*/
var futureOpt = true;	//미래 날짜 선택 가능 여부 옵션
var today_ = new Date();//오늘 날짜
var to_year = today_.getFullYear(); //연년 클래스 변수
var to_month = today_.getMonth()+1;; // 연월 클래스 변수
var to_date_fix = today_.getDate(); //오늘날짜 클래스 변수
var to_month_fix = today_.getMonth()+1;
var to_year_fix =  today_.getFullYear();
var dateFmt = "YYYYMMDD";

var link = document.location.href;
var targetMD;

$(document).on("click", ".calendar .btn_next", function(){
	if(to_year==to_year_fix&&to_month==to_month_fix){
		return ;
	}
	nextCalendar();
	toUrlAjax(link,String(to_year)+""+leadingZeros(to_month,2))
});

$(document).on("click", ".calendar .btn_prev", function(){
	prevCalendar();
	toUrlAjax(link,String(to_year)+""+leadingZeros(to_month,2))
});

$(document).on("click","a[name=day]",function(){
	if($(this).hasClass("hide_day")){
		return;
	}
	var date = this.id;
	var select_day = to_year + "" + leadingZeros(to_month, 2) + "" + leadingZeros(date, 2);
//	$("#input_date").val(setDateFormat(select_day, dateFmt));
//	$("#selectDayVal").remove();
//	$("#input_date").after('<input type="hidden" id="selectDayVal" value="' + to_year + "" + leadingZeros(to_month, 2) + "" + leadingZeros(date, 2) + '"/>');
	$('a[name="day"]').removeClass('current-today');
	$('#'+date).addClass('current-today');
	$("#step_item_panel" ).panel( "close" );
	$('#forMonth').html(setDateFormat(select_day, dateFmt));
	targetMD = 'D';
	toUrlAjax(link,'',setDateFormat(select_day, 'YYYYMMDD'));
});

function toUrlAjax(urlLink,month,fulldate){
	if(String(urlLink).indexOf('followpushlist.html') > -1){
		var param = {
				TARGET_USER_ID : sessionStorage.getItem('TARGET_USER')
			  ,	TARGET_MONTH : isNullToString(month)
			  , TARGET_DATE  : isNullToString(fulldate)
		}
		selectTargetPushList(param);
	}
}

function length(date){
	if(date.length == 1){
		date = '0'+date;
	}
	return date;
}

function prevCalendar(){//이전 달력
  today_ = new Date(today_.getFullYear(), today_.getMonth()-1,today_.getDate());
  targetMD = 'M'
  buildCalendar();
}

//다음 달력을 오늘을 저장하고 달력에 뿌려줌
function nextCalendar(){
  today_ = new Date(today_.getFullYear(), today_.getMonth()+1,today_.getDate()); 
  targetMD = 'M'
  buildCalendar();

}

function buildCalendar(option){
	if(option != null){
		futureOpt = option.futureOpt != null ? option.futureOpt : futureOpt;
		dateFmt = option.dateFmt != null ? option.dateFmt : dateFmt;
	}
	
	var nMonth = new Date(today_.getFullYear(),today_.getMonth(),1);// 이번달의 첫번째날
	var lastDate =new Date(today_.getFullYear(),today_.getMonth()+1,0);//이번달의 마지막날
	var tblCalendar =document.getElementById("calendar");    //테이블 달력을 만드는 테이블
	//var tblCalendarYM =document.getElementById("calendarYM"); ///XXXX년도XX월 출력
	//tblCalendarYM.innerHTML =  today_.getFullYear() + "년 " +(today_.getMonth()+1) +"월";
	to_year = today_.getFullYear();
	to_month = today_.getMonth()+1;
	//기존에 테이블에 있던 달력 내용 삭제
	$('#forMonth').html(to_month+"월");
	while(tblCalendar.rows.length > 0){
		tblCalendar.deleteRow(tblCalendar.rows.length -1);
	}
	var row = null;
	row =tblCalendar.insertRow();
	var cnt =0;
	// 1일이 시작되는 칸을 맞추어줌
	
	for ( i=0; i <nMonth.getDay(); i++) {
		cell =row.insertCell();
		cnt = cnt + 1;
	}
	
	//달력 출력
	for(i=1; i<=lastDate.getDate(); i++){
		cell =row.insertCell();
		if((i == to_date_fix) && (to_year == to_year_fix) && (to_month == to_month_fix)){
			cell.innerHTML = '<td date-day="'+i+'"><a href="#" id="'+i+'" name="day"  class="current-today">'+i+'</a></td>';
		}else if(! futureOpt
			&& ((to_year > to_year_fix) 
					|| ((to_year == to_year_fix) && (to_month == to_month_fix) && (i > to_date_fix))
					|| ((to_year == to_year_fix) && (to_month > to_month_fix)) )){
			cell.innerHTML = '<td date-day="'+i+'"><a href="#" id="'+i+'" name="day" class="hide_day">'+i+'</a></td>';
		}else{
			cell.innerHTML = '<td date-day="'+i+'"><a href="#" id="'+i+'" name="day">'+i+'</a></td>';
		}
		
		cnt = cnt + 1;
		if (cnt%7 == 0)    //1주=7일
		row = calendar.insertRow();
	}

}

/*달력*/