# Quick Start Guide

Get up and running with the Multi-Phase Orchestrator in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Claude Code CLI (optional, for `/orchestrate` command)

## Step 1: Install Dependencies

```bash
cd multi-phase-orchestrator
npm install
```

This installs:
- `@anthropic-ai/claude-agent-sdk` - For agent orchestration
- `typescript` - TypeScript compiler
- `ts-node` - TypeScript execution
- `@types/node` - Node.js type definitions

## Step 2: Verify Installation

```bash
npm run build
```

Should compile without errors and create a `dist/` directory.

## Step 3: Run Your First Orchestration

### Method A: Using npm start

```bash
npm start "Create a simple calculator module with add, subtract, multiply, and divide functions"
```

### Method B: Using ts-node directly

```bash
npx ts-node src/orchestrator.ts "Create a simple calculator module"
```

### Method C: Using Claude Code (if installed)

```bash
# Start Claude Code in the project directory
claude

# Then use the orchestrate command
/orchestrate Create a simple calculator module with add, subtract, multiply, and divide functions
```

## Step 4: Review Outputs

Check the `outputs/` directory for phase results:

```bash
# List all outputs
ls outputs/

# View the workflow summary (use the actual filename)
cat outputs/workflow_summary_*.json
```

Each phase creates a timestamped JSON file with its complete output.

## Step 5: Customize Instructions

Edit instruction files to match your needs:

```bash
# Edit research methodology
nano instructions/research-phase.instructions.md

# Update implementation standards
nano instructions/implementation-phase.instructions.md

# Modify coding standards
nano instructions/coding-standards.instructions.md
```

## Common First Tasks to Try

### Task 1: Simple Utility Function

```bash
npm start "Create a string utility module with functions for:
- Capitalize first letter
- Convert to title case
- Truncate with ellipsis
- Count words"
```

### Task 2: Data Structure

```bash
npm start "Implement a Queue data structure in TypeScript with:
- Enqueue and dequeue methods
- Peek method
- Size property
- isEmpty method
- Generic type support"
```

### Task 3: API Integration

```bash
npm start "Create a weather API client that:
- Fetches current weather by city
- Handles errors gracefully
- Includes TypeScript types
- Has retry logic"
```

## Understanding the Output

After running an orchestration, you'll see:

1. **Console Output**: Real-time phase execution logs
2. **Phase JSON Files**: Detailed output from each phase
3. **Workflow Summary**: Combined results of all phases

Example workflow summary structure:

```json
{
  "research": "Research phase findings...",
  "plan": "Implementation plan...",
  "implement": "Implementation results...",
  "correct": "Review and corrections..."
}
```

## Next Steps

1. **Explore Examples**: Try the examples in README.md
2. **Customize Instructions**: Tailor behavior to your workflow
3. **Review Outputs**: Learn from agent decisions
4. **Add Phases**: Extend with custom phases
5. **Integrate**: Use in your development workflow

## Troubleshooting

### "Cannot find module '@anthropic-ai/claude-agent-sdk'"

```bash
npm install @anthropic-ai/claude-agent-sdk
```

### "tsc: command not found"

```bash
npm install -g typescript
```

### "Permission denied" errors

```bash
# On Unix/Mac
chmod +x node_modules/.bin/*

# On Windows, run terminal as Administrator
```

### Empty or missing outputs

- Check that `outputs/` directory exists
- Verify write permissions
- Review console for errors

## Tips for Success

- **Start Simple**: Begin with basic tasks to understand the flow
- **Read Outputs**: Phase outputs show agent reasoning
- **Iterate**: Refine instructions based on results
- **Be Specific**: Detailed task descriptions yield better results
- **Review Docs**: Check README.md and CLAUDE.md for details

## Getting Help

1. Check README.md for comprehensive documentation
2. Review instruction files for behavior guidelines
3. Examine output JSON files for debugging
4. Check .claude/CLAUDE.md for project context

## Ready to Build?

You're all set! The orchestrator is ready to tackle complex tasks. Start with a simple task and gradually increase complexity as you become familiar with the system.

```bash
npm start "Your task description here"
```

Happy orchestrating! 🚀
