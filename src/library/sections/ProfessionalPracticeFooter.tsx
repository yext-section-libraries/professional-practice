import { ProfessionalPracticeFooter as renderConfig } from "./ProfessionalPracticeFooter.render";
import type {
  SocialLink,
  PhoneItemProps,
  FooterNavigationLink,
  ProfessionalPracticeFooterProps,
} from "./ProfessionalPracticeFooter.render";
import type { SectionConfig } from "@yext/visual-editor";
import {
  msg,
  type ThemeColor,
  type YextComponentConfig,
  type YextFields,
} from "@yext/visual-editor";
import { defaultTextStyles } from "../shared/sectionHelpers";
const sectionColor: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
};

const ProfessionalPracticeFooterFields: YextFields<ProfessionalPracticeFooterProps> =
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
    brand: {
      label: msg("fields.brand", "Brand"),
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
    socialLinks: {
      label: msg("fields.socialLinks", "Social Links"),
      type: "array",
      arrayFields: {
        cta: {
          label: msg("fields.options.link", "Link"),
          type: "entityField",
          filter: {
            types: ["type.cta"],
          },
        },
        ariaLabel: {
          label: msg("fields.ariaLabel", "Aria Label"),
          type: "text",
        },
        icon: {
          label: msg("fields.options.icon", "Icon"),
          type: "select",
          options: [
            {
              label: msg("fields.options.linkedin", "LinkedIn"),
              value: "linkedin",
            },
            {
              label: msg("fields.options.instagram", "Instagram"),
              value: "instagram",
            },
            {
              label: msg("fields.options.youtube", "YouTube"),
              value: "youtube",
            },
            {
              label: msg("fields.options.facebook", "Facebook"),
              value: "facebook",
            },
            {
              label: msg("fields.options.pinterest", "Pinterest"),
              value: "pinterest",
            },
            {
              label: msg("fields.options.snapchat", "Snapchat"),
              value: "snapchat",
            },
            { label: msg("fields.options.tiktok", "TikTok"), value: "tiktok" },
          ],
        },
      },
      defaultItemProps: {
        cta: {
          field: "",
          constantValue: {
            label: {
              defaultValue: "Social",
            },
            link: {
              defaultValue: "#",
            },
            linkType: "URL",
            openInNewTab: false,
          },
          constantValueEnabled: true,
        },
        ariaLabel: "Social",
        icon: "linkedin",
      },
      getItemSummary: (item: SocialLink) =>
        item.ariaLabel ||
        (typeof item.cta.constantValue?.label === "string"
          ? item.cta.constantValue.label
          : item.cta.constantValue?.label?.defaultValue) ||
        item.cta.field ||
        "Social",
    },
    navigationLinks: {
      label: msg("fields.navigationLinks", "Navigation Links"),
      type: "array",
      arrayFields: {
        cta: {
          label: msg("fields.options.link", "Link"),
          type: "entityField",
          filter: {
            types: ["type.cta"],
          },
        },
      },
      defaultItemProps: {
        cta: {
          field: "",
          constantValue: {
            label: {
              defaultValue: "Link",
            },
            link: {
              defaultValue: "#",
            },
            linkType: "URL",
            openInNewTab: false,
          },
          constantValueEnabled: true,
        },
      },
      getItemSummary: (item: FooterNavigationLink) =>
        typeof item.cta.constantValue?.label === "string"
          ? item.cta.constantValue.label
          : item.cta.constantValue?.label?.defaultValue ||
            item.cta.field ||
            "Link",
    },
    metaAddress: {
      type: "entityField",
      label: msg("fields.address", "Address"),
      filter: {
        types: ["type.address"],
      },
    },
    showRegion: {
      label: msg("fields.showRegion", "Show Region"),
      type: "radio",
      options: [
        { label: msg("fields.options.yes", "Yes"), value: true },
        { label: msg("fields.options.no", "No"), value: false },
      ],
    },
    showCountry: {
      label: msg("fields.showCountry", "Show Country"),
      type: "radio",
      options: [
        { label: msg("fields.options.yes", "Yes"), value: true },
        { label: msg("fields.options.no", "No"), value: false },
      ],
    },
    phones: {
      label: msg("fields.phones", "Phones"),
      type: "object",
      objectFields: {
        items: {
          label: msg("fields.items", "Items"),
          type: "array",
          arrayFields: {
            number: {
              type: "entityField",
              label: msg("fields.number", "Number"),
              filter: {
                types: ["type.phone"],
              },
            },
            label: {
              label: msg("fields.label", "Label"),
              type: "text",
            },
          },
          defaultItemProps: {
            number: {
              field: "",
              constantValue: "",
              constantValueEnabled: true,
            },
            label: "",
          },
          getItemSummary: (item: PhoneItemProps, index?: number) =>
            item.label || item.number.field || `Phone ${index ?? 0}`,
        },
        phoneFormat: {
          label: msg("fields.phoneFormat", "Phone Format"),
          type: "radio",
          options: [
            {
              label: msg("fields.options.domestic", "Domestic"),
              value: "domestic",
            },
            {
              label: msg("fields.options.international", "International"),
              value: "international",
            },
          ],
        },
        includeHyperlink: {
          label: msg("fields.includeHyperlink", "Include Hyperlink"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
      },
    },
    website: {
      label: msg("fields.website", "Website"),
      type: "entityField",
      filter: {
        types: ["type.cta"],
      },
    },
  };

export const ProfessionalPracticeFooter: YextComponentConfig<ProfessionalPracticeFooterProps> =
  {
    label: "Footer",
    fields: ProfessionalPracticeFooterFields,
    defaultProps: {
      section: {
        backgroundColor: sectionColor,
        visibleOnLivePage: true,
      },
      brand: {
        text: {
          field: "",
          constantValue: "Lucky Dog Mobile Spa",
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      socialLinks: [
        {
          cta: {
            field: "",
            constantValue: {
              label: {
                defaultValue: "LinkedIn",
              },
              link: {
                defaultValue: "#",
              },
              linkType: "URL",
              openInNewTab: false,
            },
            constantValueEnabled: true,
          },
          ariaLabel: "LinkedIn",
          icon: "linkedin",
        },
        {
          cta: {
            field: "",
            constantValue: {
              label: {
                defaultValue: "Instagram",
              },
              link: {
                defaultValue: "#",
              },
              linkType: "URL",
              openInNewTab: false,
            },
            constantValueEnabled: true,
          },
          ariaLabel: "Instagram",
          icon: "instagram",
        },
        {
          cta: {
            field: "",
            constantValue: {
              label: {
                defaultValue: "YouTube",
              },
              link: {
                defaultValue: "#",
              },
              linkType: "URL",
              openInNewTab: false,
            },
            constantValueEnabled: true,
          },
          ariaLabel: "YouTube",
          icon: "youtube",
        },
      ],
      navigationLinks: [
        {
          cta: {
            field: "",
            constantValue: {
              label: {
                defaultValue: "Packages & Pricing",
              },
              link: {
                defaultValue: "#",
              },
              linkType: "URL",
              openInNewTab: false,
            },
            constantValueEnabled: true,
          },
        },
        {
          cta: {
            field: "",
            constantValue: {
              label: {
                defaultValue: "Clean Pup Club",
              },
              link: {
                defaultValue: "#",
              },
              linkType: "URL",
              openInNewTab: false,
            },
            constantValueEnabled: true,
          },
        },
        {
          cta: {
            field: "",
            constantValue: {
              label: {
                defaultValue: "Care Tips",
              },
              link: {
                defaultValue: "#",
              },
              linkType: "URL",
              openInNewTab: false,
            },
            constantValueEnabled: true,
          },
        },
        {
          cta: {
            field: "",
            constantValue: {
              label: {
                defaultValue: "Careers",
              },
              link: {
                defaultValue: "#",
              },
              linkType: "URL",
              openInNewTab: false,
            },
            constantValueEnabled: true,
          },
        },
        {
          cta: {
            field: "",
            constantValue: {
              label: {
                defaultValue: "Contact Us",
              },
              link: {
                defaultValue: "#",
              },
              linkType: "URL",
              openInNewTab: false,
            },
            constantValueEnabled: true,
          },
        },
        {
          cta: {
            field: "",
            constantValue: {
              label: {
                defaultValue: "Home",
              },
              link: {
                defaultValue: "#",
              },
              linkType: "URL",
              openInNewTab: false,
            },
            constantValueEnabled: true,
          },
        },
      ],
      metaAddress: {
        field: "address",
        constantValue: {
          line1: "",
          city: "",
          postalCode: "",
          countryCode: "",
          region: "",
        },
        constantValueEnabled: false,
      },
      showRegion: true,
      showCountry: false,
      phones: {
        items: [
          {
            number: {
              field: "mainPhone",
              constantValue: "",
              constantValueEnabled: false,
            },
            label: "",
          },
        ],
        phoneFormat: "domestic",
        includeHyperlink: true,
      },
      website: {
        field: "",
        constantValue: {
          label: {
            defaultValue:
              "https://www.luckydogmobilespa.com/locations/main-hub",
          },
          link: {
            defaultValue:
              "https://www.luckydogmobilespa.com/locations/main-hub",
          },
          linkType: "URL",
          openInNewTab: true,
        },
        constantValueEnabled: true,
      },
    },
    render: renderConfig.render,
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeFooter",
  displayName: "Footer",
  description: "Footer",
  pageSetTypes: ["ENTITY", "DIRECTORY", "LOCATOR"],
};
