export type IpLocation = {
  city: string;
  state: string;
};

const UNKNOWN_LOCATION: IpLocation = {
  city: 'unknown',
  state: 'unknown',
};

type IpApiResponse = {
  status: 'success' | 'fail';
  city?: string;
  region?: string;
  regionName?: string;
  message?: string;
};

function normalizeIp(ip: string): string {
  return ip.replace(/^::ffff:/, '').trim();
}

function isPrivateOrLocalIp(ip: string): boolean {
  const normalized = normalizeIp(ip);

  if (!normalized || normalized === 'unknown' || normalized === 'localhost') {
    return true;
  }

  if (normalized === '::1' || normalized === '127.0.0.1') {
    return true;
  }

  const parts = normalized.split('.').map(Number);
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
    return false;
  }

  const [first, second] = parts;

  return (
    first === 10 ||
    first === 127 ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  );
}

export async function getLocationByIp(ip: string): Promise<IpLocation> {
  if (isPrivateOrLocalIp(ip)) {
    return UNKNOWN_LOCATION;
  }

  const normalizedIp = normalizeIp(ip);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(normalizedIp)}?fields=status,city,region,regionName,message`,
      { signal: controller.signal },
    );

    if (!response.ok) {
      return UNKNOWN_LOCATION;
    }

    const data = (await response.json()) as IpApiResponse;

    if (data.status !== 'success') {
      return UNKNOWN_LOCATION;
    }

    return {
      city: data.city?.trim() || 'unknown',
      state: data.region?.trim() || data.regionName?.trim() || 'unknown',
    };
  } catch {
    return UNKNOWN_LOCATION;
  } finally {
    clearTimeout(timeout);
  }
}
