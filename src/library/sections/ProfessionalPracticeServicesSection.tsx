import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  Background,
  ComprehensiveCTA,
  type ComprehensiveCTAValue,
  createItemSource,
  EntityField,
  getAnalyticsScopeHash,
  getDefaultRTF,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  Image,
  MaybeRTF,
  resolveComponentData,
  type StyledImageValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableRichText,
  useDocument,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import { AnalyticsScopeProvider } from "@yext/pages-components";

type StyledTextValueWithLetterSpacing = StyledTextValue & {
  letterSpacing?: string;
};
type StyledTextProps = {
  text: YextEntityField<string>;
  styles: StyledTextValueWithLetterSpacing;
  fontColor?: ThemeColor;
};
type StyledRtfProps = {
  text: YextEntityField<TranslatableRichText>;
  styles: StyledTextValueWithLetterSpacing;
  fontColor?: ThemeColor;
};
type ServiceFields = {
  image: YextEntityField<TranslatableAssetImage>;
  title: YextEntityField<string>;
  description: YextEntityField<TranslatableRichText>;
  cta: Pick<ComprehensiveCTAValue, "data" | "styles">;
};

const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};
const serviceImages = [
  "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
  "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
  "https://a.mktgcdn.com/p/Qdlacb36DqN5Lt3q6V9jw-qSMmbPyl_AeMEI_CyDkHc/1267x1900.jpg",
];

const defaultServiceCtaStyles: ComprehensiveCTAValue["styles"] = {
  variant: "primary",
  color: {
    selectedColor: "palette-primary",
    contrastingColor: "palette-primary-contrast",
  },
  button: {
    ...defaultTextStyles,
    letterSpacing: "default",
    borderRadius: "12px",
  },
  link: {
    ...defaultTextStyles,
    letterSpacing: "default",
    includeCaret: "default",
  },
};

const serviceCardsSource = createItemSource<ServiceFields>({
  label: "Services",
  mappingFields: {
    image: {
      type: "entityField",
      label: "Image",
      filter: { types: ["type.image"] },
    },
    title: {
      type: "entityField",
      label: "Title",
      filter: { types: ["type.string"] },
    },
    description: {
      type: "entityField",
      label: "Description",
      filter: { types: ["type.rich_text_v2"] },
    },
    cta: {
      label: "Call to Action",
      type: "comprehensiveCTA",
    },
  },
  defaultValues: [
    [
      "The Mobile Spa Package",
      "Our signature door-to-door full service. Includes a deep-cleaning hydro-massage bath, blow dry, full haircut/style to breed standard, nail trim & grind, ear cleaning, and gland expression.",
      "View Pricing",
    ],
    [
      "In-Home Pampering",
      "Perfect for senior dogs or pets with extreme separation anxiety. Our groomers bring portable, sanitized equipment into the comfort of your home to perform baths, deshedding, and nail trims.",
      "Check In-Home Availability",
    ],
    [
      "Pet Spa & Salon (Coming Soon!)",
      "We are expanding! Soon you’ll be able to drop your pup off at our flagship luxury salon for daycare grooming, express nail trims, and premium pet retail shopping.",
      "Join Waitlist",
    ],
  ].map(([title, description, ctaLabel], index) => ({
    image: {
      field: "",
      constantValue: { url: serviceImages[index], width: 1267, height: 1900 },
      constantValueEnabled: true,
    },
    title: { field: "", constantValue: title, constantValueEnabled: true },
    description: {
      field: "",
      constantValue: {
        defaultValue: getDefaultRTF(description),
        hasLocalizedValue: "true",
      },
      constantValueEnabled: true,
    },
    cta: {
      data: {
        actionType: "link",
        cta: {
          field: "",
          constantValue: {
            ctaType: "textAndLink",
            label: { defaultValue: ctaLabel },
            link: { defaultValue: "#" },
            linkType: "URL",
          },
          constantValueEnabled: true,
          selectedType: "textAndLink",
        },
        openInNewTab: false,
      },
      styles: defaultServiceCtaStyles,
    },
  })),
});

type ProfessionalPracticeServicesSectionProps = {
  section: { visibleOnLivePage: boolean; backgroundColor: ThemeColor };
  heading: StyledTextProps;
  intro: StyledRtfProps;
  services: {
    data: typeof serviceCardsSource.value;
    styles: {
      image: StyledImageValue;
      imageAspectRatio: number;
      title: StyledTextValueWithLetterSpacing;
      titleFontColor?: ThemeColor;
      description: StyledTextValueWithLetterSpacing;
      descriptionFontColor?: ThemeColor;
    };
  };
};

