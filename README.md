# Multi-Phase Orchestrator

A sophisticated TypeScript-based workflow orchestrator using the Claude Agent SDK to decompose complex development tasks into specialized phases, each handled by expert AI agents with dedicated instructions.

## Overview

The Multi-Phase Orchestrator automates complex software development workflows by intelligently breaking them into four specialized phases:

1. **Research Phase** (Opus 4.5) - Deep analysis, assumption verification, multi-approach exploration
2. **Planning Phase** (Opus 4.5) - Strategic planning and detailed implementation roadmap
3. **Implementation Phase** (Sonnet 4.5) - Fast, standards-compliant code execution
4. **Correction Phase** (Opus 4.5) - Quality review and issue identification

Each phase is powered by carefully crafted instruction files that guide agent behavior, ensuring consistent, high-quality results.

## Key Features

- **🤖 Specialized Agents**: Each phase uses an AI model optimized for its specific task
- **📋 Instruction-Driven**: Customizable markdown instructions guide agent behavior
- **🔗 Context Propagation**: Later phases receive all previous results for informed decisions
- **📊 Complete Traceability**: Every phase saves timestamped JSON outputs
- **⚡ Efficient**: Uses faster Sonnet for implementation, thorough Opus for analysis
- **🔧 Customizable**: Easy to modify instructions and add new phases

## Installation

```bash
# Clone or create the project
cd multi-phase-orchestrator

# Install dependencies
npm install

# Build the project
npm run build
```

## Quick Start

### Option 1: Command Line

```bash
npm start "Create a REST API with authentication and rate limiting"
```

### Option 2: Claude Code Integration

If you're using Claude Code:

```bash
cd multi-phase-orchestrator
claude
```

Then use the `/orchestrate` command:

```
/orchestrate Create a REST API with authentication and rate limiting
```

### Option 3: Programmatic Usage

```typescript
import { MultiPhaseOrchestrator } from './src/orchestrator';
import path from 'path';

const orchestrator = new MultiPhaseOrchestrator(
  path.join(__dirname, 'instructions'),
  path.join(__dirname, 'outputs')
);

await orchestrator.orchestrate(
  "Create a user authentication system with JWT tokens"
);
```

## Project Structure

```
multi-phase-orchestrator/
├── .claude/
│   ├── settings.json              # Claude Code configuration
│   ├── CLAUDE.md                  # Project context for Claude
│   └── commands/
│       └── orchestrate.md         # Custom /orchestrate command
│
├── instructions/
│   ├── research-phase.instructions.md        # Research agent guidelines
│   ├── implementation-phase.instructions.md  # Implementation standards
│   └── coding-standards.instructions.md      # Code quality standards
│
├── src/
│   └── orchestrator.ts            # Main orchestrator implementation
│
├── outputs/                       # Generated phase outputs (gitignored)
│   ├── research_[timestamp].json
│   ├── plan_[timestamp].json
│   ├── implement_[timestamp].json
│   ├── correct_[timestamp].json
│   └── workflow_summary_[timestamp].json
│
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md                      # This file
```

## How It Works

### Workflow Diagram

```
┌─────────────┐
│  User Task  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│  Research Phase (Opus 4.5)                  │
│  - Verify assumptions                        │
│  - Research multiple approaches              │
│  - Document findings with evidence           │
└──────┬──────────────────────────────────────┘
       │ (research findings)
       ▼
┌─────────────────────────────────────────────┐
│  Planning Phase (Opus 4.5)                  │
│  - Review research                           │
│  - Create detailed implementation plan       │
│  - Break down into actionable steps          │
└──────┬──────────────────────────────────────┘
       │ (implementation plan)
       ▼
┌─────────────────────────────────────────────┐
│  Implementation Phase (Sonnet 4.5)          │
│  - Execute plan step-by-step                 │
│  - Follow coding standards                   │
│  - Write tests and documentation             │
└──────┬──────────────────────────────────────┘
       │ (working code)
       ▼
┌─────────────────────────────────────────────┐
│  Correction Phase (Opus 4.5)                │
│  - Review implementation                     │
│  - Identify issues and gaps                  │
│  - Create corrective plan if needed          │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────────┐
│ Complete Solution │
└─────────────────┘
```

