import type { SectionRenderConfig } from "@yext/visual-editor";
import { resolveTextStyles, TypographyScope } from "../shared/typography";
import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { FaClock } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import {
  ComprehensiveCTA,
  type ComprehensiveCTAValue,
  EntityField,
  Image,
  type StyledImageValue,
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
import {
  AnalyticsScopeProvider,
  type ComplexImageType,
  HoursStatus,
  type HoursType,
  type ImageType,
  type StatusParams,
} from "@yext/pages-components";
import {
  getReadableForegroundColor as resolveReadableForegroundColor,
  renderResolvedRichText,
  type StyledRtfProps,
  type StyledTextProps,
} from "../shared/sectionHelpers";
import { renderTranslatedHoursStatus } from "../shared/components/TranslatedHoursStatus";
type HeroImageProps = {
  image: YextEntityField<ImageType | ComplexImageType>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles?: StyledImageValue;
};

type HoursStatusFieldProps = {
  hours: YextEntityField<HoursType>;
  hoursStyles: {
    showCurrentStatus: boolean;
    timeFormat: "12h" | "24h";
    dayOfWeekFormat: "short" | "long";
    showDayNames: boolean;
  };
};

export type ProfessionalPracticeHeroSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: StyledTextProps;
  description: StyledRtfProps;
  statusPill: {
    backgroundColor: ThemeColor;
    fontColor?: ThemeColor;
  } & HoursStatusFieldProps;
  heroImage: HeroImageProps;
  primaryCta: ComprehensiveCTAValue;
  secondaryCta: ComprehensiveCTAValue;
};

export const ProfessionalPracticeHeroSectionComponent: PuckComponent<
  ProfessionalPracticeHeroSectionProps
