import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.jwt || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Get all the possible fields from the request body
  const { username, email, firstName, lastName } = await request.json();
  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  try {
    const res = await fetch(`${STRAPI_URL}/api/users/${session.user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.jwt}`,
      },
      // Only send the fields that were provided
      body: JSON.stringify({ username, email, firstName, lastName }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Strapi API Error:", errorData);
      return NextResponse.json(
        { message: "Failed to update user" },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Internal API Route Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
