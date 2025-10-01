import { useKeyboard } from "@opentui/react";
import { createContext, useCallback, useContext, useState } from "react";
import type { Panel } from "../types";

type FocusContextType = {
  focusedPanel: Panel;
  setFocusedPanel: (panel: Panel | ((prev: Panel) => Panel)) => void;
};

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export const useFocus = () => {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error("useFocus must be used within FocusProvider");
  }
  return context;
};

export const FocusProvider = ({ children }: { children: React.ReactNode }) => {
  const [focusedPanel, setFocusedPanel] = useState<Panel>("messages");

  const handleKeyboard = useCallback(
    (evt: any) => {
      // Panel navigation with Tab/Shift+Tab
      if (evt.name === "tab") {
        if (evt.shift) {
          // Previous panel
          setFocusedPanel((prev) => {
            if (prev === "messages") return "input";
            if (prev === "sidebar") return "messages";
            return "sidebar";
          });
        } else {
          // Next panel
          setFocusedPanel((prev) => {
            if (prev === "messages") return "sidebar";
            if (prev === "sidebar") return "input";
            return "messages";
          });
        }
      }

      // Enter insert mode from messages panel
      if (evt.name === "i" && focusedPanel === "messages") {
        setFocusedPanel("input");
      }

      // Exit input mode
      if (evt.name === "escape" && focusedPanel === "input") {
        setFocusedPanel("messages");
      }
    },
    [focusedPanel]
  );

  useKeyboard(handleKeyboard);

  return (
    <FocusContext.Provider value={{ focusedPanel, setFocusedPanel }}>
      {children}
    </FocusContext.Provider>
  );
};
