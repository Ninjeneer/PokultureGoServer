import POIStorage from "../storage/POIStorage";
import config from '../../assets/config.json';
import Utils from "../Utils";
export default class POIController {
    public static async getPOIsAroundLocation(longitude: number, latitude: number, range: number) {
        return POIStorage.getPOIs({
            near: true,
            latitude: Number(latitude),
            longitude: Number(longitude), 
            range: Number(range),
            type: Utils.buildAllTypesArray()
        })
    }
}