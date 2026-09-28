import { describe, expect, test } from 'vitest';
import { NodeEnv, validateEnvironment } from './environment.js';

describe('validateEnvironment', () => {
  test('пустое окружение заполняется значениями по умолчанию', () => {
    const environment = validateEnvironment({});

    expect(environment.NODE_ENV).toBe(NodeEnv.Development);
    expect(environment.PORT).toBe(3000);
  });

  test('PORT приводится из строки к числу', () => {
    expect(validateEnvironment({ PORT: '8080' }).PORT).toBe(8080);
  });

  test('недопустимый PORT останавливает запуск', () => {
    expect(() => validateEnvironment({ PORT: '70000' })).toThrow(/переменные окружения/);
  });

  test('неизвестный NODE_ENV останавливает запуск', () => {
    expect(() => validateEnvironment({ NODE_ENV: 'staging' })).toThrow(/переменные окружения/);
  });
});
