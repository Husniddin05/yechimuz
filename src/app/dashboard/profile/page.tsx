"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Shield,
  MapPin,
  Briefcase,
  Award,
  CheckCircle2,
  Edit3,
  Globe,
  Star,
  Plus,
  Trash2,
  FolderPlus,
  FileText,
  Sparkles,
  Calendar,
  ChevronDown,
  ChevronUp,
  Eye,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { SolutionReviewModal } from "@/components/solutions/SolutionReviewModal";

interface ProfileData {
  id: string;
  email: string;
  phone?: string;
  isVerified: boolean;
  roles: string[];
  profile: {
    firstName: string;
    lastName: string;
    username: string;
    avatarUrl?: string;
    bio?: string;
    region: string;
    organizationName?: string;
    occupation?: string;
    skills: string[];
    experienceYears: number;
    portfolioUrls: string[];
    website?: string;
    ratingAvg: number;
    solvedCount: number;
    impactTotal: number;
    badges: string[];
  };
}

interface UserProblem {
  id: string;
  title: string;
  rawDescription: string;
  region: string;
  organization?: string;
  problemType: string;
  severityLevel: string;
  budget: number;
  currency: string;
  deadline?: string;
  status: string;
  createdAt: string;
  category?: {
    nameUz: string;
    slug: string;
  };
  challenge?: {
    id: string;
    structuredTitle: string;
    solutions: Array<{
      id: string;
      title: string;
      description: string;
      technicalApproach: string;
      expectedResult?: string;
      estimatedCost: number;
      estimatedDays: number;
      riskAnalysis?: string;
      status: string;
      scoreAvg: number;
      createdAt: string;
      solver?: {
        profile?: {
          firstName: string;
          lastName: string;
          username: string;
          occupation?: string;
          organizationName?: string;
          ratingAvg: number;
          skills?: string[];
        };
      };
      reviews?: Array<{
        id: string;
        totalScore: number;
      }>;
    }>;
  };
}

