// this file contains a list of all files that need to be loaded dynamically for this plugin
// every file in this list will be loaded after the plugin's Init function is called
{
	files:[ "CTSA_Instructions.js" ],
	css:[ "CTSA_Instructions.css" ],
	config: {
		// additional configuration variables that are set by the system
		short_name: "CTSA_Instructions",
		name: "CTSA BBCIS Instructions",
		description: "Click here for instructions and an overview of how to use the CTSA BBCIS application.",
		category: ["celless","plugin","CTSA BBCIS"],
		plugin: {
			isolateHtml: false,  	// this means do not use an IFRAME
			isolateComm: true,	// this means to expect the plugin to use AJAX communications provided by the framework
			html: {
				source: 'injected_screens.jsp',
				mainDivId: 'CTSA_Instructions-mainDiv'
			}
		}
	}
}