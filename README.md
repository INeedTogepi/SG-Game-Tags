# SG Game Tags

I name it SG Game Tags. I actually named it SGTags, but it is [already used](http://www.steamgifts.com/discussion/SQ56V/userscripts-enhancing-my-sg-experience). And I don't know what better word to describe this script.

# [Download](https://greasyfork.org/en/scripts/18047-sg-game-tags)

## Features
- Shows "Trading Cards" tag if the game has trading cards.
- Shows "Achievements" tag if the game has steam achievements.
- Shows "Bundled" tag if the game is marked as bundled by SG. v3.1 above, mouse hover shows bundled date.
- Shows "Hidden" tag if the game is in your SG filter list.
- Shows "Wishlist" tag if the game is in your Steam wishlist.
- Shows "Linux" and "Mac" if the game supports multi platform.
- Shows "Early Access" if the game is currently in early access state.
- Shows "Owned" if the game exist in your Steam library.
- Shows "Ignored" if you marked this game as not interested at Steam store page.
- Tags are links :
  - "Trading Cards" tag will open steamcardexchange inventory. 
  - "Achievements" tag will open steam achievements of the game.
  - "Bundled" tag will open http://www.steamgifts.com/bundle-games with corresponding game.
  - "Hidden" tag will open http://www.steamgifts.com/account/settings/giveaways/filters with corresponding game.
  - "Wishlist" tag will open http://www.steamgifts.com/account/steam/wishlist with corresponding game.
  - "Linux" & "Mac" tag will open apps store page. I can't make it refer to system requirement section directly.
  - "Early Access", "Ignored" tag will also open apps store page.
- Tags can be toggled on/off at https://www.steamgifts.com/account/settings/giveaways.
- Supports SG++ and Ext SG endless scroll. Credits to Alpe who helped me with this.
- Links to giveaway setting and SG Game Tags setting inside Point and level dropdown.
- Tags background color and text color customization.

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
| "Owned" | You already have this game |
| "Ignored" | You marked this game as not interested |

The script requires :
- [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) for Chrome
- [Greasemonkey](https://addons.mozilla.org/en-us/firefox/addon/greasemonkey/) for Firefox
- [Violentmonkey](https://addons.opera.com/en/extensions/details/violent-monkey/) for Opera
- [GreaseKit](http://www.macupdate.com/app/mac/20718/greasekit) for Safari


"Hidden" tag is only shown inside giveaway page. It is useful for invite only giveaway. Still thinking a way to optimize the way to get list of hidden games so that I can make it appear outside giveaway page.

The script now can get list of bundle games with just 1 request, and will request again every 6 hours.
Trading cards, achievement, linux, mac, early access still have 24 hours cache data.
It doesn't save data for hidden games, because you can always remove the game from filter.

Some games with wrong store page link won't show trading card status. e.g Left 4 Dead Bundle and Portal Bundle since the [store page](http://store.steampowered.com/sub/7932/) itself is gone now.
I can't do anything about that.

If bundled tag doesn't appear at all, check if you can open [this link](http://ruphine.esy.es/steamgifts/GetBundleStatus.php), maybe my server down.
If wishlist tag doesn't appear at all, make sure you are logged in to steam with the same browser, and then check [this link](http://store.steampowered.com/dynamicstore/userdata/) if there are some number inside [] after "rgWishlist" :


You can also see the code and maybe help me with the development at [github](https://github.com/Propheus/SG-Game-Tags).

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
![9](http://i.imgur.com/Ze20Dxh.png)
![10](http://i.imgur.com/whnXmIA.png)