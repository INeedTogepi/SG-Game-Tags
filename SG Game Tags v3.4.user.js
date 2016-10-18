// ==UserScript==
// @name         SG Game Tags
// @namespace    https://steamcommunity.com/id/Ruphine/
// @version      3.4
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

/*jshint multistr: true */

/* Constant Variables */
const linkGameAPI = "http://store.steampowered.com/api/appdetails?appids=";//filters=categories,platforms,genres&
const linkPackAPI = "http://store.steampowered.com/api/packagedetails?packageids=";
const linkBundleAPI = "http://www.ruphine.esy.es/steamgifts/GetBundleStatus.php"; //?AppID=325470
const linkUserAPI = "http://store.steampowered.com/dynamicstore/userdata/";

//p for properties
const pBundle = {
	class	: "tags_bundle",
	text	: "Bundled",
	title	: "Bundled since ",
	min		: "B",
	link	: "https://www.steamgifts.com/bundle-games/search?q=",
	color1	: "#E9202A",
	color2	: "#FFFFFF"
};
const pCard = {
	class	: "tags_card",
	text	: "Trading Cards",
	title	: "This game has trading cards",
	min		: "T",
	link	: "http://www.steamcardexchange.net/index.php?inventorygame-appid-",
	color1	: "#3AA435",
	color2	: "#FFFFFF"
};
const pAchievement = {
	class	: "tags_achievement",
	text	: "Achievements",
	title	: "This game has steam achievements",
	min		: "A",
	link	: "http://steamcommunity.com/stats/", // 424280/achievements/";
	color1	: "#305AC9",
	color2	: "#FFFFFF"
};
const pWishlist = {
	class	: "tags_wishlist",
	text	: "Wishlist",
	title	: "This game is in your Steam wishlist",
	min		: "W",
	link	: "https://www.steamgifts.com/account/steam/wishlist/search?q=",
	color1	: "#9335F1",
	color2	: "#FFFFFF"
};
const pLinux = {
	class	: "tags_linux",
	text	: "Linux",
	title	: "Linux supported",
	min		: "L",
	color1	: "#E67300",
	color2	: "#FFFFFF"
};
const pMac = {
	class	: "tags_mac",
	text	: "Mac",
	title	: "Mac Supported",
	min		: "M",
	color1	: "#777777",
	color2	: "#FFFFFF"
};
const pEarly = {
	class	: "tags_early",
	text	: "Early Access",
	title	: "This game is in early access state",
	min		: "E",
	color1	: "#9FA027",
	color2	: "#FFFFFF"
};
const pHidden = {
	class	: "tags_hidden",
	text	: "Hidden",
	title	: "This game is in your filter list",
	min		: "H",
	link	: "https://www.steamgifts.com/account/settings/giveaways/filters/search?q=",
	color1	: "#A0522D",
	color2	: "#FFFFFF"
};
const pOwned = {
	class	: "tags_owned",
	text	: "Owned",
	title	: "You already have this game",
	min		: "O",
	color1  : "#444444",
	color2  : "#FF9900"
};
const pIgnored = {
	class	: "tags_ignored",
	text	: "Ignored",
	title	: "You marked this game as not interested",
	min		: "X",
	color1	: "#E06666",
	color2	: "#FFFFFF"
};

/* CSS */
const myCSS = '\
	.tags { \
		text-decoration: none; \
		border-radius: 4px; \
		padding: 2px 5px; \
		font-size: 8pt; \
		margin: 3px 3px 3px 0px; \
		text-shadow: none; \
		display: none; \
		white-space: nowrap; \
	} \
	.tags.minimalist { \
		margin-right: 0; \
		margin-left: 5px; \
	} \
	.my__checkbox { cursor:pointer; padding:7px 0; } \
	.my__checkbox i { margin-right:7px; } \
	.my__checkbox:not(:last-of-type) { border-bottom:1px dotted #d2d6e0; } \
	.my__checkbox:not(:hover) .form__checkbox__hover,.my__checkbox.is-selected .form__checkbox__hover,.my__checkbox:not(.is-selected) .form__checkbox__selected,.my__checkbox:hover .form__checkbox__default,.my__checkbox.is-selected .form__checkbox__default { \
		display:none; \
	} \
	.' + pBundle.class + ' { \
		background-color: ' + GM_getValue("bundle-1", pBundle.color1) + '; \
		color: ' + GM_getValue("bundle-2", pBundle.color2) + '; \
	} \
	.' + pCard.class + ' { \
		background-color: ' + GM_getValue("card-1", pCard.color1) + '; \
		color: ' + GM_getValue("card-2", pCard.color2) + '; \
	} \
	.' + pAchievement.class + ' { \
		background-color: ' + GM_getValue("achievement-1", pAchievement.color1) + '; \
		color: ' + GM_getValue("achievement-2", pAchievement.color2) + '; \
	} \
	.' + pWishlist.class + ' { \
		background-color: ' + GM_getValue("wishlist-1", pWishlist.color1) + '; \
		color: ' + GM_getValue("wishlist-2", pWishlist.color2) + '; \
	} \
	.' + pLinux.class + ' { \
		background-color: ' + GM_getValue("linux-1", pLinux.color1) + '; \
		color: ' + GM_getValue("linux-2", pLinux.color2) + '; \
	} \
	.' + pMac.class + ' { \
		background-color: ' + GM_getValue("mac-1", pMac.color1) + '; \
		color: ' + GM_getValue("mac-2", pMac.color2) + '; \
	} \
	.' + pEarly.class + ' { \
		background-color: ' + GM_getValue("early-1", pEarly.color1) + '; \
		color: ' + GM_getValue("early-2", pEarly.color2) + '; \
	} \
	.' + pHidden.class + ' { \
		background-color: ' + GM_getValue("hidden-1", pHidden.color1) + '; \
		color: ' + GM_getValue("hidden-2", pHidden.color2) + '; \
	} \
	.' + pOwned.class + ' { \
		background-color: ' + GM_getValue("owned-1", pOwned.color1) + '; \
		color: ' + GM_getValue("owned-2", pOwned.color2) + '; \
	} \
	.' + pIgnored.class + ' { \
		background-color: ' + GM_getValue("ignored-1", pIgnored.color1) + '; \
		color: ' + GM_getValue("ignored-2", pIgnored.color2) + '; \
	} \
';
$("head").append('<style type="text/css">' + myCSS + '</style>');

