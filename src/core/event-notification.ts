import { terminal } from "terminal-kit";

export const eventNotification = (message: string, type: "error" | "success" | "notification") => {
  if (type === "error") {
    terminal.red(message);
  }
  if (type === "success") {
    terminal.green(message);
  }
  if (type === "notification") {
    terminal.white(message);
  }
};
