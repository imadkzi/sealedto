import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { CouplePetals } from "@/components/home/CouplePetals";
import { PetalField } from "@/components/home/PetalField";
import { TemplateCarousel } from "@/components/home/TemplateCarousel";
import { TimelineTrack } from "@/components/home/TimelineTrack";
import { getSessionUser } from "@/lib/session";
import styles from "@/styles/pages/Home.module.scss";

const HERO_CHIPS = [
  { icon: "/sealedto-icons-svg/hero_link.svg", label: "Curated guest links" },
  { icon: "/sealedto-icons-svg/hero_qr.svg", label: "QR codes" },
  { icon: "/sealedto-icons-svg/hero_csv.svg", label: "CSV import/export" },
  { icon: "/sealedto-icons-svg/hero_realtime.svg", label: "Real-time RSVPs" },
] as const;

const TRUST_ITEMS = [
  {
    icon: "/sealedto-icons-svg/beautifully_designed_invites.svg",
    label: "Beautifully designed invites",
  },
  {
    icon: "/sealedto-icons-svg/personalised_guest_experience.svg",
    label: "Personalised guest experience",
  },
  {
    icon: "/sealedto-icons-svg/rsvps_dashboard.svg",
    label: "RSVPs in one easy dashboard",
  },
  {
    icon: "/sealedto-icons-svg/share_anywhere.svg",
    label: "Share anywhere instantly",
  },
  {
    icon: "/sealedto-icons-svg/loved_by_couples.svg",
    label: "Loved by couples and guests",
  },
] as const;

const STEPS = [
  {
    n: "01",
    title: "Create",
    icon: "/sealedto-icons-svg/create.svg",
    text: "Add your wedding details, photos, schedule and story in minutes.",
  },
  {
    n: "02",
    title: "Personalise",
    icon: "/sealedto-icons-svg/personalise.svg",
    text: "Choose your design, colours and message to make it truly you.",
  },
  {
    n: "03",
    title: "Share",
    icon: "/sealedto-icons-svg/share.svg",
    text: "Send a public link or curated guest links by name or group.",
  },
  {
    n: "04",
    title: "Collect",
    icon: "/sealedto-icons-svg/collect.svg",
    text: "Guests RSVP and you manage everything in one simple dashboard.",
  },
] as const;

const FEATURES = [
  {
    icon: "/sealedto-icons-svg/guest_list_management.svg",
    title: "Guest List Management",
    text: "Add, edit, group or import guests with ease.",
  },
  {
    icon: "/sealedto-icons-svg/curated_guest_links_feature.svg",
    title: "Curated Guest Links",
    text: "Each guest gets a personal invite experience.",
  },
  {
    icon: "/sealedto-icons-svg/realtime_rsvps.svg",
    title: "Real-time RSVPs",
    text: "See responses as they come in, live.",
  },
  {
    icon: "/sealedto-icons-svg/qr_codes.svg",
    title: "QR Codes",
    text: "Print or share QR codes for quick access.",
  },
  {
    icon: "/sealedto-icons-svg/csv_export.svg",
    title: "CSV Import / Export",
    text: "Keep your guest list in sync, always.",
  },
  {
    icon: "/sealedto-icons-svg/beautiful_analytics.svg",
    title: "Beautiful Analytics",
    text: "Track RSVPs and stats at a glance.",
  },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "Our guests said it felt like opening a real envelope. RSVPs were in one place before the week was out.",
    names: "Aisha & Zayn",
    initials: "AZ",
  },
  {
    quote:
      "We sent personal links to family and a public link to everyone else. It looked expensive without the stress.",
    names: "Maryam & Ibrahim",
    initials: "MI",
  },
  {
    quote:
      "From design to guest list export, Sealedto replaced three different tools we were juggling.",
    names: "Fatima & Yusuf",
    initials: "FY",
  },
] as const;

