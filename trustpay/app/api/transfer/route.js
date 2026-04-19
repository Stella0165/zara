export const runtime = "nodejs";

import { fraudAgent } from "@/lib/ai";

export async function POST(req) {
  try {
    const body = await req.json();

    const { toName, toPhone, amount } = body;

    if (!toName || !toPhone || !amount) {
      return Response.json(
        { status: "FLAGGED", reason: "Missing required fields' details" },
        { status: 400 }
      );
    }

    const aiResult = await fraudAgent({
      name: toName,
      phone: toPhone,
      amount,
    });

    let status = "NORMAL";

    if (aiResult.status === "approved") {
      status = "NORMAL";
    }

    if (aiResult.status === "pending") {
      status = "SUSPICIOUS";
    }

    if (aiResult.status === "rejected") {
      status = "FLAGGED";
    }

    const transactionId = "TXN-" + Date.now();

    const response = {
      transactionId,
      status,
      recipient: toName,
      phone: toPhone,
      amount,
      ai: aiResult,
      timestamp: new Date().toISOString(),
    };

    if (status === "NORMAL") {
      response.action = "email_sent";
    }

    if (status === "SUSPICIOUS") {
      response.action = "sent_to_admin_review";
    }

    if (status === "FLAGGED") {
      response.action = "transaction_flagged";
    }

    return Response.json(response);

  } catch (error) {
    console.error(error);

    return Response.json(
      { status: "FLAGGED", error: "Error" },
      { status: 500 }
    );
  }
}