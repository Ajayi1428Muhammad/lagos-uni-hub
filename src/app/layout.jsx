import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/navbar";
import Footer from "@/app/footer";
import Floating from "@/app/components/floating";
import ToastProvider from "@/app/toast-provider";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lagos Uni Hub",
  description: "Building the future of campus marketplace",
  verification: {
    google: "PvLYFCZEqzTa1doOmnE3gS7O5OGhbqm24N17xOT9V7o",
  },
};

export default async function RootLayout({ children }) {
  const session = await auth();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full  flex flex-col bg-gray-50">
        {/* <AuthProvider> */}
          <Navbar session={session} />
          <ToastProvider />
          <main className="flex-1 px-4 pt-16 pb-24">{children}</main>
          <Floating />
          <Footer />
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
