import {renderHook, act} from '@testing-library/react-hooks';
import {useBluetooth} from '../../../src/components/bluetooth/useBluetooth';
import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';
import {
  connectToDeviceUtil,
  disconnectFromDevice,
} from '../../../src/components/bluetooth/BluetoothUtils';
import {parseDataStream} from '../../../src/components/bluetooth/DataParserNMEA';
import {Alert} from 'react-native';

function convertToDecimal(coordinate: string, direction: string): number {
  if (!coordinate || !direction) {
    console.log('Invalid coordinate or direction:', coordinate, direction);
    return 0;
  }
  let degrees = 0,
    minutes = 0;

  if (direction === 'N' || direction === 'S') {
    degrees = parseFloat(coordinate.slice(0, 2));
    minutes = parseFloat(coordinate.slice(2));
  } else if (direction === 'E' || direction === 'W') {
    degrees = parseFloat(coordinate.slice(0, 3));
    minutes = parseFloat(coordinate.slice(3));
  }

  let decimal = degrees + minutes / 60;
  if (direction === 'S' || direction === 'W') decimal = -decimal;

  console.log(`Converted ${coordinate} ${direction} to ${decimal}`);
  return decimal;
}

// Mock RNBluetoothClassic
jest.mock('react-native-bluetooth-classic', () => ({
  getBondedDevices: jest.fn(),
  BluetoothDevice: jest.fn().mockImplementation(() => ({
    read: jest.fn(),
    disconnect: jest.fn(),
    clear: jest.fn(),
  })),
}));

// Mock BluetoothUtils
jest.mock('../../../src/components/bluetooth/BluetoothUtils', () => ({
  checkBluetoothEnabled: jest.fn(),
  requestBluetoothPermissions: jest.fn().mockResolvedValue(true),
  connectToDeviceUtil: jest.fn(),
  disconnectFromDevice: jest.fn(),
}));

// Mock DataParserNMEA
jest.mock('../../../src/components/bluetooth/DataParserNMEA', () => ({
  parseDataStream: jest.fn(),
}));

// Mock Alert from react-native
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

