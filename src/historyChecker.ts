import { Greeter } from "./globals";
import { ProvinceOwnership } from "./provinceOwnership";
import { Provinces } from "./provinces";

export class HistoryChecker {

    public checkProvinces() {
        let provinces = Provinces.GetProvinces();
        for (var i = 0; i < provinces.length; i++) {
            var provinceName = provinces[i];

            if (ProvinceOwnership.conqueredProvinces.includes(provinceName)) {
                continue;
            }

            this.checkHistory(Greeter.provincesHistory[provinceName]);
        }

        // TODO: refactor alertsToShow
        if (this.alertsToShow.length) {
            var message = this.alertsToShow.join(", ");
            console.log(message);
            alert(message);
            this.alertsToShow = [];
        }
    }

    alertsToShow: string[] = [];

    public reset() {
        this.alertsToShow = [];
    }

    checkHistory(history: any) {
        if (history.length === 0) {
            return;
        }

        // population 3 is longer than x (5?) => developing
        // -start from last one
        var last = history[history.length - 1];
        var lastSoldiersCount = last.soldiers;

        if (last.population === "3" && last.culture === "pri") {
            var counter = 0;
            for (var i = history.length - 2; i > -1; i--) {
                var current = history[i];
                if (current.population === "3" && lastSoldiersCount <= current.soldiers) {
                    counter++;
                }
            }

            if (counter > 5) {
                this.alertsToShow.push(last.name + " is developing");
            }
        }
    }
}
