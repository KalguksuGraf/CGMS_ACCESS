var target_userId = sessionStorage.getItem('TARGET_USER');
var lowVal = 80, highVal = 100;

$(document).on("pagebeforecreate",function(){
	console.log('1. pagebeforecreate==');	
});

$(document).ready(function(){
	setUserInf();
	selectCgmMainChart();
});

$(document).on('click','#gofollowMain',function(){
	localStorage.clear();
	location.href = "followmain.html";
});

$(document).on("click", ".zoom_in.ui-btn", function(){
	location.href = "../fw/followWide.html?fullscreenchange=On";
});


//팔로우 메인 차트 세팅
function selectCgmMainChart(){
	var de = setDateFormat("", "YYYYMMDD");
	var target_userId = sessionStorage.getItem('TARGET_USER');
	var param = {
			DE : de
		  , SESS_USER_ID : target_userId
	}
	
	cmmnAjax('appGlu/ms/selectCgmMainGrpList.do',param,function(res){
		var chartData = [];
		var dotSize = 3;
		var width = $('.mainChart').width();
		
		var minVal = 0;//Number.MAX_VALUE;
		var maxVal = Number.MIN_VALUE;
		var list = res.rsList;
		var stdVal = res.stdMap;
		
		if(isNullToString(list)!=""){
			var trend = isNullToString(list[list.length - 1].TREND);
			$(".chart_circle3 p:eq(0)").text(list[list.length - 1].Y);
			
			$("#circle_arrow").removeClass();
			$("#chart_circle2").removeClass();
			$("#chart_circle2").addClass("chart_circle2");
			
			if(trend.length > 0){
				$("#circle_arrow").addClass("circle_arrow");
			}
			if(trend.indexOf("Up") > -1){
				$("#chart_circle2").addClass("bg03");
				if(trend == "SingleUp"){
					$("#circle_arrow").addClass("c2");
					$("#circle_arrow").addClass("icon_c21");
				}else if(trend == "DoubleUp"){
					$("#circle_arrow").addClass("c1");
					$("#circle_arrow").addClass("icon_c11");
				}else if(trend == "FortyFiveUp"){
					$("#circle_arrow").addClass("c1");
					$("#circle_arrow").addClass("icon_c12");
				}
			}else if(trend.indexOf("Down") > -1){
				$("#chart_circle2").addClass("bg02");
				if(trend == "SingleDown"){
					$("#circle_arrow").addClass("c4");
					$("#circle_arrow").addClass("icon_c41");
				}else if(trend == "DoubleDown"){
					$("#circle_arrow").addClass("c5");
					$("#circle_arrow").addClass("icon_c51");
				}else if(trend == "FortyFiveDown"){
					$("#circle_arrow").addClass("c5");
					$("#circle_arrow").addClass("icon_c52");
				}
			}else{
				$("#chart_circle2").addClass("bg01");
				if(trend == "Flat"){
					$("#circle_arrow").addClass("c3");
					$("#circle_arrow").addClass("icon_c31");
				}
			}
		}else{
			$("#chart_circle2").addClass("bg01");
		}
		
		//하단 Day Line Chart 그리기 (김태일)
		
		/**그래프 끊김 없이 이을때 (김태일)**/
//		for (var i=0; i<list.length; i++) {
////			if( minVal > list[i].Y ) minVal = list[i].Y;
//		    if( maxVal < list[i].Y ) maxVal = list[i].Y;
//
//		    if(list[i].Y > 0){
//		    	var measrTm = list[i].MEASR_TM.substring(0, 4);
//		    	var measrHH = measrTm.substring(0,2);
//		    	var measrMI = measrTm.substring(2,4);
//		    	var minute = Number(measrHH) * 60 + Number(measrMI);
//		    	var data = {
//		    			"x" : minute
//		    			, "y" : list[i].Y
//		    			, "y2": ((isNullToString(list[i].CORETON_VALUE) == "")? null : list[i].CORETON_VALUE)
//		    	};
//		    	
//		    	chartData.push(data);
//		    }
//		}
		/**그래프 끊김 없이 이을때 (김태일)**/
		
		/**일정시간 이격시 그래프 noDraw처리 (김태일)**/
		var cuData = [];
		
		for (var i=0; i<list.length; i++) { // 유효데이터 재설정
			if( maxVal < list[i].Y ) maxVal = list[i].Y;
			 if(list[i].Y > 0){
				 cuData.push(list[i])
			 }
		}
		/**일정시간 이격시 그래프 noDraw처리 (김태일)**/
		
//		if(minVal == Number.MAX_VALUE || minVal < 50){
//			minVal = 0;
//		}else{
//			minVal -= 50;
//		}
		if(maxVal == Number.MIN_VALUE){
			maxVal = 200;
		}else{
			maxVal += 50;
		}
		
		var mainChart = new MainChart({
			  "div"			: ".mainChart"
			, "width"		: 2000
			, "height"		: $(".mainChart").height() - 6
			, "minMax"		: [minVal, maxVal+70]
			, "columns"		: [ "y", "y2" ]
			, "baseColumns"	: "x"
			, "margin"		: {top:0, right:20,bottom:30, left:20}
			, "colors"	:["#fff","rgba(204, 204, 204, 1)", "rgba(255, 223, 59, 1)", "rgba(201, 0, 48, 1)", "rgba(248, 24, 115, 1)"]
			, "dotSize"		: dotSize
			, "highVal"		: stdVal.HIGH_VAL
			, "lowVal"		: stdVal.LOW_VAL
			, "bubbleYn"	: true
			, "typeColor"	: ["rgba(255,94,127,1)", "rgba(213,24,131,1)", "rgba(23,209,186,1)", "rgba(92,130,235,1)", "rgba(96,210,126,1)", "rgba(255,164,84,1)", "rgba(55,31,120,1)", "rgba(123,123,123,1)"]
		});
		
		/**그래프 끊김 없이 이을때 (김태일)**/		
//		mainChart.insertData(chartData);
		/**그래프 끊김 없이 이을때 (김태일)**/
		
		/**일정시간 이격시 그래프 noDraw처리 (김태일)**/
		var phase = 'A';
		var changerDef = 10800; // 이격 시키고 싶은 만큼의 시간단위 입력 (초)
		
		for (var i=0; i<cuData.length; i++) {
			
			if(i!=0 && phase!=chartData[0].phase){
				mainChart.insertData(chartData);
				chartData = [];
			}
			
		    	var measrTm = cuData[i].MEASR_TM.substring(0, 4);
		    	var measrHH = measrTm.substring(0,2);
		    	var measrMI = measrTm.substring(2,4);
		    	var minute = Number(measrHH) * 60 + Number(measrMI);
		    	
		    	var data = {
		    			"x" : minute
		    			, "y" : cuData[i].Y
		    			, "y2": ((isNullToString(cuData[i].CORETON_VALUE) == "")? null : cuData[i].CORETON_VALUE)
		    			, "phase" : phase
		    	};
		    	
		    	chartData.push(data);
		    	
		    	if(i!=cuData.length-1&&cuData.length>1){
		    		var phaseChanger  = diffTimeBtwn(cuData[i].MEASR_DE+""+cuData[i].MEASR_TM,cuData[i+1].MEASR_DE+""+cuData[i+1].MEASR_TM,1).replace(/:/gi,"");
		    		var hourChanger = Number(phaseChanger.substring(0,2))*3600;
		    		var minuteChanger =  Number(phaseChanger.substring(2,4))*60;
		    		var secondChanger = Number(phaseChanger.substring(5,7));
		    		var countPhase = hourChanger+minuteChanger+secondChanger
		    		
		    		if(countPhase>changerDef){
		    			phase = phase+'A';
		    		}
		    	}
		    	
		    	if(i==cuData.length-1){
		    		mainChart.insertData(chartData);
		    	}
		    
		}
		/**일정시간 이격시 그래프 noDraw처리 (김태일)**/
		
		cmmnAjax("appGlu/tl/selectTimeline.do", {SESS_USER_ID:target_userId, DE:de}, function (data){
			var sb = new StringBuffer();
			
			if(isNullToString(data.timelineList) != ""){
				var timelineList = data.timelineList;
				
				var typeData = [];
				for(var i = 0; i < timelineList.length; i++){
					if(isNullToString(timelineList[i].DE) == ""
						|| isNullToString(timelineList[i].TM) == ""){
						continue;
					}
					
					typeData.push({
						"type"	: timelineList[i].TYPE
						,"tm"	: timelineList[i].TM.substring(0,4)
					});
				}
				
				mainChart.insertTypeData(typeData);
			}
	    });
	});
}

