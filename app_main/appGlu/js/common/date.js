/********************************************************************
 * jquery datapicker 기본 설정
 * @param	 
 * @returns	
 *******************************************************************/
function setDatepickerSelectDate(formTarget,toTarget,option)
{
	option.onClose = function( selectedDate ) {
//		$(targetEle).val("");
		$(toTarget).datepicker( "option", "minDate", selectedDate );
		$(toTarget).focus();
	};
	$(formTarget).datepicker(option);
	
	option.onClose = function( selectedDate ) {
		$(formTarget).datepicker( "option", "maxDate", selectedDate );
	};
	$(toTarget).datepicker(option);
}


/********************************************************************
 * 화면에 표현할 날짜포멧 설정
 * @param	sDate	- 년월일 시분초 max 14자리 문자열, 만약 ""을 입력하면 today() 적용
 * 			sFormat	- "YYYY년 MM월 DD일 HH시 MI분 SS초", "YYYY년 MM월 DD일 HH:MI:SS", "YYYY/MM/DD" 등 적용하고 싶은 포멧 입력 
 * @returns	string
 *******************************************************************/
function setDateFormat(sDate, sFormat)//sCase, sSprt
{
	var sRtnStr = "";
	
	if(typeof(sDate) == "number") sDate = String(sDate);
	
	//dDate is null = TODATE
	if(isNullToString(sFormat) == "") sFormat = "YYYYMMDD";
	if(isNullToString(sDate) == "") sDate = today("",sFormat.indexOf("AP") > -1);	
	
	sDate = getReplace(sDate,CMMN_SPCL_CHAR,"").toTrim();
	
	var sTime = parseInt(isNullToString(sDate.substr(8,2),"00"));
	var rtnTime = (sTime > 12 ? sTime % 12 : sTime);
	rtnTime = rtnTime < 10 ? "0"+rtnTime : ""+rtnTime;
	rtnTime = sFormat.indexOf("AP") < 0 ? isNullToString(sDate.substr(8,2),"00") : rtnTime;
	sRtnStr = sFormat.replace("YYYY",sDate.substr(0,4))
					.replace("MM",sDate.substr(4,2))
					.replace("DD",sDate.substr(6,2))
					.replace("AP",sTime > 11 ? "오후" : "오전")
					.replace("HH",rtnTime)
					.replace("MI",isNullToString(sDate.substr(10,2),"00"))
					.replace("SS",isNullToString(sDate.substr(12,2),"00"));
	
	return sRtnStr;
}

/********************************************************************
 * 입력된 변수의 값이 null 또는 "" 일때 치환 문자를 반환한다.
 * @param	sDate	- 년월일 시분초 max 14자리 문자열
 * 			sFormat	- "YYYY년 MM월 DD일 HH시 MM분 DD초", "YYYY년 MM월 DD일 HH:MM:DD", "YYYY/MM/DD" 등 적용하고 싶은 포멧 입력 
 * @returns	string
 *******************************************************************/
function today(sSprt,bFlag)
{

	sSprt = isNullToString(sSprt);
	bFlag = isNullToString(bFlag,false);
	var rtnVal = "";
    var now = new Date();

    var year= now.getFullYear();
    var mon = (now.getMonth()+1)>9 ? ''+(now.getMonth()+1) : '0'+(now.getMonth()+1);
    var day = now.getDate()>9 ? ''+now.getDate() : '0'+now.getDate();
    rtnVal = year + sSprt + mon + sSprt + day;
    
    if(bFlag){
    	var hour   = now.getHours(); 
    	var minute = now.getMinutes(); 
    	var second = now.getSeconds();
    	
    	if (hour < 10) {
    		  hour = "0" + hour; 
    		} else if (minute < 10){ 
    		  minute = "0" + minute; 
    		} else if(second < 10){ 
    		  second = "0" + second;
    		} 
    	rtnVal =  year + sSprt + mon + sSprt + day + hour + minute + second;
    }
            
    return rtnVal;
}

