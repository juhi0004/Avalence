import { NextResponse } from "next/server";

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

    // Log submission server-side (replace with your preferred backend/email service)
    console.log("Contact form submission:", {
      name,
      email,
      company: company || "",
      brief,
      budget: budget || "Under $10k",
      submittedAt: new Date().toISOString(),
    });

    // Simulate network delay for UX
    await new Promise((resolve) => setTimeout(resolve, 600));

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Error submitting contact form:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
