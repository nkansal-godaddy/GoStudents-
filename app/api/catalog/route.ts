import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ssoAuth, ...catalogPayload } = body;

    // Validate required fields
    if (!ssoAuth) {
      return NextResponse.json(
        { error: "SSO authorization token is required" },
        { status: 400 }
      );
    }

    // Call the catalog API from the server side (no CORS issues)
    const catalogResponse = await fetch(
      'https://catalog-query-ext.cp.api.test.godaddy.com/v2/catalog/offers?rateForDisplay=true',
      {
        method: 'POST',
        headers: {
          'Authorization': `sso-jwt ${ssoAuth}`,
          'Content-Type': 'application/json'
        },
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
        return NextResponse.json(
          { error: `API Error (${catalogResponse.status}): ${responseText}` },
          { status: catalogResponse.status }
        );
      }
      responseData = { data: responseText };
    }

    // Return the response from the catalog API
    if (!catalogResponse.ok) {
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

