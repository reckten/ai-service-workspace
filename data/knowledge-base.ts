export interface KnowledgeChunk {
  id: string;
  source: string;
  category: string;
  title: string;
  content: string;
  keywords: string[];
}

export const knowledgeBase: KnowledgeChunk[] = [
  // ── PROGRAMS ────────────────────────────────────────────────────────────────
  {
    id: "prog-001",
    source: "Academic Catalog 2025–2026",
    category: "Programs",
    title: "Bachelor of Science in Computer Information Systems (CIS)",
    content:
      "DeVry's Bachelor of Science in Computer Information Systems (CIS) prepares students for careers in IT management, systems analysis, and technology consulting. The program covers database management, networking fundamentals, software development, cybersecurity principles, and IT project management. Total credits: 122 semester hours. Typical completion time: 4 years full-time, accelerated options available for working professionals.",
    keywords: ["CIS", "computer information systems", "IT", "bachelor", "degree", "technology", "networking", "database"],
  },
  {
    id: "prog-002",
    source: "Academic Catalog 2025–2026",
    category: "Programs",
    title: "Bachelor of Science in Cybersecurity",
    content:
      "The Cybersecurity program equips students with skills in network defense, ethical hacking, digital forensics, risk management, and compliance frameworks (NIST, ISO 27001). Graduates are prepared for roles such as Security Analyst, SOC Analyst, and Information Security Manager. The program aligns with CompTIA Security+ and CEH certification objectives. Total credits: 122 semester hours. Available fully online.",
    keywords: ["cybersecurity", "security", "hacking", "forensics", "NIST", "CompTIA", "SOC", "online"],
  },
  {
    id: "prog-003",
    source: "Academic Catalog 2025–2026",
    category: "Programs",
    title: "Bachelor of Science in Business Administration",
    content:
      "DeVry's Business Administration program builds competencies in management, marketing, finance, operations, and organizational behavior. Students choose specializations in Project Management, Human Resources, Sales & Marketing, or Entrepreneurship. The program is designed for working adults with flexible scheduling and 8-week course sessions. Total credits: 120 semester hours. Stackable credentials available.",
    keywords: ["business administration", "management", "marketing", "finance", "MBA", "specialization", "working adults"],
  },
  {
    id: "prog-004",
    source: "Academic Catalog 2025–2026",
    category: "Programs",
    title: "Associate of Applied Science in Health Information Technology (HIT)",
    content:
      "The Health Information Technology program prepares students for careers managing patient data, medical coding (ICD-10, CPT), and health record compliance. Coursework covers HIPAA regulations, electronic health records (EHR) systems, and healthcare data analytics. Graduates are eligible to sit for the RHIT exam. Total credits: 60 semester hours. Hybrid and online delivery options available.",
    keywords: ["health information", "HIT", "medical coding", "HIPAA", "EHR", "associate", "healthcare"],
  },
  {
    id: "prog-005",
    source: "Academic Catalog 2025–2026",
    category: "Programs",
    title: "Master of Science in Cybersecurity Management (MSCM)",
    content:
      "The MSCM graduate program is designed for professionals seeking leadership roles in information security. Core topics include cyber risk governance, cloud security architecture, security operations management, regulatory compliance, and executive communication. Prerequisite: bachelor's degree in a related field or demonstrated equivalent experience. Total credits: 33 semester hours. Fully online, cohort-based.",
    keywords: ["master", "graduate", "MSCM", "cybersecurity management", "cloud", "leadership", "graduate program"],
  },

  // ── ENROLLMENT ──────────────────────────────────────────────────────────────
  {
    id: "enroll-001",
    source: "Enrollment & Admissions Policy 2025",
    category: "Enrollment",
    title: "Undergraduate Admission Requirements",
    content:
      "To be admitted to a DeVry bachelor's or associate's degree program, applicants must: (1) be at least 17 years of age, (2) hold a high school diploma or GED, (3) complete the online application form at devry.edu/admissions, (4) submit official transcripts from all previously attended institutions, and (5) complete an admissions interview with an Enrollment Advisor. No standardized test scores (SAT/ACT) are required for standard admission.",
    keywords: ["admission", "requirements", "apply", "apply now", "high school diploma", "GED", "transcripts", "undergraduate", "enroll"],
  },
  {
    id: "enroll-002",
    source: "Enrollment & Admissions Policy 2025",
    category: "Enrollment",
    title: "Transfer Credit Policy",
    content:
      "DeVry accepts transfer credits from regionally and nationally accredited institutions. Credits are evaluated on a course-by-course basis by the Academic Registrar. A maximum of 75% of the total program credits may be transferred. Credits must have been earned with a grade of C or better. Military training and professional certifications (e.g., CompTIA, AWS, PMP) may be evaluated for credit equivalency. Transfer evaluations are completed within 10 business days of receiving official transcripts.",
    keywords: ["transfer", "credits", "transcripts", "prior learning", "military", "certifications", "accredited"],
  },
  {
    id: "enroll-003",
    source: "Enrollment & Admissions Policy 2025",
    category: "Enrollment",
    title: "Class Schedule & Session Dates",
    content:
      "DeVry operates on an 8-week session schedule with six sessions per academic year. Sessions begin in January, March, May, July, September, and November. Full-time students typically take two to three courses per session. Part-time options allow one course per session. Courses are available in online, hybrid, and in-person formats. Late registration is accepted up to the first day of class, subject to seat availability. Students may register via the MyDeVry student portal.",
    keywords: ["schedule", "class", "session", "dates", "register", "online", "hybrid", "part-time", "full-time"],
  },

  // ── FINANCIAL AID ───────────────────────────────────────────────────────────
  {
    id: "fin-001",
    source: "Financial Aid FAQ 2025",
    category: "Financial Aid",
    title: "Federal Financial Aid Eligibility",
    content:
      "Students may be eligible for federal financial aid including Pell Grants, Direct Subsidized and Unsubsidized Loans, and the Federal Work-Study program. To apply, students must complete the Free Application for Federal Student Aid (FAFSA) at studentaid.gov using DeVry's school code: 010329. Eligibility is determined by the Expected Family Contribution (EFC) calculated from the FAFSA. Students must maintain Satisfactory Academic Progress (SAP) — a minimum 2.0 GPA and 67% course completion rate — to remain eligible.",
    keywords: ["FAFSA", "financial aid", "federal aid", "Pell Grant", "loans", "grant", "work-study", "SAP", "GPA"],
  },
  {
    id: "fin-002",
    source: "Financial Aid FAQ 2025",
    category: "Financial Aid",
    title: "Scholarships & Institutional Aid",
    content:
      "DeVry offers several merit-based and need-based scholarships: (1) DeVry STEM Scholarship — up to $3,000/year for students in technology programs, (2) Women in Technology Scholarship — $2,500 for qualifying female students in CIS or Cybersecurity, (3) Military Scholarship — 10% tuition discount for active duty, veterans, and dependents, (4) Employer Tuition Assistance — DeVry coordinates with 1,000+ employer partners. Scholarship applications open each February for the following academic year.",
    keywords: ["scholarship", "military", "veteran", "tuition assistance", "discount", "STEM", "women in tech"],
  },
  {
    id: "fin-003",
    source: "Financial Aid FAQ 2025",
    category: "Financial Aid",
    title: "Tuition Rates & Payment Plans",
    content:
      "Current tuition rates (2025–2026): Undergraduate $609 per credit hour, Graduate $764 per credit hour. A $150 technology fee is assessed per session. Payment plans are available with no interest — students may split tuition into three monthly installments per session. Tuition is locked in for students who maintain continuous enrollment. Questions about billing should be directed to the Student Financial Services office at 1-800-73-DEVRY.",
    keywords: ["tuition", "cost", "price", "credit hour", "payment plan", "billing", "fees", "how much"],
  },

  // ── STUDENT SERVICES ────────────────────────────────────────────────────────
  {
    id: "svc-001",
    source: "Student Handbook 2025–2026",
    category: "Student Services",
    title: "Academic Advising Services",
    content:
      "Every DeVry student is assigned a dedicated Academic Advisor who provides personalized degree planning, course selection guidance, and academic support. Advising appointments are available via the MyDeVry portal, by phone, or via video conference. Walk-in advising is available at campus locations Monday–Friday, 9am–5pm. Students in academic difficulty (GPA below 2.0) receive priority outreach from their advisor within 48 hours of grade posting.",
    keywords: ["advisor", "advising", "academic support", "degree plan", "appointment", "help", "guidance"],
  },
  {
    id: "svc-002",
    source: "Student Handbook 2025–2026",
    category: "Student Services",
    title: "Career Services & Employment Support",
    content:
      "DeVry's Career Services team provides resume reviews, mock interviews, job search coaching, and employer connections. The DeVry Career Network includes 4,000+ employer partners including IBM, Accenture, and Walgreens. Students gain access to career services from day one and for life as alumni. The annual Career Fair connects students directly with hiring managers. Employment outcomes are reported in DeVry's annual Outcomes Report.",
    keywords: ["career", "job", "employment", "resume", "interview", "hiring", "career fair", "outcomes"],
  },
  {
    id: "svc-003",
    source: "Student Handbook 2025–2026",
    category: "Student Services",
    title: "Academic Integrity & Code of Conduct",
    content:
      "DeVry upholds a strict Academic Integrity Policy. Academic dishonesty includes plagiarism, cheating, fabrication, and unauthorized collaboration. Violations may result in a failing grade, academic probation, or dismissal. Students may appeal academic integrity decisions through the formal Grievance Process within 15 business days of notification. All suspected violations are reviewed by the Dean of Academic Affairs. The full policy is available in the Student Handbook at devry.edu/student-handbook.",
    keywords: ["academic integrity", "plagiarism", "cheating", "conduct", "violation", "appeal", "grievance", "policy"],
  },
  {
    id: "svc-004",
    source: "Student Handbook 2025–2026",
    category: "Student Services",
    title: "FERPA & Student Privacy Rights",
    content:
      "Under the Family Educational Rights and Privacy Act (FERPA), DeVry students have the right to inspect and review their education records, request corrections, and control disclosure of their records. DeVry does not release personally identifiable student information without written consent, except to school officials with legitimate educational interests. Students may submit a FERPA authorization form through the Registrar's office to authorize third-party access (e.g., parents, employers). For FERPA inquiries, contact registrar@devry.edu.",
    keywords: ["FERPA", "privacy", "records", "student records", "parents", "authorization", "registrar", "disclosure"],
  },

  // ── POLICIES ────────────────────────────────────────────────────────────────
  {
    id: "pol-001",
    source: "Enrollment & Admissions Policy 2025",
    category: "Policies",
    title: "Withdrawal & Refund Policy",
    content:
      "Students who withdraw from a course or from DeVry within the first 60% of a session may be eligible for a partial tuition refund on a pro-rated basis. After 60%, no refund is issued. Federal aid recipients who withdraw may be subject to Return to Title IV (R2T4) calculations, which could result in the student owing funds back to the government. Students must notify their Academic Advisor and complete a formal withdrawal form via MyDeVry. Medical and military withdrawals are evaluated on a case-by-case basis.",
    keywords: ["withdraw", "refund", "drop", "leave", "withdrawal policy", "Title IV", "R2T4"],
  },
  {
    id: "pol-002",
    source: "Enrollment & Admissions Policy 2025",
    category: "Policies",
    title: "Satisfactory Academic Progress (SAP) Policy",
    content:
      "All students must maintain Satisfactory Academic Progress (SAP) to remain enrolled and retain financial aid eligibility. SAP requirements: (1) Cumulative GPA of 2.0 or higher for undergraduates (3.0 for graduate students), (2) Completion rate of at least 67% of attempted credit hours, (3) Maximum time frame of 150% of program length. SAP is evaluated at the end of each session. Students who fail SAP are placed on Academic Warning (first occurrence) or Academic Suspension (subsequent occurrence).",
    keywords: ["SAP", "satisfactory academic progress", "GPA", "completion rate", "suspension", "warning", "financial aid"],
  },
];

