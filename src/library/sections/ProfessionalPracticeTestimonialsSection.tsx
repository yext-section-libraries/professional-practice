import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  Background,
  createItemSource,
  EntityField,
  getAnalyticsScopeHash,
  getDefaultRTF,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  MaybeRTF,
  resolveComponentData,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableRichText,
  TimestampAtom,
  TimestampOption,
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

type TestimonialFields = {
  quote: YextEntityField<TranslatableRichText>;
  name: YextEntityField<string>;
  category: YextEntityField<string>;
  date: YextEntityField<string>;
  endDate: YextEntityField<string>;
};

const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};

const testimonialSource = createItemSource<TestimonialFields>({
  label: "Testimonials",
  mappingFields: {
    quote: {
      type: "entityField",
      label: "Quote",
      filter: { types: ["type.rich_text_v2"] },
    },
    name: {
      type: "entityField",
      label: "Name",
      filter: { types: ["type.string"] },
    },
    category: {
      type: "entityField",
      label: "Category",
      filter: { types: ["type.string"] },
    },
    date: {
      type: "entityField",
      label: "Date",
      filter: { types: ["type.datetime"] },
    },
    endDate: {
      type: "entityField",
      label: "End Date",
      filter: { types: ["type.datetime"] },
    },
  },
  defaultValues: [
    [
      "The groomer walked us through the full plan, kept the van spotless, and gave our nervous pup a genuinely calm experience.",
      "Sarah & Ollie",
      "Clean Pup Club",
      "2026-09-10T00:00:00.000Z",
    ],
    [
      "Everything felt polished but never fussy, which makes this section a good match for warm quotes instead of live reviews.",
      "Mia & Winston",
      "Seasonal Client",
      "2026-10-12T00:00:00.000Z",
    ],
    [
      "We appreciate how easy the booking follow-up feels. The experience stays personal from the first text through pickup.",
      "Jordan & Pepper",
      "Recurring Visit",
      "2026-11-03T00:00:00.000Z",
    ],
  ].map(([quote, name, category, date]) => ({
    quote: {
      field: "",
      constantValue: {
        defaultValue: getDefaultRTF(quote),
        hasLocalizedValue: "true",
      },
      constantValueEnabled: true,
    },
    name: { field: "", constantValue: name, constantValueEnabled: true },
    category: {
      field: "",
      constantValue: category,
      constantValueEnabled: true,
    },
    date: { field: "", constantValue: date, constantValueEnabled: true },
    endDate: { field: "", constantValue: "", constantValueEnabled: true },
  })),
});

type ProfessionalPracticeTestimonialsSectionProps = {
  section: {
    visibleOnLivePage: boolean;
    backgroundColor: ThemeColor;
    cardBackgroundColor: ThemeColor;
  };
  heading: StyledTextProps;
  testimonials: {
    data: typeof testimonialSource.value;
    styles: {
      quote: StyledTextValueWithLetterSpacing;
      quoteFontColor?: ThemeColor;
      name: StyledTextValueWithLetterSpacing;
      nameFontColor?: ThemeColor;
      category: StyledTextValueWithLetterSpacing;
      categoryFontColor?: ThemeColor;
      includeTime: boolean;
    };
  };
};

