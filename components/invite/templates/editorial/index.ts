import { registerTemplate } from "../../registry";
import { EditorialTemplate } from "./EditorialTemplate";
import { editorialFonts, editorialVariants, DEFAULT_VARIANT_ID, DEFAULT_COLOUR_THEME_ID } from "./theme";
import { editorialColourThemes } from "./colourThemes";

registerTemplate({
  id: "editorial",
  name: "Editorial",
  fonts: editorialFonts,
  variants: editorialVariants,
  colourThemes: editorialColourThemes,
  defaultVariantId: DEFAULT_VARIANT_ID,
  defaultColourThemeId: DEFAULT_COLOUR_THEME_ID,
  component: EditorialTemplate,
});

export { EditorialTemplate } from "./EditorialTemplate";
export { editorialFonts, editorialVariants } from "./theme";
export { editorialColourThemes } from "./colourThemes";
