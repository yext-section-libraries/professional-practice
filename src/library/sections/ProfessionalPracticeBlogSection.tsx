import { ProfessionalPracticeBlogSection as renderConfig } from "./ProfessionalPracticeBlogSection.render";
import type { ProfessionalPracticeBlogSectionProps } from "./ProfessionalPracticeBlogSection.render";
import { blogCardsSource } from "./ProfessionalPracticeBlogSection.render";
import type { SectionConfig } from "@yext/visual-editor";
import {
  msg,
  type YextComponentConfig,
  type YextFields,
} from "@yext/visual-editor";
import { defaultTextStyles } from "../shared/sectionHelpers";
const ProfessionalPracticeBlogSectionFields: YextFields<ProfessionalPracticeBlogSectionProps> =
  {
    section: {
      label: msg("fields.section", "Section"),
      type: "object",
      objectFields: {
        visibleOnLivePage: {
          label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
        backgroundColor: {
          label: msg("fields.backgroundColor", "Background Color"),
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
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
          filter: { types: ["type.string"] },
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
    cards: {
      label: msg("fields.blogCards", "Blog Cards"),
      type: "object",
      objectFields: {
        data: blogCardsSource.field,
        styles: {
          label: msg("fields.cardPresentation", "Card Presentation"),
          type: "object",
          objectFields: {
            overlayBackgroundColor: {
              label: msg(
                "fields.overlayBackgroundColor",
                "Overlay Background Color",
              ),
              type: "basicSelector",
              options: "BACKGROUND_COLOR",
            },
            image: {
              label: msg("fields.imageStyles", "Image Styles"),
              type: "styledImage",
            },
            imageAspectRatio: {
              label: msg("fields.imageAspectRatio", "Image Aspect Ratio"),
              type: "number",
            },
            title: {
              label: msg("fields.titleStyles", "Title Styles"),
              type: "styledText",
            },
            titleFontColor: {
              label: msg("fields.titleFontColor", "Title Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
            description: {
              label: msg("fields.descriptionStyles", "Description Styles"),
              type: "styledText",
            },
            descriptionFontColor: {
              label: msg(
                "fields.descriptionFontColor",
                "Description Font Color",
              ),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
      },
    },
  };

export const ProfessionalPracticeBlogSection: YextComponentConfig<ProfessionalPracticeBlogSectionProps> =
  {
    label: "Blog",
    fields: ProfessionalPracticeBlogSectionFields,
    defaultProps: {
      section: {
        visibleOnLivePage: true,
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "palette-secondary",
        },
      },
      heading: {
        text: {
          field: "",
          constantValue: "From The Grooming Journal",
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      cards: {
        data: blogCardsSource.defaultValue,
        styles: {
          overlayBackgroundColor: {
            selectedColor: "palette-primary",
            contrastingColor: "palette-primary-contrast",
          },
          image: { borderRadius: "default" },
          imageAspectRatio: 1.6,
          title: defaultTextStyles,
          titleFontColor: undefined,
          description: defaultTextStyles,
          descriptionFontColor: undefined,
        },
      },
    },
    render: renderConfig.render,
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeBlogSection",
  displayName: "Blog",
  description: "Blog Section",
  pageSetTypes: ["ENTITY"],
};
