import { fetchStores } from "../_actions/stores";
import NavbarComponent from "./Navbar";
import { Store } from "@/types/store";

export default async function NavbarWrapper() {
  let stores: Store[] = [];
  
  try {
    stores = await fetchStores();
  } catch (error) {
    console.error('Failed to fetch stores for navbar:', error);
  }

  // TODO: Replace with actual authentication check
  // For now, we'll set isLoggedIn to false
  const isLoggedIn = false;
  
  // TODO: Fetch user profile from your auth system
  const userProfile = isLoggedIn ? {
    name: "John Doe",
    email: "john@example.com",
    avatarUrl: "https://i.pravatar.cc/150?u=john@example.com"
  } : undefined;

  return (
    <NavbarComponent 
      stores={stores} 
      isLoggedIn={isLoggedIn}
      userProfile={userProfile}
    />
  );
}
