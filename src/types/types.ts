import { GeoPoint } from "@react-native-firebase/firestore";

export type RouteTab = {
  name: 'Account' | 'Map' | 'Bluetooth' | 'RawData' | 'LocationData';
};

export type RootStackParamList = {
  BluetoothTerminal: undefined;
  RawData: { parsedData: any[] };
  CreateAccount: undefined;
  Login: undefined;
};

export type LaunchData = {
  location: GeoPoint,
  altitude: number,
  time: string
}