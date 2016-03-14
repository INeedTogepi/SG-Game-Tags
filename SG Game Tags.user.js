// ==UserScript==
// @name         SGTags
// @namespace    http://steamcommunity.com/id/Ruphine/
// @version      0.1
// @description  Shows some tags of the game in Steamgifts.
// @author       Ruphine

// @include      *www.steamgifts.com/*

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
var linkCard = "http://www.steamcardexchange.net/index.php?inventorygame-appid-";
var linkBundle = "http://www.steamgifts.com/bundle-games/search?q="

var tCardTitle = "This game has trading cards";
var tBundleTitle = "This game is considered as bundled by Steamgifts";

/* Create Trading Card Tag */
var tCards = document.createElement('a');
tCards.setAttribute("href", featuredGameID);
tCards.setAttribute("id", "tags");
tCards.setAttribute("class", "tcards");
tCards.setAttribute("target", "_blank");
tCards.setAttribute("title", tCardTitle);
tCards.innerHTML = "Trading Cards";

/* Create Bundle Tag */
var tBundle = document.createElement('a');
tBundle.setAttribute("href", linkBundle+featuredGameName);
tBundle.setAttribute("id", "tags");
tBundle.setAttribute("class", "bundle");
tBundle.setAttribute("target", "_blank");
tBundle.setAttribute("title", tBundleTitle);
tBundle.innerHTML = "Bundled";

/* 
note
www.steamgifts.com/user/* use the same class featured__heading. Need to check if user page, don't show tags.
*/

// $(".giveaway__heading").append(tCards);
// $(".giveaway__heading").append(tBundle);

//TODO: exclude steamgifts.com/user/*
// $(".featured__heading").append(tCards);
// $(".featured__heading").append(tBundle);