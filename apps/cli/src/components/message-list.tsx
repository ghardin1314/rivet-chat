import { ScrollBoxRenderable } from "@opentui/core";
import type { Message as MessageType } from "../types";
import { Message } from "./message";
import { Section } from "./section";

interface MessageListProps {
  messages: MessageType[];
  scrollRef: React.RefObject<ScrollBoxRenderable | null>;
}

export const MessageList = ({ messages, scrollRef }: MessageListProps) => {
  return (
    <Section title="Messages" focusIndex={1} focusSlug="messages" flexGrow={1}>
      <scrollbox
        ref={scrollRef}
        flexGrow={1}
        paddingLeft={2}
        paddingRight={2}
        scrollbarOptions={{ visible: false }}
      >
        {messages.map((message) => (
          <Message message={message} />
        ))}
      </scrollbox>
    </Section>
  );
};
