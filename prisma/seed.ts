import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting YechimUZ Database Seeding...");

  // 1. Seed Roles
  const roles = [
    { name: "USER", description: "Oddiy fuqaro va foydalanuvchi" },
    { name: "SOLVER", description: "Muammo va challenge'larga yechim beruvchi mutaxassis" },
    { name: "PROBLEM_OWNER", description: "Muammo e'lon qiluvchi shaxs yoki subyekt" },
    { name: "COMPANY", description: "Tashkilot, korxona va sanoat zavodlari" },
    { name: "STARTUP", description: "Innovatsion startup loyihasi" },
    { name: "EXPERT", description: "Yechimlar va pilotlarni baholovchi mustaqil ekspert" },
    { name: "SPONSOR", description: "Challenge va pilotlarni moliyalashtiruvchi homiy" },
    { name: "MODERATOR", description: "Kontent va sifat tekshiruvi bo'yicha moderator" },
    { name: "ADMIN", description: "Tizim administratori" },
    { name: "SUPER_ADMIN", description: "Bosh tizim administratori" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
  }
  console.log("✅ 10 User Roles seeded successfully.");

  // 2. Seed Categories
  const categories = [
    {
      nameUz: "Qishloq xo'jaligi va Suv resurslari",
      nameRu: "Сельское хозяйство и водные ресурсы",
      nameEn: "Agriculture & Water Resources",
      slug: "agriculture-water",
      icon: "Sprout",
    },
    {
      nameUz: "Ekologiya va Chiqindi boshqaruvi",
      nameRu: "Экология и управление отходами",
      nameEn: "Ecology & Waste Management",
      slug: "ecology-waste",
      icon: "Recycle",
    },
    {
      nameUz: "Sanoat va Muhandislik",
      nameRu: "Промышленность и инженерия",
      nameEn: "Industry & Engineering",
      slug: "industry-engineering",
      icon: "Factory",
    },
    {
      nameUz: "Axborot texnologiyalari va AI",
      nameRu: "Информационные технологии и ИИ",
      nameEn: "IT & Artificial Intelligence",
      slug: "it-ai",
      icon: "Cpu",
    },
    {
      nameUz: "Energetika va Yashil texnologiyalar",
      nameRu: "Энергетика и зеленые технологии",
      nameEn: "Energy & Green Tech",
      slug: "energy-greentech",
      icon: "Zap",
    },
    {
      nameUz: "Ta'lim va Ijtimoiy rivojlanish",
      nameRu: "Образование и социальное развитие",
      nameEn: "Education & Social Impact",
      slug: "education-social",
      icon: "GraduationCap",
    },
  ];

  for (const cat of categories) {
    await prisma.problemCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log("✅ 6 Problem Categories seeded.");

  // 3. Seed Super Admin User
  const adminRole = await prisma.role.findUnique({ where: { name: "SUPER_ADMIN" } });
  const hashedPassword = await bcrypt.hash("Admin123!", 10);

  if (adminRole) {
    await prisma.user.upsert({
      where: { email: "admin@yechim.uz" },
      update: {},
      create: {
        email: "admin@yechim.uz",
        passwordHash: hashedPassword,
        isVerified: true,
        status: "ACTIVE",
        userRoles: { create: { roleId: adminRole.id } },
        profile: {
          create: {
            firstName: "System",
            lastName: "Administrator",
            username: "yechim_admin",
            region: "Farg'ona",
            occupation: "Lead Platform Admin",
            bio: "YechimUZ bosh administratori",
          },
        },
      },
    });
  }

  // 4. Seed Fergana Demo Problem Owner & Solver
  const solverRole = await prisma.role.findUnique({ where: { name: "SOLVER" } });
  const ownerRole = await prisma.role.findUnique({ where: { name: "PROBLEM_OWNER" } });

  if (solverRole && ownerRole) {
    const demoSolver = await prisma.user.upsert({
      where: { email: "solver@fergana.uz" },
      update: {},
      create: {
        email: "solver@fergana.uz",
        passwordHash: hashedPassword,
        isVerified: true,
        userRoles: { create: { roleId: solverRole.id } },
        profile: {
          create: {
            firstName: "Azizbek",
            lastName: "Muhandis",
            username: "aziz_solver",
            region: "Farg'ona",
            occupation: "IoT va Agrotexnika Mutaxassisi",
            skills: JSON.stringify(["Python", "IoT", "Arduino", "Agriculture", "Embedded Systems"]),
            bio: "Farg'ona vodiysida tomchilatib sug'orish va IoT avtomatlashtirish yechimlari bo'yicha amaliyotchi muhandis.",
            solvedCount: 3,
            ratingAvg: 4.9,
          },
        },
      },
    });

    const demoOwner = await prisma.user.upsert({
      where: { email: "owner@fergana.uz" },
      update: {},
      create: {
        email: "owner@fergana.uz",
        passwordHash: hashedPassword,
        isVerified: true,
        userRoles: { create: { roleId: ownerRole.id } },
        profile: {
          create: {
            firstName: "Rustamjon",
            lastName: "Fermer",
            username: "rustam_fermer",
            region: "Farg'ona",
            organizationName: "Farg'ona Agromahsulot MCHJ",
            occupation: "Tadbirkor / Issiqxona egasi",
            bio: "Farg'ona tumanida 5 gektar zamonaviy issiqxona majmuasi rahbari.",
          },
        },
      },
    });

    // Seed Initial Fergana Problems
    const agWaterCat = await prisma.problemCategory.findUnique({ where: { slug: "agriculture-water" } });
    const ecoCat = await prisma.problemCategory.findUnique({ where: { slug: "ecology-waste" } });
    const itCat = await prisma.problemCategory.findUnique({ where: { slug: "it-ai" } });

    if (agWaterCat && demoOwner) {
      const p1 = await prisma.problem.create({
        data: {
          ownerId: demoOwner.id,
          categoryId: agWaterCat.id,
          title: "Issiqxonada suv sarfini 35% ga kamaytiruvchi IoT sug'orish tizimi",
          rawDescription: "Bizning Farg'ona tumanidagi 5 gektarlik issiqxonada har kuni suv va o'g'it ortiqcha sarflanyapti. Namlik datchiklari va avtomatik klapanlar orqali suvni tejaydigan va mobil ilovadan boshqariladigan apparat-dasturiy yechim kerak.",
          region: "Farg'ona",
          organization: "Farg'ona Agromahsulot MCHJ",
          problemType: "AGRICULTURAL",
          severityLevel: "HIGH",
          targetResult: "Suv sarfini 35% ga, elektr energiyasini 20% ga kamaytirish va hosildorlikni oshirish",
          budget: 25000000,
          currency: "UZS",
          status: "PUBLISHED",
        },
      });

      // Seed corresponding Challenge structure
      const ch1 = await prisma.challenge.create({
        data: {
          problemId: p1.id,
          structuredTitle: "Issiqxonalarda Suv Resurslarini Avtomatik Boshqarish Challenge'i",
          formattedObjective: "IoT datchiklari va avtomatlashtirish orqali issiqxonada suv va o'g'it sarfini kamaytirish.",
          suggestedSkills: JSON.stringify(["IoT", "Agriculture", "Embedded Systems", "Mobile App", "Automation"]),
          targetKPIs: JSON.stringify([
            { name: "Water Consumption Reduction", target: "35%" },
            { name: "Implementation Speed", target: "45 kun" },
            { name: "ROI Period", target: "6 oy" },
          ]),
          challengeFormat: "AGRO_TECH",
          isOwnerApproved: true,
        },
      });

      if (demoSolver) {
        await prisma.solution.create({
          data: {
            challengeId: ch1.id,
            solverId: demoSolver.id,
            title: "DripSense IoT: Tuproq namligi va iqlim datchiklari asosidagi avtonom sug'orish tizimi",
            description: "Issiqxona bo'ylab har 50 metr masofada simsiz LoRaWAN datchiklari joylashtiriladi. Tuproq namligi 40% dan tushganda avtomatik magnit klapanlar ochilib, faqat zarur miqdordagi tomchilatib sug'orishni amalga oshiradi. Mobil ilovadan monitoring va favqulodda to'xtatish imkoni mavjud.",
            technicalApproach: "ESP32 mikrokontrolleri, Tuproq namligi va harorat sensorlari (Capacitive Moisture Sensor v2.0), RS485/LoRaWAN simsiz aloqa protokoli, 12V solenoid suv klapanlari, FastAPI backend va React Native mobil ilovasi.",
            expectedResult: "Suv sarfi 38% ga kamayadi, o'g'it yuvilib ketishi oldi olinadi, hosil 15% ga oshadi.",
            estimatedCost: 21500000,
            estimatedDays: 35,
            teamMembers: JSON.stringify(["Azizbek Muhandis (Lead IoT)", "Nodir Dasturchi (Mobile)"]),
            githubUrl: "https://github.com/yechimuz/dripsense-iot",
            demoUrl: "https://dripsense-demo.yechim.uz",
            riskAnalysis: "Elektr uzilishi xavfi uchun 12V 7Ah zaxira akkumulyator va oflayn avtomatik rejim ta'minlangan.",
            status: "SUBMITTED",
            scoreAvg: 9.1,
          },
        });
      }
    }

    if (ecoCat && demoOwner) {
      await prisma.problem.create({
        data: {
          ownerId: demoOwner.id,
          categoryId: ecoCat.id,
          title: "Farg'ona shahri hududida plastik chiqindilarni saralash va qayta ishlash logistikasi",
          rawDescription: "Farg'ona shahri va atrofidagi bozorlarda kunlik hosil bo'ladigan katta hajmdagi plastik va polietilen chiqindilarni yig'ish va qayta ishlash zavodiga yetkazib berish logistikasini optimallashtirish muammosi.",
          region: "Farg'ona",
          organization: "EcoFergana MCHJ",
          problemType: "ECOLOGY",
          severityLevel: "CRITICAL",
          targetResult: "Chiqindi yig'ish samaradorligini 50% ga oshirish va qayta ishlash hajmiga erishish",
          budget: 40000000,
          currency: "UZS",
          status: "PUBLISHED",
        },
      });
    }

    if (itCat && demoOwner) {
      await prisma.problem.create({
        data: {
          ownerId: demoOwner.id,
          categoryId: itCat.id,
          title: "Meva-sabzavotlar kasalliklarini smartfon kamerasi orqali anilaydigan AI model",
          rawDescription: "Barglardagi dog'lar va kasallik belgilari orqali zararkunandalarni ertachi bosqichda aniqlaydigan kompyuterli ko'rish (Computer Vision) neron tarmog'i modeli va tavsiya beruvchi algoritmi kerak.",
          region: "Farg'ona",
          problemType: "TECHNICAL",
          severityLevel: "MEDIUM",
          targetResult: "Atigi 2 soniyada 92%+ aniqlikdagi diagnostika natijasi",
          budget: 18000000,
          currency: "UZS",
          status: "PUBLISHED",
        },
      });
    }

    console.log("✅ Seeded initial Fergana Problems & Challenge data.");
  }

  console.log("🚀 YechimUZ Seeding Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
