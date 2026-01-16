import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosInstance,
  AxiosStatic,
} from 'axios';

const denyList = new Set([
  'ENOTFOUND',
  'ENETUNREACH',
  'UNABLE_TO_GET_ISSUER_CERT',
  'UNABLE_TO_GET_CRL',
  'UNABLE_TO_DECRYPT_CERT_SIGNATURE',
  'UNABLE_TO_DECRYPT_CRL_SIGNATURE',
  'UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY',
  'CERT_SIGNATURE_FAILURE',
  'CRL_SIGNATURE_FAILURE',
  'CERT_NOT_YET_VALID',
  'CERT_HAS_EXPIRED',
  'CRL_NOT_YET_VALID',
  'CRL_HAS_EXPIRED',
  'ERROR_IN_CERT_NOT_BEFORE_FIELD',
  'ERROR_IN_CERT_NOT_AFTER_FIELD',
  'ERROR_IN_CRL_LAST_UPDATE_FIELD',
  'ERROR_IN_CRL_NEXT_UPDATE_FIELD',
  'OUT_OF_MEM',
  'DEPTH_ZERO_SELF_SIGNED_CERT',
  'SELF_SIGNED_CERT_IN_CHAIN',
  'UNABLE_TO_GET_ISSUER_CERT_LOCALLY',
  'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
  'CERT_CHAIN_TOO_LONG',
  'CERT_REVOKED',
  'INVALID_CA',
  'PATH_LENGTH_EXCEEDED',
  'INVALID_PURPOSE',
  'CERT_UNTRUSTED',
  'CERT_REJECTED',
  'HOSTNAME_MISMATCH',
]);

function isRetryAllowed(error: any): boolean {
  return !denyList.has(error && error?.code);
}

export interface IAxiosRetryConfig {
  retries?: number;
  shouldResetTimeout?: boolean;
  retryCondition?: (error: AxiosError) => boolean | Promise<boolean>;
  retryDelay?: (retryCount: number, error: AxiosError) => number;
  onRetry?: (
    retryCount: number,
    error: AxiosError,
    requestConfig: AxiosRequestConfig
  ) => Promise<void> | void;
  onMaxRetryTimesExceeded?: (
    error: AxiosError,
    retryCount: number
  ) => Promise<void> | void;
}

export interface IAxiosRetryConfigExtended extends IAxiosRetryConfig {
  retryCount?: number;
  lastRequestTime?: number;
}

export interface IAxiosRetryReturn {
  requestInterceptorId: number;
  responseInterceptorId: number;
}

export interface AxiosRetry {
  (
    axiosInstance: AxiosStatic | AxiosInstance,
    axiosRetryConfig?: IAxiosRetryConfig
  ): IAxiosRetryReturn;

  isNetworkError(error: AxiosError): boolean;
  isRetryableError(error: AxiosError): boolean;
  isSafeRequestError(error: AxiosError): boolean;
  isIdempotentRequestError(error: AxiosError): boolean;
  isNetworkOrIdempotentRequestError(error: AxiosError): boolean;
  exponentialDelay(
    retryNumber?: number,
    error?: AxiosError,
    delayFactor?: number
  ): number;
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    'axios-retry'?: IAxiosRetryConfigExtended;
  }
}

export const namespace = 'axios-retry';

export function isNetworkError(error: any) {
  const CODE_EXCLUDE_LIST = ['ERR_CANCELED', 'ECONNABORTED'];
  if (error.response) {
    return false;
  }
  if (!error.code) {
    return false;
  }
  if (CODE_EXCLUDE_LIST.includes(error.code)) {
    return false;
  }
  return isRetryAllowed(error);
}

const SAFE_HTTP_METHODS = ['get', 'head', 'options'];
const IDEMPOTENT_HTTP_METHODS = SAFE_HTTP_METHODS.concat(['put', 'delete']);

export function isRetryableError(error: AxiosError): boolean {
  return (
    error.code !== 'ECONNABORTED' &&
    (!error.response ||
      (error.response.status >= 500 && error.response.status <= 599))
  );
}

export function isSafeRequestError(error: AxiosError): boolean {
  if (!error.config?.method) {
    return false;
  }

  return (
    isRetryableError(error) &&
    SAFE_HTTP_METHODS.indexOf(error.config.method) !== -1
  );
}

export function isIdempotentRequestError(error: AxiosError): boolean {
  if (!error.config?.method) {
    return false;
  }
  return (
    isRetryableError(error) &&
    IDEMPOTENT_HTTP_METHODS.indexOf(error.config.method) !== -1
  );
}

export function isNetworkOrIdempotentRequestError(error: AxiosError): boolean {
  return isNetworkError(error) || isIdempotentRequestError(error);
}

