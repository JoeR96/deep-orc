# Installation Guide

This guide shows you how to install and use Complex Task Agent in your projects.

## Installation Methods

### Method 1: Local Installation (Recommended for Development)

Install directly from the local directory:

```bash
# In your project directory
cd /path/to/your-project

# Install complex-task-agent from local directory
npm install /path/to/complex-task-agent

# Initialize in your project
npx complex-task init
```

### Method 2: npm link (For Active Development)

If you're developing both the agent and your project:

```bash
# In the complex-task-agent directory
cd /path/to/complex-task-agent
npm link

# In your project directory
cd /path/to/your-project
npm link complex-task-agent

# Initialize in your project
npx complex-task init
```

### Method 3: Published Package (Future)

Once published to npm:

```bash
npm install -g complex-task-agent
# OR
npm install complex-task-agent

complex-task init
```

## Quick Start

### Step 1: Create Your Project

```bash
mkdir my-game-show-simulator
cd my-game-show-simulator
npm init -y
```

### Step 2: Install Complex Task Agent

```bash
# Option A: From local directory
npm install C:/Users/Administrator/complex-task-agent

# Option B: Using npm link
cd C:/Users/Administrator/complex-task-agent
npm link
cd /path/to/my-game-show-simulator
npm link complex-task-agent
```

### Step 3: Initialize

```bash
npx complex-task init
```

This creates:
- `.claude/` - Claude Code integration
- `instructions/` - Agent instruction files
- `outputs/` - Phase outputs (gitignored)
- `COMPLEX_TASK_AGENT.md` - Usage guide

### Step 4: Start Orchestrating

#### Option A: Using Claude Code (Recommended)

```bash
claude
```

Then in Claude Code:
```
/orchestrate Create a game show simulator with question management,
player tracking, and scoring system
```

#### Option B: Using CLI

```bash
npx complex-task orchestrate "Create a game show simulator with
question management, player tracking, and scoring system"
```

## Example: Game Show Simulator Project

Here's a complete example of setting up and using the agent:

```bash
# 1. Create project
mkdir game-show-simulator
cd game-show-simulator
npm init -y

# 2. Install complex-task-agent
npm install C:/Users/Administrator/complex-task-agent

# 3. Initialize
npx complex-task init

# 4. Review the orchestration guide
cat .claude/commands/orchestrate.md

# 5. Craft your task description
cat > task.md <<'EOF'
Domain: Interactive game show simulation

Problem:
Create a game show simulator for hosting quiz competitions. Need to manage
questions, track multiple players, calculate scores, and handle different
game modes (Jeopardy-style, trivia, buzzer rounds).

Core concepts:
- Game: A single game instance with players and questions
- Player: Participant with name, score, and answer history
- Question: Text prompt with answer(s), category, point value
- Round: Timed segment with specific rules
- GameMode: Different game formats (trivia, jeopardy, speed round)

Key use cases:

1. Host starts game:
   - Select game mode and difficulty
   - Add players (2-8)
   - System loads appropriate question set
   - Timer starts for first round

2. Player answers question:
   - Player buzzes in (first player locks others out)
   - Player provides answer
   - Host marks correct/incorrect
   - Score updated automatically
   - Next question presented

3. End game and determine winner:
   - All rounds completed or time expires
   - Final scores calculated (with bonuses)
   - Winner announced
   - Stats saved (player history, question performance)

Business rules:
- Question categories must balance across rounds
- Cannot reuse questions within same game
- Buzzer lockout: 1 second after answer attempt
- Scoring: Base points × difficulty multiplier
- Ties broken by: fastest average answer time

Entities:
- Game (id, mode, players[], rounds[], status, startedAt)
  States: Setup → InProgress → Paused → Completed

- Player (id, name, score, buzzIns, correctAnswers, avgResponseTime)
- Question (id, category, text, correctAnswer, points, difficulty)
- Round (number, questions[], timeLimit, bonusRules)
- BuzzIn (playerId, timestamp, answer, isCorrect)

Integration points:
- Question API: Fetch questions by category/difficulty (cache locally)
- Buzzer hardware: Read buzzer inputs (USB HID devices)
- Display: Real-time scoreboard updates (WebSocket or HTTP streaming)
- Stats DB: Record game history for analysis

Failure scenarios:
- Player disconnects mid-game → mark as inactive, don't block game
- Buzzer hardware fails → fallback to keyboard input
- Timer system lags → use server timestamp, not client
- Question API down → use locally cached questions

Non-functional requirements:
- Buzzer latency: <50ms from press to registration
- Support 2-8 players simultaneously
- Question load time: <100ms
- Real-time score updates: <200ms
- Store history: last 100 games

Avoid:
- Hardcoding question sets (externalize to API/DB)
- Tightly coupling game modes (strategy pattern)
- Client-side scoring (server authoritative)
- Synchronous question API calls during gameplay
EOF

# 6. Run orchestrator with your task
npx complex-task orchestrate "$(cat task.md)"

# OR use Claude Code
claude
# Then: /orchestrate $(cat task.md)
```

