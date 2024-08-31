const getBondedDevices = jest.fn();
const isBluetoothEnabled = jest.fn();
const requestBluetoothEnabled = jest.fn();

const BluetoothDevice = jest.fn().mockImplementation(() => ({
  read: jest.fn(),
  clear: jest.fn(),
  disconnect: jest.fn().mockResolvedValue(undefined),
  isConnected: jest.fn(),
  connect: jest.fn(),
  onDataReceived: jest.fn(),
  name: 'MockDevice',
  address: '00:11:22:33:44:55',
  id: 'mock-id',
  bonded: true,
  deviceClass: 'mock-class',
  rssi: 0,
  extra: new Map(),
}));

export default {
  getBondedDevices,
  isBluetoothEnabled,
  requestBluetoothEnabled,
  BluetoothDevice,
};
