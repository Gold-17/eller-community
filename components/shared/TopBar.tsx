"use client";

import Image from "next/image";
import Link from "next/link";

import { currentUser } from "@clerk/nextjs";
import { OrganizationSwitcher, SignOutButton, SignedIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const TopBar = () => {
  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/eller-logo.svg" alt="Logo" width={50} height={50} />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Eller</p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image
                  src="/assets/logout.svg"
                  alt="Logout"
                  width={28}
                  height={28}
                />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>

        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: { oraganizationSwitcherTrigger: "py-2 px-4" },
          }}
        />
      </div>
    </nav>
  );
};

export default TopBar;
