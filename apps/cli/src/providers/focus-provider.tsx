import { useKeyboard } from "@opentui/react";
import type { ParsedKey } from "@opentui/core";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { useKeybindings } from "./keybinding-provider";

type FocusableSection = {
  focusIndex: number;
  focusSlug: string;
};

type FocusContextType = {
  focusedSlug: string | null;
  setFocusedSlug: (slug: string) => void;
  registerSection: (section: FocusableSection) => void;
  unregisterSection: (slug: string) => void;
  isFocused: (slug: string) => boolean;
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
  const [focusedSlug, setFocusedSlug] = useState<string | null>("chats");
  const sectionsRef = useRef<Map<string, FocusableSection>>(new Map());

  const registerSection = useCallback((section: FocusableSection) => {
    sectionsRef.current.set(section.focusSlug, section);
  }, []);

  const unregisterSection = useCallback((slug: string) => {
    sectionsRef.current.delete(slug);
  }, []);

  const isFocused = useCallback(
    (slug: string) => focusedSlug === slug,
    [focusedSlug]
  );

  const handleTabNext = useCallback(() => {
    const sortedSections = Array.from(sectionsRef.current.values()).sort(
      (a, b) => a.focusIndex - b.focusIndex
    );

    if (sortedSections.length === 0) return;

    const currentIndex = sortedSections.findIndex(
      (s) => s.focusSlug === focusedSlug
    );

    const nextIndex = (currentIndex + 1) % sortedSections.length;
    setFocusedSlug(sortedSections[nextIndex].focusSlug);
  }, [focusedSlug]);

  const handleTabPrev = useCallback(() => {
    const sortedSections = Array.from(sectionsRef.current.values()).sort(
      (a, b) => a.focusIndex - b.focusIndex
    );

    if (sortedSections.length === 0) return;

    const currentIndex = sortedSections.findIndex(
      (s) => s.focusSlug === focusedSlug
    );

    const nextIndex =
      currentIndex <= 0 ? sortedSections.length - 1 : currentIndex - 1;
    setFocusedSlug(sortedSections[nextIndex].focusSlug);
  }, [focusedSlug]);

  const handleInsertMode = useCallback(() => {
    if (focusedSlug === "messages") {
      setFocusedSlug("input");
    }
  }, [focusedSlug]);

  const handleExitInput = useCallback(() => {
    if (focusedSlug === "input") {
      setFocusedSlug("messages");
    }
  }, [focusedSlug]);

  useKeybindings([
    {
      keys: ["tab"],
      description: "next panel",
      handler: handleTabNext,
      visible: false,
      active: true,
      priority: 90,
      category: "navigation",
    },
    {
      keys: ["shift+tab"],
      description: "prev panel",
      handler: handleTabPrev,
      visible: false,
      active: true,
      priority: 90,
      category: "navigation",
    },
    {
      keys: ["i"],
      description: "insert",
      handler: handleInsertMode,
      visible: true,
      active: focusedSlug === "messages",
      priority: 80,
      category: "input",
    },
    {
      keys: ["escape"],
      description: "cancel",
      handler: handleExitInput,
      visible: true,
      active: focusedSlug === "input",
      priority: 80,
      category: "input",
    },
  ]);

  const handleKeyboard = useCallback(
    (evt: ParsedKey) => {
      // Numeric focus (0-9) - skip if in input mode
      if (
        evt.name &&
        evt.name.match(/^[0-9]$/) &&
        focusedSlug !== "input"
      ) {
        const targetIndex = parseInt(evt.name, 10);
        const section = Array.from(sectionsRef.current.values()).find(
          (s) => s.focusIndex === targetIndex
        );
        if (section) {
          setFocusedSlug(section.focusSlug);
        }
      }
    },
    [focusedSlug]
  );

  useKeyboard(handleKeyboard);

  return (
    <FocusContext.Provider
      value={{
        focusedSlug,
        setFocusedSlug,
        registerSection,
        unregisterSection,
        isFocused,
      }}
    >
      {children}
    </FocusContext.Provider>
  );
};
