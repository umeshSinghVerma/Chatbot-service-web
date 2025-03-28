import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import {
  GoogleGenerativeAI,
  GenerativeModel,
  ChatSession,
  HarmCategory,
  HarmBlockThreshold
} from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

interface Message {
  role: "user" | "model";
  parts: [{ text: string }]; //  <-- Corrected type for parts
}

export async function POST(request: Request) {
  try {
    const { id, prompt, messages } = await request.json();

    if (!id || !prompt) {
      return NextResponse.json({ error: "Missing chatbot ID or prompt" }, { status: 400 });
    }

    const previousMessages: Message[] = Array.isArray(messages) ? messages : [];

    const { data: chatbot, error } = await supabase
      .from("chatbots")
      .select("prompt")
      .eq("id", id.trim())
      .single();

    if (error || !chatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    const systemPrompt = chatbot.prompt;

    const response = await askGemini(systemPrompt, prompt, previousMessages);

    // Set CORS headers
    const headers = new Headers({
      "Access-Control-Allow-Origin": "*", // Change "*" to your frontend domain in production
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });

    return new NextResponse(JSON.stringify({ response }), { status: 200, headers });

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Handle CORS for preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Change to specific origin if needed
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
async function askGemini(
  systemPrompt: string,
  userPrompt: string,
  previousMessages: Message[] | null = null,
  modelName: string = "gemini-1.5-flash-8b"
): Promise<string | null> {

  try {

    const model = genAI.getGenerativeModel({ model: modelName });

    // Build the conversation history.
    const history = [
      ...(systemPrompt
        ? [{ role: "user", parts: [{ text: systemPrompt }] }] 
        : []),
      ...(previousMessages
        ? previousMessages.map((message) => ({
            role: message.role,
            parts: message.parts, 
          }))
        : []),
    ];


    const chat = model.startChat({
      history: history as any, 
      generationConfig: {
        // Add any generation configuration here, such as temperature, topP, etc.
      },
    });

    const result = await chat.sendMessage(userPrompt);
    const responseText = result.response.text();
    console.log("response text",responseText);
    return responseText;
  } catch (error: any) {
    console.error(`An error occurred: ${error.message}`);
    return null;
  }
}