/********************************************************************
 * 입력된 날짜 +- 계산
 * @param	sDate	- 년월일 시분초 max 14자리 문자열
 * 			sMode	- Y:년, M:월, D:일
 * 			nShift	- 더하기 또는 빼기 숫자 빼기는 "-" 표시하세요.
 * 			sFormat	- "YYYY년 MM월 DD일 HH시 MM분 DD초", "YYYY년 MM월 DD일 HH:MM:DD", "YYYY/MM/DD" 등 적용하고 싶은 포멧 입력 
 * @returns	string
 *******************************************************************/
function getDateShift(sDate, sMode, nShift, sFormat)
{
	sDate = isNullToString(sDate,today());
	nShift = isNullToString(nShift,"0");
	sMode = isNullToString(sMode,"D");
	var year= sDate.substr(0,4);
	var mon = sDate.substr(4,2);
	var day = sDate.substr(6,2);
    var now = new Date(year, mon - 1, day);
    
    if(typeof nShift !== "number") nShift = parseInt(nShift);
    if(sMode == "Y") {
    	now.setFullYear(now.getFullYear() + nShift);
    } else if(sMode == "M") {
    	now.setMonth(now.getMonth() + nShift);
    } else {
    	now.setDate(now.getDate() + nShift);
    }
    
    year= now.getFullYear();
    mon = (now.getMonth()+1)>9 ? ''+(now.getMonth()+1) : '0'+(now.getMonth()+1);
    day = now.getDate()>9 ? ''+now.getDate() : '0'+now.getDate();
    
    return setDateFormat(year + mon + day,sFormat);
}

/********************************************************************
 * 날짜 구분에 따른 입력한 날짜의 기간 반환
 * getDatePeriod($("#dateText"), "W", -7, "YYYY년 MM월 DD일");
 * @param	sDate	- 년월일 8자리 문자열
 * 			sMode	- Y:년, M:월, D:일, W:주
 * 			nShift	- 더하기 또는 빼기 숫자 빼기는 "-" 표시하세요.
 * 			sFormat	- "YYYY년 MM월 DD일 HH시 MM분 DD초", "YYYY년 MM월 DD일 HH:MM:DD", "YYYY/MM/DD" 등 적용하고 싶은 포멧 입력 
 * @returns	rtnMap
 *******************************************************************/
