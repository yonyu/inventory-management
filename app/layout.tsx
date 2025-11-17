import type { ReactNode } from "react";
import { StoreProvider } from "./StoreProvider";
import AuthSessionProvider from "./SessionProvider";
import { ToastContainer } from 'react-toastify';

import { Inter } from "next/font/google";
import "@/styles/globals.css";
//import styles from "@/styles/layout.module.css";
const inter = Inter({ subsets: ["latin"] });

interface Props {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <AuthSessionProvider>
            <ToastContainer />
            {children}
            {/* <section className={styles.container}>
              <main className={styles.main}>{children}</main>
            </section> */}
          </AuthSessionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
