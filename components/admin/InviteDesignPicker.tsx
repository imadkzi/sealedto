"use client";

import { useState } from "react";

// Side-effect: register editorial template
import "@/components/invite/templates/editorial";

import {
  getTemplate,
  resolveColourTheme,
  FALLBACK_TEMPLATE_ID,
} from "@/components/invite/registry";
import { InviteThemeProvider } from "@/components/invite/theme/InviteThemeProvider";
import type {
  InviteTheme,
  EditorialVariantId,
  TemplateDefinition,
} from "@/components/invite/types";

import styles from "./InviteDesignPicker.module.scss";

interface Props {
  variantId: string;
  colourThemeId: string;
  /** If true we also render hidden inputs with name="variantId" / name="colourThemeId" */
  formInputs?: boolean;
  onChange?: (variant: string, theme: string) => void;
}

export function InviteDesignPicker({
  variantId: initialVariant,
  colourThemeId: initialTheme,
  formInputs = true,
  onChange,
}: Props) {
  const [variant, setVariant] = useState(initialVariant);
  const [theme, setTheme] = useState(initialTheme);

  const template = getTemplate(FALLBACK_TEMPLATE_ID)!;

  function pickVariant(id: string) {
    setVariant(id);
    onChange?.(id, theme);
  }

  function pickTheme(id: string) {
    setTheme(id);
    onChange?.(variant, id);
  }

  return (
    <div className={styles.picker}>
      {formInputs && (
        <>
          <input type="hidden" name="variantId" value={variant} />
          <input type="hidden" name="colourThemeId" value={theme} />
        </>
      )}

      {/* Template family */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Template</h3>
        <div className={styles.familyBadge}>Editorial</div>
      </div>

      {/* Variant picker */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Variant</h3>
        <div className={styles.variantGrid}>
          {template.variants.map((v) => (
            <button
              key={v.id}
              type="button"
              className={`${styles.variantCard} ${variant === v.id ? styles.variantActive : ""}`}
              onClick={() => pickVariant(v.id)}
            >
              <span className={styles.variantName}>{v.name}</span>
              <span className={styles.variantDesc}>{v.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Colour theme picker */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Colour Theme</h3>
        <div className={styles.themeGrid}>
          {template.colourThemes.map((ct) => (
            <button
              key={ct.id}
              type="button"
              className={`${styles.themeSwatch} ${theme === ct.id ? styles.themeActive : ""}`}
              onClick={() => pickTheme(ct.id)}
              title={ct.name}
            >
              <span
                className={styles.swatchInner}
                style={{
                  background: ct.tokens.background,
                  borderColor: ct.tokens.border,
                }}
              >
                <span
                  className={styles.swatchAccent}
                  style={{ background: ct.tokens.accent }}
                />
              </span>
              <span className={styles.swatchLabel}>{ct.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
