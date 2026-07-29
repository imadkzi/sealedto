import type { TemplateDefinition, ColourThemeDefinition, VariantDefinition, EditorialVariantId } from "./types";

const templates = new Map<string, TemplateDefinition>();

export function registerTemplate(def: TemplateDefinition) {
  templates.set(def.id, def);
}

export function getTemplate(id: string): TemplateDefinition | undefined {
  return templates.get(id);
}

export function listTemplates(): TemplateDefinition[] {
  return Array.from(templates.values());
}

export function resolveColourTheme(
  template: TemplateDefinition,
  themeId: string,
): ColourThemeDefinition {
  return (
    template.colourThemes.find((t) => t.id === themeId) ??
    template.colourThemes.find((t) => t.id === template.defaultColourThemeId)!
  );
}

export function resolveVariant(
  template: TemplateDefinition,
  variantId: string,
): VariantDefinition {
  return (
    template.variants.find((v) => v.id === variantId) ??
    template.variants.find((v) => v.id === template.defaultVariantId)!
  );
}

export const FALLBACK_TEMPLATE_ID = "editorial";
