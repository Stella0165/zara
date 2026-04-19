import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const ai = genkit({
  plugins: [googleAI()],
});

export const fraudAgent = ai.defineFlow(
  { name: 'fraud-agent' },
  async (input) => {

    const res = await ai.generate({
      model: 'gemini-1.5-flash',
      prompt: `
You are a fraud detection AI.

Transaction:
Name: ${input.name}
Phone: ${input.phone}
Amount: ${input.amount}

Return JSON:
{
 "risk": "normal | suspicious | flagged",
 "reason": "...",
 "confidence": 0-1
}
      `,
    });

    const result = JSON.parse(res.text);

    if (result.risk === "normal") {
      return { status: "approved" };
    }

    if (result.risk === "suspicious") {
      // send to admin for checking
      return { status: "pending" };
    }

    // flagged account: reject
    return { status: "rejected" };
  }
);