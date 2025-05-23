import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const account = getBankAccount(100);
    expect(account.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(50);
    expect(() => account.withdraw(100)).toThrow(InsufficientFundsError);
    expect(() => account.withdraw(100)).toThrow(
      'Insufficient funds: cannot withdraw more than 50',
    );
  });

  test('should throw error when transferring more than balance', () => {
    const from = getBankAccount(30);
    const to = getBankAccount(10);
    expect(() => from.transfer(100, to)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(100);
    expect(() => account.transfer(50, account)).toThrow(TransferFailedError);
    expect(() => account.transfer(50, account)).toThrow('Transfer failed');
  });

  test('should deposit money', () => {
    const account = getBankAccount(100);
    account.deposit(50);
    expect(account.getBalance()).toBe(150);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(200);
    account.withdraw(80);
    expect(account.getBalance()).toBe(120);
  });

  test('should transfer money', () => {
    const from = getBankAccount(300);
    const to = getBankAccount(100);
    from.transfer(150, to);
    expect(from.getBalance()).toBe(150);
    expect(to.getBalance()).toBe(250);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(100);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(42); // правильно замокаем метод

    const balance = await account.fetchBalance();

    expect(typeof balance).toBe('number');
    expect(balance).toBe(42);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(100);

    jest.spyOn(account, 'fetchBalance').mockResolvedValue(77);

    await account.synchronizeBalance();

    expect(account.getBalance()).toBe(77);

    (
      account.fetchBalance as jest.MockedFunction<typeof account.fetchBalance>
    ).mockRestore();
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(100);

    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);

    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
    await expect(account.synchronizeBalance()).rejects.toThrow(
      'Synchronization failed',
    );

    (
      account.fetchBalance as jest.MockedFunction<typeof account.fetchBalance>
    ).mockRestore();
  });
});
