# SG Game Tags

SG Game Tags is a userscript to show tags if the game has trading cards or is bundled by SG.

# [Download](https://greasyfork.org/en/scripts/18047-sg-game-tags)

This is still a beta release as the script is far from done. The script doesn't save the data yet, so it will make a request to steam and SG every time user loads giveaway list. See To Do List below.

I haven't tested endless scroll, but I don't think it will work for pages that loaded later.

The script requires :
- [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) for Chrome
- [Greasemonkey](https://addons.mozilla.org/en-us/firefox/addon/greasemonkey/) for Firefox
- [Violentmonkey](https://addons.opera.com/en/extensions/details/violent-monkey/) for Opera
- [GreaseKit](http://www.macupdate.com/app/mac/20718/greasekit) for Safari
- recommended 1366px screen width or more.

## Features
- Shows "Trading Cards" tag if the game has trading cards.
- Shows "Bundled" tag if the game is marked as bundled by SG.
- Tags are links. "Trading Cards" tag will open steamcardexchange inventory, and "Bundled" tag will open http://www.steamgifts.com/bundle-games with corresponding game.

## Current Tags
| Tags | Description|
|:---:|---|
| "Bundled"  | The game is marked as bundled by Steamgifts. |
| "Trading Cards" | The game has Steam trading cards.  |

## Screenshots
![1](http://i.imgur.com/tBfc60B.png)
![2](http://i.imgur.com/GTlUVjU.png)
![3](http://i.imgur.com/myPzhN2.jpg)

## Changelogs
0.1	First Release.
0.2	Use GM_xmlhttpRequest instead of cors.io to bypass CORS problem

## Not sure if it should be implemented
- "Achievement" tag if the game has steam achievements. Some game's name are pretty long that it'd looks ugly if there is 1 more tags. Unless "Bundled" and "Trading Cards" changed to "B" and "C" to shorten the text.
![this is what I mean](http://i.imgur.com/Y4HQsun.png)

## To Do List
- Save data as cache for better performance and to avoid making too much request to steam and SG. GM_setValue is not quite what I need. I'm trying to find another alternative.
- Add tags in :
  - http://www.steamgifts.com/giveaways/created,
  - http://www.steamgifts.com/giveaways/entered, 
  - http://www.steamgifts.com/giveaways/won,
  - http://www.steamgifts.com/account/settings/giveaways/filters
  - http://www.steamgifts.com/giveaways/new (this one might be a little difficult)
- Sidebar giveaway filter :
  - Show all / Show games with Trading card only.
  - Show all / Show bundled games / Show Non bundled games.
- Error handling for games that don't have store page or games with packageID instead of appID.
- Compatibility to endless scroll giveaway list (Easy Steamgifts and some userscript do this).