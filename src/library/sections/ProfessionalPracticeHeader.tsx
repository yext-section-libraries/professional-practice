import { ProfessionalPracticeHeader as renderConfig } from "./ProfessionalPracticeHeader.render";
import type {
  SharedHeaderLink,
  SharedHeaderAction,
  ProfessionalPracticeHeaderProps,
} from "./ProfessionalPracticeHeader.render";
import type { SectionConfig } from "@yext/visual-editor";
import { type LinkType } from "@yext/pages-components";
import {
  msg,
  type ComprehensiveCTAValue,
  type StyledButtonValue,
  type StyledImageValue,
  type StyledLinkValue,
  type ThemeColor,
  type TranslatableString,
  type YextComponentConfig,
  type YextFields,
  i18nPageInstance,
  resolveComponentData,
} from "@yext/visual-editor";
import { aspectRatioOptions } from "../shared/sectionHelpers";
const linkTypeOptions: Array<{ label: string; value: LinkType }> = [
  { label: msg("fields.options.url", "URL"), value: "URL" },
  { label: msg("fields.options.phone", "Phone"), value: "PHONE" },
  { label: msg("fields.options.email", "Email"), value: "EMAIL" },
];

const defaultPrimaryCtaColor: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
};

const defaultLinkStyles: StyledLinkValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
  letterSpacing: "default",
  includeCaret: "default",
};

const defaultButtonStyles: StyledButtonValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
  letterSpacing: "default",
  borderRadius: "12px",
};

const defaultImageStyles: StyledImageValue = {
  borderRadius: "default",
};

const defaultUtilityIconImage: SharedHeaderAction["iconImage"] = {
  image: {
    field: "",
    constantValueEnabled: true,
    constantValue: {
      url: "",
      width: 0,
      height: 0,
    },
  },
  aspectRatio: 1,
  imageConstrain: "fixed",
  styles: {
    borderRadius: "default",
  },
};

const getTranslatableSummary = (
  value: TranslatableString | undefined,
  fallback: string,
): string => {
  if (!value) {
    return fallback;
  }

  if (typeof value === "string") {
    return value;
  }

  return (
    resolveComponentData(value, i18nPageInstance.language, undefined) ||
    value.defaultValue ||
    fallback
  );
};

