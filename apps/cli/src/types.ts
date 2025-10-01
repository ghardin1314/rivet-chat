export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

export type Panel = "messages" | "sidebar" | "input";

export interface KeyBinding {
  key: string;
  description: string;
}
