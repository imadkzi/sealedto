import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { query } from "@/lib/db/postgres";
import { signIn } from "@/lib/auth";
import { getSessionUser } from "@/lib/session";
import { hitRateLimit } from "@/lib/security/rate-limit";
import styles from "@/styles/pages/Auth.module.scss";

function isRedirectError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String((error as { digest?: unknown }).digest ?? "").startsWith(
      "NEXT_REDIRECT",
    )
  );
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const user = await getSessionUser();
  if (user?.id) redirect("/admin");

  async function register(formData: FormData) {
    "use server";
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const hdrs = await headers();
    const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    const blocked = await hitRateLimit({
      key: `register:${ip}:${email || "unknown"}`,
      limit: 6,
      windowMs: 10 * 60 * 1000,
    });
    if (blocked) redirect("/register?error=throttled");
    if (!email || !password || password.length < 8) {
      redirect("/register?error=invalid");
    }

    const existing = await query<{ id: string }>(
      `select id::text as id from users where email = $1 limit 1`,
      [email],
    );
    if (existing[0]) redirect("/register?error=exists");

    const passwordHash = await bcrypt.hash(password, 12);
    await query(
      `insert into users (email, name, password_hash) values ($1, $2, $3)`,
      [email, name || null, passwordHash],
    );

    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: "/admin",
      });
    } catch (error) {
      if (isRedirectError(error)) throw error;
      if (error instanceof AuthError) redirect("/login?error=invalid");
      redirect("/register?error=invalid");
    }
  }

  const sp = (await searchParams) ?? {};
  const errorMessage =
    sp.error === "throttled"
      ? "Too many attempts. Try again shortly."
      : sp.error === "exists"
        ? "An account with that email already exists."
        : sp.error
          ? "Could not create your account. Check the details and try again."
          : null;

  return (
    <div className={styles.auth}>
      <section className={styles.card}>
        <Link href="/" className={styles.brand}>
          Sealedto
        </Link>
        <p className={styles.lead}>Create an account to start sealing invites.</p>
        {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}
        <form action={register} className={styles.form}>
          <label className={styles.label}>
            Name
            <input className={styles.input} type="text" name="name" />
          </label>
          <label className={styles.label}>
            Email
            <input className={styles.input} type="email" name="email" required />
          </label>
          <label className={styles.label}>
            Password
            <input
              className={styles.input}
              type="password"
              name="password"
              required
              minLength={8}
            />
          </label>
          <button className={styles.button} type="submit">
            Create account
          </button>
        </form>
        <p className={styles.alt}>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </section>
    </div>
  );
}