const ProfessionalPracticeServicesSectionFields: YextFields<ProfessionalPracticeServicesSectionProps> =
  {
    section: {
      label: "Section",
      type: "object",
      objectFields: {
        visibleOnLivePage: {
          label: "Visible on Live Page",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        backgroundColor: {
          label: "Background Color",
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
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
          filter: { types: ["type.string"] },
        },
        styles: { label: "Text Styles", type: "styledText" },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    intro: {
      label: "Intro",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: { types: ["type.rich_text_v2"] },
        },
        styles: { label: "Text Styles", type: "styledText" },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    services: {
      label: "Services",
      type: "object",
      objectFields: {
        data: serviceCardsSource.field,
        styles: {
          label: "Service Card Presentation",
          type: "object",
          objectFields: {
            image: { label: "Image Styles", type: "styledImage" },
            imageAspectRatio: { label: "Image Aspect Ratio", type: "number" },
            title: { label: "Title Styles", type: "styledText" },
            titleFontColor: {
              label: "Title Font Color",
              type: "basicSelector",
              options: "SITE_COLOR",
            },
            description: { label: "Description Styles", type: "styledText" },
            descriptionFontColor: {
              label: "Description Font Color",
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
      },
    },
  };

const textStyle = (
  styles: StyledTextValueWithLetterSpacing,
  color?: ThemeColor,
): React.CSSProperties => ({
  fontFamily: styles.fontFamily === "default" ? undefined : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? undefined : styles.fontSize,
  fontWeight: styles.fontWeight === "default" ? undefined : styles.fontWeight,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  textTransform:
    styles.textTransform === "default" ? undefined : styles.textTransform,
  letterSpacing:
    styles.letterSpacing === "default" ? undefined : styles.letterSpacing,
  color: color ? getThemeColorCssValue(color.selectedColor) : undefined,
});

const ProfessionalPracticeServicesSectionComponent: PuckComponent<
  ProfessionalPracticeServicesSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const services = serviceCardsSource.resolveItems(
    props.services.data,
    streamDocument,
  );
  const authoredServices = props.services.data.constantValueEnabled
    ? props.services.data.constantValue
    : undefined;
  const introOverrides = {
    ...props.intro.styles,
    color: props.intro.fontColor,
  };
  const intro = resolveComponentData(props.intro.text, locale, streamDocument, {
    richTextStyleOverrides: introOverrides,
  });

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`ProfessionalPracticeServicesSection${getAnalyticsScopeHash(props.id)}`}
      >
        <Background background={props.section.backgroundColor}>
          <section
            style={getSurfaceColorStyle(
              props.section.backgroundColor,
              streamDocument,
            )}
          >
            <div className="mx-auto flex max-w-[1280px] flex-col gap-[30px] px-4 py-[30px] md:px-8 md:py-[60px] xl:px-20">
              <div className="flex max-w-[800px] flex-col gap-4">
                <EntityField
                  displayName="Heading"
                  fieldId={props.heading.text.field}
                  constantValueEnabled={props.heading.text.constantValueEnabled}
                >
                  <h2
                    className="m-0"
                    style={textStyle(
                      props.heading.styles,
                      props.heading.fontColor,
                    )}
                  >
                    {resolveComponentData(
                      props.heading.text,
                      locale,
                      streamDocument,
                    )}
                  </h2>
                </EntityField>
                <EntityField
                  displayName="Intro"
                  fieldId={props.intro.text.field}
                  constantValueEnabled={props.intro.text.constantValueEnabled}
                >
                  {typeof intro === "string" ? (
                    <MaybeRTF
                      data={intro}
                      richTextStyleOverrides={introOverrides}
                    />
                  ) : React.isValidElement(intro) ? (
                    intro
                  ) : null}
                </EntityField>
              </div>
              <EntityField
                displayName="Services"
                fieldId={props.services.data.field}
                constantValueEnabled={props.services.data.constantValueEnabled}
              >
                <div className="grid gap-8 md:grid-cols-3">
                  {services.map((service, index) => {
                    const authoredService =
                      authoredServices?.[index] ?? props.services.data.mappings;
                    const resolvedTitle = authoredService?.title
                      ? resolveComponentData(
                          authoredService.title,
                          locale,
                          streamDocument,
                        )
                      : undefined;
                    const title =
                      typeof resolvedTitle === "string"
                        ? resolvedTitle
                        : "";
                    const descriptionOverrides = {
                      ...props.services.styles.description,
                      color: props.services.styles.descriptionFontColor,
                    };
                    const resolvedImage = authoredService?.image
                      ? resolveComponentData(
                          authoredService.image,
                          locale,
                          streamDocument,
                        )
                      : undefined;
                    const image =
                      !resolvedImage ||
                      React.isValidElement(resolvedImage) ||
                      typeof resolvedImage === "string"
                        ? undefined
                        : (("image" in resolvedImage &&
                            resolvedImage.image &&
                            typeof resolvedImage.image === "object"
                            ? resolvedImage.image
                            : resolvedImage) as TranslatableAssetImage);
                    const description = authoredService?.description
                      ? resolveComponentData(
                          authoredService.description,
                          locale,
                          streamDocument,
                          { richTextStyleOverrides: descriptionOverrides },
                        )
                      : undefined;
                    const ctaValue = service.cta as unknown as
                      ComprehensiveCTAValue | undefined;
                    return (
                      <article
                        key={`${title || "service"}-${index}`}
                        className="flex flex-col gap-6"
                      >
                        {image ? (
                          <EntityField
                            displayName="Image"
                            fieldId={authoredService?.image.field}
                            constantValueEnabled={
                              authoredService?.image.constantValueEnabled
                            }
                          >
                            <Image
                              image={image}
                              className="h-full w-full object-cover"
                              style={{
                                aspectRatio:
                                  props.services.styles.imageAspectRatio,
                                borderRadius:
                                  props.services.styles.image.borderRadius ===
                                  "default"
                                    ? undefined
                                    : props.services.styles.image.borderRadius,
                              }}
                            />
                          </EntityField>
                        ) : null}
                        <div className="flex flex-col items-start gap-3">
                          <EntityField
                            displayName="Title"
                            fieldId={authoredService?.title.field}
                            constantValueEnabled={
                              authoredService?.title.constantValueEnabled
                            }
                          >
                            <h3
                              className="m-0"
                              style={textStyle(
                                props.services.styles.title,
                                props.services.styles.titleFontColor,
                              )}
                            >
                              {title}
                            </h3>
                          </EntityField>
                          <EntityField
                            displayName="Description"
                            fieldId={authoredService?.description.field}
                            constantValueEnabled={
                              authoredService?.description.constantValueEnabled
                            }
                          >
                            {typeof description === "string" ? (
                              <MaybeRTF
                                data={description}
                                richTextStyleOverrides={descriptionOverrides}
                              />
                            ) : React.isValidElement(description) ? (
                              description
                            ) : null}
                          </EntityField>
                          {ctaValue ? (
                            <EntityField
                              displayName="Call to Action"
                              fieldId={authoredService?.cta.data.cta.field}
                              constantValueEnabled={
                                authoredService?.cta.data.cta
                                  .constantValueEnabled
                              }
                            >
                              <ComprehensiveCTA
                                value={ctaValue}
                                eventName={`serviceCta${index}`}
                              />
                            </EntityField>
                          ) : null}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </EntityField>
            </div>
          </section>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const ProfessionalPracticeServicesSection: YextComponentConfig<ProfessionalPracticeServicesSectionProps> =
  {
    label: "Services Section",
    fields: ProfessionalPracticeServicesSectionFields,
    defaultProps: {
      section: {
        visibleOnLivePage: true,
        backgroundColor: {
          selectedColor: "palette-quaternary",
          contrastingColor: "palette-quaternary-contrast",
        },
      },
      heading: {
        text: {
          field: "",
          constantValue: "Our Grooming Services",
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      intro: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "Skip the stressful car rides and chaotic salons. Choose the perfect, personalized care package for your furry family member.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      services: {
        data: serviceCardsSource.defaultValue,
        styles: {
          image: { borderRadius: "default" },
          imageAspectRatio: 0.814,
          title: { ...defaultTextStyles, fontSize: "24px" },
          titleFontColor: undefined,
          description: defaultTextStyles,
          descriptionFontColor: undefined,
        },
      },
    },
    render: (props) => (
      <ProfessionalPracticeServicesSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeServicesSection",
  displayName: "Services Section",
  description: "Services Section",
  pageSetTypes: ["ENTITY"],
};
