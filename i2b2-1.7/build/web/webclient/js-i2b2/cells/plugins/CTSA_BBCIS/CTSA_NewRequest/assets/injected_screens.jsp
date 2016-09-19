<%-- 
    Document   : injected_screens
    Created on : Jul 14, 2009, 7:50:28 AM
    Author     : tcasasent
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
		<div id='CTSA_NewRequest-mainDiv'>

			<div id="CTSA_NewRequest-TABS" class="yui-navset">
				<ul class="yui-nav">
					<li id="CTSA_NewRequest-TAB0" class="selected"><a href="#CTSA_NewRequest-TAB0"><em>Select a Query</em></a></li>
					<li id="CTSA_NewRequest-TAB1"><a href="#CTSA_NewRequest-TAB1"><em>Confirm Query</em></a></li>
					<li id="CTSA_NewRequest-TAB2"><a href="#CTSA_NewRequest-TAB2"><em>Plugin Help</em></a></li>
				</ul>
				<div class="yui-content" id="CTSA_NewRequest-CONTENT">
					<div>
						<div class="CTSA_NewRequest-MainContent">
							<div class="CTSA_NewRequest-MainContentPad">
								<div>Drag a query from the <strong>Previous Queries</strong> window and drop it here, to select that query. Then click the <strong>Confirm Query</strong> tab to continue.</div>
								<div class="droptrgtlbl">i2b2 Query:</div>
								<div class="droptrgt SDX-PRS" id="CTSA_NewRequest-PRSDROP" style="">Drop a query here</div>
								<br>
								<div class="qmidlbl">Query Master Id:</div>
								<div class="qmtrgt" id="CTSA_NewRequest-qmId">Query Master Id Will Be Shown Here</div>
								<br>
								<div class="qxmllbl">Query Definition XML:</div>
								<div class="qxmltrgt" id="CTSA_NewRequest-queryXml">Query XML Will Be Shown Here</div>
							</div>
						</div>
					</div>
					<div>
						<div class="CTSA_NewRequest-MainContent">
							<div class="results-directions">You must first provide a query object. Please return to the <strong>Select a Query</strong> tab then drag and drop a query object onto the input box.</div>
							<div class="results-working" style="display:none;"></div>
							<div class="results-finished" style="display:none;">
								<div class="results-text">The following information was passed to the plugin in the i2b2 object:<UL></UL></div>
								<div id="CTSA_NewRequest-InfoSDX">
									<table>
										<tr><th>Display Name</th><td class="sdxDisplayName"></td></tr>
										<tr><th>SDX Datatype Code</th><td class="sdxType"></td></tr>
										<tr><th>Controlling Cell</th><td class="sdxControlCell"></td></tr>
										<tr><th>Primary Key Column</th><td class="sdxKeyName"></td></tr>
										<tr><th>Primary Key Value</th><td class="sdxKeyValue"></td></tr>
										<tr><th>Original XML Data</th><td class="sdxOriginalXML"><div class="originalXML"></div></td></tr>
										<tr><th>Results XML</th><td class="sdxResultsXML"><div class="resultsXML"></div></td></tr>
								</table>
							</div>
						</div>
					</div>
					</div>
					<div>
						<div class="CTSA_NewRequest-MainContent">
							<div class="CTSA_NewRequest-MainContentPad">
								<h1>Example #2 - Tabs and DragDrop</h1>
								<hr size="1" noshade>
								<h2>Introduction</h2>
								This plugin demonstrates how to use tabs and interact with i2b2 objects by accepting DragDrop messages (SDX Objects).
								The three tab layout, which separates plugin input (specify data), plugin output (view results), and help content is a model that can be used by many plugins.
								SDX stands for Standard Data Exchange, which is the i2b2 web client framework's mechanism for handling drag and drop objects. The SDX, AJAX, and other utility functions provided by the framework greatly simplify the process of creating new plugins.
								<h2>Instructions</h2>
								Navigate to the "Specify Data" tab. Then, drag and drop an i2b2 object such as a search term or previous query onto the input box. Finally, click the "View Results" tab for information about that object.
								<h2>About Us</h2>
								This plugin was created by Nick Benik and Griffin Weber, MD, PhD.
								<h2>Terms of Use</h2>
								This example plugin is distributed with the i2b2 web client framework and may be used free of charge.
							</div>
						</div>
					</div>
				</div>
			</div>


		</div>
    </body>
</html>
