# OpenTUI Library Guide (React)

OpenTUI is a TypeScript library for building Terminal User Interfaces (TUIs). It's currently in development and serves as the foundational TUI framework for opencode and terminaldotshop.

## Overview

OpenTUI consists of two main packages:

- **@opentui/core** - The core library with imperative API and primitives
- **@opentui/react** - React

## Core Concepts

### 1. Main Rendering Entry Point

```tsx
import { render } from "@opentui/react";

await render(<App />, {
  targetFps: 60,
  gatherStats: false,
  exitOnCtrlC: false,
  useKittyKeyboard: true,
});
```

### 2. Hooks

#### useTerminalDimensions

Get terminal width and height.

```tsx
import { useTerminalDimensions } from "@opentui/react";

function App() {
  const dimensions = useTerminalDimensions();

  return (
    <box width={dimensions.width} height={dimensions.height}>
      {/* content */}
    </box>
  );
}
```

#### useKeyboard

Handle keyboard events.

```tsx
import { useKeyboard } from "@opentui/react";
import { useCallback } from "react";

function App() {
  const handleKeyboard = useCallback((evt) => {
    if (evt.meta && evt.name === "t") {
      // Handle Meta+T
      return;
    }
    if (evt.name === "escape") {
      evt.preventDefault();
      // Handle escape
    }
  }, []);

  useKeyboard(handleKeyboard);

  return <box>{/* content */}</box>;
}
```

#### useRenderer

Access the renderer for debugging and utilities.

```tsx
import { useRenderer } from "@opentui/react";
import { useCallback } from "react";

function App() {
  const renderer = useRenderer();

  const handleKeyboard = useCallback(
    (evt) => {
      if (evt.meta && evt.name === "d") {
        renderer.console.toggle();
        return;
      }
      if (evt.meta && evt.name === "t") {
        renderer.toggleDebugOverlay();
      }
    },
    [renderer]
  );

  useKeyboard(handleKeyboard);

  return <box>{/* content */}</box>;
}
```

#### useTimeline

Create animations with timeline control.

```tsx
import { useTimeline } from "@opentui/react";
import { useState, useEffect } from "react";

function Shimmer(props: { text: string; color: string }) {
  const [shimmer, setShimmer] = useState(0.4);

  const timeline = useTimeline({
    duration: 2500,
    loop: true,
  });

  useEffect(() => {
    const target = { shimmer, setShimmer };

    timeline.add(
      target,
      {
        shimmer: 1,
        duration: 2500,
        ease: "linear",
        alternate: true,
        loop: 2,
        onUpdate: () => target.setShimmer(target.shimmer),
      },
      0
    );
  }, [timeline]);

  return <text>{/* animated content */}</text>;
}
```

### 3. Core Types and Utilities

#### RGBA Color

```tsx
import { RGBA } from "@opentui/core"

// Create from hex
const color = RGBA.fromHex("#ff0000")

// Create from RGB values
const transparent = RGBA.fromInts(0, 0, 0, 150)

// Usage in components
<box backgroundColor={RGBA.fromInts(0, 0, 0, 150)}>
  {/* content */}
</box>
```

#### TextAttributes

```tsx
import { TextAttributes } from "@opentui/core"

<text attributes={TextAttributes.BOLD}>Bold Text</text>

// In inline spans
<text>
  <span style={{ bold: true }}>Bold</span>
  <span style={{ fg: "#ff0000" }}>Red text</span>
</text>
```

#### Renderable Types

```tsx
import type {
  InputRenderable,
  BoxRenderable,
  ScrollBoxRenderable,
  ParsedKey,
} from "@opentui/core";
import { useRef } from "react";

function Component() {
  const inputRef = useRef<InputRenderable>(null);
  const boxRef = useRef<BoxRenderable>(null);
  const scrollRef = useRef<ScrollBoxRenderable>(null);

  return (
    <>
      <input ref={inputRef} />
      <box ref={boxRef} />
      <scrollbox ref={scrollRef} />
    </>
  );
}
```

### 4. Layout Components

#### Box Component

The primary container for layout.

```tsx
<box
  width={60}
  height={20}
  backgroundColor={Theme.backgroundPanel}
  borderColor={Theme.border}
  paddingTop={1}
  paddingLeft={2}
  flexDirection="column"
  flexGrow={1}
  justifyContent="space-between"
  alignItems="center"
  position="absolute"
  left={0}
  top={0}
>
  {/* content */}
</box>
```

#### Custom Border Characters

