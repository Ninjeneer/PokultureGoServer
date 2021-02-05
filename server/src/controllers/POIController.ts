import POIStorage from "../storage/POIStorage";
import Utils from "../Utils";
import ParserFactory from "../modules/parser/ParserFactory";
import LocationIQ from "../modules/reversegeocoding/LocationIQ";
import ImportPOITask from "../tasks/ImportPOITask";
import AddPOIDescriptionTask from "../tasks/AddPOIDescriptionTask";
export default class POIController {
  public static async handleGetPOIsAroundLocation(longitude: number, latitude: number, range: number) {
    return new Promise((resolve, error) => {
      POIStorage.getPOIs({
        near: true,
        latitude: Number(latitude),
        longitude: Number(longitude),
        range: Number(range),
        type: Utils.buildAllTypesArray()
      }).then(async (pois) => {
        for (const poi of pois) {
          if (poi.tags.name) {
            const city = await this.getPOICityName(poi);
            if (city) {
              Object.assign(poi, { images: await this.getPOIImage(`${poi.tags.name} ${city}`, 10) });
            }
          }
        }
        resolve(pois);
      })
    });
  }

  public static async importPOIs() {
    return new Promise((resolve, error) => {
      (new ImportPOITask()).run().then((r) => resolve(r));
    })
  }

  public static async importPOIsDescription() {
    return new Promise((resolve, error) => {
      (new AddPOIDescriptionTask()).run().then((r) => resolve(r));
    })
  }

  /**
   * Returns array of links
   */
  private static async getPOIImage(keywords: string, limit?: number) {
    const googleParser = ParserFactory.createGoogleParser();
    return await googleParser.getImageForKeywords(keywords, limit);
  }

  /**
   * Return city name based on POI coordinates
   */
  private static async getPOICityName(poi) {
    const reverseGeocoding = new LocationIQ();
    const loc = await reverseGeocoding.reverseGeocoding(poi.location[1], poi.location[0]);
    return loc.address.city;
  }
}
