/**
d3 라이브러리를 이용한 혈당 챠트
<script src="<contextPath>/js/chart/d3.min.js"></script>
https://d3js.org/d3.v4.min.js
**/
function MainChart(_param){
	var param = _param || {};
	
	param.div = param.div||"body";
	param.height = param.height;
	param.margin = param.margin||{top:10, right:20,bottom:30, left:20};
	param.lowVal = param.lowVal||80;
	param.highVal = param.highVal||100;
	param.dotSize = param.dotSize||3;
	param.bubbleYn = param.bubbleYn||false;
	var userMaxCgm = param.minMax[1];
	var startCgmLoc = 0;
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
	    var minmax = param.minMax;
	    var minVal = d3.min(minmax,function(c){return c});
	    var maxVal = d3.max(minmax,function(c){return c});
	    if(_dataset!=undefined){
	        var minData = d3.min(_dataset, function(c) { return d3.min(c.y, function(d) { return d.y; }); });
	        var maxData = d3.max(_dataset, function(c) { return d3.max(c.y, function(d) { return d.y; }); });
	        minVal = minData<minVal?minData:minVal;
	        maxVal = maxVal<maxData?maxData:maxVal;
	    }
	    return [minVal,maxVal];
	}

	var getYAxisData = function(minmax){
		var g = (userMaxCgm-7) > 250 ? 100 : 50; // 최대혈당 250mg/dL 이상일경우 단위별 offer를 100으로 변경 
	    var rt = [];
	    for(var i=0; i*g<=Math.round(minmax[1]/10) * 10; i++){
	    	rt.push(minmax[0]+(i*g));
	    }
	    return rt;
	}

	var dotOriginX = []
	var constTextOriginX = []
	var constLineOriginX = []
	var pointShadow = []
	var typeOriginX = []
	var zoomIndex = 1;
	//그래프 전체영역
	var svg = d3.select(param.div).append("svg")
	.attr("width",width+param.margin.left+param.margin.right)
	.attr("height",param.height)
	.attr('class','mainCgmGraph')
	.attr("zoomIndex","0")
	.call(d3.zoom().on("zoom", 
	function () {
		
		if(d3.event.transform.k<=1){
			d3.event.transform.k=1
		}else if(d3.event.transform.k>=4){
			d3.event.transform.k=4
		}
		if(d3.event.transform.x>=13*zoomIndex){
			d3.event.transform.x = 13*zoomIndex;
		}
		if(d3.event.transform.x<=-((d3.event.transform.k-1)*1964+1681)){
			d3.event.transform.x = -((d3.event.transform.k-1)*1964+1681);
		}
		if(d3.event.transform.k==zoomIndex){
			svg.attr("transform","translate("+d3.event.transform.x+","+param.margin.top+")");//이동
		}else{
			zoomIndex = d3.event.transform.k
			d3.event.transform.y=0
			
			for(var i=0;i<$('.dot').length;i++){
				var orix = dotOriginX[i]+10-1;
				$('.dot').eq(i).attr('cx',orix*d3.event.transform.k);
				$('.clicker').eq(i).attr('cx',orix*d3.event.transform.k);
				$('.clicker').eq(i).attr('r',5*zoomIndex);
			}
			for(var i=0;i<$('.label_text').length;i++){
				var orix = constTextOriginX[i];
				$('.label_text').eq(i).attr('x',orix*d3.event.transform.k);
			}
			for(var i=0;i<$("path[class^='constLine']").length;i++){
				var orix = constLineOriginX[i];
				$("path[class^='constLine']").eq(i).attr('d',lineGenerator([[(orix)*d3.event.transform.k, height-3], [orix*d3.event.transform.k, height+3]]));
			}
			svg.selectAll(".valueLabel").remove();
			svg.selectAll(".rcordBg").remove();
			svg.selectAll(".rcordTri").remove();
			svg.selectAll(".unitLabel").remove();
			
			for(var i=0;i<typeOriginX.length;i++){
				var orix = typeOriginX[i];
				$('.typeRect').eq(i).attr('x',(orix)*d3.event.transform.k-15)
				$('.typeLine').eq(i).attr('d',lineGenerator([[orix*d3.event.transform.k, -param.margin.top+6], [orix*d3.event.transform.k, y(0)]]))
				$('.typeImage').eq(i).attr('x',(orix)*d3.event.transform.k-10)
			}
			
			for(var i = pointShadow.length-1;i>=0;i--){
				$('.point_shadow').eq(i).attr('cx',(pointShadow[i][0]+10-1)*d3.event.transform.k);
				$('.point_shadow').eq(i).attr('cy',pointShadow[i][1]-1);
			}	
			
			 $('g.yAxis path').attr("transform", "scale("+2*d3.event.transform.k+",1)");//아래 시간선(x)
			 $('.high_line').attr("transform", "scale("+2*d3.event.transform.k+",1)");//고혈당 선(x)
			 $('.low_line').attr("transform", "scale("+2*d3.event.transform.k+",1)");//저혈당 선(x)
			 $(".topArea").attr("transform", "scale("+d3.event.transform.k+",1)");//(x)
			 $(".bottomArea").attr("transform", "scale("+d3.event.transform.k+",1)");//(x)
			 $(".line").attr("transform", "scale("+d3.event.transform.k+",1)");//그래프선(x)
			 
			 svg.attr("transform","translate("+d3.event.transform.x+","+param.margin.top+")");//이동
		
		}
    }
	))
	.append("g") 
	.attr('class','grapharea')
	.attr("transform","translate("+param.margin.left+","+param.margin.top+")")
	;
	
	var svgLeft = d3.select(".yDomain").append("svg")
	.attr("width",$(".yDomain").width())
	.attr("height",param.height)
	.append("g")
	.attr("transform","translate("+param.margin.left+","+param.margin.top+")");

	var yAxis = svg.selectAll(".yAxis")
	.data([0])
	.enter().append("g")
    .attr("class","yAxis");

	yAxis.append("path")
	.attr("fill","none")
    .attr("stroke", "#b7b7b7")
    .attr("stroke-width", 1)
    .attr("stroke-opacity", 1)
    .attr("d", function(d){return lineGenerator([[0,y(0)],[2*(width+20),y(0)]]);} )
	;
	
	var constLineLt = svgLeft.selectAll(".yConstLine")
	.data([0])
    .enter().append("path")
    .attr("class", "yConstLine")
	.attr("fill","none")
    .attr("stroke", "#b7b7b7")
    .attr("stroke-width", 1)
    .attr("stroke-opacity", 1)
    .attr("d", function(){    	    		
    		return lineGenerator([[-19.1 , -9], [-19.1, height]]);
    	
    })
	;
	
	var yAxisLine = svgLeft.selectAll(".yAxis_line")
	.data(getYAxisData(getMinMax()))
	.enter().append("g")
	.attr("class","yAxis_line")
    .attr("transform","translate(0,0)");
		
	yAxisLine.append("text")
    .attr("class","yAxis_text")
    .attr("x", function(d){
    	if(d == "0"){
    		return param.margin.left -7;
    	}
    	return param.margin.left - 10;
    })
    .attr("y", function(d){
    	if(d == "0"){
    		return y(d)+-1.5;
    	}
    	return y(d)+4.5;
    })
    .text(function(d){
    	if(d == "0"){
    		return "mg/dL";
    	}
    	return d;})
    .attr("text-anchor", "end")
    .attr("dominant-baseline", "center")
    .style("fill", "#a9a9a9")
    .style("font-size", function(d){
    	if(d == "0"){
    		return "10px";
    	}
    	return "12px";
    })
