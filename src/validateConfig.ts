import { FormatOptions } from './FormatOptions.js';
import { ParamItems } from './formatter/Params.js';

export class ConfigError extends Error {}

export function validateConfig(cfg: FormatOptions): FormatOptions {
  const removedOptions = [
    'multilineLists',
    'newlineBeforeOpenParen',
    'newlineBeforeCloseParen',
    'aliasAs',
    'commaPosition',
    'tabulateAlias',
  ];
  for (const optionName of removedOptions) {
    if (optionName in cfg) {
      throw new ConfigError(`${optionName} config is no more supported.`);
    }
  }

  if (cfg.expressionWidth <= 0) {
    throw new ConfigError(
      `expressionWidth config must be positive number. Received ${cfg.expressionWidth} instead.`
    );
  }

  if (cfg.params && !validateParams(cfg.params)) {
    // eslint-disable-next-line no-console
    console.warn('WARNING: All "params" option values should be strings.');
  }

  return cfg;
}

function validateParams(params: ParamItems | string[]): boolean {
  const paramValues = params instanceof Array ? params : Object.values(params);
  return paramValues.every(p => typeof p === 'string');
}
