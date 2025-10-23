import { NextResponse } from "next/server";
import { getAuthJwt } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerId, orderId, idempotentId } = body;

    // Get the auth token from auth.ts (hardcoded value)
    const ssoAuth = await getAuthJwt();
    console.log('🔑 Using JWT Token from auth.ts for FulfillFree');

    // Validate required fields
    if (!ssoAuth) {
      return NextResponse.json(
        { error: "SSO authorization token is required" },
        { status: 400 }
      );
    }

    if (!customerId) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    if (!idempotentId) {
      return NextResponse.json(
        { error: "Idempotent ID is required" },
        { status: 400 }
      );
    }

    console.log('Calling fulfillFree API...');
    console.log('Customer ID:', customerId);
    console.log('Order ID:', orderId);

    // Call the fulfillFree API
    const fulfillUrl = `https://orders-shim-ext.cp.api.test.godaddy.com/v2/customers/${customerId}/orders/${orderId}/fulfillFree`;
    console.log('FulfillFree URL:', fulfillUrl);

    const fulfillResponse = await fetch(fulfillUrl, {
      method: 'POST',
      headers: {
        'Authorization': `sso-jwt ${ssoAuth}`,
        'Idempotent-Id': idempotentId,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        notes: "Student account fulfillfree"
      })
    });

    const responseText = await fulfillResponse.text();
    console.log('FulfillFree API status:', fulfillResponse.status);
    console.log('FulfillFree API response:', responseText);

    // Try to parse as JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      // If not JSON, return as text
      if (!fulfillResponse.ok) {
        console.error('FulfillFree API failed (non-JSON):', responseText);
        return NextResponse.json(
          { error: `API Error (${fulfillResponse.status}): ${responseText}` },
          { status: fulfillResponse.status }
        );
      }
      responseData = { data: responseText };
    }

    // Return the response
    if (!fulfillResponse.ok) {
      console.error('FulfillFree API failed:', responseData);
      return NextResponse.json(
        responseData,
        { status: fulfillResponse.status }
      );
    }

    return NextResponse.json(responseData, { status: fulfillResponse.status });

  } catch (error) {
    console.error('FulfillFree proxy error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: 'Failed to connect to fulfillFree service'
      },
      { status: 500 }
    );
  }
}
