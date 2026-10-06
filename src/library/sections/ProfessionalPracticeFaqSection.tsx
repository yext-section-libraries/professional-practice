import { resolveTextStyles, TypographyScope } from "../shared/typography";
import { useTranslation } from "react-i18next";
import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { FaChevronDown } from "react-icons/fa";
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
  useDocument,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import { AnalyticsScopeProvider, useAnalytics } from "@yext/pages-components";
import {
  defaultTextStyles,
  renderResolvedRichText,
  type StyledTextProps,
  type StyledTextValueWithLetterSpacing,
} from "../shared/sectionHelpers";

type FaqItemFields = {
  question: YextEntityField<string>;
  answer: YextEntityField<TranslatableRichText>;
};

const faqItemsSource = createItemSource<FaqItemFields>({
  label: msg("fields.faqs", "FAQs"),
  mappingFields: {
    question: {
      type: "entityField",
      label: msg("fields.question", "Question"),
      filter: { types: ["type.string"] },
    },
    answer: {
      type: "entityField",
      label: msg("fields.answer", "Answer"),
      filter: { types: ["type.rich_text_v2"] },
    },
  },
  defaultValues: [
    [
      "Do you need to plug into my electricity or water supply?",
      "Not at all! Our luxury mobile grooming vans are completely self-sufficient. They are equipped with their own quiet generators, fresh warm water tanks, and gray-water filtration systems.",
    ],
    [
      "What is your policy for aggressive or highly anxious dogs?",
      "Safety is our top priority. We require a brief meet-and-greet for reactive or highly anxious pets so we can tailor handling techniques, session length, and staffing. We never force a dog through a service they cannot tolerate safely.",
    ],
    [
      "How long does a mobile grooming session take?",
      "Most full grooming sessions take between 90 and 150 minutes depending on breed, coat condition, and temperament. We schedule one dog per van at a time so your pet never waits in a kennel.",
    ],
    [
      "What weight limits do you have for mobile grooming?",
      "Our mobile vans safely accommodate dogs up to 75 lbs. For larger breeds, ask about our in-home pampering options or salon waitlist for when our flagship location opens.",
    ],
    [
      "What is your cancellation and rescheduling policy?",
      "You may cancel or reschedule free of charge up to 24 hours before your appointment. Late cancellations may incur a fee so we can hold the time slot for another pet parent.",
    ],
  ].map(([question, answer]) => ({
    question: {
      field: "",
      constantValue: question,
      constantValueEnabled: true,
    },
    answer: {
      field: "",
      constantValue: {
        defaultValue: getDefaultRTF(answer),
        hasLocalizedValue: "true",
      },
      constantValueEnabled: true,
    },
  })),
});

type ProfessionalPracticeFaqSectionProps = {
  section: {
    visibleOnLivePage: boolean;
    backgroundColor: ThemeColor;
  };
  heading: StyledTextProps;
  faqs: {
    data: typeof faqItemsSource.value;
    styles: {
      question: StyledTextValueWithLetterSpacing;
      questionFontColor?: ThemeColor;
      answer: StyledTextValueWithLetterSpacing;
      answerFontColor?: ThemeColor;
    };
  };
};

