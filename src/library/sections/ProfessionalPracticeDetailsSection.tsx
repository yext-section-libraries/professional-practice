import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { parsePhoneNumber } from "awesome-phonenumber";
import { FaMapMarkerAlt, FaRegClock, FaThumbsUp } from "react-icons/fa";
import {
  ComprehensiveCTA,
  type ComprehensiveCTAValue,
  EntityField,
  type StyledTextValue,
  type ThemeColor,
  VisibilityWrapper,
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
  type AddressType,
  HoursTable,
  type HoursType,
  Link,
  type DayOfWeekNames,
} from "@yext/pages-components";

type StyledTextProps = {
  text: YextEntityField<string>;
  styles: StyledTextValueWithLetterSpacing;
  fontColor?: ThemeColor;
};

type TextListProps = {
  text: YextEntityField<string[]>;
  styles: StyledTextValueWithLetterSpacing;
  fontColor?: ThemeColor;
};

type StyledTextValueWithLetterSpacing = StyledTextValue & {
  letterSpacing?: string;
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

type DetailsIcon = "location" | "clock" | "thumbsUp";

type ProfessionalPracticeDetailsSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  iconBackgroundColor: ThemeColor;
  summary: {
    icon: DetailsIcon;
    title: StyledTextProps;
    address: YextEntityField<AddressType>;
    showRegion: boolean;
    showCountry: boolean;
    baseHubLabel: StyledTextProps;
    serviceRadiusText: StyledTextProps;
    bookingLabel: StyledTextProps;
    phones: PhoneFieldProps;
    cta: ComprehensiveCTAValue;
  };
  dispatchHours: {
    icon: DetailsIcon;
    title: StyledTextProps;
    hours: YextEntityField<HoursType>;
    hoursStyles: {
      startOfWeek: keyof DayOfWeekNames | "today";
      collapseDays: boolean;
      showAdditionalHoursText: boolean;
      alignment: "items-start" | "items-center" | "items-end";
    };
  };
  perks: {
    icon: DetailsIcon;
    title: StyledTextProps;
    listText: TextListProps;
  };
};

const sectionColor: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
};

const iconBackgroundColor: ThemeColor = {
  selectedColor: "palette-tertiary",
  contrastingColor: "palette-tertiary-contrast",
};

const whiteColor: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "palette-secondary",
};

const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};

const detailsIconOptions = [
  { label: "Location", value: "location" },
  { label: "Clock", value: "clock" },
  { label: "Thumbs Up", value: "thumbsUp" },
] as const;

const detailsIcons: Record<
  DetailsIcon,
  {
    component: React.ComponentType<{ className?: string }>;
    className: string;
  }
