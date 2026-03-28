export interface Club {
  id: string;
  name: string;
  category: string;
  slogan: string;
  description: string;
  coreActivities: { name: string; desc: string }[];
  fee: number;
  feeUsage: string;
  requireBasis: boolean;
  basisDesc: string;
  weeklyHours: number;
  timeLevel: "轻度" | "中度" | "重度";
  atmosphere: string[];
  joinMode: "直接加入" | "申请审核";
  memberCount: number;
  lastTermActivities: number;
  retentionRate: number;
  rating: number;
  customQuestions: CustomQuestion[];
  reviews: Review[];
  contacts: Contact[];
  qa: QA[];
}

export interface CustomQuestion {
  type: "short-answer" | "single-choice";
  question: string;
  options?: string[];
}

export interface Review {
  grade: string;
  weeklyHoursActual: string;
  threeWords: string[];
  bestActivity: string;
  gain: string;
  regret: string;
  scores: {
    活动质量: number;
    氛围友好度: number;
    时间合理性: number;
    收获感: number;
  };
  overall: number;
}

export interface Contact {
  name: string;
  grade: string;
  tag: string;
  avatar: string;
  wechat: string;
}

export interface QA {
  question: string;
  asker: string;
  answer: string;
  answerer: string;
  answererTag: string;
  time: string;
  inKnowledgeBase: boolean;
}
