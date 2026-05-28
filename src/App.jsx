import React, { useMemo, useState } from "react";

// Deploy-ready Vite version.
// Required installs: npm install lucide-react framer-motion
// Optional but recommended styling: Tailwind CSS

function Card({ className = "", children }) {
  return <div className={className}>{children}</div>;
}

function CardContent({ className = "", children }) {
  return <div className={className}>{children}</div>;
}

function Button({ className = "", variant = "default", size, children, ...props }) {
  const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-slate-950 text-white hover:bg-slate-800",
    outline: "border border-slate-200 bg-white hover:bg-slate-50",
    ghost: "hover:bg-slate-100",
  };
  const sizes = {
    icon: "h-10 w-10",
    default: "h-10 px-4 py-2",
  };
  return <button className={`${base} ${variants[variant] || variants.default} ${sizes[size || "default"]} ${className}`} {...props}>{children}</button>;
}

function Input({ className = "", ...props }) {
  return <input className={`flex h-10 w-full border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300 ${className}`} {...props} />;
}

function Textarea({ className = "", ...props }) {
  return <textarea className={`flex w-full border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300 ${className}`} {...props} />;
}

function Badge({ className = "", variant = "default", children }) {
  const variants = {
    default: "bg-slate-950 text-white",
    outline: "border border-slate-200 bg-white text-slate-700",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant] || variants.default} ${className}`}>{children}</span>;
}
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  MapPin,
  Pencil,
  Plus,
  Save,
  Settings,
  Sparkles,
  Trash2,
  Truck,
  Users,
  Warehouse,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

const TECHS = {
  Anthony: { mobile: true, shop: true, monday: false },
  Matt: { mobile: true, shop: true, monday: true },
  Ben: { mobile: false, shop: true, monday: true },
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const SIZES = ["Car", "SUV", "Truck/Large SUV"];
const LOCATIONS = ["Shop", "Mobile"];
const TIMES = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM"];

const DEFAULT_PACKAGE_TIMES = {
  "Luxury Refresh": { Car: [4.5, 5], SUV: [5.5, 6], "Truck/Large SUV": [6, 6.5] },
  "Signature Refresh": { Car: [3.5, 4], SUV: [4, 4.5], "Truck/Large SUV": [4.5, 4.75] },
  "Spring Special": { Car: [2, 3], SUV: [2, 3], "Truck/Large SUV": [3, 3] },
  "Interior Deep Clean & Reset": { Car: [4.5, 5], SUV: [5, 5.5], "Truck/Large SUV": [5.5, 6] },
  "Executive Interior": { Car: [2.5, 3], SUV: [3.5, 4], "Truck/Large SUV": [4.5, 5] },
  "Premium Interior": { Car: [2, 2.5], SUV: [2.5, 3], "Truck/Large SUV": [3.5, 4] },
  "Polish and Protect": { Car: [2.5, 3.5], SUV: [3.5, 4.5], "Truck/Large SUV": [4.5, 5.5] },
  "Wash and Seal": { Car: [1, 1.5], SUV: [1.5, 2], "Truck/Large SUV": [2.5, 3] },
  Maintenance: { Car: [1, 1], SUV: [1, 1], "Truck/Large SUV": [1, 1] },
};

const CONDITION_ADD_ONS = [
  { key: "petHair", label: "Pet Hair", defaultHours: 1.5 },
  { key: "kidsMess", label: "Kids Mess", defaultHours: 1 },
  { key: "stains", label: "Stains", defaultHours: 1 },
  { key: "heavyBuildup", label: "Heavy Buildup", defaultHours: 1 },
  { key: "neglected", label: "Neglected", defaultHours: 2 },
  { key: "bioConcern", label: "Bio/Extreme Concern", defaultHours: 2.5 },
];

const PET_HAIR_LEVELS = [
  { key: "light", label: "Light", hours: 1 / 3 },
  { key: "medium", label: "Medium", hours: 2 / 3 },
  { key: "heavy", label: "Heavy", hours: 1.5 },
];

const PHONE_ADD_ONS = [
  { key: "petHairRemoval", label: "Pet Hair Removal", hours: 1 },
  { key: "ozoneOdorRemoval", label: "Ozone Odor Removal", hours: 2 / 3 },
  { key: "seatStainExtraction", label: "Seat Stain Extraction", hours: 0.5 },
  { key: "carpetStainExtraction", label: "Carpet Stain Extraction", hours: 0.5 },
  { key: "quickExteriorWash", label: "Quick Exterior Wash", hours: 2 / 3 },
];

const EMPTY_JOB = {
  customer: "",
  vehicle: "",
  address: "",
  packagePrice: "",
  addOnPrice: "",
  pkg: "",
  size: "",
  addOns: {},
  phoneAddOns: {},
  location: "",
  time: "9:00 AM",
  tech: "",
  tech2: "",
  tech3: "",
  techCount: 1,
  mobileBuffer: 0.75,
  notes: "",
};

function displayTime(job) {
  return job.time || "9:00 AM";
}

function timeToHour(time) {
  const match = String(time).match(/^([0-9]{1,2}):(00|30) (AM|PM)$/);
  if (!match) return 9;
  let hour = Number(match[1]);
  const minutes = match[2] === "30" ? 0.5 : 0;
  if (match[3] === "PM" && hour !== 12) hour += 12;
  if (match[3] === "AM" && hour === 12) hour = 0;
  return hour + minutes;
}

function hourToTime(hour) {
  const clamped = Math.min(17, Math.ceil(Number(hour || 9) * 2) / 2);
  const wholeHour = Math.floor(clamped);
  const minutes = clamped % 1 === 0.5 ? "30" : "00";
  if (wholeHour === 12) return `12:${minutes} PM`;
  if (wholeHour > 12) return `${wholeHour - 12}:${minutes} PM`;
  return `${wholeHour}:${minutes} AM`;
}

function selectedConditionAddOns(addOns = {}) {
  return CONDITION_ADD_ONS.filter((item) => addOns[item.key]);
}

function selectedPhoneAddOns(phoneAddOns = {}) {
  return PHONE_ADD_ONS.filter((item) => phoneAddOns[item.key]);
}

function conditionAddOnHours(item, addOns = {}) {
  if (item.key === "petHair") {
    const level = PET_HAIR_LEVELS.find((option) => option.key === addOns.petHairLevel);
    return level ? level.hours : item.defaultHours;
  }
  return item.defaultHours;
}

function conditionBuffer(addOns = {}) {
  return selectedConditionAddOns(addOns).reduce((sum, item) => sum + conditionAddOnHours(item, addOns), 0);
}

function phoneAddOnBuffer(phoneAddOns = {}) {
  return selectedPhoneAddOns(phoneAddOns).reduce((sum, item) => sum + item.hours, 0);
}

function addOnLabels(addOns = {}) {
  const labels = selectedConditionAddOns(addOns).map((item) => {
    if (item.key === "petHair") {
      const level = PET_HAIR_LEVELS.find((option) => option.key === addOns.petHairLevel);
      return `Pet Hair${level ? ` (${level.label})` : ""}`;
    }
    return item.label;
  });
  return labels.length ? labels.join(", ") : "Average condition";
}

function phoneAddOnLabels(phoneAddOns = {}) {
  const labels = selectedPhoneAddOns(phoneAddOns).map((item) => item.label);
  return labels.length ? labels.join(", ") : "No sellable add-ons";
}

function combinedAddOnLabels(addOns = {}, phoneAddOns = {}) {
  const labels = [];
  const condition = addOnLabels(addOns);
  const phone = phoneAddOnLabels(phoneAddOns);
  if (condition !== "Average condition") labels.push(condition);
  if (phone !== "No sellable add-ons") labels.push(phone);
  return labels.length ? labels.join(", ") : "No condition issues or add-ons";
}

function shouldScheduleEarly(pkg, size, addOns, location) {
  if (selectedConditionAddOns(addOns).length > 0) return true;
  if (["Luxury Refresh", "Interior Deep Clean & Reset"].includes(pkg)) return true;
  if (pkg === "Signature Refresh" && size === "Truck/Large SUV") return true;
  if (pkg === "Executive Interior" && size === "Truck/Large SUV") return true;
  if (pkg === "Polish and Protect" && size === "Truck/Large SUV") return true;
  if (location === "Mobile" && ["Luxury Refresh", "Signature Refresh", "Interior Deep Clean & Reset"].includes(pkg)) return true;
  return false;
}

function getCapacity(day, mobileHeavy) {
  if (day === "Monday") return { safe: 13, warning: 11, label: "Monday capacity" };
  if (mobileHeavy) return { safe: 17, warning: 15, label: "Heavy mobile capacity" };
  return { safe: 20, warning: 18, label: "Normal capacity" };
}

function calculateJob(job, packageTimes) {
  const range = packageTimes[job.pkg]?.[job.size] || [0, 0];
  const avg = (Number(range[0]) + Number(range[1])) / 2;
  const buffer = conditionBuffer(job.addOns) + phoneAddOnBuffer(job.phoneAddOns) + (job.location === "Mobile" ? Number(job.mobileBuffer || 0.75) : 0);
  const totalLabor = avg + buffer;
  const techCount = Number(job.techCount || 1);
  const clockTime = Math.max(1, totalLabor / techCount + (techCount > 1 ? 0.25 : 0));
  const scheduleEarly = shouldScheduleEarly(job.pkg, job.size, job.addOns, job.location);
  const needsTwoTechs = totalLabor >= 5 || ["Luxury Refresh", "Interior Deep Clean & Reset"].includes(job.pkg) || selectedConditionAddOns(job.addOns).length > 0;
  const revenue = Number(job.packagePrice || 0) + Number(job.addOnPrice || 0);
  return { range, avg, buffer, totalLabor, techCount, clockTime, scheduleEarly, needsTwoTechs, revenue };
}

function fmt(num) {
  const value = Number(num || 0);
  return value.toFixed(value % 1 === 0 ? 0 : 1);
}

function fmtMinutes(hours) {
  const total = Math.round(Number(hours || 0) * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

function clonePackageTimes(times) {
  return JSON.parse(JSON.stringify(times));
}

function getQualifiedTechNames(job, day) {
  return Object.entries(TECHS)
    .filter(([name, info]) => {
      if (day === "Monday" && !info.monday) return false;
      if (job.location === "Mobile" && !info.mobile) return false;
      if (job.location === "Shop" && !info.shop) return false;
      return true;
    })
    .map(([name]) => name);
}

function getEstimatedAssignedTechs(job, day) {
  const techCount = Math.max(1, Number(job.techCount || 1));
  const selected = [job.tech, job.tech2, job.tech3].filter(Boolean).slice(0, techCount);
  const qualified = getQualifiedTechNames(job, day).filter((name) => !selected.includes(name));
  return [...selected, ...qualified].slice(0, techCount);
}

function money(num) {
  return `$${Number(num || 0).toFixed(2)}`;
}

function getJobTimeRange(job, packageTimes) {
  const start = timeToHour(displayTime(job));
  const end = start + calculateJob(job, packageTimes).clockTime;
  return { start, end };
}

function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

function getBusyTechsDuringJob(job, day, jobsOnDay, packageTimes) {
  const testRange = getJobTimeRange(job, packageTimes);
  const busy = new Set();

  jobsOnDay.forEach((existing) => {
    if (existing.id === job.id) return;
    const existingRange = getJobTimeRange(existing, packageTimes);
    if (!rangesOverlap(testRange.start, testRange.end, existingRange.start, existingRange.end)) return;
    getEstimatedAssignedTechs(existing, day).forEach((name) => busy.add(name));
  });

  return Array.from(busy);
}

function getAvailableTechsForJob(job, day, jobsOnDay, packageTimes) {
  const busyTechs = getBusyTechsDuringJob(job, day, jobsOnDay, packageTimes);
  return Object.entries(TECHS)
    .filter(([name, info]) => {
      if (day === "Monday" && !info.monday) return false;
      if (job.location === "Mobile" && !info.mobile) return false;
      if (job.location === "Shop" && !info.shop) return false;
      return !busyTechs.includes(name);
    })
    .map(([name]) => name);
}

function evaluateSlot({ day, time, job, jobs, packageTimes, preferredTech }) {
  const jobsOnDay = jobs.filter((j) => j.day === day);
  const testJobForAvailability = { ...job, day, time, techCount: 1 };
  const availableTechs = getAvailableTechsForJob(testJobForAvailability, day, jobsOnDay, packageTimes);
  const calcPreview = calculateJob({ ...job, techCount: 1 }, packageTimes);
  const techOptions = availableTechs.map((techName) => {
    const testJob = { ...job, day, time, tech: techName, tech2: "", tech3: "", techCount: 1, id: "test" };
    const dayJobs = [...jobsOnDay, testJob].map((j) => ({ ...j, calc: calculateJob(j, packageTimes) }));
    const calc = calculateJob(testJob, packageTimes);
    const mobileHeavy = dayJobs.some((j) => j.location === "Mobile" && j.calc.totalLabor >= 4.5);
    const capacity = getCapacity(day, mobileHeavy);
    const totalLabor = dayJobs.reduce((sum, j) => sum + j.calc.totalLabor, 0);
    const shopJobsAtTime = dayJobs.filter((j) => j.location === "Shop" && displayTime(j) === time).length;
    const mobileJobsAtTime = dayJobs.filter((j) => j.location === "Mobile" && displayTime(j) === time).length;
    const finishHour = timeToHour(time) + calc.clockTime;
    const issues = [];

    if (day === "Monday" && techName === "Anthony") issues.push("Anthony is off Monday.");
    if (testJob.location === "Mobile" && techName === "Ben") issues.push("Ben is shop only.");
    if (calc.scheduleEarly && timeToHour(time) > 10) issues.push("This job should be scheduled early in the day.");
    if (testJob.location === "Shop" && shopJobsAtTime > 2) issues.push("Shop bays are full at this time.");
    if (testJob.location === "Mobile" && mobileJobsAtTime > 1) issues.push("A mobile job is already scheduled at this time.");
    if (totalLabor > capacity.safe) issues.push("This day would go over safe labor capacity.");
    if (finishHour > 17) issues.push("This job may push past 5:00 PM.");

    let score = 100;
    score -= issues.length * 60;
    score -= Math.max(0, totalLabor - capacity.warning) * 4;
    score -= Math.max(0, finishHour - 16.75) * 12;
    score -= timeToHour(time) * 0.4;
    if (calc.scheduleEarly && time === "9:00 AM") score += 20;
    if (!calc.scheduleEarly && timeToHour(time) >= 12 && calc.clockTime <= 3) score += 8;
    if (day === "Monday") score -= 5;
    if (techName === preferredTech) score += 4;

    return { techName, day, time, totalLabor, capacity, issues, score, calc, recommendedTech: techName, finishHour };
  });

  if (!techOptions.length) {
    const testJob = { ...job, day, time, tech: preferredTech || "Unassigned", tech2: "", tech3: "", techCount: 1, id: "test" };
    const calc = calculateJob(testJob, packageTimes);
    const dayJobs = [...jobsOnDay, testJob].map((j) => ({ ...j, calc: calculateJob(j, packageTimes) }));
    const mobileHeavy = dayJobs.some((j) => j.location === "Mobile" && j.calc.totalLabor >= 4.5);
    const capacity = getCapacity(day, mobileHeavy);
    const totalLabor = dayJobs.reduce((sum, j) => sum + j.calc.totalLabor, 0);
    return { day, time, totalLabor, capacity, issues: ["No available qualified technician at this time."], score: -999, calc, recommendedTech: "", finishHour: timeToHour(time) + calc.clockTime };
  }

  return techOptions.sort((a, b) => b.score - a.score)[0];
}

function findRecommendation(form, jobs, packageTimes) {
  const calc = calculateJob(form, packageTimes);
  const allowedTimes = calc.scheduleEarly ? ["9:00 AM", "9:30 AM", "10:00 AM"] : TIMES;
  const candidates = [];

  DAYS.forEach((day) => {
    allowedTimes.forEach((time) => {
      candidates.push(evaluateSlot({ day, time, job: form, jobs, packageTimes, preferredTech: form.tech }));
    });
  });

  const safe = candidates.filter((candidate) => candidate.issues.length === 0).sort((a, b) => b.score - a.score);
  const backup = candidates.sort((a, b) => b.score - a.score);
  return safe[0] || backup[0] || null;
}

function runSelfTests() {
  const mediumPetHair = conditionBuffer({ petHair: true, petHairLevel: "medium" });
  console.assert(Math.round(mediumPetHair * 60) === 40, "Medium pet hair should add 40 minutes");

  const quickWash = phoneAddOnBuffer({ quickExteriorWash: true });
  console.assert(Math.round(quickWash * 60) === 40, "Quick Exterior Wash should add 40 minutes");

  const maintenance = calculateJob({ ...EMPTY_JOB, pkg: "Maintenance", size: "SUV", location: "Shop" }, DEFAULT_PACKAGE_TIMES);
  console.assert(maintenance.totalLabor === 1, "Maintenance should take 1 hour");

  const mondayTechs = getAvailableTechsForJob({ ...EMPTY_JOB, location: "Mobile", pkg: "Maintenance", size: "SUV" }, "Monday", [], DEFAULT_PACKAGE_TIMES);
  console.assert(!mondayTechs.includes("Anthony") && !mondayTechs.includes("Ben") && mondayTechs.includes("Matt"), "Monday mobile availability should only include Matt");

  console.assert(timeToHour("9:30 AM") === 9.5, "9:30 AM should parse to 9.5");
  console.assert(hourToTime(13.5) === "1:30 PM", "13.5 should format to 1:30 PM");


  const overlapTestJobs = [
    { ...EMPTY_JOB, id: 1, day: "Tuesday", tech: "Ben", techCount: 1, location: "Shop", time: "9:00 AM", pkg: "Signature Refresh", size: "SUV" },
  ];
  const overlappingJob = { ...EMPTY_JOB, id: 2, day: "Tuesday", location: "Shop", time: "9:30 AM", pkg: "Maintenance", size: "SUV", techCount: 1 };
  console.assert(!getAvailableTechsForJob(overlappingJob, "Tuesday", overlapTestJobs, DEFAULT_PACKAGE_TIMES).includes("Ben"), "Ben should not be available for a 9:30 job when his 9:00 job overlaps");
}

if (typeof window !== "undefined") {
  runSelfTests();
}

function FieldError({ message }) {
  if (!message) return null;
  return <div className="text-xs font-medium text-rose-600">{message}</div>;
}

function SelectPlaceholder({ children }) {
  return (
    <option value="" disabled>
      {children}
    </option>
  );
}

function loadSavedState(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function saveState(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local storage may be unavailable in private browsing or restricted environments.
  }
}

export default function RefreshSchedulingApp() {
  const [selectedDay, setSelectedDay] = useState(() => loadSavedState("rmr-selected-day", "Tuesday"));
  const [packageTimes, setPackageTimes] = useState(() => loadSavedState("rmr-package-times", DEFAULT_PACKAGE_TIMES));
  const [packageEditorOpen, setPackageEditorOpen] = useState(false);
  const [packageDraft, setPackageDraft] = useState(() => clonePackageTimes(loadSavedState("rmr-package-times", DEFAULT_PACKAGE_TIMES)));
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [expectedConditionOpen, setExpectedConditionOpen] = useState(false);
  const [addOnOpen, setAddOnOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const packages = Object.keys(packageTimes);

  const [jobs, setJobs] = useState(() => loadSavedState("rmr-jobs", [
    {
      id: 1,
      day: "Tuesday",
      customer: "Example Job",
      vehicle: "2022 Ford Explorer",
      address: "",
      packagePrice: "299.99",
      addOnPrice: "0",
      pkg: "Signature Refresh",
      size: "SUV",
      addOns: {},
      phoneAddOns: {},
      location: "Shop",
      time: "9:00 AM",
      tech: "Ben",
      tech2: "",
      tech3: "",
      techCount: 1,
      mobileBuffer: 0.75,
      notes: "Example note: customer wants pickup by 4:30.",
    },
  ]));
  const [form, setForm] = useState(EMPTY_JOB);

  React.useEffect(() => {
    saveState("rmr-jobs", jobs);
  }, [jobs]);

  React.useEffect(() => {
    saveState("rmr-package-times", packageTimes);
  }, [packageTimes]);

  React.useEffect(() => {
    saveState("rmr-selected-day", selectedDay);
  }, [selectedDay]);

  const visibleJobs = useMemo(() => jobs.filter((j) => j.day === selectedDay), [jobs, selectedDay]);
  const calced = useMemo(() => visibleJobs.map((j) => ({ ...j, calc: calculateJob(j, packageTimes) })), [visibleJobs, packageTimes]);
  const mobileHeavy = calced.some((j) => j.location === "Mobile" && j.calc.totalLabor >= 4.5);
  const capacity = getCapacity(selectedDay, mobileHeavy);
  const totalLabor = calced.reduce((sum, j) => sum + j.calc.totalLabor, 0);
  const totalRevenue = calced.reduce((sum, j) => sum + j.calc.revenue, 0);
  const mobileJobs = calced.filter((j) => j.location === "Mobile").length;
  const shopJobsAtNine = calced.filter((j) => j.location === "Shop" && displayTime(j) === "9:00 AM").length;
  const formCalc = calculateJob(form, packageTimes);
  const canRecommend = Boolean(form.pkg && form.size && form.location);
  const recommendation = useMemo(
    () => (canRecommend ? findRecommendation(form, jobs.filter((j) => j.id !== editingJobId), packageTimes) : null),
    [canRecommend, form, jobs, packageTimes, editingJobId]
  );

  function updateForm(patch) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  function toggleConditionAddOn(key) {
    setForm((prev) => {
      const nextValue = !prev.addOns?.[key];
      const updated = { ...prev.addOns, [key]: nextValue };
      if (key === "petHair" && nextValue && !updated.petHairLevel) updated.petHairLevel = "medium";
      if (key === "petHair" && !nextValue) delete updated.petHairLevel;
      return { ...prev, addOns: updated };
    });
  }

  function setPetHairLevel(level) {
    setForm((prev) => ({ ...prev, addOns: { ...prev.addOns, petHair: true, petHairLevel: level } }));
  }

  function togglePhoneAddOn(key) {
    setForm((prev) => ({ ...prev, phoneAddOns: { ...prev.phoneAddOns, [key]: !prev.phoneAddOns?.[key] } }));
  }

  function useRecommendedSlot() {
    if (!recommendation) return;
    setSelectedDay(recommendation.day);
    updateForm({ time: recommendation.time, tech: recommendation.recommendedTech, techCount: 1, tech2: "", tech3: "" });
  }

  function handleTechCountChange(value) {
    const techCount = Number(value);
    setForm((prev) => ({
      ...prev,
      techCount,
      tech2: techCount >= 2 ? prev.tech2 : "",
      tech3: techCount >= 3 ? prev.tech3 : "",
    }));
  }

  function clearSavedSchedule() {
    const confirmed = window.confirm("Clear all saved jobs from this browser? This cannot be undone.");
    if (!confirmed) return;
    setJobs([]);
    resetForm();
  }

  function resetForm() {
    setForm(EMPTY_JOB);
    setEditingJobId(null);
    setExpectedConditionOpen(false);
    setAddOnOpen(false);
    setFormErrors({});
  }

  function validateForm() {
    const errors = {};
    if (!form.customer.trim()) errors.customer = "Customer name is required.";
    if (!form.vehicle.trim()) errors.vehicle = "Vehicle is required.";
    if (!form.pkg) errors.pkg = "Package is required.";
    if (!form.size) errors.size = "Vehicle size is required.";
    if (!form.location) errors.location = "Location is required.";
    if (!form.tech) errors.tech = "Lead tech is required.";
    if (Number(form.techCount) >= 2 && !form.tech2) errors.tech2 = "Second tech is required.";
    if (Number(form.techCount) >= 3 && !form.tech3) errors.tech3 = "Third tech is required.";
    if (!form.notes.trim()) errors.notes = "Notes are required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function saveJob() {
    if (!validateForm()) return;

    if (editingJobId) {
      setJobs((prev) =>
        prev.map((job) =>
          job.id === editingJobId
            ? {
                ...form,
                addOns: { ...form.addOns },
                phoneAddOns: { ...form.phoneAddOns },
                id: editingJobId,
                day: selectedDay,
              }
            : job
        )
      );
      resetForm();
      return;
    }

    setJobs((prev) => [
      ...prev,
      {
        ...form,
        addOns: { ...form.addOns },
        phoneAddOns: { ...form.phoneAddOns },
        id: Date.now(),
        day: selectedDay,
      },
    ]);
    resetForm();
  }

  function editJob(job) {
    setSelectedDay(job.day);
    setEditingJobId(job.id);
    setForm({ ...EMPTY_JOB, ...job, addOns: { ...job.addOns }, phoneAddOns: { ...job.phoneAddOns } });
    setFormErrors({});
  }

  function removeJob(id) {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    if (editingJobId === id) resetForm();
    setConfirmDelete(null);
  }

  function openPackageEditor() {
    setPackageDraft(clonePackageTimes(packageTimes));
    setPackageEditorOpen(true);
  }

  function savePackageEditor() {
    setPackageTimes(clonePackageTimes(packageDraft));
    const draftPackages = Object.keys(packageDraft);
    if (!draftPackages.includes(form.pkg)) updateForm({ pkg: "" });
    setPackageEditorOpen(false);
  }

  function updatePackageTime(pkg, size, index, value) {
    const cleanValue = value === "" ? "" : Number(value);
    setPackageDraft((prev) => ({
      ...prev,
      [pkg]: {
        ...prev[pkg],
        [size]: prev[pkg][size].map((current, i) => (i === index ? cleanValue : current)),
      },
    }));
  }

  function addPackage() {
    let baseName = "New Package";
    let name = baseName;
    let count = 2;
    while (packageDraft[name]) {
      name = `${baseName} ${count}`;
      count += 1;
    }
    setPackageDraft((prev) => ({
      ...prev,
      [name]: { Car: [1, 1.5], SUV: [1.5, 2], "Truck/Large SUV": [2, 3] },
    }));
  }

  function renamePackage(oldName, newName) {
    const cleanName = newName.trim();
    if (!cleanName || cleanName === oldName) return;
    setPackageDraft((prev) => {
      const updated = {};
      Object.entries(prev).forEach(([name, value]) => {
        updated[name === oldName ? cleanName : name] = value;
      });
      return updated;
    });
  }

  function deletePackage(pkg) {
    const keys = Object.keys(packageDraft);
    if (keys.length <= 1) return;
    setPackageDraft((prev) => {
      const updated = { ...prev };
      delete updated[pkg];
      return updated;
    });
    setConfirmDelete(null);
  }

  const warnings = [];
  if (totalLabor > capacity.safe) warnings.push(`This day is over safe capacity by ${fmt(totalLabor - capacity.safe)} labor hours.`);
  else if (totalLabor > capacity.warning) warnings.push("This day is close to full. Only add very light jobs or leave buffer.");
  if (selectedDay === "Monday" && calced.some((j) => j.tech === "Anthony")) warnings.push("Anthony is off on Mondays.");
  if (mobileJobs > 1) warnings.push("More than 1 mobile job is scheduled. Confirm routes before booking.");
  if (shopJobsAtNine > 2) warnings.push("More than 2 shop jobs are scheduled at 9:00 AM, but there are only 2 shop bays.");
  calced.forEach((j) => {
    if (j.calc.scheduleEarly && timeToHour(displayTime(j)) > 10) warnings.push(`${j.customer || j.pkg} should be scheduled early in the day.`);
    if (j.location === "Mobile" && j.tech === "Ben") warnings.push(`${j.customer || j.pkg} is mobile, but Ben is shop only.`);
  });

  const formPanel = (
    <Card className={editingJobId ? "fixed left-1/2 top-1/2 z-[80] max-h-[90vh] w-[min(95vw,720px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border-blue-200 shadow-2xl" : "rounded-2xl border-blue-100 shadow-sm lg:col-span-2"}>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-bold">{editingJobId ? "Edit Job" : "Add Job"}</h2>
          {editingJobId && (
            <Button variant="outline" onClick={resetForm} className="rounded-2xl">
              Cancel Edit
            </Button>
          )}
        </div>

        <div className="grid gap-3">
          <label className="text-sm font-medium">Customer Name</label>
          <Input value={form.customer} onChange={(e) => updateForm({ customer: e.target.value })} placeholder="Customer name" className={formErrors.customer ? "rounded-2xl border-rose-400" : "rounded-2xl"} />
          <FieldError message={formErrors.customer} />

          <label className="text-sm font-medium">Vehicle</label>
          <Input value={form.vehicle} onChange={(e) => updateForm({ vehicle: e.target.value })} placeholder="Year, make, model" className={formErrors.vehicle ? "rounded-2xl border-rose-400" : "rounded-2xl"} />
          <FieldError message={formErrors.vehicle} />

          <label className="text-sm font-medium">Package</label>
          <select className={formErrors.pkg ? "rounded-2xl border border-rose-400 bg-white p-2" : "rounded-2xl border bg-white p-2"} value={form.pkg} onChange={(e) => updateForm({ pkg: e.target.value })}>
            <SelectPlaceholder>Select package</SelectPlaceholder>
            {packages.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <FieldError message={formErrors.pkg} />

          <div className="space-y-2">
            <label className="text-sm font-medium">Package Total ($)</label>
            <Input type="number" min="0" step="0.01" value={form.packagePrice} onChange={(e) => updateForm({ packagePrice: e.target.value })} placeholder="Example: 449.99" className="rounded-2xl" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Vehicle Size</label>
              <select className={formErrors.size ? "w-full rounded-2xl border border-rose-400 bg-white p-2" : "w-full rounded-2xl border bg-white p-2"} value={form.size} onChange={(e) => updateForm({ size: e.target.value })}>
                <SelectPlaceholder>Select vehicle size</SelectPlaceholder>
                {SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <FieldError message={formErrors.size} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <select className={formErrors.location ? "w-full rounded-2xl border border-rose-400 bg-white p-2" : "w-full rounded-2xl border bg-white p-2"} value={form.location} onChange={(e) => updateForm({ location: e.target.value, address: e.target.value === "Mobile" ? form.address : "" })}>
                <SelectPlaceholder>Select location</SelectPlaceholder>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <FieldError message={formErrors.location} />
            </div>
          </div>

          {form.location === "Mobile" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Mobile Address</label>
              <Input value={form.address} onChange={(e) => updateForm({ address: e.target.value })} placeholder="Customer address for mobile job" className="rounded-2xl" />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-medium">Expected Condition</label>
              <span className="text-xs text-slate-500">Time extenders only</span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
              Use this for anything that may make the job take longer than an average-condition vehicle. These are not services sold by the rep.
            </div>
            <div className="relative">
              <Button type="button" variant="outline" onClick={() => setExpectedConditionOpen(!expectedConditionOpen)} className="w-full justify-between rounded-2xl">
                <span>{addOnLabels(form.addOns)}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              {expectedConditionOpen && (
                <div className="absolute z-20 mt-2 w-full rounded-2xl border bg-white p-2 shadow-lg">
                  {CONDITION_ADD_ONS.map((item) => {
                    const active = Boolean(form.addOns?.[item.key]);
                    const hours = conditionAddOnHours(item, form.addOns);
                    return (
                      <button key={item.key} type="button" onClick={() => toggleConditionAddOn(item.key)} className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-slate-100">
                        <span>{item.label}</span>
                        <span className="text-slate-500">+{fmtMinutes(hours)}</span>
                        <span className="ml-2 font-semibold">{active ? "✓" : ""}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            {form.addOns?.petHair && (
              <div className="rounded-2xl border bg-white p-3">
                <div className="mb-2 text-sm font-semibold text-slate-700">Pet Hair Level</div>
                <div className="grid grid-cols-3 gap-2">
                  {PET_HAIR_LEVELS.map((level) => (
                    <Button key={level.key} type="button" variant={form.addOns.petHairLevel === level.key ? "default" : "outline"} onClick={() => setPetHairLevel(level.key)} className="rounded-2xl">
                      {level.label} +{fmtMinutes(level.hours)}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-medium">Add-Ons</label>
              <span className="text-xs text-slate-500">Sold by rep</span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
              Select add-ons the rep sold over the phone. These always add time to the job.
            </div>
            <div className="relative">
              <Button type="button" variant="outline" onClick={() => setAddOnOpen(!addOnOpen)} className="w-full justify-between rounded-2xl">
                <span>{phoneAddOnLabels(form.phoneAddOns)}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              {addOnOpen && (
                <div className="absolute z-20 mt-2 w-full rounded-2xl border bg-white p-2 shadow-lg">
                  {PHONE_ADD_ONS.map((item) => (
                    <button key={item.key} type="button" onClick={() => togglePhoneAddOn(item.key)} className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-slate-100">
                      <span>{item.label}</span>
                      <span className="text-slate-500">+{fmtMinutes(item.hours)}</span>
                      <span className="ml-2 font-semibold">{form.phoneAddOns?.[item.key] ? "✓" : ""}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedPhoneAddOns(form.phoneAddOns).length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Add-on Total ($)</label>
                <Input type="number" min="0" step="0.01" value={form.addOnPrice} onChange={(e) => updateForm({ addOnPrice: e.target.value })} placeholder="Example: 75" className="rounded-2xl" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Requested Start Time</label>
              <select className="w-full rounded-2xl border bg-white p-2" value={form.time} onChange={(e) => updateForm({ time: e.target.value })}>
                {TIMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Lead Tech</label>
              <select className={formErrors.tech ? "w-full rounded-2xl border border-rose-400 bg-white p-2" : "w-full rounded-2xl border bg-white p-2"} value={form.tech} onChange={(e) => updateForm({ tech: e.target.value })}>
                <SelectPlaceholder>Select lead tech</SelectPlaceholder>
                {Object.keys(TECHS).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <FieldError message={formErrors.tech} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Technician Count</label>
              <select className="w-full rounded-2xl border bg-white p-2" value={form.techCount} onChange={(e) => handleTechCountChange(e.target.value)}>
                <option value={1}>1 Tech</option>
                <option value={2}>2 Techs</option>
                <option value={3}>3 Techs</option>
              </select>
            </div>

            {Number(form.techCount) >= 2 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Second Tech</label>
                <select className={formErrors.tech2 ? "w-full rounded-2xl border border-rose-400 bg-white p-2" : "w-full rounded-2xl border bg-white p-2"} value={form.tech2} onChange={(e) => updateForm({ tech2: e.target.value })}>
                  <SelectPlaceholder>Select second tech</SelectPlaceholder>
                  {Object.keys(TECHS).filter((t) => t !== form.tech && t !== form.tech3).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <FieldError message={formErrors.tech2} />
              </div>
            )}

            {Number(form.techCount) >= 3 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Third Tech</label>
                <select className={formErrors.tech3 ? "w-full rounded-2xl border border-rose-400 bg-white p-2" : "w-full rounded-2xl border bg-white p-2"} value={form.tech3} onChange={(e) => updateForm({ tech3: e.target.value })}>
                  <SelectPlaceholder>Select third tech</SelectPlaceholder>
                  {Object.keys(TECHS).filter((t) => t !== form.tech && t !== form.tech2).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <FieldError message={formErrors.tech3} />
              </div>
            )}

            {form.location === "Mobile" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Mobile Buffer</label>
                <select className="w-full rounded-2xl border bg-white p-2" value={form.mobileBuffer} onChange={(e) => updateForm({ mobileBuffer: Number(e.target.value) })}>
                  <option value={0.5}>0.5 hr</option>
                  <option value={0.75}>0.75 hr</option>
                  <option value={1}>1 hr</option>
                </select>
                <p className="text-xs leading-relaxed text-slate-500">
                  Mobile buffer is extra time added for drive time, setup, packing up, parking, water/electric access, and customer delays. It protects the schedule from running behind.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea value={form.notes} onChange={(e) => updateForm({ notes: e.target.value })} placeholder="Customer details, condition notes, deadline, pickup/drop-off info, gate code, etc." className={formErrors.notes ? "min-h-24 rounded-2xl border-rose-400" : "min-h-24 rounded-2xl"} />
            <FieldError message={formErrors.notes} />
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{formCalc.scheduleEarly ? "Schedule Early" : "Flexible Timing"}</Badge>
              {formCalc.needsTwoTechs && (
                <Badge variant="outline">
                  <Users className="mr-1 h-3 w-3" /> 2 Techs Suggested
                </Badge>
              )}
            </div>
            <div className="mt-3 text-sm text-slate-700">
              Revenue: <strong>{money(formCalc.revenue)}</strong>
              <br />

              Base time: {formCalc.range[0]} to {formCalc.range[1]} hr
              <br />
              Condition / add-ons: {combinedAddOnLabels(form.addOns, form.phoneAddOns)} {conditionBuffer(form.addOns) + phoneAddOnBuffer(form.phoneAddOns) > 0 ? `(+${fmtMinutes(conditionBuffer(form.addOns) + phoneAddOnBuffer(form.phoneAddOns))})` : ""}
              <br />
              Estimated labor: <strong>{fmt(formCalc.totalLabor)} hr</strong>
              <br />
              Estimated clock time with {formCalc.techCount} tech{formCalc.techCount > 1 ? "s" : ""}: <strong>{fmt(formCalc.clockTime)} hr</strong>
            </div>
          </div>

          {recommendation && (
            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
              <div className="flex items-center gap-2 font-bold text-violet-950">
                <Sparkles className="h-4 w-4" /> Recommended Slot
              </div>
              <div className="mt-2 text-sm text-violet-950">
                Best fit: <strong>{recommendation.day} at {recommendation.time}</strong>
                <br />
                {recommendation.recommendedTech ? <><strong>Recommended tech: {recommendation.recommendedTech}</strong><br /></> : <><strong>Recommended tech: No qualified tech available</strong><br /></>}
                Estimated finish: about {hourToTime(recommendation.finishHour)}
                <br />
                Projected day total: {fmt(recommendation.totalLabor)} / {recommendation.capacity.safe} labor hours
              </div>
              {recommendation.issues.length > 0 && (
                <div className="mt-2 text-xs text-violet-900">
                  No perfect slot found. Best available option has these warnings:
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {recommendation.issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              <Button variant="outline" onClick={useRecommendedSlot} className="mt-3 rounded-2xl border-violet-300 bg-white text-violet-950 hover:bg-violet-100">
                Use Recommended Day/Time/Tech
              </Button>
            </div>
          )}

          <Button onClick={saveJob} className="rounded-2xl">
            <Plus className="mr-2 h-4 w-4" /> {editingJobId ? "Save Job Changes" : `Add to ${selectedDay}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="sticky top-0 z-30 -mx-4 -mt-4 border-b bg-white/90 px-4 py-3 backdrop-blur md:-mx-8 md:-mt-8 md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="text-sm font-semibold text-slate-700">Scheduling App Controls</div>
            <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={clearSavedSchedule} className="rounded-2xl text-rose-700">
              Clear Saved Jobs
            </Button>
            <Button onClick={openPackageEditor} className="rounded-2xl">
              <Settings className="mr-2 h-4 w-4" /> Edit Package List
            </Button>
            </div>
          </div>
        </div>

        {confirmDelete && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/40 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-slate-950">Are you sure?</h3>
              <p className="mt-2 text-sm text-slate-600">
                This will delete <strong>{confirmDelete.name}</strong>. This cannot be undone.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setConfirmDelete(null)} className="rounded-2xl">
                  Cancel
                </Button>
                <Button onClick={() => (confirmDelete.type === "package" ? deletePackage(confirmDelete.name) : removeJob(confirmDelete.id))} className="rounded-2xl bg-rose-600 hover:bg-rose-700">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {packageEditorOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 p-4">
            <div className="mx-auto max-w-5xl rounded-3xl bg-white p-5 shadow-2xl">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-950">Edit Package List</h2>
                  <p className="text-sm text-slate-500">Update package names and estimated time ranges. These times power the scheduling calculator.</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={addPackage} className="rounded-2xl">
                    <Plus className="mr-2 h-4 w-4" /> Add Package
                  </Button>
                  <Button onClick={savePackageEditor} className="rounded-2xl">
                    <Save className="mr-2 h-4 w-4" /> Save
                  </Button>
                  <Button variant="ghost" onClick={() => setPackageEditorOpen(false)} className="rounded-2xl">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(packageDraft).map(([pkg, values]) => (
                  <div key={pkg} className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                    <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <Input defaultValue={pkg} onBlur={(e) => renamePackage(pkg, e.target.value)} className="max-w-md rounded-2xl bg-white font-semibold" />
                      <Button variant="ghost" onClick={() => setConfirmDelete({ type: "package", name: pkg })} className="rounded-2xl text-slate-500 hover:text-rose-600">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      {SIZES.map((size) => (
                        <div key={size} className="rounded-2xl bg-white p-3 shadow-sm">
                          <div className="mb-2 text-sm font-semibold text-slate-700">{size}</div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-xs text-slate-500">Min hrs</label>
                              <Input type="number" step="0.25" value={values[size][0]} onChange={(e) => updatePackageTime(pkg, size, 0, e.target.value)} className="rounded-xl" />
                            </div>
                            <div>
                              <label className="text-xs text-slate-500">Max hrs</label>
                              <Input type="number" step="0.25" value={values[size][1]} onChange={(e) => updatePackageTime(pkg, size, 1, e.target.value)} className="rounded-xl" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-medium text-slate-500">Refresh My Ride</div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">Scheduling Capacity Planner</h1>
            <p className="mt-2 max-w-3xl text-slate-600">Use this before booking a job in Urable. It estimates labor hours, recommends a day, time, and technician, checks shop/mobile limits, and warns when the day is overloaded.</p>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="rounded-2xl border-blue-200 bg-blue-50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-blue-700">
                <Clock className="h-4 w-4" /> Booked Labor
              </div>
              <div className="mt-2 text-3xl font-bold text-blue-950">{fmt(totalLabor)} hr</div>
              <div className="mt-1 text-sm text-blue-700">Safe max: {capacity.safe} hr</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-emerald-200 bg-emerald-50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-emerald-700">
                <CalendarDays className="h-4 w-4" /> Booked Revenue
              </div>
              <div className="mt-2 text-3xl font-bold text-emerald-950">{money(totalRevenue)}</div>
              <div className="mt-1 text-sm text-emerald-700">Package plus add-ons</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-violet-200 bg-violet-50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-violet-700">
                <Warehouse className="h-4 w-4" /> Shop Bays
              </div>
              <div className="mt-2 text-3xl font-bold text-violet-950">{shopJobsAtNine}/2</div>
              <div className="mt-1 text-sm text-violet-700">9:00 AM shop jobs</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-orange-200 bg-orange-50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-orange-700">
                <Truck className="h-4 w-4" /> Mobile Jobs
              </div>
              <div className="mt-2 text-3xl font-bold text-orange-950">{mobileJobs}</div>
              <div className="mt-1 text-sm text-orange-700">Jobs marked mobile</div>
            </CardContent>
          </Card>
        </div>

        {warnings.length > 0 ? (
          <Card className="rounded-2xl border-amber-200 bg-amber-50 shadow-sm">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center gap-2 font-semibold text-amber-900">
                <AlertTriangle className="h-5 w-5" /> Schedule Warnings
              </div>
              <div className="space-y-2 text-sm text-amber-900">
                {warnings.map((w, i) => (
                  <div key={i}>• {w}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-2xl border-emerald-200 bg-emerald-50 shadow-sm">
            <CardContent className="flex items-center gap-2 p-5 font-semibold text-emerald-900">
              <CheckCircle2 className="h-5 w-5" /> Schedule looks safe based on current rules.
            </CardContent>
          </Card>
        )}

        {editingJobId && <div className="fixed inset-0 z-[70] bg-slate-950/40 backdrop-blur-sm" onClick={resetForm} />}

        <div className="grid gap-6 lg:grid-cols-5">
          {formPanel}

          <Card className="rounded-2xl border-slate-200 shadow-sm lg:col-span-3">
            <CardContent className="p-5">
              <div className="mb-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <Button key={day} variant={selectedDay === day ? "default" : "outline"} onClick={() => setSelectedDay(day)} className={selectedDay === day ? "rounded-2xl bg-slate-950 text-white" : "rounded-2xl bg-white"}>
                      {day}
                    </Button>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">{selectedDay} Schedule</h2>
                  <Badge variant="outline" className="rounded-xl border-emerald-200 bg-emerald-50 text-emerald-800">
                    {fmt(capacity.safe - totalLabor)} hr remaining
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                {calced.length === 0 && <div className="rounded-2xl border border-dashed p-8 text-center text-slate-500">No jobs added for this day yet.</div>}
                {calced.map((job) => (
                  <motion.div key={job.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-lg font-bold">{job.customer || job.pkg}</div>
                          <Badge variant="outline">{displayTime(job)}</Badge>
                        </div>
                        {job.vehicle && <div className="text-sm font-medium text-slate-700">{job.vehicle}</div>}
                        {job.location === "Mobile" && job.address && (
                          <div className="flex items-center gap-1 text-sm text-slate-700">
                            <MapPin className="h-4 w-4" /> {job.address}
                          </div>
                        )}
                        <div className="text-sm text-slate-600">
                          {job.pkg} • {job.size} • {combinedAddOnLabels(job.addOns, job.phoneAddOns)} • {job.location}
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm text-slate-700">
                          <span className="rounded-full bg-slate-100 px-3 py-1">Techs: {getEstimatedAssignedTechs(job, selectedDay).join(", ") || job.tech}</span>
                          <span className="rounded-full bg-slate-100 px-3 py-1">
                            {job.calc.techCount} tech{job.calc.techCount > 1 ? "s" : ""}
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1">Labor: {fmt(job.calc.totalLabor)} hr</span>
                          <span className="rounded-full bg-slate-100 px-3 py-1">Clock: {fmt(job.calc.clockTime)} hr</span>
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-800">Revenue: {money(job.calc.revenue)}</span>
                        </div>
                        <div className="text-sm font-medium text-slate-700">
                          Recommendation: {job.calc.scheduleEarly ? "Schedule early in the day" : "Flexible timing if capacity allows"}
                          {job.calc.needsTwoTechs ? " • 2 techs suggested if schedule is tight" : ""}
                        </div>
                        {job.notes && (
                          <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                            <strong>Notes:</strong> {job.notes}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => editJob(job)} className="rounded-2xl text-slate-600">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setConfirmDelete({ type: "job", id: job.id, name: job.customer || job.pkg })} className="rounded-2xl text-slate-500 hover:text-rose-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
