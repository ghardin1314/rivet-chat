import { RGBA, type ParsedKey } from "@opentui/core";
import { useKeyboard, useTerminalDimensions } from "@opentui/react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ConfirmationModalContent } from "../components/modals/confirmation-modal";
import { CreateChatModalContent } from "../components/modals/create-chat-modal";
import { HelpModalContent } from "../components/modals/help-modal";
import { Theme } from "../theme";

// Modal keys
export const CreateChatModalKey = "create-chat";
export const ConfirmationModalKey = "confirmation";
export const HelpModalKey = "help";

// Modal config - add your modals here with their prop types
export type ModalConfig =
  | {
      type: typeof CreateChatModalKey;
      data: {
        onConfirm?: (name: string) => void;
      };
    }
  | {
      type: typeof ConfirmationModalKey;
      data: {
        title: string;
        message: string;
        confirmText?: string;
        cancelText?: string;
        onConfirm?: () => void;
        onCancel?: () => void;
      };
    }
  | {
      type: typeof HelpModalKey;
      data: Record<string, never>;
    };

export type ModalType = ModalConfig["type"];
export type ModalState = "idle" | "pending" | "error";

interface ModalContextValue {
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
  currentModal: ModalConfig | null;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);

  const openModal = useCallback((config: ModalConfig) => {
    setModalConfig(config);
  }, []);

  const closeModal = useCallback(() => {
    setModalConfig(null);
  }, []);

  const handleKeyboard = useCallback(
    (evt: ParsedKey) => {
      if (evt.name === "escape" && modalConfig) {
        closeModal();
      }
    },
    [modalConfig, closeModal]
  );

  useKeyboard(handleKeyboard);

  const value = useMemo(
    () => ({
      openModal,
      closeModal,
      currentModal: modalConfig,
    }),
    [openModal, closeModal, modalConfig]
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modalConfig && <ModalOverlay />}
    </ModalContext.Provider>
  );
}

function ModalOverlay() {
  const dimensions = useTerminalDimensions();

  return (
    <box
      style={{
        zIndex: 1000,
        width: dimensions.width,
        height: dimensions.height,
        alignItems: "center",
        position: "absolute",
        paddingTop: Math.floor(dimensions.height / 4),
        left: 0,
        top: 0,
        backgroundColor: RGBA.fromInts(0, 0, 0, 150),
      }}
    >
      <box
        style={{
          width: 60,
          maxWidth: dimensions.width - 2,
          backgroundColor: Theme.backgroundPanel,
          borderColor: Theme.border,
          border: true,
          paddingTop: 1,
          paddingBottom: 1,
          paddingLeft: 2,
          paddingRight: 2,
          gap: 1,
          flexDirection: "column",
        }}
      >
        <ModalContent />
      </box>
    </box>
  );
}

function ModalContent() {
  const context = useContext(ModalContext);
  if (!context?.currentModal) return null;

  const modal = context.currentModal;

  if (modal.type === CreateChatModalKey) {
    return <CreateChatModalContent {...modal.data} />;
  }

  if (modal.type === ConfirmationModalKey) {
    return <ConfirmationModalContent {...modal.data} />;
  }

  if (modal.type === HelpModalKey) {
    return <HelpModalContent />;
  }

  // Exhaustive check
  const _exhaustive: never = modal;
  return null;
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }

  return useCallback(
    (config: ModalConfig | null) => {
      if (config === null) {
        context.closeModal();
      } else {
        context.openModal(config);
      }
    },
    [context]
  );
}
