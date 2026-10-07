import { ProfessionalPracticeReviewsSection as renderConfig } from "./ProfessionalPracticeReviewsSection.render";
import type { ProfessionalPracticeReviewsSectionProps } from "./ProfessionalPracticeReviewsSection.render";
import type { SectionConfig } from "@yext/visual-editor";
import {
  msg,
  type ThemeColor,
  type YextComponentConfig,
  type YextFields,
} from "@yext/visual-editor";
import { defaultTextStyles } from "../shared/sectionHelpers";
const sectionColor: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "palette-secondary",
};

const defaultIconBackgroundColor: ThemeColor = {
  selectedColor: "palette-quaternary-light",
  contrastingColor: "palette-secondary",
};

const ProfessionalPracticeReviewsSectionFields: YextFields<ProfessionalPracticeReviewsSectionProps> =
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
    responseBackgroundColor: {
      label: msg(
        "fields.businessResponseBackgroundColor",
        "Business Response Background Color",
      ),
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
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
  };

export const ProfessionalPracticeReviewsSection: YextComponentConfig<ProfessionalPracticeReviewsSectionProps> =
  {
    label: "Reviews",
    fields: ProfessionalPracticeReviewsSectionFields,
    defaultProps: {
      section: {
        backgroundColor: sectionColor,
        visibleOnLivePage: true,
      },
      responseBackgroundColor: defaultIconBackgroundColor,
      heading: {
        text: {
          field: "",
          constantValue: "What Local Pet Parents Are Saying",
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
    },
    render: renderConfig.render,
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeReviewsSection",
  displayName: "Reviews",
  description: "Reviews Section",
  pageSetTypes: ["ENTITY"],
};
