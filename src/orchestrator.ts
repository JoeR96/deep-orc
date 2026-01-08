import fs from "fs";
import path from "path";

interface AgentConfig {
  description: string;
  tools: string[];
  model?: string;
}

interface PhaseOutput {
  phase: string;
  timestamp: string;
  result: string;
  error?: string;
}

interface WorkflowResults {
  [phase: string]: string;
}

export class MultiPhaseOrchestrator {
  private instructionsDir: string;
  private outputDir: string;
  private phaseResults: Record<string, string> = {};

  constructor(instructionsDir: string, outputDir: string) {
    this.instructionsDir = instructionsDir;
    this.outputDir = outputDir;

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  }

  private loadInstructionFile(filename: string): string {
    const filepath = path.join(this.instructionsDir, filename);
    if (!fs.existsSync(filepath)) {
      console.warn(`Instruction file not found: ${filepath}, using default instructions`);
      return `Execute the ${filename.replace('-phase.instructions.md', '')} phase of the workflow.`;
    }
    return fs.readFileSync(filepath, "utf-8");
  }

  private getAgentConfig(phase: string): AgentConfig {
    const configs: Record<string, AgentConfig> = {
      research: {
        description: "Research specialist for thorough analysis and requirement gathering",
        tools: ["Read", "Grep", "Glob", "WebSearch", "WebFetch", "Task"],
        model: "opus"
      },
      plan: {
        description: "Planning expert for creating detailed implementation plans",
        tools: ["Read", "Write", "Grep", "Glob", "Task"],
        model: "opus"
      },
      implement: {
        description: "Expert developer for implementing code following specifications",
        tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob", "TodoWrite"],
        model: "sonnet"
      },
      correct: {
        description: "Quality assurance expert for reviewing and correcting implementations",
        tools: ["Read", "Edit", "Bash", "Grep", "Glob", "TodoWrite"],
        model: "opus"
      }
    };

    return configs[phase] || {
      description: `${phase.charAt(0).toUpperCase() + phase.slice(1)} phase specialist`,
      tools: ["Read", "Write", "Grep", "Glob"],
      model: "sonnet"
    };
  }

  private savePhaseOutput(phaseOutput: PhaseOutput): string {
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    const filename = `${phaseOutput.phase}_${timestamp}.json`;
    const filepath = path.join(this.outputDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(phaseOutput, null, 2));
    return filepath;
  }

  async runPhase(
    phaseName: string,
    taskDescription: string,
    previousResults?: Record<string, string>
  ): Promise<string> {
    console.log(`\n${"=".repeat(70)}`);
    console.log(`Starting ${phaseName.toUpperCase()} Phase`);
    console.log(`${"=".repeat(70)}\n`);

    const phaseInstructions = this.loadInstructionFile(
      `${phaseName}-phase.instructions.md`
    );

    const agentConfig = this.getAgentConfig(phaseName);

    let fullPrompt = taskDescription;
    if (previousResults && Object.keys(previousResults).length > 0) {
      fullPrompt += "\n\n## Context from Previous Phases:\n";
      for (const [prevPhase, result] of Object.entries(previousResults)) {
        const preview = result.length > 1000 ? result.substring(0, 1000) + "..." : result;
        fullPrompt += `\n### ${prevPhase.toUpperCase()} Phase:\n${preview}\n`;
      }
    }

    fullPrompt += `\n\n## Phase Instructions:\n${phaseInstructions}`;

    const phaseOutput: PhaseOutput = {
      phase: phaseName,
      timestamp: new Date().toISOString(),
      result: ""
    };

    // Simulate agent execution
    // In real implementation, this would use Claude Agent SDK's query() function
    console.log(`Executing ${phaseName} phase with:`);
    console.log(`- Model: ${agentConfig.model}`);
    console.log(`- Tools: ${agentConfig.tools.join(", ")}`);
    console.log(`\nPrompt preview (first 200 chars):`);
    console.log(fullPrompt.substring(0, 200) + "...\n");

    // Placeholder for actual agent execution
    phaseOutput.result = `[${phaseName.toUpperCase()} PHASE COMPLETE]\n\nThis is where the agent's response would be captured.\n\nIn a real implementation, this would use the Claude Agent SDK to:\n1. Spawn a sub-agent with the specified model and tools\n2. Pass the full prompt with instructions\n3. Capture the agent's response\n4. Return the results`;

    const outputFile = this.savePhaseOutput(phaseOutput);
    console.log(`Phase output saved to: ${outputFile}`);

    this.phaseResults[phaseName] = phaseOutput.result;
    return phaseOutput.result;
  }

  async orchestrate(task: string): Promise<WorkflowResults> {
    console.log(`\n${"=".repeat(70)}`);
    console.log(`Multi-Phase Orchestrator Started`);
    console.log(`${"=".repeat(70)}`);
    console.log(`Task: ${task}`);
    console.log(`Output Directory: ${this.outputDir}`);
    console.log(`${"=".repeat(70)}\n`);

    const results: WorkflowResults = {};
    let previousResults: Record<string, string> = {};

    // Phase 1: Research
    console.log("\n📚 Phase 1: Research");
    const researchResult = await this.runPhase(
      "research",
      `Task: ${task}\n\nConduct thorough research for this task. Verify assumptions, explore multiple approaches, and document findings.`
    );
    results["research"] = researchResult;
    previousResults["research"] = researchResult;

    // Phase 2: Planning
    console.log("\n📋 Phase 2: Planning");
    const planningResult = await this.runPhase(
      "plan",
      `Task: ${task}\n\nBased on the research above, create a detailed implementation plan.`,
      previousResults
    );
    results["plan"] = planningResult;
    previousResults["plan"] = planningResult;

    // Phase 3: Implementation
    console.log("\n⚙️  Phase 3: Implementation");
    const implementationResult = await this.runPhase(
      "implement",
      `Task: ${task}\n\nImplement the solution following the plan above.`,
      previousResults
    );
    results["implement"] = implementationResult;
    previousResults["implement"] = implementationResult;

    // Phase 4: Correction/Review
    console.log("\n✅ Phase 4: Review & Correction");
    const correctionResult = await this.runPhase(
      "correct",
      `Task: ${task}\n\nReview the implementation and create a corrective plan if issues are found.`,
      previousResults
    );
    results["correct"] = correctionResult;

    // Save final summary
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    const summaryFile = path.join(this.outputDir, `workflow_summary_${timestamp}.json`);
    fs.writeFileSync(summaryFile, JSON.stringify(results, null, 2));

    console.log(`\n${"=".repeat(70)}`);
    console.log(`✨ Workflow Complete!`);
    console.log(`Summary saved to: ${summaryFile}`);
    console.log(`${"=".repeat(70)}\n`);

    return results;
  }
}

// CLI entry point
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage: ts-node orchestrator.ts \"<task description>\"");
    console.log("\nExample:");
    console.log('  ts-node orchestrator.ts "Create a REST API with authentication"');
    process.exit(1);
  }

  const task = args.join(" ");
  const instructionsDir = path.join(__dirname, "..", "instructions");
  const outputDir = path.join(__dirname, "..", "outputs");

  const orchestrator = new MultiPhaseOrchestrator(instructionsDir, outputDir);
  await orchestrator.orchestrate(task);
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
}
