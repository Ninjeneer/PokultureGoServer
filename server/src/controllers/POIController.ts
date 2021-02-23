import POIStorage from "../storage/POIStorage";
import Utils from "../Utils";
import ParserFactory from "../modules/parser/ParserFactory";
import LocationIQ from "../modules/reversegeocoding/LocationIQ";
import ImportPOITask from "../tasks/ImportPOITask";
import AddPOIDescriptionTask from "../tasks/AddPOIDescriptionTask";
import { IPOI } from "../models/POI";
import { AppError } from "../Types";
import { StatusCodes } from "http-status-codes";
export default class POIController {
  public static async getPOI(id: IPOI['id']): Promise<IPOI> {
    let poi: IPOI;
    try {
      poi = await POIStorage.getPOI({ id });
    } catch (e) {
      throw new AppError({
        code: StatusCodes.BAD_REQUEST
      });
    }
    if (!poi) {
      throw new AppError({
        code: StatusCodes.NOT_FOUND,
        message: 'POI does not exist'
      });
    }
    const city = await this.getPOICityName(poi);
    if (city) {
      Object.assign(poi, { images: await this.getPOIImage(`${poi.name} ${city}`, 10) });
    }
    return poi;
  }

  public static async handleGetPOIsAroundLocation(longitude: number, latitude: number, range: number): Promise<IPOI[]> {
    const pois = await POIStorage.getPOIs({
      near: true,
      latitude: Number(latitude),
      longitude: Number(longitude),
      range: Number(range),
      type: Utils.buildAllTypesArray()
    });

    // Assign images to POIs
    for (const poi of pois) {
      if (poi.tags.name) {
        const city = await this.getPOICityName(poi);
        if (city) {
          Object.assign(poi, { images: await this.getPOIImage(`${poi.tags.name} ${city}`, 10) });
        }
      }
    }
    return pois;
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
    return loc.address.city ? loc.address.city : loc.address.village;
  }
}
