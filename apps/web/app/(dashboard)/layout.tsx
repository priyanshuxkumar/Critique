'use client';

import Navbar from "@/components/Navbar";
import { UserProvider } from "@/context/user.context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UserProvider>
        <div >
          {/* Sidebar */}
          <nav className="w-full sticky top-0 z-40 ">
            <Navbar />
          </nav>

          {/* Main Content */}
          <main className="w-full">{children}</main>
        </div>
      </UserProvider>
    </>
  );
}
