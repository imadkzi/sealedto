import styles from "@/styles/pages/Home.module.scss";

const PETAL_IMAGES = [
  "/assets/sealed-to-petals/Layer 2.png",
  "/assets/sealed-to-petals/Layer 3.png",
  "/assets/sealed-to-petals/Layer 4.png",
  "/assets/sealed-to-petals/Layer 5.png",
  "/assets/sealed-to-petals/Layer 6.png",
  "/assets/sealed-to-petals/Layer 7.png",
  "/assets/sealed-to-petals/Layer 8.png",
  "/assets/sealed-to-petals/Layer 9.png",
  "/assets/sealed-to-petals/Layer 10.png",
  "/assets/sealed-to-petals/Layer 11.png",
  "/assets/sealed-to-petals/Layer 12.png",
] as const;

type Depth = "far" | "mid" | "near";

type PetalSpec = {
  src: string;
  left: string;
  size: number;
  delay: string;
  duration: string;
  drift: string;
  spin: string;
  depth: Depth;
};

const DEPTH_CLASS: Record<Depth, string> = {
  far: styles.petalFar,
  mid: styles.petalMid,
  near: styles.petalNear,
};

const PETALS: PetalSpec[] = [
  { src: PETAL_IMAGES[0], left: "5%", size: 58, delay: "0s", duration: "16s", drift: "-42px", spin: "170deg", depth: "near" },
  { src: PETAL_IMAGES[1], left: "12%", size: 30, delay: "-3s", duration: "24s", drift: "30px", spin: "-190deg", depth: "far" },
  { src: PETAL_IMAGES[2], left: "19%", size: 42, delay: "-7s", duration: "19s", drift: "-55px", spin: "210deg", depth: "mid" },
  { src: PETAL_IMAGES[3], left: "27%", size: 26, delay: "-1.5s", duration: "26s", drift: "38px", spin: "-140deg", depth: "far" },
  { src: PETAL_IMAGES[4], left: "34%", size: 52, delay: "-9s", duration: "17s", drift: "-24px", spin: "185deg", depth: "near" },
  { src: PETAL_IMAGES[5], left: "42%", size: 34, delay: "-4s", duration: "22s", drift: "48px", spin: "-175deg", depth: "mid" },
  { src: PETAL_IMAGES[6], left: "49%", size: 38, delay: "-12s", duration: "18s", drift: "-36px", spin: "200deg", depth: "mid" },
  { src: PETAL_IMAGES[7], left: "56%", size: 24, delay: "-2s", duration: "27s", drift: "26px", spin: "-120deg", depth: "far" },
  { src: PETAL_IMAGES[8], left: "63%", size: 54, delay: "-6s", duration: "15s", drift: "-50px", spin: "160deg", depth: "near" },
  { src: PETAL_IMAGES[9], left: "71%", size: 32, delay: "-10s", duration: "23s", drift: "40px", spin: "-210deg", depth: "mid" },
  { src: PETAL_IMAGES[10], left: "78%", size: 46, delay: "-5s", duration: "16s", drift: "-30px", spin: "180deg", depth: "near" },
  { src: PETAL_IMAGES[0], left: "86%", size: 28, delay: "-14s", duration: "25s", drift: "34px", spin: "-155deg", depth: "far" },
  { src: PETAL_IMAGES[2], left: "93%", size: 40, delay: "-8s", duration: "20s", drift: "-44px", spin: "230deg", depth: "mid" },
  { src: PETAL_IMAGES[4], left: "8%", size: 22, delay: "-16s", duration: "28s", drift: "18px", spin: "-100deg", depth: "far" },
  { src: PETAL_IMAGES[6], left: "23%", size: 60, delay: "-11s", duration: "14s", drift: "-62px", spin: "250deg", depth: "near" },
  { src: PETAL_IMAGES[8], left: "38%", size: 31, delay: "-18s", duration: "21s", drift: "32px", spin: "-185deg", depth: "mid" },
  { src: PETAL_IMAGES[1], left: "53%", size: 44, delay: "-13s", duration: "17s", drift: "-40px", spin: "150deg", depth: "near" },
  { src: PETAL_IMAGES[3], left: "68%", size: 27, delay: "-0.8s", duration: "24s", drift: "52px", spin: "-230deg", depth: "far" },
];

export function PetalField() {
  return (
    <div className={styles.petalField} aria-hidden>
      {PETALS.map((petal, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${petal.src}-${index}`}
          className={`${styles.petal} ${DEPTH_CLASS[petal.depth]}`}
          src={encodeURI(petal.src)}
          alt=""
          width={petal.size}
          height={petal.size}
          style={{
            left: petal.left,
            width: petal.size,
            height: "auto",
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            ["--petal-drift" as string]: petal.drift,
            ["--petal-spin" as string]: petal.spin,
          }}
        />
      ))}
    </div>
  );
}
