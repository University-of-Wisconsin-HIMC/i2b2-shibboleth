/**
 * @projectDescription	The CRC cell communicator object.
 * @namespace	i2b2.CRC.ajax
 * @inherits 	i2b2.CRC
 * @author		Nick Benik, Griffin Weber MD PhD
 * @version 	1.3
 * ----------------------------------------------------------------------------------------
 * updated 9-15-08: RC4 launch [Nick Benik] 
 */
console.group('Load & Execute component file: cells > ONT > ajax');
console.time('execute time');


// ================================================================================================== //
i2b2.CRC.ajax.getQueryMasterList_fromUserId = function(scoped_callback, options) {
	// this function is used to retreve the child concepts from the ONT cell server			
	console.group("CALLED i2b2.CRC.ajax.getQueryMasterList_fromUserId()");
	console.info("[INPUT 1] scoped_callback");
	console.dir(scoped_callback);
	console.info("[INPUT 2] options");
	console.dir(options);

	var callbackSuccess = function(transport) {
		console.group("[AJAX RESULT i2b2.CRC.ajax.getQueryMasterList_fromUserId]");
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
			cbMsg.errorMsg = "The CRC cell's message could not be interpreted as valid XML.";
			console.error(transport.responseText);
		} else {
			cbMsg.refXML = xmlRecv;
			var result_status = xmlRecv.getElementsByTagName('result_status')[0];
			var s = xmlRecv.getElementsByTagName('status')[0];
			if (s.getAttribute('type') != 'DONE') {
				cbMsg.error = true;
				cbMsg.errorStatus = transport.status;
				cbMsg.errorMsg = "The CRC cell's status message could not understood.";
				console.error(transport.responseText);
			}
		}
		// send the result message to the callback function
		console.info("i2b2CellMsg sent to callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("CRC", "getQueryMasterList_fromUserId", cbMsg, options.reqOrigin);
		i2b2.CRC.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	var callbackFailure = function(transport) {
		console.group("[AJAX RESULT i2b2.CRC.ajax.getQueryMasterList_fromUserId]");
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
			error: false,
			errorStatus: transport.status,
			errorMsg: transport.statusText
		};
		console.info("i2b2CellMsg to sent callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("CRC", "getQueryMasterList_fromUserId", cbMsg, options.reqOrigin);
		i2b2.CRC.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	// make sure options are set
	if (undefined==options) { options = {}; }
	if (!options.max) { options.max = 20; }
	if (!options.max_time) { options.max_time = 180; }
	if (!options.reqOrigin) { options.reqOrigin = '[unknown]'; }
	
	// collect message values
	var sMsgValues = {};
	sMsgValues.crc_max_records = options.max;
	sMsgValues.result_wait_time = options.max_time;
	sMsgValues.proxy_info = ''
	var sUrl = i2b2.h.getProxy();
	if (sUrl) {
		sMsgValues.proxy_info = '<proxy>\n            <redirect_url>'+i2b2.CRC.cfg.cellURL+'request</redirect_url>\n        </proxy>\n';
	} else {
		sUrl = i2b2.CRC.cfg.cellURL+'request';
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
	var t = new Template(i2b2.CRC.cfg.msgs.getQueryMasterList_fromUserId, syntax);
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
i2b2.CRC.ajax.getQueryInstanceList_fromQueryMasterId = function(key, scoped_callback, options) {
	// this function is used to retreve the child concepts from the ONT cell server			
	console.group("CALLED i2b2.CRC.ajax.getQueryInstanceList_fromQueryMasterId()");
	console.info("[INPUT 1] scoped_callback");
	console.dir(scoped_callback);
	console.info("[INPUT 2] options");
	console.dir(options);

	var callbackSuccess = function(transport) {
		console.group("[AJAX RESULT i2b2.CRC.ajax.getQueryInstanceList_fromQueryMasterId]");
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
			cbMsg.errorMsg = "The CRC cell's message could not be interpreted as valid XML.";
			console.error(transport.responseText);
		} else {
			cbMsg.refXML = xmlRecv;
			var result_status = xmlRecv.getElementsByTagName('result_status')[0];
			var s = xmlRecv.getElementsByTagName('status')[0];
			if (s.getAttribute('type') != 'DONE') {
				cbMsg.error = true;
				cbMsg.errorStatus = transport.status;
				cbMsg.errorMsg = "The CRC cell's status message could not understood.";
				console.error(transport.responseText);
			}
		}
		// send the result message to the callback function
		console.info("i2b2CellMsg sent to callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("CRC", "getQueryInstanceList_fromQueryMasterId", cbMsg, options.reqOrigin);
		i2b2.CRC.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	var callbackFailure = function(transport) {
		console.group("[AJAX RESULT i2b2.CRC.ajax.getQueryInstanceList_fromQueryMasterId]");
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
			error: false,
			errorStatus: transport.status,
			errorMsg: transport.statusText
		};
		console.info("i2b2CellMsg to sent callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("CRC", "getQueryInstanceList_fromQueryMasterId", cbMsg, options.reqOrigin);
		i2b2.CRC.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	
	// make sure options are set
	if (undefined==options) { options = {}; }
	if (!options.max_time) { options.max_time = 180; }
	if (!options.reqOrigin) { options.reqOrigin = '[unknown]'; }

	if (Object.isUndefined(key)) { 
		options = {};
		console.error('[ERROR i2b2.CRC.ajax.getQueryInstanceList_fromQueryMasterId] no QueryMasterID was passed!'); 
	}
	if (key=='') {
		console.error('[ERROR i2b2.CRC.ajax.getQueryInstanceList_fromQueryMasterId] no QueryMasterID was passed!'); 
	}	
	// collect message values
	var sMsgValues = {};
	sMsgValues.qm_key_value = key;
	sMsgValues.result_wait_time = options.max_time;
	sMsgValues.proxy_info = ''
	var sUrl = i2b2.h.getProxy();
	if (sUrl) {
		sMsgValues.proxy_info = '<proxy>\n            <redirect_url>'+i2b2.CRC.cfg.cellURL+'request</redirect_url>\n        </proxy>\n';
	} else {
		sUrl = i2b2.CRC.cfg.cellURL+'request';
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
	var t = new Template(i2b2.CRC.cfg.msgs.getQueryInstanceList_fromQueryMasterId, syntax);
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
i2b2.CRC.ajax.getQueryResultInstanceList_fromQueryInstanceId = function(key, scoped_callback, options) {
	// this function is used to retreve the child concepts from the ONT cell server			
	console.group("CALLED i2b2.CRC.ajax.getQueryResultInstanceList_fromQueryInstanceId()");
	console.info("[INPUT 1] scoped_callback");
	console.dir(scoped_callback);
	console.info("[INPUT 2] options");
	console.dir(options);

	var callbackSuccess = function(transport) {
		console.group("[AJAX RESULT i2b2.CRC.ajax.getQueryResultInstanceList_fromQueryInstanceId]");
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
			cbMsg.errorMsg = "The CRC cell's message could not be interpreted as valid XML.";
			console.error(transport.responseText);
		} else {
			cbMsg.refXML = xmlRecv;
			var result_status = xmlRecv.getElementsByTagName('result_status')[0];
			var s = xmlRecv.getElementsByTagName('status')[0];
			if (s.getAttribute('type') != 'DONE') {
				cbMsg.error = true;
				cbMsg.errorStatus = transport.status;
				cbMsg.errorMsg = "The CRC cell's status message could not understood.";
				console.error(transport.responseText);
			}
		}
		// send the result message to the callback function
		console.info("i2b2CellMsg sent to callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("CRC", "getQueryResultInstanceList_fromQueryInstanceId", cbMsg, options.reqOrigin);
		i2b2.CRC.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	var callbackFailure = function(transport) {
		console.group("[AJAX RESULT i2b2.CRC.ajax.getQueryResultInstanceList_fromQueryInstanceId]");
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
			error: false,
			errorStatus: transport.status,
			errorMsg: transport.statusText
		};
		console.info("i2b2CellMsg to sent callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("CRC", "getQueryResultInstanceList_fromQueryInstanceId", cbMsg, options.reqOrigin);
		i2b2.CRC.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};

	// make sure options are set
	if (undefined==options) { options = {}; }
	if (!options.max_time) { options.max_time = 180; }
	if (!options.reqOrigin) { options.reqOrigin = '[unknown]'; }
	if (Object.isUndefined(key)) { 
		options = {};
		console.error('[ERROR i2b2.CRC.ajax.getQueryResultInstanceList_fromQueryInstanceId] no QueryMasterID was passed!'); 
	}
	if (key=='') {
		console.error('[ERROR i2b2.CRC.ajax.getQueryResultInstanceList_fromQueryInstanceId] no QueryMasterID was passed!'); 
	}
	// collect message values
	var sMsgValues = {};
	sMsgValues.qi_key_value = key;
	sMsgValues.result_wait_time = options.max_time;
	sMsgValues.proxy_info = ''
	var sUrl = i2b2.h.getProxy();
	if (sUrl) {
		sMsgValues.proxy_info = '<proxy>\n            <redirect_url>'+i2b2.CRC.cfg.cellURL+'request</redirect_url>\n        </proxy>\n';
	} else {
		sUrl = i2b2.CRC.cfg.cellURL+'request';
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
	var t = new Template(i2b2.CRC.cfg.msgs.getQueryResultInstanceList_fromQueryInstanceId, syntax);
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
i2b2.CRC.ajax.getRequestXml_fromQueryMasterId = function(key, scoped_callback, options) {
	// this function is used to retreve the child concepts from the ONT cell server			
	console.group("CALLED i2b2.CRC.ajax.getRequestXml_fromQueryMasterId()");
	console.info("[INPUT 1] QueryMasterID");
	console.debug(key);
	console.info("[INPUT 2] scoped_callback");
	console.dir(scoped_callback);
	console.info("[INPUT 3] options");
	console.dir(options);

	var callbackSuccess = function(transport) {
		console.group("[AJAX RESULT i2b2.CRC.getRequestXml_fromQueryMasterId]");
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
			cbMsg.errorMsg = "The CRC cell's message could not be interpreted as valid XML.";
			console.error(transport.responseText);
		} else {
			cbMsg.refXML = xmlRecv;
			var result_status = xmlRecv.getElementsByTagName('result_status')[0];
			var s = xmlRecv.getElementsByTagName('status')[0];
			if (s.getAttribute('type') != 'DONE') {
				cbMsg.error = true;
				cbMsg.errorStatus = transport.status;
				cbMsg.errorMsg = "The CRC cell's status message could not understood.";
				console.error(transport.responseText);
			}
		}
		// send the result message to the callback function
		console.info("i2b2CellMsg sent to callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("CRC", "getRequestXml_fromQueryMasterId", cbMsg, options.reqOrigin);
		i2b2.CRC.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	var callbackFailure = function(transport) {
		console.group("[AJAX RESULT i2b2.CRC.ajax.getRequestXml_fromQueryMasterId]");
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
			error: false,
			errorStatus: transport.status,
			errorMsg: transport.statusText
		};
		console.info("i2b2CellMsg to sent callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("CRC", "getRequestXml_fromQueryMasterId", cbMsg, options.reqOrigin);
		i2b2.CRC.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	
	// make sure options are set
	if (undefined==options) { options = {}; }
	if (!options.max_time) { options.max_time = 180; }
	if (!options.reqOrigin) { options.reqOrigin = '[unknown]'; }
	if (Object.isUndefined(key)) { 
		options = {};
		console.error('[ERROR i2b2.CRC.ajax.getRequestXml_fromQueryMasterId] no QueryMasterID was passed!'); 
	}
	if (key=='') {
		console.error('[ERROR i2b2.CRC.ajax.getRequestXml_fromQueryMasterId] no QueryMasterID was passed!'); 
	}	
	// collect message values
	var sMsgValues = {};
	sMsgValues.qm_key_value = key;
	sMsgValues.result_wait_time = options.max_time;
	sMsgValues.proxy_info = ''
	var sUrl = i2b2.h.getProxy();
	if (sUrl) {
		sMsgValues.proxy_info = '<proxy>\n            <redirect_url>'+i2b2.CRC.cfg.cellURL+'request</redirect_url>\n        </proxy>\n';
	} else {
		sUrl = i2b2.CRC.cfg.cellURL+'request';
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
	var t = new Template(i2b2.CRC.cfg.msgs.getRequestXml_fromQueryMasterId, syntax);
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
i2b2.CRC.ajax.runQueryInstance_fromQueryDefinition = function(query_definition, scoped_callback, options) {
	// this function is used to retreve the child concepts from the ONT cell server			
	console.group("CALLED i2b2.CRC.ajax.runQueryInstance_fromQueryDefinition()");
	console.info("[INPUT 1] query_definition");
	console.debug(query_definition);
	console.info("[INPUT 2] scoped_callback");
	console.dir(scoped_callback);
	console.info("[INPUT 3] options");
	console.dir(options);

	var callbackSuccess = function(transport) {
		console.group("[AJAX RESULT i2b2.CRC.ajax.runQueryInstance_fromQueryDefinition]");
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
			cbMsg.errorMsg = "The CRC cell's message could not be interpreted as valid XML.";
			console.error(transport.responseText);
		} else {
			cbMsg.refXML = xmlRecv;
			var result_status = xmlRecv.getElementsByTagName('result_status')[0];
			var s = xmlRecv.getElementsByTagName('status')[0];
			if (s.getAttribute('type') != 'DONE') {
				cbMsg.error = true;
				cbMsg.errorStatus = transport.status;
				cbMsg.errorMsg = "The CRC cell's status message could not understood.";
				console.error(transport.responseText);
			}
		}
		// send the result message to the callback function
		console.info("i2b2CellMsg sent to callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("CRC", "runQueryInstance_fromQueryDefinition", cbMsg, options.reqOrigin);
		i2b2.CRC.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	var callbackFailure = function(transport) {
		console.group("[AJAX RESULT i2b2.CRC.ajax.runQueryInstance_fromQueryDefinition]");
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
			error: false,
			errorStatus: transport.status,
			errorMsg: transport.statusText
		};
		console.info("i2b2CellMsg to sent callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("CRC", "runQueryInstance_fromQueryDefinition", cbMsg, options.reqOrigin);
		i2b2.CRC.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	
	// make sure options are set
	if (Object.isUndefined(options)) { options = {}; }
	if (!options.queryTimeout) { options.queryTimeout='180'; }
	if (!options.reqOrigin) { options.reqOrigin = '[unknown]'; }
	if (Object.isUndefined(query_definition) || query_definition=='') {
		console.error('[ERROR i2b2.CRC.ajax.runQueryInstance_fromQueryDefinition] no Query Definition was passed!'); 
	}	
	// collect message values
	var sMsgValues = {};
	sMsgValues.psm_query_definition = query_definition;
	sMsgValues.result_wait_time = options.queryTimeout;
	sMsgValues.proxy_info = ''
	var sUrl = i2b2.h.getProxy();
	if (sUrl) {
		sMsgValues.proxy_info = '<proxy>\n            <redirect_url>'+i2b2.CRC.cfg.cellURL+'request</redirect_url>\n        </proxy>\n';
	} else {
		sUrl = i2b2.CRC.cfg.cellURL+'request';
	}
	// PM + security info
	sMsgValues.sec_user = i2b2.h.getUser(); 
	sMsgValues.sec_pass = i2b2.h.getPass();
	sMsgValues.sec_domain = i2b2.h.getDomain();
	sMsgValues.sec_project = i2b2.h.getProject();
	sMsgValues.header_msg_id = i2b2.h.GenerateAlphaNumId(20);

	// generate the result_output_list (for 1.3 backend)
	var result_output = "";
	var i=0;
	if (options.chk_PRS) {
		i++;
		result_output += '<result_output priority_index="'+i+'" name="patientset"/>';
	}
	if (options.chk_PRC) {
		i++;
		result_output += '<result_output priority_index="'+i+'" name="patient_count_xml"/>';
	}
	sMsgValues.psm_result_output = '<result_output_list>'+result_output+'</result_output_list>';

	// perform escaping of XML characters
	sMsgIgnore = ["proxy_info","psm_result_output","psm_query_definition"];
	i2b2.h.EscapeTemplateVars(sMsgValues, sMsgIgnore);	
	
	// apply message values to message template
	i2b2.h.EscapeTemplateVars(sMsgValues, ["proxy_info","psm_result_output","psm_query_definition"]);
	var syntax = /(^|.|\r|\n)(\{{{\s*(\w+)\s*}}})/; //matches symbols like '{{{ field }}}'
	var t = new Template(i2b2.CRC.cfg.msgs.runQueryInstance_fromQueryDefinition, syntax);
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
i2b2.CRC.ajax.deleteQueryMaster = function(key, scoped_callback, options) {
	// this function is used to retreve the child concepts from the ONT cell server			
	console.group("CALLED i2b2.CRC.ajax.deleteQueryMaster()");
	console.info("[INPUT 1] key");
	console.debug(key);
	console.info("[INPUT 2] scoped_callback");
	console.dir(scoped_callback);
	console.info("[INPUT 3] options");
	console.dir(options);

	var callbackSuccess = function(transport) {
		console.group("[AJAX RESULT i2b2.CRC.ajax.deleteQueryMaster]");
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
			cbMsg.errorMsg = "The CRC cell's message could not be interpreted as valid XML.";
			console.error(transport.responseText);
		} else {
			cbMsg.refXML = xmlRecv;
			var result_status = xmlRecv.getElementsByTagName('result_status')[0];
			var s = xmlRecv.getElementsByTagName('status')[0];
			if (s.getAttribute('type') != 'DONE') {
				cbMsg.error = true;
				cbMsg.errorStatus = transport.status;
				cbMsg.errorMsg = "The CRC cell's status message could not understood.";
				console.error(transport.responseText);
			}
		}
		// send the result message to the callback function
		console.info("i2b2CellMsg sent to callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("CRC", "deleteQueryMaster", cbMsg, options.reqOrigin);
		i2b2.CRC.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	var callbackFailure = function(transport) {
		console.group("[AJAX RESULT i2b2.CRC.ajax.deleteQueryMaster]");
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
			error: false,
			errorStatus: transport.status,
			errorMsg: transport.statusText
		};
		console.info("i2b2CellMsg to sent callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("CRC", "deleteQueryMaster", cbMsg, options.reqOrigin);
		i2b2.CRC.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	// make sure options are set
	if (Object.isUndefined(options)) { options = {}; }
	if (!options.max_time) { options.max_time = 180; }
	if (!options.reqOrigin) { options.reqOrigin = '[unknown]'; }
	if (Object.isUndefined(key)) {
		console.error('[ERROR i2b2.CRC.ajax.deleteQueryMaster] no QueryMaster ID was passed!'); 
		return false;
	}
	// collect message values
	var sMsgValues = {};
	sMsgValues.qm_key_value = key;
	sMsgValues.result_wait_time = options.max_time;
	sMsgValues.proxy_info = ''
	var sUrl = i2b2.h.getProxy();
	if (sUrl) {
		sMsgValues.proxy_info = '<proxy>\n            <redirect_url>'+i2b2.CRC.cfg.cellURL+'request</redirect_url>\n        </proxy>\n';
	} else {
		sUrl = i2b2.CRC.cfg.cellURL+'request';
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
	var t = new Template(i2b2.CRC.cfg.msgs.deleteQueryMaster, syntax);
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
i2b2.CRC.ajax.renameQueryMaster = function(key, newQueryName, scoped_callback, options) {
	// this function is used to retreve the child concepts from the ONT cell server			
	console.group("CALLED i2b2.CRC.ajax.renameQueryMaster()");
	console.info("[INPUT 1] key");
	console.debug(key);
	console.info("[INPUT 2] newQueryName");
	console.debug(newQueryName);
	console.info("[INPUT 3] scoped_callback");
	console.dir(scoped_callback);
	console.info("[INPUT 4] options");
	console.dir(options);

	var callbackSuccess = function(transport) {
		console.group("[AJAX RESULT i2b2.CRC.ajax.renameQueryMaster]");
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
			cbMsg.errorMsg = "The CRC cell's message could not be interpreted as valid XML.";
			console.error(transport.responseText);
		} else {
			cbMsg.refXML = xmlRecv;
			var result_status = xmlRecv.getElementsByTagName('result_status')[0];
			var s = xmlRecv.getElementsByTagName('status')[0];
			if (s.getAttribute('type') != 'DONE') {
				cbMsg.error = true;
				cbMsg.errorStatus = transport.status;
				cbMsg.errorMsg = "The CRC cell's status message could not understood.";
				console.error(transport.responseText);
			}
		}
		// send the result message to the callback function
		console.info("i2b2CellMsg sent to callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("CRC", "renameQueryMaster", cbMsg, options.reqOrigin);
		i2b2.CRC.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	var callbackFailure = function(transport) {
		console.group("[AJAX RESULT i2b2.CRC.ajax.renameQueryMaster]");
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
			error: false,
			errorStatus: transport.status,
			errorMsg: transport.statusText
		};
		console.info("i2b2CellMsg to sent callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("CRC", "renameQueryMaster", cbMsg, options.reqOrigin);
		i2b2.CRC.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	
	// make sure options are set
	if (Object.isUndefined(options)) { options = {}; }
	if (!options.max_time) { options.max_time = 180; }
	if (!options.reqOrigin) { options.reqOrigin = '[unknown]'; }
	if (Object.isUndefined(key)) {
		console.error('[ERROR i2b2.CRC.ajax.renameQueryMaster] no QueryMaster ID was passed!'); 
		console.groupEnd();
		return false;
	}
	// collect message values
	var sMsgValues = {};
	sMsgValues.qm_key_value = key;
	sMsgValues.qm_name = newQueryName;
	sMsgValues.result_wait_time = options.max_time;
	sMsgValues.proxy_info = ''
	var sUrl = i2b2.h.getProxy();
	if (sUrl) {
		sMsgValues.proxy_info = '<proxy>\n            <redirect_url>'+i2b2.CRC.cfg.cellURL+'request</redirect_url>\n        </proxy>\n';
	} else {
		sUrl = i2b2.CRC.cfg.cellURL+'request';
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
	var t = new Template(i2b2.CRC.cfg.msgs.renameQueryMaster, syntax);
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
i2b2.CRC.ajax.getPDO_fromInputList = function(input_str, scoped_callback, options) {
	// this function is used to retreve the PDO info from the CRC cell server
	console.group("CALLED i2b2.CRC.ajax.getPDO_fromInputList()");
	console.info("[INPUT 1] scoped_callback");
	console.dir(scoped_callback);
	console.info("[INPUT 2] options");
	console.dir(options);
	
	var callbackSuccess = function(transport) {
		console.group("[AJAX RESULT i2b2.CRC.ajax.getPDO_fromInputList]");
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
			cbMsg.errorMsg = "The CRC cell's message could not be interpreted as valid XML.";
			console.error(transport.responseText);
		} else {
			cbMsg.refXML = xmlRecv;
			var result_status = xmlRecv.getElementsByTagName('result_status')[0];
			var s = xmlRecv.getElementsByTagName('status')[0];
			if (s.getAttribute('type') != 'DONE') {
				cbMsg.error = true;
				cbMsg.errorStatus = transport.status;
				cbMsg.errorMsg = "The CRC cell's status message could not understood.";
				console.error(transport.responseText);
			}
		}
		// send the result message to the callback function
		console.info("i2b2CellMsg sent to callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("CRC", "getPDO_fromInputList", cbMsg, options.reqOrigin);
		i2b2.CRC.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	var callbackFailure = function(transport) {
		console.group("[AJAX RESULT i2b2.CRC.ajax.getPDO_fromInputList]");
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
			error: false,
			errorStatus: transport.status,
			errorMsg: transport.statusText
		};
		console.info("i2b2CellMsg to sent callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("CRC", "getPDO_fromInputList", cbMsg, options.reqOrigin);
		i2b2.CRC.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	// make sure options are set
	if (Object.isUndefined(options)) { options = {}; }
	if (!options.max_time) { options.max_time = 900; }
	if (!options.reqOrigin) { options.reqOrigin = '[unknown]'; }
	if (!options.max_results) { options.max_results = 0; }
	// collect message values
	var sMsgValues = {};
	sMsgValues.PDO_Request = input_str;
	sMsgValues.result_wait_time = options.max_time;
	sMsgValues.proxy_info = ''
	sMsgValues.patient_limit = options.max_results;
	var sUrl = i2b2.h.getProxy();
	if (sUrl) {
		sMsgValues.proxy_info = '<proxy>\n            <redirect_url>'+i2b2.CRC.cfg.cellURL+'pdorequest</redirect_url>\n       </proxy>\n';
	} else {
		sUrl = i2b2.CRC.cfg.cellURL+'pdorequest';
	}
	// PM + security info
	sMsgValues.sec_user = i2b2.h.getUser(); 
	sMsgValues.sec_pass = i2b2.h.getPass();
	sMsgValues.sec_domain = i2b2.h.getDomain();
	sMsgValues.sec_project = i2b2.h.getProject();	
	sMsgValues.header_msg_id = i2b2.h.GenerateAlphaNumId(20);

	// apply message values to message template
	i2b2.h.EscapeTemplateVars(sMsgValues, ["proxy_info","PDO_Request"]);
	var syntax = /(^|.|\r|\n)(\{{{\s*(\w+)\s*}}})/; //matches symbols like '{{{ field }}}'
	var t = new Template(i2b2.CRC.cfg.msgs.getPDO_fromInputList, syntax);
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
};
	
	
// ================================================================================================== //


/************************************* 
  XML calls to the ONT Cell's Server 
 *************************************/
if (Object.isUndefined(i2b2.CRC.ajax.ONT)) { i2b2.CRC.ajax.ONT = {}; }
// ================================================================================================== //
i2b2.CRC.ajax.ONT.getTermDetails = function (key, options) {
	// this function is used to retreve the child concepts from the ONT cell server			
	if (Object.isUndefined(options)) { options={}; }
	// make sure options are set
	var viewctlr = i2b2.ONT.view[i2b2.ONT.currentTab];
	if (!options.max) { options.max = 200; }
	if (!options.synonyms) { options.synonyms = false; }
	if (!options.hiddens) { options.hiddens = false; }
	if (!options.max_time) { options.max_time = 120; }
	if (!options.reqOrigin) { options.reqOrigin = '[unknown]'; }
	// drop the max attrib if we are overriding
	var maxRecords = '';
	if (!options.tempMaxOverride) {
		maxRecords = 'max="'+options.max+'"';
	} else {
		delete options.tempMaxOverride;
	}
	// collect message values
	var sMsgValues = {};
	sMsgValues.concept_key_value = key;
	sMsgValues.ont_synonym_records = options.synonyms;
	sMsgValues.ont_hidden_records = options.hiddens;
	sMsgValues.ont_max_records = maxRecords;
	sMsgValues.result_wait_time = options.max_time;
	sMsgValues.proxy_info = ''
	var sUrl = i2b2.h.getProxy();
	if (sUrl) {
		sMsgValues.proxy_info = '<proxy>\n            <redirect_url>'+i2b2.ONT.cfg.cellURL+'getTermInfo</redirect_url>\n        </proxy>\n';
	} else {
		sUrl = i2b2.ONT.cfg.cellURL+'getTermInfo';
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
	var t = new Template(i2b2.CRC.cfg.msgs.ONT_getTermDetails, syntax);
	var sMessage = t.evaluate(sMsgValues);
	// perform a SYNC query 
	var ajaxresult = new Ajax.Request(sUrl, {
		contentType: 'text/xml',
		method: 'post',
		postBody: sMessage,
		asynchronous: false
	});	
	var transport = ajaxresult.transport;
	// create our data message to return from the function
	var cbMsg = {
		msgRequest: sMessage,
		msgResponse: transport.responseText,
		msgUrl: sUrl,
		error: false
	};
	// check the status from the message
	var xmlRecv = transport.responseXML;
	if (!xmlRecv) {
		cbMsg.error = true;
		cbMsg.errorStatus = transport.status;
		cbMsg.errorMsg = "The CRC -> ONT cell's message could not be interpreted as valid XML.";
		console.error(transport.responseText);
	} else {
		cbMsg.refXML = xmlRecv;
		var result_status = xmlRecv.getElementsByTagName('result_status')[0];
		var s = xmlRecv.getElementsByTagName('status')[0];
		if (s.getAttribute('type') != 'DONE') {
			cbMsg.error = true;
			cbMsg.errorStatus = transport.status;
			cbMsg.errorMsg = "The CRC > ONT cell's status message could not understood.";
			console.error(transport.responseText);
		}
	}
	// broadcast a debug message to any sniffers/tools
	var sniffPackage = i2b2.h.BuildSniffPack("CRC", "getTermDetails", cbMsg, options.reqOrigin);
	i2b2.CRC.ajax._SniffMsg.fire(sniffPackage);
	// return results to caller
	return cbMsg;
};

// ================================================================================================== //
// create custom event for debug sniffers
i2b2.CRC.ajax._SniffMsg = new YAHOO.util.CustomEvent('CellCommMessage');
i2b2.hive.MsgSniffer.RegisterMessageSource({
	channelName: "CRC",
	channelActions: [
		"getQueryMasterList_fromUserId", 
		"getQueryInstanceList_fromQueryMasterId",
		"getQueryResultInstanceList_fromQueryInstanceId",
		"getRequestXml_fromQueryMasterId",
		"runQueryInstance_fromQueryDefinition",
		"deleteQueryMaster",
		"renameQueryMaster",
		"getPDO_fromInputList"
	],
	channelSniffEvent: i2b2.CRC.ajax._SniffMsg 
});


console.timeEnd('execute time');
console.groupEnd();