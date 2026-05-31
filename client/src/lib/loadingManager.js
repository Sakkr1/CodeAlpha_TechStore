let active = 0;
const listeners = new Set();

function notify() {
  listeners.forEach((fn) => fn(active > 0));
}

export function increment() {
  ++active;
  notify();
}

export function decrement() {
  if (--active < 0) active = 0;
  notify();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function isLoading() {
  return active > 0;
}
