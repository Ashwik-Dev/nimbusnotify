const icons = {
  success: "check",
  error: "xmark",
  invalid: "exclamation",
  info: "info",
};

export const createToast = function (type, message, closable) {
  const markup = `
    <div class="toast-content">
        <i class="fa-solid fa-circle-${icons[type]}"></i>
        <span>${message}</span>
    </div>
    ${
      closable ?
      `<button class="toast-close">
        <i class="fa-solid fa-xmark"></i>
    </button>` : ""
    }
  `;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = markup;
  return toast;
};
