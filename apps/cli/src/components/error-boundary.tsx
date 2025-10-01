import {
  BoxRenderable,
  OptimizedBuffer,
  RGBA,
  TextAttributes,
  type BoxOptions,
  type RenderContext,
} from "@opentui/core";
import { extend } from "@opentui/react";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { Theme } from "../theme";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  override state: ErrorBoundaryState = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true, error: _error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  override render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      return (
        <errorScreen
          errorName={this.state.error.name}
          errorMessage={this.state.error.message}
          errorStack={this.state.error.stack || ""}
        />
      );
    }

    return this.props.children;
  }
}

class ErrorScreenRenderable extends BoxRenderable {
  private errorName: string = "";
  private errorMessage: string = "";
  private errorStack: string = "";

  constructor(
    ctx: RenderContext,
    options: BoxOptions & {
      errorName?: string;
      errorMessage?: string;
      errorStack?: string;
    }
  ) {
    super(ctx, {
      flexDirection: "column",
      paddingTop: 2,
      paddingLeft: 2,
      paddingRight: 2,
      backgroundColor: RGBA.fromHex(Theme.background),
      ...options,
    });

    if (options.errorName) this.errorName = options.errorName;
    if (options.errorMessage) this.errorMessage = options.errorMessage;
    if (options.errorStack) this.errorStack = options.errorStack;
  }

  protected renderSelf(buffer: OptimizedBuffer): void {
    super.renderSelf(buffer);

    let currentY = this.y + 2;
    const startX = this.x + 2;

    // Title
    buffer.drawText(
      "Application Error",
      startX,
      currentY,
      RGBA.fromHex(Theme.danger),
      undefined,
      TextAttributes.BOLD
    );
    currentY += 2;

    // Description
    buffer.drawText(
      "An unexpected error occurred. Please restart the application.",
      startX,
      currentY,
      RGBA.fromHex(Theme.textMuted)
    );
    currentY += 2;

    // Error details
    if (this.errorName && this.errorMessage) {
      buffer.drawText(
        `${this.errorName}: ${this.errorMessage}`,
        startX,
        currentY,
        RGBA.fromHex(Theme.danger),
        undefined,
        TextAttributes.BOLD
      );
      currentY += 2;

      // Stack trace (first few lines)
      if (this.errorStack) {
        const stackLines = this.errorStack.split("\n").slice(1, 5);
        for (const line of stackLines) {
          buffer.drawText(
            line.trim(),
            startX,
            currentY,
            RGBA.fromHex(Theme.textMuted)
          );
          currentY += 1;
        }
      }
    }

    currentY += 2;
    buffer.drawText(
      "Press Ctrl+C to exit",
      startX,
      currentY,
      RGBA.fromHex(Theme.textMuted)
    );
  }

  set errorNameProp(value: string) {
    this.errorName = value;
    this.requestRender();
  }

  set errorMessageProp(value: string) {
    this.errorMessage = value;
    this.requestRender();
  }

  set errorStackProp(value: string) {
    this.errorStack = value;
    this.requestRender();
  }
}

declare module "@opentui/react" {
  interface OpenTUIComponents {
    errorScreen: typeof ErrorScreenRenderable;
  }
}

extend({ errorScreen: ErrorScreenRenderable });
