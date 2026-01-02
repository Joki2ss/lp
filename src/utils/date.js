export function nowIso() {
  return new Date().toISOString();
}

export function formatTime(ts) {
  try {
    const d = typeof ts === 'string' ? new Date(ts) : ts;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}
