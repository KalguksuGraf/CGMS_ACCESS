/**
d3 라이브러리를 이용한 Line 챠트
작성자 : 김보람
<script src="<contextPath>/js/chart/d3.min.js"></script>
https://d3js.org/d3.v4.min.js
활동 상세 그래프
**/
function AvgCalChart(_param){
	var param = _param || {};

	//도넛챠트
	var donut = param.donut||{};
	donut.div = donut.div||"body";
	donut.size = donut.size||30;

	try{
	    donut.width = Number(donut.width||d3.select(donut.div).style("width").replace("px","")) ;
	    donut.height = Number(donut.height||d3.select(donut.div).style("height").replace("px","")) ;
	}catch(e){
	    console.log("object is not defined");
	}finally{
	    donut.width = donut.width||d3.select("body").style("width").replace("px","") ;
	    donut.height = donut.height||d3.select("body").style("height").replace("px","") ;
	}
	donut.margin = donut.margin||{top: 10, right: 10, bottom: 10, left: 10};
	donut.radius = donut.radius||Math.min(donut.width, donut.height) / 2;
	donut.outerR = donut.outerR||donut.radius;
	donut.innerR = donut.innerR||donut.radius;

	var colorArr = param.colors||["#eeeeee","#3d6cf0", "#33c641", "#ADD6FB", "#3399FF"];
	var goalValue = param.goalValue||10000;
	var label = param.label||["월","화","수","목","금","토","일"];

	var parseDate = d3.timeParse("%Y-%m"),
	    formatYear = d3.format("02d");
	
	var formatCal = d3.format(",d");

	/**데이터 삽입**/
	this.currentData = [];
	this.insertData = function(rawData){
		
		var graphData = [rawData[0].avgCal1, rawData[0].avgCal2, rawData[0].avgCal3, rawData[0].avgCal4];
		//var n = rawData.length;
		var totalData = rawData[0].avgCal1 * 1 + rawData[0].avgCal2 * 1 + rawData[0].avgCal3 * 1 + rawData[0].avgCal4 * 1 ;
		
		this.initChart();
		 
		var thisObj = this;
		 
		var arc = d3.arc()
		    .outerRadius(donut.radius)
		    .innerRadius(donut.radius - donut.size);
	
		var pie = d3.pie()
		    .sort(null)
		    .startAngle(0)
		    .endAngle(360)
		    .value(function(d) { return d; });
			
		var donutFore = donutChart.selectAll("path")
			.data(pie(graphData))
			.enter()
			.append("path")
			.attr("class", "donutFore")
			.style("fill", function(d, i){
				return colorArr[i];
			});
				
		donutFore.transition()
		.duration(500)
		.delay(500)
		.attrTween("d", function(d, i) {
			var interpolate = d3.interpolate({startAngle:d.startAngle, endAngle:d.startAngle}
											 ,{startAngle:d.startAngle, endAngle:d.endAngle});
			return function(t) {
				return arc(interpolate(t));
			}
		});
	}
	
	var donutChart = d3.select(donut.div)
	    .append('svg')
	    .attr("width", donut.width)
	    .attr("height", donut.height)
	    .attr("align", "center")
	    .append("g")
	    .attr("transform", "translate(" + (donut.width/2) + "," +
	                                      (donut.height/2) + ")");

	this.initChart = function(){
	    donutChart.select('.text_main').text("0")
	    donutChart.select('.text_date').text("");
	    donutChart.selectAll(".arc").remove();
	}

}//bar end