const ProfessionalPracticeFaqSectionFields: YextFields<ProfessionalPracticeFaqSectionProps> =
  {
    section: {
      label: msg("fields.section", "Section"),
      type: "object",
      objectFields: {
        visibleOnLivePage: {
          label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
        backgroundColor: {
          label: msg("fields.backgroundColor", "Background Color"),
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
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
          filter: { types: ["type.string"] },
        },
        styles: { label: msg("fields.textStyles", "Text Styles"), type: "styledText" },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    faqs: {
      label: msg("fields.faqs", "FAQs"),
      type: "object",
      objectFields: {
        data: faqItemsSource.field,
        styles: {
          label: msg("fields.faqPresentation", "FAQ Presentation"),
          type: "object",
          objectFields: {
            question: { label: msg("fields.questionStyles", "Question Styles"), type: "styledText" },
            questionFontColor: {
              label: msg("fields.questionFontColor", "Question Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
            answer: { label: msg("fields.answerStyles", "Answer Styles"), type: "styledText" },
            answerFontColor: {
              label: msg("fields.answerFontColor", "Answer Font Color"),
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
  fontColor?: ThemeColor,
): React.CSSProperties => ({
  ...resolveTextStyles(styles),
  color: fontColor ? getThemeColorCssValue(fontColor.selectedColor) : undefined,
});

const ProfessionalPracticeFaqSectionComponent: PuckComponent<
  ProfessionalPracticeFaqSectionProps
> = (props) => {
  const analytics = useAnalytics();
  const streamDocument = useDocument();
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const items = faqItemsSource.resolveItems(props.faqs.data, streamDocument);
  const itemResetKey = items
    .map((item, index) => `${index}:${item.question ?? ""}`)
    .join("|");
  const [openIndex, setOpenIndex] = React.useState(items.length ? 0 : -1);

  React.useEffect(() => {
    setOpenIndex(items.length ? 0 : -1);
  }, [itemResetKey, items.length]);

  const heading = resolveComponentData(
    props.heading.text,
    locale,
    streamDocument,
  );
  const authoredItems = props.faqs.data.constantValueEnabled
    ? props.faqs.data.constantValue
    : undefined;

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`ProfessionalPracticeFaqSection${getAnalyticsScopeHash(props.id)}`}
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
                  {heading}
                </h2>
              </EntityField>
              <EntityField
                displayName="FAQs"
                fieldId={props.faqs.data.field}
                constantValueEnabled={props.faqs.data.constantValueEnabled}
              >
                <div>
                  {items.map((item, index) => {
                    const isOpen = openIndex === index;
                    const authoredItem =
                      authoredItems?.[index] ?? props.faqs.data.mappings;
                    const resolvedQuestion = authoredItem?.question
                      ? resolveComponentData(
                          authoredItem.question,
                          locale,
                          streamDocument,
                        )
                      : undefined;
                    const question =
                      typeof resolvedQuestion === "string"
                        ? resolvedQuestion
                        : "";
                    const richTextStyleOverrides = {
                      ...props.faqs.styles.answer,
                      color: props.faqs.styles.answerFontColor,
                    };
                    const answer = authoredItem?.answer
                      ? resolveComponentData(
                          authoredItem.answer,
                          locale,
                          streamDocument,
                        )
                      : undefined;

                    return (
                      <div
                        key={`${question || "faq"}-${index}`}
                        className={`border-current/20 border-b-2 ${index === 0 ? "border-t-2" : ""}`}
                      >
                        <button
                          type="button"
                          className="flex w-full items-start justify-between gap-3 py-10 text-left"
                          onClick={() => {
                            const nextOpen = isOpen ? -1 : index;
                            setOpenIndex(nextOpen);
                            analytics?.track({
                              action:
                                nextOpen === index ? "EXPAND" : "COLLAPSE",
                              eventName: `faqToggle${index}`,
                            });
                          }}
                        >
                          <EntityField
                            displayName="Question"
                            fieldId={authoredItem?.question.field}
                            constantValueEnabled={
                              authoredItem?.question.constantValueEnabled
                            }
                          >
                            <span
                              className="professional-practice-faq-question"
                              style={textStyle(
                                props.faqs.styles.question,
                                props.faqs.styles.questionFontColor,
                              )}
                            >
                              {question}
                            </span>
                          </EntityField>
                          <FaChevronDown
                            aria-hidden="true"
                            className={`mt-0 h-6 w-6 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        {isOpen ? (
                          <EntityField
                            displayName="Answer"
                            fieldId={authoredItem?.answer.field}
                            constantValueEnabled={
                              authoredItem?.answer.constantValueEnabled
                            }
                          >
                            <div className="max-w-[800px] pb-10">
                              {renderResolvedRichText(
                                answer,
                                richTextStyleOverrides,
                              )}
                            </div>
                          </EntityField>
                        ) : null}
                      </div>
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

export const ProfessionalPracticeFaqSection: YextComponentConfig<ProfessionalPracticeFaqSectionProps> =
  {
    label: "FAQ",
    fields: ProfessionalPracticeFaqSectionFields,
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
          constantValue: "Frequently Asked Questions",
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      faqs: {
        data: faqItemsSource.defaultValue,
        styles: {
          question: defaultTextStyles,
          questionFontColor: undefined,
          answer: defaultTextStyles,
          answerFontColor: undefined,
        },
      },
    },
    render: (props) => (
      <TypographyScope>
        <ProfessionalPracticeFaqSectionComponent {...props} />
      </TypographyScope>
    ),
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeFaqSection",
  displayName: "FAQ",
  description: "FAQ Section",
  pageSetTypes: ["ENTITY"],
};
