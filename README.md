## Knows issues

* livonia jest źle pokazywana, z jakiegoś powodu była w conqueredProvince. (zły kolor?).
  * znowu z Hannoverem tylko teraz nie było 'conquered' gdy powinno.
* bug: eire jest puste. nie zczytało prowincji, a inne zczytało.
	- chyba jakiś race condition bo za drugim razem ten i inne zczytało.
	- LOW
	- kolejny raz.
		- wrzucić 1s setTimeout.
