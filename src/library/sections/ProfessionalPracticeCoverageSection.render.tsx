import type { SectionRenderConfig } from "@yext/visual-editor";
import { resolveTextStyles, TypographyScope } from "../shared/typography";
import type { PuckComponent } from "@puckeditor/core";
import { parsePhoneNumber } from "awesome-phonenumber";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import {
  pt,
  EntityField,
  mergeMeta,
  resolveComponentData,
  resolveUrlTemplate,
  type ThemeColor,
  useDocument,
  useNearbyLocations,
  useTemplateProps,
  VisibilityWrapper,
  Background,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue as resolveThemeColorCssValue,
  CTA,
} from "@yext/visual-editor";
import {
  Address,
  AnalyticsScopeProvider,
  HoursStatus,
  Link,
  type StatusParams,
} from "@yext/pages-components";
import {
  getReadableForegroundColor as resolveReadableForegroundColor,
  renderResolvedRichText,
  type StyledRtfProps,
  type StyledTextProps,
} from "../shared/sectionHelpers";
import { renderTranslatedHoursStatus } from "../shared/components/TranslatedHoursStatus";
type StreamDocumentWithCoordinate = {
  comingSoon?: boolean;
  locale?: string;
  timezone?: string;
  yextDisplayCoordinate?: {
    latitude?: number;
    longitude?: number;
  };
};

export type ProfessionalPracticeCoverageSectionProps = {
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

export const cardBackgroundColor: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "black",
};

const primaryCtaBackgroundColor: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
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

const resolveMutedForegroundColor = (
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

const ProfessionalPracticeCoverageSectionComponent: PuckComponent<
  ProfessionalPracticeCoverageSectionProps
> = (props) => {
  const { t, i18n } = useTranslation();
  const streamDocument = useDocument<StreamDocumentWithCoordinate>();
  const { relativePrefixToRoot } = useTemplateProps<{
    relativePrefixToRoot?: string;
  }>();
  const locale = i18n.language;
  const loadingMessage = t(
    "loadingNearbyLocations",
    "Loading nearby locations",
  );
  const emptyEditorMessage = pt(
    "noNearbyLocationsFound",
    "No nearby locations found for this location",
  );
  const locationCtaLabel = t("viewLocation", "View Location");
  const headingColor = resolveReadableForegroundColor(
    props.heading.fontColor,
    props.section.backgroundColor,
    streamDocument,
  );
  const introRichTextStyleOverrides = {
    color: resolveReadableForegroundColor(
      props.intro.fontColor,
      props.section.backgroundColor,
      streamDocument,
    ),
  };
  const heading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const intro = resolveComponentData(props.intro.text, locale, streamDocument);
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
      <Background background={props.section.backgroundColor}>
        <section
          data-ypp-scope="coverage-section"
          style={getSurfaceColorStyle(
            props.section.backgroundColor,
            streamDocument,
          )}
        >
          <style>{`

            [data-ypp-scope="coverage-section"] .ypp-typography a {

              text-decoration: underline;
            }
          `}</style>
          <div className="ypp-typography mx-auto flex max-w-[1280px] flex-col gap-4 px-4 py-[30px] md:px-8 md:py-[60px] xl:px-20">
            <h2 className="m-0" style={{ color: headingColor }}>
              {heading}
            </h2>
            <p className="m-0 text-[var(--colors-palette-tertiary)]">
              {loadingMessage}
            </p>
          </div>
        </section>
      </Background>
    );
  }

  if (nearbyLocationsStatus !== "success" || !nearbyLocationDocs.length) {
    if (!props.puck.isEditing) {
      return <></>;
    }

    return (
      <Background background={props.section.backgroundColor}>
        <section
          data-ypp-scope="coverage-section"
          style={getSurfaceColorStyle(
            props.section.backgroundColor,
            streamDocument,
          )}
        >
          <style>{`

            [data-ypp-scope="coverage-section"] .ypp-typography a {

              text-decoration: underline;
            }
          `}</style>
          <div className="ypp-typography mx-auto flex max-w-[1280px] flex-col gap-4 px-4 py-[30px] md:px-8 md:py-[60px] xl:px-20">
            <h2 className="m-0" style={{ color: headingColor }}>
              {heading}
            </h2>
            <p className="m-0 text-[var(--colors-palette-tertiary)]">
              {emptyEditorMessage}
            </p>
          </div>
        </section>
      </Background>
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
        <Background background={props.section.backgroundColor}>
          <section
            data-ypp-scope="coverage-section"
            style={getSurfaceColorStyle(
              props.section.backgroundColor,
              streamDocument,
            )}
          >
            <style>{`

              [data-ypp-scope="coverage-section"] .ypp-typography a {

                text-decoration: underline;
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
                    ...resolveTextStyles(props.heading.styles),
                    color: headingColor,
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
                  {renderResolvedRichText(intro, introRichTextStyleOverrides)}
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
                        <h3
                          className="m-0"
                          style={{ color: cardForegroundColor }}
                        >
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
                            <p
                              className="m-0"
                              style={{ color: cardMutedColor }}
                            >
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
                            statusTemplate={(params: StatusParams) =>
                              renderTranslatedHoursStatus({
                                params,
                                t,
                                locale,
                                showCurrentStatus:
                                  props.hoursStyles.showCurrentStatus,
                                showDayNames: props.hoursStyles.showDayNames,
                                className: "flex flex-wrap items-center gap-1 ",
                                style: { color: cardMutedColor },
                                currentStyle: {
                                  color: cardForegroundColor,
                                },
                              })
                            }
                          />
                        ) : null}
                        <CTA
                          variant={"primary"}
                          label={locationCtaLabel}
                          link={resolvedUrl}
                          normalizeLink={false}
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
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const ProfessionalPracticeCoverageSection: SectionRenderConfig<ProfessionalPracticeCoverageSectionProps> =
  {
    render: (props) => (
      <TypographyScope>
        <ProfessionalPracticeCoverageSectionComponent {...props} />
      </TypographyScope>
    ),
  };
