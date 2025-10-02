import { useKeyboard } from "@opentui/react";
import type { ParsedKey } from "@opentui/core";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { KeyBindingAction } from "../types";

type KeyBindingContextType = {
  registerKeybinding: (action: KeyBindingAction) => void;
  unregisterKeybinding: (id: string) => void;
  getVisibleKeybindings: () => Array<{ key: string; description: string }>;
  getAllActiveKeybindings: () => Array<{ key: string; description: string; category?: string }>;
};

const KeyBindingContext = createContext<KeyBindingContextType | undefined>(
  undefined
);

export const useKeybindingContext = () => {
  const context = useContext(KeyBindingContext);
  if (!context) {
    throw new Error(
      "useKeybindingContext must be used within KeyBindingProvider"
    );
  }
  return context;
};

const matchesKey = (evt: ParsedKey, keyPattern: string): boolean => {
  if (!evt.name) return false;

  const parts = keyPattern.toLowerCase().split("+");
  const modifiers = parts.slice(0, -1);
  const key = parts[parts.length - 1];

  // Check if key matches
  if (evt.name.toLowerCase() !== key.toLowerCase()) {
    return false;
  }

  // Check modifiers
  const hasCtrl = modifiers.includes("ctrl") || modifiers.includes("control");
  const hasShift = modifiers.includes("shift");
  const hasMeta = modifiers.includes("meta") || modifiers.includes("cmd");

  if (hasCtrl && !evt.ctrl) return false;
  if (hasShift && !evt.shift) return false;
  if (hasMeta && !evt.meta) return false;

  // Make sure we don't have extra modifiers
  if (!hasCtrl && evt.ctrl) return false;
  if (!hasShift && evt.shift) return false;
  if (!hasMeta && evt.meta) return false;

  return true;
};

export const KeyBindingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const actionsRef = useRef<Map<string, KeyBindingAction>>(new Map());
  const [, setVersion] = useState(0);

  const registerKeybinding = useCallback((action: KeyBindingAction) => {
    actionsRef.current.set(action.id, action);
    setVersion((v) => v + 1);
  }, []);

  const unregisterKeybinding = useCallback((id: string) => {
    actionsRef.current.delete(id);
    setVersion((v) => v + 1);
  }, []);

  const getVisibleKeybindings = useCallback(() => {
    const bindings: Array<{ key: string; description: string }> = [];
    const seen = new Set<string>();

    const sortedActions = Array.from(actionsRef.current.values()).sort(
      (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
    );

    for (const action of sortedActions) {
      if (action.visible === false) continue;
      if (action.active === false) continue;

      // Skip if we've already seen this description
      if (seen.has(action.description)) continue;

      bindings.push({
        key: action.keys.join("/"),
        description: action.description,
      });
      seen.add(action.description);
    }

    return bindings;
  }, []);

  const getAllActiveKeybindings = useCallback(() => {
    const bindings: Array<{ key: string; description: string; category?: string }> = [];
    const seen = new Set<string>();

    const sortedActions = Array.from(actionsRef.current.values()).sort(
      (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
    );

    for (const action of sortedActions) {
      if (action.active === false) continue;

      // Skip if we've already seen this description
      if (seen.has(action.description)) continue;

      bindings.push({
        key: action.keys.join("/"),
        description: action.description,
        category: action.category,
      });
      seen.add(action.description);
    }

    return bindings;
  }, []);

  const handleKeyboard = useCallback((evt: ParsedKey) => {
    const sortedActions = Array.from(actionsRef.current.values()).sort(
      (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
    );

    for (const action of sortedActions) {
      if (action.active === false) continue;

      for (const keyPattern of action.keys) {
        if (matchesKey(evt, keyPattern)) {
          try {
            action.handler(keyPattern);
          } catch (error) {
            console.error("Error in keybinding handler:", error);
          }
          return;
        }
      }
    }
  }, []);

  useKeyboard(handleKeyboard);

  return (
    <KeyBindingContext.Provider
      value={{
        registerKeybinding,
        unregisterKeybinding,
        getVisibleKeybindings,
        getAllActiveKeybindings,
      }}
    >
      {children}
    </KeyBindingContext.Provider>
  );
};

export const useKeybinding = (action: Omit<KeyBindingAction, "id">) => {
  const { registerKeybinding, unregisterKeybinding } = useKeybindingContext();
  const idRef = useRef<string>(
    `keybinding-${Math.random().toString(36).substring(7)}`
  );

  useEffect(() => {
    const id = idRef.current;
    registerKeybinding({ ...action, id });

    return () => {
      unregisterKeybinding(id);
    };
  }, [
    action.description,
    action.handler,
    action.visible,
    action.priority,
    action.active,
    action.category,
    JSON.stringify(action.keys),
    registerKeybinding,
    unregisterKeybinding,
  ]);
};

export const useKeybindings = (actions: Array<Omit<KeyBindingAction, "id">>) => {
  const { registerKeybinding, unregisterKeybinding } = useKeybindingContext();
  const idsRef = useRef<string[]>([]);

  useEffect(() => {
    // Generate IDs if not already generated
    if (idsRef.current.length !== actions.length) {
      idsRef.current = actions.map(
        () => `keybinding-${Math.random().toString(36).substring(7)}`
      );
    }

    // Register all keybindings
    actions.forEach((action, index) => {
      const id = idsRef.current[index];
      registerKeybinding({ ...action, id });
    });

    return () => {
      // Unregister all keybindings
      idsRef.current.forEach((id) => {
        unregisterKeybinding(id);
      });
    };
  }, [
    actions.map((a) => a.description).join(","),
    actions.map((a) => a.visible).join(","),
    actions.map((a) => a.priority).join(","),
    actions.map((a) => a.active).join(","),
    actions.map((a) => a.category).join(","),
    actions.map((a) => JSON.stringify(a.keys)).join(","),
    ...actions.map((a) => a.handler),
    registerKeybinding,
    unregisterKeybinding,
  ]);
};
