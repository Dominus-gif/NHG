// Blocks personal / free email providers so only work email addresses are accepted.

const FREE_DOMAINS = new Set([
  "gmail.com", "googlemail.com",
  "yahoo.com", "yahoo.co.uk", "yahoo.co.in", "yahoo.fr", "yahoo.de", "ymail.com", "rocketmail.com",
  "outlook.com", "outlook.co.uk", "hotmail.com", "hotmail.co.uk", "hotmail.fr", "live.com", "msn.com",
  "icloud.com", "me.com", "mac.com",
  "aol.com", "gmx.com", "gmx.net", "mail.com", "zoho.com",
  "yandex.com", "yandex.ru", "proton.me", "protonmail.com", "pm.me",
  "tutanota.com", "hey.com", "fastmail.com", "inbox.com", "hushmail.com", "qq.com", "163.com", "126.com",
]);

// Country/TLD variants of the big providers (e.g. hotmail.de, yahoo.com.au).
const FREE_LABELS = /\.(gmail|googlemail|yahoo|ymail|outlook|hotmail|live|msn|icloud|aol|proton|protonmail|gmx|yandex|tutanota)\.[a-z.]{2,}$/i;

export function isWorkEmail(email: string): boolean {
  const at = email.lastIndexOf("@");
  if (at < 0) return false;
  const domain = email.slice(at + 1).trim().toLowerCase();
  if (!domain.includes(".")) return false;
  if (FREE_DOMAINS.has(domain)) return false;
  if (FREE_LABELS.test("." + domain)) return false;
  return true;
}

export const WORK_EMAIL_ERROR =
  "Please use your work email address — personal accounts (Gmail, Outlook, Yahoo, etc.) aren't accepted.";
