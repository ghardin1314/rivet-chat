import { TextAttributes } from "@opentui/core";
import { Theme } from "../theme";
import type { Message as MessageType } from "../types";

interface MessageProps {
  message: MessageType;
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const Message = ({ message }: MessageProps) => {
  return (
    <box paddingBottom={1}>
      <box flexDirection="row" gap={1} alignItems="center">
        <text
          fg={message.isOwn ? Theme.own : Theme.primary}
          attributes={TextAttributes.BOLD}
        >
          {message.username || message.sender}
        </text>
        <text fg={Theme.textMuted} attributes={TextAttributes.DIM}>
          {formatTime(message.timestamp)}
        </text>
      </box>
      <box paddingLeft={2}>
        <text fg={Theme.text}>{message.content}</text>
      </box>
    </box>
  );
};
