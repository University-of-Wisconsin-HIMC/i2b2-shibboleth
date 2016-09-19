// this file contains a list of all files that need to be loaded dynamically for this plugin
// every file in this list will be loaded after the plugin's Init function is called
{
	files:[ "CTSA_CreateQuery.js" ],
	css:[ "CTSA_CreateQuery.css" ],
	config: {
		// additional configuration variables that are set by the system
		short_name: "CTSA_CreateQuery",
		name: "CTSA BBCIS Create Query",
		description: "Click here to create a new query with some default values.",
		category: ["celless","plugin","CTSA BBCIS"],
		plugin: {
			isolateHtml: false,  // this means do not use an IFRAME
			isolateComm: false,  // this means to expect the plugin to use AJAX communications provided by the framework
			html: {
				source: 'injected_screens.jsp',
				mainDivId: 'CTSA_CreateQuery-mainDiv'
			}
		}
	}
}