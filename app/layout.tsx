import type { ReactNode } from "react";
import { StoreProvider } from "./StoreProvider";
import AuthSessionProvider from "./SessionProvider";

import "./styles/globals.css";
import styles from "./styles/layout.module.css";

interface Props {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <AuthSessionProvider>
            <section className={styles.container}>
              <main className={styles.main}>{children}</main>
            </section>
          </AuthSessionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
