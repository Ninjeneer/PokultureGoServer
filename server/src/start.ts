import ParserFactory from "./modules/parser/ParserFactory";
import Server from "./Server";
import getDistance from 'geolib/es/getDistance';

(new Server()).start();

// ParserFactory.createOpenDataCsvParser().parse('assets/datatourisme-nor.csv');

// console.log(getDistance({ latitude: 51.5103, longitude: 7.49347 }, { latitude: 52.5103, longitude: 6.49999 }));
