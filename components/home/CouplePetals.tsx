import styles from "@/styles/pages/Home.module.scss";

const PETALS = [
  "/assets/sealed-to-petals/Layer 2.png",
  "/assets/sealed-to-petals/Layer 3.png",
  "/assets/sealed-to-petals/Layer 4.png",
  "/assets/sealed-to-petals/Layer 5.png",
  "/assets/sealed-to-petals/Layer 6.png",
  "/assets/sealed-to-petals/Layer 7.png",
  "/assets/sealed-to-petals/Layer 8.png",
  "/assets/sealed-to-petals/Layer 9.png",
  "/assets/sealed-to-petals/Layer 10.png",
] as const;

type Layer = "behind" | "mid" | "front";

const SPECS: {
  src: string;
  left: string;
  top: string;
  size: number;
  rotate: string;
  layer: Layer;
}[] = [
  { src: PETALS[0], left: "-6%", top: "10%", size: 58, rotate: "-32deg", layer: "front" },
  { src: PETALS[1], left: "36%", top: "-5%", size: 30, rotate: "42deg", layer: "behind" },
  { src: PETALS[2], left: "84%", top: "2%", size: 50, rotate: "16deg", layer: "front" },
  { src: PETALS[3], left: "93%", top: "34%", size: 34, rotate: "-58deg", layer: "mid" },
  { src: PETALS[4], left: "80%", top: "78%", size: 54, rotate: "68deg", layer: "front" },
  { src: PETALS[5], left: "44%", top: "91%", size: 26, rotate: "-22deg", layer: "behind" },
  { src: PETALS[6], left: "-4%", top: "70%", size: 46, rotate: "118deg", layer: "front" },
  { src: PETALS[7], left: "-9%", top: "38%", size: 36, rotate: "-78deg", layer: "mid" },
  { src: PETALS[8], left: "14%", top: "16%", size: 22, rotate: "28deg", layer: "behind" },
  { src: PETALS[0], left: "68%", top: "64%", size: 24, rotate: "-40deg", layer: "behind" },
  { src: PETALS[2], left: "72%", top: "-3%", size: 20, rotate: "98deg", layer: "mid" },
  { src: PETALS[4], left: "8%", top: "88%", size: 28, rotate: "154deg", layer: "mid" },
];

const LAYER_CLASS: Record<Layer, string> = {
  behind: styles.couplePetalBehind,
  mid: styles.couplePetalMid,
  front: styles.couplePetalFront,
};

export function CouplePetals() {
  return (
    <div className={styles.couplePetals} aria-hidden>
      {SPECS.map((petal, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${petal.src}-${index}`}
          className={`${styles.couplePetal} ${LAYER_CLASS[petal.layer]}`}
          src={encodeURI(petal.src)}
          alt=""
          width={petal.size}
          height={petal.size}
          style={{
            left: petal.left,
            top: petal.top,
            width: petal.size,
            transform: `rotate(${petal.rotate})`,
          }}
        />
      ))}
    </div>
  );
}
