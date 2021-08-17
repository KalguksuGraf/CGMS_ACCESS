function DeviceUtil(){
	this.currentPage;
	this.scanType;
	this.pageDepth = 0;
	this.joinYn = false;
	this.parentPage = 'main';
	this.stopSearchResult = false;
	var sessUserId = sessionStorage.getItem("USER_ID");

	this.getActivePageId = function(){
		var id = $.mobile.activePage.attr('id');
		return id;
	}
	
	this.pairSelfMeasr = function(){
		var selfInfo = {};
		selfInfo.EQUIP_CLF = "10";
		selfInfo.DEVICE_NM = "SELFMEASR";
		selfInfo.DEVICE_ID = "SELFMEASR";
		selfInfo.DEVICE_TYPE = "1";
		selfInfo.EQUIP_CD = "T001";
		selfInfo.BROADCAST_ID = "SELFMEASR"
		selfInfo.MACADDRESS = "SELFMEASR"
		deviceutil.pairDevice(selfInfo);
	}
	
	
	this.pairDevice = function(device, _callbackFn){
		//
		jappinf.setReceiveDataCallbackFn(function(status,result){
			console.log("deviceutil XXX onReceiveData====!!!"+JSON.stringify(status)+"  pageId="+deviceutil.getActivePageId());
			console.log("#@#$ ,m " + status.status);
			console.log("deviceutil XXX " + JSON.stringify(device));
			
			if(status.status == "GOOGLEFIT_OK"){
				jappinf.saveSelfMeasrDeviceInfo(function(resultCd,result){
					if(resultCd==RESULTCODE.SUCC){
						cmmnAjax("../../appGlu/ms/updateSelfmeasrCnfm.do", { SESS_USER_ID: sessUserId, SET_VAL: '1' }, function (data){
							console.log("자체활동량 확인 코드 변경 1");
						}, { "bAsync" : false });
						alert("걸음수 측정이 설정되었습니다");
						location.href='../bx/myBoxMain.html';
//						cmmnAjax("../../appGlu/st/updateMainItemSet.do", { EQUIP_CLF : '10', ITEM_CLF : "1020", SELFMEASR_CLF : selfMeasrClf }, function(){
//							console.log("걸음수 측정이 설정되었습니다 B");
//							alert("걸음수 측정이 설정되었습니다");
//							deviceutil.showResultPage(device);
//						});
					}else{
						deviceutil.showErrorMsg('디바이스 연결이 원활하지 않습니다.\n 다시 시도해 주십시오.');
					}
				})
			}
		});
		//
		
		var callbackFn = _callbackFn || function(resultCd,result){
			if(resultCd==RESULTCODE.SUCC){
//				var sessOrgCd = '';
//				jappinf.getSessionUserInfo(function(resultCd,result){
//			    	sessOrgCd = result.ORG_CD;
//			    	cmmnAjax("../../app/cm/setSessionOrgCd.do", { "ORG_CD" : sessOrgCd }, function (data){});
//				});
				
				jappinf.getPairedDeviceList(function(resultCd2,result2){
					var pairDevice = null;
					var selfMeasrFlag = false;
					$.each(result2,function(i,item){
							if(item.MACADDRESS == device.MACADDRESS){
								pairDevice = item;

								if(item.MACADDRESS == "SELFMEASR"){
									selfMeasrFlag = true;
								}
							}
					});
					
					if(pairDevice!=null){
						if(selfMeasrFlag){
							jappinf.getAppPref("SELFMEASR_CLF_"+sessUserId, function(resultCd, result){
					    		if(resultCd==RESULTCODE.SUCC){
					    			var key = Object.keys(result);
					    			var getPref = result[key[0]];
					    			
					    			if(getPref*1 <= 0){
					    				cmmnAjax("../../appGlu/ms/updateSelfmeasrCnfm.do", { SESS_USER_ID: sessUserId, SET_VAL: '1' }, function (data){
											console.log("자체활동량 확인 코드 변경 2");
										}, { "bAsync" : false });
					    			}
					    			alert("걸음수 측정이 설정되었습니다");
									location.href='../bx/myBoxMain.html';
//					    			cmmnAjax("../../app/st/updateMainItemSet.do", { EQUIP_CLF : '10', ITEM_CLF : "1020", SELFMEASR_CLF : selfMeasrClf }, function(){
//					    				alert("걸음수 측정이 설정되었습니다");
//					    				console.log("걸음수 측정이 설정되었습니다Cc");
//					    				location.href='../bx/myBoxMain.html';
//					    			});
					    			
					    		}else{
									deviceutil.showErrorMsg('연결이 원활하지 않습니다.\n 다시 시도해 주십시오.');
					    		}
					    	});
						}else{
							if(pairDevice.EQUIP_CLF.indexOf("10") != -1 ){
								cmmnAjax("../../app/st/updateMainItemSet.do", { EQUIP_CLF : '10', ITEM_CLF : "1010", SELFMEASR_CLF : selfMeasrClf }, function(){
				    				deviceutil.showResultPage(pairDevice);
				    			}, { "bAsync" : false });
							}
							location.href='../bx/myBoxMain.html';
						}
					}else{
						deviceutil.showErrorMsg('디바이스 연결이 원활하지 않습니다.\n 다시 시도해 주십시오.');
					}
				});
			}else{
				listView.empty();
				listPage.find('.join_desc3').html('<span class="fnblue">'+device.DEVICE_NM+'</span> 연결 중 오류가 발생했습니다.\n 다시 시도하세요.');
			}
		};
		jappinf.pairDevice(device.MACADDRESS,callbackFn);
	}
	
	
	this.showErrorMsg = function(msg){
		if(this.currentPage == '#regdevice_scanlist'){
			this.currentPage.find(':jqmData(role="listview")').empty();
			this.currentPage.find('.join_desc3').html(msg);
		}
	}
	
	//자체활동량 업데이트\
	this.selfMeasrUpd = function(){
		console.log("selfMeasrUpd called!!! ");
		jappinf.pedometerSyncData(function(resultCd,result){
			if(resultCd == RESULTCODE.SUCC){
				console.log("자체활동량이 업데이트 되었습니다");
			}else{
				console.log("자체활동량 업데이트에 실패했습니다");
			}
		});
	}
	
}


var deviceutil = new DeviceUtil();


