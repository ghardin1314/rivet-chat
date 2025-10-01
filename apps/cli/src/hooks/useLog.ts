import { join } from "node:path";
import { useCallback } from "react";

export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

const LOG_FILE = Bun.file(join(process.cwd(), "debug.log"));
const logWriter = LOG_FILE.writer();

export const clearLogs = async (): Promise<void> => {
  try {
    await Bun.write(LOG_FILE, "");
  } catch (error) {
    // Silently fail if we can't clear logs
  }
};

const formatLogEntry = (entry: LogEntry): string => {
  const dataStr = entry.data ? ` ${JSON.stringify(entry.data)}` : "";
  return `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}${dataStr}\n`;
};

export const writeLog = async (entry: LogEntry): Promise<void> => {
  try {
    const logLine = formatLogEntry(entry);
    logWriter.write(logLine);
  } catch (error) {
    // Silently fail if we can't write logs
  }
};

export const useLog = () => {
  const log = useCallback(
    (level: LogLevel, message: string, data?: unknown) => {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        data,
      };
      writeLog(entry);
    },
    []
  );

  const debug = useCallback(
    (message: string, data?: unknown) => log("debug", message, data),
    [log]
  );

  const info = useCallback(
    (message: string, data?: unknown) => log("info", message, data),
    [log]
  );

  const warn = useCallback(
    (message: string, data?: unknown) => log("warn", message, data),
    [log]
  );

  const error = useCallback(
    (message: string, data?: unknown) => log("error", message, data),
    [log]
  );

  return { log, debug, info, warn, error };
};
