const toastBox = document.getElementById("toast-box");
const buttonContainer = document.querySelector(".buttons");

const icons = {
  success: "check",
  error: "xmark",
  invalid: "exclamation",
};

const MAX_VISIBLE_TOASTS = 3;
const MAX_QUEUE_TOASTS = 5;

const toastQueue = [];

const createToast = function (type, message) {
  const markup = `
    <div class="toast-content">
        <i class="fa-solid fa-circle-${icons[type]}"></i>
        <span>${message}</span>
    </div>
    <button class="toast-close">
        <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = markup;
  return toast;
};

const removeToast = function (toast) {
  if (toast.classList.contains("hide")) return;

  toast.classList.add("hide");

  toast.addEventListener(
    "animationend",
    () => {
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

const showToast = function (type, message, duration = 6) {
  const toastData = { type, message, duration };

  if (toastQueue.length >= MAX_QUEUE_TOASTS) return;

  if (toastBox.children.length >= MAX_VISIBLE_TOASTS) {
    // clearTimeout(oldToast.timerId);
    // removeToast(oldToast);
    toastQueue.push(toastData);
    return;
  }

  renderToast(toastData);
};

const renderToast = function (toastData) {
  const { type, message, duration } = toastData;

  const toast = createToast(type, message);
  toast.style.setProperty("--toast-duration", `${duration}s`);

  toastBox.appendChild(toast);

  toast.timerId = scheduleRemoval(toast, duration);
  toast.startTime = Date.now();
  toast.remainingTime = duration * 1000;
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

buttonContainer.addEventListener("click", (e) => {
  if (!e.target.classList.contains("button")) return;

  if (e.target.classList.contains("successBtn"))
    showToast("success", "Successfully submitted");
  if (e.target.classList.contains("errorBtn"))
    showToast("error", "Error occurred");
  if (e.target.classList.contains("invalidBtn"))
    showToast("invalid", "Invalid Details");
});
