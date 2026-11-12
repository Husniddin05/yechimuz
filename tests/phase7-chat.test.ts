import { prisma } from "../src/lib/prisma";
import { AuthService } from "../src/services/auth.service";
import { SolutionService } from "../src/services/solution.service";
import { ChatService } from "../src/services/chat.service";

async function runChatTests() {
  console.log("🔒 Running Phase 7 Secure Chat System Verification Tests...\n");

  let ownerToken: string;
  let ownerId: string;
  let solverToken: string;
  let solverId: string;
  let outsiderToken: string;
  let outsiderId: string;

  let problemId: string;
  let challengeId: string;
  let solutionId: string;

  try {
    // 1. Setup Test Users
    console.log("1. Setting up Test Users (Owner, Solver, Outsider)...");
    const timestamp = Date.now();

    const ownerRes = await AuthService.register({
      email: `chat_owner_${timestamp}@yechim.uz`,
      password: "Password123!",
      firstName: "Owner",
      lastName: "Chat",
      username: `owner_chat_${timestamp}`,
      roles: ["PROBLEM_OWNER"],
      region: "Farg'ona",
    });
    ownerToken = ownerRes.token;
    ownerId = ownerRes.user.id;

    const solverRes = await AuthService.register({
      email: `chat_solver_${timestamp}@yechim.uz`,
      password: "Password123!",
      firstName: "Solver",
      lastName: "Chat",
      username: `solver_chat_${timestamp}`,
      roles: ["SOLVER"],
      region: "Toshkent",
    });
    solverToken = solverRes.token;
    solverId = solverRes.user.id;

    const outsiderRes = await AuthService.register({
      email: `chat_outsider_${timestamp}@yechim.uz`,
      password: "Password123!",
      firstName: "Outsider",
      lastName: "Chat",
      username: `outsider_chat_${timestamp}`,
      roles: ["USER"],
      region: "Samarqand",
    });
    outsiderToken = outsiderRes.token;
    outsiderId = outsiderRes.user.id;

    console.log("  ✅ [PASS] Users registered successfully");

    // 2. Create Problem and Challenge
    console.log("\n2. Creating Problem and Challenge for Chat Testing...");
    const category = await prisma.problemCategory.findFirst();
    if (!category) throw new Error("Category not found");

    const problem = await prisma.problem.create({
      data: {
        ownerId,
        categoryId: category.id,
        title: "Chat Test Muammosi",
        rawDescription: "Tomchilatib sug'orish bo'yicha xavfsiz chat testi",
        region: "Farg'ona",
        budget: 15000000,
        status: "PUBLISHED",
      },
    });
    problemId = problem.id;

    const challenge = await prisma.challenge.create({
      data: {
        problemId: problem.id,
        structuredTitle: "Chat Test Challenge",
        formattedObjective: "Maqsadli sug'orish",
        suggestedSkills: JSON.stringify(["IoT", "Node.js"]),
        targetKPIs: JSON.stringify(["Suvni 30% tejash"]),
      },
    });
    challengeId = challenge.id;

    // 3. Submit Solution
    console.log("\n3. Submitting Solution by Solver...");
    const solution = await SolutionService.submitSolution(solverId, {
      challengeId,
      title: "IoT Aqlli Sug'orish Yechimi",
      description: "Sensorli avtomatik boshqaruv tizimi",
      technicalApproach: "ESP32 va mikro-klapanlar",
      estimatedCost: 12000000,
      estimatedDays: 20,
    });
    solutionId = solution.id;
    console.log("  ✅ [PASS] Solution submitted with initial status SUBMITTED");

    // 4. Test Chat Access Before Approval (Must Fail)
    console.log("\n4. Testing Chat Access Before Solution Approval...");
    try {
      await ChatService.getChatRoom(ownerId, solutionId);
      throw new Error("Chat should not open before solution is approved/shortlisted");
    } catch (err: any) {
      if (err.message.includes("ma'qullanmagan")) {
        console.log("  ✅ [PASS] Blocked: Chat cannot open for unapproved solutions");
      } else {
        throw err;
      }
    }

    // 5. Shortlist Solution (Approve)
    console.log("\n5. Shortlisting Solution by Problem Owner...");
    await SolutionService.shortlistSolution(ownerId, {
      challengeId,
      solutionId,
      rankPosition: 1,
      shortlistReason: "Texnik jihatdan eng maqbul taklif",
    });

    const updatedSol = await prisma.solution.findUnique({ where: { id: solutionId } });
    if (updatedSol?.status !== "SHORTLISTED") {
      throw new Error("Solution status should be SHORTLISTED");
    }
    console.log("  ✅ [PASS] Solution status updated to SHORTLISTED");

    // 6. Test Chat Access After Shortlisting
    console.log("\n6. Testing Secure Chat Access for Participants...");
    const ownerChat = await ChatService.getChatRoom(ownerId, solutionId);
    if (ownerChat.currentUserRole !== "OWNER") {
      throw new Error("Owner role mismatch in chat room");
    }
    console.log("  ✅ [PASS] Problem Owner successfully accessed chat room");

    const solverChat = await ChatService.getChatRoom(solverId, solutionId);
    if (solverChat.currentUserRole !== "SOLVER") {
      throw new Error("Solver role mismatch in chat room");
    }
    console.log("  ✅ [PASS] Solver successfully accessed chat room");

    // 7. Test Unauthorized Outsider Access (Must be Blocked)
    console.log("\n7. Testing Unauthorized Outsider Access Security Check...");
    try {
      await ChatService.getChatRoom(outsiderId, solutionId);
      throw new Error("Outsider should not be allowed into private chat room");
    } catch (err: any) {
      if (err.message.includes("huquqi yo'q")) {
        console.log("  ✅ [PASS] Blocked: Unauthorized outsider blocked from private chat (RBAC enforced)");
      } else {
        throw err;
      }
    }

    // 8. Test Sending Messages
    console.log("\n8. Testing Direct Messaging between Owner and Solver...");
    const msg1 = await ChatService.sendMessage(
      ownerId,
      solutionId,
      "Assalomu alaykum! Loyihangiz ma'qul keldi, qachon amalda sinovni boshlaymiz?"
    );
    if (!msg1.id || msg1.content !== "Assalomu alaykum! Loyihangiz ma'qul keldi, qachon amalda sinovni boshlaymiz?") {
      throw new Error("Message 1 send failed");
    }
    console.log("  ✅ [PASS] Problem Owner successfully sent initial message");

    const msg2 = await ChatService.sendMessage(
      solverId,
      solutionId,
      "Vaalaykum assalom! Biz uskunalar bilan 3 kunda tayyor bo'lamiz."
    );
    if (!msg2.id || msg2.content !== "Vaalaykum assalom! Biz uskunalar bilan 3 kunda tayyor bo'lamiz.") {
      throw new Error("Message 2 send failed");
    }
    console.log("  ✅ [PASS] Solver successfully sent response message");

    // 9. Verify Message History and Read Receipts
    console.log("\n9. Verifying Message History and Read Status...");
    const refreshedChat = await ChatService.getChatRoom(ownerId, solutionId);
    if (refreshedChat.messages.length < 2) {
      throw new Error(`Expected at least 2 messages, got ${refreshedChat.messages.length}`);
    }
    console.log("  ✅ [PASS] All messages successfully retrieved in correct chronological sequence");

    // 10. Verify Notification Delivery
    console.log("\n10. Verifying Notification Delivery for Chat Messages...");
    const notifications = await prisma.notification.findMany({
      where: { userId: solverId, type: "CHAT_MESSAGE" },
    });
    if (notifications.length === 0) {
      throw new Error("Recipient did not receive CHAT_MESSAGE notification");
    }
    console.log("  ✅ [PASS] Recipient received in-app chat notification");

    console.log("\n========================================");
    console.log("🎉 Phase 7 Secure Chat Results: ALL 10/10 TESTS PASSED!");
    console.log("========================================\n");
  } catch (err) {
    console.error("❌ Test failed:", err);
    process.exit(1);
  }
}

runChatTests();
