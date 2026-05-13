'use client';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { useState } from "react";
import { Store } from "@/types/store";

interface NavbarComponentProps {
  stores: Store[];
  isLoggedIn?: boolean;
  userProfile?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export default function NavbarComponent({ 
  stores, 
  isLoggedIn = false, 
  userProfile 
}: NavbarComponentProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isBordered maxWidth="xl" className="bg-white/80 backdrop-blur-md shadow-sm">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🍺</span>
            <span className="font-bold text-xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              BETTER BEER
            </span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/" className="font-medium hover:text-primary transition-colors">
            Home
          </Link>
        </NavbarItem>
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent data-[hover=true]:bg-transparent font-medium"
                radius="sm"
                variant="light"
                endContent={<span className="text-xs">▼</span>}
              >
                Stores
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="Store selection"
            className="w-[340px]"
            itemClasses={{
              base: "gap-4 data-[hover=true]:bg-primary-50",
            }}
          >
            {stores.length === 0 ? (
              <DropdownItem key="no-stores" isReadOnly>
                No stores available
              </DropdownItem>
            ) : (
              stores.map((store) => (
                <DropdownItem
                  key={store.id}
                  href={`/stores/${store.id}`}
                  description={`View ${store.name}'s beer selection`}
                >
                  {store.name}
                </DropdownItem>
              ))
            )}
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        {isLoggedIn && userProfile ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name={userProfile.name}
                size="sm"
                src={userProfile.avatarUrl}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{userProfile.email}</p>
              </DropdownItem>
              <DropdownItem key="my-profile" href="/profile">
                My Profile
              </DropdownItem>
              <DropdownItem key="settings">Settings</DropdownItem>
              <DropdownItem key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <NavbarItem>
            <Button as={Link} color="primary" href="/login" variant="shadow" className="font-semibold">
              Sign In
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem>
          <Link
            color="foreground"
            className="w-full"
            href="/"
            size="lg"
          >
            Home
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <p className="text-sm font-semibold text-default-500 mt-4 mb-2">STORES</p>
        </NavbarMenuItem>
        {stores.length === 0 ? (
          <NavbarMenuItem>
            <p className="text-sm text-default-400">No stores available</p>
          </NavbarMenuItem>
        ) : (
          stores.map((store) => (
            <NavbarMenuItem key={store.id}>
              <Link
                color="foreground"
                className="w-full"
                href={`/stores/${store.id}`}
                size="lg"
              >
                {store.name}
              </Link>
            </NavbarMenuItem>
          ))
        )}
        {isLoggedIn && userProfile && (
          <>
            <NavbarMenuItem>
              <p className="text-sm font-semibold text-default-500 mt-4 mb-2">ACCOUNT</p>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link
                color="foreground"
                className="w-full"
                href="/profile"
                size="lg"
              >
                My Profile
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link
                color="danger"
                className="w-full"
                href="/logout"
                size="lg"
              >
                Log Out
              </Link>
            </NavbarMenuItem>
          </>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
