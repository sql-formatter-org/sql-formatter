import { FormatOptions } from './FormatOptions';
import { ParamItems } from './formatter/Params';

export class ConfigError extends Error {}

export const validateQuery = (query: string) => {
  if (typeof query !== 'string') {
    throw new Error('Invalid query argument. Expected string, instead got ' + typeof query);
  }
};

export const validateConfig = (cfg: FormatOptions): FormatOptions => {
  if ('multilineLists' in cfg) {
    throw new ConfigError('multilineLists config is no more supported.');
  }
  if ('newlineBeforeOpenParen' in cfg) {
    throw new ConfigError('newlineBeforeOpenParen config is no more supported.');
  }
  if ('newlineBeforeCloseParen' in cfg) {
    throw new ConfigError('newlineBeforeCloseParen config is no more supported.');
  }
  if ('aliasAs' in cfg) {
    throw new ConfigError('aliasAs config is no more supported.');
  }

  if (cfg.expressionWidth <= 0) {
    throw new ConfigError(
      `expressionWidth config must be positive number. Received ${cfg.expressionWidth} instead.`
    );
  }

  if (cfg.commaPosition === 'before' && cfg.useTabs) {
    throw new ConfigError(
      'commaPosition: before does not work when tabs are used for indentation.'
    );
  }

  if (cfg.params && !validateParams(cfg.params)) {
    // eslint-disable-next-line no-console
    console.warn('WARNING: All "params" option values should be strings.');
  }

  return cfg;
};

const validateParams = (params: ParamItems | string[]): boolean => {
  const paramValues = params instanceof Array ? params : Object.values(params);
  return paramValues.every(p => typeof p === 'string');
};
