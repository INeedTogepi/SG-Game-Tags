// ==UserScript==
// @name         SG Game Tags
// @namespace    http://steamcommunity.com/id/Ruphine/
// @version      2.3
// @description  Shows some tags of the game in Steamgifts.
// @author       Ruphine

// @match        http://www.steamgifts.com/*

// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant        GM_deleteValue 
// @grant        GM_getValue 
// @grant        GM_listValues 
// @grant        GM_setValue 
// @grant        GM_xmlhttpRequest
// ==/UserScript==

/* CSS */
var myCSS;
myCSS = '<style> \
		.tags { \
			color: #FFFFFF; \
			text-decoration: none; \
			border-radius: 20px; \
			padding-top: 2px; \
			padding-bottom: 2px; \
			padding-left: 5px; \
			padding-right: 5px; \
			font-size: 8pt; \
			margin-right: 3px; \
			margin-bottom: 3px; \
			margin-top: 3px; \
			text-shadow: none; \
			display: none; \
		} \
		.tags-green { background-color: #3AA435; } \
		.tags-red { background-color: #f44336; } \
		.tags-blue { background-color: #305AC9; } \
		.tags-purple { background-color: #6600cc; } \
		.tags-brown { background-color: #A0522D; } \
	</style>';

$("head").append(myCSS);


/* Constant Variables */
const linkCard = "http://www.steamcardexchange.net/index.php?inventorygame-appid-";
const linkAchievement = "http://steamcommunity.com/stats/"; // 424280/achievements/";
const linkBundle = "http://www.steamgifts.com/bundle-games/search?q=";
const linkHidden = "http://www.steamgifts.com/account/settings/giveaways/filters/search?q="

const linkGameAPI = "http://store.steampowered.com/api/appdetails?filters=categories&appids=";
const linkPackAPI = "http://store.steampowered.com/api/packagedetails?filters=categories&packageids=";

const ClassCard = "tags tags-green";
const TitleCard = "This game has trading cards";
const TextCard = "Trading Cards";

const ClassBundle = "tags tags-red";
const TitleBundle = "This game is marked as bundled by Steamgifts";
const TextBundle = "Bundled";

const ClassAchievement = "tags tags-blue";
const TitleAchievement = "This game has steam achievements";
const TextAchievement = "Achievements";

const ClassHidden = "tags tags-brown";
const TitleHidden = "This game is in your filter list";
const TextHidden = "Hidden";

main();

function main()
{
	var currLoc = window.location.href.split("/");

	// shows trading card tag in featured game (header)
	if($(".featured__inner-wrap").length == 1) //exclude page without featured inner wrap
	{	
		var url;
		if(currLoc[3] == "giveaway") //giveaway page
			url = $(".featured__inner-wrap a")[0].href;
		else if(currLoc[3] != "user" && currLoc[3] != "group") //homepage
			url = $(".featured__inner-wrap a img")[0].src;

		if (url != null) //if game doesn't have appID e.g Humble Indie Bundle
		{ 
			var ID = getAppIDfromLink(url);
			var Name = $(".featured__heading__medium").text();
			var target = $(".featured__heading");

			var tagCard = createTag(ClassCard, TitleCard, TextCard, linkCard+ID, target);
			var tagAchievement = createTag(ClassAchievement, TitleAchievement, TextAchievement, linkAchievement+ID+"/achievements/", tagCard);
			var tagBundle = createTag(ClassBundle, TitleBundle, TextBundle, linkBundle+Name, tagAchievement);
			var tagHidden = createTag(ClassHidden, TitleHidden, TextHidden, linkHidden+Name, tagBundle);

			if(isAppOrPackage(url))
			{
				getTradingCardStatus(ID, tagCard);
				getAchievementStatus(ID, tagAchievement);
			}
			else
			{
				tagCard.setAttribute("href", url);
				tagAchievement.setAttribute("href", url);
				getSteamCategoriesFromPackage(ID, tagCard, tagAchievement);
			}

			getBundleStatus(ID, Name, tagBundle);
			
			if(currLoc[3] == "giveaway") //only trigger inside giveaway page, no need for homepage
				getHiddenStatus(ID, Name, tagHidden);
		}
	}
	else if(currLoc[3] == "giveaways" && currLoc[4] == "new") // http://www.steamgifts.com/giveaways/new
	{
		$(".js__autocomplete-data").on("DOMNodeInserted", NewGiveawayDivUpdated);
	}
	else if((currLoc[3] == "giveaways" && !(/search*/.test(currLoc[4]))) || currLoc[6] == "filters")
	{
		$(".table__row-inner-wrap").each(function(index, element)
		{

			var Name = $(element).find(".table__column__heading").text();
			var target = $(element).find(".table__column--width-fill p:nth-child(1)");

			var url;
			if(currLoc[6] == "filters")
				url = $(element).find("a.table__column__secondary-link").text();
			else	
				url = $($(element).find(".global__image-inner-wrap")[0]).css('background-image');

			if(url != null) //if can get app ID from image
			{
				url = url.replace('url(', '').replace(')', '');
				var ID = getAppIDfromLink(url);

				var tagCard = createTag(ClassCard, TitleCard, TextCard, linkCard+ID, target);
				var tagAchievement = createTag(ClassAchievement, TitleAchievement, TextAchievement, linkAchievement+ID+"/achievements/", tagCard);
				var tagBundle = createTag(ClassBundle, TitleBundle, TextBundle, linkBundle+Name, tagAchievement);
				
				if(isAppOrPackage(url)) 
				{
					getTradingCardStatus(ID, tagCard);
					getAchievementStatus(ID, tagAchievement);
				}
				else
				{
					tagCard.setAttribute("href", url);
					tagAchievement.setAttribute("href", url);
					getSteamCategoriesFromPackage(ID, tagCard, tagAchievement);
				}

				getBundleStatus(ID, Name, tagBundle);
			}
			else //if image does not have appID
			{
				//open giveaway page, and then get appID from image
			}
		});
	}

	$(".giveaway__row-inner-wrap").each(function(index, element)
	{
		var url = $(element).find("a.giveaway__icon").attr("href");
		if(url != null)
		{
			var ID = getAppIDfromLink(url);
			
			var Name = $(element).find(".giveaway__heading__name").text();
			var target = $(element).find(".giveaway__heading");

			var tagCard = createTag(ClassCard, TitleCard, TextCard, linkCard+ID, target);
			var tagAchievement = createTag(ClassAchievement, TitleAchievement, TextAchievement, linkAchievement+ID+"/achievements/", tagCard);
			var tagBundle = createTag(ClassBundle, TitleBundle, TextBundle, linkBundle+Name, tagAchievement);

			if(isAppOrPackage(url))
			{
				getTradingCardStatus(ID, tagCard);
				getAchievementStatus(ID, tagAchievement);
			}
			else
			{
				tagCard.setAttribute("href", url);
				tagAchievement.setAttribute("href", url);
				getSteamCategoriesFromPackage(ID, tagCard, tagAchievement);
			}

			getBundleStatus(ID, Name, tagBundle);
		}
	});
}

