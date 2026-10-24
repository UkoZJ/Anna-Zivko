// Exact destinations only; the public project path is case-sensitive.
export const publicDestinations = ['http://127.0.0.1:5173/', 'http://localhost:5173/', 'https://ukozj.github.io/Anna-Zivko/'];
export const supportedLocales = ['ca', 'es', 'it', 'sl'];
export function selectLocale(explicit, manual, invitation, browser = []) {
  return [explicit, manual, invitation, ...browser.map(value => value.split('-')[0]), 'ca']
    .find(value => supportedLocales.includes(value));
}
export function validInvite(value) { return typeof value === 'string' && /^[a-f0-9]{64}$/.test(value); }
export function invitationFromURL(value) {
  const url = new URL(value);
  const query = url.searchParams.getAll('invite');
  const fragment = new URLSearchParams(url.hash.slice(1)).getAll('invite');
  const values = [...query, ...fragment];
  return values.length === 1 && validInvite(values[0]) ? values[0] : '';
}
export function publicReturnURL(candidate, locale, token = '') {
  try {
    const input = new URL(candidate);
    if (input.username || input.password || !publicDestinations.includes(input.origin + input.pathname)) return null;
    const result = new URL(input.origin + input.pathname);
    result.searchParams.set('lang', selectLocale(locale));
    const variant = input.searchParams.get('variant');
    if (['A', 'B', 'C'].includes(variant)) result.searchParams.set('variant', variant);
    // Rebuild instead of copying arbitrary parameters. Fragment avoids server/referrer exposure.
    if (validInvite(token)) result.hash = new URLSearchParams({invite: token}).toString();
    return result.href;
  } catch { return null; }
}
export function rsvpNavigation(deployment, page, locale) {
  let target;
  try {
    target = new URL(deployment);
    if (target.origin !== 'https://script.google.com' || !/^\/macros\/s\/[\w-]+\/exec$/.test(target.pathname) || target.search || target.hash || target.username || target.password) return {error: 'configuration'};
  } catch { return {error: 'configuration'}; }
  const token = invitationFromURL(page);
  if (!token) return {error: 'invitation'};
  const returnTo = publicReturnURL(page, locale);
  if (!returnTo) return {error: 'configuration'};
  const parameters = new URLSearchParams({invite: token, returnTo});
  // A neutral homepage must let the invitation's current dashboard locale win.
  if (supportedLocales.includes(locale)) parameters.set('lang', locale);
  target.search = parameters.toString();
  return {href: target.href};
}