> = {
  location: {
    component: FaMapMarkerAlt,
    className: "h-[18px] w-[14px] text-current",
  },
  clock: {
    component: FaRegClock,
    className: "h-[18px] w-[18px] text-current",
  },
  thumbsUp: {
    component: FaThumbsUp,
    className: "h-[18px] w-[18px] text-current",
  },
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

const ProfessionalPracticeDetailsSectionFields: YextFields<ProfessionalPracticeDetailsSectionProps> =
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
    iconBackgroundColor: {
      label: "Icon Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    summary: {
      label: "Summary",
      type: "object",
      objectFields: {
        title: {
          label: "Title",
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
        icon: {
          label: "Icon",
          type: "select",
          options: [...detailsIconOptions],
        },
        address: {
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
        baseHubLabel: {
          label: "Base Hub Label",
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
        serviceRadiusText: {
          label: "Service Radius Text",
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
        bookingLabel: {
          label: "Booking Label",
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
        cta: {
          label: "Call to Action",
          type: "comprehensiveCTA",
        },
      },
    },
    dispatchHours: {
      label: "Dispatch Hours",
      type: "object",
      objectFields: {
        title: {
          label: "Title",
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
        icon: {
          label: "Icon",
          type: "select",
          options: [...detailsIconOptions],
        },
        hours: {
          type: "entityField",
          label: "Hours",
          filter: {
            types: ["type.hours"],
          },
          disableConstantValueToggle: true,
        },
        hoursStyles: {
          label: "Hours Styles",
          type: "object",
          objectFields: {
            startOfWeek: {
              label: "Start Of Week",
              type: "select",
              options: [
                { label: "Monday", value: "monday" },
                { label: "Tuesday", value: "tuesday" },
                { label: "Wednesday", value: "wednesday" },
                { label: "Thursday", value: "thursday" },
                { label: "Friday", value: "friday" },
                { label: "Saturday", value: "saturday" },
                { label: "Sunday", value: "sunday" },
                { label: "Today", value: "today" },
              ],
            },
            collapseDays: {
              label: "Collapse Days",
              type: "radio",
              options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
              ],
            },
            showAdditionalHoursText: {
              label: "Show Additional Hours Text",
              type: "radio",
              options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
              ],
            },
            alignment: {
              label: "Alignment",
              type: "select",
              options: [
                { label: "Start", value: "items-start" },
                { label: "Center", value: "items-center" },
                { label: "End", value: "items-end" },
              ],
            },
          },
        },
      },
    },
    perks: {
      label: "Perks",
      type: "object",
      objectFields: {
        title: {
          label: "Title",
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
        icon: {
          label: "Icon",
          type: "select",
          options: [...detailsIconOptions],
        },
        listText: {
          label: "Text List",
          type: "object",
          objectFields: {
            text: {
              type: "entityField",
              label: "Text List",
              filter: {
                types: ["type.string"],
                includeListsOnly: true,
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
      },
    },
  };

const ProfessionalPracticeDetailsSectionComponent: PuckComponent<
  ProfessionalPracticeDetailsSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const address = resolveComponentData(
    props.summary.address,
    locale,
    streamDocument,
  ) as AddressType | undefined;
  const hours = resolveComponentData(
    props.dispatchHours.hours,
    locale,
    streamDocument,
  ) as HoursType | undefined;
  const summaryTitle =
    resolveComponentData(props.summary.title.text, locale, streamDocument) ||
    "";
  const summaryIcon = detailsIcons[props.summary.icon];
  const SummaryIconComponent = summaryIcon.component;
  const baseHubLabel =
    resolveComponentData(
      props.summary.baseHubLabel.text,
      locale,
      streamDocument,
    ) || "";
  const serviceRadiusText =
    resolveComponentData(
      props.summary.serviceRadiusText.text,
      locale,
      streamDocument,
    ) || "";
  const bookingLabel =
    resolveComponentData(
      props.summary.bookingLabel.text,
      locale,
      streamDocument,
    ) || "";
  const dispatchHoursTitle =
    resolveComponentData(
      props.dispatchHours.title.text,
      locale,
      streamDocument,
    ) || "";
  const dispatchHoursIcon = detailsIcons[props.dispatchHours.icon];
  const DispatchHoursIconComponent = dispatchHoursIcon.component;
  const perksTitle =
    resolveComponentData(props.perks.title.text, locale, streamDocument) || "";
  const perksIcon = detailsIcons[props.perks.icon];
  const PerksIconComponent = perksIcon.component;
  const perks =
    (resolveComponentData(props.perks.listText.text, locale, streamDocument) as
      | string[]
      | undefined) ?? [];
  const additionalHoursText =
    typeof (streamDocument as any).additionalHoursText === "string"
      ? (streamDocument as any).additionalHoursText.trim()
      : "";
  const phones = (props.summary.phones.items ?? [])
    .map((item) => {
      const number = resolveComponentData(item.number, locale, streamDocument);
      const trimmed = typeof number === "string" ? number.trim() : "";
      if (!trimmed) {
        return null;
      }
      return {
        fieldId: item.number.field,
        constantValueEnabled: item.number.constantValueEnabled,
        label: item.label?.trim() ?? "",
        formatted: formatPhone(trimmed, props.summary.phones.phoneFormat),
        telValue: trimmed.replace(/\D/g, ""),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const iconForegroundColor = isDarkColor(
    props.iconBackgroundColor,
    streamDocument,
  )
    ? "#ffffff"
    : "#000000";
  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`ProfessionalPracticeDetailsSection${getAnalyticsScopeHash(props.id)}`}
      >
        <section
          data-ypp-scope="details-section"
          style={{
            backgroundColor: resolveThemeColorCssValue(
              props.section.backgroundColor,
            ),
            color: resolveReadableForegroundColor(
              undefined,
              props.section.backgroundColor,
              streamDocument,
            ),
          }}
        >
          <style>{`
            [data-ypp-scope="details-section"] .ypp-typography p {
              font-family: var(--fontFamily-body-fontFamily);
              font-size: var(--fontSize-body-fontSize);
              line-height: 1.5;
              font-weight: var(--fontWeight-body-fontWeight);
              font-style: var(--fontStyle-body-fontStyle);
              text-transform: var(--textTransform-body-textTransform);
            }

            [data-ypp-scope="details-section"] .ypp-typography li {
              font-family: var(--fontFamily-body-fontFamily);
              font-size: var(--fontSize-body-fontSize);
              line-height: 1.5;
              font-weight: var(--fontWeight-body-fontWeight);
              font-style: var(--fontStyle-body-fontStyle);
              text-transform: var(--textTransform-body-textTransform);
            }

            [data-ypp-scope="details-section"] .ypp-typography h1 {
              font-family: var(--fontFamily-h1-fontFamily);
              font-size: var(--fontSize-h1-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h1-fontWeight);
              font-style: var(--fontStyle-h1-fontStyle);
              text-transform: var(--textTransform-h1-textTransform);
            }

            [data-ypp-scope="details-section"] .ypp-typography h2 {
              font-family: var(--fontFamily-h2-fontFamily);
              font-size: var(--fontSize-h2-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h2-fontWeight);
              font-style: var(--fontStyle-h2-fontStyle);
              text-transform: var(--textTransform-h2-textTransform);
            }

            [data-ypp-scope="details-section"] .ypp-typography h3 {
              font-family: var(--fontFamily-h3-fontFamily);
              font-size: var(--fontSize-h3-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h3-fontWeight);
              font-style: var(--fontStyle-h3-fontStyle);
              text-transform: var(--textTransform-h3-textTransform);
            }

            [data-ypp-scope="details-section"] .ypp-typography h4 {
              font-family: var(--fontFamily-h4-fontFamily);
              font-size: var(--fontSize-h4-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h4-fontWeight);
              font-style: var(--fontStyle-h4-fontStyle);
              text-transform: var(--textTransform-h4-textTransform);
            }

            [data-ypp-scope="details-section"] .ypp-typography h5 {
              font-family: var(--fontFamily-h5-fontFamily);
              font-size: var(--fontSize-h5-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h5-fontWeight);
              font-style: var(--fontStyle-h5-fontStyle);
              text-transform: var(--textTransform-h5-textTransform);
            }

            [data-ypp-scope="details-section"] .ypp-typography h6 {
              font-family: var(--fontFamily-h6-fontFamily);
              font-size: var(--fontSize-h6-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h6-fontWeight);
              font-style: var(--fontStyle-h6-fontStyle);
              text-transform: var(--textTransform-h6-textTransform);
            }

            [data-ypp-scope="details-section"] .ypp-typography a {
              font-family: var(--fontFamily-link-fontFamily);
              font-size: var(--fontSize-link-fontSize);
              font-weight: var(--fontWeight-link-fontWeight);
              font-style: var(--fontStyle-link-fontStyle);
              line-height: 1.5;
              text-decoration: underline;
              text-transform: var(--textTransform-link-textTransform);
              letter-spacing: var(--letterSpacing-link-letterSpacing);
            }

            [data-ypp-scope="details-section"] .ypp-cta-button {
              transition:
                background-color 0.2s ease,
                border-color 0.2s ease,
                color 0.2s ease,
                box-shadow 0.2s ease,
                transform 0.2s ease;
            }

            [data-ypp-scope="details-section"] .ypp-cta-button:hover,
            [data-ypp-scope="details-section"] .ypp-cta-button:focus-visible {
              transform: translateY(-1px);
              box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
            }

            [data-ypp-scope="details-section"] .ypp-cta-button--filled:hover,
            [data-ypp-scope="details-section"] .ypp-cta-button--filled:focus-visible {
              box-shadow:
                0 10px 20px rgba(15, 23, 42, 0.12),
                inset 0 0 0 999px rgba(0, 0, 0, 0.06);
            }

            [data-ypp-scope="details-section"] .ypp-cta-button--outline:hover,
            [data-ypp-scope="details-section"] .ypp-cta-button--outline:focus-visible {
              background-color: color-mix(in srgb, currentColor 8%, transparent);
              border-color: currentColor;
              box-shadow:
                0 10px 20px rgba(15, 23, 42, 0.12),
                inset 0 0 0 1px currentColor;
            }
          `}</style>
          <div className="mx-auto flex max-w-[1280px] flex-col gap-10 px-4 py-[30px] md:px-8 md:py-[60px] xl:flex-row xl:gap-8 xl:px-20">
            <div className="ypp-typography flex flex-1 flex-col gap-6">
              <div className="flex items-center gap-5">
                <span
                  className="flex h-[52px] w-[52px] items-center justify-center rounded-[6px]"
                  style={{
                    backgroundColor: resolveThemeColorCssValue(
                      props.iconBackgroundColor,
                    ),
                    color: iconForegroundColor,
                  }}
                >
                  <SummaryIconComponent
                    aria-hidden="true"
                    className={summaryIcon.className}
                  />
                </span>
                <EntityField
                  displayName="Summary Title"
                  fieldId={props.summary.title.text.field}
                  constantValueEnabled={
                    props.summary.title.text.constantValueEnabled
                  }
                >
                <h2
                  className=""
                  style={{
                    fontFamily:
                      props.summary.title.styles.fontFamily === "default"
                        ? undefined
                        : props.summary.title.styles.fontFamily,
                    fontSize:
                      props.summary.title.styles.fontSize === "default"
                        ? undefined
                        : props.summary.title.styles.fontSize,
                    color: resolveReadableForegroundColor(props.summary.title.fontColor, props.section.backgroundColor, streamDocument),
                    fontWeight:
                      props.summary.title.styles.fontWeight === "default"
                        ? undefined
                        : props.summary.title.styles.fontWeight,
                    fontStyle:
                      props.summary.title.styles.fontStyle === "default"
                        ? undefined
                        : props.summary.title.styles.fontStyle,
                    textTransform:
                      props.summary.title.styles.textTransform === "default"
                        ? undefined
                        : props.summary.title.styles.textTransform,
                    letterSpacing:
                      props.summary.title.styles.letterSpacing === "default"
                        ? undefined
                        : props.summary.title.styles.letterSpacing,
                  }}
                >
                  {summaryTitle}
                </h2>
                </EntityField>
              </div>
              <div className="flex flex-col gap-2">
                <EntityField
                  displayName="Base Hub Label"
                  fieldId={props.summary.baseHubLabel.text.field}
                  constantValueEnabled={
                    props.summary.baseHubLabel.text.constantValueEnabled
                  }
                >
                <p
                  className=""
                  style={{
                    fontFamily:
                      props.summary.baseHubLabel.styles.fontFamily === "default"
                        ? undefined
                        : props.summary.baseHubLabel.styles.fontFamily,
                    fontSize:
                      props.summary.baseHubLabel.styles.fontSize === "default"
                        ? undefined
                        : props.summary.baseHubLabel.styles.fontSize,
                    color: resolveReadableForegroundColor(
                      props.summary.baseHubLabel.fontColor,
                      props.section.backgroundColor,
                      streamDocument,
                    ),
                    fontWeight:
                      props.summary.baseHubLabel.styles.fontWeight === "default"
                        ? undefined
                        : props.summary.baseHubLabel.styles.fontWeight,
                    fontStyle:
                      props.summary.baseHubLabel.styles.fontStyle === "default"
                        ? undefined
                        : props.summary.baseHubLabel.styles.fontStyle,
                    textTransform:
                      props.summary.baseHubLabel.styles.textTransform ===
                      "default"
                        ? undefined
                        : props.summary.baseHubLabel.styles.textTransform,
                    letterSpacing:
                      props.summary.baseHubLabel.styles.letterSpacing === "default"
                        ? undefined
                        : props.summary.baseHubLabel.styles.letterSpacing,
                  }}
                >
                  {baseHubLabel}
                </p>
                </EntityField>
                {address ? (
                  <EntityField
                    displayName="Address"
                    fieldId={props.summary.address.field}
                    constantValueEnabled={
                      props.summary.address.constantValueEnabled
                    }
                  >
                    <Address
                      address={address}
                      showRegion={props.summary.showRegion}
                      showCountry={props.summary.showCountry}
                    />
                  </EntityField>
                ) : null}
                <EntityField
                  displayName="Service Radius Text"
                  fieldId={props.summary.serviceRadiusText.text.field}
                  constantValueEnabled={
                    props.summary.serviceRadiusText.text.constantValueEnabled
                  }
                >
                <p
                  style={{
                    fontFamily:
                      props.summary.serviceRadiusText.styles.fontFamily ===
                      "default"
                        ? undefined
                        : props.summary.serviceRadiusText.styles.fontFamily,
                    fontSize:
                      props.summary.serviceRadiusText.styles.fontSize ===
                      "default"
                        ? undefined
                        : props.summary.serviceRadiusText.styles.fontSize,
                    color: resolveReadableForegroundColor(props.summary.serviceRadiusText.fontColor, props.section.backgroundColor, streamDocument),
                    fontWeight:
                      props.summary.serviceRadiusText.styles.fontWeight ===
                      "default"
                        ? undefined
                        : props.summary.serviceRadiusText.styles.fontWeight,
                    fontStyle:
                      props.summary.serviceRadiusText.styles.fontStyle ===
                      "default"
                        ? undefined
                        : props.summary.serviceRadiusText.styles.fontStyle,
                    textTransform:
                      props.summary.serviceRadiusText.styles.textTransform ===
                      "default"
                        ? undefined
                        : props.summary.serviceRadiusText.styles.textTransform,
                    letterSpacing:
                      props.summary.serviceRadiusText.styles.letterSpacing ===
                      "default"
                        ? undefined
                        : props.summary.serviceRadiusText.styles.letterSpacing,
                  }}
                >
                  {serviceRadiusText}
                </p>
                </EntityField>
              </div>
              <div className="flex flex-col gap-2">
                <EntityField
                  displayName="Booking Label"
                  fieldId={props.summary.bookingLabel.text.field}
                  constantValueEnabled={
                    props.summary.bookingLabel.text.constantValueEnabled
                  }
                >
                <p
                  className="font-semibold"
                  style={{
                    fontFamily:
                      props.summary.bookingLabel.styles.fontFamily === "default"
                        ? undefined
                        : props.summary.bookingLabel.styles.fontFamily,
                    fontSize:
                      props.summary.bookingLabel.styles.fontSize === "default"
                        ? undefined
                        : props.summary.bookingLabel.styles.fontSize,
                    color: resolveReadableForegroundColor(
                      props.summary.bookingLabel.fontColor,
                      props.section.backgroundColor,
                      streamDocument,
                    ),
                    fontWeight:
                      props.summary.bookingLabel.styles.fontWeight === "default"
                        ? undefined
                        : props.summary.bookingLabel.styles.fontWeight,
                    fontStyle:
                      props.summary.bookingLabel.styles.fontStyle === "default"
                        ? undefined
                        : props.summary.bookingLabel.styles.fontStyle,
                    textTransform:
                      props.summary.bookingLabel.styles.textTransform ===
                      "default"
                        ? undefined
                        : props.summary.bookingLabel.styles.textTransform,
                    letterSpacing:
                      props.summary.bookingLabel.styles.letterSpacing === "default"
                        ? undefined
                        : props.summary.bookingLabel.styles.letterSpacing,
                  }}
                >
                  {bookingLabel}
                </p>
                </EntityField>
                {phones.map((phone, index) => {
                  const content = (
                    <span>
                      {phone.label
                        ? `${phone.label} ${phone.formatted}`
                        : phone.formatted}
                    </span>
                  );
                  return (
                    <EntityField
                      key={`${phone.formatted}-${index}`}
                      displayName="Phone"
                      fieldId={phone.fieldId}
                      constantValueEnabled={phone.constantValueEnabled}
                    >
                      {props.summary.phones.includeHyperlink ? (
                        <Link
                          cta={{
                            link: phone.telValue,
                            linkType: "PHONE",
                          }}
                          eventName={`summaryPhone${index}`}
                          className="underline decoration-current underline-offset-2"
                        >
                          {content}
                        </Link>
                      ) : (
                        content
                      )}
                    </EntityField>
                  );
                })}
              </div>
              <EntityField
                displayName="Summary Call to Action"
                fieldId={props.summary.cta.data.cta.field}
                constantValueEnabled={
                  props.summary.cta.data.cta.constantValueEnabled
                }
              >
              <ComprehensiveCTA
                value={props.summary.cta as Partial<ComprehensiveCTAValue>}
                eventName="summaryCta"
                className={`inline-flex min-h-12 w-fit items-center justify-center px-4${
                  ["primary", "solid"].includes(
                    props.summary.cta.styles.variant ?? "",
                  )
                    ? " ypp-cta-button ypp-cta-button--filled"
                    : ["secondary", "outline"].includes(
                          props.summary.cta.styles.variant ?? "",
                        )
                      ? " ypp-cta-button ypp-cta-button--outline"
                      : ""
                }`}
                style={
                  ["primary", "secondary", "solid", "outline"].includes(
                    props.summary.cta.styles.variant ?? "",
                  )
                    ? {
                        textDecoration: "none",
                        ...(["secondary", "outline"].includes(
                          props.summary.cta.styles.variant ?? "",
                        ) &&
                        (!props.summary.cta.styles.color?.selectedColor ||
                          props.summary.cta.styles.color.selectedColor ===
                            "default")
                          ? {
                              color: resolveReadableForegroundColor(
                                undefined,
                                props.section.backgroundColor,
                                streamDocument,
                              ),
                            }
                          : {}),
                        ...(["secondary", "outline"].includes(
                          props.summary.cta.styles.variant ?? "",
                        )
                          ? { borderColor: "currentColor" }
                          : {}),
                      }
                    : undefined
                }
              />
              </EntityField>
            </div>
            <div className="ypp-typography flex flex-1 flex-col gap-6">
              <div className="flex items-center gap-5">
                <span
                  className="flex h-[52px] w-[52px] items-center justify-center rounded-[6px]"
                  style={{
                    backgroundColor: resolveThemeColorCssValue(
                      props.iconBackgroundColor,
                    ),
                    color: iconForegroundColor,
                  }}
                >
                  <DispatchHoursIconComponent
                    aria-hidden="true"
                    className={dispatchHoursIcon.className}
                  />
                </span>
                <EntityField
                  displayName="Dispatch Hours Title"
                  fieldId={props.dispatchHours.title.text.field}
                  constantValueEnabled={
                    props.dispatchHours.title.text.constantValueEnabled
                  }
                >
                <h2
                  className=""
                  style={{
                    fontFamily:
                      props.dispatchHours.title.styles.fontFamily === "default"
                        ? undefined
                        : props.dispatchHours.title.styles.fontFamily,
                    fontSize:
                      props.dispatchHours.title.styles.fontSize === "default"
                        ? undefined
                        : props.dispatchHours.title.styles.fontSize,
                    color: resolveReadableForegroundColor(
                      props.dispatchHours.title.fontColor,
                      props.section.backgroundColor,
                      streamDocument,
                    ),
                    fontWeight:
                      props.dispatchHours.title.styles.fontWeight === "default"
                        ? undefined
                        : props.dispatchHours.title.styles.fontWeight,
                    fontStyle:
                      props.dispatchHours.title.styles.fontStyle === "default"
                        ? undefined
                        : props.dispatchHours.title.styles.fontStyle,
                    textTransform:
                      props.dispatchHours.title.styles.textTransform ===
                      "default"
                        ? undefined
                        : props.dispatchHours.title.styles.textTransform,
                    letterSpacing:
                      props.dispatchHours.title.styles.letterSpacing === "default"
                        ? undefined
                        : props.dispatchHours.title.styles.letterSpacing,
                  }}
                >
                  {dispatchHoursTitle}
                </h2>
                </EntityField>
              </div>
              {hours ? (
                <EntityField
                  displayName="Hours"
                  fieldId={props.dispatchHours.hours.field}
                  constantValueEnabled={
                    props.dispatchHours.hours.constantValueEnabled
                  }
                >
                  <div
                    className={`flex flex-col ${props.dispatchHours.hoursStyles.alignment}`}
                  >
                    <HoursTable
                      hours={hours}
                      comingSoon={(streamDocument as any).comingSoon}
                      startOfWeek={props.dispatchHours.hoursStyles.startOfWeek}
                      collapseDays={
                        props.dispatchHours.hoursStyles.collapseDays
                      }
                    />
                  </div>
                </EntityField>
              ) : null}
              {props.dispatchHours.hoursStyles.showAdditionalHoursText &&
              additionalHoursText ? (
                <p className="max-w-[22rem]">
                  {additionalHoursText}
                </p>
              ) : null}
            </div>
            <div className="ypp-typography flex flex-1 flex-col gap-6">
              <div className="flex items-center gap-5">
                <span
                  className="flex h-[52px] w-[52px] items-center justify-center rounded-[6px]"
                  style={{
                    backgroundColor: resolveThemeColorCssValue(
                      props.iconBackgroundColor,
                    ),
                    color: iconForegroundColor,
                  }}
                >
                  <PerksIconComponent
                    aria-hidden="true"
                    className={perksIcon.className}
                  />
                </span>
                <EntityField
                  displayName="Perks Title"
                  fieldId={props.perks.title.text.field}
                  constantValueEnabled={
                    props.perks.title.text.constantValueEnabled
                  }
                >
                <h2
                  className=""
                  style={{
                    fontFamily:
                      props.perks.title.styles.fontFamily === "default"
                        ? undefined
                        : props.perks.title.styles.fontFamily,
                    fontSize:
                      props.perks.title.styles.fontSize === "default"
                        ? undefined
                        : props.perks.title.styles.fontSize,
                    color: resolveReadableForegroundColor(props.perks.title.fontColor, props.section.backgroundColor, streamDocument),
                    fontWeight:
                      props.perks.title.styles.fontWeight === "default"
                        ? undefined
                        : props.perks.title.styles.fontWeight,
                    fontStyle:
                      props.perks.title.styles.fontStyle === "default"
                        ? undefined
                        : props.perks.title.styles.fontStyle,
                    textTransform:
                      props.perks.title.styles.textTransform === "default"
                        ? undefined
                        : props.perks.title.styles.textTransform,
                    letterSpacing:
                      props.perks.title.styles.letterSpacing === "default"
                        ? undefined
                        : props.perks.title.styles.letterSpacing,
                  }}
                >
                  {perksTitle}
                </h2>
                </EntityField>
              </div>
              <EntityField
                displayName="Text List"
                fieldId={props.perks.listText.text.field}
                constantValueEnabled={
                  props.perks.listText.text.constantValueEnabled
                }
              >
                <ul
                  className="flex list-none flex-col gap-2 pl-0"
                  style={{
                    fontFamily:
                      props.perks.listText.styles.fontFamily === "default"
                        ? undefined
                        : props.perks.listText.styles.fontFamily,
                    fontSize:
                      props.perks.listText.styles.fontSize === "default"
                        ? undefined
                        : props.perks.listText.styles.fontSize,
                    color: resolveReadableForegroundColor(props.perks.listText.fontColor, props.section.backgroundColor, streamDocument),
                    fontWeight:
                      props.perks.listText.styles.fontWeight === "default"
                        ? undefined
                        : props.perks.listText.styles.fontWeight,
                    fontStyle:
                      props.perks.listText.styles.fontStyle === "default"
                        ? undefined
                        : props.perks.listText.styles.fontStyle,
                    textTransform:
                      props.perks.listText.styles.textTransform === "default"
                        ? undefined
                        : props.perks.listText.styles.textTransform,
                    letterSpacing:
                      props.perks.listText.styles.letterSpacing === "default"
                        ? undefined
                        : props.perks.listText.styles.letterSpacing,
                  }}
                >
                  {perks.map((item) => (
                    <li
                      key={item}
                      className="relative pl-6 before:absolute before:left-0 before:top-[7px] before:h-1.5 before:w-1.5 before:rounded-full before:bg-current before:content-['']"
                      style={{
                        color: "inherit",
                        fontFamily: "inherit",
                        fontSize: "inherit",
                        fontWeight: "inherit",
                        fontStyle: "inherit",
                        textTransform: "inherit",
                        letterSpacing: "inherit",
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </EntityField>
            </div>
          </div>
        </section>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const ProfessionalPracticeDetailsSection: YextComponentConfig<ProfessionalPracticeDetailsSectionProps> =
  {
    label: "Details Section",
    fields: ProfessionalPracticeDetailsSectionFields,
    defaultProps: {
      section: {
        backgroundColor: sectionColor,
        visibleOnLivePage: true,
      },
      iconBackgroundColor,
      summary: {
        icon: "location",
        title: {
          text: {
            field: "",
            constantValue: "Service Summary",
            constantValueEnabled: true,
          },
          styles: {
            fontFamily: "default",
            fontSize: "20px",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
          },
          fontColor: undefined,
        },
        address: {
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
        baseHubLabel: {
          text: {
            field: "",
            constantValue: "Base Hub",
            constantValueEnabled: true,
          },
          styles: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "600",
            fontStyle: "default",
            textTransform: "default",
          },
          fontColor: undefined,
        },
        serviceRadiusText: {
          text: {
            field: "",
            constantValue: "(Serving a 20-mile radius)",
            constantValueEnabled: true,
          },
          styles: defaultTextStyles,
          fontColor: undefined,
        },
        bookingLabel: {
          text: {
            field: "",
            constantValue: "Booking Desk",
            constantValueEnabled: true,
          },
          styles: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "600",
            fontStyle: "default",
            textTransform: "default",
          },
          fontColor: undefined,
        },
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
        cta: {
          data: {
            actionType: "link",
            cta: {
              field: "",
              constantValueEnabled: true,
              constantValue: {
                ctaType: "textAndLink",
                label: { defaultValue: "Check Your Zip Code" },
                link: { defaultValue: "#" },
                linkType: "URL",
              },
              selectedType: "textAndLink",
            },
            openInNewTab: false,
            buttonText: { defaultValue: "Check Your Zip Code" },
            customId: "",
            customClass: "",
            dataAttributes: [],
            ariaLabel: { defaultValue: "Check Your Zip Code" },
          },
          styles: {
            variant: "secondary",
            color: whiteColor,
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
      dispatchHours: {
        icon: "clock",
        title: {
          text: {
            field: "",
            constantValue: "Dispatch & Service Hours",
            constantValueEnabled: true,
          },
          styles: {
            fontFamily: "default",
            fontSize: "20px",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
          },
          fontColor: undefined,
        },
        hours: {
          field: "hours",
          constantValue: {} as HoursType,
          constantValueEnabled: false,
        },
        hoursStyles: {
          startOfWeek: "today",
          collapseDays: false,
          showAdditionalHoursText: true,
          alignment: "items-start",
        },
      },
      perks: {
        icon: "thumbsUp",
        title: {
          text: {
            field: "",
            constantValue: "Complimentary Services",
            constantValueEnabled: true,
          },
          styles: {
            fontFamily: "default",
            fontSize: "20px",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
          },
          fontColor: undefined,
        },
        listText: {
          text: {
            field: "",
            constantValue: [
              "Hydro-Massage Bath",
              "Premium Tearless Blueberry Facial",
              "Blow Dry (No Cage Drying, Ever)",
              "Custom Bandana or Bow",
              "De-Shedding Consultation & Coat Health Check",
              "Free cancellation up to 24 hours prior to scheduled arrival",
              "Fully self-powered and climate-controlled mobile grooming vans (No hookups required), accommodating dogs up to 75 lbs.",
            ],
            constantValueEnabled: true,
          },
          styles: defaultTextStyles,
          fontColor: undefined,
        },
      },
    },
    render: (props) => (
      <ProfessionalPracticeDetailsSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeDetailsSection",
  displayName: "Details Section",
  description: "Details Section",
  pageSetTypes: ["ENTITY"],
};
