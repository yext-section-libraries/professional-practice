import { ProfessionalPracticeFaqSection as renderConfig } from "./ProfessionalPracticeFaqSection.render";
import type { ProfessionalPracticeFaqSectionProps } from "./ProfessionalPracticeFaqSection.render";
import { faqItemsSource } from "./ProfessionalPracticeFaqSection.render";
import type { SectionConfig } from "@yext/visual-editor";
import {
  msg,
  type YextComponentConfig,
  type YextFields,
} from "@yext/visual-editor";
import { defaultTextStyles } from "../shared/sectionHelpers";
const ProfessionalPracticeFaqSectionFields: YextFields<ProfessionalPracticeFaqSectionProps> =
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
    faqs: {
      label: msg("fields.faqs", "FAQs"),
      type: "object",
      objectFields: {
        data: faqItemsSource.field,
        styles: {
          label: msg("fields.faqPresentation", "FAQ Presentation"),
          type: "object",
          objectFields: {
            question: {
              label: msg("fields.questionStyles", "Question Styles"),
              type: "styledText",
            },
            questionFontColor: {
              label: msg("fields.questionFontColor", "Question Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
            answer: {
              label: msg("fields.answerStyles", "Answer Styles"),
              type: "styledText",
            },
            answerFontColor: {
              label: msg("fields.answerFontColor", "Answer Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
      },
    },
  };

export const ProfessionalPracticeFaqSection: YextComponentConfig<ProfessionalPracticeFaqSectionProps> =
  {
    label: "FAQ",
    fields: ProfessionalPracticeFaqSectionFields,
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
          constantValue: "Frequently Asked Questions",
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      faqs: {
        data: faqItemsSource.defaultValue,
        styles: {
          question: defaultTextStyles,
          questionFontColor: undefined,
          answer: defaultTextStyles,
          answerFontColor: undefined,
        },
      },
    },
    render: renderConfig.render,
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeFaqSection",
  displayName: "FAQ",
  description: "FAQ Section",
  pageSetTypes: ["ENTITY"],
};
