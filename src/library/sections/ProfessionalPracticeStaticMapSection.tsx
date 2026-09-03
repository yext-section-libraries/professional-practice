import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  EntityField,
  getDefaultRTF,
  MapboxStaticMapComponent,
  MaybeRTF,
  mapboxStaticMapStyleOptions,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableRichText,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  getAnalyticsScopeHash,
  isDarkColor,
  resolveComponentData,
  useDocument,
} from "@yext/visual-editor";
import { AnalyticsScopeProvider } from "@yext/pages-components";

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

type CoordinateValue = {
  latitude: number;
  longitude: number;
};

type ProfessionalPracticeStaticMapSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: StyledTextProps;
  body: StyledRtfProps;
  map: {
    coordinate: YextEntityField<CoordinateValue>;
    mapStyle: string;
    zoom: number;
  };
};

type MapDocument = {
  _env?: {
    YEXT_MAPBOX_API_KEY?: string;
    YEXT_EDIT_LAYOUT_MODE_MAPBOX_API_KEY?: string;
  };
  locale?: string;
};


const defaultSectionColor: ThemeColor = {
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


const ProfessionalPracticeStaticMapSectionFields: YextFields<ProfessionalPracticeStaticMapSectionProps> =
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
    body: {
      label: "Body",
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
    map: {
      label: "Map",
      type: "object",
      objectFields: {
        coordinate: {
          type: "entityField",
          label: "Coordinates",
          filter: {
            types: ["type.coordinate"],
          },
        },
        mapStyle: {
          label: "Mapbox Map Style",
          type: "select",
          options: mapboxStaticMapStyleOptions,
        },
        zoom: {
          label: "Zoom",
          type: "number",
          min: 0,
          max: 22,
        },
      },
    },
  };

const ProfessionalPracticeStaticMapSectionComponent: PuckComponent<ProfessionalPracticeStaticMapSectionProps> =
  (props) => {
    const streamDocument = useDocument<MapDocument>();
    const locale = streamDocument.locale ?? "en";
    const headingColor = resolveReadableForegroundColor(props.heading.fontColor, props.section.backgroundColor, streamDocument);
    const bodyRichTextStyleOverrides = {
      color: resolveReadableForegroundColor(props.body.fontColor, props.section.backgroundColor, streamDocument),
    };
    const heading =
      resolveComponentData(props.heading.text, locale, streamDocument) || "";
    const body = resolveComponentData(props.body.text, locale, streamDocument, {
      richTextStyleOverrides: bodyRichTextStyleOverrides,
    });
    const mapBorderColor = resolveSubtleBorderColor(
      props.section.backgroundColor,
      streamDocument,
    );

    return (
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <AnalyticsScopeProvider
          name={`ProfessionalPracticeStaticMapSection${getAnalyticsScopeHash(props.id)}`}
        >
          <section
            data-ypp-scope="static-map-section"
            style={{
              backgroundColor: resolveThemeColorCssValue(
                props.section.backgroundColor,
              ),
            }}
          >
            <style>{`
              [data-ypp-scope="static-map-section"] .ypp-typography p {
                font-family: var(--fontFamily-body-fontFamily);
                font-size: var(--fontSize-body-fontSize);
                line-height: 1.5;
                font-weight: var(--fontWeight-body-fontWeight);
                font-style: var(--fontStyle-body-fontStyle);
                text-transform: var(--textTransform-body-textTransform);
              }

              [data-ypp-scope="static-map-section"] .ypp-typography li {
                font-family: var(--fontFamily-body-fontFamily);
                font-size: var(--fontSize-body-fontSize);
                line-height: 1.5;
                font-weight: var(--fontWeight-body-fontWeight);
                font-style: var(--fontStyle-body-fontStyle);
                text-transform: var(--textTransform-body-textTransform);
              }

              [data-ypp-scope="static-map-section"] .ypp-typography h1 {
                font-family: var(--fontFamily-h1-fontFamily);
                font-size: var(--fontSize-h1-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h1-fontWeight);
                font-style: var(--fontStyle-h1-fontStyle);
                text-transform: var(--textTransform-h1-textTransform);
              }

              [data-ypp-scope="static-map-section"] .ypp-typography h2 {
                font-family: var(--fontFamily-h2-fontFamily);
                font-size: var(--fontSize-h2-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h2-fontWeight);
                font-style: var(--fontStyle-h2-fontStyle);
                text-transform: var(--textTransform-h2-textTransform);
              }

              [data-ypp-scope="static-map-section"] .ypp-typography h3 {
                font-family: var(--fontFamily-h3-fontFamily);
                font-size: var(--fontSize-h3-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h3-fontWeight);
                font-style: var(--fontStyle-h3-fontStyle);
                text-transform: var(--textTransform-h3-textTransform);
              }

              [data-ypp-scope="static-map-section"] .ypp-typography h4 {
                font-family: var(--fontFamily-h4-fontFamily);
                font-size: var(--fontSize-h4-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h4-fontWeight);
                font-style: var(--fontStyle-h4-fontStyle);
                text-transform: var(--textTransform-h4-textTransform);
              }

              [data-ypp-scope="static-map-section"] .ypp-typography h5 {
                font-family: var(--fontFamily-h5-fontFamily);
                font-size: var(--fontSize-h5-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h5-fontWeight);
                font-style: var(--fontStyle-h5-fontStyle);
                text-transform: var(--textTransform-h5-textTransform);
              }

              [data-ypp-scope="static-map-section"] .ypp-typography h6 {
                font-family: var(--fontFamily-h6-fontFamily);
                font-size: var(--fontSize-h6-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h6-fontWeight);
                font-style: var(--fontStyle-h6-fontStyle);
                text-transform: var(--textTransform-h6-textTransform);
              }

              [data-ypp-scope="static-map-section"] .ypp-typography a {
                font-family: var(--fontFamily-link-fontFamily);
                font-size: var(--fontSize-link-fontSize);
                font-weight: var(--fontWeight-link-fontWeight);
                font-style: var(--fontStyle-link-fontStyle);
                line-height: 1.5;
                text-decoration: underline;
                text-transform: var(--textTransform-link-textTransform);
                letter-spacing: var(--letterSpacing-link-letterSpacing);
              }

              [data-ypp-scope="static-map-section"] .ypp-static-map-frame .mapbox-static-map-shell {
                height: 100%;
                width: 100%;
              }

              [data-ypp-scope="static-map-section"] .ypp-static-map-frame .mapbox-static-map-picture {
                height: 100%;
                width: 100%;
              }

              [data-ypp-scope="static-map-section"] .ypp-static-map-frame .mapbox-static-map-image {
                height: 100%;
                width: 100%;
                object-fit: cover;
                object-position: center;
              }
            `}</style>
            <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-[30px] md:px-8 md:py-[60px] xl:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] xl:items-center xl:px-20">
              <div className="ypp-typography flex flex-col gap-4">
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
                <EntityField
                  displayName="Body"
                  fieldId={props.body.text.field}
                  constantValueEnabled={props.body.text.constantValueEnabled}
                >
                  {React.isValidElement(body) ? (
                    body
                  ) : (
                    <MaybeRTF
                      data={
                        body as React.ComponentProps<typeof MaybeRTF>["data"]
                      }
                      richTextStyleOverrides={bodyRichTextStyleOverrides}
                    />
                  )}
                </EntityField>
              </div>
              <EntityField
                displayName="Coordinates"
                fieldId={props.map.coordinate.field}
                constantValueEnabled={props.map.coordinate.constantValueEnabled}
              >
                <div
                  className="ypp-static-map-frame overflow-hidden rounded-[16px] border"
                  style={{ borderColor: mapBorderColor }}
                >
                  <div className="min-h-[320px]">
                    <MapboxStaticMapComponent
                      coordinate={props.map.coordinate}
                      mapStyle={props.map.mapStyle}
                      zoom={props.map.zoom}
                      height="100%"
                      id={`${props.id}-map`}
                      puck={props.puck}
                    />
                  </div>
                </div>
              </EntityField>
            </div>
          </section>
        </AnalyticsScopeProvider>
      </VisibilityWrapper>
    );
  };

export const ProfessionalPracticeStaticMapSection: YextComponentConfig<ProfessionalPracticeStaticMapSectionProps> =
  {
    label: "Static Map Section",
    fields: ProfessionalPracticeStaticMapSectionFields,
    defaultProps: {
      section: {
        backgroundColor: defaultSectionColor,
        visibleOnLivePage: true,
      },
      heading: {
        text: {
          field: "",
          constantValue: "Plan The Easiest Stop On The Route",
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
              "Use this section when a location page should show a simple arrival preview alongside reassuring copy, booking notes, or neighborhood guidance.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontColor: undefined,
      },
      map: {
        coordinate: {
          field: "yextDisplayCoordinate",
          constantValue: {
            latitude: 0,
            longitude: 0,
          },
          constantValueEnabled: false,
        },
        mapStyle: "streets-v12",
        zoom: 13,
      },
    },
    render: (props) => (
      <ProfessionalPracticeStaticMapSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeStaticMapSection",
  displayName: "Static Map Section",
  description: "Static Map Section",
  pageSetTypes: ["ENTITY"],
};