function getDatePeriod(oDate, sMode, nShift, sFormat)
{
	$targetObj = null;
	var sDate = "";
	var startDay = "";
	var endDay = "";
	var shiftVal = "";
	
	//숫자형으로 변환
    if(typeof nShift !== "number") nShift = parseInt(nShift);
    //예를들어 6개월 간격으로 이동하려고 할때 Date 함수 쪽에서는 6월 15일 부터 6개월인 12월 15일을 반환한다. 그렇기 때문에 5개월을 기준으로 기간을 구한다.
    if(sMode != "W") nShift = nShift > 1 ? nShift - 1 : nShift < -1 ? nShift + 1 : nShift;
    if(typeof oDate === 'object'){
		$targetObj = oDate;								//jQuery 객체로 받기
		sDate = $targetObj.children("span").html();		//기존에 저장되어있는 span 태그 호출
		var aSplit = new String(sDate).split("|");		//start|end 데이터를 split으로 분리한다.
		sDate = sMode == "W" ? aSplit[0] : nShift < 0 ? aSplit[0] : aSplit[1];	//W일때는 기준일을 그냥 반환하고, 이전/이후 버튼 클릭에 따라서 맞는 데이터 설정
	}else{
		sDate = oDate;
	}
	
	sDate = isNullToString(nShift == 0 ? "" : sDate,today());//date값이 널이면 오늘날짜로 설정(nShift가 0이면 초기화를 위해 오늘 날짜를 설정한다.)
	sFormat = isNullToString(sFormat,"YYYYMMDD");		//기본 포멧 설정
	
	if(sMode == "W") {									//주 이동 시
		shiftVal = getDateShift(sDate, "D", nShift);	//기준일로부터 7일을 뺀다.
		var nWeek = new Date(shiftVal.substr(0,4), shiftVal.substr(4,2) - 1, shiftVal.substr(6,2)).getDay();
		if(nWeek == 0){									//일요일 일때..
			startDay = getDateShift(shiftVal, "D", -6);
			endDay = sDate;
		}else{											//월~토요일 일때..
			startDay = getDateShift(shiftVal, "D", 1 - nWeek);
			endDay = getDateShift(shiftVal, "D", 7 - nWeek);
		}
		sDate = setDateFormat(startDay, sFormat) + ' - '+setDateFormat(endDay, sFormat);
	}else{
		if(sMode.length > 1){							//달력 기간을 초기 설정하기 위해 "M_3" 형태의 initData 추가.
			var aInit = new String(sMode).split("_");	//초기화를 위해 날짜 종류와 기간을 분리.
			sMode = aInit[0];							//날짜 종류 다시 설정
			nShift = parseInt("-"+aInit[1]) + 1;		//날짜 기간 다시 설정
		}
		shiftVal = getDateShift(sDate, sMode, nShift);
		//조회한 방법에 따라 start 및 end date 설정 shift date가 태그 혹은 사용자에게 받은 날짜보다 작거나 같으면 start에 shift date를 설정한다. 그 반대로 shift date가 크면 end에 설정한다.
		if(parseInt(shiftVal) <= parseInt(sDate)){
			startDay = shiftVal;
			endDay = Math.abs(nShift) > 1 ? sDate : shiftVal;
		} else {
			startDay = Math.abs(nShift) > 1 ? sDate : shiftVal;
			endDay = shiftVal;
		}
		if(Math.abs(nShift) > 1){
			sDate = setDateFormat(startDay, sFormat) + ' - '+setDateFormat(endDay, sFormat);
		}else{
			sDate = setDateFormat(shiftVal, sFormat);
		}
	}

	if(typeof oDate === 'object'){
		$targetObj.empty();
		$targetObj.append(sDate + '<span style="display:none;">' + startDay + '|' + endDay +'</span>');//alert(sDate + '<span style="display:none;">'+shiftVal+'</span>');
	}
	
    var rtnMap = new Map();
    rtnMap.put("sDate",startDay);
    rtnMap.put("eDate",endDay);
    rtnMap.put("sDateFm",setDateFormat(startDay, sFormat));
    rtnMap.put("eDateFm",setDateFormat(endDay, sFormat));
    return rtnMap;
}


/**********************************************************************************
 * 현재시간과 등록된 시간의 차를 메시지로 리턴한다.
 * @param	sDate	- "YYYYMMDDHHMISS형식 또는 YYYY-MM-DD HH:MI:SS" 형식의 날짜스트링
 * @returns	string
 *********************************************************************************/
function diffTimeCheck(sDateTmp)
{
	var sec = 60;
	var mins = 60;
	var hours = 24;
	var days = 30;
	var month =12;
	var sDate='';
	if(sDateTmp.length==14){
		if(webkit != undefined){
			sDate = setDateFormat(sDateTmp,"YYYY-MM-DDTHH:MI:SS+09:00");
		}else{
			sDate = setDateFormat(sDateTmp,"YYYY-MM-DD HH:MI:SS");
		}
	}else{
		sDate=sDateTmp;
	}
	 //시간차 비교 : 현재시간 - 등록된시간
	 //현재시간
	 var tday = new Date();
	 var cday = new Date(sDate);
	 var difftime = Math.floor((tday - cday)/1000);
	 var msg="";
	 
	 if(sDate == "0000-00-00T00:00:00"){
		 msg = 0;
	 }
	 else if(difftime < sec){
		 msg="방금";
	 }else if((difftime /=sec) < mins){
		 msg=Math.floor(difftime) + "분";
	 }else if((difftime /=mins) < hours){
		 msg=Math.floor(difftime) + "시간";
	 }else if((difftime /=hours) < days){
		 msg=Math.floor(difftime) + "일";
	 }else if((difftime /=days) < month){
		 msg=Math.floor(difftime) + "달";
	 }else {
		 msg=Math.floor(difftime) + "년";
	 }
	return msg+"전";
} 


