import { createContext, ReactNode, useContext, useState } from "react";

import { Alert, AlertProps, Box, Link, Snackbar } from "@mui/material";

type NotifyOptions = { severity: AlertProps["severity"] };

type ToastContextState = {
  notify: (message: string, options?: NotifyOptions) => void;
};

const ToastContext = createContext({} as ToastContextState);

export function useToastContext() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [options, setOptions] = useState<NotifyOptions>();

  const handleClose = () => {
    setMessage(null);
  };

  const notify = (
    newMessage: string,
    newOptions: NotifyOptions = { severity: "error" },
  ) => {
    setMessage(newMessage);
    setOptions(newOptions);
  };

  return (
    <ToastContext.Provider value={{ notify }}>
      <Snackbar
        open={Boolean(message)}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        ClickAwayListenerProps={{
          mouseEvent: "onMouseDown",
        }}
      >
        <Alert severity={options?.severity} onClose={handleClose}>
          {message}
          {options?.severity === "error" && (
            <Box sx={{ mt: 1 }}>
              <Link
                href="https://github.com/dan-lovelace/giggle/issues/new"
                target="_blank"
              >
                Report
              </Link>
            </Box>
          )}
        </Alert>
      </Snackbar>
      {children}
    </ToastContext.Provider>
  );
}
