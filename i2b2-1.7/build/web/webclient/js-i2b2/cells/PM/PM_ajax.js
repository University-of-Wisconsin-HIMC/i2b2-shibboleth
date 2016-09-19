/**
 * @projectDescription	The PM cell communicator object.
 * @inherits 	i2b2.PM
 * @namespace	i2b2.PM.ajax
 * @author		Nick Benik, Griffin Weber MD PhD
 * @version 	1.3
 * ----------------------------------------------------------------------------------------
 * updated 9-15-08: RC4 launch [Nick Benik] 
 */
console.group('Load & Execute component file: cells > PM > ajax');
console.time('execute time');


i2b2.PM.model.attemptingLogin = false;
// ================================================================================================== //
i2b2.PM.ajax.getUserAuth = function(inLoginURL, inDomain, inSHRINE, inProject, inUser, inPass, callback) {
	if (i2b2.PM.model.attemptingLogin) { return false; }
	i2b2.PM.model.attemptingLogin = true;

	console.info("CALLED i2b2.PM.ajax.getUserAuth(",inLoginURL, inDomain, inSHRINE, inProject, inUser, inPass, callback,")");

	var callbackSuccess = function(transport) {
		console.group("[AJAX RESULT i2b2.PM.ajax.getUserAuth]");
		console.info("AJAX Transport SUCCESS");
		console.dir(transport);
		// these are closure variables
		var origLoginURL = inLoginURL;
		var origDomain = inDomain;
		var origSHRINE = inSHRINE;
		var origProject = inProject;
		var origUser = inUser;
		var origPass = inPass;
		var origCallback = callback;	
		
		i2b2.PM.model.attemptingLogin = false;
		
		// check the status from the message
		var xmlRecv = transport.responseXML;
		if (!xmlRecv) {
			console.error("AJAX Message Corrupt", transport);
			alert("The message from the PM Cell was corrupted in transport.\nTry again.");
			document.body.style.cursor = 'default';
			// hide the "loading" mask
			i2b2.h.LoadingMask.hide();
			console.groupEnd();
			return;
		}
		var result_status = xmlRecv.getElementsByTagName('result_status')[0];
		var s = xmlRecv.getElementsByTagName('status')[0];
		if (s.getAttribute('type') != 'DONE') {
			console.error("AJAX Message STATUS problems", s);
			alert("The message from the PM Cell could not be understood.\nMessage: '"+s.firstChild.nodeValue+"'");
			document.body.style.cursor = 'default';
			// hide the "loading" mask
			i2b2.h.LoadingMask.hide();
			console.groupEnd();
			// broadcast a debug message to any sniffers/tools
			var cbMsg = {
				msgRequest: sMessage,
				msgResponse: transport.responseText,
				msgUrl: sUrl,
				error: true,
				errorStatus: transport.status,
				errorMsg: "The PM cell's status message is not DONE."
			};
			var sniffPackage = i2b2.h.BuildSniffPack("PM", "getUserAuth", cbMsg, options.reqOrigin);
			i2b2.PM.ajax._SniffMsg.fire(sniffPackage);
			return;
		} else {
			// if a project was specified filter out any information about other projects the user may have 
			// access to, this will make sure that all future actions can only occur on the specified project.
			if (origProject) {
				var ignoreProjs = i2b2.h.XPath(xmlRecv, '//user/project[@id!="'+origProject+'"]');
				for (var i=0; i<ignoreProjs.length; i++) {
					ignoreProjs[i].parentNode.removeChild(ignoreProjs[i]);
				}
			}		

			// save the valid data that was passed into the PM cell's data model
			i2b2.PM.model.login_username = origUser;
			i2b2.PM.model.login_password = origPass;
			i2b2.PM.model.login_domain = origDomain;
			i2b2.PM.model.shrine_domain = origSHRINE;
			i2b2.PM.model.login_project = origProject;
			console.info("AJAX Login Successful! Updated: i2b2.PM.model");
			console.dir(i2b2.PM.model);
//			console.info("Sending XML result to callback"); <---- this kills IE + FireBug Lite
//			console.dir(xmlRecv);  <---- this kills IE + FireBug Lite
			console.groupEnd();
			// broadcast a debug message to any sniffers/tools
			var cbMsg = {
				msgRequest: sMessage,
				msgResponse: transport.responseText,
				msgUrl: sUrl,
				error: false
			};
			var sniffPackage = i2b2.h.BuildSniffPack("PM", "getUserAuth", cbMsg, options.reqOrigin);
			i2b2.PM.ajax._SniffMsg.fire(sniffPackage);
			// return results to caller
			if (getObjectClass(origCallback)=='i2b2_scopedCallback') {
				origCallback.callback.call(origCallback.scope, xmlRecv);
			} else {
				origCallback(xmlRecv);
			}
		}
	};	
	
	// make sure options are set
	if (undefined==options) { var options = {}; }
	if (!options.reqOrigin) { options.reqOrigin = 'PM:Login'; }
	if (!options.max_time) { options.max_time = 180; }
	// drop the max attrib if we are overriding
	// collect message values
	var sMsgValues = {};
	sMsgValues.result_wait_time = options.max_time;
	sMsgValues.proxy_info = ''
	var sUrl = i2b2.h.getProxy();
	if (sUrl) {
		sMsgValues.proxy_info = '<proxy>\n    		<redirect_url>'+inLoginURL+'getServices</redirect_url>\n    	</proxy>\n';
	} else {
		sUrl = inLoginURL+'getServices';
	}
	// PM + security info
	sMsgValues.sec_user = inUser; 
	sMsgValues.sec_pass = inPass;
	sMsgValues.sec_domain = inDomain;
	sMsgValues.sec_project = inProject;
	sMsgValues.header_msg_id = i2b2.h.GenerateAlphaNumId(20);
	
	// apply message values to message template
	i2b2.h.EscapeTemplateVars(sMsgValues, ["proxy_info"]);
	var syntax = /(^|.|\r|\n)(\{{{\s*(\w+)\s*}}})/; //matches symbols like '{{{ field }}}'
	var t = new Template(i2b2.PM.cfg.msgs.getUserAuth, syntax);
	var sMessage = t.evaluate(sMsgValues);	
	new Ajax.Request(sUrl, {
		contentType: 'text/xml',
		method: 'post',
		postBody: sMessage,
		onSuccess: callbackSuccess,
		onFailure: function(transport) {
			// communications problem
			console.group("[AJAX RESULT i2b2.PM.ajax.getUserAuth]");
			console.error("AJAX Transport FAILURE");
			console.dir(transport);
			i2b2.PM.model.attemptingLogin = false;
			emsg = '\n\n[ '+transport.status+'   '+transport.statusText + ' ]\n'+transport.responseText; 
			alert('A problem was encountered while trying to contact the Project Management Cell!'+emsg);
			// hide the "loading" mask
			i2b2.h.LoadingMask.hide();
			document.body.style.cursor = 'default';
			console.groupEnd();
			// broadcast a debug message to any sniffers/tools
			var cbMsg = {
				msgRequest: sMessage,
				msgResponse: transport.responseText,
				msgUrl: sUrl,
				error: true,
				errorStatus: transport.status,
				errorMsg: "The PM cell's communications channel failed."
			};
			var sniffPackage = i2b2.h.BuildSniffPack("PM", "getUserAuth", cbMsg, options.reqOrigin);
			i2b2.PM.ajax._SniffMsg.fire(sniffPackage);
		}
	});
	return true;
};

// ================================================================================================== //
// create custom event for debug sniffers
i2b2.PM.ajax._SniffMsg = new YAHOO.util.CustomEvent('CellCommMessage');
i2b2.hive.MsgSniffer.RegisterMessageSource({
	channelName: "PM",
	channelActions: [
		"getUserAuth"
	],
	channelSniffEvent: i2b2.PM.ajax._SniffMsg 
});



console.timeEnd('execute time');
console.groupEnd();