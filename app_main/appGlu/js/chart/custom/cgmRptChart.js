/**
d3 라이브러리를 이용한 혈당 챠트
<script src="<contextPath>/js/chart/d3.min.js"></script>
https://d3js.org/d3.v4.min.js
**/
function CgmRptChart(_param){
	var param = _param || {};

	param.div = param.div||"body";
	param.height = param.height;
	param.margin = param.margin||{top:0, right:10,bottom:30, left:30};
	param.lowVal = param.lowVal||110;
	param.highVal = param.highVal||150;

	try{
//	    console.log(d3.select(param.div).style("width"));
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
	$(".yDomain").empty();
	

	// x축 그리기
	xRange = [];
	
	for(var i=0; i <= 1440; i++){
		xRange.push(i);
	};
	
	
//	var x = d3.scaleBand().rangeRound([0, width]);
	var x = d3.scaleLinear().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);

//	console.log(JSON.stringify(xRange));
//	x.domain(xRange);
	x.domain([0, 1440]);
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
	    console.log(Math.round(minmax[1]/10));
	    for(var i=0; i*g<=Math.round(minmax[1]/10) * 10; i++){
	    	rt.push(minmax[0]+(i*g));
	    }
	    return rt;
	}
	
	
	var svg = d3.select(param.div).append("svg")
	.attr("width",param.width)
	.attr("height",param.height)
//	.attr("width",width+param.margin.left+param.margin.right)
//	.attr("height",height+param.margin.top+param.margin.bottom)
	.append("g")
	.attr("transform","translate("+param.margin.left+","+param.margin.top+")");

	var yAxis = svg.selectAll(".yAxis")
	.data(getYAxisData(getMinMax()))
	.enter().append("g")
    .attr("class","yAxis")
    .attr("transform","translate(0,0)");

	yAxis.append("text")
	    .attr("class","yAxis_text")
	    .attr("x", -5)
	    .attr("y", function(d){
	    	return y(d)+4.5
	    })
	    .text(function(d){return d})
	    .attr("text-anchor", "end")
	    .attr("dominant-baseline", "center")
	    .style("font-size", "13px")
//	    .style("font-weight", "bold")
	    .style("fill", "#a5a5a5");
	
	yAxis.append("path")
    .attr("class","yAxis_line")
    .attr("fill","none")
    .attr("stroke", "gray")
    .attr("stroke-width", 0.4)
    .attr("d",function(d){ return lineGenerator([[0,y(d)],[width,y(d)]]) });
	;
	

	yAxis = svg.selectAll("yAxisLabel")
	    .data([0])
		.enter().append("text")
		.attr("class","yAxisLabel")
	    .attr("x", -param.margin.left)
	    .attr("y", param.margin.top * -1 + 10)
	    .text("(mg/dL)")
	    .attr("text-anchor", "start")
	    .attr("dominant-baseline", "center")
	    .style("font-size", "13px")
//	    .style("font-weight", "bold")
	    .style("fill", "#a5a5a5");
	
	svg.selectAll(".xLabel").remove();
	var tmpVal = y(d3.min(param.minMax));
	var xLabel = svg.append("g")
	    .attr("class", "xLabel")
	    .attr("transform", "translate(" + (param.margin.left + 15) + ", "+tmpVal+")")
	;

	
	xLabel.selectAll(".label_text")
	.data(xRange)
    .enter().append("text")
    .attr("class", function(d){
		var hh = Math.floor(d/60);
		var mm = d%60;
		if(hh % 3 == 0 && mm == 0){
			return "label_text";
		}
    	return "remove";
    })
    .attr("x", function(d, i){
		return x(d)-35;
    })
    .attr("y", 25)
    .text(function(d, i){
		var hh = Math.floor(d/60);
//		var mm = d%60;
//		var tm = leadingZeros(hh, 2)+":"+leadingZeros(mm, 2);
    	return hh+":00";
    })
    .attr("text-anchor", "end")
    .style("font-size", "12px")