//개인 정보 set
function setUserInf(){
	var target_userId = sessionStorage.getItem('TARGET_USER');
	cmmnAjax("appGlu/bx/selectUserInfo.do", {SESS_USER_ID:target_userId}, function(res){
		if(res.chkYn == 'Y'){
			console.log(res)
			$('.detail_user_top_box').empty();
			
			var sbf = new StringBuffer();
			var targetInf = res.infoMap;
			var imgurl = ''
				if(isNullToString(targetInf.ATTCH_FILE_SN)!=""){
					imgurl = ABSOLUTE_URL + 'common/attchFileDownload.do?attchFileSn='+targetInf.ATTCH_FILE_SN+'&attchFileDtlsSn='+targetInf.ATTCH_FILE_DTLS_SN;
				}else{
					imgurl = '../../images/app/noprofile@2x.png';
				}
			
			sbf.append('<li>');
			sbf.append('<div class="meal_pic_div meal_pic_size" style="background-image:url('+imgurl+')"></div>');
			sbf.append('</li>');
			sbf.append('<li>');
			sbf.append('<div class="txt">');
			sbf.append('<p class="n">'+targetInf.USER_NM+'</p>');
			sbf.append('<p class="s"><span>'+targetInf.USER_AGE+'세</span> '+targetInf.GENDER_NM+'</p>');
			sbf.append('</div>');
			sbf.append('</li>');
			$('.detail_user_top_box').html(sbf.toString());
		}else{
			console.log('데이터를 불러오는데 실패하였습니다.');
			location.href = 'followmain.html';
		}
	});
}


