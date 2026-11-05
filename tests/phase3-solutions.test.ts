import { SolutionService } from "../src/services/solution.service";
import { ProblemService } from "../src/services/problem.service";
import { AuthService } from "../src/services/auth.service";
import { prisma } from "../src/lib/prisma";

async function runPhase3Tests() {
  console.log("🧪 Running Phase 3 Solutions & Expert Scoring System Verification Tests...\n");

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

  try {
    // 1. Setup Test Users (Solver & Expert)
    console.log("1. Setting up Test Users (Solver & Expert)...");
    const solverEmail = "test_solver_phase3@yechim.uz";
    const expertEmail = "test_expert_phase3@yechim.uz";

    await prisma.user.deleteMany({
      where: { email: { in: [solverEmail, expertEmail] } },
    });

    const solver = await AuthService.register({
      firstName: "Bekzod",
      lastName: "Developer",
      username: "bekzod_solver_p3",
      email: solverEmail,
      password: "Password123!",
      roles: ["SOLVER"],
      region: "Farg'ona",
    });

    const expert = await AuthService.register({
      firstName: "Prof. Farhod",
      lastName: "Ekspert",
      username: "farhod_expert_p3",
      email: expertEmail,
      password: "Password123!",
      roles: ["EXPERT"],
      region: "Farg'ona",
    });

    assert(solver.user.roles.includes("SOLVER"), "Solver registered successfully");
    assert(expert.user.roles.includes("EXPERT"), "Expert registered successfully");

    // 2. Fetch seeded Fergana Challenge or create one if needed
    console.log("\n2. Fetching Seeded Problem & Challenge...");
    let problems = await ProblemService.getProblems({ region: "Farg'ona" });
    let problemWithChallenge = problems.data.find((p) => p.challenge !== null);

    if (!problemWithChallenge && problems.data.length > 0) {
      // Ensure challenge exists for test
      const p = problems.data[0];
      const newChal = await prisma.challenge.create({
        data: {
          problemId: p.id,
          structuredTitle: "Suv Tejamkorligi Challenge",
          formattedObjective: "IoT avtomatlashtirish",
          isOwnerApproved: true,
        },
      });
      problems = await ProblemService.getProblems({ region: "Farg'ona" });
      problemWithChallenge = problems.data.find((p) => p.challenge !== null);
    }

    assert(!!problemWithChallenge, "Seeded Fergana problem retrieved");
    assert(!!problemWithChallenge?.challenge, "Problem has active Challenge structure");

    const challengeId = problemWithChallenge!.challenge!.id;
    const problemOwnerId = problemWithChallenge!.ownerId;

    // 3. Submit Solution Proposal
    console.log("\n3. Testing Solution Submission...");
    const solution = await SolutionService.submitSolution(solver.user.id, {
      challengeId,
      title: "LoRaWAN datchiklar va avtomatik klapanlar tizimi",
      description: "Issiqxonada har 10 metr kvadratga namlik va harorat datchiklarini o'rnatish orqali sug'orishni 35% tejamkor qilish.",
      technicalApproach: "Arduino ESP32 microcontrollers, LoRaWAN gateway, Python Django backend, PostgreSQL, Flutter App.",
      estimatedCost: 18000000,
      estimatedDays: 35,
      githubUrl: "https://github.com/bekzod/smart-greenhouse-iot",
    });

    assert(solution.title.includes("LoRaWAN datchiklar"), "Solution created with correct title");
    assert(solution.estimatedCost === 18000000, "Estimated cost matches input");
    assert(solution.status === "SUBMITTED", "Initial status set to SUBMITTED");

    // 4. Expert 9-Criterion Review Submission
    console.log("\n4. Testing Expert 9-Criterion Review Submission & Automated Score Calculation...");
    const review = await SolutionService.submitExpertReview(expert.user.id, {
      solutionId: solution.id,
      innovationScore: 9,
      feasibilityScore: 9,
      costEfficiencyScore: 8,
      impactScore: 10,
      scalabilityScore: 9,
      technicalQualityScore: 9,
      implementationTimeScore: 8,
      securityScore: 9,
      socialImpactScore: 9,
      comments: "Juda mukammal va Farg'ona issiqxonalari uchun mos amaliy yechim.",
    });

    // Sum = 9+9+8+10+9+9+8+9+9 = 80 -> 80 / 9 = 8.89
    assert(review.totalScore === 8.89, "Calculated 9-criterion average score matches 8.89");

    const updatedSolution = await SolutionService.getSolutionById(solution.id);
    assert(updatedSolution.scoreAvg === 8.89, "Solution scoreAvg updated in database to 8.89");
    assert(updatedSolution.status === "UNDER_REVIEW", "Solution status updated to UNDER_REVIEW");

    // 5. Shortlisting Solution
    console.log("\n5. Testing Solution Shortlisting...");
    const shortlist = await SolutionService.shortlistSolution(problemOwnerId, {
      challengeId,
      solutionId: solution.id,
      rankPosition: 1,
      shortlistReason: "Eng yuqori ekspert balli va maqbul narx.",
    });

    assert(shortlist.rankPosition === 1, "Shortlisted at rank 1");
    const shortlistedSolution = await SolutionService.getSolutionById(solution.id);
    assert(shortlistedSolution.status === "SHORTLISTED", "Solution status updated to SHORTLISTED");

    console.log(`\n🎉 Phase 3 Test Results: ${testPassed}/${testTotal} Tests Passed Successfully!`);

    // Cleanup test data
    await prisma.shortlist.delete({ where: { id: shortlist.id } });
    await prisma.expertReview.delete({ where: { id: review.id } });
    await prisma.solution.delete({ where: { id: solution.id } });
    await prisma.user.deleteMany({ where: { email: { in: [solverEmail, expertEmail] } } });
  } catch (err) {
    console.error("❌ Test execution error:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase3Tests();
