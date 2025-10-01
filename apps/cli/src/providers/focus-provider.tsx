import { useKeyboard } from "@opentui/react";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

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
  const [focusedSlug, setFocusedSlug] = useState<string | null>("messages");
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

  const handleKeyboard = useCallback(
    (evt: any) => {
      // Panel navigation with Tab/Shift+Tab
      if (evt.name === "tab") {
        const sortedSections = Array.from(sectionsRef.current.values()).sort(
          (a, b) => a.focusIndex - b.focusIndex
        );

        if (sortedSections.length === 0) return;

        const currentIndex = sortedSections.findIndex(
          (s) => s.focusSlug === focusedSlug
        );

        if (evt.shift) {
          // Previous section
          const nextIndex =
            currentIndex <= 0 ? sortedSections.length - 1 : currentIndex - 1;
          setFocusedSlug(sortedSections[nextIndex].focusSlug);
        } else {
          // Next section
          const nextIndex = (currentIndex + 1) % sortedSections.length;
          setFocusedSlug(sortedSections[nextIndex].focusSlug);
        }
      }

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

      // Enter insert mode from messages panel
      if (evt.name === "i" && focusedSlug === "messages") {
        setFocusedSlug("input");
      }

      // Exit input mode
      if (evt.name === "escape" && focusedSlug === "input") {
        setFocusedSlug("messages");
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