//    .style("font-weight", "bold")
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
		var hh = Math.floor(d/60);
		var mm = d%60;
    	if(mm != 0){
    		return "remove";
    	}
    	constTextOriginX.push(x(d));
		return "label_text";
    })
    .attr("x", function(d, i){
		return x(d);
    })
    .attr("y", 25)
    .text(function(d, i){
		var hh = Math.floor(d/60);
		var mm = d%60;
		//시간별(30min) 눈금 
		var constLineLt = svg.selectAll(".constLine"+d)
		.data([0])
	    .enter().append("path")
	    .attr("class", function(){
	    	if(mm!=30&&mm!=0){
	    		return "remove"
	    	}
	    	return "constLine"+d;
	    })
		.attr("fill","none")
	    .attr("stroke", "#b7b7b7")
	    .attr("stroke-width", 1)
	    .attr("stroke-opacity", 1)
	    .attr("d", function(){
	    	if(mm==30||mm==0){	    
	    		constLineOriginX.push(x(d))
	    		return lineGenerator([[x(d), height-3], [x(d), height+3]]);
	    	}
//	    	else if(mm==0){
//	    		return lineGenerator([[x(d), height-6], [x(d) , height+5]]);
//	    	}
	    })
		;
		
   		return leadingZeros(hh, 2)+':'+leadingZeros(mm, 2);
    })
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
//    .style("font-weight", "bold")
    .style("fill", "#a5a5a5");
	svg.selectAll(".remove").remove();

	
	svgLeft.select(".domain")
