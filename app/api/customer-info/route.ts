import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    
    const customerId = cookieStore.get('customer_id')?.value;
    const shopperId = cookieStore.get('shopper_id')?.value;
    const email = cookieStore.get('user_email')?.value;
    const schoolId = cookieStore.get('school_id')?.value;
    
    if (!customerId || !shopperId) {
      return NextResponse.json({ 
        authenticated: false,
        message: 'No customer ID found in cookies'
      });
    }
    
    return NextResponse.json({
      authenticated: true,
      customerId,
      shopperId,
      email,
      schoolId,
      message: 'Customer ID retrieved from cookies'
    });
  } catch (error) {
    console.error('Error getting customer info:', error);
    return NextResponse.json({ 
      authenticated: false,
      error: 'Failed to get customer info'
    }, { status: 500 });
  }
}
