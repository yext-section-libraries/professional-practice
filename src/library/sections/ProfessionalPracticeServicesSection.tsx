import { ProfessionalPracticeServicesSection as renderConfig } from "./ProfessionalPracticeServicesSection.render";
import type { ProfessionalPracticeServicesSectionProps } from "./ProfessionalPracticeServicesSection.render";
import { serviceCardsSource } from "./ProfessionalPracticeServicesSection.render";
import type { SectionConfig } from "@yext/visual-editor";
import {
  msg,
  getDefaultRTF,
  type YextComponentConfig,
  type YextFields,
} from "@yext/visual-editor";
import { defaultTextStyles } from "../shared/sectionHelpers";
const ProfessionalPracticeServicesSectionFields: YextFields<ProfessionalPracticeServicesSectionProps> =
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
    services: {
      label: msg("fields.options.facets.services", "Services"),
      type: "object",
      objectFields: {
        data: serviceCardsSource.field,
        styles: {
          label: msg(
            "fields.serviceCardPresentation",
            "Service Card Presentation",
          ),
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
          },
        },
      },
    },
  };

export const ProfessionalPracticeServicesSection: YextComponentConfig<ProfessionalPracticeServicesSectionProps> =
  {
    label: "Services",
    fields: ProfessionalPracticeServicesSectionFields,
    defaultProps: {
      section: {
        visibleOnLivePage: true,
        backgroundColor: {
          selectedColor: "palette-quaternary",
          contrastingColor: "palette-quaternary-contrast",
        },
      },
      heading: {
        text: {
          field: "",
          constantValue: "Our Grooming Services",
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
              "Skip the stressful car rides and chaotic salons. Choose the perfect, personalized care package for your furry family member.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      services: {
        data: serviceCardsSource.defaultValue,
        styles: {
          image: { borderRadius: "default" },
          imageAspectRatio: 0.814,
          title: { ...defaultTextStyles, fontSize: "default" },
          titleFontColor: undefined,
          description: defaultTextStyles,
          descriptionFontColor: undefined,
        },
      },
    },
    render: renderConfig.render,
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeServicesSection",
  displayName: "Services",
  description: "Services Section",
  pageSetTypes: ["ENTITY"],
};