export default async function HomePage() {
  const user = await getSessionUser();
  const createHref = user?.id ? "/admin" : "/register";

  return (
    <div className={styles.home}>
      <SiteNav signedIn={Boolean(user?.id)} />

      <section className={styles.hero}>
        <PetalField />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <h1 className={styles.headline}>
              Wedding invites that open like they were{" "}
              <em className={styles.accent}>made</em> for them.
            </h1>
            <p className={styles.support}>
              Design a sealed e-vite, personalise guest links, and watch RSVPs
              arrive in your admin.
            </p>

            <div className={styles.heroCtas}>
              <Link className={styles.primaryCta} href={createHref}>
                Create your invite
                <span aria-hidden>→</span>
              </Link>
              <a className={styles.secondaryCta} href="#how-it-works">
                <span className={styles.play} aria-hidden>
                  ▶
                </span>
                See how it works
              </a>
            </div>

            <ul className={styles.heroChips}>
              {HERO_CHIPS.map((chip) => (
                <li key={chip.label} className={styles.chip}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={chip.icon} alt="" width={22} height={22} />
                  <span>{chip.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className={styles.trustFloat}>
        <div className={styles.trustBar}>
          <p className={styles.trustCopy}>
            Trusted by couples who want their day to feel personal from the very
            first invite.
          </p>
          <ul className={styles.trustItems}>
            {TRUST_ITEMS.map((item) => (
              <li key={item.label} className={styles.trustItem}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.icon} alt="" width={36} height={36} />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section id="how-it-works" className={styles.how}>
        <div className={styles.howInner}>
          <div className={styles.howMain}>
            <div className={styles.howHeader}>
              <h2 className={styles.sectionTitle}>
                Four simple steps. Everything in{" "}
                <em className={styles.accent}>one</em> place.
              </h2>
            </div>

            <div className={styles.timelineWrap}>
              <TimelineTrack />
              <ol className={styles.timeline}>
                {STEPS.map((step, index) => (
                  <li key={step.n} className={styles.timelineStep}>
                    {index > 0 ? (
                      <span className={styles.timelineDash} aria-hidden />
                    ) : null}
                    <span className={styles.stepNumber}>{step.n}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={step.icon} alt="" width={28} height={28} />
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className={styles.howVisual}>
            <CouplePetals />
            <Image
              src="/assets/couple-asset.png"
              alt="Couple embracing at golden hour"
              width={1536}
              height={1024}
              sizes="(max-width: 979px) 90vw, (max-width: 1439px) 48vw, 52rem"
              className={styles.coupleImage}
            />
          </div>
        </div>
      </section>

      <section id="templates" className={styles.templatesFloat}>
        <div className={styles.templatesPanel}>
          <div className={styles.templatesCopy}>
            <h2 className={styles.panelTitle}>
              Invites as unique as your love.
            </h2>
            <p className={styles.panelText}>
              Choose from elegant, modern and cultural designs that feel
              considered — not templated.
            </p>
            <Link href={createHref} className={styles.panelLink}>
              Explore templates →
            </Link>
          </div>
          <TemplateCarousel />
        </div>
      </section>

      <section id="features" className={styles.features}>
        <h2 className={styles.sectionTitleCenter}>
          Everything you need, and{" "}
          <em className={`${styles.accent} ${styles.underline}`}>nothing</em>{" "}
          you don&apos;t.
        </h2>

        <div className={styles.featureGrid}>
          {FEATURES.map((feature) => (
            <article key={feature.title} className={styles.feature}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={feature.icon} alt="" width={40} height={40} />
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.love}>
        <div className={styles.loveCopy}>
          <h2 className={styles.sectionTitle}>
            Real couples. Real stories.{" "}
            <em className={styles.accent}>Real love.</em>
          </h2>
        </div>

        <div className={styles.testimonials}>
          {TESTIMONIALS.map((item) => (
            <article key={item.names} className={styles.testimonial}>
              <p className={styles.stars} aria-label="5 out of 5 stars">
                ★★★★★
              </p>
              <p className={styles.quote}>&ldquo;{item.quote}&rdquo;</p>
              <div className={styles.attribution}>
                <span className={styles.avatar} aria-hidden>
                  {item.initials}
                </span>
                <span>{item.names}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.finalCta}>
        <div
          className={`${styles.finalBotanical} ${styles.finalBotanicalLeft}`}
          aria-hidden
        />
        <div className={styles.finalInner}>
          <div className={styles.finalCopy}>
            <h2>Ready to create your dream wedding invite?</h2>
            <p>
              Join couples who chose Sealedto to start their journey beautifully
              — personal invites, clear RSVPs, one calm dashboard.
            </p>
            <div className={styles.finalActions}>
              <Link href={createHref} className={styles.finalPrimary}>
                Create your invite
              </Link>
              <a href="#templates" className={styles.finalSecondary}>
                View templates
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <Link href="/" className={styles.footerBrand}>
          Sealedto
        </Link>
        <p>Wedding e-vites that feel personal.</p>
      </footer>
    </div>
  );
}
