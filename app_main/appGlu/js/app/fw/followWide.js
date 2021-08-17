var wideChart;
var symptmsCdNm = ["식은땀", "어지럼증", "두통", "피로", "불안함", "흥분", "공복감", "두근거림", "기타증상"];

$(document).on("pagebeforeshow", function(){
	selectCgmWideChart();
});

$(document).on("click", "#dtlsCloseBtn", function(){
	wideChart.clearType();
	$('.panel_right').hide();
	chartfullWide();
});

$(document).on("change", "#wideDe", function(){
	location.href="./followWide.html?fullscreenchange=On&de="+$(this).val().replace(/-/gi, "");
});

function chartfullWide(){
	$('.wideChart').css({"width":"94%"});
	$('.yDomain').css({"width":"6%"});
}

function chartOpenLeft(){
	$('.wideChart').css({"width":"87.1%"});
	$('.yDomain').css({"width":"12.9%"});
}


$(document).ready(function(){
});


function selectCgmWideChart(){
	var target_userId = sessionStorage.getItem('TARGET_USER');
	var de = setDateFormat("","YYYYMMDD");// 테스트시 20200513으로 세팅
	
	var req = new Request();
	if(!isNull(req.getParameter("de"))){
		de = req.getParameter("de");
		localStorage.setItem("curDe", de);
	}else if(!isNull(localStorage.getItem("curDe"))){
		de = localStorage.getItem("curDe");
	}
	
	$('#wideDe').val(setDateFormat(de, "YYYY-MM-DD"));
	$(".wide_chart_box div").empty();
	
	var param = {
			SESS_USER_ID : target_userId
		  , DE 			 : de			
	}
	
	cmmnAjax('appGlu/ms/selectCgmMainGrpList.do',param,function(res){
		console.log(res)
		
		var chartData = [];
		var dotSize = 3;
		var list = res.rsList;
		var stdMap = res.stdMap;
		var stdVal = res.stdMap;
		
		var minVal = 0;//Number.MAX_VALUE;
		var maxVal = Number.MIN_VALUE;
		
		if(isNullToString(list)!=""){
			var trend = isNullToString(list[list.length - 1].TREND);
			$('#circle_cgmVal').html(list[list.length - 1].Y+' <span class="font_14">mg/dL</span>');
			
			
			if(trend.indexOf("Up") > -1){
				$("#circle_arrow").addClass("bo_col_yellow");
				if(trend == "SingleUp"){
					$("#circle_arrow").addClass("top_right");
				}else if(trend == "DoubleUp"){
					$("#circle_arrow").addClass("top1");
				}else if(trend == "FortyFiveUp"){
					$("#circle_arrow").addClass("top2");
				}
			}else if(trend.indexOf("Down") > -1){
				$("#circle_arrow").addClass("bo_col_red");
				if(trend == "SingleDown"){
					$("#circle_arrow").addClass("bot_right");
				}else if(trend == "DoubleDown"){
					$("#circle_arrow").addClass("bot1");
				}else if(trend == "FortyFiveDown"){
					$("#circle_arrow").addClass("bot2");
				}
			}else{
				$("#circle_arrow").addClass("bo_col_grey");
				$("#circle_arrow").addClass("right");
			}
			
			$("#circle_arrow").parent().next().show();
			$("#circle_arrow").parent().show();
		}else{
			$("#circle_arrow").addClass("bo_col_grey");	
		}
		
		/**그래프 끊김 없이 이을때 (김태일)**/
//		for (var i=0; i<list.length; i++) {
//			//	if( minVal > list[i].Y ) minVal = list[i].Y;
//			if( maxVal < list[i].Y ) maxVal = list[i].Y;
//			if(list[i].Y > 0){
//    	
//				var measrTm = list[i].MEASR_TM.substring(0, 4);
//				var measrHH = measrTm.substring(0,2);
//				var measrMI = measrTm.substring(2,4);
//				var minute = Number(measrHH) * 60 + Number(measrMI);
//    	
//				var data = {
//						  "x" : minute
//						, "y" : list[i].Y
//						, "y2": ((isNullToString(list[i].CORETON_VALUE) == "")? null : list[i].CORETON_VALUE)
//					};
//    	
//					chartData.push(data);
//				}
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
		
		if(maxVal == Number.MIN_VALUE){ maxVal = 200; };
		
		wideChart = new MainWideChart({
			  "div"			: ".wideChart"
			, "width"		: 2000
			, "height"		: $(".wide_chart_box").height()
			, "minMax"		: [minVal, maxVal]
			, "columns"		: [ "y", "y2" ]
			, "baseColumns"	: "x"
			, "margin"		: {top:55, right:20,bottom:30, left:20}
			, "colors"		:["#fff","rgba(204, 204, 204, 1)", "rgba(255, 223, 59, 1)", "rgba(201, 0, 48, 1)", "rgba(248, 24, 115, 1)"]
			, "dotSize"		: dotSize
			, "highVal"		: stdVal.HIGH_VAL
			, "lowVal"		: stdVal.LOW_VAL
			, "typeColor"	: ["rgba(255,94,127,1)", "rgba(213,24,131,1)", "rgba(23,209,186,1)", "rgba(92,130,235,1)", "rgba(96,210,126,1)", "rgba(255,164,84,1)", "rgba(55,31,120,1)", "rgba(123,123,123,1)"]
		});
		
		/**그래프 끊김 없이 이을때 (김태일)**/
//		wideChart.insertData(chartData);
		/**그래프 끊김 없이 이을때 (김태일)**/
		
//		for(var i=0; i<cuData.length; i++){
//		if(i != 0 && i!=cuData.length-1){
//    		console.log(cuData[i].MEASR_DE+""+cuData[i].MEASR_TM)
//    		console.log(cuData[i+1].MEASR_DE+""+cuData[i+1].MEASR_TM)
//    		console.log(diffTimeBtwn(cuData[i].MEASR_DE+""+cuData[i].MEASR_TM,cuData[i+1].MEASR_DE+""+cuData[i+1].MEASR_TM,1));
//    	}
//	}
		/**일정시간 이격시 그래프 noDraw처리 (김태일)**/
		var phase = 'A';
		var changerDef = 10800; // 이격 시키고 싶은 만큼의 시간단위 입력 (초)
		
		for (var i=0; i<cuData.length; i++) {
			
			if(i!=0 && phase!=chartData[0].phase){
				wideChart.insertData(chartData);
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
		    		wideChart.insertData(chartData);
		    	}
		    
		}
		/**일정시간 이격시 그래프 noDraw처리 (김태일)**/
		
//		if(minVal == Number.MAX_VALUE || minVal < 10){
//		minVal = 0;
//		}else{
//		minVal -= 10;
//		}
		
		cmmnAjax("appGlu/tl/selectTimeline.do", param, function (data){
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
				
				wideChart.insertTypeData(typeData);
			}
	    });
		wideChart.typeClick(function(type, tm){
			$(".panel_right").show();
			
			var bgnHour = Number(tm.substring(0,2)) - 2 < 10 ? "0" + (Number(tm.substring(0,2)) - 2) : Number(tm.substring(0,2)) - 2;
			var bgnTm = String(bgnHour) + tm.substring(2) + "00";
			
			var endHour = Number(tm.substring(0,2)) + 2 < 10 ? "0" + (Number(tm.substring(0,2)) + 2) : Number(tm.substring(0,2)) + 2;
			var endTm = String(endHour) + tm.substring(2) + "59";
			
			var bgnHour2 = Number(tm.substring(0,2)) - 1 < 10 ? "0" + (Number(tm.substring(0,2)) - 1) : Number(tm.substring(0,2)) - 1;
			var bgnTm2 = String(bgnHour2) + tm.substring(2) + "00";
			
			var endHour2 = Number(tm.substring(0,2)) + 1 < 10 ? "0" + (Number(tm.substring(0,2)) + 1) : Number(tm.substring(0,2)) + 1;
			var endTm2 = String(endHour2) + tm.substring(2) + "59";
			
			cmmnAjax("appGlu/ms/selectMainDashTimeline.do", {SESS_USER_ID:target_userId, DE:de, BASE_TM:tm, BGN_TM:bgnTm, END_TM:endTm, BGN_TM2:bgnTm2, END_TM2:endTm2}, function (data){
				var sb = new StringBuffer();
				
				$(".date_timeline_box").empty();
				$(".date_timeline_box").parent().scrollTop(0);
				
				if(!isNull(data.timelineList)){
					var timelineList = data.timelineList;
					
					for(var i = 0; i < timelineList.length; i++){
						var type = timelineList[i].TYPE;
						
						var curEventCls = timelineList[i].TM.indexOf(tm) > -1 ? "선택" : "";
						
						// CGM data
						if(type == "CGM"){
							var trend = timelineList[i].VALUE2;
							var cgmColor = "";
							var cgmArrow = "";
							var eventNm = timelineList[i].VALUE3;
							if(trend.indexOf("Up") > -1){
								cgmColor = "bo_col_yellow";
								if(trend == "SingleUp"){
									cgmArrow = "top_right";
								}else if(trend == "DoubleUp"){
									cgmArrow = "top1";
								}else if(trend == "FortyFiveUp"){
									cgmArrow = "top2";
								}
							}else if(trend.indexOf("Down") > -1){
								cgmColor = "bo_col_red";
								if(trend == "SingleDown"){
									cgmArrow = "bot_right";
								}else if(trend == "DoubleDown"){
									cgmArrow = "bot1";
								}else if(trend == "FortyFiveDown"){
									cgmArrow = "bot2";
								}
							}else{
								cgmColor = "bo_col_grey";
								cgmArrow = "right";
							}
							
							sb.append('<li class="' + curEventCls + '">');
							sb.append('<a href="#" rel="external" class="cont_wrap">');
							sb.append('<div class="date_time">');
							sb.append('<p class="col_4a">' + eventNm + '</p>');
							sb.append('<p>' + setDateFormat(timelineList[i].DE + timelineList[i].TM, "AP HH:MI") + '</p>');
							sb.append('</div>');
							sb.append('<div class="view">');
							sb.append('<span class="base ' + cgmColor + ' ' + cgmArrow + '"></span>');
							sb.append('</div>');
							sb.append('<div class="value">');
							sb.append('<p>' + timelineList[i].VALUE4 + '</p>');
							sb.append('<p class="txt_value">' + timelineList[i].VALUE1 + ' <em>mg/dL</em></p>');
							sb.append('</div>');
							sb.append('</a>');
							sb.append('</li>');
						}
						// 혈당
						if(type == "BS"){
							//modif_URL ::  ../tl/sugarDetail.html?measrSn=' + timelineList[i].KEY1 + '
							sb.append('<li class="contview ' + curEventCls + '">');
							sb.append('<a href="#" rel="external" class="cont_wrap">');
							sb.append('<div class="date_time">');
							sb.append('<p class="col_4a">' + curEventCls + '</p>');
							sb.append('<p>' + setDateFormat(timelineList[i].DE + timelineList[i].TM, "AP HH:MI") + '</p>');
							sb.append('</div>');
							sb.append('<div class="view">');
							sb.append('<span class="user_type bg_sugar icon_sugar"></span>');
							sb.append('</div>');
							sb.append('<div class="value">');
							sb.append('<p class="col_sugar">혈당</p>');
							sb.append('<p class="txt_value">' + timelineList[i].VALUE1 + ' <em>mmHg</em></p>');
							sb.append('</div>');
							sb.append('</a>');
							sb.append('</li>');
						}
						// 증상
						else if(type == "ST"){
							//modif_URL ::  ../tl/symptmsDetail.html?symptmsDe=' + timelineList[i].DE + '&symptmsSn=' + timelineList[i].KEY1 + '
							var symptmsCd = "";
							var symptmcNm = "";
							if(isNullToString(timelineList[i].VALUE1) != ""){
								symptmsCd = timelineList[i].VALUE1.split(",");
								for(var symptmsIdx in symptmsCd){
									if(symptmcNm.length > 0)	symptmcNm += " | ";
									symptmcNm += symptmsCdNm[Number(symptmsCd[symptmsIdx])];
								}
							}
							
							sb.append('<li class="contview ' + curEventCls + '">');
							sb.append('<a href="#" rel="external" class="cont_wrap">');
							sb.append('<div class="date_time">');
							sb.append('<p class="col_4a">' + curEventCls + '</p>');
							sb.append('<p>' + setDateFormat(timelineList[i].DE + timelineList[i].TM, "AP HH:MI") + '</p>');
							sb.append('</div>');
							sb.append('<div class="view">');
							sb.append('<span class="user_type bg_symptom icon_symptom"></span>');
							sb.append('</div>');
							sb.append('<div class="value">');
							sb.append('<p class="col_symptom">증상</p>');
							sb.append('<p class="view_txt">' + symptmcNm + '</p>');
							sb.append('</div>');
							sb.append('</a>');
							sb.append('</li>');
						}
						// 식사
						else if(type == "MD"){
							//modif_URL :: "../tl/mealDetail.html?mealDe="+timelineList[i].DE + "&mealClf="+timelineList[i].KEY1 + "&mealClfSn="+timelineList[i].KEY2;
							var imgUrl = ABSOLUTE_URL + 'common/attchFileDownload.do?attchFileSn='+timelineList[i].VALUE2+'&attchFileDtlsSn=2';
							var aLink = "../tl/mealDetail.html?mealDe="+timelineList[i].DE
								+ "&mealClf="+timelineList[i].KEY1
								+ "&mealClfSn="+timelineList[i].KEY2;
							
							sb.append('<li class="contview ' + curEventCls + '">');
							sb.append('<a href="#" rel="external" class="cont_wrap">');
							sb.append('<div class="date_time">');
							sb.append('<p class="col_4a">' + curEventCls + '</p>');
							sb.append('<p>' + setDateFormat(timelineList[i].DE + timelineList[i].TM, "AP HH:MI") + '</p>');
							sb.append('</div>');
							sb.append('<div class="view">');
							sb.append('<span class="meal_pic" >');
							sb.append('<div class="meal_pic_div meal_pic_size" style="background-image:url(\'' + imgUrl + '\');"></div>');
							sb.append('</span>');
							sb.append('</div>');
							sb.append('<div class="value">');
							sb.append('<p class="col_meal">' + timelineList[i].VALUE4 + ' <em class="kcal">' + timelineList[i].VALUE1 + 'kcal</em></p>');
							sb.append('<p class="view_txt">' + timelineList[i].VALUE3 + '</p>');
							sb.append('</div>');
							sb.append('</a>');
							sb.append('</li>');
						}
						// 복약
						else if(type == "DT"){
							//modif_URL :: "../tl/drugTakngDetail.html?drugTakngDe="+timelineList[i].DE + "&drugTakngTm="+timelineList[i].TM;
							var aLink = "../tl/drugTakngDetail.html?drugTakngDe="+timelineList[i].DE
								+ "&drugTakngTm="+timelineList[i].TM;
							
							sb.append('<li class="contview ' + curEventCls + '">');
							sb.append('<a href="#" rel="external" class="cont_wrap">');
							sb.append('<div class="date_time">');
							sb.append('<p class="col_4a">' + curEventCls + '</p>');
							sb.append('<p>' + setDateFormat(timelineList[i].DE + timelineList[i].TM, "AP HH:MI") + '</p>');
							sb.append('</div>');
							sb.append('<div class="view">');
							sb.append('<span class="user_type bg_takeMedi icon_takeMedi"></span>');
							sb.append('</div>');
							sb.append('<div class="value">');
							sb.append('<p class="col_takeMedi">복약</p>');
							sb.append('<p class="view_txt">' + timelineList[i].VALUE1 + '</p>');
							sb.append('</div>');
							sb.append('</a>');
							sb.append('</li>');
						}
						// 운동
						else if(type == "EC"){
							//modif_URL :: ../tl/excsDetail.html?excsRecSn=' + timelineList[i].KEY1 + '
							sb.append('<li class="contview ' + curEventCls + '">');
							sb.append('<a href="#" rel="external" class="cont_wrap">');
							sb.append('<div class="date_time">');
							sb.append('<p class="col_4a">' + curEventCls + '</p>');
							sb.append('<p>' + setDateFormat(timelineList[i].DE + timelineList[i].TM, "AP HH:MI") + '</p>');
							sb.append('</div>');
							sb.append('<div class="view">');
							sb.append('<span class="user_type bg_ext icon_ext"></span>');
							sb.append('</div>');
							sb.append('<div class="value">');
							sb.append('<p class="col_ext">운동</p>');
							sb.append('<p class="txt_value">' + timelineList[i].VALUE1 + ', ' + timelineList[i].VALUE2 + '분</p>');
							sb.append('</div>');
							sb.append('</a>');
							sb.append('</li>');
						}
						// 혈압
						else if(type == "BP"){
							//modif_URL :: ../tl/bloodDetail.html?measrSn=' + timelineList[i].KEY1 + '
							sb.append('<li class="contview ' + curEventCls + '">');
							sb.append('<a href="#" rel="external" class="cont_wrap">');
							sb.append('<div class="date_time">');
							sb.append('<p class="col_4a">' + curEventCls + '</p>');
							sb.append('<p>' + setDateFormat(timelineList[i].DE + timelineList[i].TM, "AP HH:MI") + '</p>');
							sb.append('</div>');
							sb.append('<div class="view">');
							sb.append('<span class="user_type bg_Blood icon_Blood"></span>');
							sb.append('</div>');
							sb.append('<div class="value">');
							sb.append('<p class="col_Blood">혈압</p>');
							sb.append('<p class="txt_value">' + timelineList[i].VALUE2 + '/' + timelineList[i].VALUE1 + ' <em>mmHg</em></p>');
							sb.append('</div>');
							sb.append('</a>');
							sb.append('</li>');
						}
						// 수면
						else if(type == "SL"){
							//modif_URL :: "../tl/sleepDetail.html?sleepDe="+timelineList[i].DE + "&sleepSn="+timelineList[i].KEY1;
							var aLink = "../tl/sleepDetail.html?sleepDe="+timelineList[i].DE
								+ "&sleepSn="+timelineList[i].KEY1;
							
							sb.append('<li class="contview ' + curEventCls + '">');
							sb.append('<a href="#" rel="external" class="cont_wrap">');
							sb.append('<div class="date_time">');
							sb.append('<p class="col_4a">' + curEventCls + '</p>');
							sb.append('<p>' + setDateFormat(timelineList[i].DE + timelineList[i].TM, "AP HH:MI") + '</p>');
							sb.append('</div>');
							sb.append('<div class="view">');
							sb.append('<span class="user_type bg_sleep icon_sleep"></span>');
							sb.append('</div>');
							sb.append('<div class="value">');
							sb.append('<p class="col_sleep">수면</p>');
							sb.append('<p class="txt_value">' + isNullToString(timelineList[i].VALUE1, "0") + '시간, 평가 : ' + timelineList[i].VALUE2 + '점</p>');
							sb.append('</div>');
							sb.append('</a>');
							sb.append('</li>');
						}
						// 메모
						else if(type == "MM"){
							//modif_URL :: "../tl/memoDetail.html?freeMemoDe="+timelineList[i].DE + "&freeMemoSn="+timelineList[i].KEY1;
							var aLink = "../tl/memoDetail.html?freeMemoDe="+timelineList[i].DE
								+ "&freeMemoSn="+timelineList[i].KEY1;
							
							sb.append('<li class="contview ' + curEventCls + '">');
							sb.append('<a href="#" rel="external" class="cont_wrap">');
							sb.append('<div class="date_time">');
							sb.append('<p class="col_4a">' + curEventCls + '</p>');
							sb.append('<p>' + setDateFormat(timelineList[i].DE + timelineList[i].TM, "AP HH:MI") + '</p>');
							sb.append('</div>');
							sb.append('<div class="view">');
							sb.append('<span class="user_type bg_memo icon_memo"></span>');
							sb.append('</div>');
							sb.append('<div class="value">');
							sb.append('<p class="col_memo">메모</p>');
							sb.append('<p class="view_txt">' + isNullToString(timelineList[i].VALUE1) + '</em></p>');
							sb.append('</div>');
							sb.append('</a>');
							sb.append('</li>');
						}
					}
					
					$(".date_timeline_box").html(sb.toString());
					$(".date_timeline_box").listview().listview("refresh");
					$(".date_timeline_box").parent().scrollTop($(".curEvent").css("top"));
				}
		    });
			chartOpenLeft();
		});
		
	});
}