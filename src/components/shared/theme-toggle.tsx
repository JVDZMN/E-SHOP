"use client"
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button'

import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { setTheme } = useTheme();
    return (
      <DropdownMenu  >
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className='w-10 h-10 rounded-full dark:border-x-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-800'>
                    <FaSun className=' text-yellow-300 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
                    <FaMoon className='absolute  text-white rotate-90 scale-0 transition-all dark:-rotate-0 dark:scale-100' />
                    <span className='sr-only'>Toggle theme</span>
                </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={()=> setTheme('light')}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={()=> setTheme('dark')}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={()=> setTheme('system')}>System</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>

  )
}
