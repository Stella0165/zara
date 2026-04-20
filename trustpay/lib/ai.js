import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/googleai";

const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_API_KEY,
    }),
  ],
});

export const fraudAgent = ai.defineFlow(
  {
    name: "fraud-agent",
  },
  async (input) => {
    const res = await ai.generate({
      model: googleAI.model("gemini-2.5-flash"),
      prompt: `
You are a fraud detection system.

Analyse this transaction:

Name: ${input.name}
Phone: ${input.phone}
Amount: ${input.amount}

Rules:
- Large amounts (>1000) = suspicious
- New/unusual patterns = suspicious
- Phone number longer than 9 digits = suspicious
- Known fraud patterns = flagged

Return ONLY JSON:
{
 "risk": "normal | suspicious | flagged",
 "reason": "short explanation",
 "confidence": 0-1
}
      `,
    });

    const text = (res.output?.text || "")
      .replace(/```json|```/g, "")
      .trim();

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      return {
        status: "pending",
        risk: "suspicious",
        reason: "AI detected failed",
        confidence: 0,
      };
    }

     if (result.risk === "normal") {
      return {
        status: "approved",
        risk: result.risk,
        reason: result.reason,
        confidence: result.confidence,
      };
    }

    if (result.risk === "suspicious") {
      return {
        status: "pending",
        risk: result.risk,
        reason: result.reason,
        confidence: result.confidence,
      };
    }

    return {
      status: "rejected",
      risk: result.risk,
      reason: result.reason,
      confidence: result.confidence,
    };
  }
);
