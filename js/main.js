import toast from "./toastAPI.js";

const buttonContainer = document.querySelector(".buttons");

toast.init({ position: "bottom-right" });

buttonContainer.addEventListener("click", (e) => {
  if (!e.target.classList.contains("button")) return;

  if (e.target.classList.contains("successBtn")) toast.success("Saved");

  if (e.target.classList.contains("errorBtn")) toast.error("Something failed");

  if (e.target.classList.contains("invalidBtn")) toast.invalid("Invalid input");

  if (e.target.classList.contains("infoBtn"))
    toast("hello", { duration: 3, closable: false });

  if (e.target.classList.contains("promiseResolveBtn"))
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => resolve(), 2000);
      }),
      {
        loading: "Loading....",
        success: "Done with fetching!...",
        error: "Something went wrong",
      },
    );

  if (e.target.classList.contains("promiseRejectBtn"))
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => reject(), 1000);
      }),
      {
        loading: "Loading....",
        success: "Done with fetching!...",
        error: "Something went wrong",
      },
    );
});
