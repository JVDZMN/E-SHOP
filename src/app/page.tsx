import ThemeToggle from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth(); 
  return (
    <div className="p-5">
      <div className="w-full flex justify-end space-x-2 items-center">
        {userId &&
          <div className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600">
            < UserButton />
          </div>
        }
        <ThemeToggle />
      </div>

      <h1 className="text-blue-500 mt-6 text-2xl font-bold">Welcome to my shop</h1>
      <Button className="mt-4">Click here!</Button>
    </div>
  );
}
