import {GeoPoint} from '@react-native-firebase/firestore';
import {Dispatch, SetStateAction} from 'react';
import {BluetoothDevice} from 'react-native-bluetooth-classic';

export type RouteTab = {
  name: 'Account' | 'Map' | 'Bluetooth' | 'RawData' | 'LocationData';
};

export type RootStackParamList = {
  BluetoothTerminal: undefined;
  RawData: {parsedData: any[]};
  CreateAccount: undefined;
  Login: undefined;
};

export type LaunchData = {
  location: GeoPoint;
  altitude: number;
  time: string;
};

export type RocketData = {
  latitude: number;
  longitude: number;
  altitude: number;
  time: number;
  date: number;
  speed: number;
  numberOfSatellitesBeingTracked: number;
  satellitesInView: number;
  fixQuality: number;
};

export type RocketPosition = {
  latitude: number;
  longitude: number;
  altitude: number;
  date: number;
  time: number;
};

export type UserLocationType = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

export type BluetoothContextType = {
  pairedDevices: any[];
  selectedDevice?: BluetoothDevice;
  isConnected: boolean;
  receivedData: any[];
  rocketData: RocketData;
  startDeviceDiscovery: () => void;
  connectToDevice: (device: BluetoothDevice) => void;
  connectingDeviceId: string | null;
  disconnect: () => void;
  dataReceivingStatus: boolean;
  setDataReceivingStatus: Dispatch<SetStateAction<boolean>>;
  readData: () => void;
};

export type GPVTG = {
  type: 'GPVTG';
  speed: string;
};

export type GPGGA = {
  type: 'GPGGA';
  latitude: string;
  longitude: string;
  fixQuality: string;
  numberOfSatellitesBeingTracked: string;
  altitude: string;
};

export type GPRMC = {
  type: 'GPRMC';
  time: string;
  date: string;
};

export type GPGSV = {
  type: 'GPGSV';
  satellitesInView: string;
};

export type GPGSA = {
  type: 'GPGSA';
};

export type GPGLL = {
  type: 'GPGLL';
};

export type NMEASentence =
  | GPRMC
  | GPGGA
  | GPGSV
  | GPGSA
  | GPGLL
  | GPVTG
  | undefined;
