import ThemeToggle from "@/components/shared/theme-toggle";
import SyncUser from "@/components/SyncUser";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="p-5">
      {/* ✅ NAVBAR */}
      <header className="w-full flex justify-between items-center border-b pb-4 mb-6">
        <Link href="/" className="text-xl font-bold text-blue-600">
          <Image
              src="/home-page-header-logo-white.png"
              alt="E-Shop Icon"
              width={64}
              height={64}
              className="block dark:hidden w-12 h-12 lg:w-16 lg:h-16"
            />
          <Image
            src="/home-page-header-logo.png"
            alt="E-Shop Icon White"
            width={64}
            height={64}
            className="hidden dark:block w-12 h-12 lg:w-16 lg:h-16"
          />
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {userId ? (
            <div className="flex items-center gap-2">
              <SyncUser />
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ✅ PAGE CONTENT */}
      <h1 className="text-blue-500 text-2xl font-bold">Welcome to my shop</h1>
      <Button className="mt-4">Click here!</Button>
    </div>
  );
}