describe('useBluetooth Hook', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialise with default values', () => {
    const {result} = renderHook(() => useBluetooth());
    expect(result.current.pairedDevices).toEqual([]);
    expect(result.current.selectedDevice).toBeUndefined();
    expect(result.current.isConnected).toBe(false);
    expect(result.current.connectingDeviceId).toBeNull();
    expect(result.current.dataReceivingStatus).toBe(false);
  });

  it('should fetch paired devices on setup', async () => {
    const mockDevices = [{id: '1', name: 'Device 1'}];
    (RNBluetoothClassic.getBondedDevices as jest.Mock).mockResolvedValue(
      mockDevices,
    );

    const {result, waitForNextUpdate} = renderHook(() => useBluetooth());

    await waitForNextUpdate();

    expect(result.current.pairedDevices).toEqual(mockDevices);
  });

  it('should handle connecting to a device', async () => {
    const mockDevice = {
      id: '1',
      name: 'Device 1',
    } as unknown as BluetoothDevice;
    (connectToDeviceUtil as jest.Mock).mockResolvedValue(true);

    const {result} = renderHook(() => useBluetooth());

    await act(async () => {
      await result.current.connectToDevice(mockDevice);
    });

    expect(result.current.selectedDevice).toEqual(mockDevice);
    expect(result.current.isConnected).toBe(true);
  });

  it('should handle disconnection', async () => {
    const mockDevice = {
      clear: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn().mockResolvedValue(undefined),
    } as unknown as BluetoothDevice;

    (disconnectFromDevice as jest.Mock).mockImplementation(
      async (device: BluetoothDevice, callback: () => void) => {
        await device.clear();
        await device.disconnect();
        callback();
      },
    );

    const {result, waitForNextUpdate} = renderHook(() => useBluetooth());

    await act(async () => {
      await result.current.connectToDevice(mockDevice);
    });

    await act(async () => {
      await result.current.disconnect();
    });

    await waitForNextUpdate({timeout: 5000});

    expect(mockDevice.clear).toHaveBeenCalled();
    expect(mockDevice.disconnect).toHaveBeenCalled();
    expect(result.current.selectedDevice).toBeUndefined();
    expect(result.current.isConnected).toBe(false);
  }, 10000);

  it('should read and process multiple data sentences correctly', async () => {
    const mockDevice = {
      id: 'mock-device-id',
      name: 'Mock Device',
      address: '00:11:22:33:44:55',
      rssi: -50,
      connect: jest.fn().mockResolvedValue(true),
      disconnect: jest.fn().mockResolvedValue(true),
      isConnected: jest.fn().mockResolvedValue(true),
      write: jest.fn().mockResolvedValue(true),
      read: jest
        .fn()
        .mockResolvedValueOnce(
          '$GPGGA,161229.487,3723.2475,N,12158.3416,W,1,07,1.0,9.0,M,,,,0000*18',
        ) // First sentence
        .mockResolvedValueOnce(
          '$GPGSV,123456,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12',
        ) // Second sentence
        .mockResolvedValueOnce(
          '$GPRMC,161229.487,A,3723.2475,N,12158.3416,W,0.0,0.0,010101,0.0,0.0',
        ) // Third sentence
        .mockResolvedValueOnce('$GPVTG,0.0,T,0.0,M,0.0,N,0.0,K') // Fourth sentence
        .mockRejectedValueOnce(new Error('Read error')), // Simulate read error
      // Additional methods if needed
    } as unknown as BluetoothDevice;

    const parsedData1 = {
      type: 'GPGGA',
      latitude: '3723.2475 N',
      longitude: '12158.3416 W',
      altitude: '9.0',
      numberOfSatellitesBeingTracked: '7',
      fixQuality: '1',
    };

    const parsedData2 = {
      type: 'GPGSV',
      satellitesInView: '12',
    };

    const parsedData3 = {
      type: 'GPRMC',
      time: '161229.487',
      date: '010101',
    };

    const parsedData4 = {
      type: 'GPVTG',
      speed: '0.0',
    };

    (parseDataStream as jest.Mock)
      .mockReturnValueOnce(parsedData1)
      .mockReturnValueOnce(parsedData2)
      .mockReturnValueOnce(parsedData3)
      .mockReturnValueOnce(parsedData4);

    const {result, waitForNextUpdate} = renderHook(() => useBluetooth());

    await act(async () => {
      await result.current.connectToDevice(mockDevice);
      await result.current.readData(); // Trigger multiple reads
      await result.current.readData();
    });

    // Increase timeout to ensure hook processes data
    await waitForNextUpdate({timeout: 10000});

    const expectedLatitude = convertToDecimal('3723.2475', 'N');
    const expectedLongitude = convertToDecimal('12158.3416', 'W');

    // Ensure the hook's data matches the expected values
    expect(result.current.rocketData.latitude).toBeCloseTo(expectedLatitude, 5);
    expect(result.current.rocketData.longitude).toBeCloseTo(
      expectedLongitude,
      5,
    );
    expect(result.current.rocketData.altitude).toBe(9.0);
    expect(result.current.rocketData.satellitesInView).toBe(12);
    expect(result.current.rocketData.time).toBe(161229.487);
    expect(result.current.rocketData.date).toBe(10101);
    expect(result.current.rocketData.speed).toBe(0.0);
    expect(result.current.dataReceivingStatus).toBe(true);

    // Ensure parseDataStream was called with the correct arguments
    expect(parseDataStream).toHaveBeenCalledTimes(4);
    expect(parseDataStream).toHaveBeenCalledWith(
      '$GPGGA,161229.487,3723.2475,N,12158.3416,W,1,07,1.0,9.0,M,,,,0000*18',
    );
    expect(parseDataStream).toHaveBeenCalledWith(
      '$GPGSV,123456,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12',
    );
    expect(parseDataStream).toHaveBeenCalledWith(
      '$GPRMC,161229.487,A,3723.2475,N,12158.3416,W,0.0,0.0,010101,0.0,0.0',
    );
    expect(parseDataStream).toHaveBeenCalledWith(
      '$GPVTG,0.0,T,0.0,M,0.0,N,0.0,K',
    );

    // Debugging logs
    console.log('Rocket Data from Hook:', result.current.rocketData);
    console.log('Expected Latitude:', expectedLatitude);
    console.log('Latitude from Hook:', result.current.rocketData.latitude);
    console.log('Expected Longitude:', expectedLongitude);
    console.log('Longitude from Hook:', result.current.rocketData.longitude);
  });

  it('should handle read errors', async () => {
    const mockDevice = {
      read: jest.fn().mockRejectedValue(new Error('Read error')),
    } as unknown as BluetoothDevice;

    const {result} = renderHook(() => useBluetooth());

    await act(async () => {
      await result.current.connectToDevice(mockDevice);
      await result.current.readData();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Bluetooth disrupted. Please reconnect.',
    );
    expect(result.current.isConnected).toBe(false);
  });
});
