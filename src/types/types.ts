import {GeoPoint} from '@react-native-firebase/firestore';
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
  date: string;
  speed: number;
  numberOfSatellitesBeingTracked: number;
  satellitesInView: number;
  fixQuality: number;
};

export type RocketPosition = {
  latitude: number;
  longitude: number;
  altitude: number;
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
};

export type GPVTG = {
  type: 'GPVTG';
  // course: string;
  speed: string;
};

export type GPGGA = {
  type: 'GPGGA';
  time: string;
  latitude: string;
  longitude: string;
  fixQuality: string;
  numberOfSatellitesBeingTracked: string;
  altitude: string;
};

export type GPRMC = {
  type: 'GPRMC';
  // time: string;
  // status: string;
  // latitude: string;
  // longitude: string;
  // speed: string;
  date: string;
};

export type GPGSV = {
  type: 'GPGSV';
  // numberOfMessages: string;
  // messageNumber: string;
  satellitesInView: string;
  // satellitesInfo: string[];
};

export type GPGSA = {
  type: 'GPGSA';
  // mode: string;
  // fixType: string;
  // satellitesUsed: string[];
};

export type GPGLL = {
  type: 'GPGLL';
  // latitude: string;
  // longitude: string;
  // time: string;
};

export type NMEASentence =
  | GPRMC
  | GPGGA
  | GPGSV
  | GPGSA
  | GPGLL
  | GPVTG
  | undefined;
