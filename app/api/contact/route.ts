import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, brief, budget } = body;

    // Validate required fields
    if (!name || !email || !brief) {
      return NextResponse.json(
        { error: "Missing required fields: Name, Email, and Brief are required." },
        { status: 400 }
      );
    }

    // Check if Firebase is actually configured in the environment
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      console.warn("Firebase config is missing. Simulating successful submission.");
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      return NextResponse.json({ success: true, simulated: true });
    }

    // Add document to "contacts" collection
    await addDoc(collection(db, "contacts"), {
      name,
      email,
      company: company || "",
      brief,
      budget: budget || "Under $10k",
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error submitting contact form:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
