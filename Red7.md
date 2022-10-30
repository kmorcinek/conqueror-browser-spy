# Red7

## granie na 2 konta

musze miec konto premium zeby grac z tego samego adresu IP.
albo VPN.

## poczatek, przeczytac jakie mam karty na ręce.

opcje:
a) moge zrobic ze przyciskam karty. tylko trzeba kilka klikow.
  pros:
  * moge klikac z aplikacji, odpalajac np cos z konsoli, jakies metody.


b) moge zrobic ze uderzam do API
  cons:
  * trzeba bedzie rozkminic to API.
  
## logika gry

### dummest player will do

* play on canvas
* check all cards if any possible one canvas
* will have to understand game rules.
* start from one color (simplest one)
  * RED -> high card + color.
* decode cards.

### decode card ids



https://x.boardgamearena.net/data/themereleases/current/games/redsevengame/210309-1358/img/cards.png

## typescript

``` typescript
clickPalette() {
  const allPaletteRows = document.getElementById("all_rows")!;
  const palette = allPaletteRows.firstElementChild!;
  palette.click();
}
```

property `click` does not exist on `Element`

<div id="my_cards_item_11" class="stockitem " style="top: 0px; left: 294px; width: 93px; height: 130px; background-image: url(&quot;https://x.boardgamearena.net/data/themereleases/current/games/redsevengame/210309-1358/img/cards.png&quot;); background-position: 0% -400%; opacity: 1;"></div> 


<div id="my_cards_item_16" class="stockitem " style="top: 135px; left: 98px; width: 93px; height: 130px; background-image: url(&quot;https://x.boardgamearena.net/data/themereleases/current/games/redsevengame/210309-1358/img/cards.png&quot;); background-position: -300% -600%; opacity: 1;"></div>


<div id="my_cards_item_23" class="stockitem " style="top: 135px; left: 0px; width: 93px; height: 130px; background-image: url(&quot;https://x.boardgamearena.net/data/themereleases/current/games/redsevengame/210309-1358/img/cards.png&quot;); background-position: -300% -400%; opacity: 1;"></div>





{id: '16', type: 'violet', type_arg: '4', location: 'hand', location_arg: '83989769'}
23
: 
{id: '23', type: 'blue', type_arg: '4', location: 'hand', location_arg: '83989769'}

obydwie "4" roznia sie o 7 (23-16) i maja kolory obok siebie.





11
: 
{id: '11', type: 'blue', type_arg: '1', location: 'hand', location_arg: '83989769'}
16
: 
{id: '16', type: 'violet', type_arg: '4', location: 'hand', location_arg: '83989769'}
23
: 
{id: '23', type: 'blue', type_arg: '4', location: 'hand', location_arg: '83989769'}
31
: 
{id: '31', type: 'orange', type_arg: '5', location: 'hand', location_arg: '83989769'}
36
: 
{id: '36', type: 'yellow', type_arg: '6', location: 'hand', location_arg: '83989769'}
48
: 
{id: '48', type: 'red', type_arg: '6', location: 'hand', location_arg: '83989769'}
49
: 
{id: '49', type: 'violet', type_arg: '6', location: 'hand', location_arg: '83989769'}




