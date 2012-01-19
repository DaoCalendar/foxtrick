"use strict";
/*
 * loyality-display.js
 * @author CatzHoek
 */

Foxtrick.modules["LoyalityDisplay"]={
	MODULE_CATEGORY : Foxtrick.moduleCategories.PRESENTATION,
	PAGES : ['players'],
	CSS : Foxtrick.InternalPath + "resources/css/loyality-display.css",
	
	run : function(doc) {
	
		if(!Foxtrick.Pages.Players.isOwnPlayersPage(doc))
			return;
		
		var playersHtml = doc.getElementsByClassName("playerInfo");
		var players = Foxtrick.Pages.Players.getPlayerList(doc);
		
		for (var p=0;p<players.length;p++) {
			
			//FIXME: Delete next season
			var halfEffect = true;
			//FIXME: end
			
			if (players[p].motherClubBonus === undefined || halfEffect){
				if (players[p].loyality !== undefined){
					
					//formula
					// loyality = 1 + sqrt(days/336)*19
					// bonus = sqrt(days/336)
					// -> bonus = (loyality - 1) / 19
					var skillUp = ( players[p].loyality - 1 ) / 19.0;
					
					//FIXME: Delete next season
					if(halfEffect)
						skillUp *= 0.5;

					if(players[p].motherClubBonus !== undefined)
						skillUp += 0.25;
					//FIXME: end
					
					var appendix;
					//find correct style for this loyality level
					if(skillUp == 1)
						appendix = "1000";
					else if(skillUp >= 0.875)
						appendix = "875";
					else if(skillUp >= 0.75)
						appendix = "750";
					else if(skillUp >= 0.625)
						appendix = "625";
					else if(skillUp >= 0.50)
						appendix = "500";
					else if(skillUp >= 0.375)
						appendix = "375";
					else if(skillUp >= 0.25)
						appendix = "250";
					else if(skillUp >= 0.125)
						appendix = "125";
						
					var bars = playersHtml[p].getElementsByClassName("percentImage");
					while(bars.length){
						Foxtrick.makeFeaturedElement(bars[0], this);
						Foxtrick.addClass(bars[0], "ft-percentImage-loyality-" + appendix);
						Foxtrick.addClass(bars[0], "ft-percentImage");
						Foxtrick.removeClass(bars[0], "percentImage");
					}
				}
			} else {
				//replace original image by hg with 1,5 addon style
				var bars = playersHtml[p].getElementsByClassName("percentImage");
				while(bars.length){
					Foxtrick.makeFeaturedElement(bars[0], this);
					Foxtrick.addClass(bars[0], "ft-percentImage-homegrown");
					Foxtrick.addClass(bars[0], "ft-percentImage");
					Foxtrick.removeClass(bars[0], "percentImage");
				}
			}
		}		
	}
};
