import { Divider } from "../core";
import type { Invitation } from "../types";
import styles from "./sections.module.scss";

interface Props {
  invitation: Invitation;
}

export function FooterSection({ invitation }: Props) {
  return (
    <footer className={styles.footer}>
      <Divider variant="line" width={60} />
      <p className={styles.footerNames}>
        {invitation.bride.name} & {invitation.groom.name}
      </p>
      <p>Made with Sealedto</p>
    </footer>
  );
}