curl 'https://boardgamearena.com/4/redsevengame/redsevengame/playCanvas.html?id=16&step=action_canvas&lock=82bbe243-1fea-42ae-8d61-116070e71284&table=311653649&noerrortracking=true&dojo.preventCache=1666710588208' \
  -H 'authority: boardgamearena.com' \
  -H 'accept: */*' \
  -H 'accept-language: en-GB,en-US;q=0.9,en;q=0.8,pl;q=0.7' \
  -H 'cookie: TournoiEnLigne_sso_user=gugiel%243%24Krzysztof.morcinek%40gmail.com; TournoiEnLigne_sso_id=a0e138175a7d603f210c66f9a66a9ade; TournoiEnLigneidt=WPzDn0g54NwTXY4; TournoiEnLignetkt=NSEUDVsJ8mAJVXNCsdOrEuZqMbos3hwpq6Mi2FbKTlvTdVIKAhNDUiSwErdejbUp; TournoiEnLigneid=fKt4solanCpSPUc; TournoiEnLignetk=3J42M1v8Qp4IbNC4UDD7gYvcfreduWhMcdRLHesIuX5NVbv0wzkX7LyhecrGDepz; PHPSESSID=cn84f0cr3ucnckknldj5red335; _gid=GA1.2.1137687798.1666705066; _ga_DWXD9R5L7D=GS1.1.1666707025.2.1.1666709617.60.0.0; _ga=GA1.2.874918261.1666704848' \
  -H 'referer: https://boardgamearena.com/4/redsevengame?table=311653649' \
  -H 'sec-ch-ua: "Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36' \
  -H 'x-request-token: WPzDn0g54NwTXY4' \
  -H 'x-requested-with: XMLHttpRequest' \
  --compressed


  {"status":"0","error":"You will not win with this rule on Canvas. Choose another one or pass.","expected":1,"code":100}


  curl 'https://boardgamearena.com/4/redsevengame/redsevengame/playPalette.html?id=23&lock=0780b3f1-946a-44c7-8f9d-f3d8b6d6e8ba&table=311653649&noerrortracking=true&dojo.preventCache=1666710461455' \
  -H 'authority: boardgamearena.com' \
  -H 'accept: */*' \
  -H 'accept-language: en-GB,en-US;q=0.9,en;q=0.8,pl;q=0.7' \
  -H 'cookie: TournoiEnLigne_sso_user=gugiel%243%24Krzysztof.morcinek%40gmail.com; TournoiEnLigne_sso_id=a0e138175a7d603f210c66f9a66a9ade; TournoiEnLigneidt=WPzDn0g54NwTXY4; TournoiEnLignetkt=NSEUDVsJ8mAJVXNCsdOrEuZqMbos3hwpq6Mi2FbKTlvTdVIKAhNDUiSwErdejbUp; TournoiEnLigneid=fKt4solanCpSPUc; TournoiEnLignetk=3J42M1v8Qp4IbNC4UDD7gYvcfreduWhMcdRLHesIuX5NVbv0wzkX7LyhecrGDepz; PHPSESSID=cn84f0cr3ucnckknldj5red335; _gid=GA1.2.1137687798.1666705066; _ga_DWXD9R5L7D=GS1.1.1666707025.2.1.1666709617.60.0.0; _ga=GA1.2.874918261.1666704848' \
  -H 'referer: https://boardgamearena.com/4/redsevengame?table=311653649' \
  -H 'sec-ch-ua: "Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36' \
  -H 'x-request-token: WPzDn0g54NwTXY4' \
  -H 'x-requested-with: XMLHttpRequest' \
  --compressed


  curl 'https://boardgamearena.com/5/redsevengame/redsevengame/playPalette.html?id=49&lock=ac2532cf-7dcc-4c1f-815c-e9619217891d&table=311660297&noerrortracking=true&dojo.preventCache=1666710811091' \
  -H 'authority: boardgamearena.com' \
  -H 'accept: */*' \
  -H 'accept-language: en-GB,en-US;q=0.9,en;q=0.8,pl;q=0.7' \
  -H 'cookie: TournoiEnLigne_sso_user=gugiel%243%24Krzysztof.morcinek%40gmail.com; TournoiEnLigne_sso_id=a0e138175a7d603f210c66f9a66a9ade; TournoiEnLigneidt=WPzDn0g54NwTXY4; TournoiEnLignetkt=NSEUDVsJ8mAJVXNCsdOrEuZqMbos3hwpq6Mi2FbKTlvTdVIKAhNDUiSwErdejbUp; TournoiEnLigneid=fKt4solanCpSPUc; TournoiEnLignetk=3J42M1v8Qp4IbNC4UDD7gYvcfreduWhMcdRLHesIuX5NVbv0wzkX7LyhecrGDepz; PHPSESSID=cn84f0cr3ucnckknldj5red335; _gid=GA1.2.1137687798.1666705066; _ga_DWXD9R5L7D=GS1.1.1666707025.2.1.1666710730.47.0.0; _ga=GA1.2.874918261.1666704848; __stripe_mid=3142fd7e-f2f0-430c-a402-6242545f4a63a858b3; __stripe_sid=80e64d6b-00d5-4567-afe7-048c1dbbc582df57fa' \
  -H 'referer: https://boardgamearena.com/5/redsevengame?table=311660297' \
  -H 'sec-ch-ua: "Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36' \
  -H 'x-request-token: WPzDn0g54NwTXY4' \
  -H 'x-requested-with: XMLHttpRequest' \
  --compressed


  curl 'https://boardgamearena.com/5/redsevengame/redsevengame/playPalette.html?id=47&lock=cb3de5a5-a157-4f99-878e-af3b6668ca61&table=311660297&noerrortracking=true&dojo.preventCache=1666712300563' \
  -H 'authority: boardgamearena.com' \
  -H 'accept: */*' \
  -H 'accept-language: en-GB,en-US;q=0.9,en;q=0.8,pl;q=0.7' \
  -H 'cookie: TournoiEnLigne_sso_user=gugiel%243%24Krzysztof.morcinek%40gmail.com; TournoiEnLigne_sso_id=a0e138175a7d603f210c66f9a66a9ade; TournoiEnLigneidt=WPzDn0g54NwTXY4; TournoiEnLignetkt=NSEUDVsJ8mAJVXNCsdOrEuZqMbos3hwpq6Mi2FbKTlvTdVIKAhNDUiSwErdejbUp; TournoiEnLigneid=fKt4solanCpSPUc; TournoiEnLignetk=3J42M1v8Qp4IbNC4UDD7gYvcfreduWhMcdRLHesIuX5NVbv0wzkX7LyhecrGDepz; PHPSESSID=cn84f0cr3ucnckknldj5red335; _gid=GA1.2.1137687798.1666705066; _ga_DWXD9R5L7D=GS1.1.1666707025.2.1.1666710730.47.0.0; _ga=GA1.2.874918261.1666704848; __stripe_mid=3142fd7e-f2f0-430c-a402-6242545f4a63a858b3; __stripe_sid=80e64d6b-00d5-4567-afe7-048c1dbbc582df57fa' \
  -H 'referer: https://boardgamearena.com/5/redsevengame?table=311660297' \
  -H 'sec-ch-ua: "Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36' \
  -H 'x-request-token: WPzDn0g54NwTXY4' \
  -H 'x-requested-with: XMLHttpRequest' \
  --compressed

curl 'https://boardgamearena.com/4/redsevengame/redsevengame/playPalette.html?
id=23&
lock=0780b3f1-946a-44c7-8f9d-f3d8b6d6e8ba&
table=311653649
&noerrortracking=true&dojo.preventCache=1666710461455' \

curl 'https://boardgamearena.com/5/redsevengame/redsevengame/playPalette.html?
id=49&
lock=ac2532cf-7dcc-4c1f-815c-e9619217891d&
table=311660297
&noerrortracking=true&dojo.preventCache=1666710811091' \

curl 'https://boardgamearena.com/5/redsevengame/redsevengame/playPalette.html?
id=47&
lock=cb3de5a5-a157-4f99-878e-af3b6668ca61&
table=311660297
&noerrortracking=true&dojo.preventCache=1666712300563' \