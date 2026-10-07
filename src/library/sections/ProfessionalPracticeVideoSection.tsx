import { ProfessionalPracticeVideoSection as renderConfig } from "./ProfessionalPracticeVideoSection.render";
import type { ProfessionalPracticeVideoSectionProps } from "./ProfessionalPracticeVideoSection.render";
import type { SectionConfig } from "@yext/visual-editor";
import {
  msg,
  getDefaultRTF,
  type ThemeColor,
  type YextComponentConfig,
  type YextFields,
} from "@yext/visual-editor";
import { defaultTextStyles } from "../shared/sectionHelpers";
const defaultSectionColor: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
};

const ProfessionalPracticeVideoSectionFields: YextFields<ProfessionalPracticeVideoSectionProps> =
  {
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
    heading: {
      label: msg("fields.heading", "Heading"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.options.text", "Text"),
          filter: {
            types: ["type.string"],
          },
        },
        styles: {
          label: msg("fields.textStyles", "Text Styles"),
          type: "styledText",
        },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    body: {
      label: msg("fields.body", "Body"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.options.text", "Text"),
          filter: {
            types: ["type.rich_text_v2"],
          },
        },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    videoSource: {
      label: msg("fields.videoSource", "Video Source"),
      type: "text",
    },
  };

export const ProfessionalPracticeVideoSection: YextComponentConfig<ProfessionalPracticeVideoSectionProps> =
  {
    label: "Video",
    fields: ProfessionalPracticeVideoSectionFields,
    defaultProps: {
      section: {
        backgroundColor: defaultSectionColor,
        visibleOnLivePage: true,
      },
      heading: {
        text: {
          field: "",
          constantValue: "Show The Experience In Motion",
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      body: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "A dedicated video band helps editors add a walk-through, day-in-the-van story, or customer education clip without leaving the template's calm dark-shell rhythm.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontColor: undefined,
      },
      videoSource: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    },
    render: renderConfig.render,
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeVideoSection",
  displayName: "Video",
  description: "Video Section",
  pageSetTypes: ["ENTITY"],
};
