import { Provinces } from "./provinces";

export class ProvinceOwnership {

    public updateOwnedProvinces() {
        function createId(prefix: string, province: string) {
            return prefix + province.toLowerCase();
        }

        let provinces = Provinces.GetProvinces();
        for (var i = 0; i < provinces.length; i++) {
            let provinceName: string = provinces[i];

            if ((this.conqueredProvinces as any).includes(provinceName)) {
                continue;
            }

            // TODO: prefetch it
            var a = document.getElementsByClassName("svgMap")[0];
            var svgDoc = (a as any).contentDocument;

            var map = svgDoc.getElementById(createId("field_", provinceName));

            if (map == null) {
                continue;
            }

            var color = map.getAttribute("fill");

            var playerColors = [
                '#ff3131', '#009c00', '#3131ff', '#ffce00', '#636300',
                '#63319c', '#ce63ce', '#ce9c63', '#006363', '#319c9c'];

            if ((playerColors as any).includes(color)) {
                this.conqueredProvinces.push(provinceName);
                console.log("conquered: ", provinceName);
            }
        }
    }

    conqueredProvinces: string[] = [];

    public getConqueredProvinces() {
        return this.conqueredProvinces;
    }

    public reset() {
        this.conqueredProvinces = [];
    }
}