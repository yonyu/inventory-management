import type { Metadata } from "next";
//import { Counter } from "./components/counter/Counter";
import LoginPage from "./login/page";

export default function IndexPage() {
  // return <Counter />;
  return (
    <>
      <LoginPage />
    </>
  );
}

export const metadata: Metadata = {
  title: "Redux Toolkit",
};
