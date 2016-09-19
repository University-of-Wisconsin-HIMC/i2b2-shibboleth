// this file contains a list of all files that need to be loaded dynamically for this plugin
// every file in this list will be loaded after the plugin's Init function is called
{
	files:[ "CTSA_MultiSearch.js" ],
	css:[ "CTSA_MultiSearch.css" ],
	config: {
		// additional configuration variables that are set by the system
		short_name: "CTSA_MultiSearch",
		name: "CTSA BBCIS Multiple Site Search",
		description: "Click here to use an existing query to search multiple sites.",
		category: ["celless","plugin","CTSA BBCIS"],
		plugin: {
			isolateHtml: false,  // this means do not use an IFRAME
			isolateComm: false,  // this means to expect the plugin to use AJAX communications provided by the framework
			standardTabs: true, // this means the plugin uses standard tabs at top
			html: {
				source: 'injected_screens.jsp',
				mainDivId: 'CTSA_MultiSearch-mainDiv'
			}
		}
	}
}