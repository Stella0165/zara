import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const ai = genkit({
  plugins: [googleAI()],
});

export const fraudAgent = ai.defineFlow(
  {
    name: 'fraud-agent',
  },

  async (input) => {

    const res = await ai.generate({
      model: 'gemini-1.5-flash',
      prompt: `
You are a fraud detection AI.

Transaction:
Name: ${input.name}
Phone: ${input.phone}
Amount: ${input.amount}

Return ONLY valid JSON (no explanation, no markdown):
{
 "risk": "normal | suspicious | flagged",
 "reason": "short explanation",
 "confidence": 0-1
}
      `,
    });

    let text = res.text();

    // check output
    text = text.replace(/```json|```/g, "").trim();

    let result;

    try {
      result = JSON.parse(text);
    } catch (error) {
      return {
        status: "pending",
        risk: "suspicious",
        reason: "AI detected suspicious",
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