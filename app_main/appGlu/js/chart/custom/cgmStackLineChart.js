
function cgmStackLineChart(_param){

var param = _param || {};

//막대챠트
param.div = param.div||"body";
param.margin = param.margin||{top:30, right: 0, bottom:0, left:0};
param.size = param.size||20;
param.autoYn = param.autoYn||true;
param.minMax = param.minMax||[0,1];
param.rangeYn = param.range!=undefined?true:false;
param.range = param.range||[[0.6,0.8]];
param.height = param.height;

try{
	param.width = Number(param.width||d3.select(param.div).style("width").replace("px","")) ;
	param.height = Number(param.height||d3.select(param.div).style("height").replace("px",""));
}catch(e){
    console.log("bar object is not defined");
}finally{
	param.width = param.width||d3.select("body").style("width").replace("px","");
	param.height = param.height||d3.select("body").style("height").replace("px","");
}

var width = param.width-param.margin.left-param.margin.right,
	height = param.height-param.margin.top-param.margin.bottom;

var colorArr = param.colors||["#eeeeee","#3d6cf0", "#33c641", "#ADD6FB", "#3399FF"];
var goalValue = param.goalValue||10000;
var label = param.label||["월","화","수","목","금","토","일"];

var baseColumns = param.baseColumns||"no";

var parseDate = d3.timeParse("%Y-%m"),
    formatYear = d3.format("02d");

var getMinMax = function(_dataset){
	var minmax = param.minMax;
	var minVal = d3.min(minmax,function(c){return c});
	var maxVal = d3.max(minmax,function(c){return c});
	return [minVal,maxVal];
}

var getYAxisData = function(minmax){
	var n = 6;
	var g = Math.round((minmax[1]-minmax[0])/n);
	
	var rt = [];
	for(var i=0; i<=n; i++){
		rt.push(minmax[0]+(i*g));
	}
	return rt;
}

var lineGenerator = d3.line();

var maxVal = getYAxisData(getMinMax())[getYAxisData(getMinMax()).length-1];
var minVal = 0;	//바 그래프에서 최소 높이

/** 데이터가공 **/
this.changeData = function (_rawData){
    return _rawData.map(function(d,i){
        var totalCal = d.data4;
        return {"no": d.no, "data1":d.data1, "data2":d.data2, "data3":d.data3, "data4":d.data4, "totalCal":totalCal, "baseCnt":goalValue}
    });
}

var y0 = d3.scaleBand()
    .rangeRound([param.height, 50])
    .padding(0.1);

var y = d3.scaleLinear().range([height, 30]);

var x = d3.scaleBand()
    .rangeRound([0, param.width])
    .padding(.5);

var xAxis = d3.axisBottom()
    .scale(x);

var keys = ["data1", "data2", "data3", "data4"];

var color = function(i){
    return colorArr[i];
}

var barChart = d3.select(param.div).append("svg")
    .attr("width", param.width + param.margin.left + param.margin.right)
    .attr("height", param.height + param.margin.top + param.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + param.margin.left + "," + param.margin.top + ")");

var groupLabel = barChart.append("g")
  .attr("class", "groupLabel")
  .attr("transform", "translate(" + param.margin.left + ",5)");


x.domain([]);
y.domain([0, goalValue]).range([y0.bandwidth(), 0]);

var yAxis = barChart.selectAll(".yAxis")
					.data(getYAxisData(getMinMax()))
					.enter().append("g")
					.attr("class", "yAxis")
					.attr("transform", "translate(0,0)");
 
var goalLabel = barChart.append("g")
						.attr("class", "goalLabel")
						.attr("transform","translate(0,0)");

var lineGenerator = d3.line();

/**데이터 삽입**/
this.currentData = [];
this.insertData = function(rawData){	
	var dataset = this.changeData(rawData);
	var n = rawData.length;
	
 this.initChart();
 var thisObj = this;
 currentData = dataset;
 
 var minmax = getMinMax(dataset);

 x.domain(dataset.map(function(d){ return d.no}));
 y.domain(minmax).range([y0.bandwidth(), 0]);

 groupLabel.selectAll(".dayCircle").remove();
 groupLabel.selectAll(".dayCircle")
 			.data(dataset).enter()
 			.append("circle")
			.attr("class", "dayCircle")
			.attr("id", function(d, i){
				return "dayCircle_"+d.no;
			})
			.attr("cx", function(d, i){
				return i * (param.width-60)/8 + 60;
			})
			.attr("cy",y(0)+21)
			.attr("r",10)
			.style("fill","none");
 
 var tmpVal = y(d3.min(minmax));
 var xLabel = barChart.append("g")
 .attr("class", "xLabel")
 .attr("transform", "translate(0, "+tmpVal+")");


xLabel.selectAll(".label_text").data(rawData)
 .enter().append("text")
 .attr("class", "label_text")
 .attr("x", function(d, i){
	 return x(d[baseColumns])+10;
	 })
 .attr("y", 20)
 .text(function(d, i){
 	return d[baseColumns];
 })
 .attr("text-anchor", "middle")
 .style("font-size", "11px")
 .style("fill", "#a5a5a5");

 var gradient = barChart.append("linearGradient")
 .attr("id", "gradient")
 .attr("x1", "0%")
 .attr("y1", "100%")
 .attr("x2", "0%")
 .attr("y2", "0%");

 gradient.append("stop")
   .attr("offset", "0")
   .attr("stop-color", "deepskyblue")
 ;
 gradient.append("stop")
   .attr("offset", "1")
   .attr("stop-color", "rgb(57, 105, 239)")
 ;

 
  var dataGroup = ["baseCnt", "data4", "data3", "data2", "data1"].map(function(name,cnt){
    return dataset.map(function(d,i){
        return {group:cnt, no:d.no, value: d.data3, max_val: d.data2, avg_val: d.data1}
    })
  });
  
  var groupSet = ["data4"].map(function(name,cnt){
	    return dataset.map(function(d,i){
	        return {group:cnt, no:d.no, value: +d[name] }
	    })
	  });

  barChart.selectAll(".barGroup").remove();
  var barGroup = barChart.selectAll(".bar")
        .data(dataGroup)
        .enter().append("g")
        .attr("class","barGroup")
        .attr("transform","translate(0,0)");

  barGroup.selectAll(".bar")
      .data(function(d){return d})
      .enter().append("rect")
      .attr("class","bar")
      .style("fill", color(0))
      .attr("x", function(d) { return x(d[baseColumns])+ 3; })
      .attr("rx", 7.5)
      .attr("ry", 7.5)
//      .attr("y",  y(0))
//      .attr("y", function(d) { return y(d[baseColumns])})
      .transition().duration(750).delay(function(d,i){ return i*10; })
      .attr("y",  function(d,i) {
    	  if(d.group == 2) {
//	    		  if(d.value >= 70){
//	    			  return y(d.value+120)  
//	    		  }else if(d.value < 70 && d.value >= 60){
//	    			  return y(d.value+240)
//	    		  }else{
//	    			  return y(d.value+80)
//	    		  }
    		  return y(d.max_val)
    		  }
    	  })
      .attr("width", 15)
      .attr("height", function(d, i) {
    	  if(d.group == 2)return y0.bandwidth() - y(d.value);
      })
      .style("fill", function(d, i) {
    	  return color(d.group);
      })
      .style("fill-opacity", "0.3");
      ;
  
  barChart.selectAll(".group").remove();
  var group = barChart.selectAll(".group")
	.data(groupSet)
	.enter().append("g")
	.attr("class","group");

  barChart.selectAll(".baseRect").remove();
  var baseRect = barChart.selectAll(".baseRect")
  	.data(rawData).enter().append("rect")
	.attr("class", "baseRect")
	.attr("x", function(d, i){
		return x(d[baseColumns])-17;
	})
	.attr("y", y(minmax[1]))
	.attr("width", function(d, i){
		return Math.floor(width/n);
	})
	.attr("height", Math.abs(y(minmax[1]) - y(minmax[0])))
	.style("fill-opacity", "0");
  
  goalLabel.append("text")
  .attr("class", "goalLabel_text")
  .attr("x", param.margin.left)
  .attr("y", y(400)-12)
  .style("fill", "#AAAAAA")
  .style("font-size", "15px")
  .text("(%)");
  
  goalLabel.append("path")
  .attr("class","goalLabel_line")
  .attr("fill","none")
  .attr("stroke", color(1))
  .attr("stroke-width", 1)
  .attr("d", lineGenerator([[param.margin.left+20, y(400)],[param.width-20, y(400)]]));
  
  goalLabel.append("text")
  .attr("class", "goalLabel_text")
  .attr("x", param.margin.left)
  .attr("y", y(400)+5)
  .style("fill", "#AAAAAA")
  .style("font-size", "12px")
  .text(400);
  
  goalLabel.append("path")
  .attr("class","goalLabel_line")
  .attr("fill","none")
  .attr("stroke", color(1))
  .attr("stroke-width", 1)
  .attr("d", lineGenerator([[param.margin.left+20, y(300)],[param.width-20, y(300)]]));
  
  goalLabel.append("text")
  .attr("class", "goalLabel_text")
  .attr("x", param.margin.left)
  .attr("y", y(300)+5)
  .style("fill", "#AAAAAA")
  .style("font-size", "12px")
  .text(300);
  
  goalLabel.append("path")
  .attr("class","goalLabel_line")
  .attr("fill","none")
  .attr("stroke", color(1))
  .attr("stroke-width", 1)
  .attr("d", lineGenerator([[param.margin.left+20, y(200)],[param.width-20, y(200)]]));
  
  goalLabel.append("text")
  .attr("class", "goalLabel_text")
  .attr("x", param.margin.left)
  .attr("y", y(200)+5)
  .style("fill", "#AAAAAA")
  .style("font-size", "12px")
  .text(200);
  
  goalLabel.append("path")
  .attr("class","goalLabel_line")
  .attr("fill","none")
  .attr("stroke", "#ECECEC")
  .attr("stroke-width", 2)
  .attr("d", lineGenerator([[param.margin.left+20, y(100)],[param.width-20, y(100)]]));
  
  goalLabel.append("text")
  .attr("class", "goalLabel_text")
  .attr("x", param.margin.left)
  .attr("y", y(100)+5)
  .style("fill", "#AAAAAA")
  .style("font-size", "12px")
  .text(100);
  
  goalLabel.append("path")
  .attr("class","goalLabel_line")
  .attr("fill","none")
  .attr("stroke", color(1))
  .attr("stroke-width", 1)
  .attr("d", lineGenerator([[param.margin.left+20, y(0)],[param.width-20, y(0)]]));
  
  goalLabel.append("text")
  .attr("class", "goalLabel_text")
  .attr("x", param.margin.left+3)
  .attr("y", y(0)+5)
  .style("fill", "#AAAAAA")
  .style("font-size", "12px")
  .text(0);
  
  var svg = d3.select(param.div).select("svg");
  
  var xScale = d3.scaleBand()
      .domain(dataset.map(function(d) { return d.no;} ))
      .rangeRound([0, param.width])
      .padding(0.5);
  
  var yScale = d3.scaleLinear()
      .domain([0, 400])
      .range([height, 30]);

  var line = d3.line()
      .x(function(d) {return xScale(d.no); })
      .y(function(d) {return yScale(d.data1); });
  	
  svg.append("path")
      .data([dataset])
      .attr("fill", "none")
      .attr("stroke", color(2))
      .attr("stroke-width", "1.5px")
      .attr("d", line)
      .attr("transform", "translate(10.5,-5)")
      ;
  
  
  svg.selectAll(".dot")
    .data(dataset)
    .enter().append("circle")
    .attr("fill", color(2))
    .attr("stroke", color(2))
    .attr("class", "dot") 
    .attr("cx", function(d, i) { return xScale(d.no); })
    .attr("cy", function(d) { return yScale(d.data1); })
    .attr("r", 5)
    .attr("transform", "translate(10.5,-5)")
    ;
}

this.initChart = function(){
    groupLabel.selectAll("circle").remove();
}

}//CustomChart end