const ProfessionalPracticeTestimonialsSectionFields: YextFields<ProfessionalPracticeTestimonialsSectionProps> =
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
        cardBackgroundColor: {
          label: "Card Background Color",
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
    testimonials: {
      label: "Testimonials",
      type: "object",
      objectFields: {
        data: testimonialSource.field,
        styles: {
          label: "Testimonial Card Presentation",
          type: "object",
          objectFields: {
            quote: { label: "Quote Styles", type: "styledText" },
            quoteFontColor: {
              label: "Quote Font Color",
              type: "basicSelector",
              options: "SITE_COLOR",
            },
            name: { label: "Name Styles", type: "styledText" },
            nameFontColor: {
              label: "Name Font Color",
              type: "basicSelector",
              options: "SITE_COLOR",
            },
            category: { label: "Category Styles", type: "styledText" },
            categoryFontColor: {
              label: "Category Font Color",
              type: "basicSelector",
              options: "SITE_COLOR",
            },
            includeTime: {
              label: "Include Time",
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
  };

const textStyle = (
  styles: StyledTextValueWithLetterSpacing,
  fontColor?: ThemeColor,
): React.CSSProperties => ({
  fontFamily: styles.fontFamily === "default" ? undefined : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? undefined : styles.fontSize,
  fontWeight: styles.fontWeight === "default" ? undefined : styles.fontWeight,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  textTransform:
    styles.textTransform === "default" ? undefined : styles.textTransform,
  letterSpacing:
    styles.letterSpacing === "default" ? undefined : styles.letterSpacing,
  color: fontColor ? getThemeColorCssValue(fontColor.selectedColor) : undefined,
});

const ProfessionalPracticeTestimonialsSectionComponent: PuckComponent<
  ProfessionalPracticeTestimonialsSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const testimonials = testimonialSource.resolveItems(
    props.testimonials.data,
    streamDocument,
  );
  const authoredTestimonials = props.testimonials.data.constantValueEnabled
    ? props.testimonials.data.constantValue
    : undefined;

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`ProfessionalPracticeTestimonialsSection${getAnalyticsScopeHash(props.id)}`}
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
                displayName="Testimonials"
                fieldId={props.testimonials.data.field}
                constantValueEnabled={
                  props.testimonials.data.constantValueEnabled
                }
              >
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {testimonials.map((testimonial, index) => {
                    const authoredTestimonial =
                      authoredTestimonials?.[index] ??
                      props.testimonials.data.mappings;
                    const resolvedName = authoredTestimonial?.name
                      ? resolveComponentData(
                          authoredTestimonial.name,
                          locale,
                          streamDocument,
                        )
                      : undefined;
                    const name =
                      typeof resolvedName === "string"
                        ? resolvedName
                        : "";
                    const resolvedCategory = authoredTestimonial?.category
                      ? resolveComponentData(
                          authoredTestimonial.category,
                          locale,
                          streamDocument,
                        )
                      : undefined;
                    const category =
                      typeof resolvedCategory === "string"
                        ? resolvedCategory
                        : "";
                    const date = authoredTestimonial?.date
                      ? resolveComponentData(
                          authoredTestimonial.date,
                          locale,
                          streamDocument,
                        )
                      : undefined;
                    const endDate = authoredTestimonial?.endDate
                      ? resolveComponentData(
                          authoredTestimonial.endDate,
                          locale,
                          streamDocument,
                        )
                      : undefined;
                    const quoteStyleOverrides = {
                      ...props.testimonials.styles.quote,
                      color: props.testimonials.styles.quoteFontColor,
                    };
                    const quote = authoredTestimonial?.quote
                      ? resolveComponentData(
                          authoredTestimonial.quote,
                          locale,
                          streamDocument,
                          { richTextStyleOverrides: quoteStyleOverrides },
                        )
                      : undefined;
                    const timestampOption = endDate
                      ? props.testimonials.styles.includeTime
                        ? TimestampOption.DATE_TIME_RANGE
                        : TimestampOption.DATE_RANGE
                      : props.testimonials.styles.includeTime
                        ? TimestampOption.DATE_TIME
                        : TimestampOption.DATE;

                    return (
                      <Background
                        key={`${name || "testimonial"}-${index}`}
                        background={props.section.cardBackgroundColor}
                      >
                        <article
                          className="flex h-full flex-col gap-5 rounded-[16px] p-6"
                          style={getSurfaceColorStyle(
                            props.section.cardBackgroundColor,
                            streamDocument,
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className="text-[32px] leading-none"
                          >
                            “
                          </span>
                          <EntityField
                            displayName="Quote"
                            fieldId={authoredTestimonial?.quote.field}
                            constantValueEnabled={
                              authoredTestimonial?.quote.constantValueEnabled
                            }
                          >
                            {typeof quote === "string" ? (
                              <MaybeRTF
                                data={quote}
                                richTextStyleOverrides={quoteStyleOverrides}
                              />
                            ) : React.isValidElement(quote) ? (
                              quote
                            ) : null}
                          </EntityField>
                          <div className="mt-auto flex flex-col gap-1">
                            <EntityField
                              displayName="Name"
                              fieldId={authoredTestimonial?.name.field}
                              constantValueEnabled={
                                authoredTestimonial?.name.constantValueEnabled
                              }
                            >
                              <p
                                className="m-0"
                                style={textStyle(
                                  props.testimonials.styles.name,
                                  props.testimonials.styles.nameFontColor,
                                )}
                              >
                                {name}
                              </p>
                            </EntityField>
                            <EntityField
                              displayName="Category"
                              fieldId={authoredTestimonial?.category.field}
                              constantValueEnabled={
                                authoredTestimonial?.category
                                  .constantValueEnabled
                              }
                            >
                              <p
                                className="m-0"
                                style={textStyle(
                                  props.testimonials.styles.category,
                                  props.testimonials.styles.categoryFontColor,
                                )}
                              >
                                {category}
                              </p>
                            </EntityField>
                            {date ? (
                              <EntityField
                                displayName="Date"
                                fieldId={authoredTestimonial?.date.field}
                                constantValueEnabled={
                                  authoredTestimonial?.date.constantValueEnabled
                                }
                              >
                                <TimestampAtom
                                  date={String(date)}
                                  endDate={endDate ? String(endDate) : undefined}
                                  option={timestampOption}
                                  locale={locale}
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

export const ProfessionalPracticeTestimonialsSection: YextComponentConfig<ProfessionalPracticeTestimonialsSectionProps> =
  {
    label: "Testimonials Section",
    fields: ProfessionalPracticeTestimonialsSectionFields,
    defaultProps: {
      section: {
        visibleOnLivePage: true,
        backgroundColor: {
          selectedColor: "palette-quaternary",
          contrastingColor: "palette-quaternary-contrast",
        },
        cardBackgroundColor: {
          selectedColor: "white",
          contrastingColor: "palette-secondary",
        },
      },
      heading: {
        text: {
          field: "",
          constantValue: "Client Notes Worth Repeating",
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      testimonials: {
        data: testimonialSource.defaultValue,
        styles: {
          quote: defaultTextStyles,
          quoteFontColor: undefined,
          name: defaultTextStyles,
          nameFontColor: undefined,
          category: defaultTextStyles,
          categoryFontColor: undefined,
          includeTime: false,
        },
      },
    },
    render: (props) => (
      <ProfessionalPracticeTestimonialsSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeTestimonialsSection",
  displayName: "Testimonials Section",
  description: "Testimonials Section",
  pageSetTypes: ["ENTITY"],
};
