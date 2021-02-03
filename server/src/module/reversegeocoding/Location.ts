export default interface Location {
  place_id: string,
  licence: string,
  osm_type: string,
  osm_id: string,
  lat: string,
  lon: string,
  display_name: string,
  address: {
    castle: string,
    pedestrian: string,
    neighbourhood: string,
    hamlet: string,
    city: string,
    county: string,
    state: string,
    country: string,
    postcode: string,
    country_code: string
  },
  boundingbox: number[]
}
