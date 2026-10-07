import type { SectionRenderConfig } from "@yext/visual-editor";
import { resolveTextStyles, TypographyScope } from "../shared/typography";
import { useTranslation } from "react-i18next";
import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  msg,
  Background,
  createItemSource,
  EntityField,
  getAnalyticsScopeHash,
  getDefaultRTF,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  resolveComponentData,
  type ThemeColor,
  type TranslatableRichText,
  TimestampAtom,
  TimestampOption,
  useDocument,
  VisibilityWrapper,
  type YextEntityField,
} from "@yext/visual-editor";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  renderResolvedRichText,
  type StyledTextProps,
  type StyledTextValueWithLetterSpacing,
} from "../shared/sectionHelpers";
type TestimonialFields = {
  quote: YextEntityField<TranslatableRichText>;
  name: YextEntityField<string>;
  category: YextEntityField<string>;
  date: YextEntityField<string>;
  endDate: YextEntityField<string>;
};

export const testimonialSource = createItemSource<TestimonialFields>({
  label: msg("fields.testimonials", "Testimonials"),
  mappingFields: {
    quote: {
      type: "entityField",
      label: msg("fields.quote", "Quote"),
      filter: { types: ["type.rich_text_v2"] },
    },
    name: {
      type: "entityField",
      label: msg("fields.name", "Name"),
      filter: { types: ["type.string"] },
    },
    category: {
      type: "entityField",
      label: msg("fields.category", "Category"),
      filter: { types: ["type.string"] },
    },
    date: {
      type: "entityField",
      label: msg("fields.date", "Date"),
      filter: { types: ["type.datetime"] },
    },
    endDate: {
      type: "entityField",
      label: msg("fields.endDate", "End Date"),
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

export type ProfessionalPracticeTestimonialsSectionProps = {
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

const textStyle = (
  styles: StyledTextValueWithLetterSpacing,
  fontColor?: ThemeColor,
): React.CSSProperties => ({
  ...resolveTextStyles(styles),
  color: fontColor ? getThemeColorCssValue(fontColor.selectedColor) : undefined,
});

const ProfessionalPracticeTestimonialsSectionComponent: PuckComponent<
  ProfessionalPracticeTestimonialsSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const { i18n } = useTranslation();
  const locale = i18n.language;
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
                      typeof resolvedName === "string" ? resolvedName : "";
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
                          <span aria-hidden="true" className="">
                            “
                          </span>
                          <EntityField
                            displayName="Quote"
                            fieldId={authoredTestimonial?.quote.field}
                            constantValueEnabled={
                              authoredTestimonial?.quote.constantValueEnabled
                            }
                          >
                            {renderResolvedRichText(quote, quoteStyleOverrides)}
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
                                  endDate={
                                    endDate ? String(endDate) : undefined
                                  }
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

export const ProfessionalPracticeTestimonialsSection: SectionRenderConfig<ProfessionalPracticeTestimonialsSectionProps> =
  {
    render: (props) => (
      <TypographyScope>
        <ProfessionalPracticeTestimonialsSectionComponent {...props} />
      </TypographyScope>
    ),
  };