/**********************************************************************************
 * default 날짜값으로 오늘날짜를 placeholder 에 나타낼 수 있다.
 * @param	클래스 아이디
 * @returns	string
 *********************************************************************************/

//function todayPlaceholder(toTarget){
function todayPlaceholder(toStartTarget,toEndTarget){
	var date = new Date();
	var YY = date.getFullYear();
	var MM = date.getMonth()+1+"";
	var DD = date.getDate();
	if(MM < 10) {
	   MM = "0" + MM;
	}
	    
	if(DD < 10) {
	   DD = "0" + DD;
	}
    var today = YY+"-"+MM+"-"+DD;
//    $(toTarget).attr("placeHolder",today);
    $(toStartTarget).val(today);
    $(toEndTarget).val(today);
}

/**********************************************************************************
 * 날짜값을 원하는 format로 변환
 * @param	sDate(날짜) : YYYYMMDD, sType(형태) 1,2,3,4
 * @returns	format별 날짜형태
 * 1 : 날짜기본형(월, 일)		 				ex. 1월 1일
 * 2 : 날짜요일형(월, 일, 요일)					ex. 1월 1일 (수)
 * 3 : 날짜, 요일, 시간형(월, 일, 요일, 시간)	ex. 1월 1일 (수) 오전 01:01
 * 4 : 날짜 축약형(월일)						ex. 1.1
 * 5 : 날짜, 요일 축약형(월, 일, 요일)			ex. 1.1 (화)
 * 6 : 월										ex. 3월
 * 7 : 날짜 시간형								ex. 1월 1일 오전 01:01	
 * 8 : (년제외) 날짜축약형(월일)				ex. 1.1
 * 9 : (년제외) 날짜기본형(월일)				ex. 1월 1일
 * 10 : 24시간 형식형 (월, 일, 요일, 시간)		ex. 1월 1일 (수) 13:01
 * 11 : 월										ex. 1
 * 12 : 일										ex. 1
 * 13 : 요일									ex. (수)
 *********************************************************************************/
