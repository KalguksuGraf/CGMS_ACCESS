/**
d3 라이브러리를 이용한 혈당 챠트(팔로우 앱용)

--20200723 추가기능 (김태일)
1 .main page 이외 영역에서도 작동기능(외부 페이지내 팝업 태그 필요)
2. 시간 대별 눈금 적용

<script src="<contextPath>/js/chart/d3.min.js"></script>
https://d3js.org/d3.v4.min.js
**/
function FollowDtlsChart(_param){
	var cgmDtlsChartData = [];
	var minmax;
	
	var param = _param || {};

	param.div = param.div||"body";
	param.height = param.height;
	param.margin = param.margin||{top:20, right:10,bottom:30, left:25};
	param.lowVal = param.lowVal||110;
	param.highVal = param.highVal||150;
	param.ser	 = param.ser||'';
	try{
	    param.width = Number(param.width||d3.select(param.div).style("width").replace("px","")) ;
	}catch(e){
	    console.log("object is not defined");
	}finally{
	    param.width = param.width||d3.select("body").style("width").replace("px","") ;
	}
	var width = param.width-param.margin.left-param.margin.right,
	    height = param.height-param.margin.top-param.margin.bottom;

	var columns = param.columns||["x"];
	var baseColumns = param.baseColumns||"y";
	var ser = param.ser || '';
	var colorArr = param.colors||["#fff", "#ff9b2f", "#ff9b2f", "#ADD6FB", "#3399FF"];
	
	$(param.div).empty();

	// x축 그리기
	xRange = [];
	
	for(var i=0; i <= 180; i++){
		xRange.push(i);
	};
	
	var x = d3.scaleLinear().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);

	x.domain([0, 180]);
	y.domain(param.minMax);

	var lineGenerator = d3.line();

	var getMinMax = function(_dataset){
	    var minmax_ = param.minMax;
	    var minVal = d3.min(minmax_,function(c){return c});
	    var maxVal = d3.max(minmax_,function(c){return c});
	    if(_dataset!=undefined){
	        var minData = d3.min(_dataset, function(c) { return d3.min(c.y, function(d) { return d.y; }); });
	        var maxData = d3.max(_dataset, function(c) { return d3.max(c.y, function(d) { return d.y; }); });
	        minVal = minData<minVal?minData:minVal;
	        maxVal = maxVal<maxData?maxData:maxVal;
	    }
	    return [minVal,maxVal];
	}

	var getYAxisData = function(minmax){
		var g = 100;
	    var rt = [];
	    for(var i=0; i*g<=Math.round(minmax[1]/10) * 10; i++){
	    	rt.push(minmax[0]+(i*g));
	    }
	    return rt;
	}
	
	var svg = d3.select(param.div).append("svg")
		.attr("width",param.width)
		.attr("height",param.height)
		.attr('class','graphsvg')
		.on("click", function(){
			if($("#pop_chart"+ser+"").length > 0){
				$("#pop_chart"+ser+" .popup_value li:eq(1)").html(Math.round(param.minMax[1]) + ' <em>mg/dL</em>');
				
				$("#pop_chart"+ser+" .popup_chart_area").empty();
				
				var cgmPopChart = new FollowPopChart({
					  "div"			: "#pop_chart"+ser+" .popup_chart_area"
					, "width"		: $("#pop_chart"+ser+" .popup_chart_area").width()
					, "height"		: $("#pop_chart"+ser+" .popup_chart_area").height()
					, "minMax"		: param.minMax
					, "columns"		: [ "y" ]
					, "baseColumns"	: "x"
					, "colors"		: param.colors
					, "highVal"		: param.highVal
					, "lowVal"		: param.lowVal
					, "typeColor"	: param.typeColor
					, "margin"		: {top:10, right:10, bottom:30, left:10}
					, "tm"			: param.tm
					, "type"		: param.type
				});
				
				cgmPopChart.insertData(cgmDtlsChartData);
				
				$("#pop_chart"+ser+"").popup("open");
			}
		})
		.append("g")
		.attr("transform","translate("+param.margin.left+","+param.margin.top+")");
	
