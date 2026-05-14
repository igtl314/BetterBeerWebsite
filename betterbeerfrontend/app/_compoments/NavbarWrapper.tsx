import NavbarComponent from "./Navbar";
import { auth } from "@/auth";

export default async function NavbarWrapper() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const userName = session?.user?.name ?? undefined;

  return (
    <NavbarComponent
      isLoggedIn={isLoggedIn}
      userName={userName}
    />
  );
}
