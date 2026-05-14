import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code;
  const ip = request.headers.get("x-forwarded-for") || "";
  const userAgent = request.headers.get("user-agent") || "";
  
  try {
    // Call backend to track click
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/v1/public/referral/${code}`, {
      headers: {
        "x-forwarded-for": ip,
        "user-agent": userAgent,
      }
    });
  } catch (error) {
    console.error("Failed to track referral click:", error);
  }

  // Redirect to signup
  const response = NextResponse.redirect(new URL("/auth/signup?intent=growth-partner", request.url));
  
  // Set cookie for referral code tracking
  response.cookies.set("folaignite_ref", code.toUpperCase(), {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    httpOnly: false, // Must be accessible to client JS in signup form
    path: "/",
    sameSite: "lax"
  });

  return response;
}
