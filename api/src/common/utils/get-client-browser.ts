import type { Request } from 'express';

const BROWSER_PATTERNS: Array<{ name: string; pattern: RegExp }> = [
  { name: 'Edge', pattern: /\bEdg\//i },
  { name: 'Opera', pattern: /\bOPR\/|Opera/i },
  { name: 'Samsung Internet', pattern: /SamsungBrowser/i },
  { name: 'Brave', pattern: /\bBrave/i },
  { name: 'Firefox', pattern: /\bFirefox\/|FxiOS/i },
  { name: 'Chrome', pattern: /\bChrome\/|CriOS/i },
  { name: 'Chromium', pattern: /\bChromium/i },
  { name: 'Safari', pattern: /\bSafari\//i },
  { name: 'Internet Explorer', pattern: /\bMSIE\b|Trident/i },
];

export function getClientBrowser(req: Request): string {
  const userAgent = req.headers['user-agent'];

  if (typeof userAgent !== 'string' || userAgent.length === 0) {
    return 'unknown';
  }

  return parseBrowserFromUserAgent(userAgent);
}

export function parseBrowserFromUserAgent(userAgent: string): string {
  for (const { name, pattern } of BROWSER_PATTERNS) {
    if (pattern.test(userAgent)) {
      return name;
    }
  }

  return 'unknown';
}
