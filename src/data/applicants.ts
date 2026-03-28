export interface Applicant {
  id: string;
  name: string;
  grade: string;
  major: string;
  status: string;
  time: string;
  weeklyTime: string;
  phone: string;
  studentId: string;
  intro: string;
  interests: string[];
  customAnswers: { question: string; answer: string }[];
}

export const APPLICANTS_MAP: Record<string, Applicant[]> = {
  "guitar-club": [
    {
      id: "1", name: "张小明", grade: "大一", major: "计算机科学", status: "待面试", time: "2025-09-10 09:15", weeklyTime: "2-5小时",
      phone: "138****1001", studentId: "2025010001", intro: "大一新生，从小就喜欢听民谣，一直想学吉他但没有机会，希望在大学里圆这个梦。",
      interests: ["音乐", "编程", "阅读"],
      customAnswers: [],
    },
    {
      id: "2", name: "李佳慧", grade: "大一", major: "英语", status: "已录取", time: "2025-09-10 10:30", weeklyTime: "2小时以内",
      phone: "139****2002", studentId: "2025020002", intro: "喜欢唱歌，想学弹唱给自己伴奏，性格比较安静。",
      interests: ["音乐", "阅读", "旅行"],
      customAnswers: [],
    },
    {
      id: "3", name: "王浩然", grade: "大一", major: "数学", status: "已投递", time: "2025-09-10 14:20", weeklyTime: "2-5小时",
      phone: "137****3003", studentId: "2025030003", intro: "理科生但对音乐很感兴趣，想通过社团拓展一下课余生活，认识不同专业的朋友。",
      interests: ["音乐", "运动", "游戏"],
      customAnswers: [],
    },
    {
      id: "4", name: "赵心怡", grade: "大一", major: "新闻学", status: "已面试", time: "2025-09-11 08:45", weeklyTime: "5小时以上",
      phone: "136****4004", studentId: "2025040004", intro: "高中参加过校合唱团，对音乐有基础。想学一门乐器，课余时间比较充裕。",
      interests: ["音乐", "摄影", "舞蹈"],
      customAnswers: [],
    },
    {
      id: "5", name: "刘思远", grade: "大一", major: "物理", status: "已录取", time: "2025-09-11 11:00", weeklyTime: "2-5小时",
      phone: "135****5005", studentId: "2025050005", intro: "自己在家学过一段时间吉他，会几个基础和弦，想系统学习提升。",
      interests: ["音乐", "编程", "运动"],
      customAnswers: [],
    },
    {
      id: "6", name: "陈雨萱", grade: "大一", major: "设计", status: "未通过", time: "2025-09-11 16:30", weeklyTime: "2小时以内",
      phone: "134****6006", studentId: "2025060006", intro: "设计专业学生，喜欢有艺术氛围的社团，想在紧张的学业之余放松一下。",
      interests: ["绘画", "音乐", "摄影"],
      customAnswers: [],
    },
  ],
  "street-dance": [
    {
      id: "1", name: "周小凡", grade: "大一", major: "体育教育", status: "已录取", time: "2025-09-10 08:00", weeklyTime: "5小时以上",
      phone: "133****7007", studentId: "2025070007", intro: "高中就在练Breaking，有三年街舞基础，想找一个更专业的训练环境。",
      interests: ["舞蹈", "运动", "音乐"],
      customAnswers: [
        { question: "你对哪个舞种最感兴趣？", answer: "Breaking" },
        { question: "有没有舞蹈基础，学过多久？", answer: "Breaking三年，参加过市级比赛" },
      ],
    },
    {
      id: "2", name: "吴佳琪", grade: "大一", major: "艺术设计", status: "待面试", time: "2025-09-10 09:30", weeklyTime: "2-5小时",
      phone: "132****8008", studentId: "2025080008", intro: "完全零基础但特别想学Hip-hop，看了很多街舞综艺节目，非常向往。",
      interests: ["舞蹈", "绘画", "动漫"],
      customAnswers: [
        { question: "你对哪个舞种最感兴趣？", answer: "Hip-hop" },
        { question: "有没有舞蹈基础，学过多久？", answer: "零基础，但体能还行" },
      ],
    },
    {
      id: "3", name: "孙明宇", grade: "大一", major: "软件工程", status: "已投递", time: "2025-09-11 10:00", weeklyTime: "5小时以上",
      phone: "131****9009", studentId: "2025090009", intro: "程序员也可以很酷！想通过街舞锻炼身体、释放压力。",
      interests: ["编程", "运动", "舞蹈"],
      customAnswers: [
        { question: "你对哪个舞种最感兴趣？", answer: "Popping" },
        { question: "有没有舞蹈基础，学过多久？", answer: "零基础，但经常健身" },
      ],
    },
    {
      id: "4", name: "郑小雅", grade: "大二", major: "传播学", status: "已面试", time: "2025-09-11 14:15", weeklyTime: "2-5小时",
      phone: "130****1010", studentId: "2024101010", intro: "大一在其他学校的舞蹈社待过一年，转学过来想继续跳舞。",
      interests: ["舞蹈", "摄影", "旅行"],
      customAnswers: [
        { question: "你对哪个舞种最感兴趣？", answer: "Urban" },
        { question: "有没有舞蹈基础，学过多久？", answer: "学过一年Urban Dance" },
      ],
    },
  ],
  "debate-club": [
    {
      id: "1", name: "黄思源", grade: "大一", major: "法学", status: "已录取", time: "2025-09-10 07:30", weeklyTime: "5小时以上",
      phone: "129****1111", studentId: "2025111111", intro: "高中辩论队主力四辩，拿过省赛最佳辩手。希望在大学继续精进辩论。",
      interests: ["辩论", "阅读", "演讲"],
      customAnswers: [
        { question: "请就'大学生应该广泛社交还是专注学业'给出你的观点", answer: "我认为应该以学业为主但不排斥社交。大学的社交是结构化学习的延伸，通过辩论、讨论等形式的社交反而能促进学业。关键在于选择高质量的社交而非广泛社交。" },
      ],
    },
    {
      id: "2", name: "马晓丽", grade: "大一", major: "哲学", status: "已投递", time: "2025-09-10 11:00", weeklyTime: "2-5小时",
      phone: "128****2222", studentId: "2025222222", intro: "热爱思考，喜欢和人讨论各种社会议题，但没有正式的辩论经验。",
      interests: ["阅读", "辩论", "公益"],
      customAnswers: [
        { question: "请就'大学生应该广泛社交还是专注学业'给出你的观点", answer: "广泛社交。大学是最好的拓展认知边界的时期，与不同背景的人交流能带来视角的多样性，这种收获不亚于课本。" },
      ],
    },
    {
      id: "3", name: "林浩宇", grade: "大一", major: "经济学", status: "已面试", time: "2025-09-11 09:45", weeklyTime: "2-5小时",
      phone: "127****3333", studentId: "2025333333", intro: "模联经验丰富，擅长即兴演讲，想在辩论方面也提升自己。",
      interests: ["辩论", "创业", "演讲"],
      customAnswers: [
        { question: "请就'大学生应该广泛社交还是专注学业'给出你的观点", answer: "这是一个伪命题。社交和学业不是零和博弈，关键在于时间管理能力。能管理好时间的人两者都能兼顾，管理不好的人两者都会荒废。" },
      ],
    },
    {
      id: "4", name: "徐文婷", grade: "大一", major: "中文", status: "未通过", time: "2025-09-11 15:20", weeklyTime: "2小时以内",
      phone: "126****4444", studentId: "2025444444", intro: "文字功底好，写过很多评论文章，想尝试口头表达方面的锻炼。",
      interests: ["阅读", "写作", "戏剧"],
      customAnswers: [
        { question: "请就'大学生应该广泛社交还是专注学业'给出你的观点", answer: "专注学业。大学四年转瞬即逝，把有限的时间投入到专业能力建设上，才是对未来最好的投资。" },
      ],
    },
    {
      id: "5", name: "陈立诚", grade: "大一", major: "国际关系", status: "已录取", time: "2025-09-12 08:00", weeklyTime: "5小时以上",
      phone: "125****5555", studentId: "2025555555", intro: "对国际时事有浓厚兴趣，参加过英语辩论赛，想挑战中文辩论。",
      interests: ["辩论", "演讲", "旅行"],
      customAnswers: [
        { question: "请就'大学生应该广泛社交还是专注学业'给出你的观点", answer: "在全球化时代，社交能力本身就是学业的一部分。国际关系专业尤其需要跨文化交流能力，这只能在社交中习得。" },
      ],
    },
  ],
};
