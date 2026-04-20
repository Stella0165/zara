import admin from "firebase-admin";
import { fraudAgent } from "@/lib/ai";

const serviceAccount = require("@/lib/serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();

    const { toName, toPhone, amount } = body;

    // required field not fully fill (validation)
    if (!toName || !toPhone || !amount) {
      return Response.json(
        { error: "Missing required fields' details" },
        { status: 400 }
      );
    }

    // invalid phone number format
    if (toPhone.length <9) {
      return Response.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    const phone = toPhone.replace(/\s/g, "");

    // check flagged account
    const flaggedDoc = await db.collection("flaggedAccounts").doc(phone).get();

    if (flaggedDoc.exists) {
      return Response.json({
        status: "FLAGGED",
        reason: "Account already flagged before",
      });
    }

    const aiResult = await fraudAgent.run ({
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

    const transactionId = "TN-" + Date.now();

    // save transaction
    await db.collection("transactions").add({
      transactionId,
      toName,
      toPhone,
      amount: Number(amount),
      status,
      timestamp: new Date(),
    });

    // save the new detected flagged account
    if (status === "FLAGGED") {
      await db.collection("flaggedAccounts").doc(phone).set({
        flagged:true,
        timestamp: new Date(),
      });
    }

    // const response = {
    //   transactionId,
    //   status,
    //   recipient: toName,
    //   phone: toPhone,
    //   amount,
    //   ai: aiResult,
    //   timestamp: new Date().toISOString(),
    // };

    // if (status === "NORMAL") {
    //   response.action = "email_sent";
    // }

    if (status === "SUSPICIOUS") {
      await db.collection("pendingTransactions").add({
        toName,
        toPhone,
        amount,
        ai: aiResult,
        timestamp: new Date(),
      });
      
      // response.action = "sent_to_admin_review";
    }

    if (status === "FLAGGED") {
      // response.action = "transaction_flagged";
      await db.collection("flaggedAccounts").doc(phone).set({
        flagged: true,
        timestamp: new Date(),
      })
    }

    return Response.json ({
      transactionId,
      status,
      ai: aiResult,
    });

  } catch (error) {
  console.error("ERROR:", error);

  return Response.json(
    {
      error: error instanceof Error ? error.message : String(error),
    },
    { status: 500 }
  );
}
}