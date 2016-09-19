/**
 * @projectDescription	Example using tabs and SDX DragDrop integration (controller code).
 * @inherits	i2b2
 * @namespace	i2b2.CTSA_NewRequest
 * @author	Nick Benik, Griffin Weber MD PhD
 * @version 	1.3
 * ----------------------------------------------------------------------------------------
 * updated 9-28-08: 	Initial Launch [Nick Benik]
 * updated 10-30-08:	GUI revisions [Griffin Weber]
 */

i2b2.CTSA_NewRequest.Init = function(loadedDiv) {
	// this function is called after the HTML is loaded into the viewer DIV

	// register DIV as valid DragDrop target for Patient Record Sets (PRS) objects
	var divName = "CTSA_NewRequest-PRSDROP";
	// register for drag drop events for the following data types: CONCPT, QM, QI, PRS, PRC
	var op_trgt = {
		dropTarget:true
	};
	i2b2.sdx.Master.AttachType(divName, 'QM', op_trgt);
	// route event callbacks to a single drop event handler used by this plugin
	var eventRouterFunc = (function(sdxData) { 
		i2b2.CTSA_NewRequest.doDrop(sdxData);
	});
	i2b2.sdx.Master.setHandlerCustom(divName, 'QM', 'DropHandler', eventRouterFunc);

	// manage YUI tabs
	var cfgObj = {
		activeIndex : 0
	};
	this.yuiTabs = new YAHOO.widget.TabView("CTSA_NewRequest-TABS", cfgObj);
	this.yuiTabs.on('activeTabChange', function(ev) {
		//Tabs have changed
		if (ev.newValue.get('id')=="CTSA_NewRequest-TAB1") {
			// user switched to Results tab
			if (i2b2.CTSA_NewRequest.model.currentRec) {
				// gather statistics only if we have data
				if (i2b2.CTSA_NewRequest.model.dirtyResultsData) {
					// recalculate the results only if the input data has changed
					i2b2.CTSA_NewRequest.getResults();
				}
			}
		}
	});
};


i2b2.CTSA_NewRequest.Unload = function() {
	// this function is called before the plugin is unloaded by the framework
	return true;
};

var i2b2CTSANewRequestReq;