function commonDataFormat(sDate,sType){

	if(isNullToString(sDate) == "") sDate = today("",true);
	sDate = getReplace(sDate,CMMN_SPCL_CHAR,"").toTrim();

	var sTime = parseInt(isNullToString(sDate.substr(8,2),"00"));	
	var rtnTime = (sTime > 12 ? sTime % 12 : sTime);
	
	//sDate 년, 월, 일 구분
	var yy = sDate.substr(0,4);
	var mm = sDate.substr(4,2);
	var dd = sDate.substr(6,2);
	var d  = new Date(yy,mm - 1, dd);

	//sTime 시간 구분
	var hh = rtnTime < 10 ? "0"+rtnTime : ""+rtnTime;
	var mi = isNullToString(sDate.substr(10,2),"00")
	var ap = sTime > 11 ? "오후" : "오전";

	mm = mm.replace(/(^0+)/, "");
	dd = dd.replace(/(^0+)/, "");
	
	//올해 년도 4자리
	var now  = new Date();
	var thisYear = now.getFullYear();
	
	//요일 배열 생성
	var weekDay = new Array('(일)','(월)','(화)','(수)','(목)','(금)','(토)');
	d = weekDay[d.getDay()];

	var sTime = parseInt(isNullToString(sDate.substr(8,2),"00"));
	var rtnTime = (sTime > 12 ? sTime % 12 : sTime);
	var sRtnStr;

	if(yy == now.getFullYear()){
		if(sType == 1){	
			sRtnStr = mm+"월 " + dd+"일";
		}else if(sType == 2){
			sRtnStr = mm+"월 " + dd+"일 " + d;			
		}else if(sType == 3){
			sRtnStr = mm+"월 " + dd+"일 " + d + " "+ ap + " " + hh + ":" + mi;
		}else if(sType == 4){
			sRtnStr = mm+"."+dd;
		}else if(sType == 5){
			sRtnStr = mm+"."+dd+" " + d;
		}else if(sType == 6){
			sRtnStr = mm+"월"
		}else if(sType == 7){
			sRtnStr = mm+"월 " + dd+"일 " + " "+ ap + " " + hh + ":" + mi;
		}else if(sType == 8){
			sRtnStr = mm+"."+dd;	
		}else if(sType == 9){
			sRtnStr = mm+"월 "+dd+"일";
		}else if(sType == 10){
			sRtnStr = mm+"월 " + dd+"일 " + d + " "+ sTime + ":" + mi;
		}else if(sType == 11){
			sRtnStr = mm;
		}else if(sType == 12){
			sRtnStr = dd;
		}else if(sType == 13){
			sRtnStr = d;
		}
	}else{
		if(sType == 1){	
			sRtnStr = yy+"년 " + mm+"월 " + dd+"일";
		}else if(sType == 2){
			sRtnStr = yy+"년 " + mm+"월 " + dd+"일 " + d;		
		}else if(sType == 3){
			sRtnStr = yy+"년 " + mm+"월 " + dd+"일 " + d + " "+ ap + " " + hh + ":" + mi;					
		}else if(sType == 4){
			sRtnStr = yy+"."+mm+"."+dd;
		}else if(sType == 5){
			sRtnStr = yy+"."+mm+"."+dd+d;
		}else if(sType == 6){
			sRtnStr = yy+"년 " + mm+"월 ";
		}else if(sType == 7){
			sRtnStr = yy+"년 " + mm+"월 " + dd+"일 " + " "+ ap + " " + hh + ":" + mi;		
		}else if(sType == 8){
			sRtnStr = mm+"."+dd;
		}else if(sType == 9){
			sRtnStr = mm+"월 "+dd+"일";
		}else if(sType == 10){
			sRtnStr = mm+"월 " + dd+"일 " + d + " "+ sTime + ":" + mi;		
		}else if(sType == 11){
			sRtnStr = mm;
		}else if(sType == 12){
			sRtnStr = dd;
		}else if(sType == 13){
			sRtnStr = d;
		}
		
	}
	return sRtnStr;		
}

/**********************************************************************************
 * 시간항목을 AP HH:MI 원하는 format로 변환
 * @param	sTime(시간) : hhmiss
 * @returns	format별 시간형태
 * AP  : (오후) 10:10 
 * 24H : 20:00 
 *********************************************************************************/
function commonTimeFormat(sTime, sType){

	var sRtnStr;
	var now = new Date();

	if(isNullToString(sTime.replace(/:/g, "")) == ""){
		var hour   = now.getHours(); 
    	var minute = now.getMinutes(); 
    	var second = now.getSeconds();
    	
    	if (hour < 10) {
    		  hour = "0" + hour; 
    		}
    	if (minute < 10){ 
    		  minute = "0" + minute; 
    		}
    	if(second < 10){ 
    		  second = "0" + second;
    		} 
    	sTime =  hour+""+minute;
	}

	if(sType == "AP"){
		var rtnTime = (sTime.substr(0,2) > 12 ? sTime.substr(0,2) % 12 : sTime.substr(0,2));
		var hh = rtnTime;		
		var mi = isNullToString(sTime.substr(2,2),"00");
		var ap = sTime.substr(0,2) > 11 ? "오후" : "오전";	
		sRtnStr = ap + " " + hh + ":" + mi;	
	}
	if(sType == "24H"){
		var hh = sTime.substr(0,2);
		var mi = isNullToString(sTime.substr(2,2),"00");
		sRtnStr = hh + ":" + mi;			
	}	
	return sRtnStr;
}	



