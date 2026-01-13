# Coding Standards Instructions

## Purpose

This document defines coding standards for implementation agents. The agent must analyze the task and project structure to determine which technology-specific standards apply.

## Priority of Standards

Follow standards in this order of precedence:

1. **Project-specific conventions** (if `CODING_STANDARDS.md` or similar exists in repo)
2. **Language/framework conventions** (documented below)
3. **General principles** (documented below)

### Checking for Project Standards

**MANDATORY**: Before writing any code:

1. Search for existing coding standards files:
   - `CODING_STANDARDS.md` or similar
2. If found, follow those standards first
3. Use these standards to fill gaps not covered by project docs

## General Principles

### Consistency Over Perfection

- **Scan the codebase** for existing patterns
- Match the style already in use
- Keep naming, formatting, and structure consistent
- Don't introduce new patterns without justification

### Simplicity and Clarity

- Write expressive code that reveals intent
- Keep names consistent and meaningful
- Prefer explicit over clever
- Don't optimize prematurely

### Minimal Complexity

- Don't add features beyond requirements
- Don't create abstractions for single use cases
- Don't add error handling for impossible scenarios
- Three similar lines > premature abstraction

### Least Exposure Rule

Apply the principle of least privilege to code visibility:

**Private > Internal > Protected > Public**

- Start with `private` by default
- Only increase visibility when actually needed
- Don't default to `public` without reason

## Language-Specific Standards

### C# / .NET

#### Visibility and Encapsulation

```csharp
// Good: Start private, expose only what's needed
public class GameEngine
{
    private readonly List<Player> _players = new();
    private GameState _state;

    public IReadOnlyList<Player> Players => _players;
    public GameState State => _state;

    internal void ResetForTesting() => _players.Clear();
}

// Bad: Everything public by default
public class GameEngine
{
    public List<Player> Players { get; set; } = new();
    public GameState State { get; set; }
}
```

#### Interfaces and Abstractions

**Don't add interfaces/abstractions unless**:

1. Used for external dependencies (databases, APIs, file system)
2. Needed for testing (mocking external systems)
3. Multiple implementations exist or are planned

```csharp
// Good: Interface for external dependency
public interface IGameRepository
{
    Task<Game> GetGameAsync(string id, CancellationToken ct);
}

// Bad: Unnecessary interface for internal logic
public interface IScoreCalculator { int Calculate(int points); }
public class ScoreCalculator : IScoreCalculator { /* ... */ }

// Better: Just use the class directly
public class ScoreCalculator
{
    public int Calculate(int points) => points * 10;
}
```

#### Don't Wrap Existing Abstractions

```csharp
// Bad: Wrapping existing abstraction
public interface IHttpClientWrapper
{
    Task<string> GetAsync(string url);
}

// Good: Use IHttpClientFactory directly
public class GameApiClient
{
    private readonly HttpClient _httpClient;

    public GameApiClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }
}
```

#### Naming Conventions

- **PascalCase**: Classes, methods, properties, public fields
- **camelCase**: Local variables, parameters, private fields (with `_` prefix)
- **ALL_CAPS**: Constants (sparingly, prefer static readonly)

```csharp
public class PlayerManager
{
    private readonly IPlayerRepository _repository;
    private const int MaxPlayers = 10;

    public async Task<Player> GetPlayerAsync(string playerId, CancellationToken cancellationToken)
    {
        var player = await _repository.FindAsync(playerId, cancellationToken);
        return player;
    }
}
```

#### Expressive C#

Use modern C# features for clarity:

```csharp
// Good: Pattern matching
public string GetPlayerStatus(Player player) => player.Score switch
{
    < 0 => "Eliminated",
    < 100 => "Beginner",
    < 500 => "Intermediate",
    _ => "Expert"
};

// Good: Null-conditional and null-coalescing
var name = player?.Name ?? "Unknown";

// Good: Target-typed new
List<Player> players = new();
Dictionary<string, int> scores = new();

// Good: String interpolation
var message = $"Player {name} scored {points} points";

// Bad: Verbose older style
var message = string.Format("Player {0} scored {1} points", name, points);
```

