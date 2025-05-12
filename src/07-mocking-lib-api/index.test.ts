import axios from 'axios';
import { throttledGetDataFromApi, THROTTLE_TIME } from './index';

jest.mock('lodash/throttle', () => {
  const original = jest.requireActual('lodash/throttle');
  return (fn: any, wait: number) => original(fn, wait);
});

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockGet = jest.fn();

beforeEach(() => {
  mockGet.mockClear();
  mockedAxios.create.mockReturnValue({ get: mockGet } as any);
});

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('should perform request to correct provided url', async () => {
    mockGet.mockResolvedValueOnce({ data: { message: 'Success' } });

    const result = throttledGetDataFromApi('/todos/1');

    jest.advanceTimersByTime(THROTTLE_TIME);
    await Promise.resolve();
    await result;

    expect(mockGet).toHaveBeenCalledWith('/todos/1');
  });

  test('should return response data', async () => {
    mockGet.mockResolvedValueOnce({ data: { message: 'Success' } });

    const result = throttledGetDataFromApi('/posts/1');

    jest.advanceTimersByTime(THROTTLE_TIME);
    await Promise.resolve();
    const data = await result;

    expect(data).toEqual({ message: 'Success' });
  });

  test('should not allow multiple rapid calls', async () => {
    mockGet.mockResolvedValue({ data: { message: 'Success' } });

    const result1 = throttledGetDataFromApi('/posts/1');

    jest.advanceTimersByTime(THROTTLE_TIME);
    await Promise.resolve();
    await result1;

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith('/posts/1');
  });
});
