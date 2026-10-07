import { ProfessionalPracticeHeroSection as renderConfig } from "./ProfessionalPracticeHeroSection.render";
import type { ProfessionalPracticeHeroSectionProps } from "./ProfessionalPracticeHeroSection.render";
import type { SectionConfig } from "@yext/visual-editor";
import {
  msg,
  getDefaultRTF,
  type ThemeColor,
  type YextComponentConfig,
  type YextFields,
} from "@yext/visual-editor";
import { type HoursType } from "@yext/pages-components";
import { defaultTextStyles } from "../shared/sectionHelpers";
const defaultSurfaceColor: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "palette-quaternary",
};

const defaultStatusBackgroundColor: ThemeColor = {
  selectedColor: "palette-tertiary",
  contrastingColor: "palette-tertiary-contrast",
};

const defaultPrimaryCtaColor: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
};

const defaultSecondaryCtaColor: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "palette-secondary",
};

const heroImageUrl =
  "https://a.mktgcdn.com/p/vQqhmnexQfZueJGyh5M_j5W4EcTkTyZlW93eIoqjjvQ/1900x1267.jpg";

const ProfessionalPracticeHeroSectionFields: YextFields<ProfessionalPracticeHeroSectionProps> =
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
    description: {
      label: msg("fields.description", "Description"),
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
    statusPill: {
      label: msg("fields.statusPill", "Status Pill"),
      type: "object",
      objectFields: {
        backgroundColor: {
          label: msg("fields.backgroundColor", "Background Color"),
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
        hours: {
          type: "entityField",
          label: msg("fields.hours", "Hours"),
          filter: {
            types: ["type.hours"],
          },
          disableConstantValueToggle: true,
        },
        hoursStyles: {
          label: msg("fields.hoursStyles", "Hours Styles"),
          type: "object",
          objectFields: {
            showCurrentStatus: {
              label: msg("fields.showCurrentStatus", "Show Current Status"),
              type: "radio",
              options: [
                { label: msg("fields.options.yes", "Yes"), value: true },
                { label: msg("fields.options.no", "No"), value: false },
              ],
            },
            timeFormat: {
              label: msg("fields.timeFormat", "Time Format"),
              type: "select",
              options: [
                {
                  label: msg("fields.options.hour12Label", "12 Hour"),
                  value: "12h",
                },
                {
                  label: msg("fields.options.hour24Label", "24 Hour"),
                  value: "24h",
                },
              ],
            },
            dayOfWeekFormat: {
              label: msg("fields.dayOfWeekFormatLabel", "Day Of Week Format"),
              type: "select",
              options: [
                { label: msg("fields.options.short", "Short"), value: "short" },
                { label: msg("fields.options.long", "Long"), value: "long" },
              ],
            },
            showDayNames: {
              label: msg("fields.showDayNames", "Show Day Names"),
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
    heroImage: {
      label: msg("fields.heroImage", "Hero Image"),
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
    primaryCta: {
      label: msg("fields.primaryCallToAction", "Primary Call to Action"),
      type: "comprehensiveCTA",
    },
    secondaryCta: {
      label: msg("fields.secondaryCallToAction", "Secondary Call to Action"),
      type: "comprehensiveCTA",
    },
  };

export const ProfessionalPracticeHeroSection: YextComponentConfig<ProfessionalPracticeHeroSectionProps> =
  {
    label: "Hero",
    fields: ProfessionalPracticeHeroSectionFields,
    defaultProps: {
      section: {
        backgroundColor: defaultSurfaceColor,
        visibleOnLivePage: true,
      },
      heading: {
        text: {
          field: "name",
          constantValue: "",
          constantValueEnabled: false,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      description: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "Lucky Dog Mobile Spa delivers a stress-free, cage-free luxury grooming experience right to your doorstep. Serving Falls Church, VA and surrounding neighborhoods, our certified groomers combine premium organic products with state-of-the-art mobile vans to keep your pup happy, healthy, and pristine.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontColor: undefined,
      },
      statusPill: {
        backgroundColor: defaultStatusBackgroundColor,
        fontColor: undefined,
        hours: {
          field: "hours",
          constantValue: {} as HoursType,
          constantValueEnabled: false,
        },
        hoursStyles: {
          showCurrentStatus: true,
          timeFormat: "12h",
          dayOfWeekFormat: "long",
          showDayNames: false,
        },
      },
      heroImage: {
        image: {
          field: "",
          constantValue: {
            url: heroImageUrl,
            width: 1900,
            height: 1267,
          },
          constantValueEnabled: true,
        },
        aspectRatio: 1.5,
        imageConstrain: "filled",
        styles: {
          borderRadius: "default",
        },
      },
      primaryCta: {
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
          variant: "primary",
          color: defaultPrimaryCtaColor,
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
      secondaryCta: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            constantValueEnabled: true,
            constantValue: {
              ctaType: "textAndLink",
              label: { defaultValue: "View Service Areas & Rates" },
              link: { defaultValue: "#" },
              linkType: "URL",
            },
            selectedType: "textAndLink",
          },
          openInNewTab: false,
          buttonText: { defaultValue: "View Service Areas & Rates" },
          customId: "",
          customClass: "",
          dataAttributes: [],
          ariaLabel: { defaultValue: "View Service Areas & Rates" },
        },
        styles: {
          variant: "secondary",
          color: defaultSecondaryCtaColor,
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
    },
    render: renderConfig.render,
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeHeroSection",
  displayName: "Hero",
  description: "Hero Section",
  pageSetTypes: ["ENTITY"],
};