## Project Structure After Initialization

```
your-project/
├── .claude/
│   ├── CLAUDE.md
│   ├── settings.json
│   └── commands/
│       └── orchestrate.md         # Comprehensive guide
│
├── instructions/
│   ├── research-phase.instructions.md
│   ├── implementation-phase.instructions.md
│   └── coding-standards.instructions.md
│
├── outputs/                        # Gitignored
│   └── .gitkeep
│
├── node_modules/
│   └── complex-task-agent/         # Installed agent
│
├── COMPLEX_TASK_AGENT.md          # Usage guide
├── package.json
└── .gitignore                      # Updated with output exclusions
```

## Customization

### Customize Instructions

Edit instruction files to match your project needs:

```bash
# Customize research methodology
nano instructions/research-phase.instructions.md

# Adjust implementation standards
nano instructions/implementation-phase.instructions.md

# Update coding conventions
nano instructions/coding-standards.instructions.md
```

### Customize Claude Code Settings

```bash
nano .claude/settings.json
```

Adjust permissions, models, or behavior.

### Add Custom Commands

Create additional commands:

```bash
nano .claude/commands/my-custom-command.md
```

## Usage Patterns

### Pattern 1: Full Orchestration

For complex, multi-component features:

```bash
npx complex-task orchestrate "Build player management system with
registration, profiles, and matchmaking"
```

### Pattern 2: Quick Tasks with Claude Code

For smaller tasks:

```bash
claude
# Then:
/orchestrate Add input validation to player registration
```

### Pattern 3: Iterative Development

Start with research, review, then implement:

```bash
# First, just research
npx complex-task orchestrate "Research approaches for real-time
player synchronization across devices"

# Review research/
ls research/

# Then implement based on findings
npx complex-task orchestrate "Implement WebSocket-based player
synchronization using the Socket.io approach from research"
```

## Output Management

### View Phase Outputs

```bash
# List all workflow summaries
ls outputs/workflow_summary_*.json

# View latest workflow
cat $(ls -t outputs/workflow_summary_*.json | head -1) | jq .

# View specific phase
cat $(ls -t outputs/research_*.json | head -1) | jq .
```

### Clean Old Outputs

```bash
# Remove outputs older than 7 days
find outputs/ -name "*.json" -mtime +7 -delete

# Keep only last 10 workflows
ls -t outputs/workflow_summary_*.json | tail -n +11 | xargs rm -f
```

## Troubleshooting

### "complex-task: command not found"

```bash
# Use npx instead
npx complex-task init

# Or install globally
npm install -g /path/to/complex-task-agent
```

### "Complex Task Agent not initialized"

```bash
# Make sure you've run init first
npx complex-task init

# Check that directories exist
ls -la .claude instructions outputs
```

### "Cannot find module 'complex-task-agent'"

```bash
# Reinstall
npm install /path/to/complex-task-agent

# Or use npm link
cd /path/to/complex-task-agent && npm link
cd /path/to/your-project && npm link complex-task-agent
```

### Permission Errors on Windows

Run terminal as Administrator, or adjust permissions:

```powershell
# PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Uninstallation

To remove Complex Task Agent from a project:

```bash
# Remove the package
npm uninstall complex-task-agent

# Optionally remove agent files
rm -rf .claude instructions outputs COMPLEX_TASK_AGENT.md

# Clean .gitignore (remove agent-related entries)
nano .gitignore
```

## Next Steps

1. **Read the orchestration guide**: `.claude/commands/orchestrate.md`
2. **Review instruction files**: `instructions/`
3. **Craft your first task**: Use the 9-part framework
4. **Run your first orchestration**: `npx complex-task orchestrate "<task>"`
5. **Review outputs**: `outputs/workflow_summary_*.json`
6. **Iterate and refine**: Adjust instructions based on results

## Resources

- **Orchestration Guide**: `.claude/commands/orchestrate.md` (comprehensive)
- **Quick Reference**: `COMPLEX_TASK_AGENT.md` (in your project)
- **Main README**: `node_modules/complex-task-agent/README.md`
- **Examples**: See orchestration guide for detailed task examples

---

Happy orchestrating! 🚀
