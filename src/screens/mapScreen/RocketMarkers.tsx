import React, {useEffect, useState} from 'react';
import {Images, ShapeSource, SymbolLayer} from '@rnmapbox/maps';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
// @ts-ignore
import {featureCollection} from '@turf/helpers';
import {useRocket} from '../../contexts/RocketContext';
// @ts-ignore
import rocketIcon from '../../assets/media/icons/rocket_icon_purple.png';
import {useBluetoothContext} from '../../contexts/BluetoothContext';

// Sample data for rocket flight simulation
// for demo
const simulationData = [
  {latitude: 54.58, longitude: -5.93},
  {latitude: 54.5805, longitude: -5.9305},
  {latitude: 54.581, longitude: -5.93075},
  {latitude: 54.5815, longitude: -5.931},
  {latitude: 54.582, longitude: -5.9315},
  {latitude: 54.5825, longitude: -5.93225},
  {latitude: 54.583, longitude: -5.933},
  {latitude: 54.5835, longitude: -5.934},
  {latitude: 54.584, longitude: -5.935},
  {latitude: 54.5845, longitude: -5.936},
  {latitude: 54.585, longitude: -5.937},
  {latitude: 54.5855, longitude: -5.938},
  {latitude: 54.586, longitude: -5.939},
  {latitude: 54.5865, longitude: -5.94},
  {latitude: 54.587, longitude: -5.941},
  {latitude: 54.5875, longitude: -5.9425},
  {latitude: 54.588, longitude: -5.944},
  {latitude: 54.5885, longitude: -5.9455},
  {latitude: 54.589, longitude: -5.947},
  {latitude: 54.5895, longitude: -5.9485},
  {latitude: 54.59, longitude: -5.95},
  {latitude: 54.5905, longitude: -5.9515},
  {latitude: 54.591, longitude: -5.953},
  {latitude: 54.5915, longitude: -5.9545},
  {latitude: 54.592, longitude: -5.956},
];

// Function to check if all values in rocketData are zeros
// to trigger sample data
const isAllZeroData = (data: any) => {
  return (
    data &&
    data.latitude === 0 &&
    data.longitude === 0 &&
    data.altitude === 0 &&
    data.date === 0 &&
    data.fixQuality === 0 &&
    data.numberOfSatellitesBeingTracked === 0 &&
    data.satellitesInView === 0 &&
    data.speed === 0 &&
    data.time === 0
  );
};

export default function RocketMarkers() {
  const {setSelectedRocket} = useRocket();
  const {rocketData} = useBluetoothContext();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  // Determine if simulation should be used
  const shouldSimulate = isAllZeroData(rocketData);

  // Set the initial state of simulation based on the data
  useEffect(() => {
    setIsSimulating(shouldSimulate);
  }, [rocketData]);

  // Update rocket position based on simulation or real data
  const points = shouldSimulate
    ? [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [
              simulationData[currentIndex].longitude,
              simulationData[currentIndex].latitude,
            ],
          },
          properties: {id: 1},
        },
      ]
    : rocketData
    ? [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [rocketData.longitude, rocketData.latitude],
          },
          properties: {id: 1},
        },
      ]
    : [];

  const rocketsFeatures = featureCollection(points);

  // Handle rocket press event
  const onRocketPress = async (event: OnPressEvent) => {
    if (event.coordinates) {
      setSelectedRocket(event.coordinates);
    }
  };

  // Simulation interval effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isSimulating) {
      intervalId = setInterval(() => {
        setCurrentIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % simulationData.length;
          return nextIndex;
        });
      }, 1000); // Adjust the interval for desired simulation speed
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSimulating]);

  return (
    <ShapeSource id="rockets" shape={rocketsFeatures} onPress={onRocketPress}>
      <SymbolLayer
        id="rockets-icons"
        style={{
          iconImage: 'rocketIcon',
          iconSize: 0.2,
          iconAllowOverlap: true,
          iconAnchor: 'center',
        }}
      />
      <Images images={{rocketIcon}} />
    </ShapeSource>
  );
}
