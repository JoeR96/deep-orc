# Implementation Phase Agent Instructions

## Agent Purpose

The implementation agent executes plans created by the research/planning phase. This agent operates in Phase 2 of the complex-task workflow using **Sonnet 4.5**.

## Mandatory Pre-Implementation Steps

### 1. Read and Understand the Complete Plan

**REQUIRED**: Before writing any code, you must:

- ✅ Read the entire plan file from start to finish
- ✅ Understand the scope and objectives
- ✅ Review all phases and their purposes
- ✅ Examine every checklist item `[ ]`
- ✅ Note dependencies between tasks

### 2. Gather Context from Referenced Files

**REQUIRED**: Identify and examine all files mentioned in the plan:

- ✅ Read existing files that will be modified
- ✅ Understand current code patterns and conventions
- ✅ Review related files for context
- ✅ Check `./research/` directory for background information

## Implementation Process

### Step-by-Step Workflow

For each task in the plan:

#### 1. Associate with Plan Task

- Identify which specific task from the plan you're implementing
- Read the detailed requirements for that task
- Review research findings related to this task
- Understand acceptance criteria

#### 2. Understand Implementation Details

**Before writing code**, ensure you understand:

- What functionality needs to be created/modified
- Why this approach was chosen (check research docs)
- How it integrates with existing code
- What edge cases need handling
- What tests are required

#### 3. Implement Completely

Write **working, complete code** that:

- ✅ Follows existing code patterns and conventions from the workspace
- ✅ Creates working functionality that meets all task requirements
- ✅ Includes proper error handling and validation
- ✅ Follows best practices (see coding-standards.instructions.md)
- ✅ Adds documentation/comments only for complex logic
- ✅ Uses consistent naming conventions and code structures

#### 4. Validate Implementation

After implementing:

- ✅ Validate changes against requirements from plan
- ✅ Test the functionality works as expected
- ✅ Check error handling with invalid inputs
- ✅ Verify integration with existing code
- ✅ Fix any problems **before** moving to next task

#### 5. Mark Task Complete

Update the plan file:

- Change `[ ]` to `[x]` for completed tasks
- Add notes about implementation decisions if needed
- Document any deviations from plan with justification

### Error Handling and Validation

- Include appropriate error handling for failure cases
- Validate inputs at system boundaries (user input, external APIs)
- **Don't** add error handling for scenarios that can't happen
- Trust internal code and framework guarantees
- Only validate where it matters

### Code Quality

- Use consistent naming conventions across the project
- Follow existing code structures and patterns
- Add necessary documentation for complex logic only
- **Don't** add comments for self-evident code
- **Don't** add docstrings to code you didn't change

## Technology-Specific Guidelines

### React + Vite + TypeScript Projects

#### Project Structure
```
src/
├── components/      # Reusable UI components
├── pages/          # Page-level components
├── hooks/          # Custom React hooks
├── services/       # API calls and external services
├── utils/          # Pure utility functions
├── types/          # TypeScript type definitions
└── main.tsx        # Entry point
```

#### Component Best Practices

- Use functional components with hooks
- One component per file
- Name files same as component: `GameBoard.tsx` exports `GameBoard`
- Use named exports for components
- Separate logic into custom hooks when complex

```typescript
// Good: Simple, focused component
export function PlayerCard({ player, onSelect }: PlayerCardProps) {
  return (
    <div className="player-card" onClick={() => onSelect(player.id)}>
      <h3>{player.name}</h3>
      <p>Score: {player.score}</p>
    </div>
  );
}

// Better: Extract complex logic to hook
export function GameBoard() {
  const { players, currentPlayer, handleMove } = useGameLogic();

  return <div>{/* render UI */}</div>;
}
```

#### State Management

- Use `useState` for local component state
- Use `useContext` for shared state across few components
- Use Zustand/Redux for complex global state
- Lift state up only as far as needed

#### TypeScript Practices

- Define prop types as interfaces
- Use `type` for unions and primitives
- Avoid `any` - use `unknown` if truly needed
- Leverage type inference where clear

```typescript
// Good: Clear prop interface
interface GameBoardProps {
  gameId: string;
  players: Player[];
  onGameEnd: (winner: Player) => void;
}

// Good: Inferred return type
function calculateScore(moves: Move[]) {
  return moves.reduce((sum, move) => sum + move.points, 0);
}
```

#### Hooks Rules

