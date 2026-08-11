import { useEffect, useRef } from "react";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

export type ToastType = "success" | "error";

let notyfInstance: Notyf | null = null;

const getNotyf = () => {
  if (!notyfInstance) {
    notyfInstance = new Notyf({
      duration: 3000,
      position: { x: "center", y: "top" },
      dismissible: true,
      types: [
        {
          type: "success",
          background: "#0f172a", // slate-900
          icon: false,
        },
        {
          type: "error",
          background: "#ffffff",
          icon: false,
        },
      ],
    });
  }
  return notyfInstance;
};


export const showToast = (message: string, type: ToastType = "success") => {
  const notyf = getNotyf();
  if (type === "success") {
    notyf.success(message);
  } else {
    notyf.error(message);
  }
};

export const Toast = () => {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      getNotyf();
      initialized.current = true;
    }
  }, []);

  return null;
};