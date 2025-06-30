import { TskvLogger } from './tskv.logger';

describe('TskvLogger tests', () => {
  let tskvLogger: TskvLogger;
  const params = 'tskv params';

  beforeEach(() => {
    tskvLogger = new TskvLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('.log() should be log in tskv format', () => {
    const mockFunction = jest
      .spyOn(console, 'log')
      .mockImplementation(() => {});
    const message = 'tskv log';
    tskvLogger.log(message, params);
    const result = `level=log\tmessage=${message}\toptionalParams=${params}`;
    expect(mockFunction).toHaveBeenCalledWith(result);
  });

  it('.error() should be error in tskv format', () => {
    const mockFunction = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const message = 'tskv error';
    tskvLogger.error(message, params);
    const result = `level=error\tmessage=${message}\toptionalParams=${params}`;
    expect(mockFunction).toHaveBeenCalledWith(result);
  });

  it('.warn() should be warn in tskv format', () => {
    const mockFunction = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
    const message = 'tskv warn';
    tskvLogger.warn(message, params);
    const result = `level=warn\tmessage=${message}\toptionalParams=${params}`;
    expect(mockFunction).toHaveBeenCalledWith(result);
  });
});
