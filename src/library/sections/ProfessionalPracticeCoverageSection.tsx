import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { parsePhoneNumber } from "awesome-phonenumber";
import { FaMapMarkerAlt } from "react-icons/fa";
import {
  EntityField,
  getDefaultRTF,
  MaybeRTF,
  mergeMeta,
  resolveComponentData,
  resolveUrlTemplate,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableRichText,
  useDocument,
  useNearbyLocations,
  useTemplateProps,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  getAnalyticsScopeHash,
  isDarkColor,
  CTA,
} from "@yext/visual-editor";
import {
  Address,
  AnalyticsScopeProvider,
  HoursStatus,
  Link,
  type StatusParams,
} from "@yext/pages-components";

type StyledTextProps = {
  text: YextEntityField<string>;
  styles: StyledTextValueWithLetterSpacing;
  fontColor?: ThemeColor;
};

type StyledTextValueWithLetterSpacing = StyledTextValue & {
  letterSpacing?: string;
};

type StyledRtfProps = {
  text: YextEntityField<TranslatableRichText>;
  fontColor?: ThemeColor;
};

type StreamDocumentWithCoordinate = {
  comingSoon?: boolean;
  locale?: string;
  timezone?: string;
  yextDisplayCoordinate?: {
    latitude?: number;
    longitude?: number;
  };
};

type ProfessionalPracticeCoverageSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  cardBackgroundColor: ThemeColor;
  iconBackgroundColor: ThemeColor;
  heading: StyledTextProps;
  intro: StyledRtfProps;
  radius: number;
  limit: number;
  showAddress: boolean;
  showPhone: boolean;
  showHours: boolean;
  address: {
    showRegion: boolean;
    showCountry: boolean;
  };
  phone: {
    phoneFormat: "international" | "domestic";
    includeHyperlink: boolean;
  };
  hoursStyles: {
    showCurrentStatus: boolean;
    timeFormat: "12h" | "24h";
    dayOfWeekFormat: "short" | "long";
    showDayNames: boolean;
  };
};

const sectionColor: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "palette-secondary",
};

const cardBackgroundColor: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "black",
};

const defaultIconBackgroundColor: ThemeColor = {
  selectedColor: "palette-quaternary-light",
  contrastingColor: "palette-secondary",
};

const primaryCtaBackgroundColor: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
};

const loadingMessage = "Loading nearby locations";
const emptyEditorMessage = "No nearby locations found for this location";
const locationCtaLabel = "View Location";

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

const resolveSubtleBorderColor = (
  backgroundColor: ThemeColor,
  streamDocument: any,
): string => {
  const surfaceBackground = resolveThemeColorCssValue(backgroundColor);
  const foreground =
    resolveReadableForegroundColor(undefined, backgroundColor, streamDocument) ??
    "currentColor";

  if (!surfaceBackground) {
    return `color-mix(in srgb, ${foreground} 12%, transparent)`;
  }

  return `color-mix(in srgb, ${foreground} 12%, ${surfaceBackground})`;
};

