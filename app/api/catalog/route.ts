import { NextResponse } from "next/server";
import { getAuthJwt } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const catalogPayload = body;
    
    // Get the auth token from auth.ts (hardcoded value)
    const ssoAuth = await getAuthJwt();
    console.log('🔑1.*** Full JWT Token from auth.ts:', ssoAuth);
    
    // Validate required fields
    if (!ssoAuth) {
      return NextResponse.json(
        { error: "SSO authorization token is required" },
        { status: 400 }
      );
    }

    // Log request details before calling the API
    const catalogUrl = 'https://catalog-query-ext.cp.api.test.godaddy.com/v2/catalog/offers?rateForDisplay=true';
    const headers = {
      'Authorization': `sso-jwt ${ssoAuth}`,
      'Content-Type': 'application/json'
    };
    
    console.log('🚀 ===== CALLING CATALOG API =====');
    console.log('📍 URL:', catalogUrl);
    console.log('📦 Payload:', JSON.stringify(catalogPayload, null, 2));
    console.log('🔑 Headers:');
    console.log('   - Content-Type:', 'application/json');
    console.log('   - Authorization (first 50 chars):', `sso-jwt ${ssoAuth?.substring(0, 50)}...`);
    console.log('🔑 Full JWT Token:', ssoAuth);
    console.log('🔑 JWT Token Length:', ssoAuth?.length);
    console.log('==================================');

    // Call the catalog API from the server side (no CORS issues)
    const catalogResponse = await fetch(
      catalogUrl,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(catalogPayload)
      }
    );

    const responseText = await catalogResponse.text();
    
    // Try to parse as JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      // If not JSON, return as text
      if (!catalogResponse.ok) {
        // Log JWT token on 401 errors
        if (catalogResponse.status === 401) {
          console.error('❌ Catalog API 401 Unauthorized Error');
          console.error('JWT Token used:', ssoAuth);
          console.error('JWT Token length:', ssoAuth?.length);
          console.error('First 50 chars:', ssoAuth?.substring(0, 50));
          console.error('Last 50 chars:', ssoAuth?.substring(ssoAuth.length - 50));
        }
        return NextResponse.json(
          { error: `API Error (${catalogResponse.status}): ${responseText}` },
          { status: catalogResponse.status }
        );
      }
      responseData = { data: responseText };
    }

    // Return the response from the catalog API
    if (!catalogResponse.ok) {
      // Log JWT token on 401 errors
      if (catalogResponse.status === 401) {
        console.error('❌ Catalog API 401 Unauthorized Error');
        console.error('JWT Token used:', ssoAuth);
        console.error('JWT Token length:', ssoAuth?.length);
        console.error('First 50 chars:', ssoAuth?.substring(0, 50));
        console.error('Last 50 chars:', ssoAuth?.substring(ssoAuth.length - 50));
        console.error('Response body:', responseData);
      }
      return NextResponse.json(
        responseData,
        { status: catalogResponse.status }
      );
    }

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Catalog proxy error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: 'Failed to connect to catalog service'
      },
      { status: 500 }
    );
  }
}

