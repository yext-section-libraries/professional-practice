import { ProfessionalPracticeTestimonialsSection as renderConfig } from "./ProfessionalPracticeTestimonialsSection.render";
import type { ProfessionalPracticeTestimonialsSectionProps } from "./ProfessionalPracticeTestimonialsSection.render";
import { testimonialSource } from "./ProfessionalPracticeTestimonialsSection.render";
import type { SectionConfig } from "@yext/visual-editor";
import {
  msg,
  type YextComponentConfig,
  type YextFields,
} from "@yext/visual-editor";
import { defaultTextStyles } from "../shared/sectionHelpers";
const ProfessionalPracticeTestimonialsSectionFields: YextFields<ProfessionalPracticeTestimonialsSectionProps> =
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
    testimonials: {
      label: msg("fields.testimonials", "Testimonials"),
      type: "object",
      objectFields: {
        data: testimonialSource.field,
        styles: {
          label: msg(
            "fields.testimonialCardPresentation",
            "Testimonial Card Presentation",
          ),
          type: "object",
          objectFields: {
            quote: {
              label: msg("fields.quoteStyles", "Quote Styles"),
              type: "styledText",
            },
            quoteFontColor: {
              label: msg("fields.quoteFontColor", "Quote Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
            name: {
              label: msg("fields.nameStyles", "Name Styles"),
              type: "styledText",
            },
            nameFontColor: {
              label: msg("fields.nameFontColor", "Name Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
            category: {
              label: msg("fields.categoryStyles", "Category Styles"),
              type: "styledText",
            },
            categoryFontColor: {
              label: msg("fields.categoryFontColor", "Category Font Color"),
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

export const ProfessionalPracticeTestimonialsSection: YextComponentConfig<ProfessionalPracticeTestimonialsSectionProps> =
  {
    label: "Testimonials",
    fields: ProfessionalPracticeTestimonialsSectionFields,
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
          constantValue: "Client Notes Worth Repeating",
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      testimonials: {
        data: testimonialSource.defaultValue,
        styles: {
          quote: defaultTextStyles,
          quoteFontColor: undefined,
          name: defaultTextStyles,
          nameFontColor: undefined,
          category: defaultTextStyles,
          categoryFontColor: undefined,
          includeTime: false,
        },
      },
    },
    render: renderConfig.render,
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeTestimonialsSection",
  displayName: "Testimonials",
  description: "Testimonials Section",
  pageSetTypes: ["ENTITY"],
};
