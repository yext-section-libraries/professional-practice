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

type BlogCardFields = {
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

const defaultBlogCtaStyles: ComprehensiveCTAValue["styles"] = {
  variant: "secondary",
  color: { selectedColor: "white", contrastingColor: "palette-secondary" },
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

const blogCardsSource = createItemSource<BlogCardFields>({
  label: "Blog Cards",
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
    {
      imageUrl:
        "https://a.mktgcdn.com/p/Qdlacb36DqN5Lt3q6V9jw-qSMmbPyl_AeMEI_CyDkHc/1267x1900.jpg",
      title: "Dog Coat Care Between Grooms: 5 Tips for Pet Parents",
      description:
        "Prevent painful matting and keep your dog's coat looking fresh between professional visits with these easy, 5-minute brushing habits.",
      ctaLabel: "Read Grooming Guide",
    },
    {
      imageUrl:
        "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
      title: "Understanding the Doodle Coat: How to Pick the Right Trim",
      description:
        "From kennel cuts to teddy bear trims, we break down the most popular Goldendoodle and Labradoodle cuts and how to maintain them.",
      ctaLabel: "Read Article",
    },
  ].map(({ imageUrl, title, description, ctaLabel }) => ({
    image: {
      field: "",
      constantValue: { url: imageUrl, width: 1267, height: 1900 },
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
      styles: defaultBlogCtaStyles,
    },
  })),
});

type ProfessionalPracticeBlogSectionProps = {
  section: { visibleOnLivePage: boolean; backgroundColor: ThemeColor };
  heading: StyledTextProps;
  cards: {
    data: typeof blogCardsSource.value;
    styles: {
      overlayBackgroundColor: ThemeColor;
      image: StyledImageValue;
      imageAspectRatio: number;
      title: StyledTextValueWithLetterSpacing;
      titleFontColor?: ThemeColor;
      description: StyledTextValueWithLetterSpacing;
      descriptionFontColor?: ThemeColor;
    };
  };
};

const ProfessionalPracticeBlogSectionFields: YextFields<ProfessionalPracticeBlogSectionProps> =
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
    cards: {
      label: "Blog Cards",
      type: "object",
      objectFields: {
        data: blogCardsSource.field,
        styles: {
          label: "Card Presentation",
          type: "object",
          objectFields: {
            overlayBackgroundColor: {
              label: "Overlay Background Color",
              type: "basicSelector",
              options: "BACKGROUND_COLOR",
            },
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

const ProfessionalPracticeBlogSectionComponent: PuckComponent<
  ProfessionalPracticeBlogSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const cards = blogCardsSource.resolveItems(props.cards.data, streamDocument);
  const authoredCards = props.cards.data.constantValueEnabled
    ? props.cards.data.constantValue
    : undefined;
  const imageBorderRadius =
    props.cards.styles.image.borderRadius === "default"
      ? "16px"
      : props.cards.styles.image.borderRadius === "none"
        ? 0
        : props.cards.styles.image.borderRadius;

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`ProfessionalPracticeBlogSection${getAnalyticsScopeHash(props.id)}`}
      >
        <Background background={props.section.backgroundColor}>
          <section
            style={getSurfaceColorStyle(
              props.section.backgroundColor,
              streamDocument,
            )}
          >
            <div className="mx-auto flex max-w-[1280px] flex-col gap-[30px] px-4 py-[30px] md:px-8 md:py-[60px] xl:px-20">
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
                displayName="Blog Cards"
                fieldId={props.cards.data.field}
                constantValueEnabled={props.cards.data.constantValueEnabled}
              >
                <div className="grid gap-6 md:grid-cols-2">
                  {cards.map((card, index) => {
                    const authoredCard =
                      authoredCards?.[index] ?? props.cards.data.mappings;
                    const resolvedTitle = authoredCard?.title
                      ? resolveComponentData(
                          authoredCard.title,
                          locale,
                          streamDocument,
                        )
                      : undefined;
                    const title =
                      typeof resolvedTitle === "string"
                        ? resolvedTitle
                        : "";
                    const resolvedImage = authoredCard?.image
                      ? resolveComponentData(
                          authoredCard.image,
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
                    const descriptionOverrides = {
                      ...props.cards.styles.description,
                      color: props.cards.styles.descriptionFontColor,
                    };
                    const description = authoredCard?.description
                      ? resolveComponentData(
                          authoredCard.description,
                          locale,
                          streamDocument,
                          { richTextStyleOverrides: descriptionOverrides },
                        )
                      : undefined;
                    const ctaValue = card.cta as unknown as
                      ComprehensiveCTAValue | undefined;
                    return (
                      <Background
                        key={`${title || "blog"}-${index}`}
                        background={props.cards.styles.overlayBackgroundColor}
                      >
                        <article
                          className="rounded-[16px]"
                          style={getSurfaceColorStyle(
                            props.cards.styles.overlayBackgroundColor,
                            streamDocument,
                          )}
                        >
                          {image ? (
                            <EntityField
                              displayName="Image"
                              fieldId={authoredCard?.image.field}
                              constantValueEnabled={
                                authoredCard?.image.constantValueEnabled
                              }
                            >
                              <Image
                                image={image}
                                className="h-full w-full object-cover"
                                style={{
                                  aspectRatio:
                                    props.cards.styles.imageAspectRatio,
                                  borderRadius: imageBorderRadius,
                                }}
                              />
                            </EntityField>
                          ) : null}
                          <div className="flex flex-col gap-4 p-6">
                            <EntityField
                              displayName="Title"
                              fieldId={authoredCard?.title.field}
                              constantValueEnabled={
                                authoredCard?.title.constantValueEnabled
                              }
                            >
                              <h3
                                className="m-0"
                                style={textStyle(
                                  props.cards.styles.title,
                                  props.cards.styles.titleFontColor,
                                )}
                              >
                                {title}
                              </h3>
                            </EntityField>
                            <EntityField
                              displayName="Description"
                              fieldId={authoredCard?.description.field}
                              constantValueEnabled={
                                authoredCard?.description.constantValueEnabled
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
                                fieldId={authoredCard?.cta.data.cta.field}
                                constantValueEnabled={
                                  authoredCard?.cta.data.cta
                                    .constantValueEnabled
                                }
                              >
                                <ComprehensiveCTA
                                  value={ctaValue}
                                  eventName={`blogCard${index}`}
                                />
                              </EntityField>
                            ) : null}
                          </div>
                        </article>
                      </Background>
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

export const ProfessionalPracticeBlogSection: YextComponentConfig<ProfessionalPracticeBlogSectionProps> =
  {
    label: "Blog Section",
    fields: ProfessionalPracticeBlogSectionFields,
    defaultProps: {
      section: {
        visibleOnLivePage: true,
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "palette-secondary",
        },
      },
      heading: {
        text: {
          field: "",
          constantValue: "From The Grooming Journal",
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      cards: {
        data: blogCardsSource.defaultValue,
        styles: {
          overlayBackgroundColor: {
            selectedColor: "palette-primary",
            contrastingColor: "palette-primary-contrast",
          },
          image: { borderRadius: "default" },
          imageAspectRatio: 1.6,
          title: defaultTextStyles,
          titleFontColor: undefined,
          description: defaultTextStyles,
          descriptionFontColor: undefined,
        },
      },
    },
    render: (props) => (
      <ProfessionalPracticeBlogSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeBlogSection",
  displayName: "Blog Section",
  description: "Blog Section",
  pageSetTypes: ["ENTITY"],
};
