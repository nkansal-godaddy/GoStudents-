import { SCHOOLS, type School, type Curriculum } from './schools';
import nodemailer from 'nodemailer';

interface EmailContext {
  school: School;
  curriculum: Curriculum;
  email: string;
  studentName: string;
}

interface ParsedName {
  firstName: string;
  lastName: string;
  fullName: string;
  greeting: string;
}

/**
 * Creates SMTP transporter for sending emails
 */
function createTransporter() {
  // Check if SMTP is configured
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log('⚠️ SMTP not configured. Using mock email sending.');
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

/**
 * Parses student name from email address using AI-like logic
 */
export function parseStudentName(email: string): ParsedName {
  // Extract the local part (before @) of the email
  const localPart = email.split('@')[0].toLowerCase();
  
  // If it's a single word longer than 4 characters, treat as first name
  if (localPart.length > 4 && !localPart.includes('.') && !localPart.includes('_') && !localPart.includes('-') && !localPart.includes('+')) {
    return {
      firstName: capitalizeFirst(localPart),
      lastName: '',
      fullName: capitalizeFirst(localPart),
      greeting: `Hi ${capitalizeFirst(localPart)}!`
    };
  }
  
  // Common patterns and their interpretations
  const patterns = [
    // firstname.lastname pattern
    { regex: /^([a-z]+)\.([a-z]+)$/, type: 'firstname.lastname' },
    // firstname_lastname pattern  
    { regex: /^([a-z]+)_([a-z]+)$/, type: 'firstname_lastname' },
    // firstname-lastname pattern
    { regex: /^([a-z]+)-([a-z]+)$/, type: 'firstname-lastname' },
    // firstname+lastname pattern
    { regex: /^([a-z]+)\+([a-z]+)$/, type: 'firstname+lastname' },
    // firstinitial.lastname pattern (e.g., j.smith)
    { regex: /^([a-z])\.([a-z]+)$/, type: 'initial.lastname' },
    // firstinitiallastname pattern (e.g., jsmith) - only for very short first parts (1-2 chars) with longer last parts
    { regex: /^([a-z]{1,2})([a-z]{4,})$/, type: 'initiallastname' },
    // single name (treat as first name) - moved to end to avoid conflicts
    { regex: /^([a-z]+)$/, type: 'firstname' },
  ];

  for (const pattern of patterns) {
    const match = localPart.match(pattern.regex);
    if (match) {
      switch (pattern.type) {
        case 'firstname.lastname':
        case 'firstname_lastname':
        case 'firstname-lastname':
        case 'firstname+lastname':
          return {
            firstName: capitalizeFirst(match[1]),
            lastName: capitalizeFirst(match[2]),
            fullName: `${capitalizeFirst(match[1])} ${capitalizeFirst(match[2])}`,
            greeting: `Hi ${capitalizeFirst(match[1])}!`
          };
        
        case 'initial.lastname':
        case 'initiallastname':
          return {
            firstName: capitalizeFirst(match[1]),
            lastName: capitalizeFirst(match[2]),
            fullName: `${capitalizeFirst(match[1])}. ${capitalizeFirst(match[2])}`,
            greeting: `Hello ${capitalizeFirst(match[2])}!`
          };
        
        case 'firstname':
          return {
            firstName: capitalizeFirst(match[1]),
            lastName: '',
            fullName: capitalizeFirst(match[1]),
            greeting: `Hi ${capitalizeFirst(match[1])}!`
          };
      }
    }
  }

  // Fallback: treat entire local part as first name
  return {
    firstName: capitalizeFirst(localPart),
    lastName: '',
    fullName: capitalizeFirst(localPart),
    greeting: `Hi ${capitalizeFirst(localPart)}!`
  };
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates AI-powered welcome email content based on context
 */
export function generateWelcomeEmail(context: EmailContext): string {
  const { school, curriculum, email, studentName } = context;
  const parsedName = parseStudentName(email);
  
  // Get school-specific benefits and context
  const schoolBenefits = getSchoolBenefits(school);
  const curriculumContext = getCurriculumContext(curriculum);
  
  const emailContent = `
Subject: Welcome to GoStudents! Your Digital Journey Starts Here 🚀

${parsedName.greeting}

Congratulations on joining GoStudents by GoDaddy! We're thrilled to welcome you as a student from ${school.name} and excited to support your journey in ${curriculum.name}.

🎓 What's Next?

As a ${school.name} student, you now have access to:

${schoolBenefits.map(benefit => `• ${benefit}`).join('\n')}

📚 Your ${curriculum.name} Focus

${curriculumContext}

🌐 Your Professional Hosting & Site Builder

You'll receive access to your professional hosting and site builder within 24-48 hours. This will be your digital portfolio space where you can:

• Showcase your ${curriculum.name.toLowerCase()} projects
• Build your professional online presence  
• Connect with potential employers and clients
• Practice real-world web development skills

🚀 Getting Started

1. Check your email for hosting setup instructions
2. Access your hosting dashboard
3. Start building your first project
4. Join our student community for support and networking

💡 Pro Tip

Many GoStudents graduates have successfully converted their student portfolios into professional websites and even started their own web development businesses. You're not just getting free tools – you're building the foundation for your future career!

Questions? Our support team is here to help at students@godaddy.com.

Welcome to the GoStudents family!

Best regards,
The GoStudents Team
GoDaddy

---
This email was generated for ${parsedName.fullName} (${email}) from ${school.name} - ${curriculum.name}
  `.trim();

  return emailContent;
}

function getSchoolBenefits(school: School): string[] {
  const baseBenefits = [
    "Professional hosting with our site builder",
    "Student portfolio templates",
    "Access to GoDaddy's developer tools",
    "Priority support for students"
  ];

  // Add school-specific benefits
  switch (school.id) {
    case 'asu':
      return [
        ...baseBenefits,
        "ASU-specific project templates",
        "Integration with ASU's career services",
        "Access to ASU alumni network"
      ];
    case 'uofa':
      return [
        ...baseBenefits,
        "UArizona-specific project templates", 
        "Integration with UArizona's career services",
        "Access to UArizona alumni network"
      ];
    case 'nau':
      return [
        ...baseBenefits,
        "NAU-specific project templates",
        "Integration with NAU's career services", 
        "Access to NAU alumni network"
      ];
    default:
      return baseBenefits;
  }
}

function getCurriculumContext(curriculum: Curriculum): string {
  switch (curriculum.id as string) {
    case 'web101':
      return `Perfect! Web Development 101 is an excellent foundation. You'll be building real websites from day one, and your GoStudents hosting will be the perfect place to showcase your HTML, CSS, and JavaScript projects.`;
    case 'ecom':
      return `Great choice! E-Commerce Fundamentals will teach you how to build and manage online stores. Your GoStudents hosting will be perfect for creating your first e-commerce project.`;
    case 'entre':
      return `Excellent! Entrepreneurship for Creators will help you turn your ideas into profitable businesses. Your GoStudents hosting can become your first business website.`;
    case 'wpbuilder':
      return `Smart move! WordPress Builder Lab will give you powerful website creation skills. Your GoStudents hosting will be ideal for building professional WordPress sites.`;
    case 'marketing':
      return `Fantastic! Digital Marketing Basics will equip you with valuable marketing skills. Your GoStudents hosting can showcase your marketing campaigns and strategies.`;
    case 'cloud':
      return `Great choice! Cloud Hosting Essentials will teach you modern hosting and deployment. Your GoStudents hosting will be perfect for practicing cloud technologies.`;
    case 'design':
      return `Excellent! No-Code Site Design Studio will help you create beautiful websites without coding. Your GoStudents hosting will showcase your design skills.`;
    case 'general':
      return `Perfect! The General Track gives you flexibility to explore different areas. Your GoStudents hosting will be your canvas for any project you choose.`;
    case 'security':
      return `Excellent choice! Website Security will teach you how to protect websites and business data. Your GoStudents hosting will be perfect for implementing security best practices and monitoring tools.`;
    case 'ai-business':
      return `Fantastic! Building Businesses with AI will equip you with cutting-edge AI tools for modern entrepreneurship. Your GoStudents hosting will be ideal for showcasing AI-powered business solutions and e-commerce platforms.`;
    default:
      return `Your studies will provide excellent preparation for building professional websites and digital projects.`;
  }
}

/**
 * Sends welcome email using SMTP or mock
 */
export async function sendWelcomeEmail(
  to: string[], 
  context: EmailContext
): Promise<{ success: boolean; message: string }> {
  try {
    const emailContent = generateWelcomeEmail(context);
    const transporter = createTransporter();
    
    // If SMTP is not configured, use mock sending
    if (!transporter) {
      console.log('📧 MOCK EMAIL SENDING');
      console.log('BCC:', to.join(', '));
      console.log('Subject: Welcome to GoStudents! Your Digital Journey Starts Here 🚀');
      console.log('Content:', emailContent);
      console.log('---');
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: `Mock welcome email sent to ${to.length} recipients for ${context.studentName}`
      };
    }

    // Real email sending with SMTP
    console.log('📧 SENDING REAL EMAIL');
    console.log('BCC:', to.join(', '));
    
    const mailOptions = {
      from: {
        name: process.env.FROM_NAME || 'GoStudents Team',
        address: process.env.FROM_EMAIL || process.env.SMTP_USER || 'noreply@gostudents.com'
      },
      to: process.env.FROM_EMAIL || process.env.SMTP_USER || 'noreply@gostudents.com', // Send to self
      bcc: to.join(', '), // BCC all recipients
      subject: 'Welcome to GoStudents! Your Digital Journey Starts Here 🚀',
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Real email sent successfully:', info.messageId);
    console.log('Response:', info.response);
    
    return {
      success: true,
      message: `Real welcome email sent to ${to.length} recipients for ${context.studentName} (Message ID: ${info.messageId})`
    };
    
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return {
      success: false,
      message: `Failed to send welcome email: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
