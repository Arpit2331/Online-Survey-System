// ─── Mock Data ────────────────────────────────────────────────────────────────

export const currentUser = {
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: "AJ",
  role: "Admin",
};

export const surveys = [
  {
    id: 1,
    title: "Customer Satisfaction Survey",
    status: "published",
    responses: 142,
    questions: 8,
    createdAt: "2024-12-01",
    lastModified: "2024-12-15",
    category: "Customer Feedback",
  },
  {
    id: 2,
    title: "Employee Engagement Q4",
    status: "draft",
    responses: 0,
    questions: 12,
    createdAt: "2024-12-10",
    lastModified: "2024-12-18",
    category: "HR",
  },
  {
    id: 3,
    title: "Product Feedback — v2.4",
    status: "published",
    responses: 87,
    questions: 6,
    createdAt: "2024-11-20",
    lastModified: "2024-12-05",
    category: "Product",
  },
  {
    id: 4,
    title: "Event Registration Form",
    status: "closed",
    responses: 320,
    questions: 5,
    createdAt: "2024-10-15",
    lastModified: "2024-11-01",
    category: "Events",
  },
  {
    id: 5,
    title: "Website UX Research",
    status: "published",
    responses: 54,
    questions: 10,
    createdAt: "2024-12-05",
    lastModified: "2024-12-20",
    category: "Research",
  },
  {
    id: 6,
    title: "Onboarding Experience",
    status: "draft",
    responses: 0,
    questions: 7,
    createdAt: "2024-12-19",
    lastModified: "2024-12-19",
    category: "HR",
  },
];

export const stats = {
  totalSurveys: 6,
  totalResponses: 603,
  activeSurveys: 3,
  avgResponseRate: "68%",
};

export const analyticsData = {
  summary: [
    { label: "Total Responses", value: 603, change: "+12%", positive: true },
    { label: "Completion Rate", value: "74%", change: "+5%", positive: true },
    { label: "Avg Time Spent", value: "3m 42s", change: "-8s", positive: true },
    { label: "Bounce Rate", value: "18%", change: "-2%", positive: true },
  ],
  pieData: [
    { name: "Very Satisfied", value: 38, fill: "#3b82f6" },
    { name: "Satisfied", value: 29, fill: "#60a5fa" },
    { name: "Neutral", value: 18, fill: "#93c5fd" },
    { name: "Dissatisfied", value: 10, fill: "#bfdbfe" },
    { name: "Very Dissatisfied", value: 5, fill: "#dbeafe" },
  ],
  barData: [
    { month: "Jul", responses: 65 },
    { month: "Aug", responses: 82 },
    { month: "Sep", responses: 74 },
    { month: "Oct", responses: 110 },
    { month: "Nov", responses: 143 },
    { month: "Dec", responses: 129 },
  ],
};

export const users = [
  { id: 1, name: "Alex Johnson", email: "alex@example.com", role: "Admin", surveys: 6, joined: "2024-01-10", status: "active" },
  { id: 2, name: "Maria Garcia", email: "maria@example.com", role: "Editor", surveys: 4, joined: "2024-03-22", status: "active" },
  { id: 3, name: "James Wilson", email: "james@example.com", role: "Viewer", surveys: 0, joined: "2024-06-14", status: "inactive" },
  { id: 4, name: "Priya Patel", email: "priya@example.com", role: "Editor", surveys: 3, joined: "2024-07-01", status: "active" },
  { id: 5, name: "Tom Chen", email: "tom@example.com", role: "Viewer", surveys: 1, joined: "2024-09-18", status: "active" },
  { id: 6, name: "Sara Kim", email: "sara@example.com", role: "Editor", surveys: 2, joined: "2024-11-05", status: "suspended" },
];

export const sampleSurveyQuestions = [
  {
    id: 1,
    type: "multiple_choice",
    question: "How satisfied are you with our product?",
    options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
    required: true,
  },
  {
    id: 2,
    type: "text",
    question: "What feature would you most like to see improved?",
    placeholder: "Type your answer here...",
    required: false,
  },
  {
    id: 3,
    type: "rating",
    question: "Rate your overall experience (1–10)",
    min: 1,
    max: 10,
    required: true,
  },
  {
    id: 4,
    type: "checkbox",
    question: "Which features do you use most? (Select all that apply)",
    options: ["Analytics", "Survey Builder", "Team Collaboration", "Integrations", "Export Tools"],
    required: false,
  },
];
