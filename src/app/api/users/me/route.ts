import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(request: Request) {
  console.log("--- DEBUG: Update user API route initiated ---");
  const session = await getServerSession(authOptions);

  if (!session?.jwt || !session.user?.id) {
    console.error("--- DEBUG: Unauthorized access attempt ---");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  console.log("--- DEBUG: Received request body ---", body);

  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  try {
    const res = await fetch(`${STRAPI_URL}/api/users/${session.user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.jwt}`,
      },
      body: JSON.stringify(body),
    });

    console.log("--- DEBUG: Strapi response status ---", res.status);

    if (!res.ok) {
      const errorData = await res.json();
      // This will print the exact error from Strapi
      console.error("--- DEBUG: Strapi API Error ---", errorData);
      throw new Error("Failed to update user in Strapi");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("--- DEBUG: CRITICAL ERROR in API Route ---", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