//	var yAxis = svg.selectAll(".yAxis")
//		.data([d3.min(param.minMax), d3.max(param.minMax)])
//		.enter().append("g")
//	    .attr("class","yAxis")
//	    .attr("transform","translate(0, " + y(d3.min(param.minMax)) + ")");
//
//	yAxis.append("path")
//		.attr("fill","none")
//	    .attr("stroke", colorArr[1])
//	    .attr("stroke-opacity", 1)
//	    .style("stroke-width", 0.7)
//	    .attr("d", function(d){return lineGenerator([[0,-y(d)],[width,-y(d)]]);} )
//	;
			
	svg.selectAll(".xLabel").remove();
	var xLabel = svg.append("g")
	    .attr("class", "xLabel")
	    .attr("transform", "translate(0, "+y(d3.min(param.minMax))+")")
	;
	
	xLabel.selectAll(".xAxis")
//		.data([0, 60, 120, 180])
		.data([60, 120])
	    .enter().append("path")
	    .attr("class","xAxis")
		.attr("fill","none")
	    .attr("stroke", colorArr[1])
	    .attr("stroke-width", 0.7)
	    .attr("stroke-opacity", 1)
	    .attr("d", function(d){
	    	return lineGenerator([[x(d), -y(d3.min(param.minMax))], [x(d), -y(d3.max(param.minMax))]]);
	    })
    ;
	
	// https://github.com/wbkd/d3-extended
	d3.selection.prototype.moveToFront = function() {  
	  return this.each(function(){
	    this.parentNode.appendChild(this);
	  });
	};
	d3.selection.prototype.moveToBack = function() {  
	    return this.each(function() { 
	        var firstChild = this.parentNode.firstChild; 
	        if (firstChild) { 
	            this.parentNode.insertBefore(this, firstChild); 
	        } 
	    });
	};

	/*********************
	 * 데이터 삽입
	 **********************/	
	this.insertData = function(rawData){
		cgmDtlsChartData = rawData;
		
		minmax = getMinMax(rawData);
				
		minmax[0] = minmax[0] - 20;
		minmax[1] = minmax[1] + 20;
				
		y.domain(minmax);
		
		var dataset = columns.map(function(group,cnt){
		    return {group:group,
		        values: rawData.map(function(d,i){
		        	return {"group":cnt,"column":group,"x":d[baseColumns],"y":d[group]};
		        })
		    }
		});
				
		var line = d3.line()
			.x(function(d,i){return x(d[baseColumns]);})
			.y(function(d,i){return y(d.y);})
			.curve(d3.curveMonotoneX)
		;

		svg.selectAll(".areaGroup").remove();
		
		var bottomAreaGenerator = d3.area()
			.x(function(d){
				return x(d.x);
			})
			.y0(function(d){
				return y(d.y);
			})
			.y1(function(d){
				return y(d3.min(minmax));
			})
			.curve(d3.curveMonotoneX)
		;
		
		var topAreaGenerator = d3.area()
			.x(function(d){
				return x(d.x);
			})
			.y0(function(d){
				return y(d3.max(minmax));
			})
			.y1(function(d){
				return y(d.y);
			})
			.curve(d3.curveMonotoneX)
		;
		
		var fst_stnd = ((param.lowVal - d3.min(minmax)) * 100 / (d3.max(minmax) - d3.min(minmax))).toFixed(2);
		var sec_stnd = ((param.highVal - d3.min(minmax)) * 100 / (d3.max(minmax) - d3.min(minmax))).toFixed(2);
		
		//선그래프
		var idx = $("linearGradient[id^=line-gradient]").length + 1;
		var defs = svg.append("linearGradient")
			.attr("id", "line-gradient" + idx)
			.attr("gradientUnits", "userSpaceOnUse")
		    .attr("x1", 0).attr("y1", y(d3.min(minmax)))
		    .attr("x2", 0).attr("y2", y(d3.max(minmax)))
		    .selectAll("stop")
		    .data([
		        {offset: "0%", color: colorArr[3]},
		        {offset: fst_stnd + "%", color: colorArr[3]},
		        {offset: fst_stnd + "%", color: colorArr[1]},
		        {offset: sec_stnd + "%", color: colorArr[1]},
		        {offset: sec_stnd + "%", color: colorArr[2]},
		        {offset: "100%", color: colorArr[2]},
		    ])
		    .enter().append("stop")
		    .attr("offset", function(d) { return d.offset; })
		    .attr("stop-color", function(d) { return d.color; });
		
		
		var areaDefs1 = svg.append("linearGradient")
			.attr("id", "top-area-gradient" + idx)
			.attr("gradientUnits", "userSpaceOnUse")
			.attr("x1", 0).attr("y1", y(d3.min(minmax)))
			.attr("x2", 0).attr("y2", y(d3.max(minmax)))
			.selectAll("stop")
			.data([
				{offset: "0%"			, color: colorArr[3]},
				{offset: fst_stnd + "%"	, color: colorArr[3]},
				{offset: fst_stnd + "%"	, color: colorArr[0]},
				{offset: "100%"			, color: colorArr[0]},
			])
			.enter().append("stop")
			.attr("offset", function(d) { return d.offset; })
			.attr("stop-color", function(d) { return d.color; })
			.attr("stop-opacity", 0.2);
		
		var areaDefs2 = svg.append("linearGradient")
			.attr("id", "bottom-area-gradient" + idx)
			.attr("gradientUnits", "userSpaceOnUse")
			.attr("x1", 0).attr("y1", y(d3.min(minmax)))
			.attr("x2", 0).attr("y2", y(d3.max(minmax)))
			.selectAll("stop")
			.data([
				{offset: "0%"			, color: colorArr[0]},
				{offset: sec_stnd + "%"	, color: colorArr[0]},
				{offset: sec_stnd + "%"	, color: colorArr[2]},
				{offset: "100%"			, color: colorArr[2]},
			])
			.enter().append("stop")
			.attr("offset", function(d) { return d.offset; })
			.attr("stop-color", function(d) { return d.color; })
			.attr("stop-opacity", 0.2);

		var areaGroup = svg.append("g")
		.attr("class", "areaGroup")
		
		
		areaGroup.selectAll("topArea")
			.data(dataset).enter()
			.append("path")
			.attr("class", "topArea")
			.attr("d", topAreaGenerator(rawData))
			.style("fill", "url(#top-area-gradient"+idx+")")
		;

		areaGroup.selectAll("bottomArea")
			.data(dataset).enter()
			.append("path")
			.attr("class", "bottomArea")
			.attr("d", bottomAreaGenerator(rawData))
			.style("fill", "url(#bottom-area-gradient"+idx+")")
		;
		
		
		// -- Area Generator
		var stndAxis = svg.selectAll(".stndAxis")
			.data([0])
			.enter().append("g")
		    .attr("class","stndAxis")
		    .attr("transform","translate(0,0)")
		    .style("stroke-dasharray", ("3, 3"));
		
		if(Number(param.highVal) > Number(minmax[0]) && Number(param.highVal) < Number(minmax[1])){
			stndAxis.append("path")
				.attr("class","high_line")
				.attr("fill","none")
				.attr("stroke", "rgba(255, 223, 59, 1)")
				.attr("stroke-width", 1.2)
			    .attr("d", function(d){ return lineGenerator([[0,y(param.highVal)],[width,y(param.highVal)]]) })
		    ;
		}
				
		if(Number(param.lowVal) > Number(minmax[0]) && Number(param.lowVal) < Number(minmax[1])){
			stndAxis.append("path")
				.attr("class","low_line")
				.attr("fill","none")
				.attr("stroke", "rgba(201, 0, 48, 1)")
				.attr("stroke-width", 1.2)
				.attr("d", function(d){ return lineGenerator([[0,y(param.lowVal)],[width,y(param.lowVal)]]) })
			;
		}

		svg.append("path")
			.datum(rawData)
			.attr("class","line")
			.attr("fill","none")
			.attr("stroke","url(#line-gradient"+idx+")")
		    .style("stroke-width", 1.7)
			.attr("d",line)
		;
		
		svg.selectAll(".areaGroup").moveToBack();
		svg.selectAll(".topArea").moveToBack();
		svg.selectAll(".bottomArea").moveToBack();
		svg.selectAll(".remove").remove();

	}
}