export interface Message {
  id: string;
  sender: string;
  username?: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

export type Panel = "messages" | "sidebar" | "input";

export interface KeyBinding {
  key: string;
  description: string;
  visible?: boolean;
}

export interface KeyBindingAction {
  id: string;
  description: string;
  keys: string[];
  handler: (key?: string) => void;
  visible?: boolean;
  priority?: number;
  active?: boolean;
  category?: string;
}
