/**
 * headerfix.js
 * Script which fixes the header
 * @author htbaumanns, CSS by Catalyst2950  
 */

var FoxtrickHeaderFix = {
	
    MODULE_NAME : "HeaderFix",
    MODULE_CATEGORY : Foxtrick.moduleCategories.PRESENTATION,
	PAGES : new Array('all','match','arena'), 
    ONPAGEPREF_PAGE : 'all', 
    DEFAULT_ENABLED : false,
	NEW_AFTER_VERSION: "0.4.9",
	LATEST_CHANGE:"Fix for flickering in forum with standard layout and teampopups off",
	LATEST_CHANGE_CATEGORY : Foxtrick.latestChangeCategories.FIX,
	OPTIONS : new Array("FixLeft","RemoveFlicker"),
	CSS_SIMPLE:"chrome-extension://kfdfmelkohmkpmpgcbbhpbhgjlkhnepg/resources/css/headerfix.css",
	CSS:"chrome-extension://kfdfmelkohmkpmpgcbbhpbhgjlkhnepg/resources/css/headerfix_std.css",
	CSS_SIMPLE_RTL:"chrome-extension://kfdfmelkohmkpmpgcbbhpbhgjlkhnepg/resources/css/headerfix_rtl.css",
	CSS_RTL:"chrome-extension://kfdfmelkohmkpmpgcbbhpbhgjlkhnepg/resources/css/headerfix_std_rtl.css",	                                
    OPTIONS_CSS: new Array ("","chrome-extension://kfdfmelkohmkpmpgcbbhpbhgjlkhnepg/resources/css/fixes/RemoveHeaderFixFlicker.css"),

    init : function() {
		if (Foxtrick.isModuleFeatureEnabled( this, "FixLeft"))
			FoxtrickPrefs.setBool( "module.HeaderFixLeft.enabled", true, true );				
		else FoxtrickPrefs.setBool( "module.HeaderFixLeft.enabled", false, true );
	
		Foxtrick.dump ("module.HeaderFixLeft.enabled="+FoxtrickPrefs.getBool( "module.HeaderFixLeft.enabled")+'\n')	
    },

    run : function( page, doc ) { 
	if (page=='all') return;
	
	if (doc.location.href.search(/isYouth/i)!=-1) return;
	
	var ctl00_CPMain_pnl = doc.getElementById("ctl00_CPMain_pnlPreMatch");
	if (page=='arena')  ctl00_CPMain_pnl = doc.getElementById("ctl00_CPMain_pnlMain"); 
	var ctl00_CPMain_pnlTeamInfo = doc.getElementById("ctl00_CPMain_pnlTeamInfo");
	var ctl00_CPMain_pnlArenaFlash = doc.getElementById("ctl00_CPMain_pnlArenaFlash");
	
	// check right page and ia supporter
	if (page=='match' && (!ctl00_CPMain_pnl || !ctl00_CPMain_pnlTeamInfo)) return;	
	if (page=='arena' && !ctl00_CPMain_pnl) return; 
	if (!ctl00_CPMain_pnlArenaFlash) return;
	
	// get some divs to move
	var arenaInfo = ctl00_CPMain_pnlArenaFlash.nextSibling;
	var separator=null;
	var mainBox=null;
	var divs = ctl00_CPMain_pnl.getElementsByTagName('div');
	for (var i=0;i<divs.length;++i) { 
		if (divs[i].className=='arenaInfo') {arenaInfo=divs[i];}
		if (divs[i].className=='separator') {separator=divs[i];}
		if (divs[i].className=='mainBox') {mainBox=divs[i];}		
	}

	// reduce margins of new top div
	if (ctl00_CPMain_pnlTeamInfo) ctl00_CPMain_pnlTeamInfo.setAttribute('style','float:left !important; margin-top:-20px;');
	else {
		mainBox.getElementsByTagName('h2')[0].setAttribute('style',' margin-top:-20px;');
		if (Foxtrick.isStandardLayout(doc)) mainBox.setAttribute('style',' margin-bottom:0px;');
	}
	
	// move or delete seperator
	if (separator && (page=='match' || !Foxtrick.isStandardLayout(doc))) {
		separator = ctl00_CPMain_pnl.removeChild(separator);	
		ctl00_CPMain_pnl.appendChild(separator);
	}
	// move areainfo
	if (arenaInfo) {
		arenaInfo = ctl00_CPMain_pnl.removeChild(arenaInfo);	
		ctl00_CPMain_pnl.appendChild(arenaInfo);
		var margin;
		if (page=='arena') margin='margin-right:18px';
		else margin='';
		if (Foxtrick.isStandardLayout(doc)) arenaInfo.setAttribute('style','float:right !important;');
		else arenaInfo.setAttribute('style','float:right !important; width:190px !important;'+margin);
	}

	// move flash
	ctl00_CPMain_pnlArenaFlash = ctl00_CPMain_pnl.removeChild(ctl00_CPMain_pnlArenaFlash);
	ctl00_CPMain_pnl.appendChild(ctl00_CPMain_pnlArenaFlash);
	ctl00_CPMain_pnlArenaFlash.setAttribute('style','margin-top:25px;');
    if (page=='arena') 	ctl00_CPMain_pnlArenaFlash.setAttribute('style','margin-top:25px; margin-left:-8px !important; margin-right:-3px !important;');
	
	
	},
	
	change : function( page, doc ) {	
	}
};

var FoxtrickHeaderFixLeft = {
	
    MODULE_NAME : "HeaderFixLeft",
    PAGES : new Array('all'), 
    ONPAGEPREF_PAGE : '', 
    DEFAULT_ENABLED : false,	
	CSS_SIMPLE:"chrome-extension://kfdfmelkohmkpmpgcbbhpbhgjlkhnepg/resources/css/headerfix_left.css",
	CSS_SIMPLE_RTL:"chrome-extension://kfdfmelkohmkpmpgcbbhpbhgjlkhnepg/resources/css/headerfix_rtl_left.css",
	CSS:"chrome-extension://kfdfmelkohmkpmpgcbbhpbhgjlkhnepg/resources/css/headerfix_std_left.css",
	CSS_RTL:"chrome-extension://kfdfmelkohmkpmpgcbbhpbhgjlkhnepg/resources/css/headerfix_std_rtl_left.css",
	
    init : function() {  
	
	if (!Foxtrick.isModuleEnabled(FoxtrickHeaderFix))
		FoxtrickPrefs.setBool( "module.HeaderFixLeft.enabled", false ,true);  
	//Foxtrick.dump ("module.HeaderFixLeft.enabled="+FoxtrickPrefs.getBool( "module.HeaderFixLeft.enabled")+'\n')	
    },

    run : function( page, doc ) { 
	},
	
	change : function( page, doc ) {	
	}
};