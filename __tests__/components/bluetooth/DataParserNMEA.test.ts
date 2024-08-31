// __tests__/DataParserNMEA.test.ts
import {parseDataStream} from '../../../src/components/bluetooth/DataParserNMEA';
import {GPRMC, GPVTG, GPGGA, GPGSV} from '../../../src/types/types';

describe('parseDataStream', () => {
  it('should correctly parse a GPRMC sentence', () => {
    const data =
      '$GPRMC,123456.00,A,4807.038,N,00138.251,W,0.013,0.0,010203,003.0,0000';
    const result = parseDataStream(data);
    expect(result).toEqual({
      type: 'GPRMC',
      time: '123456.00',
      date: '010203',
    } as GPRMC);
  });

  it('should correctly parse a GPVTG sentence', () => {
    const data = '$GPVTG,0.00,T,0.00,M,0.0,N,0.0,K';
    const result = parseDataStream(data);
    expect(result).toEqual({
      type: 'GPVTG',
      speed: '0.0',
    } as GPVTG);
  });

  it('should correctly parse a GPGGA sentence', () => {
    const data =
      '$GPGGA,123456.00,4807.038,N,00138.251,W,1,12,0.6,54.4,M,46.9,M,,';
    const result = parseDataStream(data);
    expect(result).toEqual({
      type: 'GPGGA',
      latitude: '4807.038 N',
      longitude: '00138.251 W',
      fixQuality: '1',
      numberOfSatellitesBeingTracked: '12',
      altitude: '54.4',
    } as GPGGA);
  });

  it('should correctly parse a GPGSV sentence', () => {
    const data = '$GPGSV,4,1,13,01,02,015,02,03,028,03,04,039,04,05,048';
    const result = parseDataStream(data);
    expect(result).toEqual({
      type: 'GPGSV',
      satellitesInView: '13',
    } as GPGSV);
  });

  it('should return undefined for unsupported sentence types', () => {
    const data = '$UNKNOWN,123456.00,4807.038,N,00138.251,W';
    const result = parseDataStream(data);
    expect(result).toBeUndefined();
  });
});
