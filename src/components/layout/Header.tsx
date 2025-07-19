import { getServerSession } from "next-auth";
import HeaderClient from "./HeaderClient";

/**
 * This is a Server Component that fetches the user's session data.
 * It then renders the HeaderClient component, passing the session data as a prop.
 */
export default async function Header() {
  const session = await getServerSession();
  return <HeaderClient session={session} />;
}
