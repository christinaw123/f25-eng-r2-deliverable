/* eslint-disable */
import { generateResponse } from "@/lib/services/species-chat";
import { NextRequest, NextResponse } from "next/server";

// TODO: Implement this file
export async function POST(request: NextRequest) {
  try {
    // parse the request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    // validate required fields
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Request body must be a valid JSON object" }, { status: 400 });
    }

    // type assertion for the body
    const { message } = body as { message?: unknown };

    // handle errors

    //no message
    if (!message) {
      return NextResponse.json({ error: "Missing required field: message" }, { status: 400 });
    }

    // not a tring
    if (typeof message !== "string") {
      return NextResponse.json({ error: "Message must be a string" }, { status: 400 });
    }

    // empty message
    if (message.trim().length === 0) {
      return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
    }

    //message > 1000 chars
    if (message.length > 1000) {
      return NextResponse.json({ error: "Message too long (max 1000 characters)" }, { status: 400 });
    }

    // generate a response using the species chat
    try {
      const response = await generateResponse(message);

      return NextResponse.json({
        response,
      });
    } catch (error: any) {
      console.error("Error in generateResponse:", error);

      // return 502 if Gemini is down
      return NextResponse.json(
        { error: "Sorry, I'm having trouble connecting to my knowledge base. Please try again later." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("Unexpected error in chat API:", error);

    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}

// handle unsupported methods: prevents visiting /api/chat in browser aka a GET request
export async function GET() {
  return NextResponse.json({ error: "Method not allowed. Use POST." }, { status: 405 });
}
