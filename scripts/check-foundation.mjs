import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const requiredPaths = [
  "AGENTS.md",
  "README.md",
  ".gitignore",
  ".mcp.json",
  "skills-lock.json",
  ".env.example",
  "package.json",
  "pnpm-workspace.yaml",
  "turbo.json",
  ".github/workflows/ci.yml",
  "docs/architecture.md",
  "docs/api-contract.md",
  "docs/data-model.md",
  "docs/provider-ingestion.md",
  "docs/localization.md",
  "docs/mobile-release.md",
  "docs/quality-gates.md",
  "docs/agent-skills.md",
  "apps/web/README.md",
  "apps/ios/README.md",
  "apps/android/README.md",
  "apps/staff/README.md",
  "packages/shared-types/README.md",
  "packages/api-client/README.md",
  "packages/validation/README.md",
  "packages/design-tokens/README.md",
  "packages/config/README.md",
  "supabase/functions/README.md",
  "supabase/migrations/README.md",
  ".agents/skills/supabase/SKILL.md",
  ".agents/skills/supabase-postgres-best-practices/SKILL.md"
];

const missing = requiredPaths.filter((path) => !existsSync(join(root, path)));

if (missing.length > 0) {
  console.error("Missing required foundation paths:");
  for (const path of missing) console.error(`- ${path}`);
  process.exit(1);
}

const gitignore = readFileSync(join(root, ".gitignore"), "utf8");
const requiredIgnorePatterns = [".env.*", "!.env.example", "*.mobileprovision", "*.jks", "*.keystore"];
const missingIgnorePatterns = requiredIgnorePatterns.filter((pattern) => !gitignore.includes(pattern));

if (missingIgnorePatterns.length > 0) {
  console.error("Missing required .gitignore patterns:");
  for (const pattern of missingIgnorePatterns) console.error(`- ${pattern}`);
  process.exit(1);
}

const agents = readFileSync(join(root, "AGENTS.md"), "utf8");
const requiredAgentText = [
  "The API contract is the source of truth",
  "Never touch staging from this repo",
  "Bulgarian is the primary language",
  "Edge-first, not Edge-only",
  "Do not silently skip a platform",
  "docs/agent-skills.md"
];
const missingAgentText = requiredAgentText.filter((text) => !agents.includes(text));

if (missingAgentText.length > 0) {
  console.error("AGENTS.md is missing required rules:");
  for (const text of missingAgentText) console.error(`- ${text}`);
  process.exit(1);
}

const mcp = readFileSync(join(root, ".mcp.json"), "utf8");
const requiredMcpText = ["https://mcp.supabase.com/mcp?project_ref=pizflsflslzauyryihhq"];
const missingMcpText = requiredMcpText.filter((text) => !mcp.includes(text));

if (missingMcpText.length > 0) {
  console.error(".mcp.json is missing required Machovete MCP configuration:");
  for (const text of missingMcpText) console.error(`- ${text}`);
  process.exit(1);
}

const skillsLock = readFileSync(join(root, "skills-lock.json"), "utf8");
const requiredSkillsText = ["supabase/agent-skills", "supabase-postgres-best-practices"];
const missingSkillsText = requiredSkillsText.filter((text) => !skillsLock.includes(text));

if (missingSkillsText.length > 0) {
  console.error("skills-lock.json is missing required repo-local skills:");
  for (const text of missingSkillsText) console.error(`- ${text}`);
  process.exit(1);
}

console.log("Foundation check passed.");
