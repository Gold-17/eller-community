import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import { Inter } from "next/font/google";
import { TopBar, BottomBar, LeftsideBar, RightsideBar } from "@/components/shared";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Eller",
  description: "This is a scalable, advanced Next.js application.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <TopBar />

          <main className="flex flex-row">
            <LeftsideBar />

            <section className="main-container">
               <div className="w-full max-w-4xl">
                {children}
               </div>
            </section>

            <RightsideBar />
          </main>

          <BottomBar />
        </body>
      </html>
    </ClerkProvider>
  );
}
