import type { SectionRenderConfig } from "@yext/visual-editor";
import { resolveTextStyles, TypographyScope } from "../shared/typography";
import type { PuckComponent } from "@puckeditor/core";
import { useTranslation } from "react-i18next";
import {
  pt,
  EntityField,
  type ThemeColor,
  VisibilityWrapper,
  Background,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue as resolveThemeColorCssValue,
  resolveComponentData,
  useDocument,
} from "@yext/visual-editor";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  getReadableForegroundColor as resolveReadableForegroundColor,
  renderResolvedRichText,
  type StyledRtfProps,
  type StyledTextProps,
} from "../shared/sectionHelpers";
export type ProfessionalPracticeVideoSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: StyledTextProps;
  body: StyledRtfProps;
  videoSource: string;
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
    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : "";
  }

  const videoId = source.split("v=")[1]?.split("&")[0] ?? "";
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : "";
};

const ProfessionalPracticeVideoSectionComponent: PuckComponent<
  ProfessionalPracticeVideoSectionProps
> = (props) => {
  const { t, i18n } = useTranslation();
  const streamDocument = useDocument();
  const locale = i18n.language;
  const headingColor = resolveReadableForegroundColor(
    props.heading.fontColor,
    props.section.backgroundColor,
    streamDocument,
  );
  const bodyColor = resolveReadableForegroundColor(
    props.body.fontColor,
    props.section.backgroundColor,
    streamDocument,
  );
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

export const ProfessionalPracticeVideoSection: SectionRenderConfig<ProfessionalPracticeVideoSectionProps> =
  {
    render: (props) => (
      <TypographyScope>
        <ProfessionalPracticeVideoSectionComponent {...props} />
      </TypographyScope>
    ),
  };
