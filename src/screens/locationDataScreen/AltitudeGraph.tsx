import React from 'react';
import useAltitudeData from './useAltitudeData';
import AltitudeGraphView from './AltitudeGraphView';

const AltitudeGraph: React.FC = () => {
  const altitudeData = useAltitudeData();

  console.log('Altitude data in AltitudeGraph:', altitudeData); // Debugging line

  return <AltitudeGraphView altitudeData={altitudeData} />;
};

export default AltitudeGraph;