//	.attr("stroke","#E04836")
	.attr("stroke","black")
	.attr("stroke-width","1")
	.attr("opacity",".6");  


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
    .attr("d", function(d){ return lineGenerator([[0,y(param.highVal)],[2*(width+20),y(param.highVal)]]) })
    ;
	
	stndAxis.append("path")
	.attr("class","low_line")
	.attr("fill","none")
	.attr("stroke", "rgba(201, 0, 48, 1)")
	.attr("stroke-width", 1.2)
	.attr("stroke-opacity", 0.4)
	.attr("d", function(d){ return lineGenerator([[0,y(param.lowVal)],[2*(width+20),y(param.lowVal)]]) })
	;
	
/**
 * 데이터 삽입
 */
	this.insertData = function(rawData){
//		console.log(JSON.stringify(rawData));
		var minmax = getMinMax(rawData);
		var leng = rawData.length;
		var intrvl = 10;
		
		y.domain(minmax);
		
		if(isNullToString(rawData)==""){
			return;
		}
		
		var classPhase = rawData[0].phase || 'A';
		
		var dataset = columns.map(function(group,cnt){
		    return {group:group,
		        values: rawData.map(function(d,i){
		        	return {"group":cnt,"column":group,"x":d[baseColumns],"y":d[group]};
		        })
		    }
		});
		
//		console.log(JSON.stringify(dataset));

		
		var line = d3.line()
		.x(function(d,i){return x(d[baseColumns]) + intrvl;})
		.y(function(d,i){return y(d.y);})
		.curve(d3.curveMonotoneX)
		;

		
		// Area Generator
		svg.selectAll(".areaGroup"+"."+classPhase).remove();
		
		var bottomAreaGenerator = d3.area()
		.x(function(d){
			return x(d.x) + intrvl;
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
			return x(d.x) + intrvl;
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
		.attr("class", "areaGroup"+" "+classPhase)
		
		
		areaGroup.selectAll("topArea")
		.data(dataset).enter()
		.append("path")
		.attr("class", "topArea"+" "+classPhase)
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
		.style("fill", "url(#top-area-gradient"+classPhase+")")
		;

		areaGroup.selectAll("bottomArea")
		.data(dataset).enter()
		.append("path")
		.attr("class", "bottomArea"+" "+classPhase)
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
		.style("fill", "url(#bottom-area-gradient"+classPhase+")")
		;
		
		
		

		var fst_stnd = ((param.lowVal - d3.min(minmax)) * 100 / (d3.max(minmax) - d3.min(minmax))).toFixed(2);
		var sec_stnd = ((param.highVal - d3.min(minmax)) * 100 / (d3.max(minmax) - d3.min(minmax))).toFixed(2);
		    
		//선그래프
		var defs = svg.append("linearGradient")
			.attr("id", "line-gradient"+classPhase)
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
		.attr("id", "top-area-gradient"+classPhase)
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
		.attr("id", "bottom-area-gradient"+classPhase)
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
		.attr("class","line"+" "+classPhase)
		.attr("fill","none")
//		.attr("stroke","lightgray")
		.attr("stroke","url(#line-gradient"+classPhase+")")
	    .style("stroke-width", 2)
//	    점선스타일
//	    .style("stroke-dasharray", ("0.4, 11"))
//	    .style("stroke-width", 6)
//	    .style("stroke-linecap", "round")
		.attr("d",line)
		;


		var group = svg.selectAll(".group"+"."+classPhase)
//		.data(rawData)
		.data(dataset)
		.enter().append("g")
		.attr("class","group"+" "+classPhase)
		.attr("transform", "translate("+0+", 0)");
		

		//dropShadow Filter
		var filter = svg.append('svg:filter')
	      .attr('id', 'dropShadow2'+classPhase)
		  .attr('filterUnits', "userSpaceOnUse")
		  .attr('height', '150%');
		filter.append('svg:feGaussianBlur')
	      .attr('in', 'SourceAlpha') 
	      .attr('stdDeviation', 2)
	      .attr('result', 'blur');
	    filter.append('svg:feOffset')
	      .attr('dx', 1)
	      .attr('dy', 2)
	      .attr('result', 'the-shadow');
	 // Control opacity of shadow filter
	    var feTransfer = filter.append("feComponentTransfer");
	    feTransfer.append("feFuncA")
	    	.attr("type", "linear")
	    	.attr("slope", 0.2);
	    
	    
	  //drop-shadow filter 입힐 용도
		group.selectAll(".dot"+"."+classPhase)
	    .data(function(d){return d.values}).enter()
	    .append("circle")
	    .attr("class", function(d, i){
	    	if(d.group == 0 && i < leng - 1){
	    		
	    		dotOriginX.push(x(d.x))
	    		return "none_shadow"+" "+classPhase;
	    	}else if(d.y == null){
				return "remove"+" "+classPhase;
			}
	    	dotOriginX.push(x(d.x))
	    	pointShadow.push([x(d.x),y(d.y)])
	    	return "point_shadow"+" "+classPhase;
	    })
		.attr("cx",function(d,i){
			return x(d.x) + intrvl -1;})
		.attr("cy",function(d){ 
			if(d.y == null) return;
			return y(d.y) -1; 
		}) 
	    .attr("r",5)
	    .style("stroke-width",3)
	    .style("stroke","lightgray")
	    .style("filter", "url(#dropShadow2"+classPhase+")");
		
		
		group.selectAll(".none_shadow"+"."+classPhase).remove();
		//--drop-shadow filter 입힐 용도

	    //버블 말풍선
		svg.selectAll(".bubbleGrp"+"."+classPhase).remove();
		var bubbleGrp = svg.selectAll(".bubbleGrp"+"."+classPhase)
		.data([0])
		.enter().append("g")
		.attr("class", "bubbleGrp"+" "+classPhase);
		//--버블 말풍선
				
		group.selectAll(".clicker"+"."+classPhase).remove();
		group.selectAll(".clicker"+"."+classPhase)
		.data(function(d){ return d.values }).enter()
	    .append("circle")
	    .attr("class", function(d){
			if(d.y == null){
				return "remove"+" "+classPhase;
			}
			return "clicker"+" "+classPhase;
		})
		.attr("cx",function(d,i){return x(d.x) + intrvl;})
		.attr("cy",function(d){ 
			if(d.y == null) return;
			return y(d.y); 
		}) 
		.attr("r",param.dotSize+2)
		.style('opacity',0)
		.on("mouseover",function(d){
			var xIndex = $(this).attr('cx')
			
			var rcordBg_width = 60;
			var rcordBg_y = y(d.y);

			svg.selectAll(".valueLabel").remove();
			svg.selectAll(".rcordBg").remove();
			svg.selectAll(".rcordTri").remove();
			svg.selectAll(".unitLabel").remove();
			//console.log(x(d.x))
			
			if(param.bubbleYn){
				bubbleGrp.append("rect")
				.attr("class", "rcordBg")
				.style("fill", "rgba(123, 123, 123, 1)")
				.attr("x", xIndex+param.margin.left-29)
				.attr("rx",5)
				.attr("ry",5)
				.attr("y", rcordBg_y-45)
				.attr("width", rcordBg_width)
				.attr("height","30")
				;
				
				// 역삼각형
				bubbleGrp.append("path")
				.attr("d", d3.symbol().type(d3.symbolTriangle).size(50))
				.attr("class", "rcordTri")
				.style("fill", "rgba(123, 123, 123, 1)")
				.attr("transform", "translate(" + (xIndex+param.margin.left-0) + ", " + (rcordBg_y - 14) + ")" + "rotate(180)");
				
				bubbleGrp.append("text")
				.attr("class","valueLabel")
				.attr("x",xIndex+param.margin.left)
				.attr("y",rcordBg_y-30)
				.text(d.y)
				.style("fill","white")
				.style("font-weight","bold")
				.attr("text-anchor", "middle")
				.attr("font-size", "17px")
				.attr("dominant-baseline", "bottom");
				
				bubbleGrp.append("text")
				.attr("class","unitLabel")
				.attr("x",xIndex+param.margin.left)
				.attr("y",rcordBg_y-19)
				.text("mg/dL")
				.style("fill","white")
				.attr("text-anchor", "middle")
				.attr("font-size", "12px")
				.attr("dominant-baseline", "bottom");
				
				svg.selectAll('.rcordLine').moveToBack();
				svg.selectAll('.dotPoint').moveToFront();
				svg.selectAll('.btwnGrp').moveToBack();
			}
		})
		.on("mouseout",function(){
			  
		});
		
		
		group.selectAll(".dot"+"."+classPhase)
	    .data(function(d){ return d.values }).enter()
	    .append("circle")
		.attr("class", function(d){
			if(d.y == null){
				return "remove"+" "+classPhase;
			}
			return "dot"+" "+classPhase;
		})
		.attr("cx",function(d,i){return x(d.x) + intrvl;})
		.attr("cy",function(d){ 
			if(d.y == null) return;
			return y(d.y); 
		}) 
		.style('fill',function(d, i){
			if(d.group == 0){
				if(i == rawData.length -1){
					return "blue";
				}
				if(d.y > param.highVal){
					return colorArr[2];
				}else if(d.y < param.lowVal){
					return colorArr[3];
				}
				return colorArr[1];
			}else if(d.y == null){
				return "none";
			}
			
			return colorArr[4];
		})
		.attr("r",param.dotSize)
	    .style("stroke-width", function(d,i){
	    	if(i == rawData.length -1){
				return 2;
			}
	    	if(d.group == 1){
	    		return 2;
	    	}
	    	return "none";
	    })
	    .style("stroke", function(d,i){
			if(d.group == 0){
				if(i == rawData.length -1){
					if(d.y > param.highVal){
						return colorArr[2];
					}else if(d.y < param.lowVal){
						return colorArr[3];
					}
				}
				return "none";
			}else if(d.y == null){
				return "none";
			}

			return "rgba(255, 255, 255, 1)";
	    })
		.on("mouseover",function(d){
			var xIndex = $(this).attr('cx')
			
			var rcordBg_width = 60;
			var rcordBg_y = y(d.y);

			bubbleGrp.selectAll(".valueLabel").remove();
			bubbleGrp.selectAll(".rcordBg").remove();
			bubbleGrp.selectAll(".rcordTri").remove();
			bubbleGrp.selectAll(".unitLabel").remove();
			
			if(param.bubbleYn){
				bubbleGrp.append("rect")
				.attr("class", "rcordBg")
				.style("fill", "rgba(123, 123, 123, 1)")
				.attr("x", xIndex+param.margin.left-29)
				.attr("rx",5)
				.attr("ry",5)
				.attr("y", rcordBg_y-45)
				.attr("width", rcordBg_width)
				.attr("height","30")
				;
				
				// 역삼각형
				bubbleGrp.append("path")
				.attr("d", d3.symbol().type(d3.symbolTriangle).size(50))
				.attr("class", "rcordTri")
				.style("fill", "rgba(123, 123, 123, 1)")
				.attr("transform", "translate(" + (xIndex+param.margin.left-0) + ", " + (rcordBg_y - 14) + ")" + "rotate(180)");
				
				bubbleGrp.append("text")
				.attr("class","valueLabel")
				.attr("x",xIndex+param.margin.left)
				.attr("y",rcordBg_y-30)
				.text(d.y)
				.style("fill","white")
				.style("font-weight","bold")
				.attr("text-anchor", "middle")
				.attr("font-size", "17px")
				.attr("dominant-baseline", "bottom");
				
				bubbleGrp.append("text")
				.attr("class","unitLabel")
				.attr("x",xIndex+param.margin.left)
				.attr("y",rcordBg_y-19)
				.text("mg/dL")
				.style("fill","white")
				.attr("text-anchor", "middle")
				.attr("font-size", "12px")
				.attr("dominant-baseline", "bottom");
				
				svg.selectAll('.rcordLine').moveToBack();
				svg.selectAll('.dotPoint').moveToFront();
				svg.selectAll('.btwnGrp').moveToBack();
			}
		})
		.on("mouseout",function(){
			  
		});
		
		
		svg.selectAll(".point_shadow"+"."+classPhase).moveToBack();
		svg.selectAll(".areaGroup"+"."+classPhase).moveToBack();
		svg.selectAll(".topArea"+"."+classPhase).moveToBack();
		svg.selectAll(".bottomArea"+"."+classPhase).moveToBack();
		svg.selectAll(".remove"+"."+classPhase).remove();
		
		
		if(svg.select(".group .dot:last-of-type").size() > 0){
//			$(param.div).scrollLeft(Math.round(svg.select(".group .dot:last-of-type").attr("cx")) - $(param.div).width() + $(param.div).next().width());
			var translate = (Math.round(svg.select(".group."+classPhase+" .dot:last-of-type").attr("cx")) - $(param.div).width() + $(param.div).next().width());
			startCgmLoc = translate;
			d3.zoomIdentity.x = -startCgmLoc
			console.log(d3.zoomIdentity)
			$('.grapharea').attr('transform','translate(-'+startCgmLoc+',0)');
		}

	}
	
	/*********************
	 * 타입 데이터 삽입
	 **********************/
	this.insertTypeData = function(rawData){
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
		    	return lineGenerator([[x(xVal), -param.margin.top+6], [x(xVal), y(0)]]);
		    })
	    ;
		
		var defs = svg.append("defs");
		
		var filter = defs.append("filter")
		    .attr("id", "drop-shadow")
		    .attr("width", "150%")
		    .attr("height", "150%");
		
		filter.append("feGaussianBlur")
		    .attr("in", "SourceAlpha")
		    .attr("stdDeviation", 2)
		    .attr("result", "blur");
		
		filter.append("feOffset")
		    .attr("in", "blur")
		    .attr("dx", 0)
		    .attr("dy", 2)
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
		
		for(var i=0; i < rawData.length; i++){
			var tmpData = [];
			tmpData.push(rawData[i]);
			
			var rect = typeGrp.selectAll(".typeRect" + i)
			.data(tmpData)
		    .enter().append("rect")	    
		    .attr("class", "typeRect")
			.attr("x",function(d,i){
		    	var hh = d.tm.substring(0, 2);
		    	var mm = d.tm.substring(2, 4);
		    	var xVal = Number(hh) * 60 + Number(mm);
		    	typeOriginX.push(x(xVal))
				return x(xVal)-15;
			})
			.attr("y",function(d){ 
				return -param.margin.top + 6;
			})
			.attr("width", 30)
			.attr("height", 30)
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
			.style("filter", "url(#drop-shadow)")
			.attr("rx", 4)		
			;
			
			var image = typeGrp.selectAll(".typeImage" + i)
			.data(tmpData)
		    .enter().append("image")
		    .attr("class", "typeImage")
			.attr("x",function(d,i){
		    	var hh = d.tm.substring(0, 2);
		    	var mm = d.tm.substring(2, 4);
		    	var xVal = Number(hh) * 60 + Number(mm);
				return x(xVal)-10;
			})
			.attr("y",function(d){ 
				return -param.margin.top + 11;
			})
			.attr("width", 20)
			.attr("height", 20)
			.style('background-color',function(d, i){
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
			.attr("href", function(d, i){
		    	var url = "";
		    	switch(d.type){
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
			;
		}
	}

}



