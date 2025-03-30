import ThemeToggle from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="p-5">
      <div className="w-full flex justify-end" ><ThemeToggle /></div>
      <h1 className="text-blue-500"> welcome to my shop</h1>
      <Button>Click here!</Button>
    </div>
  );
}