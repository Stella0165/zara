import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
    try {
        const { recipient_name, recipient_phone, amount, flagged_database } =
            await req.json();

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const prompt = `
You are a financial fraud detection AI.

Analyze this transaction:

recipient_name: ${recipient_name}
recipient_phone: ${recipient_phone}
amount: ${amount}
flagged_database: ${JSON.stringify(flagged_database)}

Rules:
- If recipient exists in flagged_database → FRAUD
- Large amount increases risk
- Invalid phone format increases risk
- First-time transfer increases risk

Return ONLY valid JSON:
{
  "status": "NORMAL | SUSPICIOUS | FRAUD",
  "risk_score": number,
  "reason": string,
  "action": "APPROVE | HOLD | REJECT",
  "admin_suggestion": string,
  "confidence": number
}
`;

        const result = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        const text = result.text;

        return Response.json({
            success: true,
            data: text,
        });

    } catch (error) {
        return Response.json({
            success: false,
            error: "AI processing failed",
        });
    }
}