
var symptmsCdNm = ["식은땀", "어지럼증", "두통", "피로", "불안함", "흥분", "공복감", "두근거림", "기타증상"];
var curDate = "";
var cgmChart;



$(document).ready(function(){
	var req = new Request();
	if(!isNull(req.getParameter("de"))){
		curDate = req.getParameter("de");
	}else{
		curDate = setDateFormat("", "YYYYMMDD");
	}	
	setTimeline(curDate);
	setTimelineChart(curDate);
});


//다음 버튼 클릭 이벤트
$(document).on("click", ".swiper-button-next", function(){
	curDate = getDateShift(curDate, "YYYYMMDD", 1, "YYYYMMDD");
	setTimeline(curDate);
	setTimelineChart(curDate);
});

//이전 버튼 클릭 이벤트
$(document).on("click", ".swiper-button-prev", function(){
	curDate = getDateShift(curDate, "YYYYMMDD", -1, "YYYYMMDD");
	setTimeline(curDate);
	setTimelineChart(curDate);
});

function setTimelineChart(date){
	var userId = sessionStorage.getItem('TARGET_USER');
	
	$("#timelineChart").empty();

	cmmnAjax("appGlu/tl/selectTimelineChartData.do", {SESS_USER_ID:userId, DE:date}, function (result){
		var chartData = [];

		var minVal = 0;//Number.MAX_VALUE;
		var maxVal = Number.MIN_VALUE;
		var list = result.chartDataList;
		var stdVal = result.stdMap;
		var actRange = 100;					// 활동량 표현 범위(ex:혈당값 100의 범위를 0값 아래에 활동량으로 표현)

		for (var i=0; i<list.length; i++) {
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

		if(maxVal == Number.MIN_VALUE){
			maxVal = 200;
		}else{
			maxVal += 50;
		}
		
		if(!isNull(result.actChartDataList)){
			minVal = actRange * -1;
		}
		
		cgmChart = new CgmChart({
			  "div"			: "#timelineChart"
			, "width"		: $("#timelineChart").width()
			, "height"		: $("#timelineChart").height()
			, "minMax"		: [minVal, maxVal]
			, "columns"		: [ "y" ]
			, "baseColumns"	: "x"
			, "colors"		:["#fff","rgba(204, 204, 204, 1)", "rgba(255, 223, 59, 1)", "rgba(201, 0, 48, 1)", "rgba(248, 24, 115, 1)"]
			, "highVal"		: stdVal.HIGH_VAL
			, "lowVal"		: stdVal.LOW_VAL
			, "typeColor"	: ["rgba(255,94,127,1)", "rgba(213,24,131,1)", "rgba(23,209,186,1)", "rgba(92,130,235,1)", "rgba(96,210,126,1)", "rgba(255,164,84,1)", "rgba(55,31,120,1)", "rgba(123,123,123,1)"]
			, "margin"		: {top:20, right:10, bottom:30, left:45}
		});
		
		cgmChart.insertData(chartData);
		
		
		if(!isNull(result.actChartDataList)){
			var actChartDataList = result.actChartDataList;
			
			var actData = [];
			var baseCnt = 8000;		// 1시간당 최대값 설정
			
			for(var i = 0; i < actChartDataList.length; i++){
				actData.push({
					"hour"	: actChartDataList[i].MEASR_HOUR
					,"y"	: Math.round((Number(actChartDataList[i].ACT_CNT > baseCnt ? baseCnt : actChartDataList[i].ACT_CNT)) / ((baseCnt / 100) / actRange * 100))
				});
			}
			
			cgmChart.insertActData(actData);
		}
		
	});
}

function setTimeline(date){
	typeData = [];
	$("#dateTitle").text(Number(date.substring(4,6)) + "월 " + Number(date.substring(6,8)) + "일");
	
	$("#timelineList").empty();
	
	var userId = sessionStorage.getItem('TARGET_USER');
	cmmnAjax("appGlu/tl/selectTimeline.do", {SESS_USER_ID:userId, DE:date}, function (data){
				
		if(isNullToString(data.timelineList) != ""){
			var timelineList = data.timelineList;
			
			for(var i = 0; i < timelineList.length; i++){
				if(isNullToString(timelineList[i].DE) == ""
					|| isNullToString(timelineList[i].TM) == ""){
					continue;
				}
			
				var type = timelineList[i].TYPE;
				var singleCls = "";
				if(timelineList.length == 1){
					singleCls = "single";
				}
				
				//var editUrl = "../tl/sugarDetail.html?measrSn=" + timelineList[i].KEY1;
				
				var li;
				// 혈당
				// remove tag ::  '<a href="#" onclick="moveEditPage(\'' + editUrl + '\');" class="mod ui-btn-icon-right">수정</a>'
 				if(type == "BS"){					
					li = $('<li class="' + singleCls + '">'
							+ '<div class="cont_detail_wrap">'
							+ '<div class="view">'
							+ '<span class="timeline_user_type bg_sugar"></span>'
							+ '</div>'
							+ '<button class="value ui-btn ui-icon-grid ui-btn-icon-right">'
							+ '<ul>'
							+ '<li>'
							+ '<div class="txt">'
							+ '<p>' + setDateFormat(timelineList[i].DE + timelineList[i].TM, "AP HH:MI") + '</p>'
							+ '<p class="col_sugar txt_value">혈당<br><em>' + timelineList[i].VALUE1 + ' mg/dL</em></p>'
							+ '</div>'
							+ '</li>'
							+ '<li>'
							+ '<div class="thum_graph" id="timelineDtlsChart' + i + '"></div>'
							+ '</li>'
							+ '<li>'
							+ '<a href="#" class="mod"></a>' // remove tag
							+ '</li>'
							+ '</ul>'
							+ '</button>'
							+ '</div>'
							+ '</li>');
				}
				// 증상
				else if(type == "ST"){
					var symptmsCd = "";
					var symptmcNm = "";
					if(isNullToString(timelineList[i].VALUE1) != ""){
						symptmsCd = timelineList[i].VALUE1.split(",");
						for(var symptmsIdx in symptmsCd){
							if(symptmcNm.length > 0)	symptmcNm += " | ";
							symptmcNm += symptmsCdNm[Number(symptmsCd[symptmsIdx])];
						}
					}
					
					//var editUrl = "../tl/symptmsDetail.html?symptmsDe=" + timelineList[i].DE + "&symptmsSn=" + timelineList[i].KEY1;
					// remove tag ::  '<a href="" onclick="moveEditPage(\'' + editUrl + '\');" class="mod ui-btn-icon-right">수정</a>'
					li = $('<li class="' + singleCls + '">'
							+ '<div class="cont_detail_wrap">'
							+ '<div class="view">'
							+ '<span class="timeline_user_type bg_symptom"></span>'
							+ '</div>'
							+ '<button class="value ui-btn ui-icon-grid ui-btn-icon-right">'
							+ '<ul>'
							+ '<li>'
							+ '<div class="txt">'
							+ '<p>' + setDateFormat(timelineList[i].DE + timelineList[i].TM, "AP HH:MI") + '</p>'
							+ '<p class="col_symptom txt_value">증상</p>'
							+ '</div>'
							+ '</li>'
							+ '<li>'
							+ '<div class="thum_graph" id="timelineDtlsChart' + i + '"></div>'
							+ '</li>'
							+ '<li>'
							+ '<a href="#" class="mod"></a>' // remove tag
							+ '</li>'
							+ '</ul>'
							+ '<dl style="margin:0;">'
							+ '<dd style="margin-left:0;">' + symptmcNm + '</dd>'
							+ '</dl>'
							+ '</button>'
							+ '</div>'
							+ '</li>');
				}
				// 식사
				else if(type == "MD"){
					var imgUrl = ABSOLUTE_URL + 'common/attchFileDownload.do?attchFileSn='+timelineList[i].VALUE2+'&attchFileDtlsSn=2';
//					var editUrl = "../tl/mealDetail.html?mealDe="+timelineList[i].DE
//								+ "&mealClf="+timelineList[i].KEY1
//								+ "&mealClfSn="+timelineList[i].KEY2;
					// remove tag ::  '<a href="" onclick="moveEditPage(\'' + editUrl + '\');" class="mod ui-btn-icon-right">수정</a>'
					li = $('<li class="' + singleCls + '">'
							+ '<div class="cont_detail_wrap">'
							+ '<div class="view">'
							+ '<span class="timeline_user_type bg_meal"></span>'
							+ '</div>'
							+ '<button class="value ui-btn ui-icon-grid ui-btn-icon-right">'
							+ '<ul>'
							+ '<li>'
							+ '<div class="txt">'
							+ '<p>' + setDateFormat(timelineList[i].DE + timelineList[i].TM, "AP HH:MI") + '</p>'
							+ '<p class="col_meal txt_value">' + timelineList[i].VALUE4 + '<br><em>' + timelineList[i].VALUE1 + 'kcal</em></p>'
							+ '</div>'
							+ '</li>'
							+ '<li>'
							+ '<div class="thum_graph" id="timelineDtlsChart' + i + '"></div>'
							+ '</li>'
							+ '<li>'
							+ '<a href="#" class="mod"></a>' // remove tag
							+ '</li>'
							+ '</ul>'
							+ '<dl>'
							+ '<dt class="">'
							+ '<div class="meal_pic_div meal_pic_size" style="background-image:url(\'' + imgUrl + '\')"></div>'
							+ '</dt>'
							+ '<dd>' + timelineList[i].VALUE3 + '</dd>'
							+ '</dl>'
							+ '</button>'
							+ '</div>'
							+ '</li>');
				}
				// 복약
				else if(type == "DT"){
//					var editUrl = "../tl/drugTakngDetail.html?drugTakngDe="+timelineList[i].DE
//								+ "&drugTakngTm="+timelineList[i].TM;
					// remove tag :: '<a href="" onclick="moveEditPage(\'' + editUrl + '\');" class="mod ui-btn-icon-right">수정</a>'
					li = $('<li class="' + singleCls + '">'
							+ '<div class="cont_detail_wrap">'
							+ '<div class="view">'
							+ '<span class="timeline_user_type bg_takeMedi"></span>'
							+ '</div>'
							+ '<button class="value ui-btn ui-icon-grid ui-btn-icon-right">'
							+ '<ul>'
							+ '<li>'
							+ '<div class="txt">'
							+ '<p>' + setDateFormat(timelineList[i].DE + timelineList[i].TM, "AP HH:MI") + '</p>'
							+ '<p class="col_takeMedi txt_value">복약</p>'
							+ '</div>'
							+ '</li>'
							+ '<li>'
							+ '<div class="thum_graph" id="timelineDtlsChart' + i + '"></div>'
							+ '</li>'
							+ '<li>'
							+ '<a href="#" class="mod"></a>' // remove tag
							+ '</li>'
							+ '</ul>'
							+ '<dl style="margin:0;">'
							+ '<dd style="margin-left:0;">' + timelineList[i].VALUE1 + '</dd>'
							+ '</dl>'
							+ '</button>'
							+ '</div>'
							+ '</li>');
				}
				// 운동
				else if(type == "EC"){
//					var editUrl = "../tl/excsDetail.html?excsRecSn=" + timelineList[i].KEY1;
					// remove tag :: '<a href="" onclick="moveEditPage(\'' + editUrl + '\');" class="mod ui-btn-icon-right">수정</a>'
					var consumption = isNullToString(timelineList[i].VALUE3) != "" ? timelineList[i].VALUE3+"Kcal" : "" ;
					li = $('<li class="' + singleCls + '">'
							+ '<div class="cont_detail_wrap">'
							+ '<div class="view">'
							+ '<span class="timeline_user_type bg_ext"></span>'
							+ '</div>'
							+ '<button class="value ui-btn ui-icon-grid ui-btn-icon-right">'
							+ '<ul>'
							+ '<li>'
							+ '<div class="txt">'
							+ '<p>' + setDateFormat(timelineList[i].DE + timelineList[i].TM, "AP HH:MI") + '</p>'
							+ '<p class="col_ext txt_value">운동<br><em>' +consumption+'</em></p>'
							+ '</div>'
							+ '</li>'
							+ '<li>'
							+ '<div class="thum_graph" id="timelineDtlsChart' + i + '"></div>'
							+ '</li>'
							+ '<li>'
							+ '<a href="#" class="mod"></a>' // remove tag
							+ '</li>'
							+ '</ul>'
							+ '<dl style="margin:0;">'
							+ '<dd style="margin-left:0;">' +  timelineList[i].VALUE1 + ', ' + timelineList[i].VALUE2 +'분'+ '</dd>'
							+ '</dl>'
							+ '</button>'
							+ '</div>'
							+ '</li>');
				}
				// 혈압
				else if(type == "BP"){
//					var editUrl = "../tl/bloodDetail.html?measrSn=" + timelineList[i].KEY1;
					// remove tag :: '<a href="" onclick="moveEditPage(\'' + editUrl + '\');" class="mod ui-btn-icon-right">수정</a>'
					li = $('<li class="' + singleCls + '">'
							+ '<div class="cont_detail_wrap">'
							+ '<div class="view">'
							+ '<span class="timeline_user_type bg_Blood"></span>'
							+ '</div>'
							+ '<button class="value ui-btn ui-icon-grid ui-btn-icon-right">'
							+ '<ul>'
							+ '<li>'
							+ '<div class="txt">'
							+ '<p>' + setDateFormat(timelineList[i].DE + timelineList[i].TM, "AP HH:MI") + '</p>'
							+ '<p class="col_Blood txt_value">혈압<br><em>' + timelineList[i].VALUE2 + '/' + timelineList[i].VALUE1 + ' mmHg</em></p>'
							+ '</div>'
							+ '</li>'
							+ '<li>'
							+ '<div class="thum_graph" id="timelineDtlsChart' + i + '"></div>'
							+ '</li>'
							+ '<li>'
							+ '<a href="#" class="mod"></a>' // remove tag
							+ '</li>'
							+ '</ul>'
							+ '</button>'
							+ '</div>'
							+ '</li>');
				}
				// 수면
				else if(type == "SL"){
//					var editUrl = "../tl/sleepDetail.html?sleepDe="+timelineList[i].DE
//								+ "&sleepSn="+timelineList[i].KEY1;
					// remove tag :: '<a href="" onclick="moveEditPage(\'' + editUrl + '\');" class="mod ui-btn-icon-right">수정</a>'
					li = $('<li class="' + singleCls + '">'
							+ '<div class="cont_detail_wrap">'
							+ '<div class="view">'
							+ '<span class="timeline_user_type bg_sleep"></span>'
							+ '</div>'
							+ '<button class="value ui-btn ui-icon-grid ui-btn-icon-right">'
							+ '<ul>'
							+ '<li>'
							+ '<div class="txt">'
							+ '<p>' + setDateFormat(timelineList[i].DE + timelineList[i].TM, "AP HH:MI") + '</p>'
							+ '<p class="col_sleep txt_value">수면<br><em>' + isNullToString(timelineList[i].VALUE1, "0") + '시간, 평가 : ' + timelineList[i].VALUE2 + '점</em></p>'
							+ '</div>'
							+ '</li>'
							+ '<li>'
							+ '<div class="thum_graph" id="timelineDtlsChart' + i + '"></div>'
							+ '</li>'
							+ '<li>'
							+ '<a href="#" class="mod"></a>' // remove tag
							+ '</li>'
							+ '</ul>'
							+ '</button>'
							+ '</div>'
							+ '</li>');
				}
				// 메모
				else if(type == "MM"){
//					var editUrl = "../tl/memoDetail.html?freeMemoDe="+timelineList[i].DE
//								+ "&freeMemoSn="+timelineList[i].KEY1;
					// remove tag :: '<a href="" onclick="moveEditPage(\'' + editUrl + '\');" class="mod ui-btn-icon-right">수정</a>'
					li = $('<li class="' + singleCls + '">'
							+ '<div class="cont_detail_wrap">'
							+ '<div class="view">'
							+ '<span class="timeline_user_type bg_memo"></span>'
							+ '</div>'
							+ '<button class="value ui-btn ui-icon-grid ui-btn-icon-right">'
							+ '<ul>'
							+ '<li>'
							+ '<div class="txt">'
							+ '<p>' + setDateFormat(timelineList[i].DE + timelineList[i].TM, "AP HH:MI") + '</p>'
							+ '<p class="col_memo txt_value">메모</p>'
							+ '</div>'
							+ '</li>'
							+ '<li>'
							+ '<div class="thum_graph" id="timelineDtlsChart' + i + '"></div>'
							+ '</li>'
							+ '<li>'
							+ '<a href="#" class="mod"></a>' // remove tag
							+ '</li>'
							+ '</ul>'
							+ '<dl style="margin:0;">'
							+ '<dd style="margin-left:0;">' + isNullToString(timelineList[i].VALUE1) + '</dd>'
							+ '</dl>'
							+ '</button>'
							+ '</div>'
							+ '</li>');
				}
				
				li.data("TM", timelineList[i].TM);
				li.data("TYPE", type);
				
				$("#timelineList").append(li);

				if(!isNull(timelineList[i].CGM_DATA)){
					timelineList[i]["stdMap"] = data.stdMap;
					setTimelineDtlsChart("#timelineDtlsChart" + i, timelineList[i]);
				}else if(isNull(timelineList[i].CGM_DATA)){
					$("#timelineDtlsChart" + i).addClass('no_d');
				}
			}
			
		}else{
			li = $('<li class="single">'
					+'<div class="cont_detail_wrap">'
					+'조회된 데이터가 없습니다.'
					+'</div>'
					+'</li>');
			
			$("#timelineList").append(li);
		}
		
		$("#timelineList").listview().listview("refresh");
    });
}

//일별 상세 목록 차트 생성
function setTimelineDtlsChart(div, dtlsChartData){
	var chartData = [];
	
	var minVal = Number.MAX_VALUE;
	var maxVal = Number.MIN_VALUE;
	var list = dtlsChartData.CGM_DATA.split(",");
	var stdVal = dtlsChartData.stdMap;

	var meastTm = dtlsChartData.TM;
	var frstMeasrHH = Number(dtlsChartData.TM.substring(0,2)) - 1;
	var frstMeasrMI = Number(dtlsChartData.TM.substring(2,4));
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
	
	var cgmDtlsChart = new CgmDtlsChart({
		  "div"			: div
		, "width"		: $(div).width()
		, "height"		: $(div).height()
		, "minMax"		: [minVal, maxVal]
		, "columns"		: [ "y" ]
		, "baseColumns"	: "x"
		, "colors"		:["#fff","rgba(204, 204, 204, 1)", "rgba(255, 223, 59, 1)", "rgba(201, 0, 48, 1)", "rgba(248, 24, 115, 1)"]
		, "highVal"		: stdVal.HIGH_VAL
		, "lowVal"		: stdVal.LOW_VAL
		, "typeColor"	: ["rgba(255,94,127,1)", "rgba(213,24,131,1)", "rgba(23,209,186,1)", "rgba(92,130,235,1)", "rgba(96,210,126,1)", "rgba(255,164,84,1)", "rgba(55,31,120,1)", "rgba(123,123,123,1)"]
		, "margin"		: {top:1, right:1, bottom:1, left:1}
		, "tm"			: dtlsChartData.TM
		, "type"		: dtlsChartData.TYPE
	});
	
	cgmDtlsChart.insertData(chartData);
}

//타임라인 목록 선택 이벤트
$(document).on("click", "#timelineList>li", function(){
	var typeData = [];
	typeData.push({
		"type"	: $(this).data("TYPE")
		,"tm"	: $(this).data("TM").substring(0,4)
	});
	
	cgmChart.insertTypeData(typeData);
	
	$("#deshboard").scrollTop(0);
});
