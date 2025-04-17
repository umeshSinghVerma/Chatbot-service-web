import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import {
  GoogleGenerativeAI
} from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id');

    if(!id){
        throw new Error("No Valid id is present");
    }

    const { data: chatbot, error } = await supabase
      .from("chatbots")
      .select("name")
      .eq("id", id.trim())
      .single();

    if (error || !chatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    console.log(chatbot);

    

    

    // Set CORS headers
    const headers = new Headers({
      "Access-Control-Allow-Origin": "*", // Change "*" to your frontend domain in production
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });

    return new NextResponse(JSON.stringify({ chatbot }), { status: 200, headers });

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