function noDelay() {
  return 0;
}

export function exponentialDelay(
  retryNumber = 0,
  _error: AxiosError | undefined = undefined,
  delayFactor = 100
): number {
  const delay = 2 ** retryNumber * delayFactor;
  const randomSum = delay * 0.2 * Math.random();
  return delay + randomSum;
}

export const DEFAULT_OPTIONS: Required<IAxiosRetryConfig> = {
  retries: 3,
  retryCondition: isNetworkOrIdempotentRequestError,
  retryDelay: noDelay,
  shouldResetTimeout: false,
  onRetry: () => {},
  onMaxRetryTimesExceeded: () => {},
};

function getRequestOptions(
  config: AxiosRequestConfig,
  defaultOptions: IAxiosRetryConfig
): Required<IAxiosRetryConfig> & IAxiosRetryConfigExtended {
  return { ...DEFAULT_OPTIONS, ...defaultOptions, ...config[namespace] };
}

function setCurrentState(
  config: AxiosRequestConfig,
  defaultOptions: IAxiosRetryConfig | undefined
) {
  const currentState = getRequestOptions(config, defaultOptions || {});
  currentState.retryCount = currentState.retryCount || 0;
  currentState.lastRequestTime = currentState.lastRequestTime || Date.now();
  config[namespace] = currentState;
  return currentState as Required<IAxiosRetryConfigExtended>;
}

function fixConfig(
  axiosInstance: AxiosInstance | AxiosStatic,
  config: AxiosRequestConfig
) {
  // @ts-ignore
  if (axiosInstance.defaults.agent === config.agent) {
    // @ts-ignore
    delete config.agent;
  }
  if (axiosInstance.defaults.httpAgent === config.httpAgent) {
    delete config.httpAgent;
  }
  if (axiosInstance.defaults.httpsAgent === config.httpsAgent) {
    delete config.httpsAgent;
  }
}

async function shouldRetry(
  currentState: Required<IAxiosRetryConfig> & IAxiosRetryConfigExtended,
  error: AxiosError
) {
  const { retries, retryCondition } = currentState;
  const shouldRetryOrPromise =
    (currentState.retryCount || 0) < retries && retryCondition(error);
  if (typeof shouldRetryOrPromise === 'object') {
    try {
      const shouldRetryPromiseResult = await shouldRetryOrPromise;
      return shouldRetryPromiseResult !== false;
    } catch (_err) {
      return false;
    }
  }
  return shouldRetryOrPromise;
}

async function handleMaxRetryTimesExceeded(
  currentState: Required<IAxiosRetryConfigExtended>,
  error: AxiosError
) {
  if (currentState.retryCount >= currentState.retries)
    await currentState.onMaxRetryTimesExceeded(error, currentState.retryCount);
}

const axiosRetry: AxiosRetry = (axiosInstance, defaultOptions) => {
  const requestInterceptorId = axiosInstance.interceptors.request.use(
    (config) => {
      setCurrentState(config, defaultOptions);
      return config;
    }
  );

  const responseInterceptorId = axiosInstance.interceptors.response.use(
    null,
    async (error) => {
      const { config } = error;
      if (!config) {
        return Promise.reject(error);
      }
      const currentState = setCurrentState(config, defaultOptions);
      if (await shouldRetry(currentState, error)) {
        currentState.retryCount += 1;
        const { retryDelay, shouldResetTimeout, onRetry } = currentState;
        const delay = retryDelay(currentState.retryCount, error);
        fixConfig(axiosInstance, config);
        if (
          !shouldResetTimeout &&
          config.timeout &&
          currentState.lastRequestTime
        ) {
          const lastRequestDuration = Date.now() - currentState.lastRequestTime;
          const timeout = config.timeout - lastRequestDuration - delay;
          if (timeout <= 0) {
            return Promise.reject(error);
          }
          config.timeout = timeout;
        }
        config.transformRequest = [(data: any) => data];
        await onRetry(currentState.retryCount, error, config);
        return new Promise((resolve) => {
          setTimeout(() => resolve(axiosInstance(config)), delay);
        });
      }

      await handleMaxRetryTimesExceeded(currentState, error);

      return Promise.reject(error);
    }
  );

  return { requestInterceptorId, responseInterceptorId };
};

axiosRetry.isNetworkError = isNetworkError;
axiosRetry.isSafeRequestError = isSafeRequestError;
axiosRetry.isIdempotentRequestError = isIdempotentRequestError;
axiosRetry.isNetworkOrIdempotentRequestError =
  isNetworkOrIdempotentRequestError;
axiosRetry.exponentialDelay = exponentialDelay;
axiosRetry.isRetryableError = isRetryableError;
export default axiosRetry;
