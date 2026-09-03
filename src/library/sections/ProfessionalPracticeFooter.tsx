import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { parsePhoneNumber } from "awesome-phonenumber";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaSnapchatGhost,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import {
  EntityField,
  type EnhancedTranslatableCTA,
  type StyledTextValue,
  type ThemeColor,
  VisibilityWrapper,
  type YextCTAField,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  getAnalyticsScopeHash,
  isDarkColor,
  resolveComponentData,
  useDocument,
} from "@yext/visual-editor";
import {
  Address,
  AnalyticsScopeProvider,
  Link,
  type AddressType,
} from "@yext/pages-components";

type StyledTextProps = {
  text: YextEntityField<string>;
  styles: StyledTextValueWithLetterSpacing;
  fontColor?: ThemeColor;
};

type StyledTextValueWithLetterSpacing = StyledTextValue & {
  letterSpacing?: string;
};

type SocialLink = {
  cta: YextCTAField;
  ariaLabel: string;
  icon:
    | "linkedin"
    | "instagram"
    | "youtube"
    | "facebook"
    | "pinterest"
    | "snapchat"
    | "tiktok";
};

type PhoneItemProps = {
  number: YextEntityField<string>;
  label?: string;
};

type PhoneFieldProps = {
  items: PhoneItemProps[];
  phoneFormat: "international" | "domestic";
  includeHyperlink?: boolean;
};

type FooterNavigationLink = {
  cta: YextCTAField;
};

type ProfessionalPracticeFooterProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  brand: StyledTextProps;
  socialLinks: SocialLink[];
  navigationLinks: FooterNavigationLink[];
  metaAddress: YextEntityField<AddressType>;
  showRegion: boolean;
  showCountry: boolean;
  phones: PhoneFieldProps;
  website: YextCTAField;
};

const sectionColor: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
};

const socialIcons: Record<
  SocialLink["icon"],
  React.ComponentType<{ className?: string }>
> = {
  linkedin: FaLinkedinIn,
  instagram: FaInstagram,
  youtube: FaYoutube,
  facebook: FaFacebookF,
  pinterest: FaPinterestP,
  snapchat: FaSnapchatGhost,
  tiktok: FaTiktok,
};

const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};

