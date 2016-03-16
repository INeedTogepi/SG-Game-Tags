// ==UserScript==
// @name         SG Game Tags
// @namespace    http://steamcommunity.com/id/Ruphine/
// @version      0.1
// @description  Shows some tags of the game in Steamgifts.
// @author       Ruphine

// @match        http://www.steamgifts.com/*

// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant		  GM_deleteValue 
// @grant		  GM_getValue 
// @grant		  GM_listValues 
// @grant		  GM_setValue 
// ==/UserScript==

/* CSS */
var myCSS;
myCSS = '<style> \
		#tags { \
			color: #FFFFFF; \
			text-decoration: none; \
			border-radius: 20px; \
			padding-top: 2px; \
			padding-bottom: 2px; \
			padding-left: 5px; \
			padding-right: 5px; \
			font-size: 8pt; \
			margin: 3px; \
			text-shadow: none; \
		} \
		.tcards { background-color: #3AA435; } \
		.bundle { background-color: #f44336; } \
	</style>';

$("head").append(myCSS);


/* Constant Variables */
const linkCard = "http://www.steamcardexchange.net/index.php?inventorygame-appid-";
const linkBundle = "http://www.steamgifts.com/bundle-games/search?q=";
const linkGameAPI = "http://cors.io/?u=http://store.steampowered.com/api/appdetails?appids=";

const SGhome = "http://www.steamgifts.com/";

const regexuser = /http:\/\/www.steamgifts.com\/user\//;

const tCardTitle = "This game has trading cards";
const tBundleTitle = "This game is considered as bundled by Steamgifts";


/* Create Trading Card Tag */
var tCards = document.createElement('a');
tCards.setAttribute("id", "tags");
tCards.setAttribute("class", "tcards");
tCards.setAttribute("target", "_blank");
tCards.setAttribute("title", tCardTitle);
tCards.innerHTML = "Trading Cards";

/* Create Bundle Tag */
var tBundle = document.createElement('a');
tBundle.setAttribute("href", linkBundle);
tBundle.setAttribute("id", "tags");
tBundle.setAttribute("class", "bundle");
tBundle.setAttribute("target", "_blank");
tBundle.setAttribute("title", tBundleTitle);
tBundle.innerHTML = "Bundled";

var currLoc = window.location.href;

main();

function main()
{
	//shows trading card tag in featured game (header)
	if(!regexuser.test(currLoc)) //exclude user page for getting featured appID
	{	
		var ID = getAppIDfromImg($(".global__image-outer-wrap img")[0].src);
		getTradingCardStatus($(".featured__heading"), ID);
	}


	//looping for each games shown
	$(".giveaway__row-inner-wrap").each(function(index, element)
	{
		var ID = getAppIDfromLink($("a.giveaway__icon")[index].href);
		
		getTradingCardStatus($(".giveaway__heading:nth-child(" + index + ")"), ID);
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

function getTradingCardStatus(elems, appID)
{
    $.ajax({
        url: linkGameAPI+appID,
        datatype: "jsonp",
        complete: function(data)
        {
            var obj = JSON.parse(data.responseText)[appID].data.categories;
            for(i=0; i<obj.length; i++)
            {
                if(obj[i].id == "29")
                {
                	tCards.setAttribute("href", linkCard+appID);
                	//console.log($(".giveaway__heading")[index]);
                	//console.log(elems);
                	console.log(appID);
				elems.append(tCards);
				break;
                }
            }
        }
    });
}