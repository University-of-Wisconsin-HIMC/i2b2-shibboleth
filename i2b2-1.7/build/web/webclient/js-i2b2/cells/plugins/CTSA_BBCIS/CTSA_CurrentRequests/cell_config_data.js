// this file contains a list of all files that need to be loaded dynamically for this plugin
// every file in this list will be loaded after the plugin's Init function is called
{
	files:[ "CTSA_CurrentRequests.js" ],
	css:[ "CTSA_CurrentRequests.css" ],
	config: {
		// additional configuration variables that are set by the system
		short_name: "CTSA_CurrentRequests",
		name: "CTSA BBCIS Current Requests",
		description: "Click here to view and edit the current list of requests in the system.",
		category: ["celless","plugin","CTSA BBCIS"],
		plugin: {
			isolateHtml: false,  	// this means do not use an IFRAME
			isolateComm: true,	// this means to expect the plugin to use AJAX communications provided by the framework
			html: {
				source: 'injected_screens.jsp',
				mainDivId: 'CTSA_CurrentRequests-mainDiv'
			}
		}
	}
}