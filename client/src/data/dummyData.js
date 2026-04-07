export const currentUser = {
  name: "Alex Johnson",
  email: "alex@ossplatform.com",
  avatar: "AJ",
  role: "Admin",
};

export const surveys = [
  {
    id: 1,
    title: "Customer Satisfaction Q2 2025",
    status: "published",
    responses: 142,
    questions: 8,
    createdAt: "2025-04-01",
    lastModified: "2025-04-05",
    color: "#3B82F6",
  },
  {
    id: 2,
    title: "Product Feedback - Mobile App",
    status: "draft",
    responses: 0,
    questions: 5,
    createdAt: "2025-04-03",
    lastModified: "2025-04-06",
    color: "#8B5CF6",
  },
  {
    id: 3,
    title: "Employee Engagement Survey",
    status: "published",
    responses: 87,
    questions: 12,
    createdAt: "2025-03-20",
    lastModified: "2025-03-28",
    color: "#10B981",
  },
  {
    id: 4,
    title: "Website UX Research",
    status: "closed",
    responses: 230,
    questions: 10,
    createdAt: "2025-03-01",
    lastModified: "2025-03-15",
    color: "#F59E0B",
  },
  {
    id: 5,
    title: "Onboarding Experience Check",
    status: "published",
    responses: 56,
    questions: 6,
    createdAt: "2025-04-04",
    lastModified: "2025-04-06",
    color: "#EF4444",
  },
  {
    id: 6,
    title: "Event Feedback - April Conf",
    status: "draft",
    responses: 0,
    questions: 4,
    createdAt: "2025-04-06",
    lastModified: "2025-04-06",
    color: "#06B6D4",
  },
];

export const stats = {
  totalSurveys: 6,
  totalResponses: 515,
  activeNow: 3,
  avgCompletionRate: 74,
};

export const analyticsData = {
  pieData: [
    { name: "Satisfied", value: 58, color: "#3B82F6" },
    { name: "Neutral", value: 24, color: "#93C5FD" },
    { name: "Dissatisfied", value: 18, color: "#DBEAFE" },
  ],
  barData: [
    { month: "Jan", responses: 65 },
    { month: "Feb", responses: 89 },
    { month: "Mar", responses: 120 },
    { month: "Apr", responses: 142 },
    { month: "May", responses: 98 },
    { month: "Jun", responses: 175 },
  ],
  summaryCards: [
    { label: "Total Responses", value: "515", change: "+12%", up: true },
    { label: "Avg. Completion", value: "74%", change: "+5%", up: true },
    { label: "Avg. Time", value: "3m 24s", change: "-8%", up: false },
    { label: "Drop-off Rate", value: "26%", change: "-3%", up: true },
  ],
};

export const surveyQuestions = [
  {
    id: 1,
    type: "multiple_choice",
    question: "How satisfied are you with our product overall?",
    options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
    required: true,
  },
  {
    id: 2,
    type: "text",
    question: "What feature do you use the most?",
    placeholder: "Type your answer here...",
    required: false,
  },
  {
    id: 3,
    type: "rating",
    question: "Rate your overall experience (1–5)",
    maxRating: 5,
    required: true,
  },
  {
    id: 4,
    type: "multiple_choice",
    question: "How did you hear about us?",
    options: ["Social Media", "Friend/Colleague", "Search Engine", "Advertisement", "Other"],
    required: false,
  },
];

export const users = [
  { id: 1, name: "Alex Johnson", email: "alex@ossplatform.com", role: "Admin", surveys: 6, status: "active", joined: "2024-01-15" },
  { id: 2, name: "Maria Garcia", email: "maria@company.com", role: "User", surveys: 3, status: "active", joined: "2024-02-20" },
  { id: 3, name: "James Wilson", email: "james@corp.io", role: "User", surveys: 1, status: "inactive", joined: "2024-03-05" },
  { id: 4, name: "Sarah Chen", email: "sarah@startup.ai", role: "User", surveys: 8, status: "active", joined: "2024-01-30" },
  { id: 5, name: "Tom Rivera", email: "tom@agency.co", role: "Moderator", surveys: 4, status: "active", joined: "2024-04-10" },
  { id: 6, name: "Emily Park", email: "emily@research.org", role: "User", surveys: 2, status: "suspended", joined: "2024-02-14" },
];

export const questionTypes = [
  { type: "multiple_choice", label: "Multiple Choice", icon: "☑️", description: "Single or multi-select options" },
  { type: "text", label: "Short Text", icon: "✏️", description: "Free text response" },
  { type: "long_text", label: "Long Text", icon: "📝", description: "Paragraph response" },
  { type: "rating", label: "Rating Scale", icon: "⭐", description: "1–5 or 1–10 scale" },
  { type: "dropdown", label: "Dropdown", icon: "▾", description: "Select from a list" },
  { type: "date", label: "Date", icon: "📅", description: "Date picker" },
  { type: "yes_no", label: "Yes / No", icon: "✓✗", description: "Binary choice" },
  { type: "file_upload", label: "File Upload", icon: "📎", description: "Upload an attachment" },
];
