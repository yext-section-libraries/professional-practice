import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { FaRegStar, FaStar, FaStarHalfAlt, FaUser } from "react-icons/fa";
import {
  EntityField,
  type StyledTextValue,
  type ThemeColor,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  getAggregateRating,
  getAnalyticsScopeHash,
  isDarkColor,
  resolveComponentData,
  useDocument,
} from "@yext/visual-editor";
import { AnalyticsScopeProvider } from "@yext/pages-components";

type StyledTextProps = {
  text: YextEntityField<string>;
  styles: StyledTextValueWithLetterSpacing;
  fontColor?: ThemeColor;
};

type StyledTextValueWithLetterSpacing = StyledTextValue & {
  letterSpacing?: string;
};

type ReviewRecord = {
  authorName?: string;
  rating?: number;
  content?: string;
  reviewDate?: string;
  comments?: Array<{
    content?: string;
    commentDate?: string;
  }>;
};

type ReviewsDocument = {
  locale?: string;
  ref_reviewsAgg?: Array<{
    publisher?: string;
    topReviews?: ReviewRecord[];
  }>;
};

type ProfessionalPracticeReviewsSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  responseBackgroundColor: ThemeColor;
  heading: StyledTextProps;
};

const sectionColor: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "palette-secondary",
};

const defaultIconBackgroundColor: ThemeColor = {
  selectedColor: "palette-quaternary-light",
  contrastingColor: "palette-secondary",
};

const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};

const aggregateReviewTextTemplate =
  "{averageRating} stars from {reviewCount} reviews";
const businessResponseLabel = "Business Response";
const emptyEditorMessage = "No first-party reviews found for this location";

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

const ProfessionalPracticeReviewsSectionFields: YextFields<ProfessionalPracticeReviewsSectionProps> =
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
    responseBackgroundColor: {
      label: "Business Response Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
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
  };

const formatReviewDate = (value: string | undefined, locale: string) => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const formatAggregateReviewText = (
  template: string,
  averageRating: number,
  reviewCount: number,
) =>
  template
    .replaceAll("{averageRating}", String(averageRating))
    .replaceAll("{reviewCount}", String(reviewCount));