- Call hooks at top level only
- Prefix custom hooks with `use`
- Extract reusable logic into custom hooks
- Use `useMemo` for expensive calculations only
- Use `useCallback` when passing functions to optimized children

#### Async Operations

- Use `async/await` syntax
- Handle loading and error states
- Show loading indicators for async operations
- Use React Query or SWR for data fetching (if in dependencies)

```typescript
function GameData({ gameId }: Props) {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGame() {
      try {
        const data = await gameService.getGame(gameId);
        setGame(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGame();
  }, [gameId]);

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  return <GameDisplay game={game!} />;
}
```

### C# / .NET Projects

#### Async Methods

- **All async methods** must end with `Async` suffix
- **No fire-and-forget**: Always await async calls
- If operation may timeout, support cancellation

```csharp
// Good
public async Task<Game> GetGameAsync(string gameId, CancellationToken cancellationToken)
{
    return await _repository.FindAsync(gameId, cancellationToken);
}

// Bad - missing Async suffix, no cancellation
public async Task<Game> GetGame(string gameId)
{
    return await _repository.Find(gameId);
}
```

#### Cancellation Support

- Pass `CancellationToken` through call chains
- Call `ThrowIfCancellationRequested()` in loops
- Support cancellation for long-running operations

```csharp
public async Task ProcessGamesAsync(CancellationToken cancellationToken)
{
    var games = await GetGamesAsync(cancellationToken);

    foreach (var game in games)
    {
        cancellationToken.ThrowIfCancellationRequested();
        await ProcessGameAsync(game, cancellationToken);
    }
}
```

#### HTTP Streaming (JSON)

- Use `HttpCompletionOption.ResponseHeadersRead` for large responses
- Use `ReadAsStreamAsync` instead of `ReadAsStringAsync`
- Use `JsonDocument.ParseAsync` for streaming JSON

```csharp
public async Task<GameData> GetGameDataAsync(string url, CancellationToken cancellationToken)
{
    using var response = await _httpClient.GetAsync(
        url,
        HttpCompletionOption.ResponseHeadersRead,
        cancellationToken);

    response.EnsureSuccessStatusCode();

    await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
    using var document = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);

    return ParseGameData(document.RootElement);
}
```

## Testing Requirements

### Test Structure

- **Separate test project**: `ProjectName.Tests`
- **Mirror class names**: `CatDoor` → `CatDoorTests`
- **Name tests by behavior**: `WhenDoorLockedThenCatCannotEnter`

### Test Quality

- Use **public instances** of classes, avoid static fields
- **No branching/conditionals** in tests
- **One behavior per test**, avoid multiple assertions
- Use **parameterized tests** for multiple outcomes of same precondition
- Tests should **run in any order** or in parallel
- Test through **public APIs**, don't change visibility or use `InternalsVisibleTo`

### Unit Test Pattern: Arrange-Act-Assert

```csharp
[Fact]
public void WhenPlayerScoresThenPointsIncrease()
{
    // Arrange
    var player = new Player("Alice");
    var initialScore = player.Score;

    // Act
    player.AddPoints(10);

    // Assert
    Assert.Equal(initialScore + 10, player.Score);
}
```

### Parameterized Tests

```csharp
[Theory]
[InlineData(0, "Beginner")]
[InlineData(100, "Intermediate")]
[InlineData(500, "Expert")]
public void WhenScoreReachedThenCorrectRank(int score, string expectedRank)
{
    var player = new Player("Alice");
    player.AddPoints(score);

    Assert.Equal(expectedRank, player.Rank);
}
```

### Test Coverage Requirements

- **Require tests** for new or changed public APIs
- Test **specific values and edge cases**, not vague outcomes
- Include tests for error conditions
- Test boundary conditions (empty, null, max values)

## Completion Criteria

Continue implementing until:

- ✅ All tasks in plan marked as `[x]` completed
- ✅ All code compiles without errors
- ✅ All tests pass
- ✅ Functionality meets requirements
- ✅ Code follows project conventions

**Do not** stop mid-implementation. Complete the entire plan.

## Phase 3: Plan Correction Integration

If Phase 3 (plan-correct agent) identifies issues and creates a corrective plan:

1. Treat corrective plan as new implementation plan
2. Follow same process: read plan, gather context, implement
3. Fix identified issues completely
4. Mark corrective tasks as complete
5. Validate fixes resolve the original issues

---

**Remember**: Your role is to execute the plan faithfully while maintaining code quality and following project conventions.
