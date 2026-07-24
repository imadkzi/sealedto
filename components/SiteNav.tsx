import Link from "next/link";
import styles from "@/styles/components/Nav.module.scss";

export function SiteNav({
  signedIn,
}: {
  signedIn?: boolean;
}) {
  return (
    <header className={styles.nav}>
      <Link href="/" className={styles.brand}>
        Sealedto
      </Link>
      <div className={styles.actions}>
        {signedIn ? (
          <Link href="/admin" className={styles.button}>
            Admin
          </Link>
        ) : (
          <Link href="/login" className={styles.button}>
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
