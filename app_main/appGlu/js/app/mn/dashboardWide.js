
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


function chartfullWide(){
	$('.wideChart').css({"width":"94%"});
	$('.yDomain').css({"width":"6%"});
}

function chartOpenLeft(){
	$('.wideChart').css({"width":"87.1%"});
	$('.yDomain').css({"width":"12.9%"});
}

function selectCgmWideChart(){
	var userId = sessionStorage.getItem("USER_ID");
	var curDe = setDateFormat("", "YYYYMMDD");
	
	var req = new Request();
	if(!isNull(req.getParameter("de"))){
		curDe = req.getParameter("de");
		localStorage.setItem("curDe", curDe);
	}else if(!isNull(localStorage.getItem("curDe"))){
		curDe = localStorage.getItem("curDe");
	}
	
//	$('#wideDe').text(setDateFormat(curDe, "YYYY/MM/DD"));
	$('#wideDe').val(setDateFormat(curDe, "YYYY-MM-DD"));
	$(".wide_chart_box div").empty();

//		console.log(JSON.stringify(result));
		var result = {"stdMap":{"HIGH_VAL":155,"LOW_VAL":110,"EMER_VAL":55},"chkYn":"Y","rsList":[{"MEASR_DE":"20210202","X":2.8,"Y":105,"MEASR_TM":"001434","TREND":"Flat"},{"MEASR_DE":"20210202","X":3.8,"Y":103,"MEASR_TM":"001934","TREND":"Flat"},{"MEASR_DE":"20210202","X":4.8,"Y":99,"MEASR_TM":"002434","TREND":"Flat"},{"MEASR_DE":"20210202","X":5.8,"Y":95,"MEASR_TM":"002934","TREND":"Flat"},{"MEASR_DE":"20210202","X":6.8,"Y":96,"MEASR_TM":"003435","TREND":"Flat"},{"MEASR_DE":"20210202","X":7.8,"Y":100,"MEASR_TM":"003934","TREND":"Flat"},{"MEASR_DE":"20210202","X":8.8,"Y":101,"MEASR_TM":"004434","TREND":"Flat"},{"MEASR_DE":"20210202","X":12.8,"Y":76,"MEASR_TM":"010433","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":13.8,"Y":86,"MEASR_TM":"010934","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":14.8,"Y":90,"MEASR_TM":"011434","TREND":"Flat"},{"MEASR_DE":"20210202","X":17.8,"Y":86,"MEASR_TM":"012937","TREND":"Flat"},{"MEASR_DE":"20210202","X":18.8,"Y":89,"MEASR_TM":"013435","TREND":"Flat"},{"MEASR_DE":"20210202","X":20.8,"Y":87,"MEASR_TM":"014435","TREND":"Flat"},{"MEASR_DE":"20210202","X":21.8,"Y":82,"MEASR_TM":"014935","TREND":"Flat"},{"MEASR_DE":"20210202","X":22.8,"Y":77,"MEASR_TM":"015434","TREND":"Flat"},{"MEASR_DE":"20210202","X":23.8,"Y":73,"MEASR_TM":"015934","TREND":"Flat"},{"MEASR_DE":"20210202","X":24.8,"Y":71,"MEASR_TM":"020434","TREND":"Flat"},{"MEASR_DE":"20210202","X":25.8,"Y":68,"MEASR_TM":"020934","TREND":"Flat"},{"MEASR_DE":"20210202","X":26.8,"Y":64,"MEASR_TM":"021434","TREND":"Flat"},{"MEASR_DE":"20210202","X":27.8,"Y":62,"MEASR_TM":"021933","TREND":"Flat"},{"MEASR_DE":"20210202","X":28.8,"Y":56,"MEASR_TM":"022434","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":29.8,"Y":61,"MEASR_TM":"022935","TREND":"Flat"},{"MEASR_DE":"20210202","X":30.8,"Y":71,"MEASR_TM":"023434","TREND":"SingleUp"},{"MEASR_DE":"20210202","X":31.8,"Y":79,"MEASR_TM":"023935","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":32.8,"Y":85,"MEASR_TM":"024435","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":33.8,"Y":86,"MEASR_TM":"024934","TREND":"Flat"},{"MEASR_DE":"20210202","X":34.8,"Y":86,"MEASR_TM":"025434","TREND":"Flat"},{"MEASR_DE":"20210202","X":35.8,"Y":84,"MEASR_TM":"025934","TREND":"Flat"},{"MEASR_DE":"20210202","X":36.8,"Y":84,"MEASR_TM":"030435","TREND":"Flat"},{"MEASR_DE":"20210202","X":37.8,"Y":84,"MEASR_TM":"030935","TREND":"Flat"},{"MEASR_DE":"20210202","X":38.8,"Y":83,"MEASR_TM":"031434","TREND":"Flat"},{"MEASR_DE":"20210202","X":39.8,"Y":84,"MEASR_TM":"031934","TREND":"Flat"},{"MEASR_DE":"20210202","X":41.8,"Y":71,"MEASR_TM":"032934","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":48.8,"Y":79,"MEASR_TM":"040433","TREND":"Flat"},{"MEASR_DE":"20210202","X":49.8,"Y":83,"MEASR_TM":"040934","TREND":"Flat"},{"MEASR_DE":"20210202","X":50.8,"Y":81,"MEASR_TM":"041434","TREND":"Flat"},{"MEASR_DE":"20210202","X":51.8,"Y":79,"MEASR_TM":"041934","TREND":"Flat"},{"MEASR_DE":"20210202","X":52.8,"Y":80,"MEASR_TM":"042434","TREND":"Flat"},{"MEASR_DE":"20210202","X":53.8,"Y":83,"MEASR_TM":"042933","TREND":"Flat"},{"MEASR_DE":"20210202","X":54.8,"Y":87,"MEASR_TM":"043434","TREND":"Flat"},{"MEASR_DE":"20210202","X":55.8,"Y":90,"MEASR_TM":"043933","TREND":"Flat"},{"MEASR_DE":"20210202","X":56.8,"Y":90,"MEASR_TM":"044433","TREND":"Flat"},{"MEASR_DE":"20210202","X":57.8,"Y":91,"MEASR_TM":"044934","TREND":"Flat"},{"MEASR_DE":"20210202","X":58.8,"Y":94,"MEASR_TM":"045433","TREND":"Flat"},{"MEASR_DE":"20210202","X":59.8,"Y":92,"MEASR_TM":"045933","TREND":"Flat"},{"MEASR_DE":"20210202","X":60.8,"Y":92,"MEASR_TM":"050434","TREND":"Flat"},{"MEASR_DE":"20210202","X":63.8,"Y":81,"MEASR_TM":"051934","TREND":"Flat"},{"MEASR_DE":"20210202","X":64.8,"Y":83,"MEASR_TM":"052434","TREND":"Flat"},{"MEASR_DE":"20210202","X":65.8,"Y":86,"MEASR_TM":"052935","TREND":"Flat"},{"MEASR_DE":"20210202","X":66.8,"Y":88,"MEASR_TM":"053434","TREND":"Flat"},{"MEASR_DE":"20210202","X":67.8,"Y":89,"MEASR_TM":"053934","TREND":"Flat"},{"MEASR_DE":"20210202","X":68.8,"Y":91,"MEASR_TM":"054434","TREND":"Flat"},{"MEASR_DE":"20210202","X":69.8,"Y":95,"MEASR_TM":"054934","TREND":"Flat"},{"MEASR_DE":"20210202","X":79.8,"Y":104,"MEASR_TM":"063933","TREND":"Flat"},{"MEASR_DE":"20210202","X":80.8,"Y":105,"MEASR_TM":"064437","TREND":"Flat"},{"MEASR_DE":"20210202","X":81.8,"Y":107,"MEASR_TM":"064934","TREND":"Flat"},{"MEASR_DE":"20210202","X":82.8,"Y":104,"MEASR_TM":"065437","TREND":"Flat"},{"MEASR_DE":"20210202","X":83.8,"Y":102,"MEASR_TM":"065936","TREND":"Flat"},{"MEASR_DE":"20210202","X":84.8,"Y":104,"MEASR_TM":"070433","TREND":"Flat"},{"MEASR_DE":"20210202","X":85.8,"Y":109,"MEASR_TM":"070935","TREND":"Flat"},{"MEASR_DE":"20210202","X":86.8,"Y":107,"MEASR_TM":"071437","TREND":"Flat"},{"MEASR_DE":"20210202","X":89.8,"Y":109,"MEASR_TM":"072933","TREND":"Flat"},{"MEASR_DE":"20210202","X":90.8,"Y":108,"MEASR_TM":"073434","TREND":"Flat"},{"MEASR_DE":"20210202","X":91.8,"Y":117,"MEASR_TM":"073934","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":92.8,"Y":122,"MEASR_TM":"074434","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":93.8,"Y":122,"MEASR_TM":"074933","TREND":"Flat"},{"MEASR_DE":"20210202","X":94.8,"Y":119,"MEASR_TM":"075433","TREND":"Flat"},{"MEASR_DE":"20210202","X":95.8,"Y":122,"MEASR_TM":"075934","TREND":"Flat"},{"MEASR_DE":"20210202","X":96.8,"Y":144,"MEASR_TM":"080436","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":97.8,"Y":176,"MEASR_TM":"080935","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":98.8,"Y":228,"MEASR_TM":"081434","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":99.8,"Y":275,"MEASR_TM":"081933","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":100.8,"Y":320,"MEASR_TM":"082433","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":101.8,"Y":354,"MEASR_TM":"082933","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":102.8,"Y":387,"MEASR_TM":"083434","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":103.8,"Y":394,"MEASR_TM":"083933","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":104.8,"Y":392,"MEASR_TM":"084433","TREND":"Flat"},{"MEASR_DE":"20210202","X":105.8,"Y":389,"MEASR_TM":"084933","TREND":"Flat"},{"MEASR_DE":"20210202","X":106.8,"Y":388,"MEASR_TM":"085433","TREND":"Flat"},{"MEASR_DE":"20210202","X":107.8,"Y":394,"MEASR_TM":"085933","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":108.8,"Y":396,"MEASR_TM":"090433","TREND":"Flat"},{"MEASR_DE":"20210202","X":109.8,"Y":385,"MEASR_TM":"090933","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":110.8,"Y":377,"MEASR_TM":"091433","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":111.8,"Y":365,"MEASR_TM":"091934","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":112.8,"Y":348,"MEASR_TM":"092433","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":113.8,"Y":329,"MEASR_TM":"092933","TREND":"DoubleDown"},{"MEASR_DE":"20210202","X":114.8,"Y":316,"MEASR_TM":"093433","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":115.8,"Y":304,"MEASR_TM":"093934","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":116.8,"Y":295,"MEASR_TM":"094436","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":117.8,"Y":269,"MEASR_TM":"094933","TREND":"DoubleDown"},{"MEASR_DE":"20210202","X":118.8,"Y":247,"MEASR_TM":"095433","TREND":"DoubleDown"},{"MEASR_DE":"20210202","X":119.8,"Y":220,"MEASR_TM":"095933","TREND":"DoubleDown"},{"MEASR_DE":"20210202","X":120.8,"Y":200,"MEASR_TM":"100433","TREND":"DoubleDown"},{"MEASR_DE":"20210202","X":121.8,"Y":183,"MEASR_TM":"100933","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":122.8,"Y":170,"MEASR_TM":"101432","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":123.8,"Y":162,"MEASR_TM":"101933","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":124.8,"Y":152,"MEASR_TM":"102432","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":125.8,"Y":150,"MEASR_TM":"102933","TREND":"Flat"},{"MEASR_DE":"20210202","X":126.8,"Y":143,"MEASR_TM":"103433","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":127.8,"Y":138,"MEASR_TM":"103933","TREND":"Flat"},{"MEASR_DE":"20210202","X":128.8,"Y":134,"MEASR_TM":"104433","TREND":"Flat"},{"MEASR_DE":"20210202","X":129.8,"Y":129,"MEASR_TM":"104932","TREND":"Flat"},{"MEASR_DE":"20210202","X":130.8,"Y":126,"MEASR_TM":"105433","TREND":"Flat"},{"MEASR_DE":"20210202","X":131.8,"Y":122,"MEASR_TM":"105933","TREND":"Flat"},{"CORETON_VALUE":111,"MEASR_DE":"20210202","X":132.8,"Y":102,"MEASR_TM":"110433","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":133.8,"Y":97,"MEASR_TM":"110933","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":134.8,"Y":90,"MEASR_TM":"111433","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":135.8,"Y":88,"MEASR_TM":"111933","TREND":"Flat"},{"MEASR_DE":"20210202","X":137.8,"Y":84,"MEASR_TM":"112932","TREND":"Flat"},{"MEASR_DE":"20210202","X":138.8,"Y":78,"MEASR_TM":"113433","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":139.8,"Y":74,"MEASR_TM":"113932","TREND":"Flat"},{"MEASR_DE":"20210202","X":140.8,"Y":75,"MEASR_TM":"114433","TREND":"Flat"},{"MEASR_DE":"20210202","X":141.8,"Y":72,"MEASR_TM":"114932","TREND":"Flat"},{"MEASR_DE":"20210202","X":142.8,"Y":70,"MEASR_TM":"115433","TREND":"Flat"},{"MEASR_DE":"20210202","X":143.8,"Y":71,"MEASR_TM":"115933","TREND":"Flat"},{"MEASR_DE":"20210202","X":144.8,"Y":58,"MEASR_TM":"120433","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":145.8,"Y":70,"MEASR_TM":"120933","TREND":"SingleUp"},{"MEASR_DE":"20210202","X":146.8,"Y":72,"MEASR_TM":"121433","TREND":"Flat"},{"MEASR_DE":"20210202","X":147.8,"Y":79,"MEASR_TM":"121933","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":148.8,"Y":82,"MEASR_TM":"122433","TREND":"Flat"},{"MEASR_DE":"20210202","X":149.8,"Y":133,"MEASR_TM":"122933","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":150.8,"Y":164,"MEASR_TM":"123433","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":151.8,"Y":169,"MEASR_TM":"123933","TREND":"Flat"},{"MEASR_DE":"20210202","X":152.8,"Y":201,"MEASR_TM":"124432","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":153.8,"Y":225,"MEASR_TM":"124933","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":154.8,"Y":242,"MEASR_TM":"125432","TREND":"SingleUp"},{"MEASR_DE":"20210202","X":155.8,"Y":250,"MEASR_TM":"125933","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":157.6,"Y":0,"MEASR_TM":"130826"},{"MEASR_DE":"20210202","X":158.6,"Y":0,"MEASR_TM":"131325"},{"MEASR_DE":"20210202","X":159.6,"Y":0,"MEASR_TM":"131828"},{"MEASR_DE":"20210202","X":159.8,"Y":298,"MEASR_TM":"131933","TREND":"SingleUp"},{"MEASR_DE":"20210202","X":160.6,"Y":0,"MEASR_TM":"132325"},{"MEASR_DE":"20210202","X":160.8,"Y":291,"MEASR_TM":"132439","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":161.6,"Y":0,"MEASR_TM":"132825"},{"MEASR_DE":"20210202","X":161.8,"Y":291,"MEASR_TM":"132933","TREND":"Flat"},{"MEASR_DE":"20210202","X":162.6,"Y":0,"MEASR_TM":"133325"},{"MEASR_DE":"20210202","X":162.8,"Y":297,"MEASR_TM":"133433","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":163.6,"Y":0,"MEASR_TM":"133825"},{"MEASR_DE":"20210202","X":163.8,"Y":303,"MEASR_TM":"133934","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":164.6,"Y":0,"MEASR_TM":"134328"},{"MEASR_DE":"20210202","X":164.8,"Y":314,"MEASR_TM":"134433","TREND":"SingleUp"},{"MEASR_DE":"20210202","X":165.6,"Y":0,"MEASR_TM":"134824"},{"MEASR_DE":"20210202","X":165.8,"Y":317,"MEASR_TM":"134933","TREND":"Flat"},{"MEASR_DE":"20210202","X":166.6,"Y":0,"MEASR_TM":"135326"},{"MEASR_DE":"20210202","X":166.8,"Y":319,"MEASR_TM":"135433","TREND":"Flat"},{"MEASR_DE":"20210202","X":167.6,"Y":0,"MEASR_TM":"135825"},{"MEASR_DE":"20210202","X":167.8,"Y":324,"MEASR_TM":"135933","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":168.8,"Y":329,"MEASR_TM":"140432","TREND":"Flat"},{"MEASR_DE":"20210202","X":169.8,"Y":337,"MEASR_TM":"140933","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":170.8,"Y":340,"MEASR_TM":"141433","TREND":"Flat"},{"MEASR_DE":"20210202","X":171.8,"Y":339,"MEASR_TM":"141933","TREND":"Flat"},{"MEASR_DE":"20210202","X":172.8,"Y":332,"MEASR_TM":"142433","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":173.8,"Y":327,"MEASR_TM":"142933","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":174.8,"Y":319,"MEASR_TM":"143433","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":175.8,"Y":305,"MEASR_TM":"143932","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":176.8,"Y":293,"MEASR_TM":"144433","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":177.8,"Y":269,"MEASR_TM":"144933","TREND":"DoubleDown"},{"MEASR_DE":"20210202","X":178.8,"Y":249,"MEASR_TM":"145433","TREND":"DoubleDown"},{"MEASR_DE":"20210202","X":179.8,"Y":230,"MEASR_TM":"145933","TREND":"DoubleDown"},{"MEASR_DE":"20210202","X":180.8,"Y":213,"MEASR_TM":"150433","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":181.8,"Y":200,"MEASR_TM":"150933","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":182.8,"Y":189,"MEASR_TM":"151433","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":183.8,"Y":176,"MEASR_TM":"151933","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":184.8,"Y":167,"MEASR_TM":"152433","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":186.8,"Y":151,"MEASR_TM":"153432","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":187.8,"Y":137,"MEASR_TM":"153932","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":188.8,"Y":126,"MEASR_TM":"154433","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":189.8,"Y":115,"MEASR_TM":"154932","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":190.8,"Y":115,"MEASR_TM":"155433","TREND":"Flat"},{"MEASR_DE":"20210202","X":191.8,"Y":110,"MEASR_TM":"155933","TREND":"Flat"},{"MEASR_DE":"20210202","X":192.8,"Y":104,"MEASR_TM":"160432","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":193.8,"Y":102,"MEASR_TM":"160932","TREND":"Flat"},{"MEASR_DE":"20210202","X":194.8,"Y":97,"MEASR_TM":"161433","TREND":"Flat"},{"MEASR_DE":"20210202","X":195.8,"Y":90,"MEASR_TM":"161933","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":196.8,"Y":88,"MEASR_TM":"162433","TREND":"Flat"},{"MEASR_DE":"20210202","X":197.8,"Y":88,"MEASR_TM":"162933","TREND":"Flat"},{"MEASR_DE":"20210202","X":198.8,"Y":87,"MEASR_TM":"163433","TREND":"Flat"},{"MEASR_DE":"20210202","X":199.8,"Y":88,"MEASR_TM":"163933","TREND":"Flat"},{"MEASR_DE":"20210202","X":200.8,"Y":91,"MEASR_TM":"164433","TREND":"Flat"},{"MEASR_DE":"20210202","X":201.8,"Y":96,"MEASR_TM":"164932","TREND":"Flat"},{"MEASR_DE":"20210202","X":202.8,"Y":96,"MEASR_TM":"165432","TREND":"Flat"},{"MEASR_DE":"20210202","X":203.8,"Y":97,"MEASR_TM":"165933","TREND":"Flat"},{"MEASR_DE":"20210202","X":204.8,"Y":98,"MEASR_TM":"170433","TREND":"Flat"},{"MEASR_DE":"20210202","X":205.8,"Y":104,"MEASR_TM":"170932","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":206.8,"Y":99,"MEASR_TM":"171433","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":207.8,"Y":94,"MEASR_TM":"171933","TREND":"Flat"},{"MEASR_DE":"20210202","X":208.8,"Y":90,"MEASR_TM":"172432","TREND":"Flat"},{"MEASR_DE":"20210202","X":209.8,"Y":86,"MEASR_TM":"172933","TREND":"Flat"},{"MEASR_DE":"20210202","X":210.8,"Y":84,"MEASR_TM":"173432","TREND":"Flat"},{"MEASR_DE":"20210202","X":211.8,"Y":93,"MEASR_TM":"173933","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":212.8,"Y":121,"MEASR_TM":"174432","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":213.8,"Y":157,"MEASR_TM":"174933","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":214.8,"Y":164,"MEASR_TM":"175432","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":215.8,"Y":168,"MEASR_TM":"175933","TREND":"Flat"},{"MEASR_DE":"20210202","X":217.8,"Y":174,"MEASR_TM":"180932","TREND":"Flat"},{"MEASR_DE":"20210202","X":218.8,"Y":176,"MEASR_TM":"181432","TREND":"Flat"},{"MEASR_DE":"20210202","X":219.8,"Y":170,"MEASR_TM":"181933","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":220.8,"Y":161,"MEASR_TM":"182433","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":221.8,"Y":152,"MEASR_TM":"182933","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":222.8,"Y":143,"MEASR_TM":"183433","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":223.8,"Y":135,"MEASR_TM":"183932","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":224.8,"Y":127,"MEASR_TM":"184432","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":225.8,"Y":121,"MEASR_TM":"184932","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":226.8,"Y":115,"MEASR_TM":"185432","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":227.8,"Y":102,"MEASR_TM":"185933","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":228.8,"Y":90,"MEASR_TM":"190432","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":229.8,"Y":84,"MEASR_TM":"190933","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":230.8,"Y":79,"MEASR_TM":"191432","TREND":"Flat"},{"MEASR_DE":"20210202","X":231.8,"Y":75,"MEASR_TM":"191933","TREND":"Flat"},{"MEASR_DE":"20210202","X":232.8,"Y":71,"MEASR_TM":"192432","TREND":"Flat"},{"MEASR_DE":"20210202","X":233.8,"Y":72,"MEASR_TM":"192932","TREND":"Flat"},{"MEASR_DE":"20210202","X":234.8,"Y":76,"MEASR_TM":"193432","TREND":"Flat"},{"MEASR_DE":"20210202","X":235.8,"Y":82,"MEASR_TM":"193932","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":236.8,"Y":98,"MEASR_TM":"194433","TREND":"SingleUp"},{"MEASR_DE":"20210202","X":237.8,"Y":123,"MEASR_TM":"194933","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":238.8,"Y":148,"MEASR_TM":"195434","TREND":"DoubleUp"},{"MEASR_DE":"20210202","X":239.8,"Y":161,"MEASR_TM":"195932","TREND":"SingleUp"},{"MEASR_DE":"20210202","X":240.8,"Y":168,"MEASR_TM":"200432","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":241.8,"Y":165,"MEASR_TM":"200932","TREND":"Flat"},{"MEASR_DE":"20210202","X":242.8,"Y":163,"MEASR_TM":"201433","TREND":"Flat"},{"MEASR_DE":"20210202","X":243.8,"Y":159,"MEASR_TM":"201933","TREND":"Flat"},{"MEASR_DE":"20210202","X":244.6,"Y":0,"MEASR_TM":"202324"},{"MEASR_DE":"20210202","X":244.8,"Y":161,"MEASR_TM":"202432","TREND":"Flat"},{"MEASR_DE":"20210202","X":245.6,"Y":0,"MEASR_TM":"202824"},{"MEASR_DE":"20210202","X":245.8,"Y":165,"MEASR_TM":"202932","TREND":"Flat"},{"MEASR_DE":"20210202","X":246.8,"Y":166,"MEASR_TM":"203432","TREND":"Flat"},{"MEASR_DE":"20210202","X":247.6,"Y":0,"MEASR_TM":"203824"},{"MEASR_DE":"20210202","X":247.8,"Y":165,"MEASR_TM":"203932","TREND":"Flat"},{"MEASR_DE":"20210202","X":248.6,"Y":0,"MEASR_TM":"204324"},{"MEASR_DE":"20210202","X":248.8,"Y":163,"MEASR_TM":"204433","TREND":"Flat"},{"MEASR_DE":"20210202","X":249.6,"Y":0,"MEASR_TM":"204824"},{"MEASR_DE":"20210202","X":249.8,"Y":165,"MEASR_TM":"204932","TREND":"Flat"},{"MEASR_DE":"20210202","X":250.6,"Y":0,"MEASR_TM":"205324"},{"MEASR_DE":"20210202","X":250.8,"Y":165,"MEASR_TM":"205432","TREND":"Flat"},{"MEASR_DE":"20210202","X":251.8,"Y":159,"MEASR_TM":"205932","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":252.8,"Y":153,"MEASR_TM":"210432","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":253.8,"Y":147,"MEASR_TM":"210932","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":254.6,"Y":0,"MEASR_TM":"211324"},{"MEASR_DE":"20210202","X":254.8,"Y":144,"MEASR_TM":"211432","TREND":"Flat"},{"MEASR_DE":"20210202","X":255.8,"Y":142,"MEASR_TM":"211932","TREND":"Flat"},{"MEASR_DE":"20210202","X":256.8,"Y":141,"MEASR_TM":"212432","TREND":"Flat"},{"MEASR_DE":"20210202","X":257.8,"Y":140,"MEASR_TM":"212932","TREND":"Flat"},{"MEASR_DE":"20210202","X":258.8,"Y":141,"MEASR_TM":"213432","TREND":"Flat"},{"MEASR_DE":"20210202","X":259.8,"Y":145,"MEASR_TM":"213932","TREND":"Flat"},{"MEASR_DE":"20210202","X":260.8,"Y":132,"MEASR_TM":"214434","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":261.8,"Y":126,"MEASR_TM":"214941","TREND":"FortyFiveDown"},{"MEASR_DE":"20210202","X":266.8,"Y":106,"MEASR_TM":"221451","TREND":"Flat"},{"MEASR_DE":"20210202","X":267.8,"Y":103,"MEASR_TM":"221932","TREND":"Flat"},{"MEASR_DE":"20210202","X":268.8,"Y":105,"MEASR_TM":"222432","TREND":"Flat"},{"MEASR_DE":"20210202","X":269.8,"Y":108,"MEASR_TM":"222932","TREND":"Flat"},{"MEASR_DE":"20210202","X":270.8,"Y":107,"MEASR_TM":"223432","TREND":"Flat"},{"MEASR_DE":"20210202","X":271.8,"Y":103,"MEASR_TM":"223932","TREND":"Flat"},{"MEASR_DE":"20210202","X":272.8,"Y":100,"MEASR_TM":"224432","TREND":"Flat"},{"MEASR_DE":"20210202","X":273.8,"Y":99,"MEASR_TM":"224931","TREND":"Flat"},{"MEASR_DE":"20210202","X":275.8,"Y":90,"MEASR_TM":"225938","TREND":"Flat"},{"MEASR_DE":"20210202","X":277.8,"Y":100,"MEASR_TM":"230932","TREND":"FortyFiveUp"},{"MEASR_DE":"20210202","X":278.8,"Y":89,"MEASR_TM":"231433","TREND":"SingleDown"},{"MEASR_DE":"20210202","X":279.8,"Y":87,"MEASR_TM":"231932","TREND":"Flat"},{"MEASR_DE":"20210202","X":280.8,"Y":85,"MEASR_TM":"232432","TREND":"Flat"},{"MEASR_DE":"20210202","X":281.8,"Y":85,"MEASR_TM":"232932","TREND":"Flat"},{"MEASR_DE":"20210202","X":282.8,"Y":85,"MEASR_TM":"233432","TREND":"Flat"},{"MEASR_DE":"20210202","X":283.8,"Y":85,"MEASR_TM":"233932","TREND":"Flat"},{"MEASR_DE":"20210202","X":284.8,"Y":84,"MEASR_TM":"234432","TREND":"Flat"},{"MEASR_DE":"20210202","X":285.8,"Y":83,"MEASR_TM":"234932","TREND":"Flat"},{"MEASR_DE":"20210202","X":286.8,"Y":82,"MEASR_TM":"235432","TREND":"Flat"},{"MEASR_DE":"20210202","X":287.8,"Y":82,"MEASR_TM":"235932","TREND":"Flat"},{"MEASR_DE":"20210202","X":516.8,"Y":113,"MEASR_TM":"434","TREND":"Flat"},{"MEASR_DE":"20210202","X":1116.8,"Y":106,"MEASR_TM":"934","TREND":"FortyFiveDown"}]}
		var chartData = [];
		var dotSize = 3;
		var width = $(".wide_chart_box").width();
		
		var minVal = 0;//Number.MAX_VALUE;
		var maxVal = Number.MIN_VALUE;
		var list = result.rsList;
		var stdVal = result.stdMap;
		
		if(isNullToString(list) != ""){			
			// 트렌드 처리
			var trend = isNullToString(list[list.length - 1].TREND);
			$("#circle_cgmVal").html(list[list.length - 1].Y + ' <span class="font_14">mg/dL</span>');
			if(trend.indexOf("Up") > -1){
				$("#circle_arrow").addClass("bo_col_yellow");
				if(trend == "SingleUp"){
					$("#circle_arrow").addClass("top1");
				}else if(trend == "DoubleUp"){
					$("#circle_arrow").addClass("top2");
				}else if(trend == "FortyFiveUp"){
					$("#circle_arrow").addClass("top_right");
				}
			}else if(trend.indexOf("Down") > -1){
				$("#circle_arrow").addClass("bo_col_red");
				if(trend == "SingleDown"){
					$("#circle_arrow").addClass("bot1");
				}else if(trend == "DoubleDown"){
					$("#circle_arrow").addClass("bot2");
				}else if(trend == "FortyFiveDown"){
					$("#circle_arrow").addClass("bot_right");
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
			, "height"		: 303
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
//			minVal = 0;
//		}else{
//			minVal -= 10;
//		}
		
		
			var data = {"stdMap":{"HIGH_VAL":155,"LOW_VAL":110,"EMER_VAL":55},"timelineList":[{"DE":"20200513","VALUE1":"메트포르민염(0.5g)","CGM_DATA":"97.61|070038,94.69|070538,85.44|071029,83.86|071529,77.94|072029,80.28|073029,80.52|073529,82.3|074031,85.37|074530,89.91|075030,96.05|075529,95.71|080029,114.68|080529,134.34|081029,153.86|081528,169.04|082027,175.96|082529,180.47|083028,187.71|083528,196.98|084028,194.9|084528,191.5|085028,185.18|085528,177.46|090028,172.28|090529,165.61|091029,159.04|091529,152.27|092028,149.03|092528,143.21|093028,141.41|093528,140.43|094028,142.5|094529,144.01|095028,143.61|095528","TM":"080000","TYPE":"DT"},{"DE":"20200513","VALUE1":"메트포르민염(0.5g)","CGM_DATA":"94.69|070538,85.44|071029,83.86|071529,77.94|072029,80.28|073029,80.52|073529,82.3|074031,85.37|074530,89.91|075030,96.05|075529,95.71|080029,114.68|080529,134.34|081029,153.86|081528,169.04|082027,175.96|082529,180.47|083028,187.71|083528,196.98|084028,194.9|084528,191.5|085028,185.18|085528,177.46|090028,172.28|090529,165.61|091029,159.04|091529,152.27|092028,149.03|092528,143.21|093028,141.41|093528,140.43|094028,142.5|094529,144.01|095028,143.61|095528,141.7|100028","TM":"080100","TYPE":"DT"},{"DE":"20200513","KEY1":"2","VALUE1":"설렁탕","CGM_DATA":"81.6|111028,79.18|111532,82.56|112028,121.89|112529,154.72|120530,149.57|121027,143.86|121525,137.83|122026,136.21|122526,142.62|123028,141.01|123529,154.28|124029,165.18|124530,178.49|125028,188.91|125529,197.23|130028,197.06|130529,203.31|131029,210.04|131529,219.43|132029,223.21|132529,226.8|133029,228.21|133529,225.4|134028,226.72|134529,216.64|135029,215.97|135529,211.66|140029,208.25|140529","TM":"121000","TYPE":"MM"},{"DE":"20200513","KEY1":"3","VALUE1":"아이스라떼","CGM_DATA":"154.72|120530,149.57|121027,143.86|121525,137.83|122026,136.21|122526,142.62|123028,141.01|123529,154.28|124029,165.18|124530,178.49|125028,188.91|125529,197.23|130028,197.06|130529,203.31|131029,210.04|131529,219.43|132029,223.21|132529,226.8|133029,228.21|133529,225.4|134028,226.72|134529,216.64|135029,215.97|135529,211.66|140029,208.25|140529,205.15|141029,200.82|141529,197.91|142029,194.91|142530,190.81|143029,184.51|143528","TM":"124000","TYPE":"MM"},{"DE":"20200513","KEY1":"762826","VALUE1":"80","CGM_DATA":"208.25|140529,205.15|141029,200.82|141529,197.91|142029,194.91|142530,190.81|143029,184.51|143528,180.43|144029,178.46|144528,171.46|145028,165.06|145529,161.43|150029,164.4|150529,160.61|151028,156.16|151529,152.22|152028,149.91|152529,148.8|153029,149.06|153529,151.78|154034,149.08|154528,150.14|155028,152.51|155529,154.74|160029,160.2|160529,164.65|161029,170.92|161529,178.88|162028,185.8|162528,190.16|163028,186.38|163530,186.52|164028,188.96|164529,197.11|165028,201.7|165528,205.46|170028","TM":"150100","VALUE2":"120","TYPE":"BP"},{"DE":"20200513","KEY1":"1","VALUE1":"딸기요거트","CGM_DATA":"161.43|150029,164.4|150529,160.61|151028,156.16|151529,152.22|152028,149.91|152529,148.8|153029,149.06|153529,151.78|154034,149.08|154528,150.14|155028,152.51|155529,154.74|160029,160.2|160529,164.65|161029,170.92|161529,178.88|162028,185.8|162528,190.16|163028,186.38|163530,186.52|164028,188.96|164529,197.11|165028,201.7|165528,205.46|170028,209.31|170529,215.4|171028,222.86|171529,231.78|172029,237.62|172529,243.46|173028,247.13|173528,247.66|174027,243.88|174528,230.38|175034,218.03|175528","TM":"160000","TYPE":"MM"},{"DE":"20200513","KEY1":"4","VALUE1":"콩나물국밥","CGM_DATA":"198.04|181029,190.75|181527,183.34|182027,176.33|182528,168.9|183026,162.18|183528,155.21|184029,147.4|184529,138.39|185028,133.2|185529,129.7|190028,126.17|190528,122.81|191029,120.13|191527,114.38|192526,116.6|193027,128.63|193526,141.13|194027,163.24|194529,186.43|195029,204.11|195528,225.36|200028,242.95|200528,259.29|201028,271.69|201528,273.36|202028,269.68|202528,260.65|203028,257.24|203529,254.42|204029,244.33|204530,236.73|205028,232.8|205529,227.57|210028,222.68|210528","TM":"191000","TYPE":"MM"}]}
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
			
			cmmnAjax("appGlu/ms/selectMainDashTimeline.do", {SESS_USER_ID:userId, DE:curDe, BASE_TM:tm, BGN_TM:bgnTm, END_TM:endTm, BGN_TM2:bgnTm2, END_TM2:endTm2}, function (data){
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
							var trend = isNullToString(timelineList[i].VALUE2);
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
							sb.append('<a href="#" rel="external" class="cont_wrap activity">');
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
							sb.append('<li class="ui-btn-icon-right contview ' + curEventCls + '">');
							sb.append('<a href="../tl/sugarDetail.html?measrSn=' + timelineList[i].KEY1 + '" rel="external" class="cont_wrap activity">');
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
							var symptmsCd = "";
							var symptmcNm = "";
							if(isNullToString(timelineList[i].VALUE1) != ""){
								symptmsCd = timelineList[i].VALUE1.split(",");
								for(var symptmsIdx in symptmsCd){
									if(symptmcNm.length > 0)	symptmcNm += " | ";
									symptmcNm += symptmsCdNm[Number(symptmsCd[symptmsIdx])];
								}
							}
							
							sb.append('<li class="ui-btn-icon-right contview ' + curEventCls + '">');
							sb.append('<a href="../tl/symptmsDetail.html?symptmsDe=' + timelineList[i].DE + '&symptmsSn=' + timelineList[i].KEY1 + '" rel="external" class="cont_wrap activity">');
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
							var imgUrl = ABSOLUTE_URL + 'common/attchFileDownload.do?attchFileSn='+timelineList[i].VALUE2+'&attchFileDtlsSn=2';
							var aLink = "../tl/mealDetail.html?mealDe="+timelineList[i].DE
								+ "&mealClf="+timelineList[i].KEY1
								+ "&mealClfSn="+timelineList[i].KEY2;
							
							sb.append('<li class="ui-btn-icon-right contview ' + curEventCls + '">');
							sb.append('<a href="' + aLink + '" rel="external" class="cont_wrap activity">');
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
							var aLink = "../tl/drugTakngDetail.html?drugTakngDe="+timelineList[i].DE
								+ "&drugTakngTm="+timelineList[i].TM;
							
							sb.append('<li class="ui-btn-icon-right contview ' + curEventCls + '">');
							sb.append('<a href="' + aLink + '" rel="external" class="cont_wrap activity">');
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
							sb.append('<li class="ui-btn-icon-right contview ' + curEventCls + '">');
							sb.append('<a href="../tl/excsDetail.html?excsRecSn=' + timelineList[i].KEY1 + '" rel="external" class="cont_wrap activity">');
							sb.append('<div class="date_time">');
							sb.append('<p class="col_4a">' + curEventCls + '</p>');
							sb.append('<p>' + setDateFormat(timelineList[i].DE + timelineList[i].TM, "AP HH:MI") + '</p>');
							sb.append('</div>');
							sb.append('<div class="view">');
							sb.append('<span class="user_type bg_ext icon_ext"></span>');
							sb.append('</div>');
							sb.append('<div class="value">');
							sb.append('<p class="col_ext">운동</p>');
							sb.append('<p class="view_txt">' + timelineList[i].VALUE1 + ', ' + timelineList[i].VALUE2 + '분</p>');
							sb.append('</div>');
							sb.append('</a>');
							sb.append('</li>');
						}
						// 혈압
						else if(type == "BP"){
							sb.append('<li class="ui-btn-icon-right contview ' + curEventCls + '">');
							sb.append('<a href="../tl/bloodDetail.html?measrSn=' + timelineList[i].KEY1 + '" rel="external" class="cont_wrap activity">');
							sb.append('<div class="date_time">');
							sb.append('<p class="col_4a">' + curEventCls + '</p>');
							sb.append('<p>' + setDateFormat(timelineList[i].DE + timelineList[i].TM, "AP HH:MI") + '</p>');
							sb.append('</div>');
							sb.append('<div class="view">');
							sb.append('<span class="user_type bg_Blood icon_Blood"></span>');
							sb.append('</div>');
							sb.append('<div class="value">');
							sb.append('<p class="col_Blood">혈압</p>');
							sb.append('<p class="view_txt">' + timelineList[i].VALUE2 + '/' + timelineList[i].VALUE1 + ' <em>mmHg</em></p>');
							sb.append('</div>');
							sb.append('</a>');
							sb.append('</li>');
						}
						// 수면
						else if(type == "SL"){
							var aLink = "../tl/sleepDetail.html?sleepDe="+timelineList[i].DE
								+ "&sleepSn="+timelineList[i].KEY1;
							
							sb.append('<li class="ui-btn-icon-right contview ' + curEventCls + '">');
							sb.append('<a href="' + aLink + '" rel="external" class="cont_wrap activity">');
							sb.append('<div class="date_time">');
							sb.append('<p class="col_4a">' + curEventCls + '</p>');
							sb.append('<p>' + setDateFormat(timelineList[i].DE + timelineList[i].TM, "AP HH:MI") + '</p>');
							sb.append('</div>');
							sb.append('<div class="view">');
							sb.append('<span class="user_type bg_sleep icon_sleep"></span>');
							sb.append('</div>');
							sb.append('<div class="value">');
							sb.append('<p class="col_sleep">수면</p>');
							sb.append('<p class="view_txt">' + isNullToString(timelineList[i].VALUE1, "0") + '시간, 평가 : ' + timelineList[i].VALUE2 + '점</p>');
							sb.append('</div>');
							sb.append('</a>');
							sb.append('</li>');
						}
						// 메모
						else if(type == "MM"){
							var aLink = "../tl/memoDetail.html?freeMemoDe="+timelineList[i].DE
								+ "&freeMemoSn="+timelineList[i].KEY1;
							
							sb.append('<li class="ui-btn-icon-right contview ' + curEventCls + '">');
							sb.append('<a href="' + aLink + '" rel="external" class="cont_wrap activity">');
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
}

//$(document).on("click", "#wideDe", function(){
//	$("#wideDeInp").focus(function(){
//		alert($(this).attr("id"));
//		$(this).attr("type", "date");
//		$(this).click();
//	});
//});

$(document).on("change", "#wideDe", function(){
	location.href="./dashboardWide.html?fullscreenchange=On&de="+$(this).val().replace(/-/gi, "");
});

$(document).on('click','.cont_wrap.activity',function(){
	localStorage.setItem("returnPage", "dashBoardWide");
});