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

## How I test the code

* change wrapper.js to point to some localhost
* Włączyć dodatek (more tools->Extensions) chrome web server (Web Server for Chrome), domyślny katalog jest dobry, otwierasz folder "C:\Work\GitHub\kmorcinek\conqueror-spy\src" i plik wrapper.js, wkleić do przeglądarki F12 do consoli.
* reload wrapper.js przeladuje wszystkie skrypty - wystarczy wpisać `refreshIt();` w consoli i też jest przeładowane
* 