const ProfessionalPracticeHeaderFields: YextFields<ProfessionalPracticeHeaderProps> =
  {
    variant: {
      label: msg("fields.variant", "Variant"),
      type: "select",
      options: [
        {
          label: msg(
            "fields.options.centeredLogoSplitNav",
            "Centered Logo Split Nav",
          ),
          value: "centerLogoSplitNav",
        },
        {
          label: msg(
            "fields.options.logoLeftInlineNav",
            "Logo Left Inline Nav",
          ),
          value: "logoLeftInlineNav",
        },
        {
          label: msg("fields.options.stackedNavBelow", "Stacked Nav Below"),
          value: "stackedNavBelow",
        },
        {
          label: msg("fields.options.utilityTopRow", "Utility Top Row"),
          value: "utilityTopRow",
        },
      ],
    },
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
        dividerColor: {
          label: msg("fields.dividerColor", "Divider Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    navigation: {
      label: msg("fields.navigation", "Navigation"),
      type: "object",
      objectFields: {
        show: {
          label: msg("fields.showNavigation", "Show Navigation"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
        links: {
          label: msg("fields.links", "Links"),
          type: "array",
          arrayFields: {
            label: {
              label: msg("fields.label", "Label"),
              type: "translatableString",
            },
            link: {
              label: msg("fields.options.link", "Link"),
              type: "translatableString",
            },
            linkType: {
              label: msg("fields.linkType", "Link Type"),
              type: "select",
              options: linkTypeOptions,
            },
            normalizeLink: {
              label: msg("fields.normalizeLink", "Normalize Link"),
              type: "radio",
              options: [
                { label: msg("fields.options.yes", "Yes"), value: true },
                { label: msg("fields.options.no", "No"), value: false },
              ],
            },
            openInNewTab: {
              label: msg("fields.openInNewTab", "Open in New Tab"),
              type: "radio",
              options: [
                { label: msg("fields.options.yes", "Yes"), value: true },
                { label: msg("fields.options.no", "No"), value: false },
              ],
            },
          },
          defaultItemProps: (index: number) => ({
            label: `Link ${index + 1}`,
            link: "#",
            linkType: "URL",
            normalizeLink: false,
            openInNewTab: false,
          }),
          getItemSummary: (item: SharedHeaderLink, index?: number) =>
            getTranslatableSummary(item.label, `Link ${index ?? 0}`),
        },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
        styles: {
          label: msg("fields.linkStyles", "Link Styles"),
          type: "styledLink",
          showIncludeCaretField: false,
        },
      },
    },
    utilities: {
      label: msg("fields.utilityIcons", "Utility Icons"),
      type: "object",
      objectFields: {
        show: {
          label: msg("fields.showUtilityLinks", "Show Utility Links"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
        items: {
          label: msg("fields.items", "Items"),
          type: "array",
          arrayFields: {
            iconImage: {
              label: msg("fields.iconImage", "Icon Image"),
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
                  type: "basicSelector",
                  options: aspectRatioOptions,
                },
                imageConstrain: {
                  label: msg("fields.imageConstrain", "Image Constrain"),
                  type: "select",
                  options: [
                    {
                      label: msg("fields.options.fixed", "Fixed"),
                      value: "fixed",
                    },
                    {
                      label: msg("fields.options.filled", "Filled"),
                      value: "filled",
                    },
                  ],
                },
                styles: {
                  label: msg("fields.imageStyles", "Image Styles"),
                  type: "styledImage",
                },
              },
            },
            label: {
              label: msg("fields.label", "Label"),
              type: "translatableString",
            },
            link: {
              label: msg("fields.options.link", "Link"),
              type: "translatableString",
            },
            linkType: {
              label: msg("fields.linkType", "Link Type"),
              type: "select",
              options: linkTypeOptions,
            },
            normalizeLink: {
              label: msg("fields.normalizeLink", "Normalize Link"),
              type: "radio",
              options: [
                { label: msg("fields.options.yes", "Yes"), value: true },
                { label: msg("fields.options.no", "No"), value: false },
              ],
            },
            openInNewTab: {
              label: msg("fields.openInNewTab", "Open in New Tab"),
              type: "radio",
              options: [
                { label: msg("fields.options.yes", "Yes"), value: true },
                { label: msg("fields.options.no", "No"), value: false },
              ],
            },
          },
          defaultItemProps: (index: number) => ({
            iconImage: defaultUtilityIconImage,
            label: `Item ${index + 1}`,
            link: "#",
            linkType: "URL",
            normalizeLink: false,
            openInNewTab: false,
          }),
          getItemSummary: (item: SharedHeaderAction, index?: number) =>
            getTranslatableSummary(item.label, `Action ${index ?? 0}`),
        },
      },
    },
    cta: {
      label: msg("fields.callToActions", "Call to Actions"),
      type: "object",
      objectFields: {
        show: {
          label: msg("fields.showCta", "Show CTA"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
        items: {
          label: msg("fields.items", "Items"),
          type: "array",
          arrayFields: {
            cta: {
              label: msg("fields.cta", "CTA"),
              type: "comprehensiveCTA",
            },
          },
          defaultItemProps: {
            cta: {
              data: {
                actionType: "link",
                cta: {
                  field: "",
                  constantValueEnabled: true,
                  constantValue: {
                    ctaType: "textAndLink",
                    label: { defaultValue: "CTA Label" },
                    link: { defaultValue: "#" },
                    linkType: "URL",
                  },
                  selectedType: "textAndLink",
                },
                openInNewTab: false,
                buttonText: { defaultValue: "Button" },
                customId: "",
                customClass: "",
                dataAttributes: [],
                ariaLabel: { defaultValue: "CTA Label" },
              },
              styles: {
                variant: "primary",
                color: defaultPrimaryCtaColor,
                button: defaultButtonStyles,
                link: defaultLinkStyles,
              },
            },
          },
          getItemSummary: (
            item: { cta?: ComprehensiveCTAValue },
            index?: number,
          ) =>
            getTranslatableSummary(
              item.cta?.data?.cta?.constantValue?.label,
              `CTA ${index ?? 0}`,
            ),
        },
      },
    },
    logoImage: {
      label: msg("fields.logoImage", "Logo Image"),
      type: "object",
      objectFields: {
        show: {
          label: msg("fields.showLogo", "Show Logo"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
        image: {
          type: "entityField",
          label: msg("fields.options.image", "Image"),
          filter: {
            types: ["type.image"],
          },
        },
        url: {
          label: msg("fields.options.url", "URL"),
          type: "entityField",
          filter: {
            types: ["type.string"],
          },
        },
        aspectRatio: {
          label: msg("fields.options.aspectRatio", "Aspect Ratio"),
          type: "basicSelector",
          options: aspectRatioOptions,
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

export const ProfessionalPracticeHeader: YextComponentConfig<ProfessionalPracticeHeaderProps> =
  {
    label: "Header",
    fields: ProfessionalPracticeHeaderFields,
    defaultProps: {
      variant: "logoLeftInlineNav",
      section: {
        visibleOnLivePage: true,
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "palette-quaternary",
        },
        dividerColor: undefined,
      },
      navigation: {
        show: true,
        links: [
          {
            label: "Our Services",
            link: "#",
            linkType: "URL",
            normalizeLink: false,
            openInNewTab: false,
          },
          {
            label: "Service Areas & Pricing",
            link: "#",
            linkType: "URL",
            normalizeLink: false,
            openInNewTab: false,
          },
          {
            label: "Membership Perks",
            link: "#",
            linkType: "URL",
            normalizeLink: false,
            openInNewTab: false,
          },
          {
            label: "FAQs",
            link: "#",
            linkType: "URL",
            normalizeLink: false,
            openInNewTab: false,
          },
          {
            label: "About Us",
            link: "#",
            linkType: "URL",
            normalizeLink: false,
            openInNewTab: false,
          },
        ],
        styles: defaultLinkStyles,
      },
      utilities: {
        show: true,
        items: [
          {
            iconImage: defaultUtilityIconImage,
            label: "Item 1",
            link: "#",
            linkType: "URL",
            normalizeLink: false,
            openInNewTab: false,
          },
          {
            iconImage: defaultUtilityIconImage,
            label: "Item 2",
            link: "#",
            linkType: "URL",
            normalizeLink: false,
            openInNewTab: false,
          },
          {
            iconImage: defaultUtilityIconImage,
            label: "Item 3",
            link: "#",
            linkType: "URL",
            normalizeLink: false,
            openInNewTab: false,
          },
        ],
      },
      cta: {
        show: true,
        items: [
          {
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
                variant: "primary",
                color: defaultPrimaryCtaColor,
                button: defaultButtonStyles,
                link: defaultLinkStyles,
              },
            },
          },
        ],
      },
      logoImage: {
        show: true,
        image: {
          field: "",
          constantValueEnabled: true,
          constantValue: {
            url: "",
            width: 0,
            height: 0,
          },
        },
        url: {
          field: "",
          constantValue: {
            defaultValue: "",
          },
          constantValueEnabled: true,
        },
        aspectRatio: 1,
        imageConstrain: "fixed",
        styles: defaultImageStyles,
      },
    },
    render: renderConfig.render,
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeHeader",
  displayName: "Header",
  description: "Header",
  pageSetTypes: ["ENTITY", "DIRECTORY", "LOCATOR"],
};
