// app/api/transfer/route.js
// API for transferring money
// Connect with google ai studio for the prompt logic

import { GoogleGenAI } from "@google/genai";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req) {
    try {
        // get data from user request
        const { toName, toPhone, amount } = await req.json();

        // get transactions that are flagged
        const flaggedQuery = query(
            collection(db, "transactions"),
            where("toPhone", "==", toPhone),
            where("status", "==", "FLAGGED")
        );

        const flaggedSnap = await getDocs(flaggedQuery);

        // if the recipient is flagged, reject the transaction
        if (!flaggedSnap.empty) {
            return Response.json({
                success: false,
                status: "FLAGGED",
                action: "REJECT",
                reason: "This recipient is already flagged as fraud",
                blocked: true,
            });
        }

        // prompt for AI
        const prompt = `
You are a financial fraud detection AI.

Analyze this transaction:

recipient_name: ${toName}
recipient_phone: ${toPhone}
amount: ${amount}
flagged_database: ${JSON.stringify(flagged_database)}

Rules:
- If recipient exists in flagged_database → FLAGGED
- Large amount increases risk
- Invalid phone format increases risk
- First-time transfer increases risk

Return ONLY valid JSON:
{
  "status": "NORMAL | SUSPICIOUS | FLAGGED",
  "risk_score": number,
  "reason": string,
  "action": "APPROVE | HOLD | REJECT",
  "admin_suggestion": string,
  "confidence": number
}
`;

        // generate content from Google AI Studio prompt
        const result = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        const text = result.text;

        let parsed;

        try {
            parsed = JSON.parse(text);
        } catch {
            return Response.json({
                success: false,
                error: "Invalid AI response format",
            });
        }

        return Response.json({
            success: true,
            status: parsed.status,
            risk_score: parsed.risk_score,
            reason: parsed.reason,
            action: parsed.action,
            admin_suggestion: parsed.admin_suggestion,
            confidence: parsed.confidence,
        });

    } catch (error) {
        return Response.json({
            success: false,
            error: "AI processing failed",
        });
    }
}