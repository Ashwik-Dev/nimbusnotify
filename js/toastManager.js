import { createToast } from "./toastComponent.js";
import { config } from "./config.js";

const toastBox = document.getElementById("toast-box");
const positions = [
  "bottom-right",
  "bottom-left",
  "bottom-center",
  "top-right",
  "top-left",
  "top-center",
];
const toastQueue = [];
const activeToasts = {};

const generateId = () => crypto.randomUUID();

export const updatePositions = function () {
  positions.forEach((pos) => toastBox.classList.remove(pos));
  toastBox.classList.add(`${config.position}`);
};

const removeToast = function (toast) {
  if (toast.classList.contains("hide")) return;

  toast.classList.add("hide");

  toast.addEventListener(
    "animationend",
    () => {
      const id = toast.dataset.id;
      delete activeToasts[id];
      toast.remove();

      if (toastQueue.length > 0) {
        const nextToast = toastQueue.shift();
        renderToast(nextToast);
      }
    },
    { once: true },
  );
};

const scheduleRemoval = function (toast, duration) {
  return setTimeout(() => {
    removeToast(toast);
  }, duration * 1000);
};

const renderToast = function (toastData) {
  const { type, message, duration, closable } = toastData;
  const id = generateId();

  const toast = createToast(type, message, closable);
  console.log(toast);
  toast.style.setProperty("--toast-duration", `${duration}s`);

  toastBox.appendChild(toast);
  activeToasts[id] = toast;
  toast.dataset.id = id;

  toast.timerId = scheduleRemoval(toast, duration);
  toast.startTime = Date.now();
  toast.remainingTime = duration * 1000;

  return id;
};

export const addToast = function (type, message, duration, closable) {
  const finalDuration = duration ?? config.duration;
  const finalCloseBtn = closable ?? config.closable;

  const toastData = {
    type,
    message,
    duration: finalDuration,
    closable: finalCloseBtn,
  };

  if (toastQueue.length >= config.maxQueue) return removeToast(toastQueue[0]);

  if (toastBox.children.length >= config.maxToasts) {
    // clearTimeout(oldToast.timerId);
    // removeToast(oldToast);
    toastQueue.push(toastData);
    return;
  }

  const id = renderToast(toastData);

  return id;
};

export const updateToast = function (id, { type, message, duration }) {
  const toast = activeToasts[id];

  if (!toast) return;

  toast.querySelector("span").textContent = message;
  toast.className = `toast ${type}`;
  toast.querySelector("i").className = `fa-solid fa-circle-${type}`;

  const finalDuration = duration ?? config.duration;
  // const finalCloseBtn = closable ?? config.closable;
  toast.style.setProperty("--toast-duration", `${finalDuration}s`);

  clearTimeout(toast.timerId);
  toast.timerId = scheduleRemoval(toast, finalDuration);
};

//// Event Listeners Start ////////////////////////
toastBox.addEventListener("click", (e) => {
  const closeBtn = e.target.closest(".toast-close");
  if (!closeBtn) return;

  const toast = closeBtn.closest(".toast");
  if (!toast) return;

  clearTimeout(toast.timerId);

  removeToast(toast);
});

toastBox.addEventListener("mouseover", (e) => {
  const toast = e.target.closest(".toast");

  if (!toast) return;
  if (e.relatedTarget && toast.contains(e.relatedTarget)) return;

  toast.classList.add("paused");
  clearTimeout(toast.timerId);

  const elapsedTime = Date.now() - toast.startTime;
  toast.remainingTime = Math.max(toast.remainingTime - elapsedTime, 0);
});

toastBox.addEventListener("mouseout", (e) => {
  const toast = e.target.closest(".toast");

  if (!toast) return;
  if (e.relatedTarget && toast.contains(e.relatedTarget)) return;

  toast.classList.remove("paused");
  toast.startTime = Date.now();
  toast.timerId = scheduleRemoval(toast, toast.remainingTime / 1000);
});

document.addEventListener("DOMContentLoaded", () => updatePositions());