const THIS_URL = window.location.href;
const TIMEOUT = 0;
const CACHE_TIME = 6*60*60*1000; //6 hours

var cbCards = GM_getValue("cbCards", true);
var cbAchievement = GM_getValue("cbAchievement", true);
var cbBundled = GM_getValue("cbBundled", true);
var cbWishlist = GM_getValue("cbWishlist", true);
var cbLinux = GM_getValue("cbLinux", false);
var cbMac = GM_getValue("cbMac", false);
var cbEarly = GM_getValue("cbEarly", false);
var cbHidden = GM_getValue("cbHidden", true);
var cbOwned = GM_getValue("cbOwned", true);
var cbIgnored = GM_getValue("cbIgnored", false);

var cbTagStyle = GM_getValue("cbTagStyle", 1); //1 = full, 2 = minimalist

var BundledGames = GM_getValue("BundledGames", "");
var BundledCache = GM_getValue("BundledCache", 0);
var UserdataAPI = GM_getValue("UserdataAPI", "");
var UserdataCache = GM_getValue("UserdataCache", 0);
var GameData = GM_getValue("GameData", "");
var PackageData = GM_getValue("PackageData", "");

var rgWishlist, rgOwnedApps, rgOwnedPackages, rgIgnoredApps, rgIgnoredPackages;
var arrBundled;

if(cbBundled && BundledCache < Date.now() - CACHE_TIME) // Check if need to request bundle list from ruphine API
	getBundleList();
