import { resolveTextStyles, TypographyScope } from "../shared/typography";
import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { useTranslation } from "react-i18next";
import {
  msg,
  pt,
  EntityField,
  getDefaultRTF,
  type ThemeColor,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextFields,
  Background,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue as resolveThemeColorCssValue,
  resolveComponentData,
  useDocument,
} from "@yext/visual-editor";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  defaultTextStyles,
  getReadableForegroundColor as resolveReadableForegroundColor,
  renderResolvedRichText,
  type StyledRtfProps,
  type StyledTextProps,
} from "../shared/sectionHelpers";

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
    videoSource: {
      label: msg("fields.videoSource", "Video Source"),
      type: "text",
    },
  };

const ProfessionalPracticeVideoSectionComponent: PuckComponent<ProfessionalPracticeVideoSectionProps> =
  (props) => {
    const { t, i18n } = useTranslation();
    const streamDocument = useDocument();
    const locale = i18n.language;
    const headingColor = resolveReadableForegroundColor(props.heading.fontColor, props.section.backgroundColor, streamDocument);
    const bodyColor = resolveReadableForegroundColor(props.body.fontColor, props.section.backgroundColor, streamDocument);
    const heading =
      resolveComponentData(props.heading.text, locale, streamDocument) || "";
    const richTextStyleOverrides = {
      color: bodyColor,
    };
    const body = resolveComponentData(props.body.text, locale, streamDocument);
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
          <Background background={props.section.backgroundColor}>
            <section
              data-ypp-scope="video-section"
              style={getSurfaceColorStyle(
                props.section.backgroundColor,
                streamDocument,
              )}
            >
            <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-[30px] md:px-8 md:py-[60px] xl:grid-cols-[minmax(0,0.9fr)_minmax(520px,1.1fr)] xl:items-center xl:px-20">
              <style>{`

                [data-ypp-scope="video-section"] .ypp-typography a {

                  text-decoration: underline;
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
                      ...resolveTextStyles(props.heading.styles),
                      color: headingColor,
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
                  {renderResolvedRichText(body, richTextStyleOverrides)}
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
                    title={heading || t("embeddedVideo", "Embedded video")}
                    className="block aspect-video w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div
                    className="flex aspect-video items-center justify-center p-6 text-center"
                    style={{ color: frameForegroundColor }}
                  >
                    {pt(
                      "addYouTubeVideoUrl",
                      "Add a YouTube video URL to render this section.",
                    )}
                  </div>
                )}
              </div>
            </div>
            </section>
          </Background>
        </AnalyticsScopeProvider>
      </VisibilityWrapper>
    );
  };

export const ProfessionalPracticeVideoSection: YextComponentConfig<ProfessionalPracticeVideoSectionProps> =
  {
    label: "Video",
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
    render: (props) => (
      <TypographyScope>
        <ProfessionalPracticeVideoSectionComponent {...props} />
      </TypographyScope>
    ),
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeVideoSection",
  displayName: "Video",
  description: "Video Section",
  pageSetTypes: ["ENTITY"],
};
