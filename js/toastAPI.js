import { addToast, updatePositions, updateToast } from "./toastManager.js";
import { updateConfig } from "./config.js";

const createToastMethod = function (type) {
  return function (message, options = {}) {
    const { duration } = options;
    addToast(type, message, duration);
  };
};

const toast = function (message, options = {}) {
  addToast("info", message, options.duration, options.closable);
};

toast.success = createToastMethod("success");
toast.error = createToastMethod("error");
toast.invalid = createToastMethod("invalid");
toast.info = createToastMethod("info");

toast.promise = function (promise, messages) {
  const id = addToast("info", messages.loading);
  console.log(id);

  promise
    .then(() => {
      updateToast(id, { type: "success", message: messages.success });
      // addToast("success", messages.success);
    })
    .catch(() => {
      updateToast(id, { type: "error", message: messages.error });
      // addToast("error", messages.error);
    });
};

toast.init = (options) => {
  updateConfig(options);
  updatePositions();
};

export default toast;
