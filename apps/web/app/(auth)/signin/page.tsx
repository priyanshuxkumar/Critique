'use client'

import { LoginForm } from "@/components/login-form";
import Link from "next/link";
import LoginPageImg from "@/components/icons/LoginPageImg";
import { Star } from "lucide-react";
import { useUser } from "@/context/user.context";
import { redirect } from "next/navigation";
import { useEffect } from "react";


export default function LoginPage() {
  const { user, loading } = useUser(); // custom hook or session context

  useEffect(() => {
    if (!loading && user) {
      redirect('/home');
    }
  }, [loading, user]);

  if (loading || user) return null; 
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="#" className="flex items-center gap-2 font-bold text-2xl">
          <Star className="h-6 w-6 text-primary" />
            Critique.
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <LoginPageImg/>
      </div>
    </div>
  )
}