const resolveMutedForegroundColor = (
  backgroundColor: ThemeColor,
  streamDocument: any,
): string => {
  const surfaceBackground = resolveThemeColorCssValue(backgroundColor);
  const foreground =
    resolveReadableForegroundColor(undefined, backgroundColor, streamDocument) ??
    "currentColor";

  if (!surfaceBackground) {
    return `color-mix(in srgb, ${foreground} 76%, transparent)`;
  }

  return `color-mix(in srgb, ${foreground} 76%, ${surfaceBackground})`;
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


const ProfessionalPracticeCoverageSectionFields: YextFields<ProfessionalPracticeCoverageSectionProps> =
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
    cardBackgroundColor: {
      label: "Card Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    iconBackgroundColor: {
      label: "Icon Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    heading: {
      label: "Heading",
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
    intro: {
      label: "Intro",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.rich_text_v2"],
          },
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    radius: {
      label: "Radius",
      type: "number",
    },
    limit: {
      label: "Limit",
      type: "number",
    },
    showAddress: {
      label: "Show Address",
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    showPhone: {
      label: "Show Phone",
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    showHours: {
      label: "Show Hours",
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    address: {
      label: "Address",
      type: "object",
      objectFields: {
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
      },
    },
    phone: {
      label: "Phone",
      type: "object",
      objectFields: {
        phoneFormat: {
          label: "Phone Number Format",
          type: "radio",
          options: [
            { label: "Domestic", value: "domestic" },
            { label: "International", value: "international" },
          ],
        },
        includeHyperlink: {
          label: "Include Phone Hyperlink",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      },
    },
    hoursStyles: {
      label: "Hours Styles",
      type: "object",
      objectFields: {
        showCurrentStatus: {
          label: "Show Current Status",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        timeFormat: {
          label: "Time Format",
          type: "select",
          options: [
            { label: "12 Hour", value: "12h" },
            { label: "24 Hour", value: "24h" },
          ],
        },
        dayOfWeekFormat: {
          label: "Day Of Week Format",
          type: "select",
          options: [
            { label: "Short", value: "short" },
            { label: "Long", value: "long" },
          ],
        },
        showDayNames: {
          label: "Show Day Names",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      },
    },
  };

const ProfessionalPracticeCoverageSectionComponent: PuckComponent<ProfessionalPracticeCoverageSectionProps> =
  (props) => {
    const streamDocument = useDocument<StreamDocumentWithCoordinate>();
    const { relativePrefixToRoot } = useTemplateProps<{
      relativePrefixToRoot?: string;
    }>();
    const locale = streamDocument.locale ?? "en";
    const headingColor = resolveReadableForegroundColor(props.heading.fontColor, props.section.backgroundColor, streamDocument);
    const introRichTextStyleOverrides = {
      color: resolveReadableForegroundColor(props.intro.fontColor, props.section.backgroundColor, streamDocument),
    };
    const heading =
      resolveComponentData(props.heading.text, locale, streamDocument) || "";
    const intro = resolveComponentData(props.intro.text, locale, streamDocument, {
      richTextStyleOverrides: introRichTextStyleOverrides,
    });
    const coordinate = streamDocument.yextDisplayCoordinate;
    const enabled =
      coordinate?.latitude !== undefined &&
      coordinate?.longitude !== undefined &&
      !!props.radius &&
      !!props.limit;

    const { data: nearbyLocationsData, status: nearbyLocationsStatus } =
      useNearbyLocations({
        streamDocument,
        latitude: coordinate?.latitude,
        longitude: coordinate?.longitude,
        radiusMi: props.radius,
        limit: props.limit,
        enabled,
      });

    if (!enabled) {
      return <></>;
    }

    const nearbyLocationDocs = nearbyLocationsData?.response?.docs ?? [];

    const sectionBackgroundColor = resolveThemeColorCssValue(
      props.section.backgroundColor,
    );
    const cardBorderColor = resolveSubtleBorderColor(
      props.cardBackgroundColor,
      streamDocument,
    );
    const iconBackgroundCssValue = resolveThemeColorCssValue(
      props.iconBackgroundColor,
    );
    const cardForegroundColor =
      resolveReadableForegroundColor(
        undefined,
        props.cardBackgroundColor,
        streamDocument,
      ) ?? "currentColor";
    const cardMutedColor = resolveMutedForegroundColor(
      props.cardBackgroundColor,
      streamDocument,
    );
    const locationCtaForegroundColor =
      resolveReadableForegroundColor(
        undefined,
        primaryCtaBackgroundColor,
        streamDocument,
      ) ?? "currentColor";
    const iconForegroundColor =
      resolveReadableForegroundColor(
        undefined,
        props.iconBackgroundColor,
        streamDocument,
      ) ?? "currentColor";

    if (nearbyLocationsStatus === "pending") {
      return (
        <section
          data-ypp-scope="coverage-section"
          style={{ backgroundColor: sectionBackgroundColor }}
        >
          <style>{`
            [data-ypp-scope="coverage-section"] .ypp-typography p {
              font-family: var(--fontFamily-body-fontFamily);
              font-size: var(--fontSize-body-fontSize);
              line-height: 1.5;
              font-weight: var(--fontWeight-body-fontWeight);
              font-style: var(--fontStyle-body-fontStyle);
              text-transform: var(--textTransform-body-textTransform);
            }

            [data-ypp-scope="coverage-section"] .ypp-typography li {
              font-family: var(--fontFamily-body-fontFamily);
              font-size: var(--fontSize-body-fontSize);
              line-height: 1.5;
              font-weight: var(--fontWeight-body-fontWeight);
              font-style: var(--fontStyle-body-fontStyle);
              text-transform: var(--textTransform-body-textTransform);
            }

            [data-ypp-scope="coverage-section"] .ypp-typography h1 {
              font-family: var(--fontFamily-h1-fontFamily);
              font-size: var(--fontSize-h1-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h1-fontWeight);
              font-style: var(--fontStyle-h1-fontStyle);
              text-transform: var(--textTransform-h1-textTransform);
            }

            [data-ypp-scope="coverage-section"] .ypp-typography h2 {
              font-family: var(--fontFamily-h2-fontFamily);
              font-size: var(--fontSize-h2-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h2-fontWeight);
              font-style: var(--fontStyle-h2-fontStyle);
              text-transform: var(--textTransform-h2-textTransform);
            }

            [data-ypp-scope="coverage-section"] .ypp-typography h3 {
              font-family: var(--fontFamily-h3-fontFamily);
              font-size: var(--fontSize-h3-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h3-fontWeight);
              font-style: var(--fontStyle-h3-fontStyle);
              text-transform: var(--textTransform-h3-textTransform);
            }

            [data-ypp-scope="coverage-section"] .ypp-typography h4 {
              font-family: var(--fontFamily-h4-fontFamily);
              font-size: var(--fontSize-h4-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h4-fontWeight);
              font-style: var(--fontStyle-h4-fontStyle);
              text-transform: var(--textTransform-h4-textTransform);
            }

            [data-ypp-scope="coverage-section"] .ypp-typography h5 {
              font-family: var(--fontFamily-h5-fontFamily);
              font-size: var(--fontSize-h5-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h5-fontWeight);
              font-style: var(--fontStyle-h5-fontStyle);
              text-transform: var(--textTransform-h5-textTransform);
            }

            [data-ypp-scope="coverage-section"] .ypp-typography h6 {
              font-family: var(--fontFamily-h6-fontFamily);
              font-size: var(--fontSize-h6-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h6-fontWeight);
              font-style: var(--fontStyle-h6-fontStyle);
              text-transform: var(--textTransform-h6-textTransform);
            }

            [data-ypp-scope="coverage-section"] .ypp-typography a {
              font-family: var(--fontFamily-link-fontFamily);
              font-size: var(--fontSize-link-fontSize);
              font-weight: var(--fontWeight-link-fontWeight);
              font-style: var(--fontStyle-link-fontStyle);
              line-height: 1.5;
              text-decoration: underline;
              text-transform: var(--textTransform-link-textTransform);
              letter-spacing: var(--letterSpacing-link-letterSpacing);
            }
          `}</style>
          <div className="ypp-typography mx-auto flex max-w-[1280px] flex-col gap-4 px-4 py-[30px] md:px-8 md:py-[60px] xl:px-20">
            <h2
              className="m-0"
              style={{ color: headingColor }}
            >
              {heading}
            </h2>
            <p className="m-0 text-[var(--colors-palette-tertiary)]">
              {loadingMessage}
            </p>
          </div>
        </section>
      );
    }

    if (nearbyLocationsStatus !== "success" || !nearbyLocationDocs.length) {
      if (!props.puck.isEditing) {
        return <></>;
      }

      return (
        <section
          data-ypp-scope="coverage-section"
          style={{ backgroundColor: sectionBackgroundColor }}
        >
          <style>{`
            [data-ypp-scope="coverage-section"] .ypp-typography p {
              font-family: var(--fontFamily-body-fontFamily);
              font-size: var(--fontSize-body-fontSize);
              line-height: 1.5;
              font-weight: var(--fontWeight-body-fontWeight);
              font-style: var(--fontStyle-body-fontStyle);
              text-transform: var(--textTransform-body-textTransform);
            }

            [data-ypp-scope="coverage-section"] .ypp-typography li {
              font-family: var(--fontFamily-body-fontFamily);
              font-size: var(--fontSize-body-fontSize);
              line-height: 1.5;
              font-weight: var(--fontWeight-body-fontWeight);
              font-style: var(--fontStyle-body-fontStyle);
              text-transform: var(--textTransform-body-textTransform);
            }

            [data-ypp-scope="coverage-section"] .ypp-typography h1 {
              font-family: var(--fontFamily-h1-fontFamily);
              font-size: var(--fontSize-h1-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h1-fontWeight);
              font-style: var(--fontStyle-h1-fontStyle);
              text-transform: var(--textTransform-h1-textTransform);
            }

            [data-ypp-scope="coverage-section"] .ypp-typography h2 {
              font-family: var(--fontFamily-h2-fontFamily);
              font-size: var(--fontSize-h2-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h2-fontWeight);
              font-style: var(--fontStyle-h2-fontStyle);
              text-transform: var(--textTransform-h2-textTransform);
            }

            [data-ypp-scope="coverage-section"] .ypp-typography h3 {
              font-family: var(--fontFamily-h3-fontFamily);
              font-size: var(--fontSize-h3-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h3-fontWeight);
              font-style: var(--fontStyle-h3-fontStyle);
              text-transform: var(--textTransform-h3-textTransform);
            }

            [data-ypp-scope="coverage-section"] .ypp-typography h4 {
              font-family: var(--fontFamily-h4-fontFamily);
              font-size: var(--fontSize-h4-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h4-fontWeight);
              font-style: var(--fontStyle-h4-fontStyle);
              text-transform: var(--textTransform-h4-textTransform);
            }

            [data-ypp-scope="coverage-section"] .ypp-typography h5 {
              font-family: var(--fontFamily-h5-fontFamily);
              font-size: var(--fontSize-h5-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h5-fontWeight);
              font-style: var(--fontStyle-h5-fontStyle);
              text-transform: var(--textTransform-h5-textTransform);
            }

            [data-ypp-scope="coverage-section"] .ypp-typography h6 {
              font-family: var(--fontFamily-h6-fontFamily);
              font-size: var(--fontSize-h6-fontSize);
              line-height: 1.2;
              font-weight: var(--fontWeight-h6-fontWeight);
              font-style: var(--fontStyle-h6-fontStyle);
              text-transform: var(--textTransform-h6-textTransform);
            }

            [data-ypp-scope="coverage-section"] .ypp-typography a {
              font-family: var(--fontFamily-link-fontFamily);
              font-size: var(--fontSize-link-fontSize);
              font-weight: var(--fontWeight-link-fontWeight);
              font-style: var(--fontStyle-link-fontStyle);
              line-height: 1.5;
              text-decoration: underline;
              text-transform: var(--textTransform-link-textTransform);
              letter-spacing: var(--letterSpacing-link-letterSpacing);
            }
          `}</style>
          <div className="ypp-typography mx-auto flex max-w-[1280px] flex-col gap-4 px-4 py-[30px] md:px-8 md:py-[60px] xl:px-20">
            <h2
              className="m-0"
              style={{ color: headingColor }}
            >
              {heading}
            </h2>
            <p className="m-0 text-[var(--colors-palette-tertiary)]">
              {emptyEditorMessage}
            </p>
          </div>
        </section>
      );
    }

    return (
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
      <AnalyticsScopeProvider
        name={`ProfessionalPracticeCoverageSection${getAnalyticsScopeHash(props.id)}`}
      >
          <section
            data-ypp-scope="coverage-section"
            style={{ backgroundColor: sectionBackgroundColor }}
          >
            <style>{`
              [data-ypp-scope="coverage-section"] .ypp-typography p {
                font-family: var(--fontFamily-body-fontFamily);
                font-size: var(--fontSize-body-fontSize);
                line-height: 1.5;
                font-weight: var(--fontWeight-body-fontWeight);
                font-style: var(--fontStyle-body-fontStyle);
                text-transform: var(--textTransform-body-textTransform);
              }

              [data-ypp-scope="coverage-section"] .ypp-typography li {
                font-family: var(--fontFamily-body-fontFamily);
                font-size: var(--fontSize-body-fontSize);
                line-height: 1.5;
                font-weight: var(--fontWeight-body-fontWeight);
                font-style: var(--fontStyle-body-fontStyle);
                text-transform: var(--textTransform-body-textTransform);
              }

              [data-ypp-scope="coverage-section"] .ypp-typography h1 {
                font-family: var(--fontFamily-h1-fontFamily);
                font-size: var(--fontSize-h1-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h1-fontWeight);
                font-style: var(--fontStyle-h1-fontStyle);
                text-transform: var(--textTransform-h1-textTransform);
              }

              [data-ypp-scope="coverage-section"] .ypp-typography h2 {
                font-family: var(--fontFamily-h2-fontFamily);
                font-size: var(--fontSize-h2-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h2-fontWeight);
                font-style: var(--fontStyle-h2-fontStyle);
                text-transform: var(--textTransform-h2-textTransform);
              }

              [data-ypp-scope="coverage-section"] .ypp-typography h3 {
                font-family: var(--fontFamily-h3-fontFamily);
                font-size: var(--fontSize-h3-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h3-fontWeight);
                font-style: var(--fontStyle-h3-fontStyle);
                text-transform: var(--textTransform-h3-textTransform);
              }

              [data-ypp-scope="coverage-section"] .ypp-typography h4 {
                font-family: var(--fontFamily-h4-fontFamily);
                font-size: var(--fontSize-h4-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h4-fontWeight);
                font-style: var(--fontStyle-h4-fontStyle);
                text-transform: var(--textTransform-h4-textTransform);
              }

              [data-ypp-scope="coverage-section"] .ypp-typography h5 {
                font-family: var(--fontFamily-h5-fontFamily);
                font-size: var(--fontSize-h5-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h5-fontWeight);
                font-style: var(--fontStyle-h5-fontStyle);
                text-transform: var(--textTransform-h5-textTransform);
              }

              [data-ypp-scope="coverage-section"] .ypp-typography h6 {
                font-family: var(--fontFamily-h6-fontFamily);
                font-size: var(--fontSize-h6-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h6-fontWeight);
                font-style: var(--fontStyle-h6-fontStyle);
                text-transform: var(--textTransform-h6-textTransform);
              }

              [data-ypp-scope="coverage-section"] .ypp-typography a {
                font-family: var(--fontFamily-link-fontFamily);
                font-size: var(--fontSize-link-fontSize);
                font-weight: var(--fontWeight-link-fontWeight);
                font-style: var(--fontStyle-link-fontStyle);
                line-height: 1.5;
                text-decoration: underline;
                text-transform: var(--textTransform-link-textTransform);
                letter-spacing: var(--letterSpacing-link-letterSpacing);
              }

              [data-ypp-scope="coverage-section"] .ypp-typography a.coverage-section__cta,
              [data-ypp-scope="coverage-section"] .coverage-section__cta,
              [data-ypp-scope="coverage-section"] .coverage-section__cta a {
                border-radius: 12px;
                text-decoration: none;
              }

              [data-ypp-scope="coverage-section"] .ypp-typography a.coverage-section__cta:hover,
              [data-ypp-scope="coverage-section"] .ypp-typography a.coverage-section__cta:focus-visible,
              [data-ypp-scope="coverage-section"] .coverage-section__cta:hover,
              [data-ypp-scope="coverage-section"] .coverage-section__cta:focus-visible,
              [data-ypp-scope="coverage-section"] .coverage-section__cta:hover a,
              [data-ypp-scope="coverage-section"] .coverage-section__cta:focus-visible a {
                text-decoration: none;
              }

              [data-ypp-scope="coverage-section"] .ypp-cta-button {
                transition:
                  background-color 0.2s ease,
                  border-color 0.2s ease,
                  color 0.2s ease,
                  box-shadow 0.2s ease,
                  transform 0.2s ease;
              }

              [data-ypp-scope="coverage-section"] .ypp-cta-button:hover,
              [data-ypp-scope="coverage-section"] .ypp-cta-button:focus-visible {
                transform: translateY(-1px);
                box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
              }

              [data-ypp-scope="coverage-section"] .ypp-cta-button--filled:hover,
              [data-ypp-scope="coverage-section"] .ypp-cta-button--filled:focus-visible {
                box-shadow:
                  0 10px 20px rgba(15, 23, 42, 0.12),
                  inset 0 0 0 999px rgba(0, 0, 0, 0.06);
              }

              [data-ypp-scope="coverage-section"] .ypp-cta-button--outline:hover,
              [data-ypp-scope="coverage-section"] .ypp-cta-button--outline:focus-visible {
                background-color: color-mix(in srgb, currentColor 8%, transparent);
                border-color: currentColor;
                box-shadow:
                  0 10px 20px rgba(15, 23, 42, 0.12),
                  inset 0 0 0 1px currentColor;
              }
            `}</style>
            <div className="ypp-typography mx-auto flex max-w-[1280px] flex-col gap-[30px] px-4 py-[30px] md:px-8 md:py-[60px] xl:px-20">
              <EntityField
                displayName="Heading"
                fieldId={props.heading.text.field}
                constantValueEnabled={props.heading.text.constantValueEnabled}
              >
                <h2
                  className="m-0"
                  style={{
                    fontFamily:
                      props.heading.styles.fontFamily === "default"
                        ? undefined
                        : props.heading.styles.fontFamily,
                    fontSize:
                      props.heading.styles.fontSize === "default"
                        ? undefined
                        : props.heading.styles.fontSize,
                    color: headingColor,
                    fontWeight:
                      props.heading.styles.fontWeight === "default"
                        ? undefined
                        : props.heading.styles.fontWeight,
                    fontStyle:
                      props.heading.styles.fontStyle === "default"
                        ? undefined
                        : props.heading.styles.fontStyle,
                    textTransform:
                      props.heading.styles.textTransform === "default"
                        ? undefined
                        : props.heading.styles.textTransform,
                    letterSpacing:
                      props.heading.styles.letterSpacing === "default"
                        ? undefined
                        : props.heading.styles.letterSpacing,
                  }}
                >
                  {heading}
                </h2>
              </EntityField>
              <div className="max-w-[800px]">
                <EntityField
                  displayName="Intro"
                  fieldId={props.intro.text.field}
                  constantValueEnabled={props.intro.text.constantValueEnabled}
                >
                  {React.isValidElement(intro) ? (
                    intro
                  ) : (
                    <MaybeRTF
                      data={
                        intro as React.ComponentProps<typeof MaybeRTF>["data"]
                      }
                      richTextStyleOverrides={introRichTextStyleOverrides}
                    />
                  )}
                </EntityField>
              </div>
              <div className="ypp-typography grid gap-5 xl:grid-cols-3">
                {nearbyLocationDocs.map((locationData, index) => {
                  const resolvedUrl = resolveUrlTemplate(
                    mergeMeta(locationData, streamDocument),
                    relativePrefixToRoot ?? "",
                  );
                  const phone = (locationData.mainPhone ?? "").trim();
                  const formattedPhone = phone
                    ? formatPhone(phone, props.phone.phoneFormat)
                    : "";
                  const telDigits = phone.replace(/\D/g, "");

                  return (
                    <article
                      key={`${locationData.id || locationData.name}-${index}`}
                      className="rounded-[10px] border px-4 py-2 md:flex md:gap-6 md:p-2"
                      style={{
                        backgroundColor: resolveThemeColorCssValue(
                          props.cardBackgroundColor,
                        ),
                        borderColor: cardBorderColor,
                      }}
                    >
                      <div
                        className="mb-3 hidden h-[76px] w-[76px] flex-shrink-0 items-center justify-center rounded-[4px] md:flex"
                        style={{
                          backgroundColor: iconBackgroundCssValue,
                          color: iconForegroundColor,
                        }}
                      >
                        <FaMapMarkerAlt
                          aria-hidden="true"
                          className="h-5 w-4 text-current"
                        />
                      </div>
                      <div className="flex h-full flex-col gap-2 py-3 md:min-h-[200px]">
                        <h3 className="m-0" style={{ color: cardForegroundColor }}>
                          {locationData.name}
                        </h3>
                        {props.showAddress && locationData.address ? (
                          <div style={{ color: cardMutedColor }}>
                            <Address
                              address={locationData.address}
                              showRegion={props.address.showRegion}
                              showCountry={props.address.showCountry}
                            />
                          </div>
                        ) : null}
                        {props.showPhone && formattedPhone ? (
                          props.phone.includeHyperlink && telDigits ? (
                            <Link
                              cta={{
                                link: telDigits,
                                linkType: "PHONE",
                              }}
                              eventName={`coveragePhone${index}`}
                              style={{ color: cardMutedColor }}
                            >
                              {formattedPhone}
                            </Link>
                          ) : (
                            <p className="m-0" style={{ color: cardMutedColor }}>
                              {formattedPhone}
                            </p>
                          )
                        ) : null}
                        {props.showHours && locationData.hours ? (
                          <HoursStatus
                            hours={locationData.hours}
                            comingSoon={streamDocument.comingSoon}
                            timezone={
                              locationData.timezone ??
                              streamDocument.timezone ??
                              "UTC"
                            }
                            dayOptions={{
                              weekday: props.hoursStyles.dayOfWeekFormat,
                            }}
                            timeOptions={{
                              hour12: props.hoursStyles.timeFormat === "12h",
                            }}
                            statusTemplate={(params: StatusParams) => {
                              const showDayNames =
                                props.hoursStyles.showDayNames;
                              const interval = params.isOpen
                                ? params.currentInterval
                                : params.futureInterval;
                              const time = params.isOpen
                                ? interval?.getEndTime(
                                    locale,
                                    params.timeOptions,
                                  ) ?? ""
                                : interval?.getStartTime(
                                    locale,
                                    params.timeOptions,
                                  ) ?? "";
                              const dayLabel =
                                showDayNames && interval
                                  ? params.isOpen
                                    ? interval.end
                                        ?.setLocale(locale)
                                        .toLocaleString(params.dayOptions) ?? ""
                                    : interval.start
                                        ?.setLocale(locale)
                                        .toLocaleString(params.dayOptions) ?? ""
                                  : "";

                              if (params.currentInterval?.is24h?.()) {
                                return (
                                  <span
                                    className="text-[14px] font-medium"
                                    style={{ color: cardForegroundColor }}
                                  >
                                    Open 24 Hours
                                  </span>
                                );
                              }

                              if (!params.futureInterval && !params.isOpen) {
                                return (
                                  <span
                                    className="text-[14px] font-medium"
                                    style={{ color: cardForegroundColor }}
                                  >
                                    Temporarily Closed
                                  </span>
                                );
                              }

                              const statusText = params.isOpen
                                ? "Open Now"
                                : "Closed";
                              const futureText = dayLabel
                                ? `${params.isOpen ? "Closes" : "Opens"} at ${time} ${dayLabel}`
                                : `${params.isOpen ? "Closes" : "Opens"} at ${time}`;

                              return (
                                <div
                                  className="flex flex-wrap items-center gap-1 text-[14px]"
                                  style={{ color: cardMutedColor }}
                                >
                                  {props.hoursStyles.showCurrentStatus ? (
                                    <span
                                      className="font-medium"
                                      style={{ color: cardForegroundColor }}
                                    >
                                      {statusText}
                                    </span>
                                  ) : null}
                                  {props.hoursStyles.showCurrentStatus ? (
                                    <span aria-hidden>•</span>
                                  ) : null}
                                  <span>{futureText}</span>
                                </div>
                              );
                            }}
                          />
                        ) : null}
                        <CTA
                          variant={"primary"}
                          label={locationCtaLabel}
                          link={resolvedUrl}
                          eventName={`coverageLocation${index}`}
                          className="coverage-section__cta ypp-cta-button ypp-cta-button--filled mt-2 inline-flex md:mt-auto"
                          style={{ color: locationCtaForegroundColor }}
                        />
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        </AnalyticsScopeProvider>
      </VisibilityWrapper>
    );
  };

export const ProfessionalPracticeCoverageSection: YextComponentConfig<ProfessionalPracticeCoverageSectionProps> =
  {
    label: "Coverage Section",
    fields: ProfessionalPracticeCoverageSectionFields,
    defaultProps: {
      section: {
        backgroundColor: sectionColor,
        visibleOnLivePage: true,
      },
      cardBackgroundColor,
      iconBackgroundColor: defaultIconBackgroundColor,
      heading: {
        text: {
          field: "",
          constantValue: "Our Service Fleet Hubs & Coverage",
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
              "Our service vans routinely visit West Falls Church, Merrifield, Fairview Park, and Holmes Run Acres. Don't see your neighborhood listed? Give us a call—we are continuously expanding our service routes to meet demand.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontColor: undefined,
      },
      radius: 10,
      limit: 3,
      showAddress: true,
      showPhone: true,
      showHours: true,
      address: {
        showRegion: true,
        showCountry: false,
      },
      phone: {
        phoneFormat: "domestic",
        includeHyperlink: true,
      },
      hoursStyles: {
        showCurrentStatus: true,
        timeFormat: "12h",
        dayOfWeekFormat: "long",
        showDayNames: true,
      },
    },
    render: (props) => (
      <ProfessionalPracticeCoverageSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeCoverageSection",
  displayName: "Coverage Section",
  description: "Coverage Section",
  pageSetTypes: ["ENTITY"],
};
