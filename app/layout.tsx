import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Date",
  description: "International dating platform foundation for discovery, safety, and matching"
};

const navItems = [
  { href: "/", label: "Discover" },
  { href: "/discover", label: "Explore" },
  { href: "/matches", label: "Matches" },
  { href: "/chat", label: "Chat" },
  { href: "/profile", label: "Profile" }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="topbar">
            <div className="brand-block">
              <div className="brand-mark">GD</div>
              <div>
                <div className="brand-name">GLOBAL DATE</div>
                <div className="brand-subtitle">International dating</div>
              </div>
            </div>

            <nav className="main-nav" aria-label="Main navigation">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="nav-link">
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="nav-actions">
              <a href="/login" className="nav-action secondary">Log in</a>
              <a href="/signup" className="nav-action primary">Join now</a>
            </div>
          </header>

          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
