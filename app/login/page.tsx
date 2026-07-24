import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
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

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const user = await getSessionUser();
  if (user?.id) redirect("/admin");

  async function login(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const hdrs = await headers();
    const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    const blocked = await hitRateLimit({
      key: `login:${ip}:${email || "unknown"}`,
      limit: 10,
      windowMs: 10 * 60 * 1000,
    });
    if (blocked) redirect("/login?error=throttled");
    if (!email || !password) redirect("/login?error=invalid");

    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: "/admin",
      });
    } catch (error) {
      if (isRedirectError(error)) throw error;
      if (error instanceof AuthError) redirect("/login?error=invalid");
      redirect("/login?error=invalid");
    }
  }

  const sp = (await searchParams) ?? {};
  const errorMessage =
    sp.error === "throttled"
      ? "Too many attempts. Try again shortly."
      : sp.error
        ? "Could not sign in. Check your email and password."
        : null;

  return (
    <div className={styles.auth}>
      <section className={styles.card}>
        <Link href="/" className={styles.brand}>
          Sealedto
        </Link>
        <p className={styles.lead}>Sign in to manage your wedding invites.</p>
        {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}
        <form action={login} className={styles.form}>
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
            Sign in
          </button>
        </form>
        <p className={styles.alt}>
          New here? <Link href="/register">Create an account</Link>
        </p>
      </section>
    </div>
  );
}
