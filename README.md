# SG Game Tags

SG Game Tags is a userscript to show tags if the game has trading cards or is bundled by SG.

# [Download](https://greasyfork.org/en/scripts/18047-sg-game-tags)

Currently it doesn't support endless scroll. 

The script requires :
- [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) for Chrome
- [Greasemonkey](https://addons.mozilla.org/en-us/firefox/addon/greasemonkey/) for Firefox
- [Violentmonkey](https://addons.opera.com/en/extensions/details/violent-monkey/) for Opera
- [GreaseKit](http://www.macupdate.com/app/mac/20718/greasekit) for Safari
- recommended 1366px screen width or more.

## Features
- Shows "Cards" tag if the game has trading cards.
- Shows "Bundled" tag if the game is marked as bundled by SG.
- Tags are links. "Cards" tag will open steamcardexchange inventory, and "Bundled" tag will open http://www.steamgifts.com/bundle-games with corresponding game.

## Current Tags
| Tags | Description|
|:---:|---|
| "Bundled" | The game is marked as bundled by Steamgifts. |
| "Cards" | The game has Steam trading cards.  |

## Screenshots
![1](http://i.imgur.com/tBfc60B.png)
![2](http://i.imgur.com/GTlUVjU.png)
![3](http://i.imgur.com/myPzhN2.jpg)

## Changelogs
1.0
- Requested data is now saved. The scripts now assume if the game has trading cards or is bundled, it will always be.
- The script now checks all of the games in package to see if one of them has trading cards.
- Error handling in some pages. The scripts will try to print out error description in console logs. (for advance user).

0.2
- Use GM_xmlhttpRequest instead of cors.io to bypass CORS problem.
- Changed "Trading Cards" to "Cards" for a while because of space problem.

0.1	First Release.

## To Do List
- ~~Save data as cache for better performance and to avoid making too much request to steam and SG.~~ (done)
- ~~Error handling for games that don't have store page or games with packageID instead of appID.~~ (done)
- Add tags in : (They have different style from other giveaway pages and hard to place my tags there)
  - http://www.steamgifts.com/giveaways/created,
  - http://www.steamgifts.com/giveaways/entered, 
  - http://www.steamgifts.com/giveaways/won,
  - http://www.steamgifts.com/account/settings/giveaways/filters
  - http://www.steamgifts.com/giveaways/new (this one might be a even harder)
- Sidebar giveaway filter :
  - Show all / Show games with Trading card only.
  - Show all / Show bundled games / Show Non bundled games.
- Compatibility to endless scroll giveaway list (Easy Steamgifts and some userscripts do this).
- Show steam user reviews score (I'm not sure to implement it in this script. I might make a separate userscript for this)
