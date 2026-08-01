const VARIAVEIS_OBRIGATORIAS = [
  'DATABASE_URL',
  'JWT_SECRET',
  'REDIS_HOST',
  'REDIS_PORT',
  'SWAGGER_USER',
  'SWAGGER_PASSWORD',
] as const;

export function validarEnv(config: Record<string, unknown>): Record<string, unknown> {
  const faltando = VARIAVEIS_OBRIGATORIAS.filter((variavel) => {
    const valor = config[variavel];

    if (valor === undefined || valor === null) {
      return true;
    }

    return typeof valor === 'string' && valor.trim() === '';
  });

  if (faltando.length > 0) {
    throw new Error(`Variáveis de ambiente obrigatórias ausentes: ${faltando.join(', ')}`);
  }

  return config;
}