```tsx
const Border = {
  topLeft: "┃",
  topRight: "┃",
  bottomLeft: "┃",
  bottomRight: "┃",
  horizontal: "",
  vertical: "┃",
  topT: "+",
  bottomT: "+",
  leftT: "+",
  rightT: "+",
  cross: "+",
}

<box customBorderChars={Border}>
  {/* content */}
</box>
```

#### ScrollBox Component

Scrollable container with scrollbar.

```tsx
import { ScrollBoxRenderable } from "@opentui/core";
import { useRef } from "react";

function Component() {
  const scrollRef = useRef<ScrollBoxRenderable>(null);

  return (
    <scrollbox
      paddingLeft={2}
      paddingRight={2}
      scrollbarOptions={{ visible: false }}
      ref={scrollRef}
      maxHeight={10}
    >
      {/* scrollable content */}
    </scrollbox>
  );
}
```

### 5. Input Component

```tsx
import { InputRenderable } from "@opentui/core";
import { useState, useRef, useEffect, useCallback } from "react";

function Component() {
  const inputRef = useRef<InputRenderable>(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.name === "escape") {
      e.preventDefault();
    }
  }, []);

  const handleSubmit = useCallback(() => {
    console.log("Submitted:", value);
  }, [value]);

  return (
    <input
      value={value}
      onInput={setValue}
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      ref={inputRef}
      placeholder="Enter text..."
      focusedBackgroundColor={Theme.backgroundPanel}
      cursorColor={Theme.primary}
      focusedTextColor={Theme.textMuted}
    />
  );
}
```

### 6. Text Components

**Basic text:**

```tsx
<text fg={Theme.textMuted} attributes={TextAttributes.BOLD}>
  Hello World
</text>
```

**Inline styling with spans:**

```tsx
<text>
  <span style={{ fg: Theme.textMuted }}>Muted text</span>
  <span style={{ bold: true }}>Bold text</span>
  <span style={{ fg: "#ff0000", bg: "#000000" }}>Colored text</span>
</text>
```

### 7. Event Handling

#### Mouse Events

```tsx
<box
  onMouseDown={() => console.log("Mouse down")}
  onMouseUp={() => console.log("Mouse up")}
  onMouseOver={() => console.log("Mouse over")}
>
  {/* content */}
</box>
```

### 8. Complete Examples

#### Dialog Component

```tsx
import {
  useKeyboard,
  useRenderer,
  useTerminalDimensions,
} from "@opentui/react";
import { createContext, useContext, useState, useCallback } from "react";
import { Renderable, RGBA } from "@opentui/core";

function Dialog(props: {
  size?: "medium" | "large";
  children: React.ReactNode;
}) {
  const dimensions = useTerminalDimensions();

  return (
    <box
      width={dimensions.width}
      height={dimensions.height}
      alignItems="center"
      position="absolute"
      paddingTop={dimensions.height / 4}
      left={0}
      top={0}
      backgroundColor={RGBA.fromInts(0, 0, 0, 150)}
    >
      <box
        width={props.size === "large" ? 80 : 60}
        maxWidth={dimensions.width - 2}
        backgroundColor={Theme.backgroundPanel}
        borderColor={Theme.border}
        paddingTop={1}
      >
        {props.children}
      </box>
    </box>
  );
}

const DialogContext = createContext(null);

export function DialogProvider(props: { children: React.ReactNode }) {
  const [stack, setStack] = useState([]);
  const [size, setSize] = useState("medium");

  const handleKeyboard = useCallback(
    (evt) => {
      if (evt.name === "escape" && stack.length > 0) {
        const current = stack[stack.length - 1];
        current.onClose?.();
        setStack(stack.slice(0, -1));
        evt.preventDefault();
      }
    },
    [stack]
  );

  useKeyboard(handleKeyboard);

  const value = {
    clear: useCallback(() => {
      setStack([]);
      setSize("medium");
    }, []),
    replace: useCallback((element, onClose) => {
      setSize("medium");
      setStack([{ element, onClose }]);
    }, []),
  };

  return (
    <DialogContext.Provider value={value}>
      {props.children}
      <box position="absolute">
        {stack.length > 0 && (
          <Dialog size={size}>{stack[stack.length - 1].element}</Dialog>
        )}
      </box>
    </DialogContext.Provider>
  );
}

export function useDialog() {
  return useContext(DialogContext);
}
```

#### Confirm Dialog

