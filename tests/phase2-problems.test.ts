import { ProblemService } from "../src/services/problem.service";
import { AuthService } from "../src/services/auth.service";
import { prisma } from "../src/lib/prisma";

async function runPhase2Tests() {
  console.log("🧪 Running Phase 2 Problems & Challenges System Verification Tests...\n");

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
    // 1. Fetch categories
    console.log("1. Testing Categories Fetch...");
    const categories = await ProblemService.getCategories();
    assert(categories.length >= 6, "All seeded problem categories retrieved");
    const agCategory = categories.find((c) => c.slug === "agriculture-water") || categories[0];

    // 2. Create test user
    console.log("\n2. Testing Problem Creation...");
    const testEmail = "test_owner_phase2@yechim.uz";
    await prisma.user.deleteMany({ where: { email: testEmail } });

    const owner = await AuthService.register({
      firstName: "Rustam",
      lastName: "Agro",
      username: "rustam_phase2",
      email: testEmail,
      password: "Password123!",
      roles: ["PROBLEM_OWNER"],
      region: "Farg'ona",
    });

    const newProblem = await ProblemService.createProblem(owner.user.id, {
      title: "Farg'ona tumanida sug'orish kanali suv isrofi muammosi",
      rawDescription: "Sug'orish arig'ida suv bug'lanishi va sarg'ayishi tufayli 40% suv fermerlarga yetib bormayapti. Betonzashtirish va aqlli taqsimlash kerak.",
      categoryId: agCategory.id,
      region: "Farg'ona",
      problemType: "WATER",
      severityLevel: "HIGH",
      budget: 35000000,
      currency: "UZS",
      targetResult: "Suv isrofini 10% ga tushirish",
    });

    assert(newProblem.title.includes("sug'orish kanali"), "Problem created with correct title");
    assert(newProblem.budget === 35000000, "Problem budget matches input");
    assert(newProblem.status === "PUBLISHED", "New problem set to PUBLISHED status by default");

    // 3. Get problem by ID
    console.log("\n3. Testing Get Problem By ID...");
    const fetched = await ProblemService.getProblemById(newProblem.id);
    assert(fetched.id === newProblem.id, "Fetched problem ID matches");
    assert(fetched.owner.email === testEmail, "Problem includes owner profile");

    // 4. Filtering and Search
    console.log("\n4. Testing Problem Search and Multi-Criteria Filtering...");
    const filteredByRegion = await ProblemService.getProblems({ region: "Farg'ona" });
    assert(filteredByRegion.data.length >= 1, "Filter by region (Farg'ona) returned results");

    const searchByQuery = await ProblemService.getProblems({ query: "bug'lanishi" });
    assert(searchByQuery.data.length >= 1, "Text search query matched description");

    const searchByCategory = await ProblemService.getProblems({ categoryId: agCategory.id });
    assert(searchByCategory.data.length >= 1, "Filter by Category returned matching problems");

    // 5. Update Problem Status
    console.log("\n5. Testing Problem Status Workflow Updates...");
    const updatedStatus = await ProblemService.updateProblemStatus(newProblem.id, "CHALLENGE_READY", owner.user.id);
    assert(updatedStatus.status === "CHALLENGE_READY", "Problem status updated to CHALLENGE_READY");

    console.log(`\n🎉 Phase 2 Test Results: ${testPassed}/${testTotal} Tests Passed Successfully!`);

    // Cleanup test data
    await prisma.problem.delete({ where: { id: newProblem.id } });
    await prisma.user.delete({ where: { id: owner.user.id } });
  } catch (err) {
    console.error("❌ Test execution error:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase2Tests();
