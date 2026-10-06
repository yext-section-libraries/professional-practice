import { resolveTextStyles, TypographyScope } from "../shared/typography";
import { useTranslation } from "react-i18next";
import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  msg,
  ComprehensiveCTA,
  type ComprehensiveCTAValue,
  EntityField,
  getDefaultRTF,
  Image,
  type StyledImageValue,
  type ThemeColor,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
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
  type ImageType,
} from "@yext/pages-components";
import {
  defaultTextStyles,
  getReadableForegroundColor as resolveReadableForegroundColor,
  renderResolvedRichText,
  type StyledRtfProps,
  type StyledTextProps,
} from "../shared/sectionHelpers";

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

const ProfessionalPracticePromoSectionFields: YextFields<ProfessionalPracticePromoSectionProps> =
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
    cta: {
      label: msg("fields.callToAction", "Call to Action"),
      type: "comprehensiveCTA",
    },
    image: {
      label: msg("fields.options.image", "Image"),
      type: "object",
      objectFields: {
        image: {
          type: "entityField",
          label: msg("fields.options.image", "Image"),
          filter: {
            types: ["type.image"],
          },
        },
        aspectRatio: {
          label: msg("fields.options.aspectRatio", "Aspect Ratio"),
          type: "number",
        },
        imageConstrain: {
          label: msg("fields.imageConstrain", "Image Constrain"),
          type: "select",
          options: [
            { label: msg("fields.options.fixed", "Fixed"), value: "fixed" },
            { label: msg("fields.options.filled", "Filled"), value: "filled" },
          ],
        },
        styles: {
          label: msg("fields.imageStyles", "Image Styles"),
          type: "styledImage",
        },
      },
    },
  };

const ProfessionalPracticePromoSectionComponent: PuckComponent<ProfessionalPracticePromoSectionProps> =
  (props) => {
    const streamDocument = useDocument();
    const { i18n } = useTranslation();
    const locale = i18n.language;
    const headingColor = resolveReadableForegroundColor(props.heading.fontColor, props.section.backgroundColor, streamDocument);
    const bodyRichTextStyleOverrides = {
      color: resolveReadableForegroundColor(props.body.fontColor, props.section.backgroundColor, streamDocument),
    };
    const heading =
      resolveComponentData(props.heading.text, locale, streamDocument) || "";
    const body = resolveComponentData(props.body.text, locale, streamDocument);
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
          <Background background={props.section.backgroundColor}>
            <section
              data-ypp-scope="promo-section"
              style={{
                ...getSurfaceColorStyle(
                  props.section.backgroundColor,
                  streamDocument,
                ),
                color: resolveThemeColorCssValue(textColor),
              }}
            >
            <style>{`

              [data-ypp-scope="promo-section"] .ypp-typography a {

                text-decoration: underline;
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
                      ...resolveTextStyles(props.heading.styles),
                      color: headingColor,
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
                    {renderResolvedRichText(
                      body,
                      bodyRichTextStyleOverrides,
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
          </Background>
        </AnalyticsScopeProvider>
      </VisibilityWrapper>
    );
  };

export const ProfessionalPracticePromoSection: YextComponentConfig<ProfessionalPracticePromoSectionProps> =
  {
    label: "Promo",
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
    render: (props) => (
      <TypographyScope>
        <ProfessionalPracticePromoSectionComponent {...props} />
      </TypographyScope>
    ),
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticePromoSection",
  displayName: "Promo",
  description: "Promo Section",
  pageSetTypes: ["ENTITY"],
};