/**********************************************************************************
 * 기준 시간 항목에 시간 더하기
 * @param	 sTime(시간) : hhmm
 *           pMin (분)   
 * @returns	 HH:MI 시간형태
 * 
 *********************************************************************************/
function setAddTm(sTime, pMin){
	
	var sRtnTm;
	var tmpMin = 0;
	
	var sTime = sTime.replace(/:/g, "");
	var tmpHH = Number(sTime.substr(0,2));
	var tmpMI = Number(isNullToString(sTime.substr(2,2),"00"));
	var pMin  = Number(isNullToString(pMin,"0"));
	
	tmpMin = (tmpHH * 60) + tmpMI + pMin;

	var hh = Math.floor(tmpMin / 60);
	var mm = tmpMin % 60;
	
	hh = hh >= 24 ? hh-24 : hh;	
	hh = hh < 10 ? "0" + hh : "" + hh;
	mm = mm < 10 ? "0" + mm : "" + mm;
	
	sRtnTm = hh + ":" + mm; 

	return sRtnTm;
}	


/**********************************************************************************
 * 기준날짜 일주일 기간 구하기
 * @param	 sTime(시간) : hhmm
 *           pMin (분)   
 * @returns	 1월 1일 ~ 1월 7일 * 
 *********************************************************************************/
function getWeekPeriod(sDate){
	//올해 년도 4자리
	var now  = new Date();
	var thisYear = now.getFullYear();
	var date = new Date();	
	if(isNullToString(sDate) == "") sDate = today("",true);
	sDate = getReplace(sDate,CMMN_SPCL_CHAR,"").toTrim();	
	
	var yy  = sDate.substr(0,4);
	var mm  = sDate.substr(4,2); 
	var dd  = sDate.substr(6,2);
	var weekDay = new Array('','(일)','(월)','(화)','(수)','(목)','(금)','(토)');

	
	
	var curDay  = new Date(yy, mm-1, dd);
	var theDayOfWeek = curDay.getDay();
	
	if(theDayOfWeek == 0){
		var curDay = new Date(yy, mm-1, dd-7);
	}

	var theYY = curDay.getFullYear();
	var theMM = curDay.getMonth();
	var theDD = curDay.getDate();	
	var stDate  = new Date(theYY, theMM, theDD + (1-theDayOfWeek));
	var endDate = new Date(theYY, theMM, theDD + (7-theDayOfWeek));	
	
	if(endDate > now){
		endDate = now;
	}
	
	var sRtnSt;
	var sRtnEnd;

	
	var stMonth = parseInt(stDate.getMonth()+1);	
	var endMonth = parseInt(endDate.getMonth()+1);	

	if(stDate.getFullYear() == thisYear){
		sRtnSt = stMonth+"월 "+ stDate.getDate()+"일";
	}else{
		sRtnSt = stDate.getFullYear()+"년 "+stMonth+"월 "+stDate.getDate()+"일";		
	}
	
	if(endDate.getFullYear() == thisYear){
		sRtnEnd = endMonth+"월 "+endDate.getDate()+"일";
	}else{
		sRtnEnd = endDate.getFullYear()+"년 "+endMonth+"월 "+endDate.getDate()+"일";		
	}

	sRtnStr = sRtnSt + " ~ " + sRtnEnd;
	return sRtnStr;
}


/**********************************************************************************
 * new Date() 날짜 변환
 * @param	 sDateStr : Fri Mar 02 2018 16:10:56 GMT+0900 (대한민국 표준시)
 * @returns	 YYYYMMDD 
 *********************************************************************************/
function convertDate(sDateStr){
	
	var newDate = sDateStr;
	var rtnDate;
	
	var yyyy = newDate.getFullYear().toString();
	var mm   = (newDate.getMonth()+1).toString();
	var dd   = newDate.getDate().toString(); 

	var mmChars = mm.split('');
	var ddChars = dd.split('');
	
	var rtnDate = yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);


	return rtnDate;
}