> = (props) => {
  const { t, i18n } = useTranslation();
  const streamDocument = useDocument<any>();
  const locale = i18n.language;
  const resolvedHeading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const descriptionRichTextStyleOverrides = {
    color: resolveReadableForegroundColor(
      props.description.fontColor,
      props.section.backgroundColor,
      streamDocument,
    ),
  };
  const resolvedDescription = resolveComponentData(
    props.description.text,
    locale,
    streamDocument,
  );
  const resolvedHeroImage = resolveComponentData(
    props.heroImage.image,
    locale,
    streamDocument,
  );
  const resolvedHours = resolveComponentData(
    props.statusPill.hours,
    locale,
    streamDocument,
  ) as HoursType | undefined;
  const heroImageValue =
    !resolvedHeroImage ||
    React.isValidElement(resolvedHeroImage) ||
    typeof resolvedHeroImage === "string"
      ? undefined
      : (resolvedHeroImage as unknown as ImageType | ComplexImageType);
  const heroImageBorderRadius =
    !props.heroImage.styles?.borderRadius ||
    props.heroImage.styles.borderRadius === "default"
      ? 14
      : props.heroImage.styles.borderRadius === "none"
        ? 0
        : props.heroImage.styles.borderRadius;
  const heroImageAspectRatio =
    props.heroImage.aspectRatio > 0 ? props.heroImage.aspectRatio : undefined;

  const headingStyle: React.CSSProperties = {
    color: resolveReadableForegroundColor(
      props.heading.fontColor,
      props.section.backgroundColor,
      streamDocument,
    ),
    ...resolveTextStyles(props.heading.styles),
  };

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`ProfessionalPracticeHeroSection${getAnalyticsScopeHash(props.id)}`}
      >
        <Background background={props.section.backgroundColor}>
          <section
            data-ypp-scope="hero-section"
            style={getSurfaceColorStyle(
              props.section.backgroundColor,
              streamDocument,
            )}
          >
            <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-4 py-[30px] md:px-8 md:py-[60px] xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(520px,1.15fr)] xl:gap-10 xl:px-20">
              <style>{`

                [data-ypp-scope="hero-section"] .ypp-typography a {

                  text-decoration: underline;
                }

                [data-ypp-scope="hero-section"] .ypp-cta-button {
                  transition:
                    background-color 0.2s ease,
                    border-color 0.2s ease,
                    color 0.2s ease,
                    box-shadow 0.2s ease,
                    transform 0.2s ease;
                }

                [data-ypp-scope="hero-section"] .ypp-cta-button:hover,
                [data-ypp-scope="hero-section"] .ypp-cta-button:focus-visible {
                  transform: translateY(-1px);
                  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
                }

                [data-ypp-scope="hero-section"] .ypp-cta-button--filled:hover,
                [data-ypp-scope="hero-section"] .ypp-cta-button--filled:focus-visible {
                  box-shadow:
                    0 10px 20px rgba(15, 23, 42, 0.12),
                    inset 0 0 0 999px rgba(0, 0, 0, 0.06);
                }

                [data-ypp-scope="hero-section"] .ypp-cta-button--outline:hover,
                [data-ypp-scope="hero-section"] .ypp-cta-button--outline:focus-visible {
                  background-color: color-mix(in srgb, currentColor 8%, transparent);
                  border-color: currentColor;
                  box-shadow:
                    0 10px 20px rgba(15, 23, 42, 0.12),
                    inset 0 0 0 1px currentColor;
                }
              `}</style>
              <div className="flex flex-col gap-6">
                <div className="ypp-typography flex flex-col items-start gap-6">
                  <EntityField
                    displayName="Heading"
                    fieldId={props.heading.text.field}
                    constantValueEnabled={
                      props.heading.text.constantValueEnabled
                    }
                  >
                    <h1 className="m-0" style={headingStyle}>
                      {resolvedHeading}
                    </h1>
                  </EntityField>
                  {resolvedHours &&
                  props.statusPill.hoursStyles.showCurrentStatus ? (
                    <div
                      className="inline-flex items-center gap-3 rounded-[6px] px-3 py-2"
                      style={{
                        backgroundColor: resolveThemeColorCssValue(
                          props.statusPill.backgroundColor,
                        ),
                        color: resolveReadableForegroundColor(
                          props.statusPill.fontColor,
                          props.statusPill.backgroundColor,
                          streamDocument,
                        ),
                      }}
                    >
                      <FaClock
                        aria-hidden="true"
                        className="h-5 w-5 shrink-0 text-current"
                      />
                      <EntityField
                        displayName="Hours"
                        fieldId={props.statusPill.hours.field}
                        constantValueEnabled={
                          props.statusPill.hours.constantValueEnabled
                        }
                      >
                        <HoursStatus
                          hours={resolvedHours}
                          comingSoon={streamDocument.comingSoon}
                          timezone={streamDocument.timezone}
                          dayOptions={{
                            weekday:
                              props.statusPill.hoursStyles.dayOfWeekFormat,
                          }}
                          timeOptions={{
                            hour12:
                              props.statusPill.hoursStyles.timeFormat === "12h",
                          }}
                          statusTemplate={(params: StatusParams) =>
                            renderTranslatedHoursStatus({
                              params,
                              t,
                              locale,
                              showCurrentStatus:
                                props.statusPill.hoursStyles.showCurrentStatus,
                              showDayNames:
                                props.statusPill.hoursStyles.showDayNames,
                              className: "flex flex-wrap items-center gap-1",
                            })
                          }
                        />
                      </EntityField>
                    </div>
                  ) : null}
                  <EntityField
                    displayName="Description"
                    fieldId={props.description.text.field}
                    constantValueEnabled={
                      props.description.text.constantValueEnabled
                    }
                  >
                    <div className="max-w-[32rem]">
                      {renderResolvedRichText(
                        resolvedDescription,
                        descriptionRichTextStyleOverrides,
                      )}
                    </div>
                  </EntityField>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                  <EntityField
                    displayName="Primary Call to Action"
                    fieldId={props.primaryCta.data.cta.field}
                    constantValueEnabled={
                      props.primaryCta.data.cta.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={props.primaryCta as Partial<ComprehensiveCTAValue>}
                      eventName="primaryCta"
                      className={`inline-flex min-h-12 items-center justify-center px-4${
                        ["primary", "solid"].includes(
                          props.primaryCta.styles.variant ?? "",
                        )
                          ? " ypp-cta-button ypp-cta-button--filled"
                          : ["secondary", "outline"].includes(
                                props.primaryCta.styles.variant ?? "",
                              )
                            ? " ypp-cta-button ypp-cta-button--outline"
                            : ""
                      }`}
                      style={
                        ["primary", "secondary", "solid", "outline"].includes(
                          props.primaryCta.styles.variant ?? "",
                        )
                          ? {
                              textDecoration: "none",
                              ...(["secondary", "outline"].includes(
                                props.primaryCta.styles.variant ?? "",
                              ) &&
                              (!props.primaryCta.styles.color?.selectedColor ||
                                props.primaryCta.styles.color.selectedColor ===
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
                                props.primaryCta.styles.variant ?? "",
                              )
                                ? { borderColor: "currentColor" }
                                : {}),
                            }
                          : undefined
                      }
                    />
                  </EntityField>
                  <EntityField
                    displayName="Secondary Call to Action"
                    fieldId={props.secondaryCta.data.cta.field}
                    constantValueEnabled={
                      props.secondaryCta.data.cta.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={
                        props.secondaryCta as Partial<ComprehensiveCTAValue>
                      }
                      eventName="secondaryCta"
                      className={`inline-flex min-h-12 items-center justify-center px-4${
                        ["primary", "solid"].includes(
                          props.secondaryCta.styles.variant ?? "",
                        )
                          ? " ypp-cta-button ypp-cta-button--filled"
                          : ["secondary", "outline"].includes(
                                props.secondaryCta.styles.variant ?? "",
                              )
                            ? " ypp-cta-button ypp-cta-button--outline"
                            : ""
                      }`}
                      style={
                        ["primary", "secondary", "solid", "outline"].includes(
                          props.secondaryCta.styles.variant ?? "",
                        )
                          ? {
                              textDecoration: "none",
                              ...(["secondary", "outline"].includes(
                                props.secondaryCta.styles.variant ?? "",
                              ) &&
                              (!props.secondaryCta.styles.color
                                ?.selectedColor ||
                                props.secondaryCta.styles.color
                                  .selectedColor === "default")
                                ? {
                                    color: resolveReadableForegroundColor(
                                      undefined,
                                      props.section.backgroundColor,
                                      streamDocument,
                                    ),
                                  }
                                : {}),
                              ...(["secondary", "outline"].includes(
                                props.secondaryCta.styles.variant ?? "",
                              )
                                ? { borderColor: "currentColor" }
                                : {}),
                            }
                          : undefined
                      }
                    />
                  </EntityField>
                </div>
              </div>
              <div
                className="w-full min-w-0 overflow-hidden xl:h-full xl:min-h-[430px]"
                style={{
                  aspectRatio: heroImageAspectRatio,
                  borderRadius: heroImageBorderRadius,
                }}
              >
                <EntityField
                  displayName="Hero Image"
                  fieldId={props.heroImage.image.field}
                  constantValueEnabled={
                    props.heroImage.image.constantValueEnabled
                  }
                >
                  {heroImageValue ? (
                    <Image
                      image={heroImageValue}
                      className="h-full w-full object-cover"
                      style={{
                        aspectRatio: heroImageAspectRatio,
                        borderRadius: heroImageBorderRadius,
                        objectFit:
                          props.heroImage.imageConstrain === "filled"
                            ? "cover"
                            : "contain",
                      }}
                    />
                  ) : null}
                </EntityField>
              </div>
            </div>
          </section>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const ProfessionalPracticeHeroSection: SectionRenderConfig<ProfessionalPracticeHeroSectionProps> =
  {
    render: (props) => (
      <TypographyScope>
        <ProfessionalPracticeHeroSectionComponent {...props} />
      </TypographyScope>
    ),
  };
