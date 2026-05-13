import { fetchStores } from "../_actions/stores";
import NavbarComponent from "./Navbar";
import { Store } from "@/types/store";
import { auth } from "@/auth";

export default async function NavbarWrapper() {
  let stores: Store[] = [];

  try {
    stores = await fetchStores();
  } catch (error) {
    console.error('Failed to fetch stores for navbar:', error);
  }

  const session = await auth();
  const isLoggedIn = !!session?.user;
  const userProfile = session?.user
    ? { name: session.user.name ?? "", email: session.user.email ?? "" }
    : undefined;

  return (
    <NavbarComponent
      stores={stores}
      isLoggedIn={isLoggedIn}
      userProfile={userProfile}
    />
  );
}
