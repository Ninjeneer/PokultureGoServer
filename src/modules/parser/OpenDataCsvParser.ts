import Parser from "./Parser";
import fs from 'fs';
import parse from 'csv-parse/lib/sync';

export interface OpenDataPOI {
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  postal: number;
  city: string;
  phone: string;
  mail: string;
  website: string;
  description: string;
}

export default class OpenDataCsvParser implements Parser {
  public parse(path: string): OpenDataPOI[] {
    const pois: OpenDataPOI[] = [];
    const file = fs.readFileSync(path);
    parse(file, { columns: true, skipEmptyLines: true, onRecord: (r) => {
      pois.push({
        name: r['Nom_du_POI'],
        category: r['Categories_de_POI'],
        latitude: Number(r['Latitude']),
        longitude: Number(r['Longitude']),
        address: r['Adresse_postale'],
        postal: Number(r['Code_postal_et_commune'].split("#")[0]),
        city: r['Code_postal_et_commune'].split("#")[1],
        phone: r['Contacts_du_POI'].split("#")[0],
        mail: r['Contacts_du_POI'].split("#")[1],
        website: r['Contacts_du_POI'].split("#")[2],
        description: r['Description']
      })
    }});
    console.log(`Loaded ${pois.length} POIs from OpenData CSV ${path}`);
    return pois;
  }
}
