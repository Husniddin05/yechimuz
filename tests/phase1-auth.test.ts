import { AuthService } from "../src/services/auth.service";
import { hasRole, hasAnyRole, verifyToken, ROLES } from "../src/lib/auth";
import { prisma } from "../src/lib/prisma";

async function runPhase1Tests() {
  console.log("🧪 Running Phase 1 Authentication & Role System Verification Tests...\n");

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
    // Test 1: Clean test account if exists
    const testEmail = "test_user_phase1@yechim.uz";
    await prisma.user.deleteMany({
      where: { email: testEmail },
    });

    // Test 2: Register User with Multi-Roles (SOLVER + PROBLEM_OWNER)
    console.log("1. Testing Multi-Role User Registration...");
    const regResult = await AuthService.register({
      firstName: "Doston",
      lastName: "Bek",
      username: "doston_solver_owner",
      email: testEmail,
      password: "SecurePassword123!",
      roles: ["SOLVER", "PROBLEM_OWNER"],
      region: "Farg'ona",
      organizationName: "Farg'ona IT Center",
    });

    assert(regResult.user.email === testEmail, "User email matches registration input");
    assert(regResult.user.roles.includes("SOLVER"), "User assigned SOLVER role");
    assert(regResult.user.roles.includes("PROBLEM_OWNER"), "User assigned PROBLEM_OWNER role");
    assert(!!regResult.token, "JWT token issued upon registration");

    // Test 3: Token Verification
    console.log("\n2. Testing JWT Token Decoding...");
    const decoded = verifyToken(regResult.token);
    assert(decoded !== null, "JWT token verified successfully");
    assert(decoded?.email === testEmail, "Decoded token contains correct email");
    assert(decoded?.roles.includes("SOLVER") === true, "Decoded token contains assigned roles");

    // Test 4: RBAC Role Hierarchy Checks
    console.log("\n3. Testing Role-Based Access Control (RBAC) Functions...");
    assert(hasRole(regResult.user.roles, ROLES.SOLVER), "hasRole returns true for SOLVER");
    assert(hasRole(regResult.user.roles, ROLES.PROBLEM_OWNER), "hasRole returns true for PROBLEM_OWNER");
    assert(!hasRole(regResult.user.roles, ROLES.ADMIN), "hasRole returns false for unassigned ADMIN role");
    assert(hasAnyRole(regResult.user.roles, [ROLES.EXPERT, ROLES.SOLVER]), "hasAnyRole returns true when match found");
    assert(hasRole([ROLES.SUPER_ADMIN], ROLES.ADMIN), "SUPER_ADMIN bypasses role restrictions");

    // Test 5: Login Verification
    console.log("\n4. Testing User Login...");
    const loginResult = await AuthService.login({
      emailOrUsername: testEmail,
      password: "SecurePassword123!",
    });
    assert(loginResult.user.email === testEmail, "Login successful with correct password");
    assert(!!loginResult.token, "Login issues valid JWT token");

    // Test 6: Profile Fetch & Update
    console.log("\n5. Testing Profile Fetch and Update...");
    const profileBefore = await AuthService.getUserProfile(regResult.user.id);
    assert(profileBefore.profile.firstName === "Doston", "Profile fetched correctly");

    const updatedProfile = await AuthService.updateProfile(regResult.user.id, {
      bio: "Farg'ona agrotexnika bo'yicha mutaxassis va dasturchi",
      skills: ["Python", "IoT", "Django", "React"],
      occupation: "Lead Developer",
    });

    assert(Boolean(updatedProfile.bio && updatedProfile.bio.includes("agrotexnika")), "Bio updated successfully");
    assert(updatedProfile.skills.includes("Python"), "Skills array stored and parsed correctly");

    console.log(`\n🎉 Phase 1 Test Results: ${testPassed}/${testTotal} Tests Passed Successfully!`);

    // Clean up test user
    await prisma.user.delete({ where: { id: regResult.user.id } });
  } catch (err) {
    console.error("❌ Test execution error:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase1Tests();
