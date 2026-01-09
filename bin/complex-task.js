#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PACKAGE_ROOT = path.join(__dirname, '..');

function showHelp() {
  console.log(`
Complex Task Agent - Multi-phase workflow orchestrator

Usage:
  complex-task <command> [options]

Commands:
  init [dir]           Initialize complex-task-agent in a project directory
                       Creates .claude/, instructions/, and outputs/ directories
                       Default: current directory

  orchestrate <task>   Run the orchestrator with a task description
                       (Requires initialization first)

  version              Show version information
  help                 Show this help message

Examples:
  # Initialize in current directory
  complex-task init

  # Initialize in specific directory
  complex-task init ./my-game-project

  # Run orchestrator (after init)
  complex-task orchestrate "Create a user authentication system"

  # Or use with Claude Code after init:
  cd my-project
  claude
  /orchestrate <your task>

For more information, visit: https://github.com/your-org/complex-task-agent
`);
}

function showVersion() {
  const packageJson = require(path.join(PACKAGE_ROOT, 'package.json'));
  console.log(`complex-task-agent v${packageJson.version}`);
}

function copyDirectoryRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectoryRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`  ✓ ${destPath}`);
    }
  }
}

function initProject(targetDir = '.') {
  const targetPath = path.resolve(targetDir);

  console.log(`\n🚀 Initializing Complex Task Agent in: ${targetPath}\n`);

  // Check if target directory exists
  if (!fs.existsSync(targetPath)) {
    console.error(`❌ Error: Directory does not exist: ${targetPath}`);
    console.log(`\nCreate it first with: mkdir -p ${targetPath}`);
    process.exit(1);
  }

  // Check if already initialized
  const claudeDir = path.join(targetPath, '.claude');
  if (fs.existsSync(claudeDir) && fs.existsSync(path.join(claudeDir, 'commands', 'orchestrate.md'))) {
    console.log('⚠️  Complex Task Agent appears to be already initialized.');
    console.log('   .claude/commands/orchestrate.md already exists.\n');

    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question('   Overwrite existing files? (y/N): ', (answer) => {
      readline.close();
      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        console.log('\n✋ Initialization cancelled.\n');
        process.exit(0);
      }
      performInit(targetPath);
    });
    return;
  }

  performInit(targetPath);
}

