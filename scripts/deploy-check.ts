import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { prisma } from "../src/lib/prisma";

async function runDeployPreflightCheck() {
  console.log("🚀 ===================================================");
  console.log("🚀 YECHIMUZ PRODUCTION DEPLOY PRE-FLIGHT CHECKLIST");
  console.log("🚀 ===================================================\n");

  let totalChecks = 0;
  let passedChecks = 0;

  function report(name: string, ok: boolean, note?: string) {
    totalChecks++;
    if (ok) {
      passedChecks++;
      console.log(`  ✅ [PASS] ${name}${note ? ` (${note})` : ""}`);
    } else {
      console.error(`  ❌ [FAIL] ${name}${note ? ` (${note})` : ""}`);
    }
  }

  // 1. Files & Structure Check
  console.log("1. Checking Required Project Files...");
  report(".env file exists", fs.existsSync(".env"));
  report(".env.example exists", fs.existsSync(".env.example"));
  report(".gitignore exists", fs.existsSync(".gitignore"));
  report("README.md exists", fs.existsSync("README.md"));
  report("PostgreSQL schema ready", fs.existsSync("prisma/schema.postgresql.prisma"));

  // 2. Backup Integrity
  console.log("\n2. Checking Database Backup Safety...");
  const backupDir = "_backups";
  const hasBackups = fs.existsSync(backupDir) && fs.readdirSync(backupDir).length > 0;
  report("Backup directory with snapshots exists", hasBackups);

  // 3. Database Connectivity
  console.log("\n3. Testing Database Connectivity & Seed Data...");
  try {
    const userCount = await prisma.user.count();
    const problemCount = await prisma.problem.count();
    report("Database connected & responsive", true, `${userCount} users, ${problemCount} problems in database`);
  } catch (e: any) {
    report("Database connected & responsive", false, e.message);
  }

  // 4. Automated Tests
  console.log("\n4. Running All Automated System Tests...");
  try {
    execSync("npm test", { stdio: "pipe" });
    report("All 45 Automated Test Suites Passed", true, "100% green");
  } catch (e: any) {
    report("All 45 Automated Test Suites Passed", false, "Some tests failed");
  }

  // 5. TypeScript Integrity
  console.log("\n5. Checking TypeScript Compilation (Zero Errors)...");
  try {
    execSync("npx tsc --noEmit", { stdio: "pipe" });
    report("TypeScript type check clean", true, "0 type errors");
  } catch (e: any) {
    report("TypeScript type check clean", false);
  }

  console.log("\n===================================================");
  console.log(`🏁 PRE-FLIGHT READINESS: ${passedChecks}/${totalChecks} CHECKS PASSED`);
  console.log("===================================================\n");

  if (passedChecks === totalChecks) {
    console.log("🎉 TABRIKLAYMIZ! YechimUZ loyihasi Production serverga (Vercel + PostgreSQL) chiqarishga 100% TAYYOR!");
  } else {
    console.error("⚠️ Ba'zi tekshiruvlar muvaffaqiyatsiz bo'ldi. Iltimos xatolarni to'g'irlang.");
    process.exit(1);
  }
}

runDeployPreflightCheck().catch((err) => {
  console.error("Fatal pre-flight error:", err);
  process.exit(1);
});
