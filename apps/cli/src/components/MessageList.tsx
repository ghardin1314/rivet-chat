import { RGBA, ScrollBoxRenderable, TextAttributes } from "@opentui/core";
import { Theme } from "../theme";
import { Message as MessageType } from "../types";
import { Message } from "./Message";

interface MessageListProps {
  messages: MessageType[];
  scrollRef: React.RefObject<ScrollBoxRenderable | null>;
  isFocused: boolean;
}

export const MessageList = ({ messages, scrollRef, isFocused }: MessageListProps) => {
  return (
    <box
      flexGrow={1}
      flexDirection="column"
      borderColor={RGBA.fromHex(isFocused ? Theme.borderFocused : Theme.border)}
    >
      <box
        height={1}
        paddingLeft={1}
      >
        <text
          fg={isFocused ? Theme.primary : Theme.textMuted}
          attributes={isFocused ? TextAttributes.BOLD : TextAttributes.DIM}
        >
          Messages
        </text>
      </box>
      <scrollbox
        ref={scrollRef}
        flexGrow={1}
        paddingLeft={2}
        paddingRight={2}
        paddingTop={1}
        scrollbarOptions={{ visible: false }}
      >
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </scrollbox>
    </box>
  );
};
