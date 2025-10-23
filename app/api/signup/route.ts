import { NextResponse } from "next/server";
import { SCHOOLS, type School, type Curriculum } from "@/lib/schools";
import { sendWelcomeEmail } from "@/lib/email-generator";

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const latency = Number(searchParams.get("latency") ?? "600");
  const outcome = (searchParams.get("outcome") ?? "success") as "success" | "error";

  const body = await req.json().catch(() => ({}));
  // Basic shape check
  if (!body?.email || !body?.schoolId || !body?.curriculumId) {
    await new Promise(r => setTimeout(r, latency));
    return NextResponse.json({ status: "error", message: "Missing required fields." }, { status: 400 });
  }

  await new Promise(r => setTimeout(r, latency));
  if (outcome === "error") {
    return NextResponse.json({ status: "error", message: "Mock API: forced error" }, { status: 400 });
  }

  // Send welcome email after successful account creation
  try {
    const school = SCHOOLS.find(s => s.id === body.schoolId);
    const curriculum = school?.curricula.find(c => c.id === body.curriculumId);
    
    if (school && curriculum) {
      const emailRecipients = [
        "dann@godaddy.com",
        "qwu@godaddy.com", 
        "sbhandarkar@godaddy.com",
        "nkansal@godaddy.com",
        "dann@spohn.me"
      ];

      const emailContext = {
        school,
        curriculum,
        email: body.email,
        studentName: body.email.split('@')[0] // Extract name from email
      };

      const emailResult = await sendWelcomeEmail(emailRecipients, emailContext);
      
      if (emailResult.success) {
        console.log('✅ Welcome email sent successfully:', emailResult.message);
      } else {
        console.log('⚠️ Welcome email failed:', emailResult.message);
      }
    }
  } catch (error) {
    console.error('Error in welcome email process:', error);
    // Don't fail the signup if email fails
  }

  return NextResponse.json({ 
    status: "ok", 
    message: "Account created! Welcome email sent to the team. Verify your student email." 
  });
}