// ── Simple BM25-style keyword retrieval ─────────────────────────────────────

export function retrieveChunks(
  query: string,
  topK: number = 3
): { chunk: KnowledgeChunk; score: number; quality: "strong" | "moderate" | "weak" }[] {
  const queryTokens = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((t) => t.length > 2);

  const scored = knowledgeBase.map((chunk) => {
    const text = `${chunk.title} ${chunk.content} ${chunk.keywords.join(" ")}`.toLowerCase();
    let score = 0;
    for (const token of queryTokens) {
      const matches = (text.match(new RegExp(token, "g")) || []).length;
      score += matches;
      if (chunk.keywords.some((k) => k.toLowerCase().includes(token))) score += 3;
      if (chunk.title.toLowerCase().includes(token)) score += 2;
    }
    return { chunk, score };
  });

  const sorted = scored.sort((a, b) => b.score - a.score).slice(0, topK);
  const maxScore = sorted[0]?.score ?? 0;

  return sorted
    .filter((r) => r.score > 0)
    .map((r) => ({
      chunk: r.chunk,
      score: r.score,
      quality:
        maxScore === 0
          ? "weak"
          : r.score / maxScore >= 0.7
          ? "strong"
          : r.score / maxScore >= 0.35
          ? "moderate"
          : "weak",
    }));
}
