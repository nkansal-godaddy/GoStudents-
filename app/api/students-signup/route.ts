import { NextResponse } from "next/server";
import { SCHOOLS, type School, type Curriculum } from "@/lib/schools";
import { sendWelcomeEmail } from "@/lib/email-generator";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { schoolId, email } = body;

    // Validate required fields
    if (!schoolId || !email) {
      return NextResponse.json({ 
        status: "error", 
        message: "School ID and email are required" 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        status: "error", 
        message: "Invalid email format" 
      }, { status: 400 });
    }

    // Find the school and get default curriculum
    const school = SCHOOLS.find(s => s.id === schoolId);
    if (!school) {
      return NextResponse.json({ 
        status: "error", 
        message: "Invalid school selected" 
      }, { status: 400 });
    }

    const curriculum = school.curricula[0]; // Use first curriculum as default

    // Email sending moved to curriculum selection - no longer sending here
    console.log('✅ Students signup successful - email will be sent when curriculum is selected');

    return NextResponse.json({ 
      status: "ok", 
      message: "Students signup successful! Please select your curriculum to receive your welcome email." 
    });

  } catch (error) {
    console.error('Error in students signup API:', error);
    return NextResponse.json({ 
      status: "error", 
      message: "Internal server error" 
    }, { status: 500 });
  }
}
