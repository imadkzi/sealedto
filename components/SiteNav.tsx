import Link from "next/link";
import styles from "@/styles/components/Nav.module.scss";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#templates", label: "Templates" },
  { href: "#how-it-works", label: "How it works" },
] as const;

export function SiteNav({ signedIn }: { signedIn?: boolean }) {
  return (
    <header className={styles.nav}>
      <Link href="/" className={styles.brand}>
        Sealedto
      </Link>

      <nav className={styles.links} aria-label="Primary">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} className={styles.link}>
            {link.label}
          </a>
        ))}
      </nav>

      <div className={styles.actions}>
        {signedIn ? (
          <Link href="/admin" className={styles.button}>
            Open admin
          </Link>
        ) : (
          <>
            <Link href="/login" className={styles.signIn}>
              Sign in
            </Link>
            <Link href="/register" className={styles.button}>
              Create your invite
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
