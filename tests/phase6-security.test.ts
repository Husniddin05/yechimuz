import { ProblemService } from "../src/services/problem.service";
import { SolutionService } from "../src/services/solution.service";
import { AuthService } from "../src/services/auth.service";
import { prisma } from "../src/lib/prisma";

async function runPhase6SecurityTests() {
  console.log("🔒 Running Phase 6 Security Authorization Verification Tests...\n");

  let testPassed = 0;
  let testTotal = 0;

  function assert(condition: boolean, testName: string) {
    testTotal++;
    if (condition) {
      testPassed++;
      console.log(`  ✅ [PASS] ${testName}`);
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
    }
  }

  const emailOwner = "p6_owner@yechim.uz";
  const emailOther = "p6_other@yechim.uz";
  const emailAdmin = "p6_admin@yechim.uz";
  const emailExpert = "p6_expert@yechim.uz";
  const emailSolver = "p6_solver@yechim.uz";
  const allEmails = [emailOwner, emailOther, emailAdmin, emailExpert, emailSolver];

  async function cleanup() {
    const users = await prisma.user.findMany({
      where: { email: { in: allEmails } },
      select: { id: true },
    });
    const userIds = users.map((u) => u.id);

    if (userIds.length > 0) {
      // Find problems owned by these users
      const problems = await prisma.problem.findMany({
        where: { ownerId: { in: userIds } },
        select: { id: true },
      });
      const problemIds = problems.map((p) => p.id);

      // Find challenges
      const challenges = await prisma.challenge.findMany({
        where: { problemId: { in: problemIds } },
        select: { id: true },
      });
      const challengeIds = challenges.map((c) => c.id);

      await prisma.shortlist.deleteMany({
        where: { OR: [{ challengeId: { in: challengeIds } }, { selectedByUserId: { in: userIds } }] },
      });
      await prisma.expertReview.deleteMany({
        where: { expertId: { in: userIds } },
      });
      await prisma.solution.deleteMany({
        where: { OR: [{ challengeId: { in: challengeIds } }, { solverId: { in: userIds } }] },
      });
      await prisma.challenge.deleteMany({
        where: { id: { in: challengeIds } },
      });
      await prisma.auditLog.deleteMany({
        where: { OR: [{ userId: { in: userIds } }, { entityId: { in: problemIds } }] },
      });
      await prisma.notification.deleteMany({
        where: { userId: { in: userIds } },
      });
      await prisma.problem.deleteMany({
        where: { id: { in: problemIds } },
      });
      await prisma.userRole.deleteMany({
        where: { userId: { in: userIds } },
      });
      await prisma.profile.deleteMany({
        where: { userId: { in: userIds } },
      });
      await prisma.user.deleteMany({
        where: { id: { in: userIds } },
      });
    }
  }

  try {
    // 0. Cleanup previous test users if any
    await cleanup();

    // 1. Setup Test Users
    console.log("1. Setting up Test Users with specific roles...");

    const ownerRes = await AuthService.register({
      firstName: "Owner",
      lastName: "Test",
      username: "p6_owner",
      email: emailOwner,
      password: "Password123!",
      roles: ["PROBLEM_OWNER"],
      region: "Toshkent",
    });

    const otherRes = await AuthService.register({
      firstName: "Other",
      lastName: "User",
      username: "p6_other",
      email: emailOther,
      password: "Password123!",
      roles: ["USER"],
      region: "Samarqand",
    });

    const adminRes = await AuthService.register({
      firstName: "Admin",
      lastName: "Security",
      username: "p6_admin",
      email: emailAdmin,
      password: "Password123!",
      roles: ["ADMIN"],
      region: "Toshkent",
    });

    const expertRes = await AuthService.register({
      firstName: "Expert",
      lastName: "Reviewer",
      username: "p6_expert",
      email: emailExpert,
      password: "Password123!",
      roles: ["EXPERT"],
      region: "Farg'ona",
    });

    const solverRes = await AuthService.register({
      firstName: "Solver",
      lastName: "Coder",
      username: "p6_solver",
      email: emailSolver,
      password: "Password123!",
      roles: ["SOLVER"],
      region: "Buxoro",
    });

    const categories = await ProblemService.getCategories();
    const catId = categories[0].id;

    // 2. Create Problem and Challenge owned by ownerRes
    console.log("\n2. Creating problem and challenge for testing...");
    const problem = await ProblemService.createProblem(ownerRes.user.id, {
      title: "Security Test Problem - Water Conservation",
      rawDescription: "Testing authorization barriers for status changes and shortlisting.",
      categoryId: catId,
      region: "Toshkent",
      problemType: "WATER",
      severityLevel: "MEDIUM",
      currency: "UZS",
      budget: 10000000,
    });

    const challenge = await prisma.challenge.create({
      data: {
        problemId: problem.id,
        structuredTitle: "Security Test Challenge",
        formattedObjective: "Challenge for testing security restrictions.",
        isOwnerApproved: true,
      },
    });

    // Submit a solution from solver
    const solution1 = await SolutionService.submitSolution(solverRes.user.id, {
      challengeId: challenge.id,
      title: "LoRa Solution 1",
      description: "Test description for solution 1.",
      technicalApproach: "ESP32 + MQTT",
      estimatedCost: 8000000,
      estimatedDays: 20,
    });

    const solution2 = await SolutionService.submitSolution(solverRes.user.id, {
      challengeId: challenge.id,
      title: "LoRa Solution 2",
      description: "Test description for solution 2.",
      technicalApproach: "Raspberry Pi + WebSockets",
      estimatedCost: 9000000,
      estimatedDays: 25,
    });

    // 3. Test Problem Status Update Security
    console.log("\n3. Testing Problem Status Update Authorization...");

    // 3a. Problem Owner CAN update status
    let ownerUpdated = false;
    try {
      const res = await ProblemService.updateProblemStatus(
        problem.id,
        "ANALYZING",
        ownerRes.user.id
      );
      if (res && res.status === "ANALYZING") {
        ownerUpdated = true;
      }
    } catch (e: any) {
      console.error("Owner update failed unexpectedly:", e.message);
    }
    assert(ownerUpdated, "Problem Owner CAN update problem status");

    // 3b. Non-owner (regular USER) CANNOT update status
    let unauthorizedBlocked = false;
    try {
      await ProblemService.updateProblemStatus(
        problem.id,
        "CHALLENGE_READY",
        otherRes.user.id
      );
    } catch (e: any) {
      if (e.message.includes("vakolati mavjud emas")) {
        unauthorizedBlocked = true;
      }
    }
    assert(unauthorizedBlocked, "Unauthorized User CANNOT update problem status (Blocked with 403 error)");

    // 3c. Admin CAN update status even if not owner
    let adminUpdated = false;
    try {
      const res = await ProblemService.updateProblemStatus(
        problem.id,
        "CHALLENGE_READY",
        adminRes.user.id
      );
      if (res && res.status === "CHALLENGE_READY") {
        adminUpdated = true;
      }
    } catch (e: any) {
      console.error("Admin update failed unexpectedly:", e.message);
    }
    assert(adminUpdated, "System Admin CAN update problem status even without owning it");

    // 4. Test Solution Shortlist Security
    console.log("\n4. Testing Solution Shortlist Authorization...");

    // 4a. Problem Owner CAN shortlist solution
    let ownerShortlisted = false;
    try {
      const res = await SolutionService.shortlistSolution(ownerRes.user.id, {
        challengeId: challenge.id,
        solutionId: solution1.id,
        rankPosition: 1,
        shortlistReason: "Owner approved solution 1",
      });
      if (res && res.solutionId === solution1.id) {
        ownerShortlisted = true;
      }
    } catch (e: any) {
      console.error("Owner shortlist failed unexpectedly:", e.message);
    }
    assert(ownerShortlisted, "Problem Owner CAN shortlist solution");

    // 4b. Non-owner (regular USER) CANNOT shortlist solution
    let unauthorizedShortlistBlocked = false;
    try {
      await SolutionService.shortlistSolution(otherRes.user.id, {
        challengeId: challenge.id,
        solutionId: solution2.id,
        rankPosition: 2,
        shortlistReason: "Hacker trying to shortlist",
      });
    } catch (e: any) {
      if (e.message.includes("vakolati mavjud emas")) {
        unauthorizedShortlistBlocked = true;
      }
    }
    assert(unauthorizedShortlistBlocked, "Unauthorized User CANNOT shortlist solution (Blocked with error)");

    // 4c. Expert CAN shortlist solution
    let expertShortlisted = false;
    try {
      const res = await SolutionService.shortlistSolution(expertRes.user.id, {
        challengeId: challenge.id,
        solutionId: solution2.id,
        rankPosition: 2,
        shortlistReason: "Expert validated and shortlisted solution 2",
      });
      if (res && res.solutionId === solution2.id) {
        expertShortlisted = true;
      }
    } catch (e: any) {
      console.error("Expert shortlist failed unexpectedly:", e.message);
    }
    assert(expertShortlisted, "Expert CAN shortlist solution based on review privileges");

    // 5. Cleanup test artifacts
    console.log("\n5. Cleaning up test artifacts...");
    await cleanup();

    console.log(`\n========================================`);
    console.log(`🛡️  Phase 6 Security Verification Results: ${testPassed}/${testTotal} PASSED`);
    console.log(`========================================\n`);

    if (testPassed !== testTotal) {
      process.exit(1);
    }
  } catch (error) {
    console.error("Critical error during Phase 6 Security verification:", error);
    process.exit(1);
  }
}

runPhase6SecurityTests();
