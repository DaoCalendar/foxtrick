/**
 * copyPlayerAd.js
 * Copies a player ad to the clipboard
 * @author larsw84, ryanli
 */

 ////////////////////////////////////////////////////////////////////////////////
var FoxtrickCopyPlayerAd = {

	MODULE_NAME : "CopyPlayerAd",
	MODULE_CATEGORY : Foxtrick.moduleCategories.SHORTCUTS_AND_TWEAKS,
	PAGES : ["playerdetail", "youthplayerdetail"],
	DEFAULT_ENABLED : true,
	NEW_AFTER_VERSION : "0.5.2.1",
	LATEST_CHANGE : "Now supporting youth players, and player's skills are sorted.",
	LATEST_CHANGE_CATEGORY : Foxtrick.latestChangeCategories.NEW,

	run : function(page, doc) {
		try {
			var main = doc.getElementById("mainWrapper");
			var links = main.getElementsByTagName("a");
			var empty = true;
			for (var i = 0; i < links.length; i++) {
				if (links[i].href.match(/Club\/\?TeamID/i)
					|| links[i].href.match(/Youth\/Default\.aspx\?YouthTeamID=/i)) {
					empty = false;
					break;
				}
			}
			if (empty) {
				return;
			}
		}
		catch (e) {
			return;
		}

		if (FoxtrickPrefs.getBool("smallcopyicons")) {
			if (doc.getElementById('copyplayerad')) return;
			var boxHead = doc.getElementById('mainWrapper').getElementsByTagName('div')[1];
			if (boxHead.className!='boxHead') return;

			if (Foxtrick.isStandardLayout(doc)) doc.getElementById('mainBody').setAttribute('style','padding-top:10px;');

			var messageLink = doc.createElement("a");
			messageLink.className = "inner copyicon copyplayerad ci_fourth";
			messageLink.title = Foxtrickl10n.getString("foxtrick.tweaks.copyplayerad");
			messageLink.id = "copyplayerad";
			messageLink.addEventListener("click", this.createPlayerAd, false);

			var img = doc.createElement("img");
			img.alt = Foxtrickl10n.getString("foxtrick.tweaks.copyplayerad");
			img.src = Foxtrick.ResourcePath+"resources/img/transparent.gif";

			messageLink.appendChild(img);
			doc.getElementById('mainBody').insertBefore(messageLink, doc.getElementById('mainBody').firstChild);
		}
		else {
			var parentDiv = doc.createElement("div");
			parentDiv.id = "foxtrick_addactionsbox_parentDiv";

			var messageLink = doc.createElement("a");
			messageLink.className = "inner";
			messageLink.title = Foxtrickl10n.getString("foxtrick.tweaks.copyplayerad");
			messageLink.style.cursor = "pointer";
			messageLink.addEventListener("click", this.createPlayerAd, false)

			var img = doc.createElement("img");
			img.style.padding = "0px 5px 0px 0px;";
			img.className = "actionIcon";
			img.alt = Foxtrickl10n.getString("foxtrick.tweaks.copyplayerad");
			img.src = Foxtrick.ResourcePath+"resources/img/copy/copyPlayerAd.png";
			messageLink.appendChild(img);

			parentDiv.appendChild(messageLink);

			var newBoxId = "foxtrick_actions_box";
			Foxtrick.addBoxToSidebar(doc, Foxtrickl10n.getString(
				"foxtrick.tweaks.actions"), parentDiv, newBoxId, "first", "");
		}
	},

	change : function(page, doc) {
		var id = "foxtrick_addactionsbox_parentDiv";
		if (!doc.getElementById(id)) {
			this.run(page, doc);
		}
	},

	createPlayerAd : function(ev) {
		var doc = ev.target.ownerDocument;
		var isSenior = Foxtrick.Pages.Player.isSeniorPlayerPage(doc);
		try {
			var ad = "";

			ad += Foxtrick.Pages.Player.getName(doc);
			if (isSenior) {
				ad += " [playerid=" + Foxtrick.Pages.Player.getId(doc) + "]\n";
			}
			else {
				ad += " [youthplayerid=" + Foxtrick.Pages.Player.getId(doc) + "]\n";
			}

			//nationality, age and next birthday
			var byLine = doc.getElementsByClassName("byline")[0];
			// add new lines before <p> so that textContent would have breaks
			// at <p>s.
			var byLinePars = byLine.getElementsByTagName("p");
			for (var i = 0; i < byLinePars.length; ++i) {
				byLinePars[i].parentNode.insertBefore(doc.createTextNode("\n"), byLinePars[i]);
			}
			ad += Foxtrick.trim(byLine.textContent) + "\n\n";

			if (Foxtrick.Pages.Player.getNationalityName(doc) !== null) {
				ad += Foxtrickl10n.getString("Nationality") + ": "
					+ Foxtrick.Pages.Player.getNationalityName(doc) + "\n\n";
			}

			var playerInfo = doc.getElementsByClassName("playerInfo")[0];

			// basic information
			// for senior players:
			// form, stamina, experience, leadership, personality (always there)
			// for youth players:
			// speciality (only when he has a speciality)
			var basicInfo = playerInfo.getElementsByTagName("p")[0];
			if (basicInfo) {
				if (isSenior) {
					// add new lines before <br> so that textContent would have breaks
					// at <br>s.
					var basicInfoBreaks = basicInfo.getElementsByTagName("br");
					for (var i = 0; i < basicInfoBreaks.length; ++i) {
						basicInfoBreaks[i].parentNode.insertBefore(doc.createTextNode("\n"), basicInfoBreaks[i]);
					}
					ad += Foxtrick.trim(basicInfo.textContent) + "\n\n";
				}
				else {
					var speciality = Foxtrick.trim(basicInfo.textContent);
					// we will bold the speciality part, right after
					// colon plus space
					var colonRe = new RegExp(":\\s*");
					var colonIndex = speciality.search(colonRe);
					var colonLength = speciality.match(colonRe)[0].length;
					ad += speciality.substr(0, colonIndex + colonLength)
						+ "[b]" + speciality.substr(colonIndex + colonLength, speciality.length) + "[/b]"
						+ "\n\n";
				}
			}

			// owner, TSI wage, etc.
			var table = playerInfo.getElementsByTagName("table")[0];
			if (table) {
				for (var i = 0; i < table.rows.length; i++) {
					ad += Foxtrick.trim(table.rows[i].cells[0].textContent) + " ";
					// remove teampopuplinks
					var cellCopy = table.rows[i].cells[1].cloneNode(true);
					var popupLinks = cellCopy.getElementsByTagName("a");
					for (var j = 1; j < popupLinks.length; j++) {
						popupLinks[j].innerHTML = "";
					}
					// bolding for speciality
					ad += (i==5?"[b]":"") + Foxtrick.trim(cellCopy.textContent.replace(/\n/g,"").replace(/\s+/g, " "))
						+ (i==5?"[/b]":"") + "\n";
				}
				ad += "\n";
			}

			var formatSkill = function(text, value) {
				if (value > 5) {
					return "[b]" + text + "[/b]";
				}
				else if (value == 5) {
					return "[i]" + text + "[/i]";
				}
				return text;
			};

			// skills
			var skills = Foxtrick.Pages.Player.getSkillsWithText(doc);
			if (skills !== null) {
				if (isSenior) {
					var skillSort = function(a, b) {
						return b.value - a.value;
					}
					var skillArray = [];
					for (var i in skills.names) {
						skillArray.push(
							{
								name : skills.names[i],
								value : skills.values[i],
								text : skills.texts[i]
							});
					}
					// sort skills by level, descending
					skillArray.sort(skillSort);
					for (var i in skillArray) {
						ad += skillArray[i].name + ": "
							+ formatSkill(skillArray[i].text, skillArray[i].value)
							+ "\n";
					}
				}
				else {
					var skillSort = function(a, b) {
						if (a.current.value !== b.current.value) {
							return b.current.value - a.current.value;
						}
						else if (a.max.value !== b.max.value) {
							return b.max.value - a.max.value;
						}
						return b.maxed - a.maxed;
					}
					var skillArray = [];
					for (var i in skills.names) {
						skillArray.push(
							{
								name : skills.names[i],
								current : { value : skills.values[i].current, text : skills.texts[i].current },
								max : { value : skills.values[i].max, text : skills.texts[i].max },
								maxed : skills.values[i].maxed
							});
					}
					// sort skills by current level, maximum level,
					// and whether the skill has reached the potential,
					// descending
					skillArray.sort(skillSort);
					for (var i in skillArray) {
						ad += formatSkill(skillArray[i].name, Math.max(skillArray[i].current.value, skillArray[i].max.value)) + ": "
							+ (skillArray[i].maxed ? "[b]" : "")
							+ skillArray[i].current.text
							+ " / "
							+ skillArray[i].max.text
							+ (skillArray[i].maxed ? "[/b]" : "")
							+ "\n";
					}
				}
			}

			// current bid information
			var bidDiv = doc.getElementById("ctl00_CPMain_updBid");
			if (bidDiv) {
				ad += "\n";
				var paragraphs = bidDiv.getElementsByTagName("p");
				for (var i = 0; i < paragraphs.length; i++) {
					var cellCopy = paragraphs[i].cloneNode(true);
					var popupLinks = cellCopy.getElementsByTagName("a");
					for (var j = 1; j < popupLinks.length; j++) {
						popupLinks[j].innerHTML = "";
					}
					ad += Foxtrick.trim(cellCopy.textContent);
					ad += "\n";
				}
			}

			Foxtrick.copyStringToClipboard(ad);
			var note = Foxtrick.Note.create(doc, "ft-playerad-copy-note", Foxtrickl10n.getString("foxtrick.tweaks.copied"), null, true);
			var noteArea = Foxtrick.Note.getNoteArea(doc);
			noteArea.appendChild(note);
		}
		catch (e) {
			Foxtrick.alert('createPlayerAd '+e);
		}
	}
};
