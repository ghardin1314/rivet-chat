import { TextAttributes } from "@opentui/core";
import { useMemo } from "react";
import { useKeybindingContext } from "../../providers/keybinding-provider";
import { Theme } from "../../theme";

export function HelpModalContent() {
  const { getAllActiveKeybindings } = useKeybindingContext();
  const keybindings = getAllActiveKeybindings();

  const grouped = useMemo(() => {
    const groups = new Map<string, Array<{ key: string; description: string }>>();

    keybindings.forEach((binding) => {
      const category = binding.category || "Other";
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push({
        key: binding.key,
        description: binding.description,
      });
    });

    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [keybindings]);

  return (
    <>
      <box flexDirection="row" justifyContent="space-between">
        <text attributes={TextAttributes.BOLD} fg={Theme.text}>
          Keyboard Shortcuts
        </text>
        <text fg={Theme.textMuted}>esc</text>
      </box>

      <scrollbox maxHeight={20} paddingTop={1} scrollbarOptions={{ visible: false }}>
        <box gap={1}>
          {grouped.map(([category, bindings]) => (
            <box key={category}>
              <text fg={Theme.accent} attributes={TextAttributes.BOLD}>
                {category}
              </text>
              <box paddingLeft={2} gap={0}>
                {bindings.map((binding, idx) => (
                  <box key={idx} flexDirection="row" gap={2}>
                    <box width={15}>
                      <text fg={Theme.primary} attributes={TextAttributes.BOLD}>
                        {binding.key}
                      </text>
                    </box>
                    <text fg={Theme.textMuted}>{binding.description}</text>
                  </box>
                ))}
              </box>
            </box>
          ))}
        </box>
      </scrollbox>
    </>
  );
}
