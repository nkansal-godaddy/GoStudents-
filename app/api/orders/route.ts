import { NextResponse } from "next/server";

// Helper function to extract customer ID from JWT token
function getCustomerIdFromToken(ssoToken: string): string | null {
  try {
    const parts = ssoToken.split('.');
    if (parts.length !== 3) return null;
    
    // Decode the payload (middle part of JWT)
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    console.log('Decoded JWT payload:', payload);
    
    // Try common field names for customer ID
    return payload.customerId || payload.sub || payload.customer_id || payload.customerGuid || null;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ssoAuth, idempotentId, ...orderPayload } = body;

    // Validate required fields
    if (!ssoAuth) {
      return NextResponse.json(
        { error: "SSO authorization token is required" },
        { status: 400 }
      );
    }

    if (!idempotentId) {
      return NextResponse.json(
        { error: "Idempotent ID is required" },
        { status: 400 }
      );
    }

    // Try to extract customer ID from token, fallback to hardcoded value
    const extractedCustomerId = getCustomerIdFromToken(ssoAuth);
    const customerId = extractedCustomerId || '3ded37c5-b53e-4da1-8ac3-cfccb62367e4';
    
    if (extractedCustomerId) {
      console.log('Using customer ID from token:', extractedCustomerId);
    } else {
      console.log('Using fallback customer ID:', customerId);
    }
    
    // Call the orders shim API from the server side (no CORS issues)
    // Using "cart" as the literal endpoint instead of a dynamic basketId
    const orderUrl = `https://orders-shim-ext.cp.api.test.godaddy.com/v2/customers/${customerId}/orders/cart/add`;
    console.log('Calling orders API:', orderUrl);
    console.log('Order payload:', JSON.stringify(orderPayload, null, 2));
    
    const orderResponse = await fetch(orderUrl, {
      method: 'POST',
      headers: {
        'Authorization': `sso-jwt ${ssoAuth}`,
        'Idempotent-Id': idempotentId,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderPayload)
    });

    const responseText = await orderResponse.text();
    console.log('Orders API status:', orderResponse.status);
    console.log('Orders API response:', responseText);
    
    // Try to parse as JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      // If not JSON, return as text
      if (!orderResponse.ok) {
        console.error('Orders API failed (non-JSON):', responseText);
        return NextResponse.json(
          { error: `API Error (${orderResponse.status}): ${responseText}` },
          { status: orderResponse.status }
        );
      }
      responseData = { data: responseText };
    }

    // Return the response from the orders API
    if (!orderResponse.ok) {
      console.error('Orders API failed:', responseData);
      return NextResponse.json(
        responseData,
        { status: orderResponse.status }
      );
    }

    return NextResponse.json(responseData, { status: orderResponse.status });

  } catch (error) {
    console.error('Orders proxy error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: 'Failed to connect to orders service'
      },
      { status: 500 }
    );
  }
}

