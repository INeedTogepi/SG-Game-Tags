// ==UserScript==
// @name         SG Game Tags
// @namespace    https://github.com/Propheus/SG-Game-Tags
// @version      3.2
// @description  some tags of the game in Steamgifts.
// @author       Ruphine
// @match        *://www.steamgifts.com/*
// @icon         https://cdn.steamgifts.com/img/favicon.ico
// @connect      steampowered.com
// @connect      ruphine.esy.es
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.js
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==

/* CSS */
const default_bundle = "#E9202A";
const default_card = "#3AA435";
const default_achievement = "#305AC9";
const default_wishlist = "#9335F1";
const default_linux = "#E67300";
const default_mac = "#777777";
const default_early = "#9FA027";
const default_hidden = "#A0522D";

var myCSS = '\
	.tags { \
		text-decoration: none; \
		border-radius: 4px; \
		padding: 2px 5px; \
		font-size: 8pt; \
		margin: 3px 3px 3px 0px; \
		text-shadow: none; \
		display: none; \
	} \
	.tags.tags-minimalist { \
		margin-right: 0; \
		margin-left: 5px; \
	}\
	.my__checkbox { cursor:pointer; padding:7px 0 } \
	.my__checkbox i { margin-right:7px } \
	.my__checkbox:not(:last-of-type) { border-bottom:1px dotted #d2d6e0 } \
	.my__checkbox:not(:hover) .form__checkbox__hover,.my__checkbox.is-selected .form__checkbox__hover,.my__checkbox:not(.is-selected) .form__checkbox__selected,.my__checkbox:hover .form__checkbox__default,.my__checkbox.is-selected .form__checkbox__default { \
		display:none \
	} \
';
myCSS += '.tags-bundle { background-color: ' + GM_getValue("bundle-1", default_bundle) + '; color: ' + GM_getValue("bundle-2", "#FFFFFF") + '}';
myCSS += '.tags-card { background-color: ' + GM_getValue("card-1", default_card) + '; color: ' + GM_getValue("card-2", "#FFFFFF") + '}';
myCSS += '.tags-achievement { background-color: ' + GM_getValue("achievement-1", default_achievement) + '; color: ' + GM_getValue("achievement-2", "#FFFFFF") + '}';
myCSS += '.tags-wishlist { background-color: ' + GM_getValue("wishlist-1", default_wishlist) + '; color: ' + GM_getValue("wishlist-2", "#FFFFFF") + '}';
myCSS += '.tags-linux { background-color: ' + GM_getValue("linux-1", default_linux) + '; color: ' + GM_getValue("linux-2", "#FFFFFF") + '}';
myCSS += '.tags-mac { background-color: ' + GM_getValue("mac-1", default_mac) + '; color: ' + GM_getValue("mac-2", "#FFFFFF") + '}';
myCSS += '.tags-early { background-color: ' + GM_getValue("early-1", default_early) + '; color: ' + GM_getValue("early-2", "#FFFFFF") + '}';
myCSS += '.tags-hidden { background-color: ' + GM_getValue("hidden-1", default_hidden) + '; color: ' + GM_getValue("hidden-2", "#FFFFFF") + '}';

$("head").append('<style type="text/css">' + myCSS + '</style>');

/* Constant Variables */
const linkBundle = "https://www.steamgifts.com/bundle-games/search?q=";
const linkCard = "http://www.steamcardexchange.net/index.php?inventorygame-appid-";
const linkAchievement = "http://steamcommunity.com/stats/"; // 424280/achievements/";
const linkHidden = "https://www.steamgifts.com/account/settings/giveaways/filters/search?q=";
const linkWishlist = "https://www.steamgifts.com/account/steam/wishlist/search?q=";

const linkGameAPI = "http://store.steampowered.com/api/appdetails?filters=categories,platforms,genres&appids=";
const linkPackAPI = "http://store.steampowered.com/api/packagedetails?packageids=";
const linkBundleAPI = "http://ruphine.esy.es/steamgifts/GetBundleStatus.php"; //?AppID=325470
const linkUserAPI = "http://store.steampowered.com/dynamicstore/userdata/";

const ClassCard = "tags tags-card";
const TitleCard = "This game has trading cards";
const TextCard = "Trading Cards";

const ClassBundle = "tags tags-bundle";
const TitleBundle = "Bundled since ";
const TextBundle = "Bundled";

const ClassAchievement = "tags tags-achievement";
const TitleAchievement = "This game has steam achievements";
const TextAchievement = "Achievements";

const ClassHidden = "tags tags-hidden";
const TitleHidden = "This game is in your filter list";
const TextHidden = "Hidden";

const ClassWishlist = "tags tags-wishlist";
const TitleWishlist = "This game is in your Steam wishlist";
const TextWishlist = "Wishlist";

const ClassLinux = "tags tags-linux";
const TitleLinux = "Linux supported";
const TextLinux = "Linux";

const ClassMac = "tags tags-mac";
const TitleMac = "Mac supported";
const TextMac = "Mac";

const ClassEarly = "tags tags-early";
const TitleEarly = "This game is in early access state";
const TextEarly = "Early Access";

const THIS_URL = window.location.href;
const TIMEOUT = 0;

