import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { getSessionUser } from "@/lib/session";
import styles from "@/styles/pages/Home.module.scss";

export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <>
      <SiteNav signedIn={Boolean(user?.id)} />
      <section className={styles.hero}>
        <div className={styles.atmosphere} aria-hidden />
        <div className={styles.copy}>
          <p className={styles.brand}>Sealedto</p>
          <h1 className={styles.headline}>
            Wedding invites that open like they were made for them.
          </h1>
          <p className={styles.support}>
            Design a sealed e-vite, personalise guest links, and watch RSVPs
            arrive in your admin — without another generic template.
          </p>
          <div className={styles.cta}>
            <Link className={styles.primary} href={user?.id ? "/admin" : "/register"}>
              {user?.id ? "Open admin" : "Create your invite"}
            </Link>
            <Link className={styles.secondary} href="/login">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>How it works</h2>
        <p className={styles.sectionText}>
          From blank seal to guest list — four quiet steps.
        </p>
        <div className={styles.steps}>
          <article className={styles.step}>
            <h3>Create</h3>
            <p>Pick a template and write the wedding details.</p>
          </article>
          <article className={styles.step}>
            <h3>Personalise</h3>
            <p>Choose the opening moment and accent colour.</p>
          </article>
          <article className={styles.step}>
            <h3>Share</h3>
            <p>Send a public link or curated invites by name.</p>
          </article>
          <article className={styles.step}>
            <h3>Collect</h3>
            <p>RSVPs land in your admin guest list instantly.</p>
          </article>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Templates with presence</h2>
        <p className={styles.sectionText}>
          A quiet opening — soft veil lifts to reveal the invitation.
        </p>
        <div className={styles.templates}>
          <div className={`${styles.template} ${styles.t1}`}>
            <span>Soft veil</span>
          </div>
        </div>
      </section>
    </>
  );
}
