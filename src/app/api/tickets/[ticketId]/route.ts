import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: { ticketId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { ticketId } = params;
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  
  try {
    const ticketRes = await fetch(
      `${STRAPI_URL}/api/tickets/${ticketId}?populate=messages.author,user`,
      {
        headers: {
          Authorization: `Bearer ${session.jwt}`,
        },
        cache: 'no-store'
      }
    );
    
    if (!ticketRes.ok) {
      return NextResponse.json({ message: 'Failed to fetch ticket' }, { status: ticketRes.status });
    }
    
    const ticketData = await ticketRes.json();

    // Security Check: Make sure the fetched ticket belongs to the logged-in user
    if (ticketData.data.attributes.user.data.id !== session.user.id) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(ticketData.data);

  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}