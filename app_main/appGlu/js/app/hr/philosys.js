
var userId;
var drugTakngDe;
var drugTakngTm;

var currPageId; 
var selectTabIndex = 0;
var currDate =new Date();   

$(document).on("pagebeforecreate",function(){ 
	var req = new Request();
	userId = getSessionInfo('USER_ID'); 
	
	if(jappinf!= undefined){
		jappinf.setBroadcastReceiver(function(type,msg){
			console.log('philosys==='+msg);
	        if(msg == 'STAT_WAIT_STRIP'){
	        	//location.href = '../ms/philosys.html#start01';
	        	$.mobile.changePage('#start01');
	        }else if(msg == 'STAT_WAIT_BLOOD'){
	        	//location.href = '../ms/philosys.html#start02';
	        	$.mobile.changePage('#start02');
	        }else if(msg == 'STAT_MEASURING'){
	        	$.mobile.changePage('#start02');
	        	$("#measure").popup("open");
	        	$(".cm_loader").show();
	        }else if(msg == 'STAT_MEASURE_RESULT'){
	        	//$.mobile.changePage('#start02');
	        	$(".cm_loader").hide();
	        	$(".measure_val").text(type);
	        	$(".measure_val_div").show();	
	        	
	        	jappinf.getAppPref("pageId", function(resultCd, result) {
	        		if (resultCd == RESULTCODE.SUCC) {
	        			var key = Object.keys(result);
	        			var getPref = result[key[0]];
	        		
	        			setTimeout(function(){
	        	        	
	    		        	var bool = jappinf.getPairedDeviceList(function(resultCd, result) {
	    		        		console.log('getPairedDeviceList>>resultCd[' + resultCd + ']result::'
	    		        				+ JSON.stringify(result));
	    		        			if(getPref == "03" || getPref == "04") {
	    		        				console.log("XXXX == ?? " + getPref + " TYPE -- " + type);
	    		        				location.href = '../mn/deviceReg02.html?glucose='+type+'&pageId='+getPref; 
	    		        			} else if (result != null && result.length>0) {
	    		        				//보정값 입력
	    		    	        		location.href = '../mn/dashboard.html?glucose='+type; 
	    			        		} else {
	    			        			//수동 입력
	    		    	        		//location.href = './register.html?tabIndex=0&glucose='+type;
	    		    	        		var param = {};
	    		    	        		param['MEASR_DE'] = currDate.format('yyyyMMdd');
	    		    	        		param['MEASR_TM'] = currDate.format('HHmmss');
	    		    	        		param['BLOOD_SUGAR'] = type;		
	    		    	        		param["SESS_USER_ID"]=userId;  
	    		    	        		param["AUTO_MANU_CLF"] = "A";
	    		    	        		cmmnAjax("appGlu/tl/insertBloodSugarManu.do", param, function (result){
	    		    	        			if(result.chkYn == 'Y'){
	    		    	        				alert('저장이 완료되었습니다.');		    	        				
	    		    	        			}else{
	    		    	        				alert('저장이 실패되었습니다.');
	    		    	        			}
	    		    	        			dashBoardInit();
	    		    	        	    });
	    		    	        		
	    			        		}	        				
	    	    	        	
	    		        	});
	    		        	/*if(bool == undefined){ 
	    		        		location.href = './register.html?tabIndex=0&glucose='+type; 
	    		        	}*/
	    	        	
	    	        	}, 500);
	        			
	        		} else {
	        			console.log("페이지 오류 입니다. 확인 바랍니다.");
	        		}
	        	});
	        	
	        }else if(msg == 'STAT_DISCONNECT'){
	        	jappinf.shortToast("Gmate 연결이 해제되었습니다.",function(){});
	        	dashBoardInit(); 

	        }else if(msg == 'STAT_WAIT_STRIP_E1'){
	        	$.mobile.changePage('#start01');
	        	jappinf.shortToast("사용한 스트립입니다.",function(){});
	        }else if(msg == 'STAT_WAIT_STRIP_E2'){
	        	$.mobile.changePage('#start01');
	        	jappinf.shortToast("검사지를 다시 넣어주세요.",function(){});
	        }else if(msg == 'STAT_MEASURING_E1'){
	        	jappinf.shortToast("오류입니다. 다시측정하세요.",function(){});
	        	$.mobile.changePage('#start01');
	        	$("#measure").popup("close"); 
	        }else if(msg == 'APP_STAT_PR_PULL_OUT_STRIP'){
	        	$.mobile.changePage('#start01');
	        	jappinf.shortToast("스트립이 뽑혔습니다.",function(){});
	        }else{
	        	jappinf.shortToast(msg,function(){});
	        	dashBoardInit();
	        }
	    });
	}
	
	
	$(":jqmData(role='navbar')").navbar();
    $(":jqmData(role='popup')").popup(); 
    $(':jqmData(role="panel")').panel();  
	
});

$(document).on("pagebeforeshow",function(){
	console.log('2. pagebeforeshow==');
	
	//$.mobile.changePage('#start02');

});
$(document).on("pageshow",function(){
	console.log('3. pageshow==222');     
	var currPageId = $.mobile.activePage.attr('id');

/*
	console.log('currPageId='+currPageId ); 
	if(currPageId == 'start02'){
		$(".cm_loader").hide();
    	$(".measure_val").text('11111');   
    	$(".measure_val_div").show();   	    
	}*/
	  
});
$(document).on("ready",function(){  
	console.log('4. ready==');

      
}); 

