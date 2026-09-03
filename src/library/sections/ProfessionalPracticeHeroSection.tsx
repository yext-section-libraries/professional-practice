import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { FaClock } from "react-icons/fa";
import {
  ComprehensiveCTA,
  type ComprehensiveCTAValue,
  EntityField,
  getDefaultRTF,
  Image,
  MaybeRTF,
  type StyledImageValue,
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
import {
  AnalyticsScopeProvider,
  type ComplexImageType,
  HoursStatus,
  type HoursType,
  type ImageType,
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

type ProfessionalPracticeHeroSectionProps = {
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


const defaultSurfaceColor: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "palette-quaternary",
};

const defaultStatusBackgroundColor: ThemeColor = {
  selectedColor: "palette-tertiary",
  contrastingColor: "palette-tertiary-contrast",
};

const defaultPrimaryCtaColor: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
};

const defaultSecondaryCtaColor: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "palette-secondary",
};

const heroImageUrl =
  "https://a.mktgcdn.com/p/vQqhmnexQfZueJGyh5M_j5W4EcTkTyZlW93eIoqjjvQ/1900x1267.jpg";

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


const ProfessionalPracticeHeroSectionFields: YextFields<ProfessionalPracticeHeroSectionProps> =
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
    description: {
      label: "Description",
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
    statusPill: {
      label: "Status Pill",
      type: "object",
      objectFields: {
        backgroundColor: {
          label: "Background Color",
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
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
      },
    },
    heroImage: {
      label: "Hero Image",
      type: "object",
      objectFields: {
        image: {
          type: "entityField",
          label: "Image",
          filter: {
            types: ["type.image"],
          },
        },
        aspectRatio: {
          label: "Aspect Ratio",
          type: "number",
        },
        imageConstrain: {
          label: "Image Constrain",
          type: "select",
          options: [
            { label: "Fixed", value: "fixed" },
            { label: "Filled", value: "filled" },
          ],
        },
        styles: {
          label: "Image Styles",
          type: "styledImage",
        },
      },
    },
    primaryCta: {
      label: "Primary Call to Action",
      type: "comprehensiveCTA",
    },
    secondaryCta: {
      label: "Secondary Call to Action",
      type: "comprehensiveCTA",
    },
  };

const ProfessionalPracticeHeroSectionComponent: PuckComponent<ProfessionalPracticeHeroSectionProps> =
  (props) => {
    const streamDocument = useDocument<any>();
    const locale = streamDocument.locale ?? "en";
    const resolvedHeading =
      resolveComponentData(props.heading.text, locale, streamDocument) || "";
    const descriptionRichTextStyleOverrides = {
      color: resolveReadableForegroundColor(props.description.fontColor, props.section.backgroundColor, streamDocument),
    };
    const resolvedDescription = resolveComponentData(
      props.description.text,
      locale,
      streamDocument,
      {
        richTextStyleOverrides: descriptionRichTextStyleOverrides,
      },
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
      color: resolveReadableForegroundColor(props.heading.fontColor, props.section.backgroundColor, streamDocument),
      fontFamily:
        props.heading.styles.fontFamily === "default"
          ? undefined
          : props.heading.styles.fontFamily,
      fontSize:
        props.heading.styles.fontSize === "default"
          ? undefined
          : props.heading.styles.fontSize,
      fontWeight:
        props.heading.styles.fontWeight === "default"
          ? undefined
          : props.heading.styles.fontWeight,
      textTransform:
        props.heading.styles.textTransform === "default"
          ? undefined
          : props.heading.styles.textTransform,
      fontStyle:
        props.heading.styles.fontStyle === "default"
          ? undefined
          : props.heading.styles.fontStyle,
      letterSpacing:
        props.heading.styles.letterSpacing === "default"
          ? "-0.06em"
          : props.heading.styles.letterSpacing,
      lineHeight: 0.95,
    };

    return (
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <AnalyticsScopeProvider
          name={`ProfessionalPracticeHeroSection${getAnalyticsScopeHash(props.id)}`}
        >
          <section
            data-ypp-scope="hero-section"
            style={{
              backgroundColor: resolveThemeColorCssValue(
                props.section.backgroundColor,
              ),
            }}
          >
            <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-4 py-[30px] md:px-8 md:py-[60px] xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(520px,1.15fr)] xl:gap-10 xl:px-20">
              <style>{`
                [data-ypp-scope="hero-section"] .ypp-typography p {
                  font-family: var(--fontFamily-body-fontFamily);
                  font-size: var(--fontSize-body-fontSize);
                  line-height: 1.5;
                  font-weight: var(--fontWeight-body-fontWeight);
                  font-style: var(--fontStyle-body-fontStyle);
                  text-transform: var(--textTransform-body-textTransform);
                }

                [data-ypp-scope="hero-section"] .ypp-typography li {
                  font-family: var(--fontFamily-body-fontFamily);
                  font-size: var(--fontSize-body-fontSize);
                  line-height: 1.5;
                  font-weight: var(--fontWeight-body-fontWeight);
                  font-style: var(--fontStyle-body-fontStyle);
                  text-transform: var(--textTransform-body-textTransform);
                }

                [data-ypp-scope="hero-section"] .ypp-typography h1 {
                  font-family: var(--fontFamily-h1-fontFamily);
                  font-size: var(--fontSize-h1-fontSize);
                  line-height: 1.2;
                  font-weight: var(--fontWeight-h1-fontWeight);
                  font-style: var(--fontStyle-h1-fontStyle);
                  text-transform: var(--textTransform-h1-textTransform);
                }

                [data-ypp-scope="hero-section"] .ypp-typography h2 {
                  font-family: var(--fontFamily-h2-fontFamily);
                  font-size: var(--fontSize-h2-fontSize);
                  line-height: 1.2;
                  font-weight: var(--fontWeight-h2-fontWeight);
                  font-style: var(--fontStyle-h2-fontStyle);
                  text-transform: var(--textTransform-h2-textTransform);
                }

                [data-ypp-scope="hero-section"] .ypp-typography h3 {
                  font-family: var(--fontFamily-h3-fontFamily);
                  font-size: var(--fontSize-h3-fontSize);
                  line-height: 1.2;
                  font-weight: var(--fontWeight-h3-fontWeight);
                  font-style: var(--fontStyle-h3-fontStyle);
                  text-transform: var(--textTransform-h3-textTransform);
                }

                [data-ypp-scope="hero-section"] .ypp-typography h4 {
                  font-family: var(--fontFamily-h4-fontFamily);
                  font-size: var(--fontSize-h4-fontSize);
                  line-height: 1.2;
                  font-weight: var(--fontWeight-h4-fontWeight);
                  font-style: var(--fontStyle-h4-fontStyle);
                  text-transform: var(--textTransform-h4-textTransform);
                }

                [data-ypp-scope="hero-section"] .ypp-typography h5 {
                  font-family: var(--fontFamily-h5-fontFamily);
                  font-size: var(--fontSize-h5-fontSize);
                  line-height: 1.2;
                  font-weight: var(--fontWeight-h5-fontWeight);
                  font-style: var(--fontStyle-h5-fontStyle);
                  text-transform: var(--textTransform-h5-textTransform);
                }

                [data-ypp-scope="hero-section"] .ypp-typography h6 {
                  font-family: var(--fontFamily-h6-fontFamily);
                  font-size: var(--fontSize-h6-fontSize);
                  line-height: 1.2;
                  font-weight: var(--fontWeight-h6-fontWeight);
                  font-style: var(--fontStyle-h6-fontStyle);
                  text-transform: var(--textTransform-h6-textTransform);
                }

                [data-ypp-scope="hero-section"] .ypp-typography a {
                  font-family: var(--fontFamily-link-fontFamily);
                  font-size: var(--fontSize-link-fontSize);
                  font-weight: var(--fontWeight-link-fontWeight);
                  font-style: var(--fontStyle-link-fontStyle);
                  line-height: 1.5;
                  text-decoration: underline;
                  text-transform: var(--textTransform-link-textTransform);
                  letter-spacing: var(--letterSpacing-link-letterSpacing);
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
                    constantValueEnabled={props.heading.text.constantValueEnabled}
                  >
                    <h1 className="m-0" style={headingStyle}>
                      {resolvedHeading}
                    </h1>
                  </EntityField>
                  {resolvedHours && props.statusPill.hoursStyles.showCurrentStatus ? (
                    <div
                      className="inline-flex items-center gap-3 rounded-[6px] px-3 py-2 text-sm font-medium"
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
                            weekday: props.statusPill.hoursStyles.dayOfWeekFormat,
                          }}
                          timeOptions={{
                            hour12: props.statusPill.hoursStyles.timeFormat === "12h",
                          }}
                          statusTemplate={(params: StatusParams) => {
                            const interval = params.isOpen
                              ? params.currentInterval
                              : params.futureInterval;
                            const time = params.isOpen
                              ? interval?.getEndTime(locale, params.timeOptions) ?? ""
                              : interval?.getStartTime(locale, params.timeOptions) ?? "";
                            const dayLabel =
                              props.statusPill.hoursStyles.showDayNames && interval
                                ? params.isOpen
                                  ? interval.end?.setLocale(locale).toLocaleString(
                                      params.dayOptions,
                                    ) ?? ""
                                  : interval.start?.setLocale(locale).toLocaleString(
                                      params.dayOptions,
                                    ) ?? ""
                                : "";

                            if (params.currentInterval?.is24h?.()) {
                              return <span>Open 24 Hours</span>;
                            }

                            if (!params.futureInterval && !params.isOpen) {
                              return <span>Temporarily Closed</span>;
                            }

                            const statusText = params.isOpen ? "Open Now" : "Closed";
                            const futureText = dayLabel
                              ? `${params.isOpen ? "Closes" : "Opens"} at ${time} ${dayLabel}`
                              : `${params.isOpen ? "Closes" : "Opens"} at ${time}`;

                            return (
                              <div className="flex flex-wrap items-center gap-1">
                                <span>{statusText}</span>
                                <span aria-hidden>•</span>
                                <span>{futureText}</span>
                              </div>
                            );
                          }}
                        />
                      </EntityField>
                    </div>
                  ) : null}
                  <EntityField
                    displayName="Description"
                    fieldId={props.description.text.field}
                    constantValueEnabled={props.description.text.constantValueEnabled}
                  >
                    <div className="max-w-[32rem]">
                      {React.isValidElement(resolvedDescription) ? (
                        resolvedDescription
                      ) : (
                        <MaybeRTF
                          data={
                            resolvedDescription as React.ComponentProps<
                              typeof MaybeRTF
                            >["data"]
                          }
                          richTextStyleOverrides={descriptionRichTextStyleOverrides}
                        />
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
                    value={props.secondaryCta as Partial<ComprehensiveCTAValue>}
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
                            (!props.secondaryCta.styles.color?.selectedColor ||
                              props.secondaryCta.styles.color.selectedColor ===
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
                  constantValueEnabled={props.heroImage.image.constantValueEnabled}
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
        </AnalyticsScopeProvider>
      </VisibilityWrapper>
    );
  };

export const ProfessionalPracticeHeroSection: YextComponentConfig<ProfessionalPracticeHeroSectionProps> =
  {
    label: "Hero Section",
    fields: ProfessionalPracticeHeroSectionFields,
    defaultProps: {
      section: {
        backgroundColor: defaultSurfaceColor,
        visibleOnLivePage: true,
      },
      heading: {
        text: {
          field: "name",
          constantValue: "",
          constantValueEnabled: false,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      description: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "Lucky Dog Mobile Spa delivers a stress-free, cage-free luxury grooming experience right to your doorstep. Serving Falls Church, VA and surrounding neighborhoods, our certified groomers combine premium organic products with state-of-the-art mobile vans to keep your pup happy, healthy, and pristine.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontColor: undefined,
      },
      statusPill: {
        backgroundColor: defaultStatusBackgroundColor,
        fontColor: undefined,
        hours: {
          field: "hours",
          constantValue: {} as HoursType,
          constantValueEnabled: false,
        },
        hoursStyles: {
          showCurrentStatus: true,
          timeFormat: "12h",
          dayOfWeekFormat: "long",
          showDayNames: false,
        },
      },
      heroImage: {
        image: {
          field: "",
          constantValue: {
            url: heroImageUrl,
            width: 1900,
            height: 1267,
          },
          constantValueEnabled: true,
        },
        aspectRatio: 1.5,
        imageConstrain: "filled",
        styles: {
          borderRadius: "default",
        },
      },
      primaryCta: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            constantValueEnabled: true,
            constantValue: {
              ctaType: "textAndLink",
              label: { defaultValue: "Book Online Now" },
              link: { defaultValue: "#" },
              linkType: "URL",
            },
            selectedType: "textAndLink",
          },
          openInNewTab: false,
          buttonText: { defaultValue: "Book Online Now" },
          customId: "",
          customClass: "",
          dataAttributes: [],
          ariaLabel: { defaultValue: "Book Online Now" },
        },
        styles: {
          variant: "primary",
          color: defaultPrimaryCtaColor,
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
      secondaryCta: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            constantValueEnabled: true,
            constantValue: {
              ctaType: "textAndLink",
              label: { defaultValue: "View Service Areas & Rates" },
              link: { defaultValue: "#" },
              linkType: "URL",
            },
            selectedType: "textAndLink",
          },
          openInNewTab: false,
          buttonText: { defaultValue: "View Service Areas & Rates" },
          customId: "",
          customClass: "",
          dataAttributes: [],
          ariaLabel: { defaultValue: "View Service Areas & Rates" },
        },
        styles: {
          variant: "secondary",
          color: defaultSecondaryCtaColor,
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
    render: (props) => (
      <ProfessionalPracticeHeroSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeHeroSection",
  displayName: "Hero Section",
  description: "Hero Section",
  pageSetTypes: ["ENTITY"],
};