interface UserSolution {
  id: string;
  title: string;
  description: string;
  technicalApproach: string;
  expectedResult?: string;
  estimatedCost: number;
  estimatedDays: number;
  status: string;
  scoreAvg: number;
  createdAt: string;
  challenge: {
    problem: {
      id: string;
      title: string;
      region: string;
      budget: number;
    };
  };
  solver?: {
    profile?: {
      firstName: string;
      lastName: string;
      username: string;
      ratingAvg: number;
      skills?: string[];
    };
  };
  reviews: Array<{
    id: string;
    totalScore: number;
  }>;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"problems" | "solutions" | "info">("problems");

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    region: "Farg'ona",
    occupation: "",
    organizationName: "",
    website: "",
    skills: [] as string[],
  });
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);

  // User's problems and solutions
  const [myProblems, setMyProblems] = useState<UserProblem[]>([]);
  const [mySolutions, setMySolutions] = useState<UserSolution[]>([]);
  const [loadingContent, setLoadingContent] = useState(false);

  // Accordion for expanded problem solutions
  const [expandedProblemId, setExpandedProblemId] = useState<string | null>(null);

  // Solution review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedSolutionId, setSelectedSolutionId] = useState<string | null>(null);
  const [selectedSolutionData, setSelectedSolutionData] = useState<any>(null);
  const [isViewingAsOwner, setIsViewingAsOwner] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchUserContent();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/v1/auth/me");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setUserData(json.data);
          setEditForm({
            firstName: json.data.profile.firstName || "",
            lastName: json.data.profile.lastName || "",
            bio: json.data.profile.bio || "",
            region: json.data.profile.region || "Farg'ona",
            occupation: json.data.profile.occupation || "",
            organizationName: json.data.profile.organizationName || "",
            website: json.data.profile.website || "",
            skills: json.data.profile.skills || [],
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserContent = async () => {
    setLoadingContent(true);
    try {
      const [probRes, solRes] = await Promise.all([
        fetch("/api/v1/problems/my"),
        fetch("/api/v1/solutions"),
      ]);

      if (probRes.ok) {
        const pJson = await probRes.json();
        if (pJson.success) {
          setMyProblems(pJson.data || []);
        }
      }

      if (solRes.ok) {
        const sJson = await solRes.json();
        if (sJson.success) {
          setMySolutions(sJson.data || []);
        }
      }
    } catch (err) {
      console.error("Foydalanuvchi ma'lumotlarini yuklashda xatolik:", err);
    } finally {
      setLoadingContent(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateMsg(null);

    try {
      const res = await fetch("/api/v1/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Profilni yangilashda xatolik");
      }

      setUpdateMsg("Profil muvaffaqiyatli yangilandi!");
      setIsEditing(false);
      fetchProfile();
    } catch (err: any) {
      setUpdateMsg(err.message);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !editForm.skills.includes(newSkill.trim())) {
      setEditForm({ ...editForm, skills: [...editForm.skills, newSkill.trim()] });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setEditForm({
      ...editForm,
      skills: editForm.skills.filter((s) => s !== skillToRemove),
    });
  };

  const openSolutionReview = (solution: any, isOwner: boolean) => {
    setSelectedSolutionId(solution.id);
    setSelectedSolutionData(solution);
    setIsViewingAsOwner(isOwner);
    setReviewModalOpen(true);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("uz-UZ").format(val);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Profil ma'lumotlari yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-base font-bold text-slate-700">Tizimga kirmagansiz</p>
        <Link href="/login" className="bg-blue-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow">
          Kirish sahifasiga o'tish
        </Link>
      </div>
    );
  }

  const { profile, roles, email, isVerified } = userData;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-28 bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700" />

        <div className="relative pt-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-xl ring-4 ring-white flex-shrink-0">
              <div className="w-full h-full rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white text-3xl font-black flex items-center justify-center">
                {profile.firstName ? profile.firstName[0] : "U"}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">
                  {profile.firstName} {profile.lastName}
                </h1>
                {isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Tasdiqlangan
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                @{profile.username} • {email} {profile.occupation ? `• ${profile.occupation}` : ""}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {roles.map((role) => (
                  <span
                    key={role}
                    className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-md font-bold"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/problems/create"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow transition"
            >
              <Plus className="w-4 h-4" /> Yangi muammo
            </Link>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow transition"
            >
              <Edit3 className="w-4 h-4" /> {isEditing ? "Yopish" : "Tahrirlash"}
            </button>
          </div>
        </div>
      </div>

      {updateMsg && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl text-xs font-semibold">
          {updateMsg}
        </div>
      )}

      {/* EDIT FORM (If toggled) */}
      {isEditing && (
        <form onSubmit={handleUpdateProfile} className="bg-white p-6 rounded-2xl border border-blue-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Profil ma'lumotlarini tahrirlash</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ism</label>
              <input
                type="text"
                value={editForm.firstName}
                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Familiya</label>
              <input
                type="text"
                value={editForm.lastName}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kasb / Lavozim</label>
              <input
                type="text"
                placeholder="Masalan: Agrotexnik muhandis"
                value={editForm.occupation}
                onChange={(e) => setEditForm({ ...editForm, occupation: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tashkilot nomi</label>
              <input
                type="text"
                placeholder="Masalan: Farg'ona MCHJ"
                value={editForm.organizationName}
                onChange={(e) => setEditForm({ ...editForm, organizationName: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bio / Qisqacha ma'lumot</label>
            <textarea
              rows={3}
              placeholder="O'zingiz va tajribangiz haqida yozing..."
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-sm"
            />
          </div>

          {/* Skill editing */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ko'nikmalar (Skills)</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Yangi skill qo'shish (masalan: Python, IoT)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-grow px-3 py-2 border rounded-xl text-sm"
              />
              <button
                type="button"
                onClick={addSkill}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Qo'shish
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {editForm.skills.map((s) => (
                <span key={s} className="bg-slate-100 border border-slate-300 text-slate-800 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold">
                  {s}
                  <button type="button" onClick={() => removeSkill(s)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl border text-xs font-bold text-slate-600"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-bold shadow"
            >
              Saqlash
            </button>
          </div>
        </form>
      )}

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap items-center border-b border-slate-200 gap-2 sm:gap-6 bg-slate-100/60 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab("problems")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === "problems"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FolderPlus className="w-4 h-4 text-blue-600" />
          Mening Muammolarim
          <span className="bg-blue-100 text-blue-800 text-[11px] font-black px-2 py-0.5 rounded-full">
            {myProblems.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("solutions")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === "solutions"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sparkles className="w-4 h-4 text-sky-500" />
          Mening Yechimlarim
          <span className="bg-sky-100 text-sky-800 text-[11px] font-black px-2 py-0.5 rounded-full">
            {mySolutions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("info")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === "info"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <User className="w-4 h-4 text-slate-500" />
          Profil & Natijadorlik
        </button>
      </div>

      {/* TAB 1: MENING MUAMMOLARIM */}
      {activeTab === "problems" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Kiritilgan Muammolarim</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Siz platformaga joylashtirgan muammolar va ularga kelib tushgan yechimlar ro'yxati.
              </p>
            </div>

            <Link
              href="/dashboard/problems/create"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition"
            >
              <Plus className="w-4 h-4" /> Yangi muammo qo'shish
            </Link>
          </div>

          {loadingContent ? (
            <div className="py-16 text-center text-xs font-semibold text-slate-400">
              Muammolar yuklanmoqda...
            </div>
          ) : myProblems.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                <FolderPlus className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Siz hali birorta ham muammo joylashtirmagansiz</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Korxona yoki sohangizdagi dolzarb muammoni e'lon qiling va yetuk mutaxassislar hamda startaplardan innovatsion yechimlar oling.
              </p>
              <Link
                href="/dashboard/problems/create"
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow"
              >
                Muammo qo'shish
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myProblems.map((prob) => {
                const solutions = prob.challenge?.solutions || [];
                const isExpanded = expandedProblemId === prob.id;

                return (
                  <div
                    key={prob.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition"
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {prob.category && (
                            <span className="text-[11px] bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-md border border-blue-200">
                              {prob.category.nameUz}
                            </span>
                          )}
                          <span className="text-[11px] bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded-md">
                            {prob.region}
                          </span>
                          <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-md">
                            Status: {prob.status}
                          </span>
                        </div>

                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(prob.createdAt).toLocaleDateString("uz-UZ")}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <Link href={`/problems/${prob.id}`}>
                          <h3 className="text-lg font-bold text-slate-900 hover:text-blue-600 transition">
                            {prob.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {prob.rawDescription}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-6">
                          {prob.budget > 0 && (
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400">Ajratilgan Byudjet</span>
                              <p className="text-sm font-black text-slate-900">
                                {formatCurrency(prob.budget)} {prob.currency}
                              </p>
                            </div>
                          )}

                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400">Kelib tushgan yechimlar</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-sm font-black text-blue-600">
                                {solutions.length} ta yechim
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <Link
                            href={`/problems/${prob.id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition"
                          >
                            <Eye className="w-3.5 h-3.5" /> Tafsilot
                          </Link>

                          <button
                            type="button"
                            onClick={() => setExpandedProblemId(isExpanded ? null : prob.id)}
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition ${
                              solutions.length > 0
                                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            }`}
                            disabled={solutions.length === 0}
                          >
                            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                            {isExpanded ? "Yechimlarni berkitish" : `Yechimlarni ko'rish (${solutions.length})`}
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* EXPANDED SECTION: RECEIVED SOLUTIONS & AI REVIEW */}
                    {isExpanded && (
                      <div className="bg-slate-50/80 p-6 border-t border-slate-200 space-y-4 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            Kelib Tushgan Yechimlar va Mutaxassislar
                          </h4>
                          <span className="text-[11px] text-slate-500">
                            Har bir yechimni AI yordamida to'liq tekshirib ko'rishingiz mumkin
                          </span>
                        </div>

                        <div className="space-y-3">
                          {solutions.map((sol) => {
                            const solverProfile = sol.solver?.profile;

                            return (
                              <div
                                key={sol.id}
                                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                              >
                                <div className="space-y-2 max-w-xl">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                      Status: {sol.status}
                                    </span>
                                    {sol.scoreAvg > 0 && (
                                      <span className="text-[11px] font-bold text-amber-500 flex items-center gap-0.5">
                                        <Star className="w-3 h-3 fill-amber-500" /> {sol.scoreAvg}
                                      </span>
                                    )}
                                  </div>

                                  <h5 className="text-sm font-bold text-slate-900">{sol.title}</h5>
                                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                    {sol.description}
                                  </p>

                                  {solverProfile && (
                                    <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                                      <span className="font-semibold text-slate-800">
                                        Muallif: {solverProfile.firstName} {solverProfile.lastName}
                                      </span>
                                      {solverProfile.occupation && (
                                        <span>({solverProfile.occupation})</span>
                                      )}
                                      <span className="text-amber-500 font-bold">
                                        ★ {solverProfile.ratingAvg || "5.0"}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                  <div className="text-left sm:text-right">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Xarajat / Muddat</span>
                                    <p className="text-xs font-black text-slate-900">
                                      {formatCurrency(sol.estimatedCost)} UZS
                                    </p>
                                    <p className="text-[10px] text-slate-500">{sol.estimatedDays} kun</p>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => openSolutionReview(sol, true)}
                                    className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5"
                                  >
                                    <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                                    AI Tavsiyasi & To'liq Yechim
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MENING YECHIMLARIM */}
      {activeTab === "solutions" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Mening Yechim Takliflarim</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Siz turli muammolarga yuborgan yechimlaringiz, ekspert baholari va AI tahlili.
              </p>
            </div>

            <Link
              href="/problems"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition"
            >
              Yangi muammo topish <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingContent ? (
            <div className="py-16 text-center text-xs font-semibold text-slate-400">
              Yechimlar yuklanmoqda...
            </div>
          ) : mySolutions.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Siz hali birorta ham yechim yubormagansiz</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Marketplace'dagi dolzarb muammolar bilan tanishib chiqing va o'z texnologik yechimingizni taklif qilib, pilot loyihalarda ishtirok eting.
              </p>
              <Link
                href="/problems"
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow"
              >
                Muammolarni ko'rish
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {mySolutions.map((sol) => (
                <div
                  key={sol.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded">
                        Status: {sol.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(sol.createdAt).toLocaleDateString("uz-UZ")}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{sol.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{sol.description}</p>
                    
                    {sol.challenge?.problem && (
                      <p className="text-xs text-slate-500 font-semibold">
                        Bog'langan Muammo:{" "}
                        <Link
                          href={`/problems/${sol.challenge.problem.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {sol.challenge.problem.title}
                        </Link>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Ekspert Balli</span>
                      <div className="text-lg font-black text-amber-500 flex items-center sm:justify-end gap-1">
                        <Star className="w-4 h-4 fill-amber-500" /> {sol.scoreAvg || "—"}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {sol.reviews?.length || 0} ta baho
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Narx / Muddat</span>
                      <p className="text-sm font-black text-slate-900">{formatCurrency(sol.estimatedCost)} UZS</p>
                      <p className="text-[10px] text-slate-400">{sol.estimatedDays} kun</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => openSolutionReview(sol, false)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                      To'liq Yechim & AI Tahlili
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROFIL & NATIJADORLIK */}
      {activeTab === "info" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats Column */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Natijadorlik Statistikasi</h3>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-slate-700">Reyting</span>
              </div>
              <span className="text-sm font-black text-slate-900">{profile.ratingAvg} / 5.0</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-bold text-slate-700">Hal qilingan muammolar</span>
              </div>
              <span className="text-sm font-black text-slate-900">{profile.solvedCount} ta</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <FolderPlus className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-bold text-slate-700">Joylashtirilgan muammolar</span>
              </div>
              <span className="text-sm font-black text-slate-900">{myProblems.length} ta</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-sky-500" />
                <span className="text-xs font-bold text-slate-700">Yuborilgan yechimlar</span>
              </div>
              <span className="text-sm font-black text-slate-900">{mySolutions.length} ta</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-slate-700">Hudud</span>
              </div>
              <span className="text-sm font-black text-slate-900">{profile.region}</span>
            </div>
          </div>

          {/* Bio and Skills Column */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Qisqacha ma'lumot (Bio)</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {profile.bio || "Qisqacha bio kiritilmagan. Profilni tahrirlash orqali kiriting."}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Ko'nikmalar va Texnologiyalar</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-lg text-xs font-bold"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">Ko'nikmalar qo'shilmagan</span>
                )}
              </div>
            </div>

            {profile.organizationName && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Tashkilot / Kompaniya</h3>
                <p className="text-sm font-semibold text-slate-900">{profile.organizationName}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SOLUTION REVIEW & AI EVALUATION MODAL */}
      <SolutionReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        solutionId={selectedSolutionId}
        initialSolutionData={selectedSolutionData}
        isProblemOwner={isViewingAsOwner}
        onStatusUpdated={() => {
          fetchUserContent();
        }}
      />
    </div>
  );
}
