# SG Game Tags

I name it SG Game Tags. I actually named it SGTags, but it is [already used](http://www.steamgifts.com/discussion/SQ56V/userscripts-enhancing-my-sg-experience). And I don't know what better word to describe this script.

# [Download](https://greasyfork.org/en/scripts/18047-sg-game-tags)

## Features
- Shows "Trading Cards" tag if the game has trading cards.
- Shows "Achievements" tag if the game has steam achievements.
- Shows "Bundled" tag if the game is marked as bundled by SG.
- Shows "Hidden" tag if the game is in your SG filter list.
- Shows "Wishlist" tag if the game is in your Steam wishlist.
- Shows "Linux" and "Mac" if the game supports multi platform.
- Tags are links :
  - "Trading Cards" tag will open steamcardexchange inventory. 
  - "Achievements" tag will open steam achievements of the game.
  - "Bundled" tag will open http://www.steamgifts.com/bundle-games with corresponding game.
  - "Hidden" tag will open http://www.steamgifts.com/account/settings/giveaways/filters with corresponding game.
  - "Wishlist" tag will open http://www.steamgifts.com/account/steam/wishlist with corresponding game.
  - "Linux" & "Mac" tag will open apps store page. I can't make it refer to system requirement section directly.

## Current Tags
| Tags | Caption |
|:---:|---|
| "Trading Cards" | This game has trading cards |
| "Achievements" | This game has steam achievements |
| "Bundled" | This game is marked as bundled by Steamgifts |
| "Hidden" | This game is in your filter list |
| "Wishlist" | This game is in your Steam wishlist |
| "Linux" | Linux supported |
| "Mac" | Mac supported |

The script requires :
- [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) for Chrome
- [Greasemonkey](https://addons.mozilla.org/en-us/firefox/addon/greasemonkey/) for Firefox
- [Violentmonkey](https://addons.opera.com/en/extensions/details/violent-monkey/) for Opera
- [GreaseKit](http://www.macupdate.com/app/mac/20718/greasekit) for Safari

"Hidden" and "Wishlist" tags are only shown inside giveaway page.

The script saves game data for next uses. It saves data forever if the game is in bundle list. I assume once the game is marked as bundled, it will always be. If the game is not bundled, the script will save it as false for 1 day use.
It does the same for trading cards and achievements data.
It doesn't save data for hidden games and wishlist, because you can always remove the game from filter.

Some games with wrong store page link won't show trading card status. e.g Left 4 Dead Bundle and Portal Bundle.
Portal Bundle store page should be [this](http://store.steampowered.com/bundle/234/), but SG shows [this](http://store.steampowered.com/sub/7932/)
I can't do anything about that, unless SG changes it.

The script still doesn't support endless scroll. Alpe did helped me about this but I'm afraid I can't do anything if something happen. So I postpone endless scroll for a while. Check out his script here http://www.steamgifts.com/discussion/ZH7th/userscript-steamgifts-steam-ratings.

Feedback and bug report are always appreciated.

## Screenshots
![1](http://i.imgur.com/3yCku6P.jpg)
![2](http://i.imgur.com/5ISiLlP.jpg)
![3](http://i.imgur.com/mBw035b.jpg)
![4](http://i.imgur.com/YesE4Wl.jpg)
![5](http://i.imgur.com/7kPq8Ca.jpg)
![6](http://i.imgur.com/yTF7oqt.jpg)
![7](http://i.imgur.com/IxY9TmK.jpg)
![8](http://i.imgur.com/GBz0Yua.jpg)
![9](http://i.imgur.com/5c7r3Yc.jpg)

## Changelogs
2.10
- New tags (Linux & Mac).

2.9
- Update script because SG becomes https

2.8
- Added "Wishlist" tag. Only appear in giveaway page, because we already have http://www.steamgifts.com/giveaways/search?type=wishlist.
- Added support to http://www.steamgifts.com/account/steam/wishlist and http://www.steamgifts.com/account/steam/games
- Hopefully fix bug when SG Game Tags setting appear on winning pop-up. Not tested as I haven't won anything.

2.4
- Reoptimize request data to Steam for Trading Cards and Achievements tags. Now 1 request for 1 game instead of separate requests for Trading Cards and Achievements.
- Added User Preferences to enable/disable tags in http://www.steamgifts.com/account/settings/giveaways.
- Change tags border-radius from 20px to 4px to match SG theme.

2.1 - 2.3
- Added support to http://www.steamgifts.com/group/
- Fix bug for checking bundle if the game title contains (+)

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
- Find a way to store Hidden & Wishlist data efficiently so it won't make too much request to SG. If I manage to do this, Wishlist tag can be shown anywhere else.
- Show steam user reviews score. Actually Alpe built the script for this feature http://www.steamgifts.com/discussion/ZH7th/userscript-steamgifts-steam-ratings.
- Sidebar giveaway filter :
  - Show all / Show games with Trading card only.
  - Show all / Show bundled games / Show Non bundled games.
  - Show all / Show games with achievement only.
- Compatibility to endless scroll giveaway list (Postponed for a while).
- Custom colors for tags. Change the tags color the way you want.