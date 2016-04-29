// ==UserScript==
// @name         SG Game Tags
// @namespace    https://steamcommunity.com/id/Ruphine/
// @version      2.11.6
// @description  Shows some tags of the game in Steamgifts.
// @author       Ruphine

// @include      http://www.steamgifts.com/*
// @include      https://www.steamgifts.com/*
// @connect      steampowered.com
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
			border-radius: 4px; \
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
		.tags-red { background-color: #E9202A; } \
		.tags-blue { background-color: #305AC9; } \
		.tags-purple { background-color: #6600CC; } \
		.tags-brown { background-color: #A0522D; } \
		.tags-linux { background-color: #e67300; } \
		.tags-mac { background-color: #777;} \
		.my__checkbox { \
			cursor:pointer; \
			padding:7px 0 \
		} \
		.my__checkbox i { \
			margin-right:7px \
		} \
		.my__checkbox:not(:last-of-type) { \
			border-bottom:1px dotted #d2d6e0 \
		} \
		.my__checkbox:not(:hover) .form__checkbox__hover,.my__checkbox.is-selected .form__checkbox__hover,.my__checkbox:not(.is-selected) .form__checkbox__selected,.my__checkbox:hover .form__checkbox__default,.my__checkbox.is-selected .form__checkbox__default { \
			display:none \
		} \
	</style>';

$("head").append(myCSS);


/* Constant Variables */
const linkCard = "http://www.steamcardexchange.net/index.php?inventorygame-appid-";
const linkAchievement = "http://steamcommunity.com/stats/"; // 424280/achievements/";
const linkBundle = "https://www.steamgifts.com/bundle-games/search?q=";
const linkHidden = "https://www.steamgifts.com/account/settings/giveaways/filters/search?q=";
const linkWishlist = "https://www.steamgifts.com/account/steam/wishlist/search?q=";

const linkGameAPI = "http://store.steampowered.com/api/appdetails?filters=categories,platforms&appids=";
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

const ClassWishlist = "tags tags-purple";
const TitleWishlist = "This game is in your Steam wishlist";
const TextWishlist = "Wishlist";

const ClassLinux = "tags tags-linux";
const TitleLinux = "Linux supported";
const TextLinux = "Linux";

const ClassMac = "tags tags-mac";
const TitleMac = "Mac supported";
const TextMac = "Mac";

var cbCards = GM_getValue("cbCards", true);
var cbAchievement = GM_getValue("cbAchievement", true);
var cbBundled = GM_getValue("cbBundled", true);
var cbHidden = GM_getValue("cbHidden", true);
var cbWishlist = GM_getValue("cbWishlist", true);
var cbLinux = GM_getValue("cbLinux", true);
var cbMac = GM_getValue("cbMac", true);

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
		else if((currLoc[3] != "user" && currLoc[3] != "group") && ($(".featured__inner-wrap .global__image-outer-wrap--missing-image").length == 0)) //homepage
			url = $(".featured__inner-wrap a img")[0].src;

		if (url != null) //for game without appID e.g Humble Indie Bundle
		{
			var ID = getAppIDfromLink(url);
			var Name = $(".featured__heading__medium").text().substring(0,30);
			Name = Name.replace("+", "%2B").replace("[NEW] ", "").replace("[FREE] ", ""); //remove [NEW] and [FREE] to make it work with ext SG
			var target = $(".featured__heading");

			var tagCard = createTag(ClassCard, TitleCard, TextCard, linkCard+ID, target);
			var tagAchievement = createTag(ClassAchievement, TitleAchievement, TextAchievement, linkAchievement+ID+"/achievements/", tagCard);
			var tagBundle = createTag(ClassBundle, TitleBundle, TextBundle, linkBundle+Name, tagAchievement);
			var tagHidden = createTag(ClassHidden, TitleHidden, TextHidden, linkHidden+Name, tagBundle);
			var tagWishlist = createTag(ClassWishlist, TitleWishlist, TextWishlist, linkWishlist+Name, tagHidden);
			var tagLinux = createTag(ClassLinux, TitleLinux, TextLinux, url, tagWishlist);
			var tagMac = createTag(ClassMac, TitleMac, TextMac, url, tagLinux);

			if(isApp(url))
			{
				getSteamCategories(ID, tagCard, tagAchievement, tagLinux, tagMac);
			}
			else if(isPackage(url))
			{
				tagCard.setAttribute("href", url);
				tagAchievement.setAttribute("href", url);
				getSteamCategoriesFromPackage(ID, tagCard, tagAchievement, tagLinux, tagMac);
			}

			getBundleStatus(ID, Name, tagBundle);

			if(currLoc[3] == "giveaway") //only trigger inside giveaway page, no need for homepage
			{
				getHiddenStatus(ID, Name, tagHidden);
				getWishlistStatus(ID, Name, tagWishlist);
			}
		}
	}
	else if(currLoc[3] == "giveaways" && currLoc[4] == "new") // http://www.steamgifts.com/giveaways/new
	{
		$(".js__autocomplete-data").on("DOMNodeInserted", NewGiveawayDivUpdated);
	}

	// http://www.steamgifts.com/giveaways/*
	// http://www.steamgifts.com/sales/*
	// http://www.steamgifts.com/account/settings/giveaways/filters
	// http://www.steamgifts.com/account/steam/*
	else if((currLoc[3] == "giveaways" && !(/search*/.test(currLoc[4]))) || currLoc[6] == "filters" || currLoc[3] == "sales" || currLoc[4] == "steam")
	{
		$(".table__row-inner-wrap").each(function(index, element)
		{

			var Name = $(element).find(".table__column__heading").text().substring(0,30);
			Name = Name.replace("+", "%2B").replace("[NEW] ", "").replace("[FREE] ", ""); //remove [NEW] and [FREE] to make it work with ext SG
			var target = $(element).find(".table__column--width-fill > :first-child");

			//because sales don't use <p> thus tags will appears in line with title
			if(currLoc[3] == "sales") target.css("display", "block");

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
				var tagLinux = createTag(ClassLinux, TitleLinux, TextLinux, url, tagBundle);
				var tagMac = createTag(ClassMac, TitleMac, TextMac, url, tagLinux);

				if(isApp(url))
				{
					getSteamCategories(ID, tagCard, tagAchievement, tagLinux, tagMac);
				}
				else if(isPackage(url))
				{
					tagCard.setAttribute("href", url);
					tagAchievement.setAttribute("href", url);
					getSteamCategoriesFromPackage(ID, tagCard, tagAchievement, tagLinux, tagMac);
				}

				getBundleStatus(ID, Name, tagBundle);
			}
		});
	}

	//Giveaway Page
	ProcessGiveawayListPage($(".giveaway__row-inner-wrap"));

	// handles element added later by endless scroll
	$(document).on("DOMNodeInserted", ".widget-container", function(e) {
		ProcessGiveawayListPage($(e.target).find(".giveaway__row-inner-wrap"));
	});

	if(window.location.href == "https://www.steamgifts.com/account/settings/giveaways")
		initSetting();
}

// http://www.steamgifts.com/
// http://www.steamgifts.com/giveaways/search*
// http://www.steamgifts.com/user/*
// http://www.steamgifts.com/group/*
function ProcessGiveawayListPage(scope)
{
	$(scope).each(function(index, element)
	{
		var url = $(element).find("a.giveaway__icon").attr("href");
		if(url != null)
		{
			var ID = getAppIDfromLink(url);

			var Name = $(element).find(".giveaway__heading__name").text().substring(0,30);
			Name = Name.replace("+", "%2B").replace("[NEW] ", "").replace("[FREE] ", ""); //remove [NEW] and [FREE] to make it work with ext SG
			var target = $(element).find(".giveaway__heading");

			var tagCard = createTag(ClassCard, TitleCard, TextCard, linkCard+ID, target);
			var tagAchievement = createTag(ClassAchievement, TitleAchievement, TextAchievement, linkAchievement+ID+"/achievements/", tagCard);
			var tagBundle = createTag(ClassBundle, TitleBundle, TextBundle, linkBundle+Name, tagAchievement);
			var tagLinux = createTag(ClassLinux, TitleLinux, TextLinux, url, tagBundle);
			var tagMac = createTag(ClassMac, TitleMac, TextMac, url, tagLinux);

			if(isApp(url))
			{
				getSteamCategories(ID, tagCard, tagAchievement, tagLinux, tagMac);
			}
			else if(isPackage(url))
			{
				tagCard.setAttribute("href", url);
				tagAchievement.setAttribute("href", url);
				getSteamCategoriesFromPackage(ID, tagCard, tagAchievement, tagLinux, tagMac);
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

function getSteamCategories(appID, tagCard, tagAchievement, tagLinux, tagMac)
{
	var jsonCards = GM_getValue("cards-" + appID, "");
	var jsonAchievement = GM_getValue("achievements-" + appID, "");
	var jsonLinux = GM_getValue("linux-" + appID, "");
	var jsonMac = GM_getValue("mac-" + appID, "");

	var reqCard = needRequest(jsonCards);
	var reqAchievement = needRequest(jsonAchievement);
	var reqLinux = needRequest(jsonLinux);
	var reqMac = needRequest(jsonMac);

	if(!reqCard && cbCards) // if app card is saved
	{
		if(JSON.parse(jsonCards).val)
			displayElems(tagCard);
	}
	if(!reqAchievement && cbAchievement) // if app achievement is saved
	{
		if(JSON.parse(jsonAchievement).val)
			displayElems(tagAchievement);
	}
	if(!reqLinux && cbLinux) // if app linux is saved
	{
		if(JSON.parse(jsonLinux).val)
			displayElems(tagLinux);
	}
	if(!reqMac && cbMac) // if app mac is saved
	{
		if(JSON.parse(jsonMac).val)
			displayElems(tagMac);
	}

	if((reqCard && cbCards) || (reqAchievement && cbAchievement) || (reqLinux && cbLinux) || (reqMac && cbMac))
	{
		console.log("request steam " + appID);
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
					saveData("achievements-" + appID, false);
					saveData("linux-" + appID, false);
					saveData("mac-" + appID, false);
				}
				else
				{
					// get steam apps categories : achievement, trading cards, etc
					var categories = obj.categories;
					flagCard = false;
					flagAchievement = false;
					if(categories != null)
					{
						for(i=0; i<categories.length; i++)
						{
							if(categories[i].id == "29" && cbCards)
							{
								displayElems(tagCard);
								saveData("cards-" + appID, true);
								flagCard = true;
							}
							if(categories[i].id == "22" && cbAchievement)
							{
								displayElems(tagAchievement);
								saveData("achievements-" + appID, true);
								flagAchievement = true;
							}
						}
					}
					else
						console.log("apps " + appID + " does not have categories");

					if(reqCard && !flagCard)
						saveData("cards-" + appID, false);
					if(reqAchievement && !flagAchievement)
						saveData("achievements-" + appID, false);

					// get steam apps platforms: linux: boolean, mac: boolean
					var platforms = obj.platforms;
					if(platforms.linux == true && cbLinux)
					{
						displayElems(tagLinux);
						saveData("linux-" + appID, true);
					}
					else
						saveData("linux-" + appID, false);
					if(platforms.mac == true && cbMac)
					{
						displayElems(tagMac);
						saveData("mac-" + appID, true);
					}
					else
						saveData("mac-" + appID, false);
				}
			}
		});
	}
}

function getBundleStatus(appID, appName, elems)
{
	if(cbBundled)
	{
		var jsonBundle = GM_getValue("bundled-" + appID, "");
		if(!needRequest(jsonBundle))
		{
			if(JSON.parse(jsonBundle).val)
				displayElems(elems);
		}
		else
		{
			console.log("request bundle " + appID + " - " + appName);
			$.get( linkBundle+appName, function(data)
			{
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
}

function getHiddenStatus(appID, appName, elems)
{
	if(cbHidden)
	{
		console.log("request hidden " + appID + " - " + appName);
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

function getWishlistStatus(appID, appName, elems)
{
	if(cbWishlist)
	{
		console.log("request wishlist " + appID + " - " + appName);
		$.get(linkWishlist+appName, function(data)
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

function getSteamCategoriesFromPackage(appID, tagCard, tagAchievement, tagLinux, tagMac)
{
	if(cbCards || cbAchievement)
	{
		//TODO: Check if the game is saved, if no then request to steam
		GM_xmlhttpRequest({
			method: "GET",
			timeout: 10000,
			url: linkPackAPI+appID,
			onload: function(data)
			{
				var IDs = JSON.parse(data.responseText)[appID].data;
				if(IDs == null)
				{
					console.log("package " + appID + " does not exist");
					saveData("cards-" + appID, false);
					saveData("achievements-" + appID, false);
					saveData("linux-" + appID, false);
					saveData("mac-" + appID, false);
				}
				else
				{
					IDs = IDs.apps;
					$.each(IDs, function(index)
					{
						getSteamCategories(IDs[index].id, tagCard, tagAchievement, tagLinux, tagMac);
						//TODO : Save appID + false + expire time ke local cache
					});
				}
			}
		});
	}
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

function initSetting()
{
	var n = $(".form__heading").length + 1;
	var CheckIcon = '<i class="form__checkbox__default fa fa-circle-o"></i><i class="form__checkbox__hover fa fa-circle"></i><i class="form__checkbox__selected fa fa-check-circle"></i>';
	var Color_picker = '<div><input id="textColor" type="color" value="" class="form-control" /></div>';

	var form__row_1 = document.createElement("div");
	form__row_1.setAttribute("class", "form__row");

		var form__heading_1 = document.createElement("div");
		form__heading_1.setAttribute("class", "form__heading");

			var form__heading__number_1 = document.createElement("div");
			form__heading__number_1.setAttribute("class", "form__heading__number");
			form__heading__number_1.innerHTML = n + ".";
			n++;

			var form__heading__text_1 = document.createElement("div");
			form__heading__text_1.setAttribute("class", "form__heading__text");
			form__heading__text_1.innerHTML = "[SG Game Tags] Which tags do you want to see?";

		$(form__heading_1).append(form__heading__number_1).append(form__heading__text_1);

		var form__row__indent_1 = document.createElement("div");
		form__row__indent_1.setAttribute("class", "form__row__indent");

			var form__checkbox_1 = createCheckBox("my__checkbox", CheckIcon + "Trading Cards", cbCards);
			var form__checkbox_2 = createCheckBox("my__checkbox", CheckIcon + "Achievements", cbAchievement);
			var form__checkbox_3 = createCheckBox("my__checkbox", CheckIcon + "Bundled", cbBundled);
			var form__checkbox_4 = createCheckBox("my__checkbox", CheckIcon + "Hidden", cbHidden);
			var form__checkbox_5 = createCheckBox("my__checkbox", CheckIcon + "Wishlist", cbWishlist);
			var form__checkbox_6 = createCheckBox("my__checkbox", CheckIcon + "Linux", cbLinux);
			var form__checkbox_7 = createCheckBox("my__checkbox", CheckIcon + "Mac", cbMac);

			$(form__checkbox_1).click(function(){toggleCBTags(form__checkbox_1, "cbCards");});
			$(form__checkbox_2).click(function(){toggleCBTags(form__checkbox_2, "cbAchievement");});
			$(form__checkbox_3).click(function(){toggleCBTags(form__checkbox_3, "cbBundled");});
			$(form__checkbox_4).click(function(){toggleCBTags(form__checkbox_4, "cbHidden");});
			$(form__checkbox_5).click(function(){toggleCBTags(form__checkbox_5, "cbWishlist");});
			$(form__checkbox_6).click(function(){toggleCBTags(form__checkbox_6, "cbLinux");});
			$(form__checkbox_7).click(function(){toggleCBTags(form__checkbox_7, "cbMac");});

		$(form__row__indent_1)
			.append(form__checkbox_1)
			.append(form__checkbox_2)
			.append(form__checkbox_3)
			.append(form__checkbox_4)
			.append(form__checkbox_5)
			.append(form__checkbox_6)
			.append(form__checkbox_7);

	$(form__row_1).append(form__heading_1).append(form__row__indent_1);

	$(".js__submit-form").before(form__row_1);

	var desc = document.createElement("div");
	desc.setAttribute("class", "form__input-description");
	desc.innerHTML = "No need to press Save Changes button. It is automatically saved when the value changed.";
	$(desc).appendTo([form__row__indent_1]);

	changeCBColor();
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