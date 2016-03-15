// ==UserScript==
// @name         SG Game Tags
// @namespace    http://steamcommunity.com/id/Ruphine/
// @version      0.1
// @description  Shows some tags of the game in Steamgifts.
// @author       Ruphine

// @include      http://www.steamgifts.com/giveaway/*

// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant        none
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

const tCardTitle = "This game has trading cards";
const tBundleTitle = "This game is considered as bundled by Steamgifts";
const catID = "29";
const type = "jsonp";

const div1 = ".featured__heading";
const div2 = ".giveaway__heading";

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

// global__image-outer-wrap--game-large
//featured__inner-wrap

var ID = getAppID($(".global__image-outer-wrap img")[0].src);

getTradingCardStatus(div1, ID);

function getAppID(link)
{
//	http://cdn.akamai.steamstatic.com/steam/apps/269270/header_292x136.jpg
	var url = link.split("/");
	return url[url.length-2];
}

function getTradingCardStatus(divTarget, appID)
{
    var result = false;
    $.ajax({
        url: linkGameAPI+appID,
        datatype: type,
        complete: function(data)
        {
            var obj = JSON.parse(data.responseText)[appID].data.categories;
            for(i=0; i<obj.length; i++)
            {
                if(obj[i].id == catID)
                {
					tCards.setAttribute("href", linkCard+appID);
                    $(divTarget).append(tCards);
                    break;
                }
            }
        }
    });
}

/* 
note
www.steamgifts.com/user/* use the same class featured__heading. Need to check if user page, don't show tags.
*/

// $(".giveaway__heading").append(tCards);
// $(".giveaway__heading").append(tBundle);

//TODO: exclude steamgifts.com/user/*
// $(".featured__heading").append(tCards);
// $(".featured__heading").append(tBundle);