/**********************************************************************************
 * String을 Date() 타입으로 날짜 변환
 * @param	 sDateStr : YYYYMMDD
 * @returns	 Fri Mar 02 2018 00:00:00 GMT+0900 (대한민국 표준시)
 *********************************************************************************/
function convertStrToDate(sDateStr){
	if(isNullToString(sDateStr) == "") sDateStr = today("",true);
	
	var y = sDateStr.substr(0, 4);
	var m = sDateStr.substr(4, 2);
	var d = sDateStr.substr(6, 2);
	
	return new Date(y, m-1, d);
}




/**********************************************************************************
 * 시간 차를 메시지로 리턴한다.
 * @param	startDt	- "YYYYMMDDHHMISS형식 또는 YYYY-MM-DD HH:MI:SS" 형식의 날짜스트링
			endDt	- "YYYYMMDDHHMISS형식 또는 YYYY-MM-DD HH:MI:SS" 형식의 날짜스트링
 * @returns	format별 날짜형태
 * 1 : 00:00:00
 * 2 : 분 형식만 return
 * 3 : 초 형식만 return
 * 4 : 시간을 초 형식으로 return
 *********************************************************************************/
function diffTimeBtwn(startDt, endDt, sType){
	if(isNullToString(sType) == "") sType = 1;
	
	var sec = 60;
	var mins = 60;
	var hours = 24;
	var days = 30;
	var month =12;
	
	var fst_sDate = '';
	var lst_sDate = '';
	
	if(startDt.length == 14){
		if(webkit != undefined){
			fst_sDate = setDateFormat(startDt,"YYYY-MM-DDTHH:MI:SSZ");
		}else{
			fst_sDate = setDateFormat(startDt,"YYYY-MM-DD HH:MI:SS");
		}
	}else{
		fst_sDate = startDt;
	}
	if(endDt.length == 14){
		if(webkit != undefined){
			lst_sDate = setDateFormat(endDt,"YYYY-MM-DDTHH:MI:SSZ");
		}else{
			lst_sDate = setDateFormat(endDt,"YYYY-MM-DD HH:MI:SS");
		}
	}else{
		lst_sDate = endDt;
	}

	//시간차 비교 : endDt - startDt
	 var fst_day = new Date(fst_sDate);
	 var lst_day = new Date(lst_sDate);
	 var msg;
	 
	 var ss = Math.floor((lst_day - fst_day)/1000);
	 var mm = Math.floor(ss / 60);
	 var hh = Math.floor(mm / 60);
	 
	 var diff_hour = leadingZeros(Math.floor(hh % 24), 2);
	 var diff_min = leadingZeros(Math.floor(mm % 60), 2);
	 var diff_sec = leadingZeros(Math.floor(ss % 60), 2);

	 if(sType == 1){
		 msg = diff_hour + ":" + diff_min + ":" + diff_sec;
	 }else if(sType == 2){
		 if(diff_min > 0){
			 msg = Number(diff_min);
		 }else{
			 msg = Number(diff_sec)/60;
		 }
	 }else if(sType == 3){
		 msg = Number(diff_sec);
	 }else if(sType == 4){
		 msg = Number(diff_min) * 60 + Number(diff_sec);
	 }

	 return msg;
} 


/**********************************************************************************
 * 분을 시간과 분 형식으로 변환한다
 * @param	mins
			type	- h, m, hm
 * @returns	
 *********************************************************************************/
function convertMinsToHrsMins(mins, type) {
	var rsStr = "";

	if(isNaN(mins)){
		return "0분";
	}

	  var h = Math.floor(mins / 60);
	  var m = mins % 60;
//	  h = h < 10 ? '0' + h : h;
//	  m = m < 10 ? '0' + m : m;
	  
	  if(String(m).indexOf(".") != -1){
		  m = Math.round(m);
	  }

	  if(type == "h"){
		  rsStr = h;
	  }else if(type == "m"){
		  rsStr = m;
	  }else if(type == "hm" || type == ""){
		  if(h != 0 && m != 0){
			  rsStr = h + '시간 ' + m + '분';
		  }else
			  if(h != 0){
				  rsStr = h + '시간';
			  }else{
				  rsStr = m + '분';
			  }
	  }

	  return rsStr;
}