```tsx
import { TextAttributes } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { useState, useCallback } from "react";

function DialogConfirm(props: {
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}) {
  const dialog = useDialog();
  const [active, setActive] = useState<"confirm" | "cancel">("confirm");

  const handleKeyboard = useCallback(
    (evt) => {
      if (evt.name === "return") {
        if (active === "confirm") props.onConfirm?.();
        if (active === "cancel") props.onCancel?.();
        dialog.clear();
      }

      if (evt.name === "left" || evt.name === "right") {
        setActive(active === "confirm" ? "cancel" : "confirm");
      }
    },
    [active, props, dialog]
  );

  useKeyboard(handleKeyboard);

  const handleMouseDown = useCallback(
    (key: "confirm" | "cancel") => {
      if (key === "confirm") props.onConfirm?.();
      if (key === "cancel") props.onCancel?.();
      dialog.clear();
    },
    [props, dialog]
  );

  return (
    <box paddingLeft={2} paddingRight={2} gap={1}>
      <box flexDirection="row" justifyContent="space-between">
        <text attributes={TextAttributes.BOLD}>{props.title}</text>
        <text fg={Theme.textMuted}>esc</text>
      </box>
      <box paddingBottom={1}>
        <text fg={Theme.textMuted}>{props.message}</text>
      </box>
      <box flexDirection="row" justifyContent="flex-end" paddingBottom={1}>
        {["cancel", "confirm"].map((key) => (
          <box
            key={key}
            paddingLeft={1}
            paddingRight={1}
            backgroundColor={key === active ? Theme.primary : undefined}
            onMouseDown={() => handleMouseDown(key as "confirm" | "cancel")}
          >
            <text fg={key === active ? Theme.background : Theme.textMuted}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </text>
          </box>
        ))}
      </box>
    </box>
  );
}
```

#### Select Dialog with Scrolling

