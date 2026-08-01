const DEFAULT_TIMEZONE = 'America/Sao_Paulo';

export function getDatabaseConnectionString(): string {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL não configurada');
  }

  const timezone = process.env.DATABASE_TIMEZONE?.trim() || DEFAULT_TIMEZONE;
  const timezoneOption = encodeURIComponent(`-c TimeZone=${timezone}`);
  const separator = connectionString.includes('?') ? '&' : '?';

  return `${connectionString}${separator}options=${timezoneOption}`;
}