/********************************************************************
 * 메인에 표현할 날짜포멧 설정
 * @param	sDate	- 년월일 시분초 max 14자리 문자열, 만약 ""을 입력하면 today() 적용
 * 			sFormat	- 
 * @returns	string
 *******************************************************************/
function setMainDateFormat(sDate){
	
	if(typeof(sDate) == "number") sDate = String(sDate);

	if(isNullToString(sDate) == ""){
		return "날짜정보없음";
	}

	var now = new Date();
	
	var yesterday = now.getTime() - (1*24*60*60*1000);
	var yDate = new Date(yesterday);

	var sTime = parseInt(isNullToString(sDate.substr(8,2),"00"));
	var rtnTime = (sTime > 12 ? sTime % 12 : sTime);

	var sFormat = setDateFormat(sDate,"YYYY-MM-DD");
	var cmprDate = new Date(sFormat);
	
//	console.log("C " + cmprDate.toString());
//	console.log("N " + now.toString());
//	console.log("Y " + yDate.toString());
	
	if(yDate.getFullYear() == cmprDate.getFullYear()
			&& yDate.getMonth() == cmprDate.getMonth()
			&& yDate.getDate() == cmprDate.getDate()){	//어제인가?
		return setDateFormat(sDate, "어제 AP HH:MI");
	}else if(now.getFullYear() == cmprDate.getFullYear()){	//연도가 같은가?
		if(now.getMonth() == cmprDate.getMonth()
				&& now.getDate() == cmprDate.getDate()){	//오늘인가?
			return setDateFormat(sDate, "오늘 AP HH:MI");
		}else{
			return setDateFormat(sDate, "MM월 DD일 AP HH:MI");
		}
	}else{
		return setDateFormat(sDate, "YYYY년 MM월 DD일");
	}
	
}

/**********************************************************************************
 * 날짜 차이를 계산
 * @param	startDe	- "YYYYMMDD형식의 날짜스트링
			endDe	- "YYYYMMDD형식의 날짜스트링
 * @returns	sType 별 계산
 * 1 : 일수
 * 2 : 월수
 * 3 : 년수
 *********************************************************************************/
function diffDate(startDe, endDe, sType){
	if(isNullToString(sType) == "") sType = 1;
	
	var beginYear = startDe.substring(0,4);
	var beginMonth = leadingZeros(Number(startDe.substring(4,6))-1);
	var beginDay = startDe.substring(6,8);
	
	var endYear = endDe.substring(0,4);
	var endMonth = leadingZeros(Number(endDe.substring(4,6))-1);
	var endDay = endDe.substring(6,8);
	
	var beginDate = new Date(beginYear, beginMonth, beginDay);
	var endDate = new Date(endYear, endMonth, endDay);
	
	var diff = endDate - beginDate;
    var currDay = 24 * 60 * 60 * 1000;// 시 * 분 * 초 * 밀리세컨
    var currMonth = currDay * 30;// 월 만듬
    var currYear = currMonth * 12; // 년 만듬
    
    var rtnVal;
    
    if(sType == 1){
    	rtnVal = parseInt(diff/currDay);
    }else if(sType == 2){
    	rtnVal = parseInt(diff/currMonth);
    }else if(sType == 3){
    	rtnVal = parseInt(diff/currYear);
    }
    
    return rtnVal;
} 





//숫자 앞에 0을 채워넣는 함수
function leadingZeros(date, num) {
	 var zero = '';
	 date = date.toString();
	
	 if (date.length < num) {
	  for (i = 0; i < num - date.length; i++)
	   zero += '0';
	 }
	 return zero + date;
}