function createTag(_class, title, text, href, divTarget)
{
	var tag = document.createElement("a");
	tag.setAttribute("id", "tags");
	tag.setAttribute("target", "_blank");
	tag.setAttribute("class", _class);
	tag.setAttribute("title", title);
	tag.setAttribute("href", href);
	tag.innerHTML = text;

	$(divTarget).after(tag);
	return tag;
}

function displayElems(elems)
{
	$(elems).css("display", "inline-block");
}

function getTradingCardStatus(appID, elems)
{
	var jsonCards = GM_getValue("cards-" + appID, "");
	if(!needRequest(jsonCards))
	{
		if(JSON.parse(jsonCards).val)
			displayElems(elems);
	}
	else
	{
		console.log("request card " + appID);
		GM_xmlhttpRequest({
			method: "GET",
			timeout: 10000,
			url: linkGameAPI+appID,
			onload: function(data) 
			{
				var obj = JSON.parse(data.responseText)[appID].data;
				if(obj == null) 
				{
					console.log("apps " + appID + " does not have store page or does not exist");
					saveData("cards-" + appID, false);
				}
				else
				{
					obj = obj.categories;
					if(obj != null)
					{
						for(i=0; i<obj.length; i++)
						{
							if(obj[i].id == "29")
							{
								displayElems(elems);
								saveData("cards-" + appID, true);
								return true; //exit function
							}
						}
					}
					else 
						console.log("apps " + appID + " does not have categories");
					
					saveData("cards-" + appID, false);
				}
			}
		});
	}
}

function getAchievementStatus(appID, elems)
{
	var jsonAchievement = GM_getValue("achievements-" + appID, "");
	if(!needRequest(jsonAchievement))
	{
		if(JSON.parse(jsonAchievement).val)
			displayElems(elems);
	}
	else
	{
		console.log("request achievement " + appID);
		GM_xmlhttpRequest({
			method: "GET",
			timeout: 10000,
			url: linkGameAPI+appID,
			onload: function(data) 
			{
				var obj = JSON.parse(data.responseText)[appID].data;
				if(obj == null) 
				{
					console.log("apps " + appID + " does not have store page or does not exist");
					saveData("achievements-" + appID, false);
				}
				else
				{
					obj = obj.categories;
					if(obj != null)
					{
						for(i=0; i<obj.length; i++)
						{
							if(obj[i].id == "22")
							{
								displayElems(elems);
								saveData("achievements-" + appID, true);
								return true; //exit function
							}
						}
					}
					else 
						console.log("apps " + appID + " does not have categories");

					saveData("achievements-" + appID, false);
				}
			}
		});
	}
}

