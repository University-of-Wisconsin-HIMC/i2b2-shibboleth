/**
 * @projectDescription	The ONT cell communicator object.
 * @inherits 	i2b2.ONT
 * @namespace	i2b2.ONT.ajax
 * @author		Nick Benik, Griffin Weber MD PhD
 * @version 	1.3
 * ----------------------------------------------------------------------------------------
 * updated 9-15-08: RC4 launch [Nick Benik] 
 */
console.group('Load & Execute component file: cells > ONT > ajax');
console.time('execute time');


// ================================================================================================== //
i2b2.ONT.ajax.GetChildConcepts = function (key, scoped_callback, options) {
	// this function is used to retreve the child concepts from the ONT cell server			
	console.group("CALLED i2b2.ONT.ajax.getChildConcepts()");
	console.info("[INPUT 1] key");
	console.debug(key);
	console.info("[INPUT 2] scoped_callback");
	console.dir(scoped_callback);
	console.info("[INPUT 3] options");
	console.dir(options);

	var callbackSuccess = function(transport) {
		console.group("[AJAX RESULT i2b2.ONT.ajax.getChildConcepts]");
		console.info("AJAX Transport SUCCESS");
		console.dir(transport);
		// these are closure variables
		var origMsgSent = sMessage;
		var origCallback = scoped_callback;
		var origUrl = sUrl;
		var origStartTime = dRequest;
		// create our data message to send to the callback function
		var cbMsg = {
			msgRequest: origMsgSent,
			msgResponse: transport.responseText,
			timeStart: dRequest,
			timeEnd: new Date(),
			msgUrl: origUrl,
			error: false
		};
		// check the status from the message
		var xmlRecv = transport.responseXML;
		if (!xmlRecv) {
			cbMsg.error = true;
			cbMsg.errorStatus = transport.status;
			cbMsg.errorMsg = "The ONT cell's message could not be interpreted as valid XML.";
			console.error(transport.responseText);
		} else {
			cbMsg.refXML = xmlRecv;
			var result_status = xmlRecv.getElementsByTagName('result_status')[0];
			var s = xmlRecv.getElementsByTagName('status')[0];
			if (s.getAttribute('type') != 'DONE') {
				cbMsg.error = true;
				cbMsg.errorStatus = transport.status;
				cbMsg.errorMsg = "The ONT cell's status message could not understood.";
				console.error(transport.responseText);
			}
		}
		// send the result message to the callback function
		console.info("i2b2CellMsg sent to callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("ONT", "GetChildConcepts", cbMsg, options.reqOrigin);
		i2b2.ONT.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	var callbackFailure = function(transport) {
		console.group("[AJAX RESULT i2b2.ONT.ajax.getChildConcepts]");
		console.error("AJAX Transport FAILURE");
		console.dir(transport);
		// these are closure variables
		var origMsgSent = sMessage;
		var origCallback = scoped_callback;	
		var origUrl = sUrl;
		var origStartTime = dRequest;
		// create our data message to send to the callback fuction
		var cbMsg = {
			msgRequest: origMsgSent,
			msgResponse: transport.responseText,
			msgUrl: origUrl,
			timeStart: dRequest,
			timeEnd: new Date(),
			error: true,
			errorStatus: transport.status,
			errorMsg: transport.statusText
		};
		console.info("i2b2CellMsg to sent callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("ONT", "GetChildConcepts", cbMsg, options.reqOrigin);
		i2b2.ONT.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	// make sure options are set
	if (undefined==options) { var options = {}; }
	if (!options.reqOrigin) { options.reqOrigin = '[unknown]'; }
	if (!options.max) { options.max = 200; }
	if (!options.synonyms) { options.synonyms = false; }
	if (!options.hiddens) { options.hiddens = false; }
	if (!options.max_time) { options.max_time = 180; }
	// drop the max attrib if we are overriding
	var maxRecords = '';
	if (!options.maxOverride) {
		maxRecords = 'max="'+options.max+'"';
	} else {
		delete options.maxOverride;
	}
	
	// collect message values
	var sMsgValues = {};
	sMsgValues.concept_key_value = key;
	sMsgValues.ont_max_records = maxRecords;
	sMsgValues.ont_synonym_records = options.synonyms;
	sMsgValues.ont_hidden_records = options.hiddens;
	sMsgValues.result_wait_time = options.max_time;
	sMsgValues.proxy_info = ''
	var sUrl = i2b2.h.getProxy();
	if (sUrl) {
		sMsgValues.proxy_info = '<proxy>\n            <redirect_url>'+i2b2.ONT.cfg.cellURL+'getChildren</redirect_url>\n        </proxy>\n';
	} else {
		sUrl = i2b2.ONT.cfg.cellURL+'getChildren';
	}
	// PM + security info
	sMsgValues.sec_user = i2b2.h.getUser(); 
	sMsgValues.sec_pass = i2b2.h.getPass();
	sMsgValues.sec_domain = i2b2.h.getDomain();
	sMsgValues.sec_project = i2b2.h.getProject();
	sMsgValues.header_msg_id = i2b2.h.GenerateAlphaNumId(20);

	// apply message values to message template
	i2b2.h.EscapeTemplateVars(sMsgValues, ["proxy_info"]);
	var syntax = /(^|.|\r|\n)(\{{{\s*(\w+)\s*}}})/; //matches symbols like '{{{ field }}}'
	var t = new Template(i2b2.ONT.cfg.msgs.GetChildConcepts, syntax);
	var sMessage = t.evaluate(sMsgValues);	
	var dRequest = new Date();
	console.groupEnd();
	new Ajax.Request(sUrl, {
		contentType: 'text/xml',
		method: 'post',
		postBody: sMessage,
		onSuccess: callbackSuccess,
		onFailure: callbackFailure
	});
	return true;
}

// ================================================================================================== //
i2b2.ONT.ajax.GetCategories = function(scoped_callback, options) {
	console.group('CALLED i2b2.ONT.ajax.GetCategories()');
	console.info("[INPUT 1] scoped_callback");
	console.dir(scoped_callback);
	
	var callbackSuccess = function(transport) {
		console.group("[AJAX RESULT i2b2.ONT.ajax.GetCategories]");
		console.info("AJAX Transport SUCCESS");
		// these are closure variables
		var origMsgSent = sMessage;
		var origCallback = scoped_callback;	
		var origUrl = sUrl;
		// create our data message to send to the callback function
		var cbMsg = {
			msgRequest: origMsgSent,
			msgResponse: transport.responseText,
			msgUrl: origUrl,
			error: false
		};
		// check the status from the message
		var xmlRecv = transport.responseXML;
		if (!xmlRecv) {
			cbMsg.error = true;
			cbMsg.errorStatus = transport.status;
			cbMsg.errorMsg = "The ONT cell's message could not be interpreted as valid XML.";
			console.error(transport.responseText);
		} else {
			cbMsg.refXML = xmlRecv;
			var result_status = xmlRecv.getElementsByTagName('result_status')[0];
			var s = xmlRecv.getElementsByTagName('status')[0];
			if (s.getAttribute('type') != 'DONE') {
				cbMsg.error = true;
				cbMsg.errorStatus = transport.status;
				cbMsg.errorMsg = "The ONT cell's status message could not understood.";
				console.error(transport.responseText);
			}
		}
		// send the result message to the callback function
		console.info("i2b2CellMsg sent to callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("ONT", "GetCategories", cbMsg, options.reqOrigin);
		i2b2.ONT.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	var callbackFailure = function(transport) {
		console.group("[AJAX RESULT i2b2.ONT.ajax.GetCategories]");
		console.error("AJAX Transport FAILURE");
		// these are closure variables
		var origMsgSent = sMessage;
		var origCallback = scoped_callback;	
		var origUrl = sUrl;
		// create our data message to send to the callback fuction
		var cbMsg = {
			msgRequest: origMsgSent,
			msgResponse: transport.responseText,
			msgUrl: origUrl,
			error: true,
			errorStatus: transport.status,
			errorMsg: transport.statusText
		};
		console.info("i2b2CellMsg to sent callback");
//		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("ONT", "GetCategories", cbMsg, options.reqOrigin);
		i2b2.ONT.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};

	// make sure options are set
	if (undefined==options) { var options = {}; }
	if (!options.reqOrigin) { options.reqOrigin = '[unknown]'; }
	if (!options.max_time) { options.max_time = 180; }
	
	// collect message values
	var sMsgValues = {};
	sMsgValues.result_wait_time = options.max_time;
	sMsgValues.proxy_info = ''
	var sUrl = i2b2.h.getProxy();
	if (sUrl) {
		sMsgValues.proxy_info = '<proxy>\n            <redirect_url>'+i2b2.ONT.cfg.cellURL+'getCategories</redirect_url>\n        </proxy>\n';
	} else {
		sUrl = i2b2.ONT.cfg.cellURL+'getCategories';
	}
	// PM + security info
	sMsgValues.sec_user = i2b2.h.getUser(); 
	sMsgValues.sec_pass = i2b2.h.getPass();
	sMsgValues.sec_domain = i2b2.h.getDomain();
	sMsgValues.sec_project = i2b2.h.getProject();
	sMsgValues.header_msg_id = i2b2.h.GenerateAlphaNumId(20);
	
	// apply message values to message template
	i2b2.h.EscapeTemplateVars(sMsgValues, ["proxy_info"]);
	var syntax = /(^|.|\r|\n)(\{{{\s*(\w+)\s*}}})/; //matches symbols like '{{{ field }}}'
	var t = new Template(i2b2.ONT.cfg.msgs.GetCategories, syntax);
	var sMessage = t.evaluate(sMsgValues);	
	console.groupEnd();
	new Ajax.Request(sUrl, {
		contentType: 'text/xml',
		method: 'post',
		postBody: sMessage,
		onSuccess: callbackSuccess,
		onFailure: callbackFailure
	});
	return true;
}

// ================================================================================================== //
i2b2.ONT.ajax.GetSchemes = function(scoped_callback, options) {
	console.group('CALLED i2b2.ONT.ajax.GetSchemes()');
	console.info("[INPUT 1] scoped_callback");
	console.dir(scoped_callback);
	
	var callbackSuccess = function(transport) {
		console.group("[AJAX RESULT i2b2.ONT.ajax.GetSchemes]");
		console.info("AJAX Transport SUCCESS");
		console.dir(transport);
		// these are closure variables
		var origMsgSent = sMessage;
		var origCallback = scoped_callback;	
		var origUrl = sUrl;
		// create our data message to send to the callback function
		var cbMsg = {
			msgRequest: origMsgSent,
			msgResponse: transport.responseText,
			msgUrl: origUrl,
			error: false
		};
		// check the status from the message
		var xmlRecv = transport.responseXML;
		if (!xmlRecv) {
			cbMsg.error = true;
			cbMsg.errorStatus = transport.status;
			cbMsg.errorMsg = "The ONT cell's message could not be interpreted as valid XML.";
			console.error(transport.responseText);
		} else {
			cbMsg.refXML = xmlRecv;
			var result_status = xmlRecv.getElementsByTagName('result_status')[0];
			var s = xmlRecv.getElementsByTagName('status')[0];
			if (s.getAttribute('type') != 'DONE') {
				cbMsg.error = true;
				cbMsg.errorStatus = transport.status;
				cbMsg.errorMsg = "The ONT cell's status message could not understood.";
				console.error(transport.responseText);
			}
		}
		// send the result message to the callback function
		console.info("i2b2CellMsg sent to callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("ONT", "GetSchemes", cbMsg, options.reqOrigin);
		i2b2.ONT.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	var callbackFailure = function(transport) {
		console.group("[AJAX RESULT i2b2.ONT.ajax.GetSchemes]");
		console.error("AJAX Transport FAILURE");
		console.dir(transport);
		// these are closure variables
		var origMsgSent = sMessage;
		var origCallback = scoped_callback;	
		var origUrl = sUrl;
		// create our data message to send to the callback fuction
		var cbMsg = {
			msgRequest: origMsgSent,
			msgResponse: transport.responseText,
			msgUrl: origUrl,
			error: true,
			errorStatus: transport.status,
			errorMsg: transport.statusText
		};
		console.info("i2b2CellMsg sent to callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("ONT", "GetSchemes", cbMsg, options.reqOrigin);
		i2b2.ONT.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};

	// make sure options are set
	if (undefined==options) { var options = {}; }
	if (!options.reqOrigin) { options.reqOrigin = '[unknown]'; }
	if (!options.max_time) { options.max_time = 180; }
	
	// collect message values
	var sMsgValues = {};
	sMsgValues.result_wait_time = options.max_time;
	sMsgValues.proxy_info = ''
	var sUrl = i2b2.h.getProxy();
	if (sUrl) {
		sMsgValues.proxy_info = '<proxy>\n            <redirect_url>'+i2b2.ONT.cfg.cellURL+'getSchemes</redirect_url>\n        </proxy>\n';
	} else {
		sUrl = i2b2.ONT.cfg.cellURL+'getSchemes';
	}
	// PM + security info
	sMsgValues.sec_user = i2b2.h.getUser(); 
	sMsgValues.sec_pass = i2b2.h.getPass();
	sMsgValues.sec_domain = i2b2.h.getDomain();
	sMsgValues.sec_project = i2b2.h.getProject();
	sMsgValues.header_msg_id = i2b2.h.GenerateAlphaNumId(20);
	
	// apply message values to message template
	i2b2.h.EscapeTemplateVars(sMsgValues, ["proxy_info"]);
	var syntax = /(^|.|\r|\n)(\{{{\s*(\w+)\s*}}})/; //matches symbols like '{{{ field }}}'
	var t = new Template(i2b2.ONT.cfg.msgs.GetSchemes, syntax);
	var sMessage = t.evaluate(sMsgValues);	
	console.groupEnd();
	new Ajax.Request(sUrl, {
		contentType: 'text/xml',
		method: 'post',
		postBody: sMessage,
		onSuccess: callbackSuccess,
		onFailure: callbackFailure
	});
	return true;
}

// ================================================================================================== //
i2b2.ONT.ajax.GetNameInfo = function(searchInfo, scoped_callback, options) {
	// this function is used to retreve the child concepts from the ONT cell server			
	console.group("CALLED i2b2.ONT.ajax.GetNameInfo()");
	console.info("[INPUT 1] key");
	console.dir(searchInfo);
	console.info("[INPUT 2] scoped_callback");
	console.dir(scoped_callback);
	console.info("[INPUT 3] options");
	console.dir(options);

	var callbackSuccess = function(transport) {
		console.group("[AJAX RESULT i2b2.ONT.ajax.GetNameInfo]");
		console.info("AJAX Transport SUCCESS");
		console.dir(transport);
		// these are closure variables
		var origMsgSent = sMessage;
		var origCallback = scoped_callback;
		var origUrl = sUrl;
		// create our data message to send to the callback function
		var cbMsg = {
			msgRequest: origMsgSent,
			msgResponse: transport.responseText,
			msgUrl: origUrl,
			error: false
		};
		// check the status from the message
		var xmlRecv = transport.responseXML;
		if (!xmlRecv) {
			cbMsg.error = true;
			cbMsg.errorStatus = transport.status;
			cbMsg.errorMsg = "The ONT cell's message could not be interpreted as valid XML.";
			console.error(transport.responseText);
		} else {
			cbMsg.refXML = xmlRecv;
			var result_status = xmlRecv.getElementsByTagName('result_status')[0];
			var s = xmlRecv.getElementsByTagName('status')[0];
			if (s.getAttribute('type') != 'DONE') {
				cbMsg.error = true;
				cbMsg.errorStatus = transport.status;
				cbMsg.errorMsg = "The ONT cell's status message could not understood.";
				console.error(transport.responseText);
			}
		}
		// send the result message to the callback function
		console.info("i2b2CellMsg sent to callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("ONT", "GetNameInfo", cbMsg, options.reqOrigin);
		i2b2.ONT.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	var callbackFailure = function(transport) {
		console.group("[AJAX RESULT i2b2.ONT.ajax.GetNameInfo]");
		console.error("AJAX Transport FAILURE");
		console.dir(transport);
		// these are closure variables
		var origMsgSent = sMessage;
		var origCallback = scoped_callback;	
		var origUrl = sUrl;
		// create our data message to send to the callback fuction
		var cbMsg = {
			msgRequest: origMsgSent,
			msgResponse: transport.responseText,
			msgUrl: origUrl,
			error: true,
			errorStatus: transport.status,
			errorMsg: transport.statusText
		};
		console.info("i2b2CellMsg to sent callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("ONT", "GetNameInfo", cbMsg, options.reqOrigin);
		i2b2.ONT.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	// make sure options are set
	if (undefined==options) { var options = {}; }
	if (!options.reqOrigin) { options.reqOrigin = '[unknown]'; }
	if (!options.max) { options.max = 200; }
	if (!options.synonyms) { options.synonyms = false; }
	if (!options.hiddens) { options.hiddens = false; }
	if (!options.max_time) { options.max_time = 180; }
	// drop the max attrib if we are overriding
	var maxRecords = '';
	if (!options.maxOverride) {
		maxRecords = 'max="'+options.max+'"';
	} else {
		delete options.maxOverride;
	}
	// collect message values
	var sMsgValues = {};
	sMsgValues.ont_max_records = maxRecords;
	sMsgValues.ont_search_strategy = searchInfo.Strategy;
	sMsgValues.ont_search_string = searchInfo.SearchStr;
	sMsgValues.ont_category = searchInfo.Category;
	sMsgValues.result_wait_time = options.max_time;
	sMsgValues.proxy_info = ''
	var sUrl = i2b2.h.getProxy();
	if (sUrl) {
		sMsgValues.proxy_info = '<proxy>\n <redirect_url>'+i2b2.ONT.cfg.cellURL+'getNameInfo</redirect_url>\n </proxy>\n';
	} else {
		sUrl = i2b2.ONT.cfg.cellURL+'getNameInfo';
	}
	// PM + security info
	sMsgValues.sec_user = i2b2.h.getUser(); 
	sMsgValues.sec_pass = i2b2.h.getPass();
	sMsgValues.sec_domain = i2b2.h.getDomain();
	sMsgValues.sec_project = i2b2.h.getProject();
	sMsgValues.header_msg_id = i2b2.h.GenerateAlphaNumId(20);

	// apply message values to message template
	i2b2.h.EscapeTemplateVars(sMsgValues, ["proxy_info"]);
	var syntax = /(^|.|\r|\n)(\{{{\s*(\w+)\s*}}})/; //matches symbols like '{{{ field }}}'
	var t = new Template(i2b2.ONT.cfg.msgs.GetNameInfo, syntax);
	var sMessage = t.evaluate(sMsgValues);	
	console.groupEnd();
	new Ajax.Request(sUrl, {
		contentType: 'text/xml',
		method: 'post',
		postBody: sMessage,
		onSuccess: callbackSuccess,
		onFailure: callbackFailure
	});
	return true;
}

// ================================================================================================== //
i2b2.ONT.ajax.GetCodeInfo = function(searchInfo, scoped_callback, options) {
	// this function is used to retreve the child concepts from the ONT cell server			
	console.group("CALLED i2b2.ONT.ajax.GetCodeInfo()");
	console.info("[INPUT 1] key");
	console.dir(searchInfo);
	console.info("[INPUT 2] scoped_callback");
	console.dir(scoped_callback);
	console.info("[INPUT 3] options");
	console.dir(options);

	var callbackSuccess = function(transport) {
		console.group("[AJAX RESULT i2b2.ONT.ajax.GetCodeInfo]");
		console.info("AJAX Transport SUCCESS");
		console.dir(transport);
		// these are closure variables
		var origMsgSent = sMessage;
		var origCallback = scoped_callback;
		var origUrl = sUrl;
		// create our data message to send to the callback function
		var cbMsg = {
			msgRequest: origMsgSent,
			msgResponse: transport.responseText,
			msgUrl: origUrl,
			error: false
		};
		// check the status from the message
		var xmlRecv = transport.responseXML;
		if (!xmlRecv) {
			cbMsg.error = true;
			cbMsg.errorStatus = transport.status;
			cbMsg.errorMsg = "The ONT cell's message could not be interpreted as valid XML.";
			console.error(transport.responseText);
		} else {
			cbMsg.refXML = xmlRecv;
			var result_status = xmlRecv.getElementsByTagName('result_status')[0];
			var s = xmlRecv.getElementsByTagName('status')[0];
			if (s.getAttribute('type') != 'DONE') {
				cbMsg.error = true;
				cbMsg.errorStatus = transport.status;
				cbMsg.errorMsg = "The ONT cell's status message could not understood.";
				console.error(transport.responseText);
			}
		}
		// send the result message to the callback function
		console.info("i2b2CellMsg sent to callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("ONT", "GetCodeInfo", cbMsg, options.reqOrigin);
		i2b2.ONT.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	var callbackFailure = function(transport) {
		console.group("[AJAX RESULT i2b2.ONT.ajax.GetCodeInfo]");
		console.error("AJAX Transport FAILURE");
		console.dir(transport);
		// these are closure variables
		var origMsgSent = sMessage;
		var origCallback = scoped_callback;	
		var origUrl = sUrl;
		// create our data message to send to the callback fuction
		var cbMsg = {
			msgRequest: origMsgSent,
			msgResponse: transport.responseText,
			msgUrl: origUrl,
			error: true,
			errorStatus: transport.status,
			errorMsg: transport.statusText
		};
		console.info("i2b2CellMsg to sent callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("ONT", "GetCodeInfo", cbMsg, options.reqOrigin);
		i2b2.ONT.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	// make sure options are set
	if (undefined==options) { var options = {}; }
	if (!options.reqOrigin) { options.reqOrigin = '[unknown]'; }
	if (!options.max) { options.max = 200; }
	if (!options.synonyms) { options.synonyms = false; }
	if (!options.hiddens) { options.hiddens = false; }
	if (!options.max_time) { options.max_time = 180; }
	// drop the max attrib if we are overriding
	var maxRecords = '';
	if (!options.maxOverride) {
		maxRecords = 'max="'+options.max+'"';
	} else {
		delete options.maxOverride;
	}
	// collect message values
	var sMsgValues = {};
	sMsgValues.ont_max_records = maxRecords;
	sMsgValues.ont_synonym_records = options.synonyms;
	sMsgValues.ont_hidden_records = options.hiddens;
	sMsgValues.ont_search_strategy = "exact";
	sMsgValues.ont_search_string = searchInfo.Coding+searchInfo.SearchStr;
	sMsgValues.result_wait_time = options.max_time;
	sMsgValues.proxy_info = ''
	var sUrl = i2b2.h.getProxy();
	if (sUrl) {
		sMsgValues.proxy_info = '<proxy>\n		    <redirect_url>'+i2b2.ONT.cfg.cellURL+'getCodeInfo</redirect_url>\n		</proxy>\n';
	} else {
		sUrl = i2b2.ONT.cfg.cellURL+'getCodeInfo';
	}
	// PM + security info
	sMsgValues.sec_user = i2b2.h.getUser(); 
	sMsgValues.sec_pass = i2b2.h.getPass();
	sMsgValues.sec_domain = i2b2.h.getDomain();
	sMsgValues.sec_project = i2b2.h.getProject();
	sMsgValues.header_msg_id = i2b2.h.GenerateAlphaNumId(20);
	
	// apply message values to message template
	i2b2.h.EscapeTemplateVars(sMsgValues, ["proxy_info"]);
	var syntax = /(^|.|\r|\n)(\{{{\s*(\w+)\s*}}})/; //matches symbols like '{{{ field }}}'
	var t = new Template(i2b2.ONT.cfg.msgs.GetCodeInfo, syntax);
	var sMessage = t.evaluate(sMsgValues);	
	console.groupEnd();
	new Ajax.Request(sUrl, {
		contentType: 'text/xml',
		method: 'post',
		postBody: sMessage,
		onSuccess: callbackSuccess,
		onFailure: callbackFailure
	});
	return true;
}


// ================================================================================================== //
// create custom event for debug sniffers
i2b2.ONT.ajax._SniffMsg = new YAHOO.util.CustomEvent('CellCommMessage');
i2b2.hive.MsgSniffer.RegisterMessageSource({
	channelName: "ONT",
	channelActions: [
		"GetChildConcepts", 
		"GetCategories",
		"GetSchemes",
		"GetNameInfo",
		"GetCodeInfo"
	],
	channelSniffEvent: i2b2.ONT.ajax._SniffMsg 
});


console.timeEnd('execute time');
console.groupEnd();