## Knows issues

* livonia jest źle pokazywana, z jakiegoś powodu była w conqueredProvince. (zły kolor?).
  * znowu z Hannoverem tylko teraz nie było 'conquered' gdy powinno.
* bug: eire jest puste. nie zczytało prowincji, a inne zczytało.
	- chyba jakiś race condition bo za drugim razem ten i inne zczytało.
	- LOW
	- kolejny raz.
		- wrzucić 1s setTimeout.

## How I develop this application (tools, IDEs, etc)

* Visual Studio Code - open folder
* Visual Studio - open folder

## How I test the code (new with TypeScript)

* In application folder: `docker image build -t ts-demo .`
* Run Docker in application folder (on Windows in PowerShell - better handling path): `docker container run --rm -it -v $PWD/app-vol:/usr/src/app/lib -v $PWD/src:/usr/src/app/src ts-demo bash`
  * it will start interactive bash inside Docker Container in the same console window
* Edit any *.ts files in /src folder
* Inside Docker Container run: `npm test` - it will run **browsify** and create one file 'output.js' in app-vol folder.
* Włączyć dodatek (more tools->Extensions) chrome web server (Web Server for Chrome), domyślny katalog jest dobry, otwierasz folder "C:\Work\GitHub\kmorcinek\conqueror-spy\src" i plik wrapper.js, wkleić do przeglądarki F12 do consoli.
* Paste **wrapper.js** to page (or just reload `refreshIt()` in console)

## How I test the code

* change wrapper.js to point to some localhost
* Włączyć dodatek (more tools->Extensions) chrome web server (Web Server for Chrome), domyślny katalog jest dobry, otwierasz folder "C:\Work\GitHub\kmorcinek\conqueror-spy\src" i plik wrapper.js, wkleić do przeglądarki F12 do consoli.
* reload wrapper.js przeladuje wszystkie skrypty - wystarczy wpisać `refreshIt();` w consoli i też jest przeładowane
* 

## Which game to set for testing

* Multiplayer
* Fog of war - off
* number of players - 2
* Turn timer - high ie. 8 minutes
* Map: Big enough, Europe is good