// DataParserNMEA.ts

export const parseDataStream = (data: string) => {
    const lines = data.split('\n');
    const parsedData = lines.map(line => {
      const fields = line.split(',');
      const sentenceType = fields[0];
      switch (sentenceType) {
        case '$GPRMC':
          return {
            type: 'GPRMC',
            time: fields[1],
            status: fields[2],
            latitude: `${fields[3]} ${fields[4]}`,
            longitude: `${fields[5]} ${fields[6]}`,
            speed: fields[7],
            date: fields[9],
          };
        case '$GPVTG':
          return {
            type: 'GPVTG',
            course: fields[1],
            speed: fields[7],
          };
        case '$GPGGA':
          return {
            type: 'GPGGA',
            time: fields[1],
            latitude: `${fields[2]} ${fields[3]}`,
            longitude: `${fields[4]} ${fields[5]}`,
            fixQuality: fields[6],
            altitude: `${fields[9]} ${fields[10]}`,
          };
        case '$GPGLL':
          return {
            type: 'GPGLL',
            latitude: `${fields[1]} ${fields[2]}`,
            longitude: `${fields[3]} ${fields[4]}`,
            time: fields[5],
          };
        case '$GPGSA':
          return {
            type: 'GPGSA',
            mode: fields[1],
            fixType: fields[2],
            satellitesUsed: fields.slice(3, 15).filter(sat => sat !== ''),
          };
        case '$GPGSV':
          return {
            type: 'GPGSV',
            numberOfMessages: fields[1],
            messageNumber: fields[2],
            satellitesInView: fields[3],
            satellitesInfo: fields.slice(4, fields.length - 1),
          };
        default:
          return null;
      }
    }).filter(Boolean);
    return parsedData;
  };
  