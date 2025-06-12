export const generateChatTitle = async ({
  inputText,
}: {
  inputText: string;
}) => {
  if (!inputText?.trim()) return;


  const prompt = `Generate a short, relevant title (with a maximum character count of 30) for a chat with this user query: *${inputText}*`;


  const requestBody = {
    model: "deepseek/deepseek-chat",
    frequency_penalty: 1,
    logprobs: true,
    top_logprobs: 5,
    max_tokens: 20,
    n: 1,
    presence_penalty: 1,
    temperature: 0.7,
    stream: true,
    response_format: { type: "text" },
    messages: [
      {
        role: "system", content:
          "You are a helpful assistant that generates short, clean titles for chat conversations.",
      },
      { role: "user", content: prompt },
    ],
  };

  try {

    const res = await fetch("https://chatgpt-lye6.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!res.body) throw new Error("No response body");

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let accumulatedContent = "";

    const readChunk = async () => {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter(line => line.trim().startsWith("data:"));

        for (const line of lines) {
          const jsonStr = line.replace(/^data:\s*/, "").trim();
          if (!jsonStr || jsonStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed?.choices?.[0]?.delta?.content;
            if (content) {
              accumulatedContent += content;
            }
          } catch (err) {
            console.warn("Skipping invalid JSON:", jsonStr, err);
          }
        }
      }
    };

    await readChunk();
    return accumulatedContent
  } catch (error) {
    console.error("Error sending message:", error);
  }
}; 