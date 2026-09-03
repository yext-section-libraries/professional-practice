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
  Image,
  MaybeRTF,
  resolveComponentData,
  type StyledImageValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
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
type StyledRtfProps = {
  text: YextEntityField<TranslatableRichText>;
  styles: StyledTextValueWithLetterSpacing;
  fontColor?: ThemeColor;
};
type EventFields = {
  image: YextEntityField<TranslatableAssetImage>;
  title: YextEntityField<string>;
  description: YextEntityField<TranslatableRichText>;
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
const eventImageUrls = [
  "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
  "https://a.mktgcdn.com/p/Qdlacb36DqN5Lt3q6V9jw-qSMmbPyl_AeMEI_CyDkHc/1267x1900.jpg",
  "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
];

const eventCardsSource = createItemSource<EventFields>({
  label: "Events",
  mappingFields: {
    image: {
      type: "entityField",
      label: "Image",
      filter: { types: ["type.image"] },
    },
    title: {
      type: "entityField",
      label: "Event Name",
      filter: { types: ["type.string"] },
    },
    description: {
      type: "entityField",
      label: "Description",
      filter: { types: ["type.rich_text_v2"] },
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
      "West Falls Bark & Brush Day",
      "A quick-turn grooming stop with light coat refreshes, paw trims, and membership sign-up support.",
      "2026-09-15T10:00:00.000Z",
    ],
    [
      "Clean Pup Club Member Morning",
      "Priority booking windows, low-stimulation appointments, and a calm Q&A with the grooming team.",
      "2026-10-05T09:30:00.000Z",
    ],
    [
      "Holiday Coat Prep Weekend",
      "Great for heavily shedding coats that need a tidy reset before family gatherings and travel.",
      "2026-11-21T11:00:00.000Z",
    ],
  ].map(([title, description, date], index) => ({
    image: {
      field: "",
      constantValue: { url: eventImageUrls[index], width: 1267, height: 1900 },
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
    date: { field: "", constantValue: date, constantValueEnabled: true },
    endDate: { field: "", constantValue: "", constantValueEnabled: true },
  })),
});

type ProfessionalPracticeEventsSectionProps = {
  section: {
    visibleOnLivePage: boolean;
    backgroundColor: ThemeColor;
    cardBackgroundColor: ThemeColor;
  };
  heading: StyledTextProps;
  intro: StyledRtfProps;
  events: {
    data: typeof eventCardsSource.value;
    styles: {
      image: StyledImageValue;
      imageAspectRatio: number;
      title: StyledTextValueWithLetterSpacing;
      titleFontColor?: ThemeColor;
      description: StyledTextValueWithLetterSpacing;
      descriptionFontColor?: ThemeColor;
      includeTime: boolean;
    };
  };
};

const ProfessionalPracticeEventsSectionFields: YextFields<ProfessionalPracticeEventsSectionProps> =
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
    events: {
      label: "Events",
      type: "object",
      objectFields: {
        data: eventCardsSource.field,
        styles: {
          label: "Event Card Presentation",
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

const ProfessionalPracticeEventsSectionComponent: PuckComponent<
  ProfessionalPracticeEventsSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const events = eventCardsSource.resolveItems(
    props.events.data,
    streamDocument,
  );
  const authoredEvents = props.events.data.constantValueEnabled
    ? props.events.data.constantValue
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
        name={`ProfessionalPracticeEventsSection${getAnalyticsScopeHash(props.id)}`}
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
              <EntityField
                displayName="Events"
                fieldId={props.events.data.field}
                constantValueEnabled={props.events.data.constantValueEnabled}
              >
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {events.map((event, index) => {
                    const authoredEvent =
                      authoredEvents?.[index] ?? props.events.data.mappings;
                    const resolvedTitle = authoredEvent?.title
                      ? resolveComponentData(
                          authoredEvent.title,
                          locale,
                          streamDocument,
                        )
                      : undefined;
                    const title =
                      typeof resolvedTitle === "string"
                        ? resolvedTitle
                        : "";
                    const date = authoredEvent?.date
                      ? resolveComponentData(
                          authoredEvent.date,
                          locale,
                          streamDocument,
                        )
                      : undefined;
                    const endDate = authoredEvent?.endDate
                      ? resolveComponentData(
                          authoredEvent.endDate,
                          locale,
                          streamDocument,
                        )
                      : undefined;
                    const resolvedImage = authoredEvent?.image
                      ? resolveComponentData(
                          authoredEvent.image,
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
                      ...props.events.styles.description,
                      color: props.events.styles.descriptionFontColor,
                    };
                    const description = authoredEvent?.description
                      ? resolveComponentData(
                          authoredEvent.description,
                          locale,
                          streamDocument,
                          { richTextStyleOverrides: descriptionOverrides },
                        )
                      : undefined;
                    const timestampOption = endDate
                      ? props.events.styles.includeTime
                        ? TimestampOption.DATE_TIME_RANGE
                        : TimestampOption.DATE_RANGE
                      : props.events.styles.includeTime
                        ? TimestampOption.DATE_TIME
                        : TimestampOption.DATE;
                    return (
                      <Background
                        key={`${title || "event"}-${index}`}
                        background={props.section.cardBackgroundColor}
                      >
                        <article
                          className="flex h-full flex-col overflow-hidden rounded-[16px]"
                          style={getSurfaceColorStyle(
                            props.section.cardBackgroundColor,
                            streamDocument,
                          )}
                        >
                          {image ? (
                            <EntityField
                              displayName="Image"
                              fieldId={authoredEvent?.image.field}
                              constantValueEnabled={
                                authoredEvent?.image.constantValueEnabled
                              }
                            >
                              <Image
                                image={image}
                                className="h-full w-full object-cover"
                                style={{
                                  aspectRatio:
                                    props.events.styles.imageAspectRatio,
                                  borderRadius:
                                    props.events.styles.image.borderRadius ===
                                    "default"
                                      ? undefined
                                      : props.events.styles.image.borderRadius,
                                }}
                              />
                            </EntityField>
                          ) : null}
                          <div className="flex flex-1 flex-col gap-4 p-6">
                            {date ? (
                              <EntityField
                                displayName="Date"
                                fieldId={authoredEvent?.date.field}
                                constantValueEnabled={
                                  authoredEvent?.date.constantValueEnabled
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
                            <EntityField
                              displayName="Event Name"
                              fieldId={authoredEvent?.title.field}
                              constantValueEnabled={
                                authoredEvent?.title.constantValueEnabled
                              }
                            >
                              <h3
                                className="m-0"
                                style={textStyle(
                                  props.events.styles.title,
                                  props.events.styles.titleFontColor,
                                )}
                              >
                                {title}
                              </h3>
                            </EntityField>
                            <EntityField
                              displayName="Description"
                              fieldId={authoredEvent?.description.field}
                              constantValueEnabled={
                                authoredEvent?.description.constantValueEnabled
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

export const ProfessionalPracticeEventsSection: YextComponentConfig<ProfessionalPracticeEventsSectionProps> =
  {
    label: "Events Section",
    fields: ProfessionalPracticeEventsSectionFields,
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
          constantValue: "Upcoming Grooming Events",
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
              "Join us for seasonal grooming events and member-only appointment windows.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      events: {
        data: eventCardsSource.defaultValue,
        styles: {
          image: { borderRadius: "default" },
          imageAspectRatio: 1.25,
          title: defaultTextStyles,
          titleFontColor: undefined,
          description: defaultTextStyles,
          descriptionFontColor: undefined,
          includeTime: true,
        },
      },
    },
    render: (props) => (
      <ProfessionalPracticeEventsSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeEventsSection",
  displayName: "Events Section",
  description: "Events Section",
  pageSetTypes: ["ENTITY"],
};
