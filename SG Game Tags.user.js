// ==UserScript==
// @name         SG Game Tags
// @namespace    http://steamcommunity.com/id/Ruphine/
// @version      1.0
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
			margin-left: 3px; \
			text-shadow: none; \
			display: none; \
		} \
		.tags-green { background-color: #3AA435; } \
		.tags-red { background-color: #f44336; } \
		.tags-blue { background-color: #305AC9; } \
	</style>';

$("head").append(myCSS);


/* Constant Variables */
const linkCard = "http://www.steamcardexchange.net/index.php?inventorygame-appid-";
const linkBundle = "http://www.steamgifts.com/bundle-games/search?q=";

const linkGameAPI = "http://store.steampowered.com/api/appdetails?filters=categories&appids=";
const linkPackAPI = "http://store.steampowered.com/api/packagedetails?filters=categories&packageids=";

const ClassCard = "tags tags-green";
const TitleCard = "This game has trading cards";
const TextCard = "Cards";

const ClassBundle = "tags tags-red";
const TitleBundle = "This game is considered as bundled by Steamgifts";
const TextBundle = "Bundled";

main();

function main()
{
	// shows trading card tag in featured game (header)
	var currLoc = window.location.href.split("/");

	if($(".featured__inner-wrap").length == 1) //exclude page without featured inner wrap
	{	
		var url;
		if(currLoc[3] == "giveaway")
			url = $(".featured__inner-wrap a")[0].href;
		else if(currLoc[3] != "user")
			url = $(".featured__inner-wrap a img")[0].src;

		if (url != null) //if game doesn't have appID e.g Humble Indie Bundle
		{ 
			var ID = getAppIDfromImg(url);

			var Name = $(".featured__heading__medium").text();
			var target = $(".featured__heading");

			var tagCard = createTag(ClassCard, TitleCard, TextCard, linkCard+ID, target);
			var tagBundle = createTag(ClassBundle, TitleBundle, TextBundle, linkBundle+Name, target);

			if(isAppOrPackage(url)) 
				getTradingCardStatus(tagCard, ID);
			else
				getTradingCardStatusFromPackage(tagCard, ID);

			getBundleStatus(tagBundle, ID, Name);
		}
	}

	//looping for each games shown
	$(".giveaway__row-inner-wrap").each(function(index, element)
	{
		var url = $(element).find("a.giveaway__icon").attr("href");
		if(url == null)
			console.log();
		else
		{
			var ID = getAppIDfromLink(url);
			
			var Name = $(element).find(".giveaway__heading__name").text();
			var target = $(element).find(".giveaway__heading");

			var tagCard = createTag(ClassCard, TitleCard, TextCard, linkCard+ID, target);
			var tagBundle = createTag(ClassBundle, TitleBundle, TextBundle, linkBundle+Name, target);

			if(isAppOrPackage(url)) 
				getTradingCardStatus(tagCard, ID);
			else
				getTradingCardStatusFromPackage(tagCard, ID);

			getBundleStatus(tagBundle, ID, Name);
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

	divTarget.append(tag);
	return tag;
}

function getTradingCardStatus(elems, appID)
{
	var jsonCards = GM_getValue("cards-" + appID, "");
	if(!needRequest(jsonCards))
	{
		if(JSON.parse(jsonCards).val)
			$(elems).css("display", "block");
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
					obj =obj.categories;
					for(i=0; i<obj.length; i++)
					{
						if(obj[i].id == "29")
						{
							$(elems).css("display", "block");
							saveData("cards-" + appID, true);
							return true; //exit function
						}
					}
					saveData("cards-" + appID, false);
				}
			}
		});
	}
}

function getBundleStatus(elems, appID, appName)
{
	var jsonBundle = GM_getValue("bundled-" + appID, "");
	if(!needRequest(jsonBundle))
	{
		if(JSON.parse(jsonBundle).val)
			$(elems).css("display", "block");
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
					$(elems).css("display", "block");
					saveData("bundled-" + appID, true);
					return true; //exit function
				}
			}
			saveData("bundled-" + appID, false);
		});
	}
}

function getTradingCardStatusFromPackage(elems, appID) //Need more research
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
					getTradingCardStatus(elems, IDs[index].id);
					//TODO : Save appID + false + expire time ke local cache
				});
			}
		}
	});
}

function getAppIDfromImg(link)
{
//	http://cdn.akamai.steamstatic.com/steam/apps/269270/header_292x136.jpg
	var url = link.split("/");
	return url[url.length-2];
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