// ==UserScript==
// @name         SGTags
// @namespace    http://steamcommunity.com/id/Ruphine/
// @version      0.1
// @description  Shows some tags of the game in Steamgifts.
// @author       Ruphine

// @include      *www.steamgifts.com/
// @include      *www.steamgifts.com/giveaway/*
// @include      *www.steamgifts.com/giveaways/search?*
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


/* Global Variables */
var SCE = "http://www.steamcardexchange.net/index.php?inventorygame-appid-";
var SGBundle = "http://www.steamgifts.com/bundle-games/search?q="

var tCardTitle = "This game has trading cards";
var tBundleTitle = "This game is considered as bundled by Steamgifts";

var featuredGameID = $(".global__image-outer-wrap").attr("href");

var featuredGameName = $(".featured__heading__medium").text();

var tCards = document.createElement('a');
tCards.setAttribute("href", featuredGameID);
tCards.setAttribute("id", "tags");
tCards.setAttribute("class", "tcards");
tCards.setAttribute("target", "_blank");
tCards.setAttribute("title", tCardTitle);
tCards.innerHTML = "Trading Cards";

var tBundle = document.createElement('a');
tBundle.setAttribute("href", SGBundle+featuredGameName);
tBundle.setAttribute("id", "tags");
tBundle.setAttribute("class", "bundle");
tBundle.setAttribute("target", "_blank");
tBundle.setAttribute("title", tBundleTitle);
tBundle.innerHTML = "Bundled";

// $(".giveaway__heading").append(tCards);
// $(".giveaway__heading").append(tBundle);

//TODO: exclude steamgifts.com/user/*
$(".featured__heading").append(tCards);
$(".featured__heading").append(tBundle);