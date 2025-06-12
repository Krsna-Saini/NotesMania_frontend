import { AiInstructor } from "../utils";
import {store} from '@/state/store'
import { addMessage, updateLastMessage, setLoading, setNewChatId } from "@/state/Global/index";

interface Message {
  role: "user" | "assistant";
  content: string;
  selectedText?: string | null;
  pending?: boolean;
  error?: boolean;
}

interface MessageInput {
  role: "user" | "assistant";
  content: string;
  selectedText?: string | null;
  error?: boolean;
}

export const sendMessage = async ({
  inputText,
  selectedTextForQuery,
  chatId,
  appendMessage,
}: {
  inputText: string | undefined;
  selectedTextForQuery: string;
  chatId: string;
  appendMessage: (arg: { chatId: string; message: MessageInput }) => Promise<unknown>;
}) => {
  if (!inputText?.trim()) return;

  const dispatch = store.dispatch;

  const userMessage: Message = {
    role: "user",
    content: inputText,
    selectedText: selectedTextForQuery,
  };

  // saving user message
  dispatch(addMessage(userMessage));
  dispatch(setLoading(true));

  document.getElementById("targetDiv")?.scrollIntoView({ behavior: "smooth" });

  const prompt = selectedTextForQuery.trim()
    ? `I am going to give you a statement or paragraph, and based on that, I'm going to ask a query. The paragraph is *${selectedTextForQuery}* and the query is *${inputText}*`
    : inputText;

  
  const requestBody = {
    model: "deepseek/deepseek-chat",
    frequency_penalty: 1,
    logprobs: true,
    top_logprobs: 5,
    max_tokens: 1500,
    n: 1,
    presence_penalty: 1,
    temperature: 0.7,
    stream: true,
    response_format: { type: "text" },
    messages: [
      { role: "system", content: AiInstructor },
      { role: "user", content: prompt },
    ],
  };

  try {
    // saving user message 
    await appendMessage({ chatId, message: userMessage });

    // fetcging the ai response
    const res = await fetch("https://chatgpt-lye6.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!res.body) throw new Error("No response body");

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    const assistantMessage: Message = { role: "assistant", content: "", pending: true };
    dispatch(addMessage(assistantMessage));

    let accumulatedContent = "";

    // accumulating the response
    
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
              dispatch(updateLastMessage({ content: accumulatedContent, pending: true }));
            }
          } catch (err) {
            console.warn("Skipping invalid JSON:", jsonStr, err);
          }
        }
      }
    };

    await readChunk();

    // if no result is generated then saving an error message
    if (!accumulatedContent.trim()) {
      dispatch(updateLastMessage({
        content: "An error occurred while getting response",
        pending: false,
        error: true,
      }));

      await appendMessage({
        chatId,
        message: {
          role: "assistant",
          content: "An error occurred while getting response",
          error: true,
        },
      });

    } else {

      // confirming proper response
      dispatch(updateLastMessage({
        content: accumulatedContent,
        pending: false,
      }));

      // saving ai response
      await appendMessage({
        chatId,
        message: {
          role: "assistant",
          content: accumulatedContent,
        },
      });

    }
  } catch (error) {

    // error handeling 
    console.error("Error sending message:", error);
    dispatch(setNewChatId(""))
    dispatch(updateLastMessage({
      content: "⚠️ An error occurred while getting response.",
      pending: false,
      error: true,
    }));

    await appendMessage({
      chatId,
      message: {
        role: "assistant",
        content: "An error occurred while getting response.",
        error: true,
      },
    });
  } finally {
    dispatch(setLoading(false));
  }
}; 