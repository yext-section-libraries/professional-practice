import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  EntityField,
  getDefaultRTF,
  MaybeRTF,
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

type ProfessionalPracticeVideoSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: StyledTextProps;
  body: StyledRtfProps;
  videoSource: string;
};


const defaultSectionColor: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
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

const getYouTubeEmbedUrl = (source: string) => {
  if (!source) {
    return "";
  }

  if (source.includes("/embed/")) {
    return source;
  }

  if (source.includes("youtu.be/")) {
    const videoId = source.split("youtu.be/")[1]?.split(/[?&]/)[0] ?? "";
    return videoId
      ? `https://www.youtube-nocookie.com/embed/${videoId}`
      : "";
  }

  const videoId = source.split("v=")[1]?.split("&")[0] ?? "";
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : "";
};


const ProfessionalPracticeVideoSectionFields: YextFields<ProfessionalPracticeVideoSectionProps> =
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
    videoSource: {
      label: "Video Source",
      type: "text",
    },
  };

const ProfessionalPracticeVideoSectionComponent: PuckComponent<ProfessionalPracticeVideoSectionProps> =
  (props) => {
    const streamDocument = useDocument();
    const locale = streamDocument.locale ?? "en";
    const headingColor = resolveReadableForegroundColor(props.heading.fontColor, props.section.backgroundColor, streamDocument);
    const bodyColor = resolveReadableForegroundColor(props.body.fontColor, props.section.backgroundColor, streamDocument);
    const heading =
      resolveComponentData(props.heading.text, locale, streamDocument) || "";
    const richTextStyleOverrides = {
      color: bodyColor,
    };
    const body = resolveComponentData(props.body.text, locale, streamDocument, {
      richTextStyleOverrides,
    });
    const embedUrl = getYouTubeEmbedUrl(props.videoSource);
    const frameBackgroundColor = resolveThemeColorCssValue(
      props.section.backgroundColor,
    );
    const frameForegroundColor = resolveReadableForegroundColor(
      undefined,
      props.section.backgroundColor,
      streamDocument,
    );

    if (!embedUrl && !props.puck.isEditing) {
      return <></>;
    }

    return (
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <AnalyticsScopeProvider
          name={`ProfessionalPracticeVideoSection${getAnalyticsScopeHash(props.id)}`}
        >
          <section
            data-ypp-scope="video-section"
            style={{
              backgroundColor: resolveThemeColorCssValue(props.section.backgroundColor),
            }}
          >
            <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-[30px] md:px-8 md:py-[60px] xl:grid-cols-[minmax(0,0.9fr)_minmax(520px,1.1fr)] xl:items-center xl:px-20">
              <style>{`
                [data-ypp-scope="video-section"] .ypp-typography p {
                  font-family: var(--fontFamily-body-fontFamily);
                  font-size: var(--fontSize-body-fontSize);
                  line-height: 1.5;
                  font-weight: var(--fontWeight-body-fontWeight);
                  font-style: var(--fontStyle-body-fontStyle);
                  text-transform: var(--textTransform-body-textTransform);
                }

                [data-ypp-scope="video-section"] .ypp-typography li {
                  font-family: var(--fontFamily-body-fontFamily);
                  font-size: var(--fontSize-body-fontSize);
                  line-height: 1.5;
                  font-weight: var(--fontWeight-body-fontWeight);
                  font-style: var(--fontStyle-body-fontStyle);
                  text-transform: var(--textTransform-body-textTransform);
                }

                [data-ypp-scope="video-section"] .ypp-typography h1 {
                  font-family: var(--fontFamily-h1-fontFamily);
                  font-size: var(--fontSize-h1-fontSize);
                  line-height: 1.2;
                  font-weight: var(--fontWeight-h1-fontWeight);
                  font-style: var(--fontStyle-h1-fontStyle);
                  text-transform: var(--textTransform-h1-textTransform);
                }

                [data-ypp-scope="video-section"] .ypp-typography h2 {
                  font-family: var(--fontFamily-h2-fontFamily);
                  font-size: var(--fontSize-h2-fontSize);
                  line-height: 1.2;
                  font-weight: var(--fontWeight-h2-fontWeight);
                  font-style: var(--fontStyle-h2-fontStyle);
                  text-transform: var(--textTransform-h2-textTransform);
                }

                [data-ypp-scope="video-section"] .ypp-typography h3 {
                  font-family: var(--fontFamily-h3-fontFamily);
                  font-size: var(--fontSize-h3-fontSize);
                  line-height: 1.2;
                  font-weight: var(--fontWeight-h3-fontWeight);
                  font-style: var(--fontStyle-h3-fontStyle);
                  text-transform: var(--textTransform-h3-textTransform);
                }

                [data-ypp-scope="video-section"] .ypp-typography h4 {
                  font-family: var(--fontFamily-h4-fontFamily);
                  font-size: var(--fontSize-h4-fontSize);
                  line-height: 1.2;
                  font-weight: var(--fontWeight-h4-fontWeight);
                  font-style: var(--fontStyle-h4-fontStyle);
                  text-transform: var(--textTransform-h4-textTransform);
                }

                [data-ypp-scope="video-section"] .ypp-typography h5 {
                  font-family: var(--fontFamily-h5-fontFamily);
                  font-size: var(--fontSize-h5-fontSize);
                  line-height: 1.2;
                  font-weight: var(--fontWeight-h5-fontWeight);
                  font-style: var(--fontStyle-h5-fontStyle);
                  text-transform: var(--textTransform-h5-textTransform);
                }

                [data-ypp-scope="video-section"] .ypp-typography h6 {
                  font-family: var(--fontFamily-h6-fontFamily);
                  font-size: var(--fontSize-h6-fontSize);
                  line-height: 1.2;
                  font-weight: var(--fontWeight-h6-fontWeight);
                  font-style: var(--fontStyle-h6-fontStyle);
                  text-transform: var(--textTransform-h6-textTransform);
                }

                [data-ypp-scope="video-section"] .ypp-typography a {
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
                      richTextStyleOverrides={richTextStyleOverrides}
                    />
                  )}
                </EntityField>
              </div>
              <div
                className="overflow-hidden rounded-[16px] border"
                style={{
                  backgroundColor: frameBackgroundColor,
                  borderColor: frameBackgroundColor,
                }}
              >
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={heading || "Embedded video"}
                    className="block aspect-video w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div
                    className="flex aspect-video items-center justify-center p-6 text-center"
                    style={{ color: frameForegroundColor }}
                  >
                    Add a YouTube video URL to render this section.
                  </div>
                )}
              </div>
            </div>
          </section>
        </AnalyticsScopeProvider>
      </VisibilityWrapper>
    );
  };

export const ProfessionalPracticeVideoSection: YextComponentConfig<ProfessionalPracticeVideoSectionProps> =
  {
    label: "Video Section",
    fields: ProfessionalPracticeVideoSectionFields,
    defaultProps: {
      section: {
        backgroundColor: defaultSectionColor,
        visibleOnLivePage: true,
      },
      heading: {
        text: {
          field: "",
          constantValue: "Show The Experience In Motion",
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
              "A dedicated video band helps editors add a walk-through, day-in-the-van story, or customer education clip without leaving the template's calm dark-shell rhythm.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontColor: undefined,
      },
      videoSource: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    },
    render: (props) => <ProfessionalPracticeVideoSectionComponent {...props} />,
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeVideoSection",
  displayName: "Video Section",
  description: "Video Section",
  pageSetTypes: ["ENTITY"],
};
