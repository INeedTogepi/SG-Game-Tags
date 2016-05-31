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
  - "Early Access" tag will also open apps store page.
- Tags can be toggled on/off at https://www.steamgifts.com/account/settings/giveaways
- Supports SG++ and Ext SG endless scroll. Credits to Alpe who helped me with this.

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
| "Early Access" | This game is in early access state |

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

Early Access tags is cached for 3 days, and it will not request data again if the game is not in early access. Early access data comes from Steam popular user defined tags.

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