# Conqueror browser spy

App for better playing an online game http://conquerorgame.com/teams/

## How I develop this application (tools, IDEs, etc)

* Visual Studio Code - open folder
* Visual Studio - open folder

## How I test the code

* You don't need to use docker (!Need to verify on Windows). You can host it just using `npx http-server ./lib -p 8887`
* If you have already running container (even after system restart) you can just login from powershell to container: `docker exec -it sha512OfContainer /bin/bash`
* If you run container for first time (or done changes to ie. 'package.json') then perform:
  * In application folder: `docker image build -t ts-demo .`
  * Delete all files in src folder (leave folder empty) - folder needs to be empty to mount.
  * Run Docker in application folder (on Windows in PowerShell - better handling path): `docker container run --rm -it -v $PWD/output-volume:/usr/src/app/lib -v $PWD/src:/usr/src/app/src -v $PWD/tests:/usr/src/app/tests -p 8887:8080 ts-demo`
  * In application folder `git reset --hard` - to get back previously deleted file
* Edit any *.ts files in /src folder
* Inside Docker Container run: `npm run browserify` - it will run **browsify** and create one file 'output.js' in app-vol folder and expose it as http://127.0.0.1:8887/output.js
* Create bookmark in browser with js scripts from file `/wrapper/wrapper.jjj` (dummy extension just for not conflicting with other usefull extensions)

  * One bookmark for PROD and one for testing
  * Click the bookmark and scripts are loaded/reloaded
* When new game is set up and app is loaded you should see in browser debugger console `Running conqueror-browser-spy`

## How I test the code on Ubuntu (above not always works)

* run: `npm run browserify`
* serve file `output.js` on localhost:8887 using ie "Web Server for Chrome"

## Which game to set for testing

* http://conquerorgame.com/teams/
* "Login as guest" - no need to register
* Multiplayer
* Mode - "Team game"
* Fog of war - off
* number of players - 2 - only that setup works for AI
* Turn timer - high ie. 8 minutes

### for testing history tool

* any, Europe is good

### for testing AI

* Map - "Tiny" "Team Arena" is best.
* Difficulty - Weak

## PROD Deploy

Run script `sh build_deploy.sh` (credentials for AWS were already provided)

`git tag v1.x`

`git push origin --tags`

### Hot to check prod version

* run script on conqueror and there is information in console logs: `Tool version: 1.12 - reset map when starting new game`

* open url https://s3.amazonaws.com/krzysztof.morcinek.conquerorgame/output.js and search for "Tool version"

## Knows issues

<!--
* livonia jest źle pokazywana, z jakiegoś powodu była w conqueredProvince. (zły kolor?).
  * znowu z Hannoverem tylko teraz nie było 'conquered' gdy powinno.
* bug: eire jest puste. nie zczytało prowincji, a inne zczytało.
	- chyba jakiś race condition bo za drugim razem ten i inne zczytało.
	- LOW
	- kolejny raz.
		- wrzucić 1s setTimeout.
-->

* `Uncaught (in promise) DOMException: The play() request was interrupted by a new load request.` - it means that where was Exception and was swallowed and hidden by this message.
  * Examples: clicking to build Soldier when Soldier is already set.

### uncaught exceptions in conqueror-browser-spy application

like in commit https://github.com/kmorcinek/conqueror-browser-spy/commit/4cb1dbb41316a3e5171d2cccc8e8ee7c439c163b it is good to surround with `try/catch` some global functions or event handlers:

``` ts
try {
  ConquerorSpy.initialize();
  ConquerorSpy.start();
} catch (error) {
  console.error(error);
}
```