function performInit(targetPath) {
  try {
    // Copy .claude directory
    console.log('📁 Setting up .claude directory...');
    const claudeSrc = path.join(PACKAGE_ROOT, '.claude');
    const claudeDest = path.join(targetPath, '.claude');
    copyDirectoryRecursive(claudeSrc, claudeDest);

    // Copy instructions directory
    console.log('\n📚 Setting up instructions directory...');
    const instructionsSrc = path.join(PACKAGE_ROOT, 'instructions');
    const instructionsDest = path.join(targetPath, 'instructions');
    copyDirectoryRecursive(instructionsSrc, instructionsDest);

    // Create outputs directory
    console.log('\n📊 Creating outputs directory...');
    const outputsDir = path.join(targetPath, 'outputs');
    if (!fs.existsSync(outputsDir)) {
      fs.mkdirSync(outputsDir, { recursive: true });
      console.log(`  ✓ ${outputsDir}`);
    }

    // Create .gitkeep in outputs
    const gitkeepPath = path.join(outputsDir, '.gitkeep');
    fs.writeFileSync(gitkeepPath, '');
    console.log(`  ✓ ${gitkeepPath}`);

    // Update .gitignore if it exists, or create one
    console.log('\n📝 Updating .gitignore...');
    const gitignorePath = path.join(targetPath, '.gitignore');
    let gitignoreContent = '';

    if (fs.existsSync(gitignorePath)) {
      gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
    }

    const ignoreEntries = [
      '\n# Complex Task Agent outputs',
      'outputs/*.json',
      'outputs/*.md',
      'research/'
    ];

    let updated = false;
    for (const entry of ignoreEntries) {
      if (!gitignoreContent.includes(entry.trim())) {
        gitignoreContent += entry + '\n';
        updated = true;
      }
    }

    if (updated) {
      fs.writeFileSync(gitignorePath, gitignoreContent);
      console.log(`  ✓ Updated ${gitignorePath}`);
    } else {
      console.log('  ℹ .gitignore already configured');
    }

    // Create a README in the project explaining usage
    console.log('\n📖 Creating COMPLEX_TASK_AGENT.md...');
    const readmePath = path.join(targetPath, 'COMPLEX_TASK_AGENT.md');
    const readmeContent = `# Complex Task Agent Integration

This project uses the Complex Task Agent for multi-phase workflow orchestration.

## Quick Start

### Option 1: Using Claude Code

\`\`\`bash
claude
/orchestrate <your task description>
\`\`\`

### Option 2: Using CLI

\`\`\`bash
complex-task orchestrate "<your task description>"
\`\`\`

## How It Works

The orchestrator breaks complex tasks into 4 phases:

1. **Research** (Opus 4.5) - Deep domain analysis and approach exploration
2. **Planning** (Opus 4.5) - Strategic implementation planning
3. **Implementation** (Sonnet 4.5) - High-quality code execution
4. **Correction** (Opus 4.5) - Architectural review and fixes

## Writing Effective Task Descriptions

See \`.claude/commands/orchestrate.md\` for comprehensive guidance on:
- The 9-part problem statement framework
- Domain modeling and business rules
- Integration boundaries and failure scenarios
- Example task descriptions

## Customization

- **Instructions**: Edit files in \`instructions/\` to customize agent behavior
- **Settings**: Modify \`.claude/settings.json\` for permissions
- **Commands**: Add custom commands in \`.claude/commands/\`

## Output Locations

- \`./research/\` - Research phase findings
- \`./outputs/\` - Phase outputs and workflow summaries (gitignored)
- \`./plan.md\` - Implementation plan
- \`./corrective-plan.md\` - Correction plan (if issues found)

## Documentation

- \`.claude/CLAUDE.md\` - Project context for Claude
- \`.claude/commands/orchestrate.md\` - Comprehensive orchestration guide
- \`instructions/\` - Phase-specific instruction files

## Support

For issues or questions about Complex Task Agent:
https://github.com/your-org/complex-task-agent
`;

    fs.writeFileSync(readmePath, readmeContent);
    console.log(`  ✓ ${readmePath}`);

    console.log(`
✅ Initialization complete!

📂 Created directories:
   • .claude/          (Claude Code integration)
   • instructions/     (Agent instruction files)
   • outputs/          (Phase outputs)

📄 Created files:
   • COMPLEX_TASK_AGENT.md (Usage guide)
   • .gitignore        (Updated with output exclusions)

🚀 Next steps:

   1. Review the orchestration guide:
      cat .claude/commands/orchestrate.md

   2. Customize instructions (optional):
      nano instructions/research-phase.instructions.md
      nano instructions/implementation-phase.instructions.md
      nano instructions/coding-standards.instructions.md

   3. Start orchestrating:
      complex-task orchestrate "<your task>"

      OR with Claude Code:
      cd ${path.basename(targetPath)}
      claude
      /orchestrate <your task>

📚 For detailed guidance, see:
   • .claude/commands/orchestrate.md (comprehensive guide)
   • COMPLEX_TASK_AGENT.md (quick reference)

Happy orchestrating! 🎉
`);

  } catch (error) {
    console.error(`\n❌ Error during initialization: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

async function runOrchestrator(taskDescription) {
  console.log('\n🎯 Starting Complex Task Orchestrator...\n');

  // Check if we're in an initialized project
  const claudeDir = path.join(process.cwd(), '.claude');
  const instructionsDir = path.join(process.cwd(), 'instructions');

  if (!fs.existsSync(claudeDir) || !fs.existsSync(instructionsDir)) {
    console.error('❌ Error: Complex Task Agent not initialized in this directory.');
    console.log('\nRun first: complex-task init\n');
    process.exit(1);
  }

  // Check if orchestrator.ts exists locally (after npm install)
  const localOrchestrator = path.join(process.cwd(), 'node_modules', 'complex-task-agent', 'src', 'orchestrator.ts');
  const packageOrchestrator = path.join(PACKAGE_ROOT, 'src', 'orchestrator.ts');

  let orchestratorPath;
  if (fs.existsSync(localOrchestrator)) {
    orchestratorPath = localOrchestrator;
  } else if (fs.existsSync(packageOrchestrator)) {
    orchestratorPath = packageOrchestrator;
  } else {
    console.error('❌ Error: Orchestrator not found.');
    process.exit(1);
  }

  try {
    // Run using ts-node
    const command = `npx ts-node "${orchestratorPath}" "${taskDescription}"`;
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
  } catch (error) {
    console.error(`\n❌ Error running orchestrator: ${error.message}`);
    process.exit(1);
  }
}

// Main CLI logic
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'init':
    initProject(args[1]);
    break;

  case 'orchestrate':
    if (!args[1]) {
      console.error('\n❌ Error: Task description required\n');
      console.log('Usage: complex-task orchestrate "<task description>"\n');
      process.exit(1);
    }
    runOrchestrator(args.slice(1).join(' '));
    break;

  case 'version':
  case '-v':
  case '--version':
    showVersion();
    break;

  case 'help':
  case '-h':
  case '--help':
  case undefined:
    showHelp();
    break;

  default:
    console.error(`\n❌ Unknown command: ${command}\n`);
    showHelp();
    process.exit(1);
}