i2b2.CTSA_NewRequest.doDrop = function(sdxData) {
	sdxData = sdxData[0];	// only interested in first record
	// save the info to our local data model
	i2b2.CTSA_NewRequest.model.currentRec = sdxData;
	// let the user know that the drop was successful by displaying the name of the object
	$("CTSA_NewRequest-PRSDROP").innerHTML = i2b2.h.Escape(sdxData.sdxInfo.sdxDisplayName);
	$("CTSA_NewRequest-qmId").innerHTML = i2b2.h.Escape(sdxData.sdxInfo.sdxKeyValue);
	$("CTSA_NewRequest-queryXml").innerHTML = ""; //i2b2.h.Escape(sdxData.sdxInfo.sdxKeyValue);
	var url = "https://" + i2b2.PM.model.hostname + "/BBCIS/i2b2InterfaceServlet?action=" + encodeURIComponent("get_query_xml") +
		"&userName=" + encodeURIComponent(i2b2.PM.model.login_username) +
		"&passWord=" + encodeURIComponent(i2b2.PM.model.login_password) +
		"&project=" + encodeURIComponent(i2b2.PM.model.login_project) +
		"&domain=" + encodeURIComponent(i2b2.PM.model.login_domain) +
		"&queryMasterId=" + encodeURIComponent(sdxData.sdxInfo.sdxKeyValue) +
		"&institutionid=" + encodeURIComponent(i2b2.PM.model.institutionid);
	if (typeof XMLHttpRequest != "undefined")
	{
		i2b2CTSANewRequestReq = new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{
		i2b2CTSANewRequestReq = new ActiveXObject("Microsoft.XMLHTTP");
	}
	i2b2CTSANewRequestReq.open("GET", url, true);
	i2b2CTSANewRequestReq.onreadystatechange = i2b2.CTSA_NewRequest.callback_GetQueryXml;
	i2b2CTSANewRequestReq.send(null);

	// optimization to prevent requerying the hive for new results if the input dataset has not changed
	i2b2.CTSA_NewRequest.model.dirtyResultsData = true;
}

i2b2.CTSA_NewRequest.callback_GetQueryXml = function()
{
    if (i2b2CTSANewRequestReq.readyState == 4)
	{
        if (i2b2CTSANewRequestReq.status == 200)
		{
			var orTags = i2b2CTSANewRequestReq.responseXML.getElementsByTagName("OR");
			var message = "Values(" + orTags.length + "):";
			for(var i=0; i<1*orTags.length; i++)
			{
				message = message + orTags[i].childNodes[0].nodeValue + ",";
			}
			$("CTSA_NewRequest-queryXml").innerHTML = i2b2.h.Escape(message);
		}
	}
}

var i2b2CTSANewRequestReq2;

i2b2.CTSA_NewRequest.getResults = function() {
	// Refresh the display with info of the SDX record that was DragDropped
	if (i2b2.CTSA_NewRequest.model.dirtyResultsData) {
		var dropRecord = i2b2.CTSA_NewRequest.model.currentRec;
		$$("DIV#CTSA_NewRequest-mainDiv DIV#CTSA_NewRequest-TABS DIV.results-directions")[0].hide();
		$$("DIV#CTSA_NewRequest-mainDiv DIV#CTSA_NewRequest-TABS DIV.results-finished")[0].show();
		var sdxDisplay = $$("DIV#CTSA_NewRequest-mainDiv DIV#CTSA_NewRequest-InfoSDX")[0];
		Element.select(sdxDisplay, '.sdxDisplayName')[0].innerHTML = dropRecord.sdxInfo.sdxDisplayName;
		Element.select(sdxDisplay, '.sdxType')[0].innerHTML = dropRecord.sdxInfo.sdxType;
		Element.select(sdxDisplay, '.sdxControlCell')[0].innerHTML = dropRecord.sdxInfo.sdxControlCell;
		Element.select(sdxDisplay, '.sdxKeyName')[0].innerHTML = dropRecord.sdxInfo.sdxKeyName;
		Element.select(sdxDisplay, '.sdxKeyValue')[0].innerHTML = dropRecord.sdxInfo.sdxKeyValue;
		var qmi = dropRecord.sdxInfo.sdxKeyValue;
		// we must escape the xml text or the browser will attempt to interpret it as HTML
		var xmlDisplay = i2b2.h.Xml2String(dropRecord.origData.xmlOrig);
		xmlDisplay = '<pre>'+i2b2.h.Escape(xmlDisplay)+'</pre>';
		Element.select(sdxDisplay, '.originalXML')[0].innerHTML = xmlDisplay;
		// get the results from i2b2
		var url2 = "https://" + i2b2.PM.model.hostname + "/BBCIS/i2b2InterfaceServlet?action=" + encodeURIComponent("get_results_xml") +
			"&userName=" + encodeURIComponent(i2b2.PM.model.login_username) +
			"&passWord=" + encodeURIComponent(i2b2.PM.model.login_password) +
			"&project=" + encodeURIComponent(i2b2.PM.model.login_project) +
			"&domain=" + encodeURIComponent(i2b2.PM.model.login_domain) +
			"&queryMasterId=" + encodeURIComponent(qmi) +
			"&institutionid=" + encodeURIComponent(i2b2.PM.model.institutionid);
		if (typeof XMLHttpRequest != "undefined")
		{
			i2b2CTSANewRequestReq2 = new XMLHttpRequest();
		}
		else if (window.ActiveXObject)
		{
			i2b2CTSANewRequestReq2 = new ActiveXObject("Microsoft.XMLHTTP");
		}
		i2b2CTSANewRequestReq2.open("GET", url2, true);
		i2b2CTSANewRequestReq2.onreadystatechange = i2b2.CTSA_NewRequest.callback_GetResultsXml;
		i2b2CTSANewRequestReq2.send(null);
	}

	// optimization - only requery when the input data is changed
	i2b2.CTSA_NewRequest.model.dirtyResultsData = false;
}

i2b2.CTSA_NewRequest.foo = function()
{
	//this.doQueryLoad = function(qm_id) {  // function to load query from history
	// line 48 CRC_ctrlr_QryTool.js
	sdxData = sdxData[0];	// only interested in first record
	var t = i2b2.CRC.ctrlr.QT.panelControllers[0];
	if (t.isActive=="Y")
	{
		t.doDrop(sdxData);
	}
}

i2b2.CTSA_NewRequest.callback_GetResultsXml = function()
{
    if (i2b2CTSANewRequestReq2.readyState == 4)
	{
        if (i2b2CTSANewRequestReq2.status == 200)
		{
			//var sampleTags = i2b2CTSANewRequestReq2.responseXML.getElementsByTagName("RESULTS-XML");
			var sampleTags = i2b2CTSANewRequestReq2.responseText;
			var sdxDisplay = $$("DIV#CTSA_NewRequest-mainDiv DIV#CTSA_NewRequest-InfoSDX")[0];
			Element.select(sdxDisplay, '.resultsXML')[0].innerHTML = i2b2.h.Escape(sampleTags);
		}
	}
}
