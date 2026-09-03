import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
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
  type ImageType,
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

type PromoImageProps = {
  image: YextEntityField<ImageType | ComplexImageType>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles?: StyledImageValue;
};

type ProfessionalPracticePromoSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: StyledTextProps;
  body: StyledRtfProps;
  cta: ComprehensiveCTAValue;
  image: PromoImageProps;
};

const sectionColor: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
};

const textColor: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "palette-primary",
};

const lightCtaColor: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "palette-secondary",
};

const promoImageUrl =
  "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg";


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


const ProfessionalPracticePromoSectionFields: YextFields<ProfessionalPracticePromoSectionProps> =
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
    cta: {
      label: "Call to Action",
      type: "comprehensiveCTA",
    },
    image: {
      label: "Image",
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
  };

const ProfessionalPracticePromoSectionComponent: PuckComponent<ProfessionalPracticePromoSectionProps> =
  (props) => {
    const streamDocument = useDocument();
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
    const image = resolveComponentData(
      props.image.image,
      locale,
      streamDocument,
    ) as ImageType | ComplexImageType | undefined;
    const imageBorderRadius =
      !props.image.styles?.borderRadius ||
      props.image.styles.borderRadius === "default"
        ? undefined
        : props.image.styles.borderRadius === "none"
          ? 0
          : props.image.styles.borderRadius;
    const imageWrapperBorderRadius = imageBorderRadius ?? 14;

    return (
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <AnalyticsScopeProvider
          name={`ProfessionalPracticePromoSection${getAnalyticsScopeHash(props.id)}`}
        >
          <section
            data-ypp-scope="promo-section"
            style={{
              backgroundColor: resolveThemeColorCssValue(
                props.section.backgroundColor,
              ),
              color: resolveThemeColorCssValue(textColor),
            }}
          >
            <style>{`
              [data-ypp-scope="promo-section"] .ypp-typography p {
                font-family: var(--fontFamily-body-fontFamily);
                font-size: var(--fontSize-body-fontSize);
                line-height: 1.5;
                font-weight: var(--fontWeight-body-fontWeight);
                font-style: var(--fontStyle-body-fontStyle);
                text-transform: var(--textTransform-body-textTransform);
              }

              [data-ypp-scope="promo-section"] .ypp-typography li {
                font-family: var(--fontFamily-body-fontFamily);
                font-size: var(--fontSize-body-fontSize);
                line-height: 1.5;
                font-weight: var(--fontWeight-body-fontWeight);
                font-style: var(--fontStyle-body-fontStyle);
                text-transform: var(--textTransform-body-textTransform);
              }

              [data-ypp-scope="promo-section"] .ypp-typography h1 {
                font-family: var(--fontFamily-h1-fontFamily);
                font-size: var(--fontSize-h1-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h1-fontWeight);
                font-style: var(--fontStyle-h1-fontStyle);
                text-transform: var(--textTransform-h1-textTransform);
              }

              [data-ypp-scope="promo-section"] .ypp-typography h2 {
                font-family: var(--fontFamily-h2-fontFamily);
                font-size: var(--fontSize-h2-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h2-fontWeight);
                font-style: var(--fontStyle-h2-fontStyle);
                text-transform: var(--textTransform-h2-textTransform);
              }

              [data-ypp-scope="promo-section"] .ypp-typography h3 {
                font-family: var(--fontFamily-h3-fontFamily);
                font-size: var(--fontSize-h3-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h3-fontWeight);
                font-style: var(--fontStyle-h3-fontStyle);
                text-transform: var(--textTransform-h3-textTransform);
              }

              [data-ypp-scope="promo-section"] .ypp-typography h4 {
                font-family: var(--fontFamily-h4-fontFamily);
                font-size: var(--fontSize-h4-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h4-fontWeight);
                font-style: var(--fontStyle-h4-fontStyle);
                text-transform: var(--textTransform-h4-textTransform);
              }

              [data-ypp-scope="promo-section"] .ypp-typography h5 {
                font-family: var(--fontFamily-h5-fontFamily);
                font-size: var(--fontSize-h5-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h5-fontWeight);
                font-style: var(--fontStyle-h5-fontStyle);
                text-transform: var(--textTransform-h5-textTransform);
              }

              [data-ypp-scope="promo-section"] .ypp-typography h6 {
                font-family: var(--fontFamily-h6-fontFamily);
                font-size: var(--fontSize-h6-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h6-fontWeight);
                font-style: var(--fontStyle-h6-fontStyle);
                text-transform: var(--textTransform-h6-textTransform);
              }

              [data-ypp-scope="promo-section"] .ypp-typography a {
                font-family: var(--fontFamily-link-fontFamily);
                font-size: var(--fontSize-link-fontSize);
                font-weight: var(--fontWeight-link-fontWeight);
                font-style: var(--fontStyle-link-fontStyle);
                line-height: 1.5;
                text-decoration: underline;
                text-transform: var(--textTransform-link-textTransform);
                letter-spacing: var(--letterSpacing-link-letterSpacing);
              }

              [data-ypp-scope="promo-section"] .ypp-cta-button {
                transition:
                  background-color 0.2s ease,
                  border-color 0.2s ease,
                  color 0.2s ease,
                  box-shadow 0.2s ease,
                  transform 0.2s ease;
              }

              [data-ypp-scope="promo-section"] .ypp-cta-button:hover,
              [data-ypp-scope="promo-section"] .ypp-cta-button:focus-visible {
                transform: translateY(-1px);
                box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
              }

              [data-ypp-scope="promo-section"] .ypp-cta-button--filled:hover,
              [data-ypp-scope="promo-section"] .ypp-cta-button--filled:focus-visible {
                box-shadow:
                  0 10px 20px rgba(15, 23, 42, 0.12),
                  inset 0 0 0 999px rgba(0, 0, 0, 0.06);
              }

              [data-ypp-scope="promo-section"] .ypp-cta-button--outline:hover,
              [data-ypp-scope="promo-section"] .ypp-cta-button--outline:focus-visible {
                background-color: color-mix(in srgb, currentColor 8%, transparent);
                border-color: currentColor;
                box-shadow:
                  0 10px 20px rgba(15, 23, 42, 0.12),
                  inset 0 0 0 1px currentColor;
              }
            `}</style>
            <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-[30px] md:px-8 md:py-[60px] xl:grid-cols-[minmax(420px,1.2fr)_minmax(0,1fr)] xl:items-center xl:px-20">
              <EntityField
                displayName="Image"
                fieldId={props.image.image.field}
                constantValueEnabled={props.image.image.constantValueEnabled}
              >
                {image ? (
                  <div
                    className="overflow-hidden"
                    style={{ borderRadius: imageWrapperBorderRadius }}
                  >
                    <Image
                      image={image}
                      className="h-full w-full object-cover"
                      style={{
                        aspectRatio:
                          props.image.aspectRatio > 0
                            ? props.image.aspectRatio
                            : undefined,
                        borderRadius: imageBorderRadius,
                        objectFit:
                          props.image.imageConstrain === "filled"
                            ? "cover"
                            : "contain",
                      }}
                    />
                  </div>
                ) : null}
              </EntityField>
              <div className="ypp-typography flex flex-col items-start gap-[30px]">
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
                <div className="max-w-[32rem]">
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
                  displayName="Call to Action"
                  fieldId={props.cta.data.cta.field}
                  constantValueEnabled={props.cta.data.cta.constantValueEnabled}
                >
                <ComprehensiveCTA
                  value={props.cta as Partial<ComprehensiveCTAValue>}
                  eventName="cta"
                  className={`inline-flex min-h-12 items-center justify-center px-4${
                    ["primary", "solid"].includes(props.cta.styles.variant ?? "")
                      ? " ypp-cta-button ypp-cta-button--filled"
                      : ["secondary", "outline"].includes(
                            props.cta.styles.variant ?? "",
                          )
                        ? " ypp-cta-button ypp-cta-button--outline"
                        : ""
                  }`}
                  style={
                    ["primary", "secondary", "solid", "outline"].includes(
                      props.cta.styles.variant ?? "",
                    )
                      ? {
                          textDecoration: "none",
                          ...(["secondary", "outline"].includes(
                            props.cta.styles.variant ?? "",
                          ) &&
                          (!props.cta.styles.color?.selectedColor ||
                            props.cta.styles.color.selectedColor === "default")
                            ? {
                                color: resolveReadableForegroundColor(
                                  undefined,
                                  props.section.backgroundColor,
                                  streamDocument,
                                ),
                              }
                            : {}),
                          ...(["secondary", "outline"].includes(
                            props.cta.styles.variant ?? "",
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
          </section>
        </AnalyticsScopeProvider>
      </VisibilityWrapper>
    );
  };

export const ProfessionalPracticePromoSection: YextComponentConfig<ProfessionalPracticePromoSectionProps> =
  {
    label: "Promo Section",
    fields: ProfessionalPracticePromoSectionFields,
    defaultProps: {
      section: {
        backgroundColor: sectionColor,
        visibleOnLivePage: true,
      },
      heading: {
        text: {
          field: "",
          constantValue: "Join the Clean Pup Club",
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
              "Never worry about booking a last-minute appointment again. Save 15% on every visit and lock in a recurring 4, 6, or 8-week schedule. Members receive priority holiday booking and complimentary teeth brushing.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontColor: undefined,
      },
      cta: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            constantValueEnabled: true,
            constantValue: {
              ctaType: "textAndLink",
              label: { defaultValue: "Join & Save" },
              link: { defaultValue: "#" },
              linkType: "URL",
            },
            selectedType: "textAndLink",
          },
          openInNewTab: false,
          buttonText: { defaultValue: "Join & Save" },
          customId: "",
          customClass: "",
          dataAttributes: [],
          ariaLabel: { defaultValue: "Join & Save" },
        },
        styles: {
          variant: "secondary",
          color: lightCtaColor,
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
      image: {
        image: {
          field: "",
          constantValue: {
            url: promoImageUrl,
            width: 1267,
            height: 1900,
          },
          constantValueEnabled: true,
        },
        aspectRatio: 1.5,
        imageConstrain: "filled",
        styles: {
          borderRadius: "default",
        },
      },
    },
    render: (props) => <ProfessionalPracticePromoSectionComponent {...props} />,
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticePromoSection",
  displayName: "Promo Section",
  description: "Promo Section",
  pageSetTypes: ["ENTITY"],
};
