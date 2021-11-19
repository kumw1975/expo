import { cleanup } from '@testing-library/react-native';

afterEach(cleanup);

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
