var bridge = window.AppInf;
var webkit = window.webkit;
var RESULTCODE = {
	'SUCC' : 1,
	'FAIL' : 2,
	'ERROR' : 3
};

function JAppInf() {
	var callbackFnArray = new Array();
	var callbackCnt = 0;

	this.isNative = function() {
		return window.AppInf != undefined;
	};

	this.onPageFinished = function(msg) {
		console.log('jappinf.onPageFinished');
		// $(':jqmData(role="footer")').remove();
		// $(':jqmData(role="page")').css('padding-bottom','59px');
		isAppMode = true;
	}

	this.setSessionUserInfo = function(_callbackFn, obj) {
		if (bridge == undefined) {
			return;
		}

		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;

		var str = null;
		if (typeof obj == 'object') {
			str = JSON.stringify(obj);
		} else if (typeof obj == 'string') {
			str = obj;
		} else {
			console.log("not available");
		}

		if (str != null) {
			if (bridge != undefined) {
				window.AppInf.setSessionUserInfo(callbackCnt, str);
			}
		}
	}

	this.getSessionUserInfo = function(_callbackFn) {
		if (bridge == undefined) {
			return;
		}
		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;

		if (bridge != undefined) {
			window.AppInf.getSessionUserInfo(callbackCnt);
		}
	}

	this.openActivity = function(str) {
		console.log("XXXX;");
		if (bridge == undefined) {
			return;
		}
		console.log('openActivity');

		window.AppInf.openActivity(str);
	}

	this.defaultCallbackFn = function(resultCode, resultData) {
		console.log('default CallbackFunction call');
	}

	this.callbackFn = function(index, resultCode, resultData) {
		console.log("callback rsCd :: " + resultCode);
		var callbackFunction = callbackFnArray[index];

		if (callbackFunction == undefined) {
			callbackFunction = this.defaultCallbackFn;
		}
		callbackFunction.apply(this, [ resultCode, resultData ]);
	}

	this.hideFooter = function(bool) {
		if (bridge == undefined) {
			return;
		}

		if (bridge != undefined) {
			window.AppInf.hideFooter(bool);
		}
	}

	this.logout = function(_callbackFn) {
		if (bridge == undefined) {
			return;
		}
		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;

		if (bridge != undefined) {
			window.AppInf.logout(callbackCnt);
		}
	}

	this.getAppPref = function(obj, _callbackFn) {
		if (bridge == undefined) {
			return;
		}

		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;

		var str = null;
		if (typeof obj == 'object') {
			str = JSON.stringify(obj);
		} else if (typeof obj == 'string') {
			str = obj;
		} else {
			console.log("not available");
		}

		if (bridge != undefined) {
			window.AppInf.getAppPref(str, callbackCnt);
		}
	}

	this.setAppPref = function(obj, _callbackFn) {
		if (bridge == undefined) {
			return;
		}

		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;

		var str = null;
		if (typeof obj == 'object') {
			str = JSON.stringify(obj);
		} else if (typeof obj == 'string') {
			str = obj;
		} else {
			console.log("not available");
		}

		if (bridge != undefined) {
			window.AppInf.setAppPref(str, callbackCnt);
		}

	}

	this.getNaverUserInfo = function(_callbackFn) {
		if (bridge == undefined) {
			return;
		}
		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;

		if (bridge != undefined) {
			window.AppInf.getNaverUserInfo(callbackCnt);
		}
	}

	this.getKakaoUserInfo = function(_callbackFn) {
		if (bridge == undefined) {
			return;
		}
		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;

		if (bridge != undefined) {
			window.AppInf.getKakaoUserInfo(callbackCnt);
		}
	}

	this.closeApp = function() {
		if (bridge == undefined) {
			return;
		}
		window.AppInf.closeApp();
	}

	this.moveToWebsite = function(url) {
		if (bridge == undefined) {
			return;
		}
		if (bridge != undefined) {
			window.AppInf.moveToWebsite(url);
		}
	}

	// ---- 2020-04-09 장수영 ----

	this.inputSerialNumber = function(obj, _callbackFn) {
		if (bridge == undefined) {
			return;
		}

		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;
		
		var str = null;
		if (typeof obj == 'object') {
			str = JSON.stringify(obj);
		} else if (typeof obj == 'string') {
			str = obj;
		} else {
			console.log("not available");
		}

		if (str != null) {
			if (bridge != undefined) {
				window.AppInf.inputSerialNumber(callbackCnt, str);
			}
		}
	};
	
	//G6 테스트
	this.realStartSensor = function(obj, _callbackFn) {
		if (bridge == undefined) {
			return;
		}

		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;
		
		var str = null;
		if (typeof obj == 'object') {
			str = JSON.stringify(obj);
		} else if (typeof obj == 'string') {
			str = obj;
		} else {
			console.log("not available");
		}

		if (str != null) {
			if (bridge != undefined) {
				window.AppInf.realStartSensor(callbackCnt, str);
			}
		}
	};

	this.startNfcMode = function(_callbackFn) {
		if (bridge == undefined) {
			return;
		}

		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;
		if (bridge != undefined) {
			window.AppInf.startNfcMode(callbackCnt);
		}

	};

	this.removeBond = function(broadcastId, _callbackFn) {
		if (bridge == undefined) {
			return;
		}

		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;
		if (bridge != undefined) {
			window.AppInf.removeBond(callbackCnt, broadcastId);
		}

	};

	this.stopScan = function(_callbackFn) {
		if (bridge == undefined) {
			return;
		}

		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;
		if (bridge != undefined) {
			window.AppInf.stopScan(callbackCnt);
		}

	};

	this.startSensor = function(_callbackFn) {
		if (bridge == undefined) {
			return;
		}

		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;
		if (bridge != undefined) {
			window.AppInf.startSensor(callbackCnt);
		}

	};

	this.stopSensor = function(_callbackFn) {
		if (bridge == undefined) {
			return;
		}

		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;
		if (bridge != undefined) {
			window.AppInf.stopSensor(callbackCnt);
		}

	};

	this.inputCorrect = function(value, _callbackFn) {
		if (bridge == undefined) {
			return;
		}

		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;
		if (bridge != undefined) {
			window.AppInf.inputCorrect(callbackCnt, value);
		}

	};

	this.inputCorrection = function(_callbackFn) {
		if (bridge == undefined) {
			return;
		}

		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;
		if (bridge != undefined) {
			window.AppInf.inputCorrection(callbackCnt);
		}

	};

	this.deviceWarningSet = function(jsonData, _callbackFn) {
		if (bridge == undefined) {
			return;
		}

		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;
		if (bridge != undefined) {
			window.AppInf.deviceWarningSet(callbackCnt, jsonData);
		}

	};

	this.resetAllCalibrations = function(_callbackFn) {
		if (bridge == undefined) {
			return;
		}

		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;
		if (bridge != undefined) {
			window.AppInf.resetAllCalibrations(callbackCnt);
		}

	};

	this.getPairedDeviceList = function(_callbackFn) {
		if (bridge == undefined) {
			return;
		}
		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;
		console.log('jappinf.getPairedDeviceList');
		if (bridge != undefined) {
			window.AppInf.getPairedDeviceList(callbackCnt);
		}
	};

	this.lowRingtonSet = function(_callbackFn) {
		if (bridge == undefined) {
			return;
		}
		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;
		console.log('jappinf.lowRingtonSet');
		if (bridge != undefined) {
			window.AppInf.lowRingtonSet(callbackCnt);
		}
	};

	this.highRingtonSet = function(_callbackFn) {
		if (bridge == undefined) {
			return;
		}
		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;
		console.log('jappinf.highRingtonSet');
		if (bridge != undefined) {
			window.AppInf.highRingtonSet(callbackCnt);
		}
	};

	this.coretonAlarm = function(_callbackFn) {
		if (bridge == undefined) {
			return;
		}
		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;
		console.log('jappinf.coretonAlarm');
		if (bridge != undefined) {
			window.AppInf.coretonAlarm(callbackCnt);
		}
	};

	this.getCgmData = function(data) {
		this.cgmDataCallbackFn.apply(this, [ data ]);
	}

	this.cgmDataCallbackFn = function(data) {
		console.log('Please setCgmDataCallbackFunction~~~');
	};

	this.setCgmDataCallbackFn = function(_callbackFn) {
		this.cgmDataCallbackFn = _callbackFn;
	};

	this.getFoodLens = function(obj, _callbackFn) {
		if (bridge == undefined && webkit == undefined) {
			return;
		}
		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;

		var str = null;
		if (typeof obj == 'object') {
			str = JSON.stringify(obj);
		} else if (typeof obj == 'string') {
			str = obj;
		} else {
			console.log("not available");
		}

		if (bridge != undefined) {
			window.AppInf.getFoodLens(callbackCnt, str);
		} else if (webkit != undefined) {
			obj.opName = "getFoodLens";
			obj.callbackId = callbackCnt;

			window.webkit.messageHandlers.AppInf.postMessage(obj);
		}
	}

	this.broadcastToJs = function(type, msg) {
		console.log('type=' + type + 'msg=' + msg);
		this.broadcastReceiver.apply(this, [ type, msg ]);
	};

	this.broadcastReceiver = function(type, msg) {
		var path = location.href;
		if (path.indexOf('philosys.html') < 0
				&& path.indexOf("/us/login.html") < 0) {
			if (msg != 'STAT_DISCONNECT') {
				location.href = '../hr/philosys.html';
			}
		}

	};

	this.setBroadcastReceiver = function(_callbackFn) {
		this.broadcastReceiver = _callbackFn;
	};

	this.shortToast = function(msg, _callbackFn) {
		if (bridge == undefined) {
			return;
		}
		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;
		console.log('jappinf.shortToast');
		if (bridge != undefined) {
			window.AppInf.shortToast(callbackCnt, msg);
		}
	};

	this.changeScreen = function(type, _callbackFn) {
		if (bridge == undefined) {
			return;
		}
		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;
		console.log('jappinf.changeScreen');
		if (bridge != undefined) {
			window.AppInf.changeScreen(callbackCnt, type);
		}
	};

	this.pairDevice = function(macaddress, _callbackFn) {
		if (bridge == undefined && webkit == undefined) {
			return;
		}
		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;

		console.log('jappinf.pairDevice');

		if (bridge != undefined) {
			window.AppInf.pairDevice(callbackCnt, macaddress, 3000);
		} else if (webkit != undefined) {
			var obj = {
				"opName" : "pairDevice",
				"macaddress" : macaddress,
				"callbackId" : callbackCnt
			}

			window.webkit.messageHandlers.AppInf.postMessage(obj);
		}
	};

	this.pedometerSyncData = function(_callbackFn, _period) {
		if (bridge == undefined && webkit == undefined) {
			return;
		}
		var period = _period || 30000;
		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;

		console.log('jappinf.pedometerSyncData');

		if (bridge != undefined) {
			window.AppInf.pedometerSyncData(callbackCnt, period);
		} else if (webkit != undefined) {
			var obj = {
				"opName" : "pedometerSyncData",
				"excerMode" : false,
				"callbackId" : callbackCnt
			}

			window.webkit.messageHandlers.AppInf.postMessage(obj);
		}
	};

	this.saveSelfMeasrDeviceInfo = function(_callbackFn) {
		if (bridge == undefined && webkit == undefined) {
			return;
		}
		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;

		if (bridge != undefined) {
			window.AppInf.saveSelfMeasrDeviceInfo(callbackCnt);
		} else if (webkit != undefined) {
			var obj = {
				"opName" : "saveSelfMeasrDeviceInfo",
				"callbackId" : callbackCnt
			}
			window.webkit.messageHandlers.AppInf.postMessage(obj);
		}
	}

	this.unbind = function(broadcastId, _callbackFn) {
		if (bridge == undefined && webkit == undefined) {
			return;
		}
		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;

		console.log('jappinf.unbind');

		if (bridge != undefined) {
			window.AppInf.unbind(callbackCnt, broadcastId);
		} else if (webkit != undefined) {
			var obj = {
				"opName" : "unbind",
				"broadcastId" : broadcastId,
				"callbackId" : callbackCnt
			}

			window.webkit.messageHandlers.AppInf.postMessage(obj);
		}
	}

	this.onReceiveData = function(type, data) {
		this.receiveDataCallbackFn.apply(this, [ type, data ]);
	};

	this.receiveDataCallbackFn = function(type, data) {
		console.log('Please setReceiveDataCallbackFunction~~~');
	};
	this.setReceiveDataCallbackFn = function(_callbackFn) {
		this.receiveDataCallbackFn = _callbackFn;
	};

	this.logout = function(_callbackFn) {
		if (bridge == undefined && webkit == undefined) {
			return;
		}
		callbackFnArray.push(_callbackFn);
		callbackCnt = callbackFnArray.length - 1;

		if (bridge != undefined) {
			window.AppInf.logout(callbackCnt);
		} else if (webkit != undefined) {
			var obj = {
				"opName" : "logout",
				"callbackId" : callbackCnt
			}

			window.webkit.messageHandlers.AppInf.postMessage(obj);
		}
	}
}

var jappinf = new JAppInf();

function warmUpTimer(data) {

	console.log("countTime Data ==  " + JSON.stringify(data));
	var countTime = data['countTime'];
	if (typeof (changeCount) == "function") {
		changeCount(countTime);
	}
	localStorage.setItem("countTime", countTime);
};

function cgmDataToDashboard() {
	selectCgmMainChart();
};

// ---- 2020-04-09 장수영 ----
