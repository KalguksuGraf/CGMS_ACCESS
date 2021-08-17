/**
d3 라이브러리를 이용한 혈당 챠트(팔로우 앱용)

--20200723 추가기능 (김태일)
1 .main page 이외 영역에서도 작동기능(외부 페이지내 팝업 태그 필요)
2. 시간 대별 눈금 적용

<script src="<contextPath>/js/chart/d3.min.js"></script>
https://d3js.org/d3.v4.min.js
**/
function FollowPopChart(_param){
	var minmax;
	
	var param = _param || {};
	
	param.div = param.div||"body";
	param.height = param.height;
	param.margin = param.margin||{top:20, right:10,bottom:30, left:25};
	param.lowVal = param.lowVal||110;
	param.highVal = param.highVal||150;

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

	var svg = d3.select(param.div).append("svg")
	.attr("width",param.width)
	.attr("height",param.height)
	.append("g")
	.attr("transform","translate("+param.margin.left+","+param.margin.top+")");
	
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
	
	
	
	
	var yAxis = svg.selectAll(".yAxis")
	.data([0])
	.enter().append("g")
    .attr("class","yAxis")
    .attr("transform","translate(0,0)");
	
	yAxis.append("path")
	.attr("fill","none")
    .attr("stroke", function(d, i){
    	return "#eee";
    })
    .attr("stroke-opacity", 1)
    .style("stroke-width", 1)
    .attr("d", function(d){return lineGenerator([[0,y(d3.min(param.minMax))],[width,y(d3.min(param.minMax))]]);} )
	;
	
//	svg.append("path")
//	.attr("fill","none")
//    .attr("stroke", function(d, i){
//    	return "#eee";
//    })
//    .attr("stroke-opacity", 1)
//    .style("stroke-width", 10)
//    .attr("d", function(d){return lineGenerator([[0,-height/10],[0,height]]);} )
//	;
	var constLineSt = svg.selectAll(".constLineSt")
	.data([0])
    .enter().append("path")
    .attr("class", "constLineSt")
	.attr("fill","none")
    .attr("stroke", "rgba(238,238,238,238)")
    .attr("stroke-width", 1)
    .attr("stroke-opacity", 1)
    .attr("d", function(){
    		return lineGenerator([[x(0), height-6], [x(0), height+5]]);
    })
	;
	var constLineLt = svg.selectAll(".constLineLt")
	.data([0])
    .enter().append("path")
    .attr("class", "constLineLt")
	.attr("fill","none")
    .attr("stroke", "rgba(238,238,238,238)")
    .attr("stroke-width", 1)
    .attr("stroke-opacity", 1)
    .attr("d", function(){
    		return lineGenerator([[width, height-6], [width, height+5]]);
    })
	;
	
	
	svg.selectAll(".xLabel").remove();
	var tmpVal = y(d3.min(param.minMax));
	var xLabel = svg.append("g")
	    .attr("class", "xLabel")
	    .attr("transform", "translate(0, "+tmpVal+")")
	;
	
	xLabel.selectAll(".label_text")
		.data(xRange)
	    .enter().append("text")
	    .attr("class", function(d){
	    	if(d == 0
				|| d == 60
				|| d == 180 ||(d%30==0&&d!=0&&d!=60&&d!=180)){
				return "label_text";
			}
	    	return "remove";
	    })
	    .attr("x", function(d, i){
	    	if(i == 0){
	    		return x(d) + 20;
	    	}if(d==30){
	    		return x(d) + 15;
	    	}
			return x(d) + 10;
	    })
	    .attr("y", 25)
	    .text(function(d, i){
	    	var rtnStr = "";
	    	var tmStr = new Date(setDateFormat(param.tm,"YYYY-MM-DD HH:MI:SS"));
	    	if(d==0||d%30==0||d%60==0||d%90==0||d%120==0||d%150==0||d%180==0){
	    		var timeStemp = tmStr.setMinutes(tmStr.getMinutes()+d)
	    		if(d!=0&&d!=180){
	    			var constLineLt = svg.selectAll(".constLine"+i)
		    		.data([0])
		    	    .enter().append("path")
		    	    .attr("class", "constLine"+i)
		    		.attr("fill","none")
		    	    .attr("stroke", "rgba(238,238,238,238)")
		    	    .attr("stroke-width", 1)
		    	    .attr("stroke-opacity", 1)
		    	    .attr("d", function(){
		    	    	if(d==30){	    	    		
		    	    		return lineGenerator([[x(d) + 4, height-3], [x(d) + 4, height+3]]);
		    	    	}else{
		    	    		return lineGenerator([[x(d)-3.3 , height-3], [x(d)-3.3 , height+3]]);
		    	    	}
		    	    })
		    		;
	    		}
	    		rtnStr = leadingZeros(tmStr.getHours(),2)+":"+leadingZeros(tmStr.getMinutes(),2)
	    		
	    	}
	    	return rtnStr;
	    })
	    .attr("text-anchor", "end")
	    .style("font-size", "12px")
	    .style("fill", "#a5a5a5")
	    .style("font-weight", "1");
	svg.selectAll(".remove").remove();
	
	/*********************
	 * 데이터 삽입
	 **********************/	
	this.insertData = function(rawData){
		minmax = getMinMax(rawData);
		
		if(Number(minmax[0]) > Number(param.lowVal)){
			minmax[0] = Number(param.lowVal) - 20;
		}
		
		if(Number(minmax[1]) < Number(param.highVal)){
			minmax[1] = Number(param.highVal) + 10;
		}
		
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
		
		var defs = svg.append("defs");
		
		var filterIdx = $("filter[id^=drop-shadow]").length + 1;
		var filter = defs.append("filter")
		    .attr("id", "drop-shadow" + filterIdx)
		    .attr("x", "-50%")
		    .attr("y", "-50%")
		    .attr("width", "200%")
		    .attr("height", "200%");
		
		filter.append("feGaussianBlur")
		    .attr("in", "SourceAlpha")
		    .attr("stdDeviation", 2)
		    .attr("result", "blur");
		
		filter.append("feOffset")
		    .attr("in", "blur")
		    .attr("dx", 0)
		    .attr("dy", 1)
		    .attr("result", "offsetBlur");
		
		filter.append("feFlood")
			.attr("in", "offsetBlur")
	        .attr("flood-color", "#3d3d3d")
	        .attr("flood-opacity", 0.4)
	        .attr("result", "offsetColor");
		
		filter.append("feComposite")
			.attr("in", "offsetColor")
	        .attr("in2", "offsetBlur")
	        .attr("operator", "in")
	        .attr("result", "offsetBlur");
		
		// merge result with original image
		var feMerge = filter.append( 'feMerge' );

		// first layer result of blur and offset
		feMerge.append( 'feMergeNode' )
		       .attr( 'in", "offsetBlur' )

		// original image on top
		feMerge.append( 'feMergeNode' )
		       .attr( 'in', 'SourceGraphic' );
		// end filter stuff
		
		svg.selectAll(".typeCircle")
		.data(rawData)
	    .enter().append("circle")
	    .attr("class", function(d){
	    	if(d.x > 60 && d.x < 65 && svg.selectAll(".typeLine").size() == 0){
	    		
	    		var constLineType = svg.selectAll(".constLineType")
	    		.data([0])
	    	    .enter().append("path")
	    	    .attr("class", "constLineType")
	    		.attr("fill","none")
	    	    .attr("stroke", "rgba(238,238,238,238)")
	    	    .attr("stroke-width", 1)
	    	    .attr("stroke-opacity", 1)
	    	    .attr("d", function(){
	    	    		return lineGenerator([[x(d.x), height-6], [x(d.x), height+5]]);
	    	    })
	    		;
	    		svg.selectAll(".typeLine")
					.data([0])
				    .enter().append("path")
				    .attr("class", "typeLine")
					.attr("fill","none")
				    .attr("stroke", function(){
				    	var color = "";
				    	switch(param.type){
					    	case "BS": color = param.typeColor[0]; break;
					    	case "ST": color = param.typeColor[1]; break;
					    	case "MD": color = param.typeColor[2]; break;
					    	case "DT": color = param.typeColor[3]; break;
					    	case "EC": color = param.typeColor[4]; break;
					    	case "BP": color = param.typeColor[5]; break;
					    	case "SL": color = param.typeColor[6]; break;
					    	case "MM": color = param.typeColor[7]; break;
				    	}
				    	return color;
				    })
				    .attr("stroke-width", 1)
				    .attr("stroke-opacity", 1)
				    .attr("d", lineGenerator([[x(d.x), y(d.y)], [x(d.x), y(d3.min(minmax))]]))
			    ;
	    		
	    		svg.selectAll(".typeImagePOP")
	    		.data([0])
	    	    .enter().append("image")
	    	    .attr("class", "typeImagePOP")
	    		.attr("x",function(){
	    	    	return x(d.x)-10+2;
	    		})
	    		.attr("y",function(){ 
	    			return y(d.y)-8.3;
	    		})
	    		.attr("width", 16)
	    		.attr("height", 16)
	    		.style('background-color',function(){
	    	    	var color = "";
	    	    	switch(param.type){
	    		    	case "BS": color = param.typeColor[0]; break;
	    		    	case "ST": color = param.typeColor[1]; break;
	    		    	case "MD": color = param.typeColor[2]; break;
	    		    	case "DT": color = param.typeColor[3]; break;
	    		    	case "EC": color = param.typeColor[4]; break;
	    		    	case "BP": color = param.typeColor[5]; break;
	    		    	case "SL": color = param.typeColor[6]; break;
	    		    	case "MM": color = param.typeColor[7]; break;
	    	    	}
	    	    	return color;
	    		})
	    		.attr("href", function(){
	    	    	var url = "";
	    	    	switch(param.type){
	    	    	case "BS": url = "../../images/chart/icon_sugar.png"; break;
	    	    	case "ST": url = "../../images/chart/icon_symptom.png"; break;
	    	    	case "MD": url = "../../images/chart/icon_meal.png"; break;
	    	    	case "DT": url = "../../images/chart/icon_takeMedi.png"; break;
	    	    	case "EC": url = "../../images/chart/icon_ext.png"; break;
	    	    	case "BP": url = "../../images/chart/icon_blood.png"; break;
	    	    	case "SL": url = "../../images/chart/icon_sleep.png"; break;
	    	    	case "MM": url = "../../images/chart/icon_memo.png"; break;
	    	    	}
	    	    	return url;
	    		})
	    		
	    		return "typeCircle";
	    		
	    		
	    	}else if(d.x == rawData[0].x){
	    		var color;
	    		if(d.y >= param.highVal){
	    			color = colorArr[2];
				}else if(d.y <= param.lowVal){
					color = colorArr[3];
				}else{
					color = "#aaaaaa";
				}
	    		
	    		svg.selectAll(".stLine")
					.data([0])
				    .enter().append("path")
				    .attr("class", "stEndLine")
					.attr("fill","none")
				    .attr("stroke", color)
				    .attr("stroke-width", 1)
				    .attr("stroke-opacity", 1) 
				    .attr("d", function(){
				    	if(y(d.y) < y((d3.max(minmax) + 30) / 2)){
				    		return lineGenerator([[x(d.x), y(d.y) + 20], [x(d.x), y(d.y)]]);
				    	}else{
				    		return lineGenerator([[x(d.x), y(d.y) - 20], [x(d.x), y(d.y)]]);
				    	}
				    })
			    ;
	    		
	    		svg.selectAll("yAxisLabel")
		    	    .data([0])
		    		.enter().append("text")
		    		.attr("class","yAxisLabel")
		    	    .attr("x", x(d.x) + 15 - ((3 - String(Math.round(d.y)).length) * 5))
		    	    .attr("y", function(){
				    	if(y(d.y) < y((d3.max(minmax) + 30) / 2)){
				    		return y(d.y) + 35;
				    	}else{
				    		return y(d.y) - 35;
				    	}
				    })
		    	    .text(String(Math.round(d.y)))
		    	    .attr("text-anchor", "end")
		    	    .style("font-size", "16px")
		    	    .style("font-weight", "400")
		    	    .style("fill", color);
	    		
	    		svg.selectAll("yAxisLabel")
		    	    .data([0])
		    		.enter().append("text")
		    		.attr("class","yAxisLabel")
		    	    .attr("x", x(d.x) + 16)
		    	    .attr("y", function(){
				    	if(y(d.y) < y((d3.max(minmax) + 30) / 2)){
				    		return y(d.y) + 45;
				    	}else{
				    		return y(d.y) - 25;
				    	}
				    })
		    	    .text("mg/dL")
		    	    .attr("text-anchor", "end")
		    	    .style("font-size", "10px")
		    	    .style("font-weight", "1")
		    	    .style("fill", color);
	    		
	    			
	    	}else if(d.x == rawData[rawData.length - 1].x){
	    		var color;
	    		if(d.y >= param.highVal){
	    			color = colorArr[2];
				}else if(d.y <= param.lowVal){
					color = colorArr[3];
				}else{
					color = "#aaaaaa";
				}
	    		
	    		svg.selectAll(".endLine")
					.data([0])
				    .enter().append("path")
				    .attr("class", "stEndLine")
					.attr("fill","none")
				    .attr("stroke", color)
				    .attr("stroke-width", 1)
				    .attr("stroke-opacity", 1)
				    .attr("d", function(){
				    	if(y(d.y) < y((d3.max(minmax) + 30) / 2)){
				    		return lineGenerator([[x(d.x), y(d.y) + 20], [x(d.x), y(d.y)]]);
				    	}else{
				    		return lineGenerator([[x(d.x), y(d.y) - 20], [x(d.x), y(d.y)]]);
				    	}
				    })
			    ;
	    		
	    		svg.selectAll("yAxisLabel")
		    	    .data([0])
		    		.enter().append("text")
		    		.attr("class","yAxisLabel")
		    	    .attr("x", x(d.x) + 9 - ((3 - String(Math.round(d.y)).length) * 5))
		    	    .attr("y", function(){
				    	if(y(d.y) < y((d3.max(minmax) + 30) / 2)){
				    		return y(d.y) + 35;
				    	}else{
				    		return y(d.y) - 35;
				    	}
				    })
		    	    .text(Math.round(d.y))
		    	    .attr("text-anchor", "end")
		    	    .style("font-size", "16px")
		    	    .style("font-weight", "400")
		    	    .style("fill", color);
	    		
	    		svg.selectAll("yAxisLabel")
		    	    .data([0])
		    		.enter().append("text")
		    		.attr("class","yAxisLabel")
		    	    .attr("x", x(d.x) + 9)
		    	    .attr("y", function(){
				    	if(y(d.y) < y((d3.max(minmax) + 30) / 2)){
				    		return y(d.y) + 45;
				    	}else{
				    		return y(d.y) - 25;
				    	}
				    })
		    	    .text("mg/dL")
		    	    .attr("text-anchor", "end")
		    	    .style("font-size", "10px")
		    	    .style("font-weight", "1")
		    	    .style("fill", color);
	    	}
	    	return "remove";
	    })
		.attr("cx",function(d){
			return x(d.x);
		})
		.attr("cy",function(d){
			return y(d.y);
		})
		.style('fill',function(){
			var color = "";
	    	switch(param.type){
		    	case "BS": color = param.typeColor[0]; break;
		    	case "ST": color = param.typeColor[1]; break;
		    	case "MD": color = param.typeColor[2]; break;
		    	case "DT": color = param.typeColor[3]; break;
		    	case "EC": color = param.typeColor[4]; break;
		    	case "BP": color = param.typeColor[5]; break;
		    	case "SL": color = param.typeColor[6]; break;
		    	case "MM": color = param.typeColor[7]; break;
	    	}
	    	return color;
		})
		.attr("r",12)
		;

				
		svg.selectAll(".lineCircle")
		.data(rawData)
	    .enter().append("circle")
	    .attr("class", function(d){
	    	if(d.y == d3.max(param.minMax)
	    			|| d.x == rawData[0].x
	    			|| d.x == rawData[rawData.length - 1].x){
	    		return "lineCircle";
	    	}
	    	return "remove";
	    })
		.attr("cx",function(d){
			if(d.y == d3.max(param.minMax)
					|| d.x == rawData[0].x
	    			|| d.x == rawData[rawData.length - 1].x){
				return x(d.x);
			}
			return;
		})
		.attr("cy",function(d){
			if(d.y == d3.max(param.minMax)
					|| d.x == rawData[0].x
	    			|| d.x == rawData[rawData.length - 1].x){
				return y(d.y);
			}
			return;
		})
		.style('fill', function(d){
			if(d.y == d3.max(param.minMax)){
				return "white";
			}else{
				if(d.y >= param.highVal){
					return colorArr[2];
				}else if(d.y <= param.lowVal){
					return colorArr[3];
				}else{
					return colorArr[1];
				}
			}
			
		})
		.style("stroke-width", function(d){
			if(d.y == d3.max(param.minMax)){
				return 3;
			}
			return 0;
		})
	    .style("stroke", function(d, i){
	    	if(d.y >= param.highVal){
				return colorArr[2];
			}else if(d.y <= param.lowVal){
				return colorArr[3];
			}
			return colorArr[1];
	    })
	    .style("filter", "url(#drop-shadow" + filterIdx + ")")
		.attr("r",function(d){
			if(d.y == d3.max(param.minMax)){
				return 6;
			}
			return 4;
		})
		;
		
		svg.selectAll(".areaGroup").moveToBack();
		svg.selectAll(".topArea").moveToBack();
		svg.selectAll(".bottomArea").moveToBack();
		svg.selectAll(".remove").remove();
		svg.selectAll(".typeCircle").remove();
		svg.selectAll(".typeImagePOP").remove();
	}
}