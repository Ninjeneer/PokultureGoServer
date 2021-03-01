import axios from 'axios';
import config from '../../../assets/config.json';
import Location from './Location';

export default class LocationIQ {
  constructor() { }

  public async reverseGeocoding(lat: number, lon: number): Promise<Location> {
    const res = await axios.get(`https://eu1.locationiq.com/v1/reverse.php?key=${config.locationIQkey}&lat=${lat}&lon=${lon}&format=json`)
    return res.data;
  }
}