```tsx
import {
  InputRenderable,
  RGBA,
  ScrollBoxRenderable,
  TextAttributes,
} from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { useState, useCallback, useRef, useMemo, useEffect } from "react";

interface DialogSelectOption<T = any> {
  title: string;
  value: T;
  description?: string;
  footer?: string;
  category?: string;
  disabled?: boolean;
  bg?: string;
  onSelect?: () => void;
}

function DialogSelect<T>(props: {
  title: string;
  options: DialogSelectOption<T>[];
  onMove?: (option: DialogSelectOption<T>) => void;
  onFilter?: (query: string) => void;
  onSelect?: (option: DialogSelectOption<T>) => void;
  limit?: number;
  current?: T;
}) {
  const dialog = useDialog();
  const [selected, setSelected] = useState(0);
  const [filter, setFilter] = useState("");
  const inputRef = useRef<InputRenderable>(null);
  const scrollRef = useRef<ScrollBoxRenderable>(null);

  const filtered = useMemo(() => {
    const needle = filter.toLowerCase();
    let result = props.options.filter((x) => x.disabled !== false);

    if (props.limit) {
      result = result.slice(0, props.limit);
    }

    if (needle) {
      result = result.filter(
        (x) =>
          x.title.toLowerCase().includes(needle) ||
          x.category?.toLowerCase().includes(needle)
      );
    }

    return result;
  }, [props.options, props.limit, filter]);

  const grouped = useMemo(() => {
    const groups = new Map<string, DialogSelectOption<T>[]>();

    filtered.forEach((option) => {
      const category = option.category ?? "";
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(option);
    });

    return Array.from(groups.entries());
  }, [filtered]);

  const flat = useMemo(() => {
    return grouped.flatMap(([_, options]) => options);
  }, [grouped]);

  const selectedOption = flat[selected];

  useEffect(() => {
    setSelected(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0);
    }
  }, [filter]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const move = useCallback(
    (direction: number) => {
      let next = selected + direction;
      if (next < 0) next = flat.length - 1;
      if (next >= flat.length) next = 0;
      setSelected(next);
      props.onMove?.(flat[next]);
    },
    [selected, flat, props]
  );

  const handleKeyboard = useCallback(
    (evt) => {
      if (evt.name === "up") move(-1);
      if (evt.name === "down") move(1);
      if (evt.name === "pageup") move(-10);
      if (evt.name === "pagedown") move(10);
      if (evt.name === "return") {
        const option = selectedOption;
        if (option?.onSelect) option.onSelect();
        props.onSelect?.(option);
      }
    },
    [move, selectedOption, props]
  );

  useKeyboard(handleKeyboard);

  const handleInput = useCallback(
    (value: string) => {
      setFilter(value);
      props.onFilter?.(value);
    },
    [props]
  );

  return (
    <box gap={1}>
      <box paddingLeft={3} paddingRight={2}>
        <box flexDirection="row" justifyContent="space-between">
          <text attributes={TextAttributes.BOLD}>{props.title}</text>
          <text fg={Theme.textMuted}>esc</text>
        </box>
        <box paddingTop={1} paddingBottom={1}>
          <input
            onInput={handleInput}
            focusedBackgroundColor={Theme.backgroundPanel}
            cursorColor={Theme.primary}
            focusedTextColor={Theme.textMuted}
            ref={inputRef}
            placeholder="Enter search term"
          />
        </box>
      </box>
      <scrollbox
        paddingLeft={2}
        paddingRight={2}
        scrollbarOptions={{ visible: false }}
        ref={scrollRef}
        maxHeight={10}
      >
        {grouped.map(([category, options], categoryIndex) => (
          <div key={category}>
            {category && (
              <box paddingTop={categoryIndex > 0 ? 1 : 0} paddingLeft={1}>
                <text fg={Theme.accent} attributes={TextAttributes.BOLD}>
                  {category}
                </text>
              </box>
            )}
            {options.map((option) => {
              const isActive = option === selectedOption;
              const isCurrent = option.value === props.current;

              return (
                <box
                  key={JSON.stringify(option.value)}
                  flexDirection="row"
                  onMouseUp={() => {
                    option.onSelect?.();
                    props.onSelect?.(option);
                  }}
                  onMouseOver={() => {
                    const index = filtered.findIndex((x) => x === option);
                    if (index !== -1) setSelected(index);
                  }}
                  backgroundColor={
                    isActive
                      ? (option.bg ?? Theme.primary)
                      : RGBA.fromInts(0, 0, 0, 0)
                  }
                  paddingLeft={1}
                  paddingRight={1}
                >
                  <box flexGrow={1} flexShrink={0} flexDirection="row">
                    <text
                      fg={
                        isActive
                          ? Theme.background
                          : isCurrent
                            ? Theme.primary
                            : Theme.text
                      }
                      attributes={isActive ? TextAttributes.BOLD : undefined}
                    >
                      {option.title}
                    </text>
                    {option.description && option.description !== category && (
                      <text fg={isActive ? Theme.background : Theme.textMuted}>
                        {" "}
                        {option.description}
                      </text>
                    )}
                  </box>
                  {option.footer && (
                    <text fg={isActive ? Theme.background : Theme.textMuted}>
                      {option.footer}
                    </text>
                  )}
                </box>
              );
            })}
          </div>
        ))}
      </scrollbox>
    </box>
  );
}
```

## Box Layout Properties

Available flexbox-like properties:

- **Layout**: `flexDirection`, `flexGrow`, `flexShrink`, `gap`
- **Alignment**: `justifyContent`, `alignItems`
- **Sizing**: `width`, `height`, `minWidth`, `minHeight`, `maxWidth`, `maxHeight`
- **Spacing**: `padding`, `paddingTop`, `paddingBottom`, `paddingLeft`, `paddingRight`
- **Positioning**: `position` ("absolute" | "relative"), `top`, `left`, `right`, `bottom`
- **Styling**: `backgroundColor`, `borderColor`, `customBorderChars`

## Input Properties

- **Value**: `value` - controlled input value
- **Events**: `onInput`, `onSubmit`, `onKeyDown`, `onPaste`
- **Styling**: `backgroundColor`, `focusedBackgroundColor`, `cursorColor`, `focusedTextColor`
- **Attributes**: `placeholder`
- **Methods** (via ref):
  - `focus()` - Focus the input
  - `blur()` - Blur the input
  - `insertText(text)` - Insert text at cursor
  - `cursorPosition` - Get/set cursor position

## Text Properties

- **Styling**: `fg` (foreground color), `bg` (background color), `attributes` (TextAttributes)
- **Attributes**: `wrap` (boolean)
- **Inline styles** via `<span style={{ ... }}>`

## Best Practices

1. **Keyboard Handlers**: Always wrap in `useCallback` to prevent unnecessary re-renders
2. **Refs**: Use `useRef` for accessing renderable instances
3. **Effects**: Use `useEffect` for focusing inputs and initial setup
4. **Memoization**: Use `useMemo` for expensive computations like filtering/grouping
5. **Event Handlers**: Memoize with `useCallback` for stable references
