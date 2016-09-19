// this file contains a list of all files that need to be loaded dynamically for this plugin
// every file in this list will be loaded after the plugin's Init function is called
{
	files:[ "CTSA_NumberOfSamples.js" ],
	css:[ "CTSA_NumberOfSamples.css" ],
	config: {
		// additional configuration variables that are set by the system
		short_name: "CTSA_NumberOfSamples",
		name: "CTSA BBCIS Number Of Samples",
		description: "Click here to see how many samples are available in a query.",
		category: ["celless","plugin","CTSA BBCIS"],
		plugin: {
			isolateHtml: false,  // this means do not use an IFRAME
			isolateComm: false,  // this means to expect the plugin to use AJAX communications provided by the framework
			standardTabs: true, // this means the plugin uses standard tabs at top
			html: {
				source: 'injected_screens.jsp',
				mainDivId: 'CTSA_NumberOfSamples-mainDiv'
			}
		}
	}
}