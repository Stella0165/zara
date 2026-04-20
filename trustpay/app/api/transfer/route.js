import { db } from "@/lib/firebaseAdmin";
import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { fraudAgent } from "@/lib/ai";

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

    // check flagged account
    const flaggedAcc = doc(db, "flaggedAccounts", toPhone);
    const flaggedDetected = await getDoc(flaggedAcc);

    if (flaggedDetected.exists()) {
      return Response.json({
        status: "FLAGGED",
        reason: "Account already flagged before",
      });
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

    const transactionId = "TN-" + Date.now();

    // save transaction
    await addDoc(collection(db, "transactions"), {
      transactionId,
      toName,
      toPhone,
      amount: Number(amount),
      status,
      timestamp: new Date(),
    });

    // save the new detected flagged account
    if (status === "FLAGGED") {
      await setDoc(doc(db, "flaggedAccounts", toPhone), {
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
      await addDoc(collection(db, "pendingTransactions"), {
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
      await setDoc(doc(db, "flaggedAccounts", toPhone), {
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
    console.error(" TRANSFER CRASH:", error);

    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}