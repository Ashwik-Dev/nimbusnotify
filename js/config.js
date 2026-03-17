export const config = {
  position: "bottom-center",
  duration: 6,
  maxToasts: 3,
  maxQueue: 5,
  closable: true,
};

export function updateConfig(options = {}) {
  if (options.position) config.position = options.position;
  if (options.duration) config.duration = options.duration;
  if (options.maxToasts) config.maxToasts = options.maxToasts;
  if (options.maxQueue) config.maxQueue = options.maxQueue;
  if (options.closable) config.closable = options.closable;
}
