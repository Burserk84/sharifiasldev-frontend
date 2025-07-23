import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  console.log("--- DEBUG: Change Password API route initiated ---");

  try {
    const session = await getServerSession(authOptions);
    console.log(
      "--- DEBUG: Session object retrieved ---",
      session ? "OK" : "Not Found"
    );

    if (!session?.jwt) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("--- DEBUG: Request body parsed ---", body);

    const { currentPassword, newPassword, confirmNewPassword } = body;
    const STRAPI_URL =
      process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

    console.log("--- DEBUG: Sending request to Strapi... ---");
    const res = await fetch(`${STRAPI_URL}/api/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.jwt}`,
      },
      body: JSON.stringify({
        currentPassword: currentPassword,
        password: newPassword,
        passwordConfirmation: confirmNewPassword,
      }),
    });

    console.log(
      "--- DEBUG: Received response from Strapi. Status:",
      res.status
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.error.message },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("--- DEBUG: CRITICAL ERROR in API Route ---", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