function getBundleStatus(appID, appName, elems)
{
	var jsonBundle = GM_getValue("bundled-" + appID, "");
	appName = appName.replace("+", "%2B");
	if(!needRequest(jsonBundle))
	{
		if(JSON.parse(jsonBundle).val)
			displayElems(elems);
	}
	else
	{
		console.log("request bundle " + appID);
		$.get( linkBundle+appName, function(data) {
			var gamesfound = $(data).find(".table__column__secondary-link");
			for(i=0; i<$(gamesfound).length; i++)
			{
				var url = $(gamesfound)[i].href;
				var ID = getAppIDfromLink(url);

				if(appID == ID)
				{
					//TODO : Save appID + true ke local cache
					displayElems(elems);
					saveData("bundled-" + appID, true);
					return true; //exit function
				}
			}
			saveData("bundled-" + appID, false);
		});
	}
}

function getHiddenStatus(appID, appName, elems)
{
	console.log("request hidden " + appID);
	appName = appName.replace("+", "%2B");
	$.get(linkHidden+appName, function(data) 
	{
		var gamesfound = $(data).find("a.table__column__secondary-link");
		for(i=0; i<$(gamesfound).length; i++)
		{
			var url = $(gamesfound)[i].href;
			var ID = getAppIDfromLink(url);
			if(appID == ID)
			{
				//TODO : Save appID + true ke local cache
				displayElems(elems);
				return true; //exit function
			}
		}
	});
}

function getSteamCategoriesFromPackage(appID, tagCard, tagAchievement) //Need more research
{
	//TODO: Check if the game is saved, if no then request to steam
	GM_xmlhttpRequest({
		method: "GET",
		timeout: 10000,
		url: linkPackAPI+appID,
		onload: function(data) 
		{
			var IDs = JSON.parse(data.responseText)[appID].data;
			if(IDs == null) console.log("package " + appID + " does not exist");
			else
			{
				IDs = IDs.apps;
				$.each(IDs, function(index)
				{
					getTradingCardStatus(IDs[index].id, tagCard);
					getAchievementStatus(IDs[index].id, tagAchievement);
					//TODO : Save appID + false + expire time ke local cache
				});
			}
		}
	});
}

function getAppIDfromLink(link)
{
//	http://store.steampowered.com/app/403570/	
	var url = link.split("/");
	return url[url.length-2];
}

function isAppOrPackage(link)
{
//	store.steampowered.com/app/403570/	
	var pattern = /\/app\/|\/apps\//;
	return pattern.test(link);
}

function saveData(name, val)
{
	var today = new Date().toJSON().slice(0,10);
	var data = {val:val, savedDate:today};
	GM_setValue(name, JSON.stringify(data));
}

function needRequest(json)
{
	if(json == "")
		return true;
	else
	{
		var obj = JSON.parse(json);
		if(obj.val)
			return false;
		else
		{
			var today = new Date().toJSON().slice(0,10);
			if(obj.savedDate == today)
				return false;
			else
				return true;
		}
	}
}

function NewGiveawayDivUpdated(event)
{
	if(event.type == "DOMNodeInserted") //show bundle tag for shown game
	{
		var gamesfound = $(".table__row-inner-wrap");
		$(".tags").remove();
		$(".table__row-inner-wrap").each(function(index, element)
		{
			var url = $(element).find("a.table__column__secondary-link").text();
			var ID = getAppIDfromLink(url);
			var Name = $(element).find(".table__column__heading").text();
			var Target = $(element).find(".table__column--width-fill");

			$(".js__autocomplete-data").off("DOMNodeInserted");
			var tagBundle = createTag(ClassBundle, TitleBundle, TextBundle, linkBundle+Name, Target);
			$(tagBundle).css("float", "right");
			getBundleStatus(ID, Name, tagBundle);
		});
		if(gamesfound.length > 0)
		{
			$(".js__autocomplete-data").on("DOMNodeRemoved", NewGiveawayDivUpdated);

			$(".table__row-inner-wrap").on("click", function(event)
			{
				var url = $(this).find("a.table__column__secondary-link").text();
				var ID = getAppIDfromLink(url);
				var Name = $(this).find(".table__column__heading").text();
				var Target = $(".js__autocomplete-name")[0];
				tagBundle = createTag(ClassBundle, TitleBundle, TextBundle, linkBundle+Name, Target);
				getBundleStatus(ID, Name, tagBundle);
			});
		}
	}
	else if(event.type == "DOMNodeRemoved")//show / remove tag of selected game
	{
		$(".js__autocomplete-data").off("DOMNodeRemoved");
		$(".table__row-inner-wrap").off("click");
		$(".js__autocomplete-data").on("DOMNodeInserted", NewGiveawayDivUpdated);
	}
}