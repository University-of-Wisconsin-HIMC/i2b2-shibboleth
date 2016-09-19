/**
 * @projectDescription	Example using tabs and SDX DragDrop integration (controller code).
 * @inherits	i2b2
 * @namespace	i2b2.CTSA_CreateQuery
 * @author	Nick Benik, Griffin Weber MD PhD
 * @version 	1.3
 * ----------------------------------------------------------------------------------------
 * updated 9-28-08: 	Initial Launch [Nick Benik]
 * updated 10-30-08:	GUI revisions [Griffin Weber]
 */

var oCheckboxCommercial;
var oCheckboxDrug;
var oFromStudies;
var oToLocation;
var oToStudies;

i2b2.CTSA_CreateQuery.populateList = function(theDiv, theParentConcept, theCaption, theColumn)
{
	var myColumnDefsFooQwerty = [ {
		key:"KEY",
		label:theColumn,
		sortable:true
	} ];
	var url = "https://" + i2b2.PM.model.hostname + "/BBCIS/i2b2InterfaceServlet?action=" + encodeURIComponent("get_concepts_xml") +
	"&userName=" + encodeURIComponent(i2b2.PM.model.login_username) +
	"&passWord=" + encodeURIComponent(i2b2.PM.model.login_password) +
	"&project=" + encodeURIComponent(i2b2.PM.model.login_project) +
	"&domain=" + encodeURIComponent(i2b2.PM.model.login_domain) +
	"&parentConcept=" + encodeURIComponent(theParentConcept) +
	"&institutionid=" + encodeURIComponent(i2b2.PM.model.institutionid);
	var myDataSourceFooQwerty = new YAHOO.util.XHRDataSource(url);
	myDataSourceFooQwerty.connTimeout = 180000;
	myDataSourceFooQwerty.responseType = YAHOO.util.DataSource.TYPE_XML;
	myDataSourceFooQwerty.responseSchema = {
		resultNode : "CONCEPT", // Name of the node for each result
		fields : [
		{
			key: "KEY"
		}
		],
		metaNode : "RESULTS-XML"
	};

	var myDataTableFooQwerty = new YAHOO.widget.DataTable(theDiv, myColumnDefsFooQwerty, myDataSourceFooQwerty, {
		caption: theCaption
	});
	// Subscribe to events for row selection
	myDataTableFooQwerty.subscribe("rowMouseoverEvent", myDataTableFooQwerty.onEventHighlightRow);
	myDataTableFooQwerty.subscribe("rowMouseoutEvent", myDataTableFooQwerty.onEventUnhighlightRow);
	myDataTableFooQwerty.subscribe("rowClickEvent", myDataTableFooQwerty.onEventSelectRow);
	myDataTableFooQwerty.focus();
	return myDataTableFooQwerty;
}

i2b2.CTSA_CreateQuery.populateCheckbox = function(theDiv, theLabel)
{
	var oCheckButton1 = new YAHOO.widget.Button(theDiv, { label: theLabel });
	return oCheckButton1;
};

Array.prototype.contains = function(obj)
{
	var i = this.length;
	while (i--)
	{
		if (this[i] === obj)
		{
			return true;
		}
	}
	return false;
}

var i2b2CTSACreateQueryReq;

i2b2.CTSA_CreateQuery.getTimeString = function()
{
	var d = new Date();
	var curr_hour = d.getHours();
	var curr_min = d.getMinutes();
	var timeString = curr_hour + ":";
	if (curr_min < 10)
	{
		timeString = timeString + "0";
	}
	timeString = timeString + curr_min;
	return timeString;
}

