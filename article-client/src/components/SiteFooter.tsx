import Link from "next/link";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { href: "/", label: "Latest articles" },
      { href: "/#featured-articles", label: "Featured articles" },
      { href: "/write", label: "Write on Cognora" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of service" },
      { href: "/cookie-policy", label: "Cookie policy" },
    ],
  },
  {
    title: "Categories",
    links: [
      { href: "/?q=AI", label: "AI & Agents" },
      { href: "/?q=Developer", label: "Developer Tools" },
      { href: "/?q=Software%20Engineering", label: "Software Engineering" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card" role="contentinfo">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-12 md:px-8 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
            Cognora
          </Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Practical, independent writing about artificial intelligence, software
            engineering, emerging technology, and the people building what comes next.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold text-foreground">{group.title}</h2>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-border/60 px-5 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Cognora. All rights reserved.
      </div>
    </footer>
  );
}
