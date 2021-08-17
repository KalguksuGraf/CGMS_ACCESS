var curDate = "";
var bgnDe = "";
var endDe = "";
var curTabMenu = 'S';
var curTabCnt = 1;
var shiftCnt = 0;

var now = new Date();
var firstMonth, lastMonth, firstWeek, lastWeek;
firstMonth = new Date(now.getFullYear(), now.getMonth(),1);
lastMonth = new Date(now.getFullYear(), now.getMonth()+1,0);
firstWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (1-now.getDay()));
lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7-now.getDay()));

$(document).ready(function(){;
	bgnDe = setDateFormat("", "YYYYMMDD");
	endDe = setDateFormat("", "YYYYMMDD");
	
	setStats(bgnDe, endDe);
});

//탭 클릭 이벤트
$(document).on("click", ".tabMenu", function(){
	$('.tabMenu').removeClass('tab_on');
	$(this).addClass('tab_on');
	$('.tabDay').removeClass('tab_on');
	
	if($(this).attr('id') == "tab_s"){
		curTabMenu = 'S';
		bgnDe = setDateFormat("", "YYYYMMDD");
		endDe = setDateFormat("", "YYYYMMDD");
		curTabCnt = 1;
		$("#sDayId").addClass('tab_on');
	}else{
		curTabMenu = 'R';
		bgnDe = convertDate(firstWeek).replace(/-/gi, '');
		endDe = convertDate(lastWeek).replace(/-/gi, '');
		curTabCnt = 7;
		$("#rWeekId").addClass('tab_on');
	}
	
	setStats(bgnDe, endDe);
});

//탭 클릭 이벤트
$(document).on("click", ".tabDay", function(){
	$('.tabDay').removeClass('tab_on');
	$(this).addClass('tab_on');
	
	if($(this).attr('id') == "sMonthId" || $(this).attr('id') == "rMonthId"){
		firstMonth = new Date(now.getFullYear(), now.getMonth(),1);
		lastMonth = new Date(now.getFullYear(), now.getMonth()+1,0);
		bgnDe = convertDate(firstMonth).replace(/-/gi, '');
		endDe = convertDate(lastMonth).replace(/-/gi, '');
		curTabCnt = 30;
		shiftCnt = 0;
	}else if($(this).attr('id') == "sWeekId" || $(this).attr('id') == "rWeekId"){
		bgnDe = convertDate(firstWeek).replace(/-/gi, '');
		endDe = convertDate(lastWeek).replace(/-/gi, '');
		curTabCnt = 7;
	}else if($(this).attr('id') == "sDayId"){
		bgnDe = setDateFormat("", "YYYYMMDD");
		endDe = setDateFormat("", "YYYYMMDD");
		curTabCnt = 1;
	}
	
	setStats(bgnDe, endDe);
});

// 다음 버튼 클릭 이벤트
$(document).on("click", ".swiper-button-next", function(){
	if(curTabCnt == 30){
		firstMonth = new Date(now.getFullYear(), now.getMonth()+(shiftCnt+1),1);
		lastMonth = new Date(now.getFullYear(), now.getMonth()+1+(shiftCnt+1),0);
		bgnDe = convertDate(firstMonth).replace(/-/gi, '');
		endDe = convertDate(lastMonth).replace(/-/gi, '');
		shiftCnt++;
	}else{
		bgnDe = getDateShift(bgnDe, "YYYYMMDD", curTabCnt, "YYYYMMDD");
		endDe = getDateShift(endDe, "YYYYMMDD", curTabCnt, "YYYYMMDD");
	}
	setStats(bgnDe, endDe);
});

// 이전 버튼 클릭 이벤트
$(document).on("click", ".swiper-button-prev", function(){
	if(curTabCnt == 30){
		firstMonth = new Date(now.getFullYear(), now.getMonth()-1+shiftCnt,1);
		lastMonth = new Date(now.getFullYear(), now.getMonth()+shiftCnt,0);
		bgnDe = convertDate(firstMonth).replace(/-/gi, '');
		endDe = convertDate(lastMonth).replace(/-/gi, '');
		shiftCnt--;
	}else{
		bgnDe = getDateShift(bgnDe, "YYYYMMDD", -curTabCnt, "YYYYMMDD");
		endDe = getDateShift(endDe, "YYYYMMDD", -curTabCnt, "YYYYMMDD");
	}
	setStats(bgnDe, endDe);
});

