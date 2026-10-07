import type { SectionRenderConfig } from "@yext/visual-editor";
import { resolveTextStyles, TypographyScope } from "../shared/typography";
import { useTranslation } from "react-i18next";
import type { PuckComponent } from "@puckeditor/core";
import {
  EntityField,
  MapboxStaticMapComponent,
  type ThemeColor,
  VisibilityWrapper,
  type YextEntityField,
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
type CoordinateValue = {
  latitude: number;
  longitude: number;
};

export type ProfessionalPracticeStaticMapSectionProps = {
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

const resolveSubtleBorderColor = (
  backgroundColor: ThemeColor,
  streamDocument: any,
): string => {
  const surfaceBackground = resolveThemeColorCssValue(backgroundColor);
  const foreground =
    resolveReadableForegroundColor(
      undefined,
      backgroundColor,
      streamDocument,
    ) ?? "currentColor";

  if (!surfaceBackground) {
    return `color-mix(in srgb, ${foreground} 12%, transparent)`;
  }

  return `color-mix(in srgb, ${foreground} 12%, ${surfaceBackground})`;
};

const ProfessionalPracticeStaticMapSectionComponent: PuckComponent<
  ProfessionalPracticeStaticMapSectionProps
> = (props) => {
  const streamDocument = useDocument<MapDocument>();
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const headingColor = resolveReadableForegroundColor(
    props.heading.fontColor,
    props.section.backgroundColor,
    streamDocument,
  );
  const bodyRichTextStyleOverrides = {
    color: resolveReadableForegroundColor(
      props.body.fontColor,
      props.section.backgroundColor,
      streamDocument,
    ),
  };
  const heading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const body = resolveComponentData(props.body.text, locale, streamDocument);
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
        <Background background={props.section.backgroundColor}>
          <section
            data-ypp-scope="static-map-section"
            style={getSurfaceColorStyle(
              props.section.backgroundColor,
              streamDocument,
            )}
          >
            <style>{`

              [data-ypp-scope="static-map-section"] .ypp-typography a {

                text-decoration: underline;
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
                  {renderResolvedRichText(body, bodyRichTextStyleOverrides)}
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
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const ProfessionalPracticeStaticMapSection: SectionRenderConfig<ProfessionalPracticeStaticMapSectionProps> =
  {
    render: (props) => (
      <TypographyScope>
        <ProfessionalPracticeStaticMapSectionComponent {...props} />
      </TypographyScope>
    ),
  };