const resolveThemeColorCssValue = (color?: ThemeColor): string | undefined => {
  if (!color?.selectedColor || color.selectedColor === "default") {
    return undefined;
  }

  const selectedColor = color.selectedColor;
  const customColorMatch = /^\[(#[0-9A-Fa-f]{3,8})\]$/.exec(selectedColor);

  if (customColorMatch) {
    return customColorMatch[1];
  }

  switch (selectedColor) {
    case "palette-primary":
      return "var(--colors-palette-primary)";
    case "palette-secondary":
      return "var(--colors-palette-secondary)";
    case "palette-tertiary":
      return "var(--colors-palette-tertiary)";
    case "palette-quaternary":
      return "var(--colors-palette-quaternary)";
    case "palette-primary-light":
      return "hsl(from var(--colors-palette-primary) h s 98)";
    case "palette-secondary-light":
      return "hsl(from var(--colors-palette-secondary) h s 98)";
    case "palette-tertiary-light":
      return "hsl(from var(--colors-palette-tertiary) h s 98)";
    case "palette-quaternary-light":
      return "hsl(from var(--colors-palette-quaternary) h s 98)";
    case "palette-primary-dark":
      return "hsl(from var(--colors-palette-primary) h s 20)";
    case "palette-secondary-dark":
      return "hsl(from var(--colors-palette-secondary) h s 20)";
    case "white":
      return "#ffffff";
    default:
      return selectedColor;
  }
};

const resolveReadableForegroundColor = (
  fontColor: ThemeColor | undefined,
  backgroundColor: ThemeColor,
  streamDocument: any,
): string | undefined => {
  const selectedFontColor =
    fontColor?.selectedColor === "default" ? undefined : fontColor;

  if (selectedFontColor) {
    return resolveThemeColorCssValue(selectedFontColor);
  }

  return isDarkColor(backgroundColor, streamDocument) ? "#ffffff" : "#000000";
};

const formatPhone = (value: string, format: "international" | "domestic") => {
  const parsed = parsePhoneNumber(value.replace(/(?!^\+)\+|[^\d+]/g, ""));
  if (!parsed.valid || !parsed.number) {
    return value;
  }

  return format === "international"
    ? parsed.number.international
    : parsed.number.national;
};


const ProfessionalPracticeFooterFields: YextFields<ProfessionalPracticeFooterProps> =
  {
    section: {
      label: "Section",
      type: "object",
      objectFields: {
        backgroundColor: {
          label: "Background Color",
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
        visibleOnLivePage: {
          label: "Visible on Live Page",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      },
    },
    brand: {
      label: "Brand",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.string"],
          },
        },
        styles: {
          label: "Text Styles",
          type: "styledText",
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    socialLinks: {
      label: "Social Links",
      type: "array",
      arrayFields: {
        cta: {
          label: "Link",
          type: "entityField",
          filter: {
            types: ["type.cta"],
          },
        },
        ariaLabel: {
          label: "Aria Label",
          type: "text",
        },
        icon: {
          label: "Icon",
          type: "select",
          options: [
            { label: "LinkedIn", value: "linkedin" },
            { label: "Instagram", value: "instagram" },
            { label: "YouTube", value: "youtube" },
            { label: "Facebook", value: "facebook" },
            { label: "Pinterest", value: "pinterest" },
            { label: "Snapchat", value: "snapchat" },
            { label: "TikTok", value: "tiktok" },
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
      label: "Navigation Links",
      type: "array",
      arrayFields: {
        cta: {
          label: "Link",
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
      label: "Address",
      filter: {
        types: ["type.address"],
      },
    },
    showRegion: {
      label: "Show Region",
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    showCountry: {
      label: "Show Country",
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    phones: {
      label: "Phones",
      type: "object",
      objectFields: {
        items: {
          label: "Items",
          type: "array",
          arrayFields: {
            number: {
              type: "entityField",
              label: "Number",
              filter: {
                types: ["type.phone"],
              },
            },
            label: {
              label: "Label",
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
          label: "Phone Format",
          type: "radio",
          options: [
            { label: "Domestic", value: "domestic" },
            { label: "International", value: "international" },
          ],
        },
        includeHyperlink: {
          label: "Include Hyperlink",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      },
    },
    website: {
      label: "Website",
      type: "entityField",
      filter: {
        types: ["type.cta"],
      },
    },
  };

const ProfessionalPracticeFooterComponent: PuckComponent<ProfessionalPracticeFooterProps> =
  (props) => {
    const streamDocument = useDocument();
    const locale = streamDocument.locale ?? "en";
    const footerTextColor = resolveReadableForegroundColor(
      undefined,
      props.section.backgroundColor,
      streamDocument,
    );
    const brandColor = resolveReadableForegroundColor(props.brand.fontColor, props.section.backgroundColor, streamDocument);
    const brand =
      resolveComponentData(props.brand.text, locale, streamDocument) || "";
    const address = resolveComponentData(
      props.metaAddress,
      locale,
      streamDocument,
    ) as AddressType | undefined;
    const resolvedWebsite = resolveComponentData(
      props.website,
      locale,
      streamDocument,
    ) as EnhancedTranslatableCTA | undefined;
    const resolvedNavigationLinks = (props.navigationLinks ?? [])
      .map((item, index) => {
        const resolved = resolveComponentData(
          item.cta,
          locale,
          streamDocument,
        ) as EnhancedTranslatableCTA | undefined;
        const label =
          typeof resolved?.label === "string"
            ? resolved.label
            : resolved?.label?.defaultValue ?? "";
        const link =
          typeof resolved?.link === "string"
            ? resolved.link
            : resolved?.link?.defaultValue ?? "";

        if (!label || !link) {
          return null;
        }

        return {
          key: `${label}-${index}`,
          fieldId: item.cta.field,
          constantValueEnabled: item.cta.constantValueEnabled,
          label,
          link,
          linkType: resolved?.linkType ?? "URL",
          openInNewTab: resolved?.openInNewTab ?? false,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
    const resolvedSocialLinks = (props.socialLinks ?? [])
      .map((item, index) => {
        const resolved = resolveComponentData(
          item.cta,
          locale,
          streamDocument,
        ) as EnhancedTranslatableCTA | undefined;
        const link =
          typeof resolved?.link === "string"
            ? resolved.link
            : resolved?.link?.defaultValue ?? "";

        if (!link) {
          return null;
        }

        return {
          key: `${item.ariaLabel}-${index}`,
          fieldId: item.cta.field,
          constantValueEnabled: item.cta.constantValueEnabled,
          link,
          linkType: resolved?.linkType ?? "URL",
          openInNewTab: resolved?.openInNewTab ?? false,
          ariaLabel: item.ariaLabel,
          icon: item.icon,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
    const phones = (props.phones.items ?? [])
      .map((item) => {
        const resolvedPhone = resolveComponentData(
          item.number,
          locale,
          streamDocument,
        );
        const trimmed = typeof resolvedPhone === "string" ? resolvedPhone.trim() : "";
        if (!trimmed) {
          return null;
        }
        return {
          fieldId: item.number.field,
          constantValueEnabled: item.number.constantValueEnabled,
          formatted: formatPhone(trimmed, props.phones.phoneFormat),
          telValue: trimmed.replace(/\D/g, ""),
          label: item.label?.trim() ?? "",
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
    const websiteLabel =
      typeof resolvedWebsite?.label === "string"
        ? resolvedWebsite.label
        : resolvedWebsite?.label?.defaultValue ??
          "";
    const websiteLink =
      typeof resolvedWebsite?.link === "string"
        ? resolvedWebsite.link
        : resolvedWebsite?.link?.defaultValue ??
          "";
    const websiteLinkType = resolvedWebsite?.linkType ?? "URL";
    const websiteOpenInNewTab = resolvedWebsite?.openInNewTab ?? true;

    return (
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <AnalyticsScopeProvider
          name={`ProfessionalPracticeFooter${getAnalyticsScopeHash(props.id)}`}
        >
          <footer
            data-ypp-scope="footer"
            style={{
              backgroundColor: resolveThemeColorCssValue(
                props.section.backgroundColor,
              ),
              color: footerTextColor,
            }}
          >
            <style>{`
              [data-ypp-scope="footer"] .ypp-typography p {
                font-family: var(--fontFamily-body-fontFamily);
                font-size: var(--fontSize-body-fontSize);
                line-height: 1.5;
                font-weight: var(--fontWeight-body-fontWeight);
                font-style: var(--fontStyle-body-fontStyle);
                text-transform: var(--textTransform-body-textTransform);
              }

              [data-ypp-scope="footer"] .ypp-typography li {
                font-family: var(--fontFamily-body-fontFamily);
                font-size: var(--fontSize-body-fontSize);
                line-height: 1.5;
                font-weight: var(--fontWeight-body-fontWeight);
                font-style: var(--fontStyle-body-fontStyle);
                text-transform: var(--textTransform-body-textTransform);
              }

              [data-ypp-scope="footer"] .ypp-typography h1 {
                font-family: var(--fontFamily-h1-fontFamily);
                font-size: var(--fontSize-h1-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h1-fontWeight);
                font-style: var(--fontStyle-h1-fontStyle);
                text-transform: var(--textTransform-h1-textTransform);
              }

              [data-ypp-scope="footer"] .ypp-typography h2 {
                font-family: var(--fontFamily-h2-fontFamily);
                font-size: var(--fontSize-h2-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h2-fontWeight);
                font-style: var(--fontStyle-h2-fontStyle);
                text-transform: var(--textTransform-h2-textTransform);
              }

              [data-ypp-scope="footer"] .ypp-typography h3 {
                font-family: var(--fontFamily-h3-fontFamily);
                font-size: var(--fontSize-h3-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h3-fontWeight);
                font-style: var(--fontStyle-h3-fontStyle);
                text-transform: var(--textTransform-h3-textTransform);
              }

              [data-ypp-scope="footer"] .ypp-typography h4 {
                font-family: var(--fontFamily-h4-fontFamily);
                font-size: var(--fontSize-h4-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h4-fontWeight);
                font-style: var(--fontStyle-h4-fontStyle);
                text-transform: var(--textTransform-h4-textTransform);
              }

              [data-ypp-scope="footer"] .ypp-typography h5 {
                font-family: var(--fontFamily-h5-fontFamily);
                font-size: var(--fontSize-h5-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h5-fontWeight);
                font-style: var(--fontStyle-h5-fontStyle);
                text-transform: var(--textTransform-h5-textTransform);
              }

              [data-ypp-scope="footer"] .ypp-typography h6 {
                font-family: var(--fontFamily-h6-fontFamily);
                font-size: var(--fontSize-h6-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h6-fontWeight);
                font-style: var(--fontStyle-h6-fontStyle);
                text-transform: var(--textTransform-h6-textTransform);
              }

              [data-ypp-scope="footer"] .ypp-typography a {
                font-family: var(--fontFamily-link-fontFamily);
                font-size: var(--fontSize-link-fontSize);
                font-weight: var(--fontWeight-link-fontWeight);
                font-style: var(--fontStyle-link-fontStyle);
                line-height: 1.5;
                text-decoration: none;
                text-transform: var(--textTransform-link-textTransform);
                letter-spacing: var(--letterSpacing-link-letterSpacing);
              }

              [data-ypp-scope="footer"] .footer__nav-link:hover,
              [data-ypp-scope="footer"] .footer__nav-link:focus-visible,
              [data-ypp-scope="footer"] .footer__website-link:hover,
              [data-ypp-scope="footer"] .footer__website-link:focus-visible {
                text-decoration: underline;
              }

              @media (max-width: 1023px) {
                [data-ypp-scope="footer"] .footer__website-link {
                  display: inline-block;
                  max-width: 100%;
                  overflow-wrap: anywhere;
                  word-break: break-word;
                }
              }
            `}</style>
            <div className="mx-auto flex max-w-[1280px] flex-col gap-[30px] px-4 pt-[60px] pb-[30px] md:px-8 md:py-[30px] xl:px-20 xl:py-[60px]">
              <div className="flex flex-col gap-[30px] lg:flex-row lg:items-center lg:justify-between">
                <EntityField
                  displayName="Brand"
                  fieldId={props.brand.text.field}
                  constantValueEnabled={props.brand.text.constantValueEnabled}
                >
                  <p
                    className="ypp-typography m-0"
                    style={{
                      fontFamily:
                        props.brand.styles.fontFamily === "default"
                          ? undefined
                          : props.brand.styles.fontFamily,
                      fontSize:
                        props.brand.styles.fontSize === "default"
                          ? undefined
                          : props.brand.styles.fontSize,
                      color: brandColor,
                      fontWeight:
                        props.brand.styles.fontWeight === "default"
                          ? undefined
                          : props.brand.styles.fontWeight,
                      fontStyle:
                        props.brand.styles.fontStyle === "default"
                          ? undefined
                          : props.brand.styles.fontStyle,
                      textTransform:
                        props.brand.styles.textTransform === "default"
                          ? undefined
                          : props.brand.styles.textTransform,
                      letterSpacing:
                        props.brand.styles.letterSpacing === "default"
                          ? undefined
                          : props.brand.styles.letterSpacing,
                    }}
                  >
                    {brand}
                  </p>
                </EntityField>
                <div className="flex items-center gap-[6px]">
                  {resolvedSocialLinks.map((item, index) => {
                    const SocialIcon = socialIcons[item.icon];
                    return (
                      <EntityField
                        key={item.key}
                        displayName="Social Link"
                        fieldId={item.fieldId}
                        constantValueEnabled={item.constantValueEnabled}
                      >
                      <Link
                        cta={{
                          link: item.link,
                          linkType: item.linkType,
                        }}
                        eventName={`footerSocial${index}`}
                        target={item.openInNewTab ? "_blank" : undefined}
                        rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                        aria-label={item.ariaLabel}
                        className="flex h-8 w-8 items-center justify-center border border-current/20 p-1"
                      >
                        <SocialIcon className="h-[14px] w-[14px]" />
                      </Link>
                      </EntityField>
                    );
                  })}
                </div>
              </div>
              <nav className="ypp-typography grid grid-cols-2 gap-x-6 gap-y-4 md:flex md:flex-wrap md:items-center md:gap-8 xl:flex-nowrap">
                {resolvedNavigationLinks.map((item, index) => (
                  <EntityField
                    key={item.key}
                    displayName="Navigation Link"
                    fieldId={item.fieldId}
                    constantValueEnabled={item.constantValueEnabled}
                  >
                  <Link
                    cta={{
                      link: item.link,
                      linkType: item.linkType,
                    }}
                    eventName={`footerLink${index}`}
                    target={item.openInNewTab ? "_blank" : undefined}
                    rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                    className="footer__nav-link"
                  >
                    {item.label}
                  </Link>
                  </EntityField>
                ))}
              </nav>
              <div className="ypp-typography flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:gap-8 xl:justify-between">
                {address ? (
                  <EntityField
                    displayName="Address"
                    fieldId={props.metaAddress.field}
                    constantValueEnabled={props.metaAddress.constantValueEnabled}
                  >
                    <Address
                      address={address}
                      showRegion={props.showRegion}
                      showCountry={props.showCountry}
                    />
                  </EntityField>
                ) : null}
                {phones.length > 0 ? (
                  <div className="flex flex-col gap-4 md:flex-1 md:flex-row md:flex-wrap md:items-center md:gap-x-8 md:gap-y-4">
                    {phones.map((phone, index) => (
                      <EntityField
                        key={`${phone.formatted}-${index}`}
                        displayName="Phone"
                        fieldId={phone.fieldId}
                        constantValueEnabled={phone.constantValueEnabled}
                      >
                        {props.phones.includeHyperlink ? (
                          <Link
                            cta={{
                              link: phone.telValue,
                              linkType: "PHONE",
                            }}
                            eventName={`footerPhone${index}`}
                            className="underline decoration-current underline-offset-2"
                          >
                            {phone.label
                              ? `${phone.label} ${phone.formatted}`
                              : phone.formatted}
                          </Link>
                        ) : (
                          <span>
                            {phone.label
                              ? `${phone.label} ${phone.formatted}`
                              : phone.formatted}
                          </span>
                        )}
                      </EntityField>
                    ))}
                  </div>
                ) : null}
                {websiteLabel && websiteLink ? (
                  <EntityField
                    displayName="Website"
                    fieldId={props.website.field}
                    constantValueEnabled={props.website.constantValueEnabled}
                  >
                    <Link
                      cta={{
                        link: websiteLink,
                        linkType: websiteLinkType,
                      }}
                      eventName="footerWebsite"
                      className="footer__website-link"
                      target={websiteOpenInNewTab ? "_blank" : undefined}
                      rel={
                        websiteOpenInNewTab
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      {websiteLabel}
                    </Link>
                  </EntityField>
                ) : null}
              </div>
            </div>
          </footer>
        </AnalyticsScopeProvider>
      </VisibilityWrapper>
    );
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
            defaultValue: "https://www.luckydogmobilespa.com/locations/main-hub",
          },
          link: {
            defaultValue: "https://www.luckydogmobilespa.com/locations/main-hub",
          },
          linkType: "URL",
          openInNewTab: true,
        },
        constantValueEnabled: true,
      },
    },
    render: (props) => <ProfessionalPracticeFooterComponent {...props} />,
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeFooter",
  displayName: "Footer",
  description: "Footer",
  pageSetTypes: ["ENTITY", "DIRECTORY", "LOCATOR"],
};
