"use client";

import Navbar from "@/components/Home/Navbar/Index";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import React from "react";
import { Provider, useSelector } from "react-redux";
import { store } from "@/state/store";
import { ApolloProvider } from "@apollo/client";
import client from "@/state/wsClient";
import { themeStatetype } from "@/state/Global";
import AuthWrapper from "@/components/Multipurpose/authSecurity";
import { Toaster } from "@/components/ui/sonner";
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const darkmode = useSelector((state: { global: themeStatetype }) => state.global.darkMode)
  const pathname: string = usePathname()
  const ExcludedNavigationBarPages = ["/login", "/register", "/forgot-password", "/reset-password", '/ai-assistance'];

  // Check if the pathname matches any of the excluded pages or starts with '/share/'
  const showNavbar = ExcludedNavigationBarPages.some(page => pathname.startsWith(page)) || pathname.startsWith('/groups') || pathname.startsWith("/share/") || pathname.startsWith("/auth");

  React.useEffect(() => {
    if (darkmode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkmode]);

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
      <main
        className={`flex w-full flex-col bg-gray-50 dark:bg-black dark:text-white`}
      >
        {
          !showNavbar && <Navbar />
        }
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname: string = usePathname()
  return (

    <ApolloProvider client={client}>
      <SidebarProvider>
        <Provider store={store}>
          {
            pathname.includes('/ai-assistance') && <SidebarTrigger />
          }
          <DashboardLayout>
            <AuthWrapper>
              {children}
            </AuthWrapper>
          </DashboardLayout>
          <Toaster/>
        </Provider>
      </SidebarProvider>
    </ApolloProvider>

  );
};

export default DashboardWrapper;
