import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  console.log("\n--- [API Route] GET /api/tickets request received ---");

  try {
    const session = await getServerSession(authOptions);
    console.log("[API Route] Session object retrieved:", session);

    if (!session?.user?.id) {
      console.error("[API Route] Unauthorized: No session or user ID found.");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    console.log(
      `[API Route] Session valid for user ID: ${userId}. Fetching tickets...`
    );

    const STRAPI_URL =
      process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    const fetchUrl = `${STRAPI_URL}/api/tickets?filters[user][id][$eq]=${userId}&populate=*`;

    console.log("[API Route] Fetching from Strapi URL:", fetchUrl);

    const ticketsRes = await fetch(fetchUrl, { cache: "no-store" });
    console.log(
      "[API Route] Received response from Strapi. Status:",
      ticketsRes.status
    );

    if (!ticketsRes.ok) {
      const errorData = await ticketsRes.text(); // Get raw text in case it's not JSON
      console.error("[API Route] Strapi returned an error:", errorData);
      return NextResponse.json(
        { message: "Failed to fetch tickets" },
        { status: 500 }
      );
    }

    const ticketsData = await ticketsRes.json();
    console.log(
      "[API Route] Fetched tickets from Strapi:",
      JSON.stringify(ticketsData, null, 2)
    );

    return NextResponse.json(ticketsData.data);
  } catch (error) {
    console.error("[API Route] CRITICAL ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// This new function handles creating a ticket
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { title, department, message } = await request.json();
  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  // The payload for our new Ticket
  const payload = {
    data: {
      title: title,
      department: department,
      status: "Open", // New tickets are always 'Open'
      user: session.user.id,
      messages: [
        {
          message: message,
          isResponse: false,
          author: session.user.id,
        },
      ],
    },
  };

  try {
    const res = await fetch(`${STRAPI_URL}/api/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.jwt}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Strapi API Error:", errorData);
      return NextResponse.json(
        { message: "Failed to create ticket" },
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
