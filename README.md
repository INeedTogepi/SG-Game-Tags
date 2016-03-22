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
| "Trading Cards" | The game has Steam trading cards |
| "Achievements" | This game has steam achievements |
| "Bundled" | The game is marked as bundled by Steamgifts |
| "Hidden" | This game is in your filter list |


## Screenshots
![1](http://i.imgur.com/3yCku6P.jpg)
![2](http://i.imgur.com/5ISiLlP.jpg)
![3](http://i.imgur.com/mBw035b.jpg)
![4](http://i.imgur.com/YesE4Wl.jpg)
![5](http://i.imgur.com/7kPq8Ca.jpg)
![6](http://i.imgur.com/yTF7oqt.jpg)
![7](http://i.imgur.com/IxY9TmK.jpg)
![8](http://i.imgur.com/GBz0Yua.jpg)

## Changelogs
2.0
- Added support to "created", "entered", "won", "filters", "new", and community wishlist page.
- Change tags location to below the game's title. Now I can add more tags. So "Cards" tag changed back to "Trading Cards".
- Added Achievements & Hidden tags. Hidden tags only appear in giveaway page.
- Change tags link for packages, now opens steam storepage.

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
- ~~Add tags in :~~ (done)
  - ~~http://www.steamgifts.com/giveaways/created,~~ (done)
  - ~~http://www.steamgifts.com/giveaways/entered,~~ (done)
  - ~~http://www.steamgifts.com/giveaways/won,~~ (done)
  - ~~http://www.steamgifts.com/account/settings/giveaways/filters~~
  - ~~http://www.steamgifts.com/giveaways/new~~ (done)
  - ~~http://www.steamgifts.com/giveaways/wishlist~~ (done)
- User Preferences to enable/disable tags.
- Show steam user reviews score.
- Sidebar giveaway filter :
  - Show all / Show games with Trading card only.
  - Show all / Show bundled games / Show Non bundled games.
  - Show all / Show games with achievement only.
- Compatibility to endless scroll giveaway list (Easy Steamgifts and some userscript do this).