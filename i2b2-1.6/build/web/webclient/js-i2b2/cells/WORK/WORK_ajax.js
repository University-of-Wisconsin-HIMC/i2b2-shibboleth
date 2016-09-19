/**
 * @projectDescription	The Workplace cell Communications controller object.
 * @inherits 			i2b2
 * @namespace			i2b2.WORK
 * @author			Nick Benik
 * @version 			1.0
 * ----------------------------------------------------------------------------------------
 * updated 7-31-08: initial launch [Nick Benik] 
 */

console.group('Load & Execute component file: cells > WORK > ajax');
console.time('execute time');


// UNIMPLEMENTED FUNCTIONS - it is not known if these are implemented in the v1.3 Hive server software
// ================================================================================================== //
i2b2.WORK.ajax.getFoldersByProject = function() { alert("[i2b2.WORK.ajax.getFoldersByProject] NOT IMPLEMENTED!"); };
// ================================================================================================== //


// ================================================================================================== //
i2b2.WORK.ajax.moveChild  = function(inputVars, scoped_callback, options) { 
	// this function is used to retreve the child concepts from the Workplace cell server			
	console.group("CALLED i2b2.WORK.ajax.moveChild()");
	console.info("[INPUT 1] inputVars");
	console.dir(inputVars);
	console.info("[INPUT 2] scoped_callback");
	console.dir(scoped_callback);
	console.info("[INPUT 3] options");
	console.dir(options);
	var callbackSuccess = function(transport) {
		console.group("[AJAX RESULT i2b2.WORK.ajax.moveChild]");
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
			cbMsg.errorMsg = "The WORK cell's message could not be interpreted as valid XML.";
			console.error(transport.responseText);
		} else {
			cbMsg.refXML = xmlRecv;
			var result_status = xmlRecv.getElementsByTagName('result_status')[0];
			var s = xmlRecv.getElementsByTagName('status')[0];
			if (s.getAttribute('type') != 'DONE') {
				cbMsg.error = true;
				cbMsg.errorStatus = transport.status;
				cbMsg.errorMsg = "The WORK cell's status message could not understood.";
				console.error(transport.responseText);
			}
		}
		// send the result message to the callback function
		console.info("i2b2CellMsg sent to callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("WORK", "moveChild", cbMsg, options.reqOrigin);
		i2b2.WORK.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	var callbackFailure = function(transport) {
		console.group("[AJAX RESULT i2b2.WORK.ajax.moveChild]");
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
		var sniffPackage = i2b2.h.BuildSniffPack("WORK", "moveChild", cbMsg, options.reqOrigin);
		i2b2.WORK.ajax._SniffMsg.fire(sniffPackage);
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
	sMsgValues.target_node_id = '';
	sMsgValues.new_parent_node_id = ''; 
	if (!Object.isUndefined(inputVars.move_trgt)) { sMsgValues.target_node_id = inputVars.move_trgt; }
	if (!Object.isUndefined(inputVars.move_dest)) { sMsgValues.new_parent_node_id = inputVars.move_dest.substr(inputVars.move_dest.lastIndexOf("\\")+1); }
	var sUrl = i2b2.h.getProxy();
	if (sUrl) {
		sMsgValues.proxy_info = '<proxy>\n            <redirect_url>'+i2b2.WORK.cfg.cellURL+'moveChild</redirect_url>\n        </proxy>\n';
	} else {
		sUrl = i2b2.WORK.cfg.cellURL+'moveChild';
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
	var t = new Template(i2b2.WORK.cfg.msgs.moveChild, syntax);
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
i2b2.WORK.ajax.getFoldersByUserId = function(inputVars, scoped_callback, options) {
	// this function is used to retreve the child concepts from the Workplace cell server			
	console.group("CALLED i2b2.WORK.ajax.getFoldersByUserId()");
	console.info("[INPUT 1] inputVars");
	console.dir(inputVars);
	console.info("[INPUT 2] scoped_callback");
	console.dir(scoped_callback);
	console.info("[INPUT 3] options");
	console.dir(options);

	var callbackSuccess = function(transport) {
		console.group("[AJAX RESULT i2b2.WORK.ajax.getFoldersByUserId]");
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
			cbMsg.errorMsg = "The WORK cell's message could not be interpreted as valid XML.";
			console.error(transport.responseText);
		} else {
			cbMsg.refXML = xmlRecv;
			var result_status = xmlRecv.getElementsByTagName('result_status')[0];
			var s = xmlRecv.getElementsByTagName('status')[0];
			if (s.getAttribute('type') != 'DONE') {
				cbMsg.error = true;
				cbMsg.errorStatus = transport.status;
				cbMsg.errorMsg = "The WORK cell's status message could not understood.";
				console.error(transport.responseText);
			}
		}
		// send the result message to the callback function
		console.info("i2b2CellMsg sent to callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("WORK", "getFoldersByUserId", cbMsg, options.reqOrigin);
		i2b2.WORK.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	var callbackFailure = function(transport) {
		console.group("[AJAX RESULT i2b2.WORK.ajax.getFoldersByUserId]");
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
		var sniffPackage = i2b2.h.BuildSniffPack("WORK", "getFoldersByUserId", cbMsg, options.reqOrigin);
		i2b2.WORK.ajax._SniffMsg.fire(sniffPackage);
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
		sMsgValues.proxy_info = '<proxy>\n            <redirect_url>'+i2b2.WORK.cfg.cellURL+'getFoldersByUserId</redirect_url>\n        </proxy>\n';
	} else {
		sUrl = i2b2.WORK.cfg.cellURL+'getFoldersByUserId';
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
	var t = new Template(i2b2.WORK.cfg.msgs.getFoldersByUserId, syntax);
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
i2b2.WORK.ajax.getChildren = function(inputVars, scoped_callback, options) {
	// this function is used to retreve the child concepts from the Workplace cell server			
	console.group("CALLED i2b2.WORK.ajax.getChildren()");
	console.info("[INPUT 1] inputVars");
	console.dir(inputVars);
	console.info("[INPUT 2] scoped_callback");
	console.dir(scoped_callback);
	console.info("[INPUT 3] options");
	console.dir(options);

	var callbackSuccess = function(transport) {
		console.group("[AJAX RESULT i2b2.WORK.ajax.getChildren]");
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
			cbMsg.errorMsg = "The WORK cell's message could not be interpreted as valid XML.";
			console.error(transport.responseText);
		} else {
			cbMsg.refXML = xmlRecv;
			var result_status = xmlRecv.getElementsByTagName('result_status')[0];
			var s = xmlRecv.getElementsByTagName('status')[0];
			if (s.getAttribute('type') != 'DONE') {
				cbMsg.error = true;
				cbMsg.errorStatus = transport.status;
				cbMsg.errorMsg = "The WORK cell's status message could not understood.";
				console.error(transport.responseText);
			}
		}
		// send the result message to the callback function
		console.info("i2b2CellMsg sent to callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("WORK", "getChildren", cbMsg, options.reqOrigin);
		i2b2.WORK.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	var callbackFailure = function(transport) {
		console.group("[AJAX RESULT i2b2.WORK.ajax.getChildren]");
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
		var sniffPackage = i2b2.h.BuildSniffPack("WORK", "getChildren", cbMsg, options.reqOrigin);
		i2b2.WORK.ajax._SniffMsg.fire(sniffPackage);
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
	sMsgValues.parent_key_value = "";
	if (!Object.isUndefined(inputVars.key)) { sMsgValues.parent_key_value = inputVars.key; }
	var sUrl = i2b2.h.getProxy();
	if (sUrl) {
		sMsgValues.proxy_info = '<proxy>\n            <redirect_url>'+i2b2.WORK.cfg.cellURL+'getChildren</redirect_url>\n        </proxy>\n';
	} else {
		sUrl = i2b2.WORK.cfg.cellURL+'getChildren q';
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
	var t = new Template(i2b2.WORK.cfg.msgs.getChildren, syntax);
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
i2b2.WORK.ajax.addChild = function(inputVars, scoped_callback, options) {
	// this function is used to retreve the child concepts from the Workplace cell server			
	console.group("CALLED i2b2.WORK.ajax.addChild()");
	console.info("[INPUT 1] inputVars");
	console.dir(inputVars);
	console.info("[INPUT 2] scoped_callback");
	console.dir(scoped_callback);
	console.info("[INPUT 3] options");
	console.dir(options);

	var callbackSuccess = function(transport) {
		console.group("[AJAX RESULT i2b2.WORK.ajax.addChild]");
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
			cbMsg.errorMsg = "The WORK cell's message could not be interpreted as valid XML.";
			console.error(transport.responseText);
		} else {
			cbMsg.refXML = xmlRecv;
			var result_status = xmlRecv.getElementsByTagName('result_status')[0];
			var s = xmlRecv.getElementsByTagName('status')[0];
			if (s.getAttribute('type') != 'DONE') {
				cbMsg.error = true;
				cbMsg.errorStatus = transport.status;
				cbMsg.errorMsg = "The WORK cell's status message could not understood.";
				console.error(transport.responseText);
			}
		}
		// send the result message to the callback function
		console.info("i2b2CellMsg sent to callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("WORK", "addChild", cbMsg, options.reqOrigin);
		i2b2.WORK.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	var callbackFailure = function(transport) {
		console.group("[AJAX RESULT i2b2.WORK.ajax.addChild]");
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
		var sniffPackage = i2b2.h.BuildSniffPack("WORK", "addChild", cbMsg, options.reqOrigin);
		i2b2.WORK.ajax._SniffMsg.fire(sniffPackage);
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
	sMsgValues.child_name = '';
	sMsgValues.share_id = '';
	sMsgValues.child_index = '';
	sMsgValues.parent_key_value = '';
	sMsgValues.child_visual_attributes = '';
	sMsgValues.child_annotation = '';
	sMsgValues.child_work_xml = '';
	sMsgValues.child_work_type = '';
	if (!Object.isUndefined(inputVars.key)) { sMsgValues.child_index = inputVars.key; }
	if (!Object.isUndefined(inputVars.name)) { sMsgValues.child_name = inputVars.name; }
	if (!Object.isUndefined(inputVars.share_id)) { sMsgValues.share_id = inputVars.share_id; }
	if (!Object.isUndefined(inputVars.parent_key)) { sMsgValues.parent_key_value = inputVars.parent_key; }
	if (!Object.isUndefined(inputVars.visual_attribs)) { sMsgValues.child_visual_attributes = inputVars.visual_attribs; }
	if (!Object.isUndefined(inputVars.annotation)) { sMsgValues.child_annotation = inputVars.annotation; }
	if (!Object.isUndefined(inputVars.work_xml)) { sMsgValues.child_work_xml = inputVars.work_xml; }
	if (!Object.isUndefined(inputVars.work_type)) { sMsgValues.child_work_type = inputVars.work_type; }
	var sUrl = i2b2.h.getProxy();
	if (sUrl) {
		sMsgValues.proxy_info = '<proxy>\n            <redirect_url>'+i2b2.WORK.cfg.cellURL+'addChild</redirect_url>\n        </proxy>\n';
	} else {
		sUrl = i2b2.WORK.cfg.cellURL+'addChild';
	}
	// PM + security info
	sMsgValues.sec_user = i2b2.h.getUser();
	sMsgValues.sec_pass = i2b2.h.getPass();
	sMsgValues.sec_domain = i2b2.h.getDomain();
	sMsgValues.sec_project = i2b2.h.getProject();
	sMsgValues.header_msg_id = i2b2.h.GenerateAlphaNumId(20);
	
	// apply message values to message template
	i2b2.h.EscapeTemplateVars(sMsgValues, ["proxy_info","child_work_xml"]);
	var syntax = /(^|.|\r|\n)(\{{{\s*(\w+)\s*}}})/; //matches symbols like '{{{ field }}}'
	var t = new Template(i2b2.WORK.cfg.msgs.addChild, syntax);
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
i2b2.WORK.ajax.renameChild = function(inputVars, scoped_callback, options) {
	// this function is used to retreve the child concepts from the Workplace cell server			
	console.group("CALLED i2b2.WORK.ajax.renameChild()");
	console.info("[INPUT 1] inputVars");
	console.dir(inputVars);
	console.info("[INPUT 2] scoped_callback");
	console.dir(scoped_callback);
	console.info("[INPUT 3] options");
	console.dir(options);

	var callbackSuccess = function(transport) {
		console.group("[AJAX RESULT i2b2.WORK.ajax.renameChild]");
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
			cbMsg.errorMsg = "The WORK cell's message could not be interpreted as valid XML.";
			console.error(transport.responseText);
		} else {
			cbMsg.refXML = xmlRecv;
			var result_status = xmlRecv.getElementsByTagName('result_status')[0];
			var s = xmlRecv.getElementsByTagName('status')[0];
			if (s.getAttribute('type') != 'DONE') {
				cbMsg.error = true;
				cbMsg.errorStatus = transport.status;
				cbMsg.errorMsg = "The WORK cell's status message could not understood.";
				console.error(transport.responseText);
			}
		}
		// send the result message to the callback function
		console.info("i2b2CellMsg sent to callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("WORK", "renameChild", cbMsg, options.reqOrigin);
		i2b2.WORK.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	var callbackFailure = function(transport) {
		console.group("[AJAX RESULT i2b2.WORK.ajax.renameChild]");
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
		var sniffPackage = i2b2.h.BuildSniffPack("WORK", "renameChild", cbMsg, options.reqOrigin);
		i2b2.WORK.ajax._SniffMsg.fire(sniffPackage);
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
	sMsgValues.rename_target_id = '';
	sMsgValues.rename_text = '';
	if (!Object.isUndefined(inputVars.key)) { sMsgValues.rename_target_id = inputVars.key; }
	if (!Object.isUndefined(inputVars.name)) { sMsgValues.rename_text = inputVars.name; }
	sMsgValues.proxy_info = ''
	var sUrl = i2b2.h.getProxy();
	if (sUrl) {
		sMsgValues.proxy_info = '<proxy>\n            <redirect_url>'+i2b2.WORK.cfg.cellURL+'renameChild</redirect_url>\n        </proxy>\n';
	} else {
		sUrl = i2b2.WORK.cfg.cellURL+'renameChild';
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
	var t = new Template(i2b2.WORK.cfg.msgs.renameChild, syntax);
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
i2b2.WORK.ajax.annotateChild = function(inputVars, scoped_callback, options) {
	// this function is used to retreve the child concepts from the Workplace cell server			
	console.group("CALLED i2b2.WORK.ajax.annotateChild()");
	console.info("[INPUT 1] inputVars");
	console.dir(inputVars);
	console.info("[INPUT 2] scoped_callback");
	console.dir(scoped_callback);
	console.info("[INPUT 3] options");
	console.dir(options);

	var callbackSuccess = function(transport) {
		console.group("[AJAX RESULT i2b2.WORK.ajax.annotateChild]");
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
			cbMsg.errorMsg = "The WORK cell's message could not be interpreted as valid XML.";
			console.error(transport.responseText);
		} else {
			cbMsg.refXML = xmlRecv;
			var result_status = xmlRecv.getElementsByTagName('result_status')[0];
			var s = xmlRecv.getElementsByTagName('status')[0];
			if (s.getAttribute('type') != 'DONE') {
				cbMsg.error = true;
				cbMsg.errorStatus = transport.status;
				cbMsg.errorMsg = "The WORK cell's status message could not understood.";
				console.error(transport.responseText);
			}
		}
		// send the result message to the callback function
		console.info("i2b2CellMsg sent to callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("WORK", "annotateChild", cbMsg, options.reqOrigin);
		i2b2.WORK.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	var callbackFailure = function(transport) {
		console.group("[AJAX RESULT i2b2.WORK.ajax.annotateChild]");
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
		var sniffPackage = i2b2.h.BuildSniffPack("WORK", "annotateChild", cbMsg, options.reqOrigin);
		i2b2.WORK.ajax._SniffMsg.fire(sniffPackage);
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
	sMsgValues.annotation_target_id = "";
	sMsgValues.annotation_text = "";
	if (!Object.isUndefined(inputVars.key)) { sMsgValues.annotation_target_id = inputVars.key; }
	if (!Object.isUndefined(inputVars.text)) { sMsgValues.annotation_text = inputVars.text; }

	var sUrl = i2b2.h.getProxy();
	if (sUrl) {
		sMsgValues.proxy_info = '<proxy>\n            <redirect_url>'+i2b2.WORK.cfg.cellURL+'annotateChild</redirect_url>\n        </proxy>\n';
	} else {
		sUrl = i2b2.WORK.cfg.cellURL+'annotateChild';
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
	var t = new Template(i2b2.WORK.cfg.msgs.annotateChild, syntax);
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
i2b2.WORK.ajax.deleteChild = function(inputVars, scoped_callback, options) {
	// this function is used to retreve the child concepts from the Workplace cell server			
	console.group("CALLED i2b2.WORK.ajax.deleteChild()");
	console.info("[INPUT 1] inputVars");
	console.dir(inputVars);
	console.info("[INPUT 2] scoped_callback");
	console.dir(scoped_callback);
	console.info("[INPUT 3] options");
	console.dir(options);

	var callbackSuccess = function(transport) {
		console.group("[AJAX RESULT i2b2.WORK.ajax.deleteChild]");
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
			cbMsg.errorMsg = "The WORK cell's message could not be interpreted as valid XML.";
			console.error(transport.responseText);
		} else {
			cbMsg.refXML = xmlRecv;
			var result_status = xmlRecv.getElementsByTagName('result_status')[0];
			var s = xmlRecv.getElementsByTagName('status')[0];
			if (s.getAttribute('type') != 'DONE') {
				cbMsg.error = true;
				cbMsg.errorStatus = transport.status;
				cbMsg.errorMsg = "The WORK cell's status message could not understood.";
				console.error(transport.responseText);
			}
		}
		// send the result message to the callback function
		console.info("i2b2CellMsg sent to callback");
		console.dir(cbMsg);
		console.groupEnd();
		// broadcast a debug message to any sniffers/tools
		var sniffPackage = i2b2.h.BuildSniffPack("WORK", "deleteChild", cbMsg, options.reqOrigin);
		i2b2.WORK.ajax._SniffMsg.fire(sniffPackage);
		// return results to caller
		if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
			origCallback.callback.call(origCallback.scope, cbMsg);
		} else {
			origCallback(cbMsg);
		}
	};
	var callbackFailure = function(transport) {
		console.group("[AJAX RESULT i2b2.WORK.ajax.deleteChild]");
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
		var sniffPackage = i2b2.h.BuildSniffPack("WORK", "deleteChild", cbMsg, options.reqOrigin);
		i2b2.WORK.ajax._SniffMsg.fire(sniffPackage);
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
	sMsgValues.delete_target_id = '';
	if (!Object.isUndefined(inputVars.key)) { sMsgValues.delete_target_id = inputVars.key; }
	sMsgValues.proxy_info = '';
	var sUrl = i2b2.h.getProxy();
	if (sUrl) {
		sMsgValues.proxy_info = '<proxy>\n            <redirect_url>'+i2b2.WORK.cfg.cellURL+'deleteChild</redirect_url>\n        </proxy>\n';
	} else {
		sUrl = i2b2.WORK.cfg.cellURL+'deleteChild';
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
	var t = new Template(i2b2.WORK.cfg.msgs.deleteChild, syntax);
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


// ================================================================================================== //
// create custom event for debug sniffers
i2b2.WORK.ajax._SniffMsg = new YAHOO.util.CustomEvent('CellCommMessage');
i2b2.hive.MsgSniffer.RegisterMessageSource({
	channelName: "WORK",
	channelActions: [
		"getFoldersByProject", 
		"getFoldersByUserId",
		"getChildren",
		"moveChild",
		"addChild",
		"renameChild",
		"annotateChild",
		"deleteChild"
	],
	channelSniffEvent: i2b2.WORK.ajax._SniffMsg 
});



console.timeEnd('execute time');
console.groupEnd();