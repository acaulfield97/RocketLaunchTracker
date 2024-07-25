import React from 'react';
import useAltitudeData from './useAltitudeData';
import AltitudeGraphView from './AltitudeGraphView';

const AltitudeGraph: React.FC = () => {
  const altitudeData = useAltitudeData();

  return <AltitudeGraphView altitudeData={altitudeData} />;
};

export default AltitudeGraph;
