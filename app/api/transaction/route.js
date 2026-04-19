import { fraudAgent } from '@/lib/ai';

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();

    const result = await fraudAgent(body);

    return Response.json(result);

  } catch (error) {
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}