# SlopCompose Language Specification

## Overview
SlopCompose is a declarative composition language for prompt-generated AI modules. Source files are valid TypeScript `.d.ts` type definitions that describe module composition, APIs, and application structure.

## Core Concepts

### PromptModule
A `PromptModule<T>` represents a single AI-generated component with:
- A natural language **prompt** describing its implementation
- A public **API** (function signatures and types)
- Optional **types** definitions shared with other modules
- Optional **module** dependencies (other modules it composes with)

### Toplevel
A `Toplevel<T>` describes the complete application with:
- A high-level **prompt** for the entire application
- **Target language** (html, python, javascript, etc.)
- **Modules** that compose the application
- Optional **skeleton** template (for web apps)
- Optional **targetFilename** for output

## Language Structure

SlopCompose files use valid TypeScript type syntax:

```typescript
/**
 * Core module type describing a prompt-generated AI component.
 */
type PromptModule<T extends {
    /** Natural‑language instruction describing what this module should implement */
    prompt: string;

    /** Public API surface of the module (string signatures or structured types) */
    api: Record<string, any>;

    /** Type definitions contributed by this module */
    types?: Record<string, any>;

    /** Graph-style dependencies: other modules this module composes with */
    modules?: PromptModule<any>[];
}> = T;

/**
 * Root application descriptor
 */
type Toplevel<T extends {
    prompt: string;
    modules: PromptModule<any>[];
    targetLanguage: string;
    skeleton?: string;
    targetFilename?: string;
}> = T;
```

## Example: Water Sort Puzzle PWA

```typescript
/**
 * Root application module
 */
export type WaterSortApp = Toplevel<{
    prompt: "Write a PWA water sort puzzle game";
    targetLanguage: "html";
    targetFilename: "index.html";
    skeleton: PWASkeleton;
    modules: [LogicModule, SolverModule, UIModule];
}>;

// Shared types
type Color = string;
type Bottle = { capacity: number; contents: Color[] };
type GameState = { bottles: Bottle[] };
type Move = { from: number; to: number };

// LogicModule: manages game state and rules
type LogicModule = PromptModule<{
    prompt: "Generate and manipulate Water Sort game states. Output valid game logic, enforce all rules, and ensure moves follow puzzle constraints.";
    api: {
        generateLevel: (difficulty: number) => GameState;
        applyMove: (state: GameState, move: Move) => GameState;
        isSolved: (state: GameState) => boolean;
    };
    types: {
        Bottle: Bottle;
        GameState: GameState;
        Move: Move;
    };
}>;

// SolverModule: produces solution sequences
type SolverModule = PromptModule<{
    prompt: "Analyze a Water Sort game state and produce an optimal or near-optimal sequence of moves that solves the puzzle.";
    api: {
        solve: (state: GameState) => Move[];
    };
}>;

// UIModule: renders visual interface
type UIModule = PromptModule<{
    prompt: "Render Water Sort game states into a visual UI representation suitable for display in a browser environment.";
    api: {
        render: (state: GameState, container: HTMLElement) => void;
    };
}>;

// HTML skeleton for PWA
type PWASkeleton = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="manifest" href="manifest.webmanifest" />
  </head>
  <body>
    <script>
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("sw.js");
      }
    </script>
  </body>
</html>
`;
```

## AI Parsing

SlopCompose files are designed to be parsed by AI tools:

1. **Extract prompts** - AI tools read the `prompt` field from each module
2. **Parse APIs** - Type signatures define what the AI must generate
3. **Resolve dependencies** - Module graphs show composition structure
4. **Generate code** - AI produces implementations matching the API contracts
5. **Combine output** - Multiple generated modules integrate via shared types

## Design Principles

- **Declarative** - Describe *what* modules do, not how they're built
- **Composable** - Modules declare dependencies and share types
- **Lintable** - Valid TypeScript enables tooling (prettier, eslint, tsc)
- **AI-Friendly** - Clear structure for AI tools to parse and generate
- **Type-Safe** - Type annotations enable contracts between modules