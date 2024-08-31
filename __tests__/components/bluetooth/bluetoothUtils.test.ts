import {
  checkBluetoothEnabled,
  requestBluetoothPermissions,
  connectToDeviceUtil,
} from '../../../src/components/bluetooth/BluetoothUtils';
import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';
import {Alert, PermissionsAndroid, Platform} from 'react-native';

// Mocking external modules
jest.mock('react-native-bluetooth-classic', () => ({
  isBluetoothEnabled: jest.fn(),
  requestBluetoothEnabled: jest.fn(),
}));

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
  PermissionsAndroid: {
    request: jest.fn(),
    PERMISSIONS: {
      BLUETOOTH_SCAN: 'android.permission.BLUETOOTH_SCAN',
      BLUETOOTH_CONNECT: 'android.permission.BLUETOOTH_CONNECT',
      ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
    },
  },
  Platform: {
    OS: 'android',
  },
}));

describe('Bluetooth Utility Functions', () => {
  // Top-level test suite containing multiple neste test suites

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkBluetoothEnabled', () => {
    // Test cases for checking if Bluetooth is enabled and requests to enable if not

    it('should request Bluetooth to be enabled if it is not already enabled', async () => {
      (RNBluetoothClassic.isBluetoothEnabled as jest.Mock).mockResolvedValue(
        false,
      );
      (
        RNBluetoothClassic.requestBluetoothEnabled as jest.Mock
      ).mockResolvedValue(undefined);

      await checkBluetoothEnabled();

      expect(RNBluetoothClassic.requestBluetoothEnabled).toHaveBeenCalled();
    });

    it('should not request Bluetooth to be enabled if it is already enabled', async () => {
      (RNBluetoothClassic.isBluetoothEnabled as jest.Mock).mockResolvedValue(
        true,
      );

      await checkBluetoothEnabled();

      expect(RNBluetoothClassic.requestBluetoothEnabled).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      (RNBluetoothClassic.isBluetoothEnabled as jest.Mock).mockRejectedValue(
        new Error('Bluetooth Classic is not available on this device.'),
      );

      await checkBluetoothEnabled();

      // Error is logged to the console
      expect(console.error).toHaveBeenCalledWith(
        'Bluetooth Classic is not available on this device.',
      );
    });
  });

  describe('requestBluetoothPermissions', () => {
    it('should request all Bluetooth permissions and return true if all are granted', async () => {
      (PermissionsAndroid.request as jest.Mock)
        .mockResolvedValueOnce(PermissionsAndroid.RESULTS.GRANTED)
        .mockResolvedValueOnce(PermissionsAndroid.RESULTS.GRANTED)
        .mockResolvedValueOnce(PermissionsAndroid.RESULTS.GRANTED);

      const result = await requestBluetoothPermissions();

      expect(result).toBe(true);
    });

    it('should return false if any permission is denied', async () => {
      (PermissionsAndroid.request as jest.Mock)
        .mockResolvedValueOnce(PermissionsAndroid.RESULTS.GRANTED)
        .mockResolvedValueOnce(PermissionsAndroid.RESULTS.GRANTED)
        .mockResolvedValueOnce(PermissionsAndroid.RESULTS.DENIED);

      const result = await requestBluetoothPermissions();

      expect(result).toBe(false);
    });

    it('should handle errors gracefully', async () => {
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      (PermissionsAndroid.request as jest.Mock).mockRejectedValue(
        new Error('Error'),
      );

      const result = await requestBluetoothPermissions();

      expect(result).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith(new Error('Error'));

      consoleWarnSpy.mockRestore();
    });
  });

  describe('connectToDeviceUtil', () => {
    const mockDevice: jest.Mocked<BluetoothDevice> = {
      isConnected: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn(),
      clear: jest.fn(),
      onDataReceived: jest.fn(),
      name: 'MockDevice',
      address: '00:11:22:33:44:55',
      id: 'mock-id',
      bonded: true,
      deviceClass: 'mock-class',
      rssi: 0,
      extra: new Map(),
    } as unknown as jest.Mocked<BluetoothDevice>;

    it('should connect to the device if not already connected', async () => {
      (mockDevice.isConnected as jest.Mock).mockResolvedValue(false);

      await connectToDeviceUtil(mockDevice);

      expect(mockDevice.connect).toHaveBeenCalledWith({
        connectorType: 'rfcomm',
        DELIMITER: '\n',
        DEVICE_CHARSET: Platform.OS === 'ios' ? 1536 : 'utf-8',
      });
    });

    it('should not connect to the device if it is already connected', async () => {
      (mockDevice.isConnected as jest.Mock).mockResolvedValue(true);

      await connectToDeviceUtil(mockDevice);

      expect(mockDevice.connect).not.toHaveBeenCalled();
    });

    it('should handle connection errors gracefully', async () => {
      (mockDevice.isConnected as jest.Mock).mockResolvedValue(false);
      (mockDevice.connect as jest.Mock).mockRejectedValue(
        new Error('Connection Error'),
      );

      await connectToDeviceUtil(mockDevice);

      expect(Alert.alert).toHaveBeenCalledWith('Could not connect to device.');
    });
  });
});
