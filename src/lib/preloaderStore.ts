export interface PreloaderState {
  progress: number;
  done: boolean;
}

let progress = 0;
let done = false;
const listeners = new Set<(state: PreloaderState) => void>();

function emit() {
  const state: PreloaderState = { progress, done };
  listeners.forEach((listener) => listener(state));
}

export const preloaderStore = {
  setProgress(value: number) {
    const next = Math.max(progress, Math.min(100, Math.round(value)));
    if (next !== progress) {
      progress = next;
      emit();
    }
  },
  finish() {
    if (done) return;
    done = true;
    progress = 100;
    emit();
  },
  subscribe(listener: (state: PreloaderState) => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getProgress: () => progress,
  isDone: () => done,
};