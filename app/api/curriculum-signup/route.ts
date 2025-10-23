import { NextResponse } from "next/server";
import { SCHOOLS, type School, type Curriculum } from "@/lib/schools";
import { sendWelcomeEmail } from "@/lib/email-generator";

// Map offer IDs to curriculum information
const OFFER_TO_CURRICULUM = {
  "hackathonGoStudentsWebDesign-webHostingEconomy-conversationsEssential": {
    curriculumId: "web101",
    curriculumName: "Web Design",
    description: "Complete web design toolkit for students learning web development"
  },
  "hackathonGoStudentsWebsiteSecurity-mwpBasic-nortonSmallBusinessStandard": {
    curriculumId: "security",
    curriculumName: "Website Security", 
    description: "Essential security tools for protecting websites and business data"
  },
  "hackathonGoStudentsBusineesAi-wamCommerce-airoAllAccess": {
    curriculumId: "ai-business",
    curriculumName: "Building Businesses with AI",
    description: "AI-powered business tools for modern entrepreneurship"
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { offerId, schoolId, email, customerId, shopperId } = body;

    // Validate required fields
    if (!offerId || !schoolId || !email) {
      return NextResponse.json({ 
        status: "error", 
        message: "Offer ID, School ID, and email are required" 
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

    // Find the school
    const school = SCHOOLS.find(s => s.id === schoolId);
    if (!school) {
      return NextResponse.json({ 
        status: "error", 
        message: "Invalid school selected" 
      }, { status: 400 });
    }

    // Get curriculum information from offer ID
    const curriculumInfo = OFFER_TO_CURRICULUM[offerId as keyof typeof OFFER_TO_CURRICULUM];
    if (!curriculumInfo) {
      return NextResponse.json({ 
        status: "error", 
        message: "Invalid offer selected" 
      }, { status: 400 });
    }

    // Create curriculum object for email generation
    const curriculum: Curriculum = {
      id: curriculumInfo.curriculumId,
      name: curriculumInfo.curriculumName
    };

    // Send curriculum-specific welcome email
    try {
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
        email: email,
        studentName: email.split('@')[0], // Extract name from email
        customerId,
        shopperId,
        offerId
      };

      const emailResult = await sendWelcomeEmail(emailRecipients, emailContext);
      
      if (emailResult.success) {
        console.log('✅ Curriculum-specific email sent successfully:', emailResult.message);
      } else {
        console.log('⚠️ Curriculum email failed:', emailResult.message);
      }
    } catch (error) {
      console.error('Error in curriculum email process:', error);
      // Don't fail the signup if email fails
    }

    return NextResponse.json({ 
      status: "ok", 
      message: `Curriculum-specific welcome email sent for ${curriculumInfo.curriculumName}!` 
    });

  } catch (error) {
    console.error('Error in curriculum signup API:', error);
    return NextResponse.json({ 
      status: "error", 
      message: "Internal server error" 
    }, { status: 500 });
  }
}
