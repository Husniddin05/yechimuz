import {
  IAIService,
  ProblemAnalysisInput,
  GeneratedChallengeOutput,
  SolverMatchResult,
  SolutionEvaluationInput,
  SolutionEvaluationOutput,
} from "./ai.interface";

export class GeminiAIProvider implements IAIService {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
  }

  async generateChallenge(input: ProblemAnalysisInput): Promise<GeneratedChallengeOutput> {
    // If Gemini API Key is available and valid, call Gemini API
    if (this.apiKey && this.apiKey !== "your_gemini_api_key_here") {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Siz YechimUZ platformasining senior AI Challenge Architectisiz. Quyidagi muammoni tahlil qilib JSON formatda javob bering.
                      Muammo nomi: "${input.title}"
                      Muammo tavsifi: "${input.rawDescription}"
                      Hudud: "${input.region || "Farg'ona"}"

                      JSON formati strictly:
                      {
                        "structuredTitle": "...",
                        "formattedObjective": "...",
                        "categorySlug": "agriculture-water | ecology-waste | industry-engineering | it-ai | energy-greentech | education-social",
                        "suggestedSkills": ["Skill1", "Skill2"],
                        "targetKPIs": [{"name": "...", "target": "..."}],
                        "challengeFormat": "INNOVATION | AGRO_TECH | ECO_SOLUTIONS | SOFTWARE",
                        "missingFields": [],
                        "generatedQuestions": ["Q1", "Q2"]
                      }`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const json = await response.json();
          const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(cleanJson);
            return parsed;
          }
        }
      } catch (err) {
        console.warn("Gemini API call fallback to Uzbek NLP Engine:", err);
      }
    }

    // Smart Uzbek Rule-based NLP Parser Fallback
    return this.fallbackUzbekNLP(input);
  }

  private fallbackUzbekNLP(input: ProblemAnalysisInput): GeneratedChallengeOutput {
    const text = (input.title + " " + input.rawDescription).toLowerCase();

    let categorySlug = "agriculture-water";
    let skills = ["IoT", "Agriculture", "Automation"];
    let challengeFormat = "AGRO_TECH";

    if (text.includes("plastik") || text.includes("chiqindi") || text.includes("ekologiya")) {
      categorySlug = "ecology-waste";
      skills = ["Ecology", "Logistics", "Waste Recycling", "Process Automation"];
      challengeFormat = "ECO_SOLUTIONS";
    } else if (text.includes("ai") || text.includes("dastur") || text.includes("python") || text.includes("model")) {
      categorySlug = "it-ai";
      skills = ["Python", "Computer Vision", "Machine Learning", "Mobile App"];
      challengeFormat = "SOFTWARE";
    } else if (text.includes("elektr") || text.includes("energiya") || text.includes("quyosh")) {
      categorySlug = "energy-greentech";
      skills = ["Solar Energy", "Embedded Systems", "Electrical Engineering"];
      challengeFormat = "GREEN_TECH";
    }

    return {
      structuredTitle: `${input.title} bo'yicha Rasmiy Challenge`,
      formattedObjective: `${input.region || "Farg'ona"} hududida muammoni avtomatlashtirish, samaradorlikni oshirish va resurslarni tejashga yo'naltirilgan texnologik yechim topshirig'i.`,
      categorySlug,
      suggestedSkills: skills,
      targetKPIs: [
        { name: "Samaradorlik ko'rsatkichi", target: "30-40% oshirish" },
        { name: "Amalga oshirish muddati", target: "45 kun" },
        { name: "ROI o'zini qoplash muddati", target: "6 oy" },
      ],
      challengeFormat,
      missingFields: ["Aniq apparat modeli", "Byudjet tasdiqlanishi"],
      generatedQuestions: [
        "Jarayon uchun zarur texnik infratuzilma allaqachon mavjudmi?",
        "Pilot sinovi o'tkaziladigan aniq joy va mas'ul shaxs tayinlanganmi?",
      ],
    };
  }

  async matchSolvers(
    challenge: { structuredTitle: string; suggestedSkills: string[]; region: string },
    solvers: Array<{ id: string; name: string; skills: string[]; region: string; bio?: string }>
  ): Promise<SolverMatchResult[]> {
    const results: SolverMatchResult[] = [];

    for (const solver of solvers) {
      let score = 50; // Base score
      const reasons: string[] = [];

      // Check skill matches
      const matchingSkills = solver.skills.filter((skill) =>
        challenge.suggestedSkills.some((cs) => cs.toLowerCase() === skill.toLowerCase())
      );

      if (matchingSkills.length > 0) {
        score += matchingSkills.length * 15;
        reasons.push(`Ko'nikmalar mosligi: ${matchingSkills.join(", ")}`);
      }

      // Check region match
      if (solver.region === challenge.region) {
        score += 15;
        reasons.push(`Hududiy moslik (${challenge.region} viloyati)`);
      } else {
        reasons.push("Masofaviy ish (Remote) imkoniyati");
      }

      // Cap max score at 98%
      const finalScore = Math.min(score, 98);

      results.push({
        solverId: solver.id,
        solverName: solver.name,
        matchScore: finalScore,
        matchReasons: reasons,
      });
    }

    return results.sort((a, b) => b.matchScore - a.matchScore);
  }

  async evaluateSolution(input: SolutionEvaluationInput): Promise<SolutionEvaluationOutput> {
    if (this.apiKey && this.apiKey !== "your_gemini_api_key_here") {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Siz YechimUZ platformasining yetakchi Texnik Eksperti va Innovatsiyalar Auditorisiz.
Quyidagi muammo va unga yuborilgan yechim taklifini to'liq tekshirib chiqing, baholang va amaliy tavsiyalar bering.

MUAMMO:
Sarlavha: "${input.problemTitle}"
Tavsif: "${input.problemDescription}"
Hudud: "${input.problemRegion || "Farg'ona"}"
Byudjet: ${input.problemBudget || 0} UZS
Kutilgan natija: "${input.problemTargetResult || "Noma'lum"}"

YECHIM TAKLIFI:
Sarlavha: "${input.solutionTitle}"
Tavsif: "${input.solutionDescription}"
Texnik yondashuv: "${input.technicalApproach}"
Kutilayotgan natija: "${input.expectedResult || ""}"
Taklif qilingan byudjet: ${input.estimatedCost} UZS
Muddati: ${input.estimatedDays} kun
Xatarlar tahlili: "${input.riskAnalysis || "Ko'rsatilmagan"}"
Yechim beruvchi mutaxassis: "${input.solverName || "Noma'lum"}" (${input.solverOccupation || ""})
Mutaxassis ko'nikmalari: ${(input.solverSkills || []).join(", ")}

Javobni FAQAT quyidagi JSON formatida qaytaring:
{
  "overallScore": 88,
  "feasibilityScore": 85,
  "innovationScore": 90,
  "costEfficiencyScore": 89,
  "verdict": "EXCELLENT" | "RECOMMENDED" | "NEEDS_REVISION" | "HIGH_RISK",
  "verdictText": "A'lo darajadagi yechim / Pilot loyihaga to'liq mos",
  "summary": "Yechim muammoning barcha asosiy parametrlariga mos tushadi...",
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "recommendations": ["...", "..."],
  "pilotReadiness": "Pilot sinoviga 90% tayyor...",
  "nextSteps": ["...", "..."]
}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const json = await response.json();
          const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(cleanJson);
            return parsed;
          }
        }
      } catch (err) {
        console.warn("Gemini API solution evaluation fallback to Uzbek AI Engine:", err);
      }
    }

    // Intelligent Uzbek AI Evaluation Engine Fallback
    return this.fallbackSolutionEvaluation(input);
  }

  private fallbackSolutionEvaluation(input: SolutionEvaluationInput): SolutionEvaluationOutput {
    const techText = (input.technicalApproach + " " + input.solutionDescription).toLowerCase();
    const probText = (input.problemTitle + " " + input.problemDescription).toLowerCase();

    // 1. Feasibility analysis (0-100)
    let feasibilityScore = 70;
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];
    const nextSteps: string[] = [];

    const techKeywords = [
      "iot", "datchik", "sensor", "avtomat", "klapan", "kontroller", "arduino", "raspberry",
      "python", "api", "baza", "mobil", "dastur", "sun'iy intellekt", "ai", "model", "server",
      "filtrlash", "qayta ishlash", "nasos", "energiya", "quyosh paneli", "akkumulyator"
    ];

    const matchedTech = techKeywords.filter((kw) => techText.includes(kw));
    if (matchedTech.length >= 3) {
      feasibilityScore += 20;
      strengths.push(`Zamonaviy va mos texnik vositalar tanlangan (${matchedTech.slice(0, 4).join(", ")})`);
    } else if (matchedTech.length >= 1) {
      feasibilityScore += 10;
      strengths.push("Amaliy apparat yoki dasturiy arxitektura rejalashtirilgan");
    } else {
      feasibilityScore -= 10;
      weaknesses.push("Texnik yondashuvda aniq texnologiyalar va apparat vositalari kam ko'rsatilgan");
    }

    if (input.riskAnalysis && input.riskAnalysis.length > 20) {
      feasibilityScore += 8;
      strengths.push("Ehtimoliy xatarlar va ularni bartaraf qilish choralari oldindan o'ylangan");
    } else {
      weaknesses.push("Xatarlar tahlili (Risk Analysis) yetarli darajada chuqur bayon qilinmagan");
      recommendations.push("Amaliyot jarayonidagi zaxira reja (Fallback plan) va ehtiyot qismlar ta'minotini aniqlashtiring");
    }

    // 2. Cost Efficiency (0-100)
    let costScore = 80;
    if (input.problemBudget && input.problemBudget > 0) {
      const ratio = input.estimatedCost / input.problemBudget;
      if (ratio <= 0.85) {
        costScore = 95;
        strengths.push("Taklif qilingan byudjet muammo byudjetidan tejamkorroq va iqtisodiy jihatdan foydali");
      } else if (ratio <= 1.05) {
        costScore = 88;
        strengths.push("Byudjet muammo talablariga to'liq mos keladi");
      } else {
        costScore = 65;
        weaknesses.push("Taklif qilingan narx dastlabki belgilangan byudjetdan biroz yuqoriroq");
        recommendations.push("Loyiha bosqichma-bosqich moliyalashtirilsin yoki xarajatlar smetasi optimallashtirilsin");
      }
    } else {
      costScore = 85;
      strengths.push("O'rtacha bozor narxlariga mos keluvchi maqbul xarajatlar smetasi");
    }

    // 3. Timeline check
    if (input.estimatedDays >= 14 && input.estimatedDays <= 90) {
      strengths.push(`Amalga oshirish muddati (${input.estimatedDays} kun) MVP va pilot sinovi uchun juda optimal`);
    } else if (input.estimatedDays < 14) {
      weaknesses.push(`Belgilangan muddat (${input.estimatedDays} kun) to'liq sinovdan o'tkazish uchun juda qisqa bo'lishi mumkin`);
      recommendations.push("Pilot sinov muddatini kamida 2-3 haftaga uzaytirib, yakuniy barqarorlikni tekshiring");
    } else {
      weaknesses.push(`Loyiha muddati (${input.estimatedDays} kun) uzoq muddatli`);
    }

    // 4. Innovation score
    let innovationScore = 75;
    if (techText.includes("ai") || techText.includes("sun'iy intellekt") || techText.includes("iot") || techText.includes("avtomat")) {
      innovationScore = 90;
      strengths.push("Innovatsion intellektual va avtomatlashtirilgan mexanizmlar jalb qilingan");
    } else {
      innovationScore = 75;
    }

    // 5. Solver qualification
    if (input.solverSkills && input.solverSkills.length > 0) {
      strengths.push(`Yechimchining ko'nikmalari loyihaga mos: ${input.solverSkills.slice(0, 3).join(", ")}`);
    }

    feasibilityScore = Math.min(Math.max(feasibilityScore, 45), 98);
    innovationScore = Math.min(Math.max(innovationScore, 50), 98);
    costScore = Math.min(Math.max(costScore, 40), 98);

    const overallScore = Math.round((feasibilityScore * 0.45) + (costScore * 0.3) + (innovationScore * 0.25));

    let verdict: "EXCELLENT" | "RECOMMENDED" | "NEEDS_REVISION" | "HIGH_RISK" = "RECOMMENDED";
    let verdictText = "Tavsiya etiladi: Loyiha talablariga mos keladi";
    if (overallScore >= 85) {
      verdict = "EXCELLENT";
      verdictText = "Juda istiqbolli: Pilot loyihaga to'liq tavsiya qilinadi";
    } else if (overallScore < 65) {
      verdict = "NEEDS_REVISION";
      verdictText = "Qayta ko'rib chiqish talab etiladi: Texnik va byudjet aniqliklari kerak";
    }

    recommendations.push("Muammo egasi va yechimchi o'rtasida texnik brifing hamda shartnoma talablarini kelishib oling");
    recommendations.push("1-bosqichda Farg'ona hududidagi ob'ektda MVP sinovini yo'lga qo'ying");

    nextSteps.push("Yechimchini Shortlistga kiritish yoki suhbatga chaqirish");
    nextSteps.push("Amaliy tajriba o'tkaziladigan lokatsiya va mas'ullarni tasdiqlash");
    nextSteps.push("Pilot loyiha shartnomasi va KPI ko'rsatkichlarini imzolash");

    return {
      overallScore,
      feasibilityScore,
      innovationScore,
      costEfficiencyScore: costScore,
      verdict,
      verdictText,
      summary: `AI tahlili natijalariga ko'ra, taqdim etilgan "${input.solutionTitle}" yechimi muammoni hal qilishda ${overallScore}% ijobiy natijadorlik ko'rsatmoqda. Texnik yondashuv amaliyotga tatbiq etish uchun mos va resurslar samarali rejalashtirilgan.`,
      strengths,
      weaknesses: weaknesses.length > 0 ? weaknesses : ["Jiddiy texnik kamchiliklar aniqlanmadi"],
      recommendations,
      pilotReadiness: overallScore >= 80 ? "Pilot sinoviga tayyor (85-95%)" : "Qo'shimcha aniqliklar kiritilgach pilotga tayyor",
      nextSteps,
    };
  }
}
