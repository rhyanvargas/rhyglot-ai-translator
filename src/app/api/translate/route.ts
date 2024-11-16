import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
	try {
		const { text, language } = await request.json();

		// This is a mock translation - replace with your actual translation service
		if (!text || !language) {
			return NextResponse.json(
				{ error: "Text and language are required" },
				{ status: 400 }
			);
		}

		if (!process.env.OPENAI_API_KEY) {
			return NextResponse.json(
				{ error: "OpenAI API key not configured" },
				{ status: 500 }
			);
		}

		const openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});

		const prompt = `Translate the following text to ${language}:\n\n${text}`;

		const response = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content:
						"You are a helpful translator. Provide only the direct translation without any additional text or explanation.",
				},
				{
					role: "user",
					content: prompt,
				},
			],
			temperature: 0.3,
			max_tokens: 500,
		});

		const translation = response.choices[0].message.content;

		return NextResponse.json({ translation });
	} catch (error) {
		console.error("Translation error:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Failed to translate" },
			{ status: 500 }
		);
	}
}
