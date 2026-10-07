import { ProfessionalPracticeAboutSection as renderConfig } from "./ProfessionalPracticeAboutSection.render";
import type { ProfessionalPracticeAboutSectionProps } from "./ProfessionalPracticeAboutSection.render";
import type { SectionConfig } from "@yext/visual-editor";
import {
  msg,
  getDefaultRTF,
  type ThemeColor,
  type YextComponentConfig,
  type YextFields,
} from "@yext/visual-editor";
import { defaultTextStyles } from "../shared/sectionHelpers";
const sectionColor: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
};

const lightCtaColor: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "palette-secondary",
};

const aboutImageUrl =
  "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg";

const ProfessionalPracticeAboutSectionFields: YextFields<ProfessionalPracticeAboutSectionProps> =
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
    cta: {
      label: msg("fields.callToAction", "Call to Action"),
      type: "comprehensiveCTA",
    },
    image: {
      label: msg("fields.options.image", "Image"),
      type: "object",
      objectFields: {
        image: {
          type: "entityField",
          label: msg("fields.options.image", "Image"),
          filter: {
            types: ["type.image"],
          },
        },
        aspectRatio: {
          label: msg("fields.options.aspectRatio", "Aspect Ratio"),
          type: "number",
        },
        imageConstrain: {
          label: msg("fields.imageConstrain", "Image Constrain"),
          type: "select",
          options: [
            { label: msg("fields.options.fixed", "Fixed"), value: "fixed" },
            { label: msg("fields.options.filled", "Filled"), value: "filled" },
          ],
        },
        styles: {
          label: msg("fields.imageStyles", "Image Styles"),
          type: "styledImage",
        },
      },
    },
  };

export const ProfessionalPracticeAboutSection: YextComponentConfig<ProfessionalPracticeAboutSectionProps> =
  {
    label: "About",
    fields: ProfessionalPracticeAboutSectionFields,
    defaultProps: {
      section: {
        backgroundColor: sectionColor,
        visibleOnLivePage: true,
      },
      heading: {
        text: {
          field: "",
          constantValue: "About Lucky Dog Mobile Spa",
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
              "Founded by certified master groomers and lifelong pet lovers, Lucky Dog Mobile Spa was born out of a desire to eliminate the anxiety of traditional grooming salons. No cold cages, no barking strangers, and no hours spent waiting in a kennel. Our custom-built, state-of-the-art mobile vans are 100% self-contained with fresh warm water, electricity, and climate control—meaning we never need to plug into your home. We treat every dog like royalty, focusing on safety, sanitation, and individual emotional needs.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontColor: undefined,
      },
      cta: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            constantValueEnabled: true,
            constantValue: {
              ctaType: "textAndLink",
              label: { defaultValue: "Book Online Now" },
              link: { defaultValue: "#" },
              linkType: "URL",
            },
            selectedType: "textAndLink",
          },
          openInNewTab: false,
          buttonText: { defaultValue: "Book Online Now" },
          customId: "",
          customClass: "",
          dataAttributes: [],
          ariaLabel: { defaultValue: "Book Online Now" },
        },
        styles: {
          variant: "secondary",
          color: lightCtaColor,
          button: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
            letterSpacing: "default",
            borderRadius: "12px",
          },
          link: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
            letterSpacing: "default",
            includeCaret: "default",
          },
        },
      },
      image: {
        image: {
          field: "",
          constantValue: {
            url: aboutImageUrl,
            width: 1267,
            height: 1900,
          },
          constantValueEnabled: true,
        },
        aspectRatio: 1.5,
        imageConstrain: "filled",
        styles: {
          borderRadius: "default",
        },
      },
    },
    render: renderConfig.render,
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeAboutSection",
  displayName: "About",
  description: "About Section",
  pageSetTypes: ["ENTITY"],
};