//    .style("font-weight", "bold")
    .style("fill", "#a5a5a5");
	svg.selectAll(".remove").remove();

	

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
	var minmax;
	this.insertData = function(rawData){
//		console.log(JSON.stringify(rawData));
		minmax = getMinMax(rawData);
		var leng = rawData.length;
		 
		y.domain(minmax);
		
		var dataset = columns.map(function(group,cnt){
		    return {group:group,
		        values: rawData.map(function(d,i){
		        	return {"group":cnt,"column":group,"x":d[baseColumns],"y":d[group]};
		        })
		    }
		});
		
//		console.log(JSON.stringify(dataset));

		
		var line = d3.line()
		.x(function(d,i){return x(d[baseColumns]);})
		.y(function(d,i){return y(d.y);})
		.curve(d3.curveMonotoneX)
		;

		
		// Area Generator
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
		

		var areaGroup = svg.append("g")
		.attr("class", "areaGroup")
		
		
		areaGroup.selectAll("topArea")
		.data(dataset).enter()
		.append("path")
		.attr("class", "topArea")
		.attr("d", topAreaGenerator(rawData))
//		.transition()
//		.attrTween("d", function(d, i){
//			if(d.group != "y") return;
//			return function(t){
//				var values = d.values.map(function(data){
//        	   		var i = d3.interpolate(minmax[0], data.y);
//        	   		return {"x":data[baseColumns], "y":i(t)};
//                });
//                return topAreaGenerator(values);
//			}
//		})
		.style("fill", "url(#top-area-gradient)")
		;

		areaGroup.selectAll("bottomArea")
		.data(dataset).enter()
		.append("path")
		.attr("class", "bottomArea")
		.attr("d", bottomAreaGenerator(rawData))
//		.transition()
//		.attrTween("d", function(d, i){
//			if(d.group != "y") return;
//			return function(t){
//				var values = d.values.map(function(data){
//					var i = d3.interpolate(minmax[0], data.y);
//					return {"x":data[baseColumns], "y":i(t)};
//				});
//				return bottomAreaGenerator(values);
//			}
//		})
		.style("fill", "url(#bottom-area-gradient)")
		;
		
		
		// -- Area Generator
		var stndAxis = svg.selectAll(".stndAxis")
		.data([0])
		.enter().append("g")
	    .attr("class","stndAxis")
	    .attr("transform","translate(0,0)");
		
		stndAxis.append("path")
		.attr("class","high_line")
		.attr("fill","none")
		.attr("stroke", "rgba(255, 223, 59, 1)")
		.attr("stroke-width", 1.2)
	    .attr("d", function(d){ return lineGenerator([[x(0),y(param.highVal)],[width,y(param.highVal)]]) })
	    ;
		
		stndAxis.append("path")
		.attr("class","low_line")
		.attr("fill","none")
		.attr("stroke", "rgba(201, 0, 48, 1)")
		.attr("stroke-width", 1.2)
		.attr("d", function(d){ return lineGenerator([[x(0),y(param.lowVal)],[width,y(param.lowVal)]]) })
		;

		var fst_stnd = ((param.lowVal - d3.min(minmax)) * 100 / (d3.max(minmax) - d3.min(minmax))).toFixed(2);
		var sec_stnd = ((param.highVal - d3.min(minmax)) * 100 / (d3.max(minmax) - d3.min(minmax))).toFixed(2);
		    
		//선그래프
		var defs = svg.append("linearGradient")
			.attr("id", "line-gradient")
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
		.attr("id", "top-area-gradient")
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
		.attr("id", "bottom-area-gradient")
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

		svg.append("path")
		.datum(rawData)
		.attr("class","line")
		.attr("fill","none")
//		.attr("stroke","lightgray")
		.attr("stroke","url(#line-gradient)")
	    .style("stroke-width", 1.7)
		.attr("d",line)
		;


		svg.selectAll(".areaGroup").moveToBack();
		svg.selectAll(".topArea").moveToBack();
		svg.selectAll(".bottomArea").moveToBack();
		svg.selectAll(".remove").remove();

	}

	

	/*********************
	 * 타입 데이터 삽입
	 **********************/
		this.insertTypeData = function(rawData){
			console.log(JSON.stringify(rawData));
			
			var dataset = rawData.map(function(group,cnt){
			    return {group:group,
			        values: rawData.map(function(d,i){
			        	return {"group":cnt,"column":group,"x":d[baseColumns],"y":d[group]};
			        })
			    }
			});
			
			var typeGrp = svg.append("g")
		    .attr("class", "typeGrp")
		    ;
			
			var typeLine = typeGrp.selectAll(".typeLine")
				.data(rawData)
			    .enter().append("path")
			    .attr("class", "typeLine")
				.attr("fill","none")
			    .attr("stroke", function(d){
			    	var color = "";
			    	switch(d.type){
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
			    .attr("stroke-width", 0.8)
			    .attr("stroke-opacity", 1)
			    .attr("d", function(d){
			    	var hh = d.tm.substring(0, 2);
			    	var mm = d.tm.substring(2, 4);
			    	var xVal = Number(hh) * 60 + Number(mm);
			    	return lineGenerator([[x(xVal), -height-param.margin.top], [x(xVal), y(0)]]);
			    })
		    ;
			
			var typeCircle = typeGrp.selectAll(".typeCircle")
			.data(rawData)
		    .enter().append("circle")
		    .attr("class", "typeCircle")
			.attr("cx",function(d,i){
		    	var hh = d.tm.substring(0, 2);
		    	var mm = d.tm.substring(2, 4);
		    	var xVal = Number(hh) * 60 + Number(mm);
				return x(xVal);
			})
			.attr("cy",function(d){ 
				return -param.margin.top + 6;
			}) 
			.style('fill',function(d, i){
		    	var color = "";
		    	switch(d.type){
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
			.attr("r",6)
			;
		}
}