function setStats(BGN_DE, END_DE){
	var titleTxt = Number(BGN_DE.substring(4,6)) + "월 " + Number(BGN_DE.substring(6,8)) + "일";
	
	if(curTabCnt == 7){
		titleTxt = Number(BGN_DE.substring(4,6)) + "월 " + Number(BGN_DE.substring(6,8)) + "일 ~ " + Number(END_DE.substring(4,6)) + "월 " + Number(END_DE.substring(6,8)) + "일";
	}else if(curTabCnt == 30){
		titleTxt = Number(BGN_DE.substring(4,6)) + "월 ";
	}
	
	$(".dateTitle").text(titleTxt);
		
	var userId = sessionStorage.getItem("USER_ID");
	
	if(curTabMenu == 'S'){
		cmmnAjax("appGlu/rt/selectTotStatsInfo.do", {SESS_USER_ID:userId, BGN_DE:BGN_DE, END_DE:END_DE}, function (data){
			
			if(isNullToString(data.totStatsInfo) != ""){
				var totStatsInfo = data.totStatsInfo;
				
				$("#avgValueTxt").html(totStatsInfo.AVG_VALUE+ "<span>mg/dL</span>");
				$("#stddevValueTxt").html(totStatsInfo.STDDEV_VALUE+ "<span>mg/dL</span>");
				$("#maxValueTxt").html(totStatsInfo.MAX_VALUE+ "<span>mg/dL</span>");
				$("#minValueTxt").html(totStatsInfo.MIN_VALUE+ "<span>mg/dL</span>");
			}else{
				$("#avgValueTxt").html("<span>mg/dL</span>");
				$("#stddevValueTxt").html("<span>mg/dL</span>");
				$("#maxValueTxt").html("<span>mg/dL</span>");
				$("#minValueTxt").html("<span>mg/dL</span>");
			}
	    });
		
		cmmnAjax("appGlu/rt/selectStatsRangeInfo.do", {SESS_USER_ID:userId, BGN_DE:BGN_DE, END_DE:END_DE}, function (data){
			
			$("#rangeGraphDiv").empty();
			if(isNullToString(data.statsRangeInfo) != ""){
				var statsRangeInfo = data.statsRangeInfo;
				
				$("#normalPerTxt").text(statsRangeInfo.NORMAL_PER + "%");
				$("#highPerTxt").text(statsRangeInfo.HIGH_PER + "%");
				$("#lowPerTxt").text(statsRangeInfo.LOW_PER + "%");
				$("#emerPerTxt").text(statsRangeInfo.EMER_PER + "%");
				
				var chartAvgCalData = [];			
				chartAvgCalData.push({
					"avgCal1"	: statsRangeInfo.NORMAL_PER,
					"avgCal2"	: statsRangeInfo.HIGH_PER,
					"avgCal3"	: statsRangeInfo.LOW_PER,
					"avgCal4"	: statsRangeInfo.EMER_PER
				});
				
				var avgCalChart = new AvgCalChart({
					"donut":{"div":"#rangeGraphDiv"}
					, "colors":["#CCCCCC", "#FFDF3B", "#F8070F", "#6939EF"]
			    });
				
				if(isNullToString(chartAvgCalData)!=""){
					avgCalChart.insertData(chartAvgCalData);
				}
				
			}else{
				$("#rangeGraphDiv").empty();
				$("#normalPerTxt").text("");
				$("#highPerTxt").text("");
				$("#lowPerTxt").text("");
				$("#emerPerTxt").text("");
			}
	    });
		
		cmmnAjax("appGlu/rt/selectTimeRangeList.do", {SESS_USER_ID:userId, BGN_DE:BGN_DE, END_DE:END_DE}, function (data){
			var sb = new StringBuffer();
			
			if(isNullToString(data.timeRangeList) != ""){
				var timeRangeList = data.timeRangeList;
				
				var chartDayCalData = [];
				for(var i = 0; i < timeRangeList.length; i++){				
					chartDayCalData.push({
						"no"		: timeRangeList[i].HOUR + ":00",
						"data1"	: timeRangeList[i].EMER_PER,
						"data2"	: timeRangeList[i].EMER_PER + timeRangeList[i].LOW_PER,
						"data3"	: timeRangeList[i].EMER_PER + timeRangeList[i].LOW_PER + timeRangeList[i].NORMAL_PER,
						"data4"	: timeRangeList[i].EMER_PER + timeRangeList[i].LOW_PER + timeRangeList[i].NORMAL_PER + timeRangeList[i].HIGH_PER
					});
				}
				
				$("#timeRangeGraphDiv").empty();
				var stackChart = new BarStackChart({
						"div"		 : "#timeRangeGraphDiv"
					,	"minMax"	 : [ 0, 100 ]
					,	"colors"	 : ["#EEEEEE", "#FFDF3B", "#CCCCCC", "#F8070F", "#6939EF", "#EEEEEE"]
					,	"goalValue"  : [ 100 ]
				});
			
				if (isNullToString(chartDayCalData) != "") {
					stackChart.insertData(chartDayCalData);
				}
				
			}else{
				
			}
	    });
		
		cmmnAjax("appGlu/rt/selectTimeCntncInfo.do", {SESS_USER_ID:userId, BGN_DE:BGN_DE, END_DE:END_DE}, function (data){
			if(isNullToString(data.timeCntncInfo) != ""){
				var timeCntncInfo = data.timeCntncInfo;
				
				var miTmp = isNullToString(timeCntncInfo.NORMAL_VALUE) % 60;
				miTmp = miTmp < 10 ? "0" + miTmp : miTmp;
				var normalTm = Math.floor(isNullToString(timeCntncInfo.NORMAL_VALUE) / 60) + ":" + miTmp;
				
				miTmp = isNullToString(timeCntncInfo.HIGH_VALUE) % 60;
				miTmp = miTmp < 10 ? "0" + miTmp : miTmp;
				var higtTm = Math.floor(isNullToString(timeCntncInfo.HIGH_VALUE) / 60) + ":" + miTmp;
				
				miTmp = isNullToString(timeCntncInfo.LOW_VALUE) % 60;
				miTmp = miTmp < 10 ? "0" + miTmp : miTmp;
				var lowTm = Math.floor(isNullToString(timeCntncInfo.LOW_VALUE) / 60) + ":" + miTmp;
				
				miTmp = isNullToString(timeCntncInfo.EMER_VALUE) % 60;
				miTmp = miTmp < 10 ? "0" + miTmp : miTmp;
				var emerTm = Math.floor(isNullToString(timeCntncInfo.EMER_VALUE) / 60) + ":" + miTmp;
				
				$("#normalTmTxt").text(normalTm);
				$("#highTmTxt").text(higtTm);
				$("#lowTmTxt").text(lowTm);
				$("#emerTmTxt").text(emerTm);
				
				$("#normalTmPer").css("width", isNullToString(timeCntncInfo.NORMAL_PER,"0") + "%");
				$("#highTmPer").css("width", isNullToString(timeCntncInfo.HIGH_PER,"0") + "%");
				$("#lowTmPer").css("width", isNullToString(timeCntncInfo.LOW_PER,"0") + "%");
				$("#emerTmPer").css("width", isNullToString(timeCntncInfo.EMER_PER,"0") + "%");
			}else{
				$("#normalTmTxt").text("0:00");
				$("#highTmTxt").text("0:00");
				$("#lowTmTxt").text("0:00");
				$("#emerTmTxt").text("0:00");
				
				$("#normalTmPer").css("width", "0%");
				$("#highTmPer").css("width", "0%");
				$("#lowTmPer").css("width", "0%");
				$("#emerTmPer").css("width", "0%");
			}
	    });
		
		
		$("#rptChart").empty();
		var selUrl = 'appGlu/rt/selectTimelineAvgChartData.do';
		if(curTabCnt == 1){
			selUrl = 'appGlu/tl/selectTimelineChartData.do';
		}
		cmmnAjax(selUrl, {SESS_USER_ID:userId, DE:BGN_DE, END_DE:END_DE}, function (result){
			var chartData = [];

			var minVal = 0;		//Number.MAX_VALUE;
			var maxVal = Number.MIN_VALUE;
			var list = result.chartDataList;
			var stdVal = result.stdMap;
			
//			console.log(JSON.stringify(list));
			for (var i=0; i<list.length; i++) {
//				if( minVal > list[i].Y ) minVal = list[i].Y;
			    if( maxVal < list[i].Y ) maxVal = list[i].Y;

			    if(list[i].Y > 0){
			    	var measrTm = list[i].MEASR_TM.substring(0, 4);
			    	var measrHH = measrTm.substring(0,2);
			    	var measrMI = measrTm.substring(2,4);
			    	var minute = Number(measrHH) * 60 + Number(measrMI);
			    	var data = {
			    			"x" : minute
			    			, "y" : list[i].Y
			    	};
			    	
			    	chartData.push(data);
			    }
			}

//			if(minVal == Number.MAX_VALUE || minVal < 50){
//				minVal = 0;
//			}else{
//				minVal -= 50;
//			}
			if(maxVal == Number.MIN_VALUE){
				maxVal = 200;
			}else{
				maxVal += 50;
			}
			
			var rptChart = new CgmRptChart({
				  "div"			: "#rptChart"
				, "width"		: $("#rptChart").width()
				, "height"		: $("#rptChart").height()
				, "minMax"		: [minVal, maxVal]
				, "columns"		: [ "y" ]
				, "baseColumns"	: "x"
				, "colors"		:["#fff","rgba(204, 204, 204, 1)", "rgba(255, 223, 59, 1)", "rgba(201, 0, 48, 1)", "rgba(248, 24, 115, 1)"]
				, "highVal"		: stdVal.HIGH_VAL
				, "lowVal"		: stdVal.LOW_VAL
			});
			
			rptChart.insertData(chartData);
		});
	}else{
		
		cmmnAjax("appGlu/rt/selectCgmValDayChart.do", {SESS_USER_ID:userId, BGN_DE:BGN_DE, END_DE:END_DE}, function (data){
			var sb = new StringBuffer();
			
			if(isNullToString(data.cgmValDayChart) != ""){
				var cgmValDayList = data.cgmValDayChart;
				
				var chartDayCalData = [];
				for(var i = 0; i < cgmValDayList.length; i++){				
					chartDayCalData.push({
						"no"	: cgmValDayList[i].DY_NM,
						"data1"	: cgmValDayList[i].AVG_VAL,
						"data2"	: cgmValDayList[i].MAX_VAL,
						"data3"	: cgmValDayList[i].MAX_VAL-cgmValDayList[i].MIN_VAL
//						"data4"	: 0
					});
				}
				
				$("#cgmValDayChartDiv").empty();
				var stackChart = new cgmStackLineChart({
						"div"		 : "#cgmValDayChartDiv"
					,	"minMax"	 : [ 0, 400 ]
					,	"colors"	 : ["#EEEEEE", "#CCCCCC", "#a30085", "#F8070F", "#6939EF", "#EEEEEE"]
					,	"goalValue"  : [ 100 ]
				});
			
				if (isNullToString(chartDayCalData) != "") {
					stackChart.insertData(chartDayCalData);
				}
				
			}else{
				
			}
	    });
		
		cmmnAjax("appGlu/rt/selectActDayChart.do", {SESS_USER_ID:userId, BGN_DE:BGN_DE, END_DE:END_DE}, function (data){
			$(".dy").removeClass("high");
			$(".dy").addClass("normal");
			if(isNullToString(data.actDayChart) != ""){
				var setVal = data.actDayChart;			
				var objVal = 10000;
				var maxVal = 0;
				var totVal = 0; 
					
				$(".dy").each(function(i) {					
					maxVal = maxVal > Number(setVal[i].TOT_ACT_CNT) ? maxVal : Number(setVal[i].TOT_ACT_CNT);				
				});
				
				objVal = maxVal > 14286 ? Math.round(maxVal * 0.7) : 10000;
				totVal = maxVal > 14286 ? maxVal : 14286; 
				
				$(".actObj").text(objVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
				$(".dy").each(function(i) {	
					$(this).height(Math.round(Number(setVal[i].TOT_ACT_CNT)/totVal*100) + "%");
					if(maxVal == Number(setVal[i].TOT_ACT_CNT)){
						$(this).removeClass("normal");
						$(this).addClass("high");
					}
				});
				
			}else{
				$(".dy").height("0%");
				$(".actObj").text("10,000");
			}
	    });
		
		cmmnAjax("appGlu/rt/selectmMealDayChart.do", {SESS_USER_ID:userId, BGN_DE:BGN_DE, END_DE:END_DE}, function (data){
			if(isNullToString(data.mealDayChart) != ""){
				
				var setVal = data.mealDayChart;
				var objVal = 2100;
				var maxVal = 0;
				var totVal = 0; 
				
				$(".mealDy").each(function(i) {					
					maxVal = maxVal > Number(setVal[i].TOT_KCAL) ? maxVal : Number(setVal[i].TOT_KCAL);
					$(this).empty();
					if(Number(setVal[i].M_KCAL) > 0){
						$(this).append('<div class="m" style="height:'+setVal[i].M_KCAL_PER+'%"></div>');
					}
					if(Number(setVal[i].A_KCAL) > 0){
						$(this).append('<div class="a" style="height:'+setVal[i].A_KCAL_PER+'%"></div>');
					}
					if(Number(setVal[i].E_KCAL) > 0){
						$(this).append('<div class="e" style="height:'+setVal[i].E_KCAL_PER+'%"></div>');
					}
					if(Number(setVal[i].S_KCAL) > 0){
						$(this).append('<div class="s" style="height:'+setVal[i].S_KCAL_PER+'%"></div>');	
					}
				});
				
				objVal = maxVal > 3000 ? Math.round(maxVal * 0.7) : 2100;
				totVal = maxVal > 3000 ? maxVal : 3000; 
				
				$(".mealObj").text(objVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
				$(".mealDy").each(function(i) {	
					$(this).height(Math.round(Number(setVal[i].TOT_KCAL)/totVal*100) + "%");
				});
				
			}else{
				$(".mealDy").find('.m').height("0%");
				$(".mealDy").find('.a').height("0%");
				$(".mealDy").find('.e').height("0%");
				$(".mealDy").find('.s').height("0%");
				$(".mealObj").text("2,100");
			}
	    });
	}
}