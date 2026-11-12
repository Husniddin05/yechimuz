import { prisma } from "@/lib/prisma";

export class ChatService {
  /**
   * Yechim bo'yicha chat xonasini olish yoki ochish (RBAC & Xavfsizlik tekshiruvi bilan)
   */
  static async getChatRoom(userId: string, solutionId: string) {
    const solution = await prisma.solution.findUnique({
      where: { id: solutionId },
      include: {
        solver: {
          include: { profile: true },
        },
        challenge: {
          include: {
            problem: {
              include: {
                owner: {
                  include: { profile: true },
                },
              },
            },
          },
        },
      },
    });

    if (!solution || !solution.challenge || !solution.challenge.problem) {
      throw new Error("Yechim yoki unga bog'liq muammo topilmadi.");
    }

    const problem = solution.challenge.problem;
    const isOwner = problem.ownerId === userId;
    const isSolver = solution.solverId === userId;

    // Foydalanuvchi admin ekanligini ham tekshirish
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: { role: true },
        },
      },
    });

    const isAdmin = user?.userRoles.some((ur) =>
      ["ADMIN", "SUPER_ADMIN"].includes(ur.role.name)
    );

    if (!isOwner && !isSolver && !isAdmin) {
      throw new Error("Sizda ushbu xavfsiz chatga kirish huquqi yo'q.");
    }

    // Yechim ma'qullangan bo'lishi shart (SHORTLISTED, SELECTED, PILOT, COMPLETED)
    const allowedStatuses = ["SHORTLISTED", "SELECTED", "PILOT", "COMPLETED"];
    if (!allowedStatuses.includes(solution.status) && !isAdmin) {
      throw new Error("Ushbu yechim hali muammo egasi tomonidan ma'qullanmagan. Chat faqat yechim ma'qullangach ochiladi.");
    }

    // Chat xonasini topish yoki avtomatik yaratish
    let chatRoom = await prisma.chatRoom.findUnique({
      where: { solutionId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            sender: {
              include: { profile: true },
            },
          },
        },
      },
    });

    if (!chatRoom) {
      chatRoom = await prisma.chatRoom.create({
        data: {
          solutionId,
          problemId: problem.id,
          ownerId: problem.ownerId,
          solverId: solution.solverId,
          status: "ACTIVE",
        },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
            include: {
              sender: {
                include: { profile: true },
              },
            },
          },
        },
      });
    }

    // Agar boshqa tomon yozgan o'qilmagan xabarlar bo'lsa, ularni o'qildi (isRead=true) deb belgilash
    await prisma.chatMessage.updateMany({
      where: {
        chatRoomId: chatRoom.id,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    return {
      chatRoomId: chatRoom.id,
      solutionId: solution.id,
      solutionTitle: solution.title,
      solutionStatus: solution.status,
      problemId: problem.id,
      problemTitle: problem.title,
      owner: {
        id: problem.owner.id,
        email: problem.owner.email,
        name: `${problem.owner.profile?.firstName || ""} ${problem.owner.profile?.lastName || ""}`.trim() || problem.owner.email,
        username: problem.owner.profile?.username || "owner",
        avatarUrl: problem.owner.profile?.avatarUrl || null,
        organizationName: problem.owner.profile?.organizationName || null,
      },
      solver: {
        id: solution.solver.id,
        email: solution.solver.email,
        name: `${solution.solver.profile?.firstName || ""} ${solution.solver.profile?.lastName || ""}`.trim() || solution.solver.email,
        username: solution.solver.profile?.username || "solver",
        avatarUrl: solution.solver.profile?.avatarUrl || null,
        occupation: solution.solver.profile?.occupation || null,
      },
      currentUserRole: isOwner ? "OWNER" : isSolver ? "SOLVER" : "ADMIN",
      messages: chatRoom.messages.map((m) => ({
        id: m.id,
        senderId: m.senderId,
        senderName: `${m.sender.profile?.firstName || ""} ${m.sender.profile?.lastName || ""}`.trim() || m.sender.email,
        senderUsername: m.sender.profile?.username || "user",
        senderAvatar: m.sender.profile?.avatarUrl || null,
        isMe: m.senderId === userId,
        content: m.content,
        isRead: m.isRead,
        createdAt: m.createdAt,
      })),
    };
  }

  /**
   * Xavfsiz chatda xabar yuborish
   */
  static async sendMessage(userId: string, solutionId: string, content: string) {
    const trimmed = (content || "").trim();
    if (!trimmed) {
      throw new Error("Xabar matni bo'sh bo'lishi mumkin emas.");
    }
    if (trimmed.length > 2000) {
      throw new Error("Xabar matni 2000 belgidan oshmasligi kerak.");
    }

    // Chat xonasi ma'lumotlarini tekshirish
    const roomData = await this.getChatRoom(userId, solutionId);

    const message = await prisma.chatMessage.create({
      data: {
        chatRoomId: roomData.chatRoomId,
        senderId: userId,
        content: trimmed,
      },
      include: {
        sender: {
          include: { profile: true },
        },
      },
    });

    // Qabul qiluvchiga (ikkinchi tomonga) bildirishnoma yaratish
    const recipientId = userId === roomData.owner.id ? roomData.solver.id : roomData.owner.id;
    const senderName = userId === roomData.owner.id ? roomData.owner.name : roomData.solver.name;

    await prisma.notification.create({
      data: {
        userId: recipientId,
        title: `Yangi xabar: "${roomData.solutionTitle}"`,
        message: `${senderName}: ${trimmed.length > 60 ? trimmed.substring(0, 60) + "..." : trimmed}`,
        type: "CHAT_MESSAGE",
        linkUrl: `/problems/${roomData.problemId}`,
      },
    });

    // Chat xonasining updatedAt yangilash
    await prisma.chatRoom.update({
      where: { id: roomData.chatRoomId },
      data: { updatedAt: new Date() },
    });

    return {
      id: message.id,
      senderId: message.senderId,
      senderName: `${message.sender.profile?.firstName || ""} ${message.sender.profile?.lastName || ""}`.trim() || message.sender.email,
      senderUsername: message.sender.profile?.username || "user",
      senderAvatar: message.sender.profile?.avatarUrl || null,
      isMe: true,
      content: message.content,
      isRead: message.isRead,
      createdAt: message.createdAt,
    };
  }

  /**
   * Foydalanuvchining barcha faol chatlarini olish
   */
  static async getMyChatRooms(userId: string) {
    const chatRooms = await prisma.chatRoom.findMany({
      where: {
        OR: [{ ownerId: userId }, { solverId: userId }],
      },
      orderBy: { updatedAt: "desc" },
      include: {
        problem: true,
        solution: true,
        owner: { include: { profile: true } },
        solver: { include: { profile: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    return chatRooms.map((room) => {
      const isOwner = room.ownerId === userId;
      const partner = isOwner ? room.solver : room.owner;
      const partnerName = `${partner.profile?.firstName || ""} ${partner.profile?.lastName || ""}`.trim() || partner.email;
      const lastMsg = room.messages[0];

      return {
        id: room.id,
        solutionId: room.solutionId,
        problemId: room.problemId,
        problemTitle: room.problem.title,
        solutionTitle: room.solution.title,
        partnerName,
        partnerRole: isOwner ? "Yechimchi (Solver)" : "Muammo Egasi",
        partnerAvatar: partner.profile?.avatarUrl || null,
        lastMessage: lastMsg ? lastMsg.content : "Yangi chat ochildi",
        lastMessageAt: lastMsg ? lastMsg.createdAt : room.createdAt,
      };
    });
  }
}
