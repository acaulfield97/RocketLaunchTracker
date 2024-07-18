import { GeoPoint, Timestamp } from "@react-native-firebase/firestore";

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