#### Async/Await (See implementation-phase.instructions.md)

- All async methods end with `Async`
- Pass `CancellationToken` through call chains
- Use `ConfigureAwait(false)` in library code (not UI code)

### TypeScript / React

#### Naming Conventions

- **PascalCase**: Components, interfaces, types, classes
- **camelCase**: Variables, functions, methods, props
- **SCREAMING_SNAKE_CASE**: Constants (sparingly)
- **kebab-case**: File names (optional, or PascalCase for components)

```typescript
// Good
interface PlayerCardProps {
  player: Player;
  onSelect: (id: string) => void;
}

export function PlayerCard({ player, onSelect }: PlayerCardProps) {
  const handleClick = () => onSelect(player.id);
  return <div onClick={handleClick}>{player.name}</div>;
}

// Constants
const MAX_PLAYERS = 10;
const API_BASE_URL = "https://api.example.com";
```

#### Type vs Interface

- Use `interface` for object shapes, especially component props
- Use `type` for unions, intersections, and primitives
- Be consistent within a file

```typescript
// Good: interface for props
interface GameBoardProps {
  gameId: string;
  mode: GameMode;
}

// Good: type for unions
type GameMode = "easy" | "medium" | "hard";
type Result = Success | Error;

// Good: type for complex composition
type PlayerWithScore = Player & { score: number };
```

#### Avoid Over-Typing

```typescript
// Bad: Obvious types
const name: string = "Alice";
const count: number = 0;

// Good: Let TypeScript infer
const name = "Alice";
const count = 0;

// Good: Type when not obvious
const players: Player[] = [];
const result = await fetchGame(id) as Game;
```

#### Component Organization

```typescript
// 1. Imports
import { useState, useEffect } from "react";
import { Player } from "@/types";
import { useGameLogic } from "@/hooks";

// 2. Types/Interfaces
interface GameBoardProps {
  gameId: string;
}

// 3. Component
export function GameBoard({ gameId }: GameBoardProps) {
  // 3a. Hooks
  const [players, setPlayers] = useState<Player[]>([]);
  const { currentPlayer } = useGameLogic(gameId);

  // 3b. Event handlers
  const handlePlayerSelect = (id: string) => {
    // ...
  };

  // 3c. Effects
  useEffect(() => {
    // ...
  }, [gameId]);

  // 3d. Render
  return <div>{/* ... */}</div>;
}

// 4. Helper functions (or move to utils if reusable)
function calculateScore(moves: Move[]): number {
  return moves.reduce((sum, m) => sum + m.points, 0);
}
```

#### Avoid Prop Drilling

```typescript
// Bad: Passing props through multiple levels
<GameBoard>
  <PlayerList players={players} onSelect={onSelect}>
    <PlayerCard player={p} onSelect={onSelect}>

// Good: Use context for widely-used data
const GameContext = createContext<GameContextType>(null!);

export function GameProvider({ children }) {
  const [players, setPlayers] = useState<Player[]>([]);
  return (
    <GameContext.Provider value={{ players, setPlayers }}>
      {children}
    </GameContext.Provider>
  );
}

// Components access directly
function PlayerCard() {
  const { players } = useContext(GameContext);
  // ...
}
```

#### File Structure

```
src/
├── components/
│   ├── GameBoard/
│   │   ├── GameBoard.tsx
│   │   ├── GameBoard.test.tsx
│   │   └── index.ts          # export { GameBoard } from './GameBoard'
│   └── PlayerCard/
│       └── PlayerCard.tsx
├── hooks/
│   ├── useGameLogic.ts
│   └── usePlayer.ts
├── services/
│   ├── gameService.ts
│   └── api.ts
├── types/
│   ├── game.ts
│   └── player.ts
├── utils/
│   └── calculations.ts
└── main.tsx
```

