"use client";

import styles from "./DeleteInviteButton.module.scss";

interface Props {
  inviteId: string;
  inviteName: string;
  action: (formData: FormData) => Promise<void>;
  label?: string;
}

export function DeleteInviteButton({
  inviteId,
  inviteName,
  action,
  label = "Delete",
}: Props) {
  return (
    <form action={action}>
      <input type="hidden" name="inviteId" value={inviteId} />
      <button
        type="submit"
        className={styles.delete}
        onClick={(event) => {
          if (
            !window.confirm(
              `Delete ${inviteName}? This permanently removes the invite, guest links, and RSVPs.`,
            )
          ) {
            event.preventDefault();
          }
        }}
      >
        {label}
      </button>
    </form>
  );
}