### Phase Details

#### Phase 1: Research (Opus 4.5)
- **Tools**: Read, Grep, Glob, WebSearch, WebFetch, Task
- **Goal**: Thoroughly research the task requirements
- **Output**: Research findings with evidence-based recommendations
- **Key Behaviors**:
  - Questions user assumptions
  - Independently verifies claims
  - Explores minimum 2 viable approaches
  - Documents only verified findings

#### Phase 2: Planning (Opus 4.5)
- **Tools**: Read, Write, Grep, Glob, Task
- **Goal**: Create detailed implementation plan
- **Output**: Structured plan with tasks and checkpoints
- **Key Behaviors**:
  - Reviews research findings
  - Breaks work into concrete steps
  - Identifies dependencies and risks
  - Provides clear acceptance criteria

#### Phase 3: Implementation (Sonnet 4.5)
- **Tools**: Read, Write, Edit, Bash, Grep, Glob, TodoWrite
- **Goal**: Execute the plan with high-quality code
- **Output**: Working, tested implementation
- **Key Behaviors**:
  - Follows project conventions
  - Implements completely (no half-finished work)
  - Includes proper error handling
  - Marks tasks complete as finished

#### Phase 4: Correction (Opus 4.5)
- **Tools**: Read, Edit, Bash, Grep, Glob, TodoWrite
- **Goal**: Review and ensure quality
- **Output**: Corrective plan if issues found
- **Key Behaviors**:
  - Critical review of implementation
  - Identifies gaps and issues
  - Creates actionable corrective plan
  - Validates against original requirements

## Instruction Files

The orchestrator's behavior is guided by three key instruction files:

### research-phase.instructions.md
Defines research methodology:
- Evidence-based documentation only
- Solution skepticism and assumption verification
- Multi-approach comparison requirements
- Information management practices