var cbCards = GM_getValue("cbCards", true);
var cbAchievement = GM_getValue("cbAchievement", true);
var cbBundled = GM_getValue("cbBundled", true);
var cbHidden = GM_getValue("cbHidden", true);
var cbWishlist = GM_getValue("cbWishlist", true);
var cbLinux = GM_getValue("cbLinux", false);
var cbMac = GM_getValue("cbMac", false);
var cbEarly = GM_getValue("cbEarly", false);

var cbTagStyle = GM_getValue("cbTagStyle", 1); //1 = full, 2 = minimalist

var BundledGames = GM_getValue("BundledGames", "");
var BundledCache = GM_getValue("BundledCache", 0);
var UserdataAPI = GM_getValue("UserdataAPI", "");
var UserdataCache = GM_getValue("UserdataCache", 0);
var GameData = GM_getValue("GameData", "");
var PackageData = GM_getValue("PackageData", "");

var rgWishlist;
var arrBundled;

if(cbBundled && BundledCache < Date.now() - 6*60*60*1000) //6 hours. Check if need to request bundle list from ruphine API
	getBundleList();
else if(cbWishlist && UserdataCache < Date.now() - 6*60*60*1000) //6 hours. Check if need to request steam user api
	getUserdata();
else
	main();

function main()
{
	try {
		arrBundled = JSON.parse(BundledGames);
	}
	catch (e) {
		console.log("[SG Game Tags] Invalid json format for Bundle List");
		BundledGames = ""; GM_setValue("BundledGames", "");
		BundledCache = 0;  GM_setValue("BundledCache", 0);
	}

	try {
		rgWishlist = JSON.parse(UserdataAPI).rgWishlist;
	}
	catch (e) {
		console.log("[SG Game Tags] Invalid json format for Wishlist");
		UserdataAPI = ""; GM_setValue("UserdataAPI", "");
		UserdataCache = 0; GM_setValue("UserdataCache", 0);
	}	

	if(GameData == "") PrepareJSON();
	else
	{
		GameData = JSON.parse(GameData);
		PackageData = JSON.parse(PackageData);
	}

	if(/www.steamgifts.com\/giveaways\/new/.test(THIS_URL)) // process giveaway creation page
		$(".js__autocomplete-data").on("DOMNodeInserted", NewGiveawayDivUpdated);
	else if(/www.steamgifts.com\/account\/settings\/giveaways$/.test(THIS_URL)) // process giveaway setting page
		initSetting();
	else if(/www.steamgifts.com\/($|giveaways$|giveaways\/search)/.test(THIS_URL)) // homepage and all search active giveaway
	{
		ProcessGiveawayListPage($(".giveaway__row-inner-wrap"));
		// handles element added later by endless scroll, add timeout to delay this function because it is triggered when ext SG runs
		setTimeout(function()
		{
			$(document).on("DOMNodeInserted", ".widget-container", function(e)
			{
				ProcessGiveawayListPage($(e.target).find(".giveaway__row-inner-wrap"));
			});
		}, TIMEOUT);

		if($(".featured__inner-wrap .global__image-outer-wrap--missing-image").length == 0 && $(".featured__inner-wrap a img").length > 0)
		{
			var URL = $(".featured__inner-wrap a img")[0].src;
			ProcessFeaturedGiveaway(URL);
		}
	}
	// user profile & group page excluding user trade and feedback and excluding group users, stats, and wishlist
	else if(/www.steamgifts.com\/(user|group)\//.test(THIS_URL) && !/user\/\w+\/(feedback|trade)/.test(THIS_URL) && !/group\/\w+\/\w+\/(users|stats|wishlist)/.test(THIS_URL)) // exclude 
	{
		ProcessGiveawayListPage($(".giveaway__row-inner-wrap"));
		// handles element added later by endless scroll
		setTimeout(function()
		{
			$(document).on("DOMNodeInserted", ".widget-container", function(e)
			{
				ProcessGiveawayListPage($(e.target).find(".giveaway__row-inner-wrap"));
			});
		}, TIMEOUT);
	}
	else if(/www.steamgifts.com\/giveaway\//.test(THIS_URL)) // giveaway page https://www.steamgifts.com/giveaway/FGbTw/left-4-dead-2
	{
		var URL = $(".featured__inner-wrap a")[0].href;
		ProcessFeaturedGiveaway(URL);
	}
	// https://www.steamgifts.com/sales*
	// https://www.steamgifts.com/sales/account/steam/games
	// https://www.steamgifts.com/sales/account/steam/wishlist
	// https://www.steamgifts.com/giveaways/created
	// https://www.steamgifts.com/giveaways/entered
	// https://www.steamgifts.com/giveaways/won
	// https://www.steamgifts.com/giveaways/wishlist
	// https://www.steamgifts.com/account/settings/giveaways/filters
	else if(/www.steamgifts.com\/(sales|account\/steam\/(games|wishlist)|giveaways\/(created|entered|won|wishlist)|account\/settings\/giveaways\/filters|group\/\w+\/\w+\/wishlist)/.test(THIS_URL))
		ProcessGameListPage();

	AddShortcutToSettingPage();
}

function ProcessFeaturedGiveaway(URL)
{
	if(cbBundled || cbCards || cbAchievement || cbHidden || cbWishlist || cbLinux || cbMac || cbEarly) // check if at least one tag enabled
	{
		var Name = $(".featured__heading__medium").text().substring(0,45); //letter after 45th converted to ...
		var Target = $(".featured__heading");

		ProcessTags(Target, URL, Name);
	}
}

function ProcessGiveawayListPage(scope) // giveaways list with creator name
{
	if(cbBundled || cbCards || cbAchievement || cbHidden || cbWishlist || cbLinux || cbMac || cbEarly) // check if at least one tag enabled
	{
		$(scope).each(function(index, element)
		{
			var URL = $(element).find("a.giveaway__icon").attr("href");
			if(URL != null)
			{
				var Name = $(element).find(".giveaway__heading__name").contents().filter(
					function() //return text without [NEW] and [FREE]
					{
						return this.nodeType === 3; //Node.TEXT_NODE
					}
				).slice(-1)[0].textContent.substring(0,40); //letter after 40th converted to ...
				var Target = $(element).find(".giveaway__heading");
				ProcessTags(Target, URL, Name);
			}
		});
	}
}

function ProcessGameListPage() // giveaways / games list
{
	if(cbBundled || cbCards || cbAchievement || cbHidden || cbWishlist || cbLinux || cbMac || cbEarly) // check if at least one tag enabled
	{
		$(".table__row-inner-wrap").each(function(index, element)
		{
			var URL;
			if(/www.steamgifts.com\/account\/settings\/giveaways\/filters/.test(THIS_URL))
				URL = $(element).find("a.table__column__secondary-link").text();
			else
				URL = $($(element).find(".global__image-inner-wrap")[0]).css('background-image');

			if(URL != null)
			{
				URL = URL.replace('url(', '').replace(')', '');
				var Name = $(element).find(".table__column__heading").text().substring(0,30);
				var Target = $(element).find(".table__column--width-fill > :first-child");

				if(/www.steamgifts.com\/sales/.test(THIS_URL)) Target.css("display", "block"); //because sales pages don't use <p> thus tags will appears in line with title

				ProcessTags(Target, URL, Name);
			}
		});
	}
}

function ProcessTags(Target, URL, Name)
{
	var ID = getAppIDfromLink(URL);
	Name = encodeURIComponent(Name); //encode special characters that may break search params
	var linkStore = "";
	if(isApp(URL))
		linkStore = "http://store.steampowered.com/app/" + ID;
	else if(isPackage(URL))
		linkStore = "http://store.steampowered.com/sub/" + ID;

	if(cbTagStyle == 1)
	{
		var tagBundle      = createTag(ClassBundle, TitleBundle, TextBundle, linkBundle+Name, Target);
		var tagCard        = createTag(ClassCard, TitleCard, TextCard, linkCard+ID, tagBundle);
		var tagAchievement = createTag(ClassAchievement, TitleAchievement, TextAchievement, linkAchievement+ID+"/achievements/", tagCard);
		var tagWishlist    = createTag(ClassWishlist, TitleWishlist, TextWishlist, linkWishlist+Name, tagAchievement);
		var tagLinux       = createTag(ClassLinux, TitleLinux, TextLinux, linkStore, tagWishlist);
		var tagMac         = createTag(ClassMac, TitleMac, TextMac, linkStore, tagLinux);
		var tagEarly       = createTag(ClassEarly, TitleEarly, TextEarly, linkStore, tagMac);
	}
	else
	{
		var tagBundle      = createTag(ClassBundle + " tags-minimalist", TitleBundle, "B", linkBundle+Name, Target);
		var tagCard        = createTag(ClassCard + " tags-minimalist", TitleCard, "T", linkCard+ID, Target);
		var tagAchievement = createTag(ClassAchievement + " tags-minimalist", TitleAchievement, "A", linkAchievement+ID+"/achievements/", Target);
		var tagWishlist    = createTag(ClassWishlist + " tags-minimalist", TitleWishlist, "W", linkWishlist+Name, Target);
		var tagLinux       = createTag(ClassLinux + " tags-minimalist", TitleLinux, "L", linkStore, Target);
		var tagMac         = createTag(ClassMac + " tags-minimalist", TitleMac, "M", linkStore, Target);
		var tagEarly       = createTag(ClassEarly + " tags-minimalist", TitleEarly, "E", linkStore, Target);
	}

	if(/www.steamgifts.com\/giveaway\//.test(THIS_URL)) //only trigger inside giveaway page, no need for homepage
	{
		if(cbTagStyle == 1)
			var tagHidden = createTag(ClassHidden, TitleHidden, TextHidden, linkHidden+Name, tagEarly);
		else if(cbTagStyle == 2)
			var tagHidden = createTag(ClassHidden + " tags-minimalist", TitleHidden, "H", linkHidden+Name, Target);

		getHiddenStatus(ID, Name, tagHidden);
	}

	if(isApp(URL))
		getSteamCategories(ID, tagCard, tagAchievement, tagLinux, tagMac, tagEarly);
	else if(isPackage(URL))
	{
		tagCard.setAttribute("href", "");
		tagAchievement.setAttribute("href", "");
		getSteamCategoriesFromPackage(ID, tagCard, tagAchievement, tagLinux, tagMac, tagEarly);
	}

	var type = isApp(URL) ? 'app' : 'sub';
	if(cbBundled && BundledGames != "")
		getBundleStatus(ID, type, tagBundle);
	if(cbWishlist && UserdataAPI != "" && rgWishlist.length > 0)
		getWishlistStatus(ID, tagWishlist);
}

function createTag(_class, title, text, href, divTarget)
{
	var tag = document.createElement("a");
	tag.setAttribute("target", "_blank");
	tag.setAttribute("class", _class);
	tag.setAttribute("title", title);
	tag.setAttribute("href", href);
	tag.innerHTML = text;

	if(cbTagStyle == 1 || /www.steamgifts.com\/giveaways\/new/.test(THIS_URL)) // full text below game title, use after, or bundle tag in giveaway creation page
		$(divTarget).after(tag);
	else if(cbTagStyle == 2) // minimalist beside game title use append
		$(divTarget).append(tag);
	return tag;
}

function displayElems(elems)
{
	$(elems).css("display", "inline-block");
}

function getSteamCategories(appID, tagCard, tagAchievement, tagLinux, tagMac, tagEarly, packID = 0)
{
	var needRequest = false;
	if(GameData[appID] == null)
	{
		var template = {"cards": false, "achievement": false, "mac": false, "linux": false, "early_access": false, "last_checked": 0};
		GameData[appID] = template;
		needRequest = true;
	}
	else
	{
		var data = GameData[appID];
		if(cbCards       && data.cards      ) displayElems(tagCard);
		if(cbAchievement && data.achievement) displayElems(tagAchievement);
		if(cbMac         && data.mac        ) displayElems(tagMac);
		if(cbLinux       && data.linux      ) displayElems(tagLinux);

		if(data.last_checked < (Date.now() - (24 * 60 * 60 * 1000))) // 24 hours have passed since last checked
		{
			if((!data.cards && cbCards) || (!data.achievement && cbAchievement) || (!data.mac && cbMac ) || (!data.linux && cbLinux) || (data.early_access && cbEarly))
				needRequest = true;
		}
		else if(data.early_access && cbEarly) displayElems(tagEarly);
	}
	if(needRequest)
	{
		GM_xmlhttpRequest({
			method: "GET",
			timeout: 10000,
			url: linkGameAPI+appID,
			onload: function(data)
			{
				var obj = JSON.parse(data.responseText)[appID].data;
				if(obj != null) // null = doesn't have store page or doesn't exist
				// get steam apps categories : achievement, trading cards, etc
				{
					var categories = obj.categories;
					if(categories != null)
					{
						var catCards = $.grep(categories, function(e){ return e.id == "29"; });
						if(catCards.length > 0)
						{
							if(cbCards) displayElems(tagCard);
							GameData[appID].cards = true;
							if(packID != 0) PackageData[packID].cards = true;
						}

						var catAchievement = $.grep(categories, function(e){ return e.id == "22"; });
						if(catAchievement.length > 0)
						{
							if(cbAchievement) displayElems(tagAchievement);
							GameData[appID].achievement = true;
							if(packID != 0) PackageData[packID].achievement = true;
						}
					}

					// get steam apps platforms: linux: boolean, mac: boolean
					var platforms = obj.platforms;
					if(platforms.linux)
					{
						if(cbLinux) displayElems(tagLinux);
						GameData[appID].linux = true;
						if(packID != 0) PackageData[packID].linux = true;
					}
					if(platforms.mac)
					{
						if(cbMac) displayElems(tagMac);
						GameData[appID].mac = true;
						if(packID != 0) PackageData[packID].mac = true;
					}

					// get steam apps genres
					var genres = obj.genres;
					var genEarly = $.grep(genres, function(e){ return e.id == "70"; });
					if(genEarly.length > 0)
					{
						if(cbEarly) displayElems(tagEarly);
						GameData[appID].early_access = true;
						if(packID != 0) PackageData[packID].early_access = true;
					}
					else
					{
						GameData[appID].early_access = false;
						if(packID != 0) PackageData[packID].early_access = false;
					}
				}
				GameData[appID].last_checked = Date.now();
				GM_setValue("GameData", JSON.stringify(GameData));

				if(packID != 0)
				{
					PackageData[packID].last_checked = Date.now();
					GM_setValue("PackageData", JSON.stringify(PackageData));
				}
			},
			ontimeout: function(data)
			{
				console.log("[SG Game Tags] Request " + linkStore+appID + " Timeout");
			}
		});
	}
}

function getBundleStatus(appID, type, tag)
{
	var Game = $.grep(arrBundled, function(e){ return (e.AppID == appID && e.Type == type); });
	if(Game.length > 0) //game found in bundle list
	{
		displayElems(tag);
		tag.setAttribute("title", TitleBundle+Game[0].BundledDate);
	}
}

function getBundleList()
{
	GM_xmlhttpRequest({
		method: "GET",
		timeout: 10000,
		url: linkBundleAPI,
		onload: function(data)
		{
			BundledGames = data.responseText;
			GM_setValue("BundledGames", BundledGames);

			BundledCache = Date.now();
			GM_setValue("BundledCache", BundledCache);
 			if(cbWishlist && UserdataCache < Date.now() - 6*60*60*1000) //6 hours
 				getUserdata();
 			else
				main();
		},
		ontimeout: function(data)
		{
			console.log("[SG Game Tags] Request " + linkBundleAPI + " Timeout");
			if(cbWishlist && UserdataCache < Date.now() - 6*60*60*1000) //6 hours
 				getUserdata();
 			else
				main();
		}
	});
}

function getUserdata()
{
	GM_xmlhttpRequest({
		method: "GET",
		timeout: 10000,
		url: linkUserAPI,
		onload: function(data)
		{
			UserdataAPI = data.responseText;
			JSON.parse(UserdataAPI);
			GM_setValue("UserdataAPI", UserdataAPI);

			UserdataCache = Date.now();
			GM_setValue("UserdataCache", UserdataCache);

			main();
		},
		ontimeout: function(data)
		{
			console.log("[SG Game Tags] Request " + linkUserAPI + " Timeout");
		}
	});
}

function getHiddenStatus(appID, appName, elems)
{
	if(cbHidden)
	{
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
}

function getWishlistStatus(appID, elems)
{
	appID = parseInt(appID);
	if(rgWishlist.indexOf(appID) >= 0)
		displayElems(elems);
}

function getSteamCategoriesFromPackage(appID, tagCard, tagAchievement, tagLinux, tagMac, tagEarly)
{
	var needRequest = false;
	if(PackageData[appID] == null)
	{
		var template = {"cards": false, "achievement": false, "mac": false, "linux": false, "early_access": false, "last_checked": 0};
		PackageData[appID] = template;
		needRequest = true;
	}
	else
	{
		var data = PackageData[appID];
		if(cbCards       && data.cards      ) displayElems(tagCard);
		if(cbAchievement && data.achievement) displayElems(tagAchievement);
		if(cbMac         && data.mac        ) displayElems(tagMac);
		if(cbLinux       && data.linux      ) displayElems(tagLinux);

		if(data.last_checked < (Date.now() - (24 * 60 * 60 * 1000))) // 24 hours have passed since last checked
		{
			if((!data.cards && cbCards) || (!data.achievement && cbAchievement) || (!data.mac && cbMac ) || (!data.linux && cbLinux) || (data.early_access && cbEarly))
				needRequest = true;
		}
		else if(data.early_access && cbEarly) displayElems(tagEarly);
	}
	if(needRequest)
	{
		GM_xmlhttpRequest({
			method: "GET",
			timeout: 10000,
			url: linkPackAPI+appID,
			onload: function(data)
			{
				var IDs = JSON.parse(data.responseText)[appID].data;
				if(IDs == null)
				{
					PackageData[appID].cards = false;
					PackageData[appID].achievement = false;
					PackageData[appID].mac = false;
					PackageData[appID].linux = false;
					PackageData[appID].early_access = false;
				}
				else
				{
					IDs = IDs.apps;
					$.each(IDs, function(index)
					{
						getSteamCategories(IDs[index].id, tagCard, tagAchievement, tagLinux, tagMac, tagEarly, appID);
					});
				}
			},
			ontimeout: function(data)
			{
				console.log("[SG Game Tags] Request " + linkPackAPI+appID + " Timeout");
			}
		});
	}
}

function PrepareJSON()
{
	var template = {"cards": false, "achievement": false, "mac": false, "linux": false, "early_access": false, "last_checked": 0};
	var a = {"0":template};
	var temp = JSON.stringify(a);
	GameData = JSON.parse(temp);
	PackageData = JSON.parse(temp);
	GM_setValue("GameData", JSON.stringify(GameData));
	GM_setValue("PackageData", JSON.stringify(PackageData));
}

function getAppIDfromLink(link)
{
	var url = link.split("/");
	return url[url.length-2];
}

function isApp(link)
{
	var pattern = /\/app|apps\/0-9\//;
	return pattern.test(link);
}

function isPackage(link)
{
	var pattern = /\/sub|subs\/0-9\//;
	return pattern.test(link);
}


// ========================================== create new giveaway page ========================================================
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

			var type = isApp(url) ? 'app' : 'sub';
			getBundleStatus(ID, type, tagBundle);
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
				var type = isApp(url) ? 'app' : 'sub';
				getBundleStatus(ID, type, tagBundle);
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

// ========================================== setting page ========================================================
function initSetting()
{
	var no = $(".form__heading").length + 1;
	initTagOnOffSetting(no);
	initTagPositionSetting(no+1);
	initTagColorSetting(no+2);
}

function initTagOnOffSetting(no)
{
	var CheckIcon = '<i class="form__checkbox__default fa fa-circle-o"></i><i class="form__checkbox__hover fa fa-circle"></i><i class="form__checkbox__selected fa fa-check-circle"></i>';
	var form__row = document.createElement("div");
	form__row.setAttribute("class", "form__row");

		var form__heading = document.createElement("div");
		form__heading.setAttribute("class", "form__heading");

			var form__heading__number = document.createElement("div");
			form__heading__number.setAttribute("class", "form__heading__number");
			form__heading__number.innerHTML = no + ".";

			var form__heading__text = document.createElement("div");
			form__heading__text.setAttribute("class", "form__heading__text");
			form__heading__text.setAttribute("title", "If you have performance issues, try disable tags you don't need");
			form__heading__text.innerHTML = "[SG Game Tags] Which tags do you want to see?";

		$(form__heading).append(form__heading__number).append(form__heading__text);

		var form__row__indent = document.createElement("div");
		form__row__indent.setAttribute("class", "form__row__indent");

			var form__checkbox_1 = createCheckBox("my__checkbox", CheckIcon + "Trading Cards", cbCards);
			var form__checkbox_2 = createCheckBox("my__checkbox", CheckIcon + "Achievements", cbAchievement);
			var form__checkbox_3 = createCheckBox("my__checkbox", CheckIcon + "Bundled", cbBundled);
			var form__checkbox_4 = createCheckBox("my__checkbox", CheckIcon + "Hidden", cbHidden);
			var form__checkbox_5 = createCheckBox("my__checkbox", CheckIcon + "Wishlist", cbWishlist);
			var form__checkbox_6 = createCheckBox("my__checkbox", CheckIcon + "Linux", cbLinux);
			var form__checkbox_7 = createCheckBox("my__checkbox", CheckIcon + "Mac", cbMac);
			var form__checkbox_8 = createCheckBox("my__checkbox", CheckIcon + "Early Access", cbEarly);

			$(form__checkbox_1).click(function(){toggleCBTags(form__checkbox_1, "cbCards");});
			$(form__checkbox_2).click(function(){toggleCBTags(form__checkbox_2, "cbAchievement");});
			$(form__checkbox_3).click(function(){toggleCBTags(form__checkbox_3, "cbBundled");});
			$(form__checkbox_4).click(function(){toggleCBTags(form__checkbox_4, "cbHidden");});
			$(form__checkbox_5).click(function(){toggleCBTags(form__checkbox_5, "cbWishlist");});
			$(form__checkbox_6).click(function(){toggleCBTags(form__checkbox_6, "cbLinux");});
			$(form__checkbox_7).click(function(){toggleCBTags(form__checkbox_7, "cbMac");});
			$(form__checkbox_8).click(function(){toggleCBTags(form__checkbox_8, "cbEarly");});

		$(form__row__indent)
			.append(form__checkbox_1)
			.append(form__checkbox_2)
			.append(form__checkbox_3)
			.append(form__checkbox_4)
			.append(form__checkbox_5)
			.append(form__checkbox_6)
			.append(form__checkbox_7)
			.append(form__checkbox_8);

	$(form__row).append(form__heading).append(form__row__indent).insertBefore(".js__submit-form");

	var desc = document.createElement("div");
	desc.setAttribute("class", "form__input-description");
	desc.innerHTML = "No need to press Save Changes button. It is automatically saved when the value changed.";
	$(desc).appendTo([form__row__indent]);

	changeCBColor();
}

function initTagPositionSetting(no)
{
	var CheckIcon = '<i class="form__checkbox__default fa fa-circle-o"></i><i class="form__checkbox__hover fa fa-circle"></i><i class="form__checkbox__selected fa fa-check-circle"></i>';
	var form__row = document.createElement("div");
	form__row.setAttribute("class", "form__row");

		var form__heading = document.createElement("div");
		form__heading.setAttribute("class", "form__heading");

			var form__heading__number = document.createElement("div");
			form__heading__number.setAttribute("class", "form__heading__number");
			form__heading__number.innerHTML = no + ".";

			var form__heading__text = document.createElement("div");
			form__heading__text.setAttribute("class", "form__heading__text");
			form__heading__text.setAttribute("title", "This setting doesn't affect performance, only visual change.");
			form__heading__text.innerHTML = "[SG Game Tags] Tags Style";

		$(form__heading).append(form__heading__number).append(form__heading__text);

		var form__row__indent = document.createElement("div");
		form__row__indent.setAttribute("class", "form__row__indent");
			var form__checkbox_1 = createCheckBox("form__checkbox", CheckIcon + "(Original) Full Text tags below game title", cbTagStyle == 1);
			var form__checkbox_2 = createCheckBox("form__checkbox", CheckIcon + "(Minimalist) One letter tags beside game title", cbTagStyle == 2);

			form__checkbox_1.setAttribute("title", 'The tags will display "Trading Cards", "Bundled", etc. This option will increase page height.');
			form__checkbox_2.setAttribute("title", 'The tags will just display first letter. "Trading Cards" becomes "T", "Bundled" becomes "B", etc.');

			$(form__checkbox_1).click(
				function()
				{
					$(form__checkbox_2).removeClass("is-selected").addClass("is-disabled");
					$(form__checkbox_1).removeClass("is-disabled").addClass("is-selected");
					GM_setValue("cbTagStyle", 1);
				}
			);
			$(form__checkbox_2).click(
				function()
				{
					$(form__checkbox_1).removeClass("is-selected").addClass("is-disabled");
					$(form__checkbox_2).removeClass("is-disabled").addClass("is-selected");
					GM_setValue("cbTagStyle", 2);
				}
			);

		$(form__row__indent).append(form__checkbox_1).append(form__checkbox_2);

	$(form__row).append(form__heading).append(form__row__indent).insertBefore(".js__submit-form");

	var desc = document.createElement("div");
	desc.setAttribute("class", "form__input-description");
	desc.innerHTML = "No need to press Save Changes button. It is automatically saved when the value changed.";
	$(desc).appendTo([form__row__indent]);
}

function createCheckBox(_class, _html, cbValue)
{
	var cb = document.createElement("div");
	cb.setAttribute("class", _class);
	cb.innerHTML = _html;
	if(cbValue)
		$(cb).addClass("is-selected");
	else
		$(cb).addClass("is-disabled");

	return cb;
}

function toggleCBTags(cbElems, cbName)
{
	var cbValue;
	if(cbName == "cbCards")
	{
		cbCards = !cbCards;
		cbValue = cbCards;
	}
	else if(cbName == "cbAchievement")
	{
		cbAchievement = !cbAchievement;
		cbValue = cbAchievement;
	}
	else if(cbName == "cbBundled")
	{
		cbBundled = !cbBundled;
		cbValue = cbBundled;
	}
	else if(cbName == "cbHidden")
	{
		cbHidden = !cbHidden;
		cbValue = cbHidden;
	}
	else if(cbName == "cbWishlist")
	{
		cbWishlist = !cbWishlist;
		cbValue = cbWishlist;
	}
	else if(cbName == "cbLinux")
	{
		cbLinux = !cbLinux;
		cbValue = cbLinux;
	}
	else if(cbName == "cbMac")
	{
		cbMac = !cbMac;
		cbValue = cbMac;
	}
	else if(cbName == "cbEarly")
	{
		cbEarly = !cbEarly;
		cbValue = cbEarly;
	}

	GM_setValue(cbName, cbValue);
	if(cbValue)
		$(cbElems).removeClass("is-disabled").addClass("is-selected");
	else
		$(cbElems).removeClass("is-selected").addClass("is-disabled");

	changeCBColor();
}

function changeCBColor()
{
	var colorCBDisabled = $(".form__checkbox.is-disabled").css("color");
	var colorCBSelected = $(".form__checkbox.is-selected").css("color");

	$(".my__checkbox.is-disabled").css("color", colorCBDisabled);
	$(".my__checkbox.is-selected").css("color", colorCBSelected);
}

function initTagColorSetting(no)
{
	var require = ' \
		<style type="text/css"> \
			.row div { display: inline-block; } \
			.preview-tags { width: 80px; margin-left: 10px; } \
			.row .markdown {margin-left: 10px; cursor: pointer; }\
		</style> \
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.css" /> \
	';

	$("head").append(require);

	var form__row = document.createElement("div");
	form__row.setAttribute("class", "form__row");

		var form__heading = document.createElement("div");
		form__heading.setAttribute("class", "form__heading");

			var form__heading__number = document.createElement("div");
			form__heading__number.setAttribute("class", "form__heading__number");
			form__heading__number.innerHTML = no + ".";

			var form__heading__text = document.createElement("div");
			form__heading__text.setAttribute("class", "form__heading__text");
			form__heading__text.innerHTML = "[SG Game Tags] Customized tags color";

		$(form__heading).append(form__heading__number).append(form__heading__text);

		var form__row__indent = document.createElement("div");
		form__row__indent.setAttribute("class", "form__row__indent");
		form__row__indent.innerHTML = ' \
			<div class="row"> \
				<input type="text" class="colorpicker" id="bundle-1"/> \
				<input type="text" class="colorpicker" id="bundle-2"/> \
				<div class="markdown"><a class="default_bundle">Default</a></div> \
				<div class="preview-tags"><a class="tags tags-bundle" style="display: inline-block;">Bundled</a></div> \
			</div> \
			<div class="row"> \
				<input type="text" class="colorpicker" id="card-1"/> \
				<input type="text" class="colorpicker" id="card-2"/> \
				<div class="markdown"><a class="default_card">Default</a></div> \
				<div class="preview-tags"><a class="tags tags-card" style="display: inline-block;">Trading Card</a></div> \
			</div> \
			<div class="row"> \
				<input type="text" class="colorpicker" id="achievement-1"/> \
				<input type="text" class="colorpicker" id="achievement-2"/> \
				<div class="markdown"><a class="default_achievement">Default</a></div> \
				<div class="preview-tags"><a class="tags tags-achievement" style="display: inline-block;">Achievements</a></div> \
			</div> \
			<div class="row"> \
				<input type="text" class="colorpicker" id="wishlist-1"/> \
				<input type="text" class="colorpicker" id="wishlist-2"/> \
				<div class="markdown"><a class="default_wishlist">Default</a></div> \
				<div class="preview-tags"><a class="tags tags-wishlist" style="display: inline-block;">Wishlist</a></div> \
			</div> \
			<div class="row"> \
				<input type="text" class="colorpicker" id="linux-1"/> \
				<input type="text" class="colorpicker" id="linux-2"/> \
				<div class="markdown"><a class="default_linux">Default</a></div> \
				<div class="preview-tags"><a class="tags tags-linux" style="display: inline-block;">Linux</a></div> \
			</div> \
			<div class="row"> \
				<input type="text" class="colorpicker" id="mac-1"/> \
				<input type="text" class="colorpicker" id="mac-2"/> \
				<div class="markdown"><a class="default_mac">Default</a></div> \
				<div class="preview-tags"><a class="tags tags-mac" style="display: inline-block;">Mac</a></div> \
			</div> \
			<div class="row"> \
				<input type="text" class="colorpicker" id="early-1"/> \
				<input type="text" class="colorpicker" id="early-2"/> \
				<div class="markdown"><a class="default_early">Default</a></div> \
				<div class="preview-tags"><a class="tags tags-early" style="display: inline-block;">Early Access</a></div> \
			</div> \
			<div class="row"> \
				<input type="text" class="colorpicker" id="hidden-1"/> \
				<input type="text" class="colorpicker" id="hidden-2"/> \
				<div class="markdown"><a class="default_hidden">Default</a></div> \
				<div class="preview-tags"><a class="tags tags-hidden" style="display: inline-block;">Hidden</a></div> \
			</div> \
		';

	$(form__row).append(form__heading).append(form__row__indent).insertBefore(".js__submit-form");

	var desc = document.createElement("div");
	desc.setAttribute("class", "form__input-description");
	desc.innerHTML = "No need to press Save Changes button. It is automatically saved when colorpicker closed.";
	$(desc).appendTo([form__row__indent]);

	if(cbTagStyle == 2) // change tags if minimalist selected
	{
		$(".row .tags").each(function(index, element)
		{
			$(element).text($(element).text().substring(0,1));
		});
	}

	initColorpicker("bundle-1", GM_getValue("bundle-1", default_bundle), "tags-bundle", "background-color");
	initColorpicker("bundle-2", GM_getValue("bundle-2", "#FFFFFF"), "tags-bundle", "color");
	initColorpicker("card-1", GM_getValue("card-1", default_card), "tags-card", "background-color");
	initColorpicker("card-2", GM_getValue("card-2", "#FFFFFF"), "tags-card", "color");
	initColorpicker("achievement-1", GM_getValue("achievement-1", default_achievement), "tags-achievement", "background-color");
	initColorpicker("achievement-2", GM_getValue("achievement-2", "#FFFFFF"), "tags-achievement", "color");
	initColorpicker("wishlist-1", GM_getValue("wishlist-1", default_wishlist), "tags-wishlist", "background-color");
	initColorpicker("wishlist-2", GM_getValue("wishlist-2", "#FFFFFF"), "tags-wishlist", "color");
	initColorpicker("linux-1", GM_getValue("linux-1", default_linux), "tags-linux", "background-color");
	initColorpicker("linux-2", GM_getValue("linux-2", "#FFFFFF"), "tags-linux", "color");
	initColorpicker("mac-1", GM_getValue("mac-1", default_mac), "tags-mac", "background-color");
	initColorpicker("mac-2", GM_getValue("mac-2", "#FFFFFF"), "tags-mac", "color");
	initColorpicker("early-1", GM_getValue("early-1", default_early), "tags-early", "background-color");
	initColorpicker("early-2", GM_getValue("early-2", "#FFFFFF"), "tags-early", "color");
	initColorpicker("hidden-1", GM_getValue("hidden-1", default_hidden), "tags-hidden", "background-color");
	initColorpicker("hidden-2", GM_getValue("hidden-2", "#FFFFFF"), "tags-hidden", "color");

	$(".default_bundle").click(function(){clickDefaultColor("bundle", default_bundle);});
	$(".default_card").click(function(){clickDefaultColor("card", default_card);});
	$(".default_achievement").click(function(){clickDefaultColor("achievement", default_achievement);});
	$(".default_wishlist").click(function(){clickDefaultColor("wishlist", default_wishlist);});
	$(".default_linux").click(function(){clickDefaultColor("linux", default_linux);});
	$(".default_mac").click(function(){clickDefaultColor("mac", default_mac);});
	$(".default_early").click(function(){clickDefaultColor("early", default_early);});
	$(".default_hidden").click(function(){clickDefaultColor("hidden", default_hidden);});
}

function initColorpicker(id, currentColor, tag, property)
{
	$("#"+id).spectrum({
		showInput: true, // show color code and lets user input color code
		showInitial: true, //show previous color to compare with new color
		showPalette: true,
		showSelectionPalette: true,
		preferredFormat: "hex", //display hex code
		localStorageKey: "spectrum.sggametags",
		maxSelectionSize: 8,
		palette: [
			[default_bundle, default_card, default_achievement, default_wishlist, default_linux, default_mac, default_early, default_hidden],
			["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
			["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
			["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
			["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
			["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
			["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
			["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
			["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
		],
		color:currentColor,
		move: function(color){ $("."+tag).css(property, color.toHexString()); },
		change: function(color){ $("."+tag).css(property, color.toHexString()); },
		hide: function(color){
			GM_setValue(id, color.toHexString());
		}
	});
}

function clickDefaultColor(name, defaultvalue)
{
	console.log("clicked");
	GM_setValue(name+"-1", defaultvalue);
	GM_setValue(name+"-2", "#FFFFFF");
	$(".tags-"+name).css("background-color", defaultvalue).css("color", "#FFFFFF");
	$("#"+name+"-1").spectrum("set", defaultvalue);
	$("#"+name+"-2").spectrum("set", "#FFFFFF");
}

// ==================================================================================================
function AddShortcutToSettingPage()
{
	var shortcut = '\
		<a class="nav__row sggt_shortcut" href="/account/settings/giveaways"> \
			<i class="icon-yellow fa fa-fw fa-tag"></i> \
			<div class="nav__row__summary"> \
				<p class="nav__row__summary__name">SG Game Tags Setting</p> \
				<p class="nav__row__summary__description">Open SG Game Tags setting page</span>.</p> \
			</div> \
		</a> \
	';
	var dropdown = $(".nav__right-container .nav__absolute-dropdown .nav__row");
	$(dropdown[2]).before(shortcut); // just before logout button
}