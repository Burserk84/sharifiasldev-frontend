import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // 1. Get the session from the server-side to ensure the user is authenticated
  const session = await getServerSession();
  // 2. Check for a valid session and Strapi JWT
  if (!session?.jwt || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 3. Get the comment data from the request body
  const { content, postId, contentType } = await request.json();
  if (!content || !postId || !contentType) {
    return NextResponse.json(
      { message: "Missing required fields." },
      { status: 400 }
    );
  }

  // Use the 'postId' variable which now holds the ID for both products and posts
  const strapiEndpoint = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/comments/${contentType}:${postId}`;

  try {
    // 4. Send the authenticated request to Strapi from our server
    const strapiRes = await fetch(strapiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.jwt}`,
      },
      body: JSON.stringify({
        content: content,
        author: {
          id: session.user.id,
          name: session.user.username || session.user.email,
          email: session.user.email,
        },
      }),
    });

    if (!strapiRes.ok) {
      const errorData = await strapiRes.json();
      console.error("Strapi API Error:", errorData);
      return NextResponse.json(
        { message: "Failed to post comment to Strapi" },
        { status: 500 }
      );
    }

    const data = await strapiRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Internal API Route Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
