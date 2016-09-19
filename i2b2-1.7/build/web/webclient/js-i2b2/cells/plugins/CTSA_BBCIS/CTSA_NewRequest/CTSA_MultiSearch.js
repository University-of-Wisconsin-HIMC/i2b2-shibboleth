/**
 * @projectDescription	Example using tabs and SDX DragDrop integration (controller code).
 * @inherits	i2b2
 * @namespace	i2b2.CTSA_MultiSearch
 * @author	Nick Benik, Griffin Weber MD PhD
 * @version 	1.3
 * ----------------------------------------------------------------------------------------
 * updated 9-28-08: 	Initial Launch [Nick Benik]
 * updated 10-30-08:	GUI revisions [Griffin Weber]
 */

i2b2.CTSA_MultiSearch.Init = function(loadedDiv) {
	// this function is called after the HTML is loaded into the viewer DIV

	// register DIV as valid DragDrop target for Patient Record Sets (PRS) objects
	var divName = "CTSA_MultiSearch-PRSDROP";
	// register for drag drop events for the following data types: CONCPT, QM, QI, PRS, PRC
	var op_trgt = {
		dropTarget:true
	};
	i2b2.sdx.Master.AttachType(divName, 'QM', op_trgt);
	// route event callbacks to a single drop event handler used by this plugin
	var eventRouterFunc = (function(sdxData) { 
		i2b2.CTSA_MultiSearch.doDrop(sdxData);
	});
	i2b2.sdx.Master.setHandlerCustom(divName, 'QM', 'DropHandler', eventRouterFunc);

	// manage YUI tabs
	var cfgObj = {
		activeIndex : 0
	};
	this.yuiTabs = new YAHOO.widget.TabView("CTSA_MultiSearch-TABS", cfgObj);
	this.yuiTabs.on('activeTabChange', function(ev) {
		//Tabs have changed
		if (ev.newValue.get('id')=="CTSA_MultiSearch-TAB1") {
			// user switched to Results tab
			if (i2b2.CTSA_MultiSearch.model.currentRec) {
				// gather statistics only if we have data
				if (i2b2.CTSA_MultiSearch.model.dirtyResultsData) {
					// recalculate the results only if the input data has changed
					i2b2.CTSA_MultiSearch.getResults();
				}
			}
		}
	});
};


i2b2.CTSA_MultiSearch.Unload = function() {
	// this function is called before the plugin is unloaded by the framework
	return true;
};

var i2b2CTSAMultiSearchReq;

i2b2.CTSA_MultiSearch.doDrop = function(sdxData) {
	sdxData = sdxData[0];	// only interested in first record
	// save the info to our local data model
	i2b2.CTSA_MultiSearch.model.currentRec = sdxData;
	// let the user know that the drop was successful by displaying the name of the object
	$("CTSA_MultiSearch-PRSDROP").innerHTML = i2b2.h.Escape(sdxData.sdxInfo.sdxDisplayName);
	$("CTSA_MultiSearch-qmId").innerHTML = i2b2.h.Escape(sdxData.sdxInfo.sdxKeyValue);
	// optimization to prevent requerying the hive for new results if the input dataset has not changed
	i2b2.CTSA_MultiSearch.model.dirtyResultsData = true;
}

var i2b2CTSAMultiSearchReq2;

i2b2.CTSA_MultiSearch.getResults = function() {
	// Refresh the display with info of the SDX record that was DragDropped
	if (i2b2.CTSA_MultiSearch.model.dirtyResultsData) {
		var dropRecord = i2b2.CTSA_MultiSearch.model.currentRec;
		$$("DIV#CTSA_MultiSearch-mainDiv DIV#CTSA_MultiSearch-TABS DIV.results-directions")[0].hide();
		$$("DIV#CTSA_MultiSearch-mainDiv DIV#CTSA_MultiSearch-TABS DIV.results-finished")[0].show();
		var qmi = dropRecord.sdxInfo.sdxKeyValue;
		// we must escape the xml text or the browser will attempt to interpret it as HTML
		// get the results from i2b2
		var url2 = "https://ctsabbc-dev.uth.tmc.edu/YUIWebApp/i2b2InterfaceServlet?action=" + encodeURIComponent("multi_create_run_query") +
			"&userName=" + encodeURIComponent(i2b2.PM.model.login_username) +
			"&passWord=" + encodeURIComponent(i2b2.PM.model.login_password) +
			"&project=" + encodeURIComponent(i2b2.PM.model.login_project) +
			"&domain=" + encodeURIComponent(i2b2.PM.model.login_domain) +
			"&queryMasterId=" + encodeURIComponent(qmi) +
			"&queryName=" + encodeURIComponent("MultiQuery" + qmi);
		if (typeof XMLHttpRequest != "undefined")
		{
			i2b2CTSAMultiSearchReq2 = new XMLHttpRequest();
		}
		else if (window.ActiveXObject)
		{
			i2b2CTSAMultiSearchReq2 = new ActiveXObject("Microsoft.XMLHTTP");
		}
		i2b2CTSAMultiSearchReq2.open("GET", url2, true);
		i2b2CTSAMultiSearchReq2.onreadystatechange = i2b2.CTSA_MultiSearch.callback_GetResultsXml;
		i2b2CTSAMultiSearchReq2.send(null);
	}

	// optimization - only requery when the input data is changed
	i2b2.CTSA_MultiSearch.model.dirtyResultsData = false;
}

i2b2.CTSA_MultiSearch.foo = function()
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

i2b2.CTSA_MultiSearch.callback_GetResultsXml = function()
{
    if (i2b2CTSAMultiSearchReq2.readyState == 4)
	{
        if (i2b2CTSAMultiSearchReq2.status == 200)
		{
			//var sampleTags = i2b2CTSAMultiSearchReq2.responseXML.getElementsByTagName("RESULTS-XML");
			var sampleTags = i2b2CTSAMultiSearchReq2.responseText;
			var sdxDisplay = $$("DIV#CTSA_MultiSearch-mainDiv DIV#CTSA_MultiSearch-InfoSDX")[0];
			Element.select(sdxDisplay, '.resultsInfo')[0].innerHTML = '<pre>'+i2b2.h.Escape(sampleTags)+'</pre>';
		}
	}
}
