function mainChart(_chartClsNm){
	var chartClsNm = _chartClsNm|| '.chart_dot';

	var margin = {top:10, right:50,bottom:50, left:50}
  , width = 1000 - margin.left -margin.right 
  ,height = 300 -margin.top-margin.bottom; 
  var n = 48; 

  $(chartClsNm).empty();
  var chartArea = d3.select(chartClsNm); 
  
  var xScale = d3.scaleLinear()
  .domain([0, n-1])
  .range([0,width]);
  var yScale = d3.scaleLinear()
  .domain([0,1])
  .range([height,0]);
  
  var line = d3.line()
  .x(function(d,i){return xScale(i);})
  .y(function(d,i){return yScale(d.y);})
  .curve(d3.curveMonotoneX);
  
   var dataset = d3.range(n).map(function(d){return {"y":d3.randomUniform(0.8)()}}); 
    
  
  var svg = chartArea.append("svg")
  .attr("width",width+margin.left+margin.right)
  .attr("height",height+margin.top+margin.bottom)
  .append("g")
  .attr("transform","translate("+margin.left+","+margin.top+")");
  
  var xAxisGenerator = d3.axisBottom(xScale);
  //xAxisGenerator.ticks(5);
  //xAxisGenerator.tickValues([0,5,10,15,20]); 
  
  
  var xAxis = svg.append("g")
  .attr("class","x axis")
  .attr("transform","translate(0, "+height+")")
  .call(xAxisGenerator)
  ;
  
  xAxis.select(".domain")
  .attr("stroke","#E04836")
  .attr("stroke-width","1")
  .attr("opacity",".6"); 
  
  
  var yAxis = svg.append("g")
  .attr("class","y axis")
  .attr("margin-top", margin.top)
  .attr("transform", "translate("+width+")")
  .call(d3.axisRight(yScale));
  
  yAxis.select(".domain")
  .attr("stroke","#E04836")
  .attr("stroke-width","6")
  .attr("opacity",".6");    
  
  
  svg.append("path")
  .datum(dataset)
  .attr("class","line")
  .attr("fill","none")
  .attr("stroke","black")
  .attr("d",line);
  
  
  svg.selectAll(".dot")
  .data(dataset)
  .enter().append("circle")
  .attr("class","dot")
  .attr("cx",function(d,i){return xScale(i)})
  .attr("cy",function(d){
  	return yScale(d.y)}
  ) 
  .style('fill',function(d){
   	console.log(d.y);
   	if(d.y > 0.5){
   		return "gold";
   	}else if(d.y < 0.2){
   		return "red";
   	}
   	return  "lightgray";
  })
  .attr("r",5) 
  .on("mouseover",function(a,b,c){
	  console.log(a);
	  //this.attr('class','focus')
  })
  .on("mouseout",function(){
	  
  });
}
$(document).on("pagebeforecreate",function(){ 
	console.log('1. pagebeforecreate==');
	$('.panel_right').hide();   
	mainChart();
});
$(document).on("pagebeforeshow",function(){
	console.log('2. pagebeforeshow==');
	var id = $.mobile.activePage.attr('id');
	if(id == 'deshboard'){
		mainChart('.chart_dot');
		
	}else{
		mainChart('.wide_chart_dot');
		
				
	}
});
$(document).on("pageshow",function(){
	console.log('3. pageshow==');
});
$(document).on("ready",function(){ 
	console.log('4. ready==');
}); 

$(window).trigger('orientationchange');

$(window).on('orientationchange',function(event){	
	var orientation = window.orientation;
	if(screen.width < screen.height){
		//alert('세로');
		$.mobile.changePage('#deshboard');
		$('.chart_dot')
		
	}else{
		//alert('가로');
		$.mobile.changePage('#deshboard_wide');
		
		
	}  


});

$('.chart_dot').bind("touchend",function(e){
	
	console.log(e.originalEvent.touches[0].screenX);    

});