### JavaScript (if not using TypeScript)

- Use ESM modules (`import`/`export`)
- Use `const` by default, `let` when reassignment needed, never `var`
- Use arrow functions for callbacks and short functions
- Use async/await over raw Promises
- Use optional chaining `?.` and nullish coalescing `??`

```javascript
// Good
const players = await gameService.getPlayers(gameId);
const name = player?.name ?? "Unknown";

// Bad
var players;
gameService.getPlayers(gameId).then(function(result) {
  players = result;
});
```

## Project Structure Recognition

### How to Determine Project Type

1. **Check package.json** → Node.js/TypeScript/React project
   - `"react"` in dependencies → React project
   - `"vite"` in devDependencies → Vite build tool
   - `"typescript"` in devDependencies → TypeScript

2. **Check for .csproj files** → C# / .NET project
   - `<TargetFramework>net8.0</TargetFramework>` → .NET 8
   - `<Project Sdk="Microsoft.NET.Sdk.Web">` → ASP.NET Core

3. **Check file extensions**
   - `.tsx`, `.ts` → TypeScript
   - `.jsx`, `.js` → JavaScript
   - `.cs` → C#
   - `.py` → Python
   - `.go` → Go

### Multi-Language Projects

For projects with multiple languages:

- Follow language-specific standards for each file type
- Check for language-specific linters (`.eslintrc`, `.editorconfig`)
- Maintain consistency within each language domain

## Code Review Checklist

Before completing a task, verify:

- ✅ Follows project-specific conventions (if they exist)
- ✅ Matches existing code style in the file/project
- ✅ Uses appropriate visibility modifiers
- ✅ No unnecessary abstractions or interfaces
- ✅ Consistent naming throughout
- ✅ Appropriate error handling (not excessive)
- ✅ No duplicated code that should be consolidated
- ✅ Comments only where logic isn't self-evident
- ✅ Tests follow testing standards (if tests required)

## Anti-Patterns to Avoid

### Over-Engineering

```typescript
// Bad: Over-abstracted
interface IPlayerFactory {
  createPlayer(name: string): IPlayer;
}

class PlayerFactory implements IPlayerFactory {
  createPlayer(name: string): IPlayer {
    return new Player(name);
  }
}

// Good: Simple and direct
function createPlayer(name: string): Player {
  return new Player(name);
}
```

### Premature Optimization

```csharp
// Bad: Optimizing before measuring
public class GameEngine
{
    private readonly ConcurrentDictionary<string, Player> _playerCache = new();
    private readonly SemaphoreSlim _lock = new(1, 1);
    // Complex caching logic...
}

// Good: Start simple, optimize if needed
public class GameEngine
{
    private readonly List<Player> _players = new();

    public Player? GetPlayer(string id) => _players.Find(p => p.Id == id);
}
```

### Backwards-Compatibility Hacks

```csharp
// Bad: Keeping unused code "just in case"
public class Player
{
    [Obsolete("Use NewScore instead")]
    public int Score { get; set; }  // Unused

    public int NewScore { get; set; }
}

// Good: Remove what's not used
public class Player
{
    public int Score { get; set; }
}
```

### Unnecessary Validation

```csharp
// Bad: Validating internal calls
public class GameEngine
{
    private void ProcessMove(Move move)
    {
        if (move == null) throw new ArgumentNullException(nameof(move)); // Can't happen
        if (move.PlayerId == null) throw new ArgumentNullException(); // Internal call, trust it
        // ...
    }
}

// Good: Validate at boundaries only
public async Task<Result> HandlePlayerMove(MoveRequest request, CancellationToken ct)
{
    // Validate external input
    if (string.IsNullOrEmpty(request.PlayerId))
        return Result.Error("PlayerId required");

    var move = CreateMove(request);
    ProcessMove(move); // Trust internal call
}
```

---

**Remember**: These are guidelines to ensure consistency and quality. When project standards conflict with these guidelines, **follow the project standards**.
