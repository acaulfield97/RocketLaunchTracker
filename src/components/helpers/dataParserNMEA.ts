// DataParserNMEA.ts
import {NMEASentence, GPGGA, GPGSV, GPRMC, GPVTG} from '../../types/types';

export const parseDataStream = (data: string): NMEASentence => {
  const fields = data.split(',');
  const sentenceType = fields[0];
  switch (sentenceType) {
    case '$GPRMC':
      return {
        type: 'GPRMC',
        time: fields[1],
        date: fields[9],
      } as GPRMC;
    case '$GPVTG':
      return {
        type: 'GPVTG',
        speed: fields[7], // km/h
      } as GPVTG;
    case '$GPGGA':
      return {
        type: 'GPGGA',
        latitude: `${fields[2]} ${fields[3]}`,
        longitude: `${fields[4]} ${fields[5]}`,
        fixQuality: fields[6],
        numberOfSatellitesBeingTracked: fields[7],
        altitude: `${fields[9]}`,
      } as GPGGA;
    case '$GPGSV':
      return {
        type: 'GPGSV',
        satellitesInView: fields[3],
      } as GPGSV;
    default:
      return undefined;
  }
};