i2b2.CTSA_CreateQuery.createDefaultQueries = function(e)
{
	try
	{
		var url = "https://" + i2b2.PM.model.hostname + "/BBCIS/i2b2InterfaceServlet?action=" + encodeURIComponent("create_query") +
		"&userName=" + encodeURIComponent(i2b2.PM.model.login_username) +
		"&passWord=" + encodeURIComponent(i2b2.PM.model.login_password) +
		"&project=" + encodeURIComponent(i2b2.PM.model.login_project) +
		"&domain=" + encodeURIComponent(i2b2.PM.model.login_domain) +
		"&queryName=" + encodeURIComponent("DefaultQuery-" + i2b2.CTSA_CreateQuery.getTimeString()) +
		"&institutionid=" + encodeURIComponent(i2b2.PM.model.institutionid);
		// these strings are each a panel-not
		if (true == oCheckboxCommercial.get("checked"))
		{
			url = url + "&not-panel=" + encodeURIComponent("\\\\consent\\Consent\\restrictedFrom\\Commercial\\Yes\\");
		}
		if (true == oCheckboxDrug.get("checked"))
		{
			url = url + "&not-panel=" + encodeURIComponent("\\\\consent\\Consent\\restrictedFrom\\DrugCompany\\Yes\\");
		}
		var recordIdArray;
		var i;
		var recordId;
		var record;
		var recordString;
		//var RecordArray;
		var selectedArray;
		var selectedArrayCounter;
		var addToUrlString;
		var addToUrlCounter;
		/////////////////////////////////////////////////////////
		// the selected strings are in a panel-not
		addToUrlString = "";
		addToUrlCounter = 0;
		recordIdArray =  oFromStudies.getSelectedRows();
		for (i = 0; i < recordIdArray.length; i++)
		{
			recordId = recordIdArray[i];
			record = oFromStudies.getRecordSet().getRecord(recordId);
			addToUrlString = addToUrlString + "|" + record.getData("KEY");
			addToUrlCounter = addToUrlCounter + 1;
		}
		if (addToUrlCounter>0)
		{
			url = url + "&not-panel=" + encodeURIComponent(addToUrlString);
		}
		/////////////////////////////////////////////////////////
		// the unselected strings are in a panel-not
		recordIdArray =  oToLocation.getSelectedRows();
		selectedArray = new Array();
		selectedArrayCounter = 0;
		for (i = 0; i < recordIdArray.length; i++)
		{
			recordId = recordIdArray[i];
			record = oToLocation.getRecordSet().getRecord(recordId);
			selectedArray[selectedArrayCounter] = record.getData("KEY");
			selectedArrayCounter = selectedArrayCounter + 1;
		}
		addToUrlString = "";
		addToUrlCounter = 0;
		if (selectedArrayCounter>0)
		{
			recordArray =  oToLocation.getRecordSet().getRecords();
			for (i = 0; i < recordArray.length; i++)
			{
				record = recordArray[i];
				recordString = record.getData("KEY");
				if (false == selectedArray.contains(recordString))
				{
					addToUrlString = addToUrlString + "|" + recordString;
					addToUrlCounter = addToUrlCounter + 1;
				}
			}
			if (addToUrlCounter>0)
			{
				url = url + "&not-panel=" + encodeURIComponent(addToUrlString);
			}
		}
		/////////////////////////////////////////////////////////
		// the unselected strings are in a panel-not
		recordIdArray =  oToStudies.getSelectedRows();
		selectedArray = new Array();
		selectedArrayCounter = 0;
		for (i = 0; i < recordIdArray.length; i++)
		{
			recordId = recordIdArray[i];
			record = oToStudies.getRecordSet().getRecord(recordId);
			selectedArray[selectedArrayCounter] = record.getData("KEY");
			selectedArrayCounter = selectedArrayCounter + 1;
		}
		addToUrlString = "";
		addToUrlCounter = 0;
		if (selectedArrayCounter>0)
		{
			recordArray =  oToStudies.getRecordSet().getRecords();
			for (i = 0; i < recordArray.length; i++)
			{
				record = recordArray[i];
				recordString = record.getData("KEY");
				if (false == selectedArray.contains(recordString))
				{
					addToUrlString = addToUrlString + "|" + recordString;
					addToUrlCounter = addToUrlCounter + 1;
				}
			}
			if (addToUrlCounter>0)
			{
				url = url + "&not-panel=" + encodeURIComponent(addToUrlString);
			}
		}
		/////////////////////////////////////////////////////////
		if (typeof XMLHttpRequest != "undefined")
		{
			i2b2CTSACreateQueryReq = new XMLHttpRequest();
		}
		else if (window.ActiveXObject)
		{
			i2b2CTSACreateQueryReq = new ActiveXObject("Microsoft.XMLHTTP");
		}
		i2b2CTSACreateQueryReq.open("GET", url, true);
		i2b2CTSACreateQueryReq.onreadystatechange = i2b2.CTSA_CreateQuery.callback_createDefaultQueries;
		i2b2CTSACreateQueryReq.send(null);
	}
	catch(e)
	{
		alert("Error preparing call: " + e.message);
	}
};

i2b2.CTSA_CreateQuery.callback_createDefaultQueries = function()
{
    if (i2b2CTSACreateQueryReq.readyState == 4)
	{
        if (i2b2CTSACreateQueryReq.status == 200)
		{
			var orTags = i2b2CTSACreateQueryReq.responseXML.getElementsByTagName("error");
			if (orTags.length>0)
			{
				var message = "Error making request: ";
				for(var i=0; i<1*orTags.length; i++)
				{
					message = message + orTags[i].childNodes[0].nodeValue + ",";
				}
				alert( i2b2.h.Escape( message ) );
			}
			else
			{
				var qTags = i2b2CTSACreateQueryReq.responseXML.getElementsByTagName("query");
				var qName = "";
				for(var i=0; i<1*qTags.length; i++)
				{
					qName = qName + qTags[i].childNodes[0].nodeValue;
				}
				alert("Query '" + qName + "' created.");
			}
			i2b2.CRC.ctrlr.history.Refresh();
		}
	}
}

i2b2.CTSA_CreateQuery.Init = function(loadedDiv)
{
	YAHOO.widget.DataTable._bStylesheetFallback = !!YAHOO.env.ua.ie; 
	oFromStudies = this.populateList("fromStudies", "\\\\consent\\Consent\\restrictedFrom\\StudiesOfType\\", "Select Areas of Study Corresponding to Your Research. This will be used to filter out samples which are restricted from being used for your research area.", "Restricted From Study Areas");
	oToLocation = this.populateList("toLocation", "\\\\consent\\Consent\\restrictedTo\\Location\\", "Select Locations Corresponding to Your Research. This will be used to filter out samples which are restricted from being used in your location.", "Restricted to Locations");
	oToStudies = this.populateList("toStudies", "\\\\consent\\Consent\\restrictedTo\\StudiesOfType\\", "Select Areas of Study Corresponding to Your Research. This will be used to filter for samples which can only be used for your research area.", "Restricted To Study Areas");
	oCheckboxCommercial = this.populateCheckbox("checkboxCommercial", "Check this if your research is commercial or commercially funded.");
	oCheckboxDrug = this.populateCheckbox("checkboxDrug", "Check this if your research is funded or sponsored by a drug company.");
	var createButton = new YAHOO.widget.Button("create-button");
	createButton.on("click", i2b2.CTSA_CreateQuery.createDefaultQueries);
};

i2b2.CTSA_CreateQuery.Unload = function()
{
	// this function is called before the plugin is unloaded by the framework
	return true;
};
