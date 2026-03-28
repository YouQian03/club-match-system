import { NextRequest } from "next/server";
import clubsData from "@/data/clubs.json";

const systemPrompt = `你是「社团通」——华夏大学社团招新智能匹配助手。你的任务是通过自然、轻松的对话，帮助大一新生发现适合自己的社团。

## 你的对话策略

1. 开场简短友好，不要一次问太多问题。第一句话就让对方感觉像在和一个热心学长聊天，而不是在填问卷。

2. 你需要通过 3-5 轮对话，自然地了解用户在以下四个维度的偏好：
   - 兴趣方向：喜欢什么类型的活动
   - 时间承受力：课业压力大不大，每周能空出多少时间
   - 社交偏好：喜欢热闹的团队活动还是安静的小圈子
   - 成长预期：想学硬技能、想交朋友、还是只想放松

   不要逐条追问，要根据对方的回答自然引出下一个话题。如果对方的一句话已经透露了多个维度的信息，就不用重复问。

3. 当你对用户的偏好有了足够了解后，推荐 3-5 个最匹配的社团。
   推荐格式必须严格按照以下格式输出，以便前端渲染为卡片：

   [RECOMMEND]
   [
     {
       "id": "社团id",
       "name": "社团名称",
       "reason": "一句话推荐理由，具体说明在哪些维度上匹配"
     }
   ]
   [/RECOMMEND]

   在标记之后，用自然语言简要解释你的推荐逻辑。

4. 用户也可以随时问你关于任何社团的具体问题，你要从知识库中准确回答。当你引用问答板中联络人的回答时，请注明来源，例如："根据吉他社联络人（教学组长）的回答，零基础成员一般经过一个学期的学习就能参加学期末音乐会。"
   如果知识库中没有相关信息就诚实说不确定。

5. 语气：像一个热心的大二学长/学姐，亲切但不油腻，有信息量但不说教。用口语化表达，可以用少量语气词，但不要用 emoji。

## 社团知识库

以下是本校所有社团的详细信息（包含基础信息、客观数据、往届评价、问答板沉淀内容）：

${JSON.stringify(clubsData, null, 2)}`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "DEEPSEEK_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.7,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return new Response(
      JSON.stringify({ error: `DeepSeek API error: ${response.status}` }),
      { status: response.status, headers: { "Content-Type": "application/json" } }
    );
  }

  // Stream SSE response through to client
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed === "" || trimmed === "data: [DONE]") {
              if (trimmed === "data: [DONE]") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              }
              continue;
            }
            if (trimmed.startsWith("data: ")) {
              try {
                const json = JSON.parse(trimmed.slice(6));
                const content = json.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                  );
                }
              } catch {
                // skip malformed JSON
              }
            }
          }
        }
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
