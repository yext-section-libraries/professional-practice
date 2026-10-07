import { ProfessionalPracticeEventsSection as renderConfig } from "./ProfessionalPracticeEventsSection.render";
import type { ProfessionalPracticeEventsSectionProps } from "./ProfessionalPracticeEventsSection.render";
import { eventCardsSource } from "./ProfessionalPracticeEventsSection.render";
import type { SectionConfig } from "@yext/visual-editor";
import {
  msg,
  getDefaultRTF,
  type YextComponentConfig,
  type YextFields,
} from "@yext/visual-editor";
import { defaultTextStyles } from "../shared/sectionHelpers";
const ProfessionalPracticeEventsSectionFields: YextFields<ProfessionalPracticeEventsSectionProps> =
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
        cardBackgroundColor: {
          label: msg("fields.cardBackgroundColor", "Card Background Color"),
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
    intro: {
      label: msg("fields.intro", "Intro"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.options.text", "Text"),
          filter: { types: ["type.rich_text_v2"] },
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
    events: {
      label: msg("fields.events", "Events"),
      type: "object",
      objectFields: {
        data: eventCardsSource.field,
        styles: {
          label: msg("fields.eventCardPresentation", "Event Card Presentation"),
          type: "object",
          objectFields: {
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
            includeTime: {
              label: msg("fields.includeTime", "Include Time"),
              type: "radio",
              options: [
                { label: msg("fields.options.yes", "Yes"), value: true },
                { label: msg("fields.options.no", "No"), value: false },
              ],
            },
          },
        },
      },
    },
  };

export const ProfessionalPracticeEventsSection: YextComponentConfig<ProfessionalPracticeEventsSectionProps> =
  {
    label: "Events",
    fields: ProfessionalPracticeEventsSectionFields,
    defaultProps: {
      section: {
        visibleOnLivePage: true,
        backgroundColor: {
          selectedColor: "palette-quaternary",
          contrastingColor: "palette-quaternary-contrast",
        },
        cardBackgroundColor: {
          selectedColor: "white",
          contrastingColor: "palette-secondary",
        },
      },
      heading: {
        text: {
          field: "",
          constantValue: "Upcoming Grooming Events",
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      intro: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "Join us for seasonal grooming events and member-only appointment windows.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      events: {
        data: eventCardsSource.defaultValue,
        styles: {
          image: { borderRadius: "default" },
          imageAspectRatio: 1.25,
          title: defaultTextStyles,
          titleFontColor: undefined,
          description: defaultTextStyles,
          descriptionFontColor: undefined,
          includeTime: true,
        },
      },
    },
    render: renderConfig.render,
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeEventsSection",
  displayName: "Events",
  description: "Events Section",
  pageSetTypes: ["ENTITY"],
};