### implementation-phase.instructions.md
Defines implementation standards:
- Pre-implementation requirements (read plan, gather context)
- Step-by-step implementation workflow
- Technology-specific guidelines (React, C#, etc.)
- Testing requirements and patterns

### coding-standards.instructions.md
Defines code quality standards:
- General principles (consistency, simplicity, least exposure)
- C# / .NET specific standards
- TypeScript / React specific standards
- Anti-patterns to avoid

## Customization

### Modifying Instructions

Edit files in the `instructions/` directory to customize agent behavior:

```bash
# Edit research methodology
nano instructions/research-phase.instructions.md

# Adjust implementation standards
nano instructions/implementation-phase.instructions.md

# Update coding conventions
nano instructions/coding-standards.instructions.md
```

### Adding New Phases

To add a new phase:

1. Create instruction file: `instructions/[phase-name]-phase.instructions.md`
2. Add agent config in `src/orchestrator.ts`:

```typescript
const configs: Record<string, AgentConfig> = {
  // ... existing phases
  yourphase: {
    description: "Your phase description",
    tools: ["Read", "Write", "Grep"],
    model: "sonnet"
  }
};
```

3. Add phase execution in `orchestrate()` method:

```typescript
const yourPhaseResult = await this.runPhase(
  "yourphase",
  `Task: ${task}\n\nExecute your phase objectives.`,
  previousResults
);
```

### Changing Models

Modify the `getAgentConfig()` method to adjust which model runs each phase:

```typescript
research: {
  model: "opus"  // Change to "sonnet" for faster research
},
implement: {
  model: "sonnet"  // Or "opus" for more thorough implementation
}
```

## Example Usage

### Example 1: REST API Development

```bash
npm start "Create a REST API for a todo application with:
- User authentication (JWT)
- CRUD operations for todos
- Input validation
- Error handling
- Rate limiting
- Comprehensive tests"
```

**Expected Output**:
- Research findings on auth approaches, validation libraries, rate limiting strategies
- Detailed implementation plan with file structure and endpoints
- Working API code with tests
- Review identifying any security or performance issues

### Example 2: React Component

```bash
npm start "Implement a reusable DataTable component in React with:
- Sorting and filtering
- Pagination
- Customizable columns
- TypeScript types
- Storybook documentation"
```

### Example 3: Refactoring

```bash
npm start "Refactor the payment processing module to:
- Support multiple payment providers (Stripe, PayPal)
- Implement strategy pattern for extensibility
- Add comprehensive error handling
- Include retry logic for failed payments
- Update tests"
```

## Output Files

All phase outputs are saved in the `outputs/` directory:

```
outputs/
├── research_2026-01-08T12-30-00.json      # Research phase findings
├── plan_2026-01-08T12-35-00.json          # Implementation plan
├── implement_2026-01-08T12-45-00.json     # Implementation results
├── correct_2026-01-08T13-00-00.json       # Correction review
└── workflow_summary_2026-01-08T13-00-00.json  # Complete workflow summary
```

Each file contains:
- Phase name and timestamp
- Complete phase output
- Any errors encountered

## Best Practices

### Writing Good Task Descriptions

✅ **Good**:
```
Create a user authentication system with:
- Email/password login
- JWT token-based sessions
- Password reset via email
- Account verification
- Rate limiting on auth endpoints
- Comprehensive unit and integration tests
```

❌ **Bad**:
```
Add login
```

### Tips for Success

1. **Be Specific**: Provide detailed requirements upfront
2. **Set Context**: Mention existing technologies or constraints
3. **Define Success**: Describe what "done" looks like
4. **Review Outputs**: Check `outputs/` to understand agent decisions
5. **Iterate**: Refine instructions based on results
6. **Start Small**: Test with simpler tasks first

## Troubleshooting

### Issue: Phase producing unexpected results

**Solution**:
1. Review the phase's instruction file in `instructions/`
2. Check the phase output JSON in `outputs/`
3. Verify the agent has appropriate tools
4. Adjust instructions and re-run

### Issue: Long execution times

**Solution**:
1. Consider using Sonnet for more phases (faster but less thorough)
2. Simplify instruction files to focus on essentials
3. Break complex tasks into smaller orchestrations

### Issue: Missing context between phases

**Solution**:
1. Check console output for context preview
2. Review `workflow_summary` JSON to see full context chain
3. Ensure previous phase generated meaningful output

### Issue: Installation errors

**Solution**:
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install

# Ensure Node.js version is 18+
node --version

# Update TypeScript
npm install -g typescript
```

## Development

### Building

```bash
npm run build
```

Compiles TypeScript to JavaScript in the `dist/` directory.

### Development Mode

```bash
npm run dev
```

Runs with auto-reload on file changes (requires `--watch` flag support).

### Testing

```bash
npm test
```

(Tests not yet implemented - contributions welcome!)

## Integration with Claude Code

This orchestrator is designed to work seamlessly with Claude Code:

1. **Settings**: `.claude/settings.json` pre-configures permissions
2. **Context**: `.claude/CLAUDE.md` provides project understanding
3. **Commands**: Use `/orchestrate <task>` for easy invocation

### Setting Up with Claude Code

```bash
# In your terminal
cd multi-phase-orchestrator

# Start Claude Code
claude

# Use the orchestrate command
/orchestrate Your task description here
```

## Future Enhancements

- [ ] **Parallel Execution**: Run independent phases concurrently
- [ ] **Retry Logic**: Automatic retry with exponential backoff
- [ ] **Interactive Mode**: Approve each phase before proceeding
- [ ] **Result Caching**: Reuse research for similar tasks
- [ ] **Progress Dashboard**: Visual progress tracking
- [ ] **Phase Templates**: Pre-built templates for common workflows
- [ ] **Integration Tests**: Comprehensive test suite
- [ ] **CI/CD Integration**: GitHub Actions workflow examples

## Contributing

Contributions are welcome! Areas for improvement:

- Additional instruction templates
- Language-specific coding standards
- Example workflows
- Integration patterns
- Documentation improvements

## License

MIT

## Support

For issues or questions:
- Check the troubleshooting section above
- Review output files in `outputs/`
- Examine instruction files in `instructions/`
- Open an issue with details about your use case

---

**Version**: 1.0.0
**Status**: Production Ready
**Last Updated**: 2026-01-08
