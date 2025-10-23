import { NextResponse } from "next/server";
import { getAuthJwt } from "@/lib/auth";

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
    const { idempotentId, basketId, ...orderPayload } = body;

    // Get the auth token from auth.ts (hardcoded value)
    const ssoAuth = await getAuthJwt();
    console.log('🔑 Using JWT Token from auth.ts');

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

    if (!basketId) {
      return NextResponse.json(
        { error: "Basket ID is required" },
        { status: 400 }
      );
    }

    // Try to extract customer ID from token, fallback to hardcoded value
    const extractedCustomerId = getCustomerIdFromToken(ssoAuth);
    const customerId = extractedCustomerId || 'f8dcecf0-4ea0-42eb-8805-7bd63eecbbc4';
    
    if (extractedCustomerId) {
      console.log('Using customer ID from token:', extractedCustomerId);
    } else {
      console.log('Using fallback customer ID:', customerId);
    }
    
    // Call the orders shim API from the server side (no CORS issues)
    // Using dynamic basketId in the URL
    const orderUrl = `https://orders-shim-ext.cp.api.test.godaddy.com/v2/customers/${customerId}/orders/${basketId}/add`;
    
    console.log('🚀 ===== CALLING ORDERS API =====');
    console.log('📍 URL:', orderUrl);
    console.log('📦 Full Payload:', JSON.stringify(orderPayload, null, 2));
    console.log('🔑 Headers:');
    console.log('   - Content-Type: application/json');
    console.log('   - Idempotent-Id:', idempotentId);
    console.log('📋 Request Details:');
    console.log('   - Customer ID:', customerId);
    console.log('   - Basket ID:', basketId);
    console.log('   - Currency:', orderPayload.currency);
    console.log('   - Market ID:', orderPayload.marketId);
    console.log('   - Items Count:', orderPayload.items?.length || 0);
    if (orderPayload.items && orderPayload.items.length > 0) {
      orderPayload.items.forEach((item: any, index: number) => {
        console.log(`   - Item ${index + 1}:`, {
          key: item.key,
          catalogInstanceKey: item.item?.catalogInstanceKey
        });
      });
    }
    console.log('==================================');
    
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

