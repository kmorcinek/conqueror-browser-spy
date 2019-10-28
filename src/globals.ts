import $ from "jquery"

export class Greeter {
    public static getTurn() {
        let turnSelector: string = '#gameWrapper > div > div.area.areaT > div.area.areaTM > div > div > div > div.turnInfo > div > span.turnCount';
        return parseInt($(turnSelector).text().substring(5));
    }

    public static provincesHistory: any = {};
}
