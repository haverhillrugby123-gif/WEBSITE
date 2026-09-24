export const forbiddenClientAPI = /\b(fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|WebSocket|indexedDB)\b|document\s*\.\s*cookie/;
export function checkReferences(html, fail) {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  if (new Set(ids).size !== ids.length) fail('duplicate element IDs');
  const idSet = new Set(ids);
  for (const attr of ['aria-labelledby','aria-controls','aria-describedby']) {
    for (const match of html.matchAll(new RegExp('\\b' + attr + '="([^"]+)"','g'))) {
      for (const ref of match[1].split(/\s+/)) if (ref && !idSet.has(ref)) fail(`${attr} references missing id ${ref}`);
    }
  }
  for (const label of html.matchAll(/<label\b[^>]*\bfor="([^"]+)"/g)) {
    const target = [...html.matchAll(/<(input|textarea|select|button|output|meter|progress)\b[^>]*>/g)].some(m=>new RegExp('\\bid="'+label[1]+'"').test(m[0]));
    if (!target) fail(`label references missing control ${label[1]}`);
  }
}

export function checkPrivacy(html, scripts, fail) {
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    const [,attrs,body] = match;
    if (/type="application\/ld\+json"/.test(attrs)) { JSON.parse(body); continue; }
    const src = attrs.match(/\bsrc="([^"]+)"/)?.[1];
    if (!src || !scripts.some(script => src === script || src === '../'+script)) fail('unapproved executable script');
    if (body.trim()) fail('inline executable script');
  }
}
