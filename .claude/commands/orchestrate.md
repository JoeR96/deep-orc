# Complex Task Orchestration

Execute a multi-phase workflow for complex development tasks:

**Phase 1: Research** (Opus 4.5)
- Conduct thorough research and analysis
- Verify user assumptions independently
- Explore multiple viable approaches
- Document findings with evidence
- Output: ./research/ directory with detailed findings

**Phase 2: Planning** (Opus 4.5)
- Review research findings
- Create detailed implementation plan
- Break down into concrete steps
- Identify dependencies and risks
- Output: plan.md with checklistPurpose and task breakdown

**Phase 3: Implementation** (Sonnet 4.5)
- Read and understand complete plan
- Implement following project conventions
- Write tests and documentation
- Mark tasks complete as finished
- Output: Working, tested code

**Phase 4: Correction** (Opus 4.5)
- Review implementation quality
- Identify issues and gaps
- Create corrective plan if needed
- Output: corrective-plan.md (if issues found)

## Process

The orchestrator will:
1. Load phase-specific instructions from `./instructions/`
2. Execute each phase in sequence
3. Pass context from previous phases forward
4. Save detailed outputs to `./outputs/`
5. Generate workflow summary JSON

## Instruction Files

The following instruction files guide each phase:
- `research-phase.instructions.md` - Research methodology and principles
- `implementation-phase.instructions.md` - Implementation standards and practices
- `coding-standards.instructions.md` - Language-specific coding conventions

## Usage

Provide a clear, detailed task description. Be specific about:
- What needs to be built/modified
- Any constraints or requirements
- Preferred technologies (if applicable)
- Expected outcomes

## Example Tasks

Good task descriptions:
- "Create a REST API with user authentication, rate limiting, and comprehensive error handling"
- "Implement a real-time game leaderboard with WebSocket updates and Redis caching"
- "Refactor the payment processing module to support multiple payment providers"

Poor task descriptions:
- "Make the app better" (too vague)
- "Fix bugs" (not specific enough)
- "Add features" (needs detail)

## Output Locations

- **Research findings**: `./research/*.md`
- **Implementation plan**: `./plan.md`
- **Phase outputs**: `./outputs/[phase]_[timestamp].json`
- **Workflow summary**: `./outputs/workflow_summary_[timestamp].json`
- **Source code**: Project directories (varies by task)

## Notes

- Each phase has access to appropriate tools only
- Implementation phase uses faster Sonnet model for efficiency
- Research and correction use Opus for thorough analysis
- All decisions are documented and traceable
- Outputs preserved for learning and debugging