else if((cbWishlist || cbOwned || cbIgnored) && UserdataCache < Date.now() - CACHE_TIME) //6 hours. Check if need to request steam user api
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
		var userdata = JSON.parse(UserdataAPI);
		rgWishlist = userdata.rgWishlist;
		rgOwnedApps = userdata.rgOwnedApps;
		rgOwnedPackages = userdata.rgOwnedPackages;
		rgIgnoredApps = userdata.rgIgnoredApps;
		rgIgnoredPackages = userdata.rgIgnoredPackages;

	}
	catch (e) {
		console.log("[SG Game Tags] Invalid json format for UserdataAPI");
		UserdataAPI = ""; GM_setValue("UserdataAPI", "");
		UserdataCache = 0; GM_setValue("UserdataCache", 0);
	}

	if(GameData === "") PrepareJSON();
	else
	{
		GameData = JSON.parse(GameData);
		PackageData = JSON.parse(PackageData);
	}

	var observer;
	var config = {childList: true, attributes: false, characterData: false, subtree: true};
	if(/www.steamgifts.com\/giveaways\/new/.test(THIS_URL)) // process giveaway creation page
		InitGiveawayCreationPage();
	else if(/www.steamgifts.com\/account\/settings\/giveaways$/.test(THIS_URL)) // process giveaway setting page
		initSetting();
	else if(/www.steamgifts.com\/($|giveaways$|giveaways\/search)/.test(THIS_URL)) // homepage and all search active giveaway
	{
		ProcessGiveawayListPage($(".widget-container"));
		// handles element added later by endless scroll, add timeout to delay this function because it is triggered when ext SG runs
		observer = new MutationObserver(function(mutations)
		{
			$.each(mutations, function(index, mutation){
				ProcessGiveawayListPage(mutation.addedNodes);
			});
		});
		$(".widget-container>div").each(function(index, element){
			observer.observe(element, config);
		});

		if($(".featured__inner-wrap .global__image-outer-wrap--missing-image").length === 0 && $(".featured__inner-wrap a img").length > 0)
			ProcessFeaturedGiveaway($(".featured__inner-wrap a img")[0].src);
	}
	// user profile & group page excluding user trade and feedback and excluding group users, stats, and wishlist
	else if(/www.steamgifts.com\/(user|group)\//.test(THIS_URL) && !/user\/\w+\/(feedback|trade)/.test(THIS_URL) && !/group\/\w+\/\w+\/(users|stats|wishlist)/.test(THIS_URL)) // exclude some pages
	{
		ProcessGiveawayListPage($(".widget-container"));
		// handles element added later by endless scroll, add timeout to delay this function because it is triggered when ext SG runs
		observer = new MutationObserver(function(mutations)
		{
			$.each(mutations, function(index, mutation){
				ProcessGiveawayListPage(mutation.addedNodes);
			});
		});
		$(".widget-container>div").each(function(index, element){
			observer.observe(element, config);
		});

		if($(".featured__inner-wrap .global__image-outer-wrap--missing-image").length === 0 && $(".featured__inner-wrap a img").length > 0)
			ProcessFeaturedGiveaway($(".featured__inner-wrap a img")[0].src);
	}
	else if(/www.steamgifts.com\/giveaway\//.test(THIS_URL)) // giveaway page https://www.steamgifts.com/giveaway/FGbTw/left-4-dead-2
		ProcessFeaturedGiveaway($(".featured__inner-wrap a")[0].href);

	// https://www.steamgifts.com/sales*
	// https://www.steamgifts.com/sales/account/steam/games
	// https://www.steamgifts.com/sales/account/steam/wishlist
	// https://www.steamgifts.com/giveaways/created
	// https://www.steamgifts.com/giveaways/entered
	// https://www.steamgifts.com/giveaways/won
	// https://www.steamgifts.com/giveaways/wishlist
	// https://www.steamgifts.com/account/settings/giveaways/filters
	else if(/www.steamgifts.com\/(sales|account\/steam\/(games|wishlist)|giveaways\/(created|entered|won|wishlist)|account\/settings\/giveaways\/filters|group\/\w+\/\w+\/wishlist)/.test(THIS_URL))
	{
		ProcessGameListPage($(".widget-container"));
		observer = new MutationObserver(function(mutations)
		{
			$.each(mutations, function(index, mutation){
				ProcessGameListPage(mutation.addedNodes);
			});
		});
		$(".widget-container>div").each(function(index, element){
			observer.observe(element, config);
		});
	}

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

function ProcessGiveawayListPage(parent) // giveaways list with creator name
{
	if(cbBundled || cbCards || cbAchievement || cbHidden || cbWishlist || cbLinux || cbMac || cbEarly) // check if at least one tag enabled
	{
		$(parent).find(".giveaway__row-inner-wrap").each(function(index, element)
		{
			var URL = $(element).find("a.giveaway__icon").attr("href");
			if(URL !== undefined)
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

function ProcessGameListPage(parent) // giveaways / games list
{
	if(cbBundled || cbCards || cbAchievement || cbHidden || cbWishlist || cbLinux || cbMac || cbEarly) // check if at least one tag enabled
	{
		$(parent).find(".table__row-inner-wrap").each(function(index, element)
		{
			var URL;
			if(/www.steamgifts.com\/account\/settings\/giveaways\/filters/.test(THIS_URL))
				URL = $(element).find("a.table__column__secondary-link").text();
			else
				URL = $($(element).find(".global__image-inner-wrap")[0]).css('background-image');

			if(URL !== undefined)
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

	var tagBundle, tagCard, tagAchievement, tagWishlist, tagLinux, tagMac, tagEarly, tagHidden, tagOwned, tagIgnored, tagOther;
	if(cbTagStyle == 1)
	{
		tagBundle      = createTag(pBundle.class, pBundle.title, pBundle.text, pBundle.link+Name, Target);
		tagCard        = createTag(pCard.class, pCard.title, pCard.text, pCard.link+ID, tagBundle);
		tagAchievement = createTag(pAchievement.class, pAchievement.title, pAchievement.text, pAchievement.link+ID+"/achievements/", tagCard);
		tagWishlist    = createTag(pWishlist.class, pWishlist.title, pWishlist.text, pWishlist.link+Name, tagAchievement);
		tagLinux       = createTag(pLinux.class, pLinux.title, pLinux.text, linkStore, tagWishlist);
		tagMac         = createTag(pMac.class, pMac.title, pMac.text, linkStore, tagLinux);
		tagEarly       = createTag(pEarly.class, pEarly.title, pEarly.text, linkStore, tagMac);
		tagOwned       = createTag(pOwned.class, pOwned.title, pOwned.text, linkStore, tagEarly);
		tagIgnored     = createTag(pIgnored.class, pIgnored.title, pIgnored.text, linkStore, tagOwned);
		// tagOther       = createTag(pIgnored.class, pIgnored.title, pIgnored.text, linkStore, tagEarly);
	}
	else
	{
		tagBundle      = createTag(pBundle.class + " minimalist", pBundle.title, pBundle.min, pBundle.link+Name, Target);
		tagCard        = createTag(pCard.class + " minimalist", pCard.title, pCard.min, pCard.link+ID, Target);
		tagAchievement = createTag(pAchievement.class + " minimalist", pAchievement.title, pAchievement.min, pAchievement.link+ID+"/achievements/", Target);
		tagWishlist    = createTag(pWishlist.class + " minimalist", pWishlist.title, pWishlist.min, pWishlist.link+Name, Target);
		tagLinux       = createTag(pLinux.class + " minimalist", pLinux.title, pLinux.min, linkStore, Target);
		tagMac         = createTag(pMac.class + " minimalist", pMac.title, pMac.min, linkStore, Target);
		tagEarly       = createTag(pEarly.class + " minimalist", pEarly.title, pEarly.min, linkStore, Target);
		tagOwned       = createTag(pOwned.class + " minimalist", pOwned.title, pOwned.min, linkStore, Target);
		tagIgnored     = createTag(pIgnored.class + " minimalist", pIgnored.title, pIgnored.min, linkStore, Target);
		// tagOther       = createTag(pIgnored.class + " minimalist", pIgnored.title, pIgnored.min, linkStore, Target);
	}

	if(/www.steamgifts.com\/giveaway\//.test(THIS_URL)) //only trigger inside giveaway page, no need for homepage
	{
		if(cbTagStyle == 1)
			tagHidden = createTag(pHidden.class, pHidden.title, pHidden.text, pHidden.link+Name, tagIgnored);
		else if(cbTagStyle == 2)
			tagHidden = createTag(pHidden.class + " minimalist", pHidden.title, pHidden.min, pHidden.link+Name, Target);

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
	if(cbBundled && BundledGames !== "")
		getBundleStatus(ID, type, tagBundle);
	if(UserdataAPI !== "")
	{
		if(cbWishlist)
			getWishlistStatus(ID, tagWishlist);
		if(cbOwned)
			getOwnedStatus(ID, tagOwned, (type == 'app'));
		if(cbIgnored)
			getIgnoredStatus(ID, tagIgnored, (type == 'app'));
	}
}

function createTag(_class, title, text, href, divTarget)
{
	var tag = document.createElement("a");
	tag.setAttribute("target", "_blank");
	tag.setAttribute("class", "tags "+ _class);
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

function getSteamCategories(appID, tagCard, tagAchievement, tagLinux, tagMac, tagEarly, packID = "0")
{
	var needRequest = false;
	if(GameData[appID] === undefined)
	{
		var template = {"cards": false, "achievement": false, "mac": false, "linux": false, "early_access": false, "last_checked": 0, "game": appID+""};
		GameData[appID] = template;
		needRequest = true;
	}
	else
	{
		var data = GameData[appID];
		if(cbCards && data.cards)
		{
			displayElems(tagCard);
			tagCard.setAttribute("href", pCard.link+GameData[appID].game);
		}
		if(cbAchievement && data.achievement)
		{
			displayElems(tagAchievement);
			tagAchievement.setAttribute("href", pAchievement.link+GameData[appID].game+"/achievements/");
		}
		if(cbMac && data.mac) displayElems(tagMac);
		if(cbLinux && data.linux) displayElems(tagLinux);

		if(data.last_checked < (Date.now() - (24 * 60 * 60 * 1000))) // 24 hours have passed since last checked
		{
			if((!data.cards && cbCards) || (!data.achievement && cbAchievement) || (!data.mac && cbMac ) || (!data.linux && cbLinux) || (data.early_access && cbEarly))
				needRequest = true;
		}
		else if(data.early_access && cbEarly) displayElems(tagEarly);
	}
	if(needRequest)
	{
		var link = linkGameAPI+appID;
		if(GameData[appID].last_checked !== 0) link += "&filters=categories,platforms,genres";
		// console.log("[SG Game Tags] requesting " + linkGameAPI+appID);

		GM_xmlhttpRequest({
			method: "GET",
			timeout: 10000,
			url: link,
			onload: function(data)
			{
				var obj = JSON.parse(data.responseText)[appID].data;
				if(obj !== undefined) // undefined = doesn't have store page or doesn't exist
				// get steam apps categories : achievement, trading cards, etc
				{
					if(GameData[appID].last_checked === 0)
					{
						if (obj.type != "game")
						{
							GameData[appID].game = obj.fullgame.appid;
							tagCard.setAttribute("href", pCard.link+obj.fullgame.appid);
							tagAchievement.setAttribute("href", pAchievement.link+obj.fullgame.appid+"/achievements/");
						}
						else if(packID != "0" && PackageData[packID].games.indexOf(appID) == -1)
							PackageData[packID].games.push(appID);
					}

					var categories = obj.categories;
					if(categories !== undefined)
					{
						var catCards = $.grep(categories, function(e){ return e.id == "29"; });
						if(catCards.length > 0)
						{
							if(cbCards) displayElems(tagCard);
							GameData[appID].cards = true;
							if(packID != "0")
							{
								PackageData[packID].cards = true;
								if(PackageData[packID].games.length > 1)
									tagCard.setAttribute("href", "http://ruphine.esy.es/steamgifts/TradingCard.php?packageid="+packID);
								else
									tagCard.setAttribute("href", pCard.link+PackageData[packID].games[0]);
							}
						}

						var catAchievement = $.grep(categories, function(e){ return e.id == "22"; });
						if(catAchievement.length > 0)
						{
							if(cbAchievement) displayElems(tagAchievement);
							GameData[appID].achievement = true;
							if(packID != "0")
							{
								PackageData[packID].achievement = true;
								if(PackageData[packID].games.length > 1)
									tagAchievement.setAttribute("href", "http://ruphine.esy.es/steamgifts/Achievement.php?packageid="+packID);
								else
									tagAchievement.setAttribute("href", pAchievement.link+PackageData[packID].games[0]+"/achievements/");
							}
						}
					}

					// get steam apps platforms: linux: boolean, mac: boolean
					var platforms = obj.platforms;
					if(platforms.linux)
					{
						if(cbLinux) displayElems(tagLinux);
						GameData[appID].linux = true;
						if(packID != "0") PackageData[packID].linux = true;
					}
					if(platforms.mac)
					{
						if(cbMac) displayElems(tagMac);
						GameData[appID].mac = true;
						if(packID != "0") PackageData[packID].mac = true;
					}

					// get steam apps genres
					if(obj.genres !== undefined)
					{
						var genEarly = $.grep(obj.genres, function(e){ return e.id == "70"; });
						if(genEarly.length > 0)
						{
							if(cbEarly) displayElems(tagEarly);
							GameData[appID].early_access = true;
							if(packID != "0") PackageData[packID].early_access = true;
						}
						else
						{
							GameData[appID].early_access = false;
							if(packID != "0") PackageData[packID].early_access = false;
						}
					}
				}
				GameData[appID].last_checked = Date.now();
				GM_setValue("GameData", JSON.stringify(GameData));

				if(packID != "0")
				{
					PackageData[packID].last_checked = Date.now();
					GM_setValue("PackageData", JSON.stringify(PackageData));
				}
			},
			ontimeout: function(data)
			{
				console.log("[SG Game Tags] Request " + linkGameAPI+appID + " Timeout");
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
		tag.setAttribute("title", pBundle.title+Game[0].BundledDate);
	}
}

function getBundleList()
{
	// console.log("[SG Game Tags] requesting " + linkBundleAPI);
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

			if((cbWishlist || cbOwned || cbIgnored) && UserdataCache < Date.now() - CACHE_TIME)
				getUserdata();
		},
		ontimeout: function(data)
		{
			console.log("[SG Game Tags] Request " + linkBundleAPI + " Timeout");
			if((cbWishlist || cbOwned || cbIgnored) && UserdataCache < Date.now() - CACHE_TIME)
				getUserdata();
		}
	});
}

function getUserdata()
{
	// console.log("[SG Game Tags] requesting " + linkUserAPI);
	GM_xmlhttpRequest({
		method: "GET",
		timeout: 10000,
		url: linkUserAPI,
		onload: function(data)
		{
			var result = JSON.parse(data.responseText);
			if(result.rgOwnedApps.length !== 0) //check if user logged in
			{
				UserdataAPI = data.responseText;
				GM_setValue("UserdataAPI", UserdataAPI);

				UserdataCache = Date.now();
				GM_setValue("UserdataCache", UserdataCache);
			}
			else
				console.log("[SG Game Tags] Unable to get user's steam data. User is not logged in to steam.");

			main();
		},
		ontimeout: function(data)
		{
			console.log("[SG Game Tags] Request " + linkUserAPI + " Timeout");
			main();
		}
	});
}

function getHiddenStatus(appID, appName, elems)
{
	if(cbHidden)
	{
		// console.log("[SG Game Tags] requesting " + pHidden.link+appName);
		$.get(pHidden.link+appName, function(data)
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

function getOwnedStatus(appID, elems, isApp)
{
	appID = parseInt(appID);
	if(isApp && rgOwnedApps.indexOf(appID) >= 0)
		displayElems(elems);
	else if(!isApp && rgOwnedPackages.indexOf(appID) >= 0)
		displayElems(elems);
}

function getIgnoredStatus(appID, elems, isApp)
{
	appID = parseInt(appID);
	if(isApp && rgIgnoredApps.indexOf(appID) >= 0)
		displayElems(elems);
	else if(!isApp && rgIgnoredPackages.indexOf(appID) >= 0)
		displayElems(elems);
}

function getSteamCategoriesFromPackage(packID, tagCard, tagAchievement, tagLinux, tagMac, tagEarly)
{
	var needRequest = false;
	if(PackageData[packID] === undefined || PackageData[packID].games === undefined)
	{
		var template = {"cards": false, "achievement": false, "mac": false, "linux": false, "early_access": false, "last_checked": 0, "games":[]};
		PackageData[packID] = template;
		needRequest = true;
	}
	else
	{
		var data = PackageData[packID];
		if(cbCards && data.cards)
		{
			displayElems(tagCard);
			if(data.games.length > 1)
			{
				tagCard.setAttribute("href", "http://ruphine.esy.es/steamgifts/TradingCard.php?packageid="+packID);
				tagCard.setAttribute("title", "There is " + data.games.length + " games in this package, and at least one of them have trading cards");
			}
			else
				tagCard.setAttribute("href", pCard.link+data.games[0]);
		}
		if(cbAchievement && data.achievement)
		{
			displayElems(tagAchievement);
			if(data.games.length > 1)
			{
				tagAchievement.setAttribute("href", "http://ruphine.esy.es/steamgifts/Achievement.php?packageid="+packID);
				tagAchievement.setAttribute("title", "There is " + data.games.length + " games in this package, and at least one of them have achievements");
			}
			else
				tagAchievement.setAttribute("href", pAchievement.link+data.games[0]+"/achievements/");
		}
		if(cbMac && data.mac) displayElems(tagMac);
		if(cbLinux && data.linux) displayElems(tagLinux);
		if(cbEarly && data.early_access) displayElems(tagEarly);

		if(data.last_checked < (Date.now() - (24 * 60 * 60 * 1000))) // 24 hours have passed since last checked
		{
			if((!data.cards && cbCards) || (!data.achievement && cbAchievement) || (!data.mac && cbMac ) || (!data.linux && cbLinux) || (data.early_access && cbEarly))
				needRequest = true;
		}
	}
	if(needRequest)
	{
		// console.log("[SG Game Tags] requesting " + linkPackAPI+packID);
		GM_xmlhttpRequest({
			method: "GET",
			timeout: 10000,
			url: linkPackAPI+packID,
			onload: function(data)
			{
				var IDs = JSON.parse(data.responseText)[packID].data;
				if(IDs === undefined)
				{
					PackageData[packID].cards = false;
					PackageData[packID].achievement = false;
					PackageData[packID].mac = false;
					PackageData[packID].linux = false;
					PackageData[packID].early_access = false;
					PackageData[packID].games = [];
					PackageData[packID].last_checked = Date.now();
					GM_setValue("PackageData", JSON.stringify(PackageData));
				}
				else
				{
					IDs = IDs.apps;
					$.each(IDs, function(index)
					{
						getSteamCategories(IDs[index].id, tagCard, tagAchievement, tagLinux, tagMac, tagEarly, packID);
					});
				}
			},
			ontimeout: function(data)
			{
				console.log("[SG Game Tags] Request " + linkPackAPI+packID + " Timeout");
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
function InitGiveawayCreationPage()
{
	if($(".js__autocomplete-data").length > 0)
	{
		var observer = new MutationObserver(function(mutations)
		{
			$(".tags").remove();
			var table = $(mutations[0].addedNodes).find(".table__row-inner-wrap");
			$(table).each(function(index, element)
			{
				var url = $(element).find("a.table__column__secondary-link").text();
				var ID = getAppIDfromLink(url);
				var Name = $(element).find(".table__column__heading").text();
				var Target = $(element).find(".table__column--width-fill");

				var tagBundle = createTag(pBundle.class, pBundle.title, pBundle.text, pBundle.link+Name, Target);
				$(tagBundle).css("float", "right");

				var type = isApp(url) ? 'app' : 'sub';
				getBundleStatus(ID, type, tagBundle);
			});
			$(table).on("click", function(event)
			{
				var url = $(this).find("a.table__column__secondary-link").text();
				var ID = getAppIDfromLink(url);
				var Name = $(this).find(".table__column__heading").text();
				var Target = $(".js__autocomplete-name")[0];
				tagBundle = createTag(pBundle.class, pBundle.title, pBundle.text, pBundle.link+Name, Target);
				var type = isApp(url) ? 'app' : 'sub';
				getBundleStatus(ID, type, tagBundle);
			});
		});
		var config = {childList: true, attributes: false, characterData: false};
		observer.observe($(".js__autocomplete-data")[0], config);
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

		var form__heading = ' \
			<div class="form__heading"> \
				<div class="form__heading__number">' + no + '.</div> \
				<div class="form__heading__text" title="If you have performance issues, try disable tags you don\'t need"> \
					[SG Game Tags] Which tags do you want to see? \
				</div> \
			</div>';

		var form__row__indent = document.createElement("div");
		form__row__indent.setAttribute("class", "form__row__indent");

			var form__checkbox_1 = createCheckBox("my__checkbox", CheckIcon + pBundle.text, cbBundled);
			var form__checkbox_2 = createCheckBox("my__checkbox", CheckIcon + pCard.text, cbCards);
			var form__checkbox_3 = createCheckBox("my__checkbox", CheckIcon + pAchievement.text, cbAchievement);
			var form__checkbox_4 = createCheckBox("my__checkbox", CheckIcon + pHidden.text, cbHidden);
			var form__checkbox_5 = createCheckBox("my__checkbox", CheckIcon + pWishlist.text, cbWishlist);
			var form__checkbox_6 = createCheckBox("my__checkbox", CheckIcon + pLinux.text, cbLinux);
			var form__checkbox_7 = createCheckBox("my__checkbox", CheckIcon + pMac.text, cbMac);
			var form__checkbox_8 = createCheckBox("my__checkbox", CheckIcon + pEarly.text, cbEarly);
			var form__checkbox_9 = createCheckBox("my__checkbox", CheckIcon + pOwned.text, cbOwned);
			var form__checkbox10 = createCheckBox("my__checkbox", CheckIcon + pIgnored.text, cbIgnored);

			$(form__checkbox_1).click(function(){toggleCBTags(form__checkbox_1, "cbBundled");});
			$(form__checkbox_2).click(function(){toggleCBTags(form__checkbox_2, "cbCards");});
			$(form__checkbox_3).click(function(){toggleCBTags(form__checkbox_3, "cbAchievement");});
			$(form__checkbox_4).click(function(){toggleCBTags(form__checkbox_4, "cbHidden");});
			$(form__checkbox_5).click(function(){toggleCBTags(form__checkbox_5, "cbWishlist");});
			$(form__checkbox_6).click(function(){toggleCBTags(form__checkbox_6, "cbLinux");});
			$(form__checkbox_7).click(function(){toggleCBTags(form__checkbox_7, "cbMac");});
			$(form__checkbox_8).click(function(){toggleCBTags(form__checkbox_8, "cbEarly");});
			$(form__checkbox_9).click(function(){toggleCBTags(form__checkbox_9, "cbOwned");});
			$(form__checkbox10).click(function(){toggleCBTags(form__checkbox10, "cbIgnored");});

		$(form__row__indent)
			.append(form__checkbox_1)
			.append(form__checkbox_2)
			.append(form__checkbox_3)
			.append(form__checkbox_4)
			.append(form__checkbox_5)
			.append(form__checkbox_6)
			.append(form__checkbox_7)
			.append(form__checkbox_8)
			.append(form__checkbox_9)
			.append(form__checkbox10);

	$(form__row).append(form__heading).append(form__row__indent).insertBefore(".js__submit-form");

	var desc = '<div class="form__input-description">No need to press Save Changes button. It is automatically saved when the value changed.</div>';
	$(form__row__indent).append(desc);

	changeCBColor();
}

function initTagPositionSetting(no)
{
	var CheckIcon = '<i class="form__checkbox__default fa fa-circle-o"></i><i class="form__checkbox__hover fa fa-circle"></i><i class="form__checkbox__selected fa fa-check-circle"></i>';
	var form__row = document.createElement("div");
	form__row.setAttribute("class", "form__row");

		var form__heading =' \
			<div class="form__heading"> \
				<div class="form__heading__number">' + no + '.</div> \
				<div class="form__heading__text" title="This setting doesn\'t affect performance, only visual change."> \
					[SG Game Tags] Tags Style \
				</div> \
			</div>';

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

					$("."+pBundle.class).text(pBundle.text);
					$("."+pCard.class).text(pCard.text);
					$("."+pAchievement.class).text(pAchievement.text);
					$("."+pWishlist.class).text(pWishlist.text);
					$("."+pLinux.class).text(pLinux.text);
					$("."+pMac.class).text(pMac.text);
					$("."+pEarly.class).text(pEarly.text);
					$("."+pHidden.class).text(pHidden.text);
					$("."+pOwned.class).text(pOwned.text);
					$("."+pIgnored.class).text(pIgnored.text);
				}
			);
			$(form__checkbox_2).click(
				function()
				{
					$(form__checkbox_1).removeClass("is-selected").addClass("is-disabled");
					$(form__checkbox_2).removeClass("is-disabled").addClass("is-selected");
					GM_setValue("cbTagStyle", 2);

					$("."+pBundle.class).text(pBundle.min);
					$("."+pCard.class).text(pCard.min);
					$("."+pAchievement.class).text(pAchievement.min);
					$("."+pWishlist.class).text(pWishlist.min);
					$("."+pLinux.class).text(pLinux.min);
					$("."+pMac.class).text(pMac.min);
					$("."+pEarly.class).text(pEarly.min);
					$("."+pHidden.class).text(pHidden.min);
					$("."+pOwned.class).text(pOwned.min);
					$("."+pIgnored.class).text(pIgnored.min);
				}
			);

		$(form__row__indent).append(form__checkbox_1).append(form__checkbox_2);

	$(form__row).append(form__heading).append(form__row__indent).insertBefore(".js__submit-form");

	var desc = '<div class="form__input-description">No need to press Save Changes button. It is automatically saved when the value changed.</div>';
	$(form__row__indent).append(desc);
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
		cbValue = cbCards = !cbCards;
	else if(cbName == "cbAchievement")
		cbValue = cbAchievement = !cbAchievement;
	else if(cbName == "cbBundled")
		cbValue = cbBundled = !cbBundled;
	else if(cbName == "cbHidden")
		cbValue = cbHidden = !cbHidden;
	else if(cbName == "cbWishlist")
		cbValue = cbWishlist = !cbWishlist;
	else if(cbName == "cbLinux")
		cbValue = cbLinux = !cbLinux;
	else if(cbName == "cbMac")
		cbValue = cbMac = !cbMac;
	else if(cbName == "cbEarly")
		cbValue = cbEarly = !cbEarly;
	else if(cbName == "cbOwned")
		cbValue = cbOwned = !cbOwned;
	else if(cbName == "cbIgnored")
		cbValue = cbIgnored = !cbIgnored;

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
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.css" />';
	$("head").append(require);

	var form__row = ' \
		<div class="form__row"> \
			<div class="form__heading"> \
				<div class="form__heading__number">' + no + '.</div> \
				<div class="form__heading__text">[SG Game Tags] Customized tags color</div> \
			</div> \
			<div class="form__row__indent"> \
				<div class="row"> \
					<input type="text" class="colorpicker" id="bundle-1"/> \
					<input type="text" class="colorpicker" id="bundle-2"/> \
					<div class="markdown"><a class="default_bundle">Default</a></div> \
					<div class="preview-tags"><a class="tags ' + pBundle.class + '" style="display: inline-block;">' + pBundle.text + '</a></div> \
				</div> \
				<div class="row"> \
					<input type="text" class="colorpicker" id="card-1"/> \
					<input type="text" class="colorpicker" id="card-2"/> \
					<div class="markdown"><a class="default_card">Default</a></div> \
					<div class="preview-tags"><a class="tags ' + pCard.class + '" style="display: inline-block;">' + pCard.text + '</a></div> \
				</div> \
				<div class="row"> \
					<input type="text" class="colorpicker" id="achievement-1"/> \
					<input type="text" class="colorpicker" id="achievement-2"/> \
					<div class="markdown"><a class="default_achievement">Default</a></div> \
					<div class="preview-tags"><a class="tags ' + pAchievement.class + '" style="display: inline-block;">' + pAchievement.text + '</a></div> \
				</div> \
				<div class="row"> \
					<input type="text" class="colorpicker" id="wishlist-1"/> \
					<input type="text" class="colorpicker" id="wishlist-2"/> \
					<div class="markdown"><a class="default_wishlist">Default</a></div> \
					<div class="preview-tags"><a class="tags ' + pWishlist.class + '" style="display: inline-block;">' + pWishlist.text + '</a></div> \
				</div> \
				<div class="row"> \
					<input type="text" class="colorpicker" id="hidden-1"/> \
					<input type="text" class="colorpicker" id="hidden-2"/> \
					<div class="markdown"><a class="default_hidden">Default</a></div> \
					<div class="preview-tags"><a class="tags ' + pHidden.class + '" style="display: inline-block;">' + pHidden.text + '</a></div> \
				</div> \
				<div class="row"> \
					<input type="text" class="colorpicker" id="linux-1"/> \
					<input type="text" class="colorpicker" id="linux-2"/> \
					<div class="markdown"><a class="default_linux">Default</a></div> \
					<div class="preview-tags"><a class="tags ' + pLinux.class + '" style="display: inline-block;">' + pLinux.text + '</a></div> \
				</div> \
				<div class="row"> \
					<input type="text" class="colorpicker" id="mac-1"/> \
					<input type="text" class="colorpicker" id="mac-2"/> \
					<div class="markdown"><a class="default_mac">Default</a></div> \
					<div class="preview-tags"><a class="tags ' + pMac.class + '" style="display: inline-block;">' + pMac.text + '</a></div> \
				</div> \
				<div class="row"> \
					<input type="text" class="colorpicker" id="early-1"/> \
					<input type="text" class="colorpicker" id="early-2"/> \
					<div class="markdown"><a class="default_early">Default</a></div> \
					<div class="preview-tags"><a class="tags ' + pEarly.class + '" style="display: inline-block;">' + pEarly.text + '</a></div> \
				</div> \
				<div class="row"> \
					<input type="text" class="colorpicker" id="owned-1"/> \
					<input type="text" class="colorpicker" id="owned-2"/> \
					<div class="markdown"><a class="default_owned">Default</a></div> \
					<div class="preview-tags"><a class="tags ' + pOwned.class + '" style="display: inline-block;">' + pOwned.text + '</a></div> \
				</div> \
				<div class="row"> \
					<input type="text" class="colorpicker" id="other-1"/> \
					<input type="text" class="colorpicker" id="other-2"/> \
					<div class="markdown"><a class="default_other">Default</a></div> \
					<div class="preview-tags"><a class="tags ' + pIgnored.class + '" style="display: inline-block;">' + pIgnored.text + '</a></div> \
				</div> \
				<div class="form__input-description">No need to press Save Changes button. It is automatically saved when colorpicker closed.</div>\
			</div> \
		</div>';

	$(form__row).insertBefore(".js__submit-form");

	if(cbTagStyle == 2) // change tags if minimalist selected
	{
		$("."+pBundle.class).text(pBundle.min);
		$("."+pCard.class).text(pCard.min);
		$("."+pAchievement.class).text(pAchievement.min);
		$("."+pWishlist.class).text(pWishlist.min);
		$("."+pLinux.class).text(pLinux.min);
		$("."+pMac.class).text(pMac.min);
		$("."+pEarly.class).text(pEarly.min);
		$("."+pHidden.class).text(pHidden.min);
		$("."+pOwned.class).text(pOwned.min);
		$("."+pIgnored.class).text(pIgnored.min);
	}

	initColorpicker("bundle-1", GM_getValue("bundle-1", pBundle.color1), pBundle.class, "background-color");
	initColorpicker("bundle-2", GM_getValue("bundle-2", pBundle.color2), pBundle.class, "color");
	initColorpicker("card-1", GM_getValue("card-1", pCard.color1), pCard.class, "background-color");
	initColorpicker("card-2", GM_getValue("card-2", pCard.color2), pCard.class, "color");
	initColorpicker("achievement-1", GM_getValue("achievement-1", pAchievement.color1), pAchievement.class, "background-color");
	initColorpicker("achievement-2", GM_getValue("achievement-2", pAchievement.color2), pAchievement.class, "color");
	initColorpicker("wishlist-1", GM_getValue("wishlist-1", pWishlist.color1), pWishlist.class, "background-color");
	initColorpicker("wishlist-2", GM_getValue("wishlist-2", pWishlist.color2), pWishlist.class, "color");
	initColorpicker("linux-1", GM_getValue("linux-1", pLinux.color1), pLinux.class, "background-color");
	initColorpicker("linux-2", GM_getValue("linux-2", pLinux.color2), pLinux.class, "color");
	initColorpicker("mac-1", GM_getValue("mac-1", pMac.color1), pMac.class, "background-color");
	initColorpicker("mac-2", GM_getValue("mac-2", pMac.color2), pMac.class, "color");
	initColorpicker("early-1", GM_getValue("early-1", pEarly.color1), pEarly.class, "background-color");
	initColorpicker("early-2", GM_getValue("early-2", pEarly.color2), pEarly.class, "color");
	initColorpicker("hidden-1", GM_getValue("hidden-1", pHidden.color1), pHidden.class, "background-color");
	initColorpicker("hidden-2", GM_getValue("hidden-2", pHidden.color2), pHidden.class, "color");
	initColorpicker("owned-1", GM_getValue("owned-1", pOwned.color1), pOwned.class, "background-color");
	initColorpicker("owned-2", GM_getValue("owned-2", pOwned.color2), pOwned.class, "color");
	initColorpicker("other-1", GM_getValue("other-1", pIgnored.color1), pIgnored.class, "background-color");
	initColorpicker("other-2", GM_getValue("other-2", pIgnored.color2), pIgnored.class, "color");

	$(".default_bundle").click(function(){clickDefaultColor("bundle", pBundle);});
	$(".default_card").click(function(){clickDefaultColor("card", pCard);});
	$(".default_achievement").click(function(){clickDefaultColor("achievement", pAchievement);});
	$(".default_wishlist").click(function(){clickDefaultColor("wishlist", pWishlist);});
	$(".default_linux").click(function(){clickDefaultColor("linux", pLinux);});
	$(".default_mac").click(function(){clickDefaultColor("mac", pMac);});
	$(".default_early").click(function(){clickDefaultColor("early", pEarly);});
	$(".default_hidden").click(function(){clickDefaultColor("hidden", pHidden);});
	$(".default_owned").click(function(){clickDefaultColor("owned", pOwned);});
	$(".default_other").click(function(){clickDefaultColor("other", pIgnored);});
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
			[pBundle.color1, pCard.color1, pAchievement.color1, pWishlist.color1, pHidden.color1, pLinux.color1, pMac.color1, pEarly.color1, pOwned.color1, pIgnored.color1],
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

function clickDefaultColor(name, tagprop)
{
	GM_setValue(name+"-1", tagprop.color1);
	GM_setValue(name+"-2", tagprop.color2);
	$("."+tagprop.class).css("background-color", tagprop.color1).css("color", tagprop.color2);
	$("#"+name+"-1").spectrum("set", tagprop.color1);
	$("#"+name+"-2").spectrum("set", tagprop.color2);
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
		</a>';
	var dropdown = $(".nav__right-container .nav__absolute-dropdown .nav__row");
	$(dropdown[2]).before(shortcut); // just before logout button
}