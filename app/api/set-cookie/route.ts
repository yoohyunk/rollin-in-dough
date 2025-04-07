import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { verifyIdToken } from "@/firebase/firebaseAdmin";

export async function POST(request: Request) {
  try {
    // Parse JSON body or however you get the token
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized", error: "No token found" },
        { status: 401 }
      );
    }

    await verifyIdToken(token);

    // Use the named export 'serialize'
    const serializedCookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "strict",
      path: "/",
    });

    const response = NextResponse.json({ message: "Cookie set successfully" });
    response.headers.set("Set-Cookie", serializedCookie);

    return response;
  } catch (error) {
    console.error("Error setting cookie:", error);
    return NextResponse.json(
      { message: "Failed to set cookie", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const expiredCookie = serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    expires: new Date(0), // Expired
    sameSite: "strict",
    path: "/",
  });

  const response = NextResponse.json({
    message: "Cookie deleted successfully",
  });
  response.headers.set("Set-Cookie", expiredCookie);

  return response;
}
