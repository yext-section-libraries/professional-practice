import { ProfessionalPracticeBanner as renderConfig } from "./ProfessionalPracticeBanner.render";
import type { ProfessionalPracticeBannerProps } from "./ProfessionalPracticeBanner.render";
import type { SectionConfig } from "@yext/visual-editor";
import {
  msg,
  type YextComponentConfig,
  type YextFields,
  backgroundColors,
  getDefaultRTF,
} from "@yext/visual-editor";
import { defaultTextStyles } from "../shared/sectionHelpers";
const ProfessionalPracticeBannerFields: YextFields<ProfessionalPracticeBannerProps> =
  {
    data: {
      label: msg("fields.bannerText", "Banner Text"),
      type: "object",
      objectFields: {
        text: {
          label: msg("fields.options.text", "Text"),
          type: "entityField",
          filter: {
            types: ["type.rich_text_v2"],
          },
        },
        styles: {
          label: msg("fields.textStyles", "Text Styles"),
          type: "styledText",
        },
        fontColor: {
          label: msg("fields.textColor", "Text Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    styles: {
      label: msg("fields.styles", "Styles"),
      type: "object",
      objectFields: {
        textAlignment: {
          label: msg("fields.textAlignment", "Text Alignment"),
          type: "radio",
          options: [
            { label: msg("fields.options.left", "Left"), value: "left" },
            { label: msg("fields.options.center", "Center"), value: "center" },
            { label: msg("fields.options.right", "Right"), value: "right" },
          ],
        },
      },
    },
    section: {
      label: msg("fields.section", "Section"),
      type: "object",
      objectFields: {
        backgroundColor: {
          label: msg("fields.backgroundColor", "Background Color"),
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
        visibleOnLivePage: {
          label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
      },
    },
  };

/**
 * Displays a full-width, editor-configurable rich-text banner.
 */
export const ProfessionalPracticeBanner: YextComponentConfig<ProfessionalPracticeBannerProps> =
  {
    label: "Banner",
    fields: ProfessionalPracticeBannerFields,
    defaultProps: {
      data: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "Clean Pup Club members get priority booking windows, flexible seasonal perks, and calm reminders without adding visual clutter to the page.",
            ),
          },
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
      },
      styles: {
        textAlignment: "center",
      },
      section: {
        backgroundColor: backgroundColors.color1.value,
        visibleOnLivePage: true,
      },
    },
    render: renderConfig.render,
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeBanner",
  displayName: "Banner",
  description: "Banner",
  pageSetTypes: ["ENTITY", "DIRECTORY", "LOCATOR"],
};
