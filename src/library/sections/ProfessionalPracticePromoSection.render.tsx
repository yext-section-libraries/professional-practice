import type { SectionRenderConfig } from "@yext/visual-editor";
import { resolveTextStyles, TypographyScope } from "../shared/typography";
import { useTranslation } from "react-i18next";
import type { PuckComponent } from "@puckeditor/core";
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
  type ImageType,
} from "@yext/pages-components";
import {
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

export type ProfessionalPracticePromoSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: StyledTextProps;
  body: StyledRtfProps;
  cta: ComprehensiveCTAValue;
  image: PromoImageProps;
};

const textColor: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "palette-primary",
};

const ProfessionalPracticePromoSectionComponent: PuckComponent<
  ProfessionalPracticePromoSectionProps
> = (props) => {
  const streamDocument = useDocument();
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
                    {renderResolvedRichText(body, bodyRichTextStyleOverrides)}
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
                      ["primary", "solid"].includes(
                        props.cta.styles.variant ?? "",
                      )
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
                              props.cta.styles.color.selectedColor ===
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

export const ProfessionalPracticePromoSection: SectionRenderConfig<ProfessionalPracticePromoSectionProps> =
  {
    render: (props) => (
      <TypographyScope>
        <ProfessionalPracticePromoSectionComponent {...props} />
      </TypographyScope>
    ),
  };
