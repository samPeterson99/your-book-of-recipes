import { ReactNode } from "react";
import Nav from "./Nav";

type LayoutProps = { children?: ReactNode };

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="pageContainer">
      <Nav />
      <main className="h-full min-h-screen">{children}</main>
    </div>
  );
}
