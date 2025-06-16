"use client";

import Navbar from "@/components/Home/Navbar/Index";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import React from "react";
import { Provider, useSelector } from "react-redux";
import { store, persistor } from "@/state/store";
import { ApolloProvider } from "@apollo/client";
import client from "@/state/wsClient";
import { themeStatetype } from "@/state/Global";
import AuthWrapper from "@/components/Multipurpose/authSecurity";
import { Toaster } from "@/components/ui/sonner";
import { PersistGate } from "redux-persist/integration/react";
import { Loader2, User } from "lucide-react";
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
 function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-tr from-gray-100 to-gray-200 text-gray-800 dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <div className="text-center">
          <h1 className="text-xl font-semibold">Restoring your session...</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Bringing everything back just for you <User className="inline w-4 h-4 ml-1" />
          </p>
        </div>
      </div>
    </div>
  );
}
const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname: string = usePathname()
  return (
    <ApolloProvider client={client}>
      <PersistGate loading={<LoadingState />} persistor={persistor}>
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
            <Toaster />
          </Provider>
        </SidebarProvider>
      </PersistGate>
    </ApolloProvider>

  );
};

export default DashboardWrapper;