const ProfessionalPracticeReviewsSectionComponent: PuckComponent<ProfessionalPracticeReviewsSectionProps> =
  (props) => {
    const streamDocument = useDocument<ReviewsDocument>();
    const locale = streamDocument.locale ?? "en";
    const sectionForegroundColor = resolveReadableForegroundColor(
      undefined,
      props.section.backgroundColor,
      streamDocument,
    );
    const headingColor = resolveReadableForegroundColor(
      props.heading.fontColor,
      props.section.backgroundColor,
      streamDocument,
    );
    const heading =
      resolveComponentData(props.heading.text, locale, streamDocument) || "";
    const { averageRating, reviewCount } = getAggregateRating(streamDocument);
    const roundedAggregateRating = Math.round(averageRating * 2) / 2;
    const responseForegroundColor = resolveReadableForegroundColor(
      undefined,
      props.responseBackgroundColor,
      streamDocument,
    );
    const firstPartyAggregate = streamDocument.ref_reviewsAgg?.find(
      (aggregate) => aggregate.publisher === "FIRSTPARTY",
    );
    const reviews = firstPartyAggregate?.topReviews ?? [];

    if (!reviews.length) {
      if (!props.puck.isEditing) {
        return <></>;
      }

      return (
        <section
          style={{
            backgroundColor: resolveThemeColorCssValue(
              props.section.backgroundColor,
            ),
          }}
        >
          <div
            className="mx-auto max-w-[1280px] px-4 py-[30px] text-base md:px-8 md:py-[60px] xl:px-20"
            style={{ color: sectionForegroundColor }}
          >
            {emptyEditorMessage}
          </div>
        </section>
      );
    }

    return (
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <AnalyticsScopeProvider
          name={`ProfessionalPracticeReviewsSection${getAnalyticsScopeHash(props.id)}`}
        >
          <section
            data-ypp-scope="reviews-section"
            style={{
              backgroundColor: resolveThemeColorCssValue(
                props.section.backgroundColor,
              ),
            }}
          >
            <style>{`
              [data-ypp-scope="reviews-section"] .ypp-typography p {
                font-family: var(--fontFamily-body-fontFamily);
                font-size: var(--fontSize-body-fontSize);
                line-height: 1.5;
                font-weight: var(--fontWeight-body-fontWeight);
                font-style: var(--fontStyle-body-fontStyle);
                text-transform: var(--textTransform-body-textTransform);
              }

              [data-ypp-scope="reviews-section"] .ypp-typography li {
                font-family: var(--fontFamily-body-fontFamily);
                font-size: var(--fontSize-body-fontSize);
                line-height: 1.5;
                font-weight: var(--fontWeight-body-fontWeight);
                font-style: var(--fontStyle-body-fontStyle);
                text-transform: var(--textTransform-body-textTransform);
              }

              [data-ypp-scope="reviews-section"] .ypp-typography h1 {
                font-family: var(--fontFamily-h1-fontFamily);
                font-size: var(--fontSize-h1-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h1-fontWeight);
                font-style: var(--fontStyle-h1-fontStyle);
                text-transform: var(--textTransform-h1-textTransform);
              }

              [data-ypp-scope="reviews-section"] .ypp-typography h2 {
                font-family: var(--fontFamily-h2-fontFamily);
                font-size: var(--fontSize-h2-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h2-fontWeight);
                font-style: var(--fontStyle-h2-fontStyle);
                text-transform: var(--textTransform-h2-textTransform);
              }

              [data-ypp-scope="reviews-section"] .ypp-typography h3 {
                font-family: var(--fontFamily-h3-fontFamily);
                font-size: var(--fontSize-h3-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h3-fontWeight);
                font-style: var(--fontStyle-h3-fontStyle);
                text-transform: var(--textTransform-h3-textTransform);
              }

              [data-ypp-scope="reviews-section"] .ypp-typography h4 {
                font-family: var(--fontFamily-h4-fontFamily);
                font-size: var(--fontSize-h4-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h4-fontWeight);
                font-style: var(--fontStyle-h4-fontStyle);
                text-transform: var(--textTransform-h4-textTransform);
              }

              [data-ypp-scope="reviews-section"] .ypp-typography h5 {
                font-family: var(--fontFamily-h5-fontFamily);
                font-size: var(--fontSize-h5-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h5-fontWeight);
                font-style: var(--fontStyle-h5-fontStyle);
                text-transform: var(--textTransform-h5-textTransform);
              }

              [data-ypp-scope="reviews-section"] .ypp-typography h6 {
                font-family: var(--fontFamily-h6-fontFamily);
                font-size: var(--fontSize-h6-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h6-fontWeight);
                font-style: var(--fontStyle-h6-fontStyle);
                text-transform: var(--textTransform-h6-textTransform);
              }

              [data-ypp-scope="reviews-section"] .ypp-typography a {
                font-family: var(--fontFamily-link-fontFamily);
                font-size: var(--fontSize-link-fontSize);
                font-weight: var(--fontWeight-link-fontWeight);
                font-style: var(--fontStyle-link-fontStyle);
                line-height: 1.5;
                text-decoration: underline;
                text-transform: var(--textTransform-link-textTransform);
                letter-spacing: var(--letterSpacing-link-letterSpacing);
              }
            `}</style>
            <div className="mx-auto flex max-w-[1280px] flex-col gap-[30px] px-4 py-[30px] md:px-8 md:py-[60px] xl:px-20">
              <div className="ypp-typography flex flex-col gap-4">
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
                {averageRating && reviewCount ? (
                  <div
                    className="flex flex-wrap items-center gap-3 text-sm font-medium"
                    style={{ color: sectionForegroundColor }}
                  >
                    <span
                      className="flex items-center gap-0.5"
                      aria-label={`${averageRating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }, (_, index) => {
                        const slotNumber = index + 1;

                        if (roundedAggregateRating >= slotNumber) {
                          return (
                            <FaStar
                              key={`aggregate-full-${index}`}
                              aria-hidden="true"
                              className="h-[12.8px] w-[12.8px] shrink-0"
                            />
                          );
                        }

                        if (roundedAggregateRating >= slotNumber - 0.5) {
                          return (
                            <FaStarHalfAlt
                              key={`aggregate-half-${index}`}
                              aria-hidden="true"
                              className="h-[12.8px] w-[12.8px] shrink-0"
                            />
                          );
                        }

                        return (
                          <FaRegStar
                            key={`aggregate-empty-${index}`}
                            aria-hidden="true"
                            className="h-[12.8px] w-[12.8px] shrink-0"
                          />
                        );
                      })}
                    </span>
                    <span>
                      {formatAggregateReviewText(
                        aggregateReviewTextTemplate,
                        averageRating,
                        reviewCount,
                      )}
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="ypp-typography flex flex-col gap-[30px]">
                {reviews.map((review, index) => {
                  const formattedReviewDate = formatReviewDate(
                    review.reviewDate,
                    locale,
                  );
                  const firstComment = review.comments?.[0];
                  const formattedCommentDate = formatReviewDate(
                    firstComment?.commentDate,
                    locale,
                  );
                  const reviewRating = review.rating;

                  return (
                    <article
                      key={`${review.authorName || "review"}-${index}`}
                      className="flex flex-col gap-4 md:flex-row"
                    >
                      <div
                        className="mt-1 hidden h-[92px] w-[92px] shrink-0 self-start items-center justify-center rounded-[4px] md:flex"
                        style={{
                          backgroundColor: resolveThemeColorCssValue(
                            props.responseBackgroundColor,
                          ),
                          color: responseForegroundColor,
                        }}
                      >
                        <FaUser
                          aria-hidden="true"
                          className="h-5 w-5 text-current"
                        />
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <p
                            className="m-0"
                            style={{
                              color: sectionForegroundColor,
                              fontSize: "20px",
                              fontWeight: 700,
                              lineHeight: "1.2",
                            }}
                          >
                            {review.authorName || "Review"}
                          </p>
                          {formattedReviewDate ? (
                            <p
                              className="m-0"
                              style={{ color: sectionForegroundColor }}
                            >
                              {formattedReviewDate}
                            </p>
                          ) : null}
                        </div>
                        {typeof reviewRating === "number" ? (
                          <div
                            className="flex items-center gap-3 text-[16px] leading-[1.35]"
                            style={{ color: sectionForegroundColor }}
                          >
                            <span
                              className="flex items-center gap-0.5"
                              aria-hidden="true"
                            >
                              {Array.from({ length: 5 }, (_, index) => {
                                const slotNumber = index + 1;

                                if (reviewRating >= slotNumber) {
                                  return (
                                    <FaStar
                                      key={`review-${index}-full-${slotNumber}`}
                                      aria-hidden="true"
                                      className="h-[12.8px] w-[12.8px] shrink-0"
                                    />
                                  );
                                }

                                if (reviewRating >= slotNumber - 0.5) {
                                  return (
                                    <FaStarHalfAlt
                                      key={`review-${index}-half-${slotNumber}`}
                                      aria-hidden="true"
                                      className="h-[12.8px] w-[12.8px] shrink-0"
                                    />
                                  );
                                }

                                return (
                                  <FaRegStar
                                    key={`review-${index}-empty-${slotNumber}`}
                                    aria-hidden="true"
                                    className="h-[12.8px] w-[12.8px] shrink-0"
                                  />
                                );
                              })}
                            </span>
                            <span>{`${reviewRating}/5 stars`}</span>
                          </div>
                        ) : null}
                        {review.content ? (
                          <p
                            className="m-0"
                            style={{
                              color: sectionForegroundColor,
                              fontSize: "18px",
                              lineHeight: "1.35",
                            }}
                          >
                            {review.content}
                          </p>
                        ) : null}
                        {firstComment?.content ? (
                          <div
                            className="flex flex-col gap-2 rounded-[12px] p-4"
                            style={{
                              backgroundColor: resolveThemeColorCssValue(
                                props.responseBackgroundColor,
                              ),
                            }}
                          >
                            <p
                              className="m-0 tracking-[0.08em]"
                              style={{ color: responseForegroundColor }}
                            >
                              {businessResponseLabel}
                            </p>
                            {formattedCommentDate ? (
                              <p
                                className="m-0"
                                style={{ color: responseForegroundColor }}
                              >
                                {formattedCommentDate}
                              </p>
                            ) : null}
                            <p
                              className="m-0"
                              style={{ color: responseForegroundColor }}
                            >
                              {firstComment.content}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        </AnalyticsScopeProvider>
      </VisibilityWrapper>
    );
  };

export const ProfessionalPracticeReviewsSection: YextComponentConfig<ProfessionalPracticeReviewsSectionProps> =
  {
    label: "Reviews Section",
    fields: ProfessionalPracticeReviewsSectionFields,
    defaultProps: {
      section: {
        backgroundColor: sectionColor,
        visibleOnLivePage: true,
      },
      responseBackgroundColor: defaultIconBackgroundColor,
      heading: {
        text: {
          field: "",
          constantValue: "What Local Pet Parents Are Saying",
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
    },
    render: (props) => (
      <ProfessionalPracticeReviewsSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeReviewsSection",
  displayName: "Reviews Section",
  description: "Reviews Section",
  pageSetTypes: ["ENTITY"],
};
