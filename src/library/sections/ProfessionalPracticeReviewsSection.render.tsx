import type { SectionRenderConfig } from "@yext/visual-editor";
import { resolveTextStyles, TypographyScope } from "../shared/typography";
import type { PuckComponent } from "@puckeditor/core";
import { FaRegStar, FaStar, FaStarHalfAlt, FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import {
  pt,
  EntityField,
  type ThemeColor,
  VisibilityWrapper,
  getAggregateRating,
  Background,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue as resolveThemeColorCssValue,
  resolveComponentData,
  useDocument,
} from "@yext/visual-editor";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  getReadableForegroundColor as resolveReadableForegroundColor,
  type StyledTextProps,
} from "../shared/sectionHelpers";
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

export type ProfessionalPracticeReviewsSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  responseBackgroundColor: ThemeColor;
  heading: StyledTextProps;
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

const ProfessionalPracticeReviewsSectionComponent: PuckComponent<
  ProfessionalPracticeReviewsSectionProps
> = (props) => {
  const { t, i18n } = useTranslation();
  const streamDocument = useDocument<ReviewsDocument>();
  const locale = i18n.language;
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
      <Background background={props.section.backgroundColor}>
        <section
          style={getSurfaceColorStyle(
            props.section.backgroundColor,
            streamDocument,
          )}
        >
          <div
            className="mx-auto max-w-[1280px] px-4 py-[30px] md:px-8 md:py-[60px] xl:px-20"
            style={{ color: sectionForegroundColor }}
          >
            {pt(
              "noFirstPartyReviewsFound",
              "No first-party reviews found for this location",
            )}
          </div>
        </section>
      </Background>
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
        <Background background={props.section.backgroundColor}>
          <section
            data-ypp-scope="reviews-section"
            style={getSurfaceColorStyle(
              props.section.backgroundColor,
              streamDocument,
            )}
          >
            <style>{`

              [data-ypp-scope="reviews-section"] .ypp-typography a {

                text-decoration: underline;
              }
            `}</style>
            <div className="mx-auto flex max-w-[1280px] flex-col gap-[30px] px-4 py-[30px] md:px-8 md:py-[60px] xl:px-20">
              <div className="ypp-typography flex flex-col gap-4">
                <EntityField
                  displayName={pt("heading", "Heading")}
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
                {averageRating && reviewCount ? (
                  <div
                    className="flex flex-wrap items-center gap-3"
                    style={{ color: sectionForegroundColor }}
                  >
                    <span
                      className="flex items-center gap-0.5"
                      aria-label={t(
                        "ratingOutOfFiveStarsAria",
                        "{{rating}} out of 5 stars",
                        { rating: averageRating },
                      )}
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
                      {t(
                        "reviewSummary",
                        "{{averageRating}} stars from {{reviewCount}} reviews",
                        { averageRating, reviewCount },
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
                            }}
                          >
                            {review.authorName || t("reviewLabel", "Review")}
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
                            className="flex items-center gap-3"
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
                            <span>
                              {t("ratingOutOfFiveStars", "{{rating}}/5 stars", {
                                rating: reviewRating,
                              })}
                            </span>
                          </div>
                        ) : null}
                        {review.content ? (
                          <p
                            className="m-0"
                            style={{
                              color: sectionForegroundColor,
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
                              {t("businessResponse", "Business Response")}
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
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const ProfessionalPracticeReviewsSection: SectionRenderConfig<ProfessionalPracticeReviewsSectionProps> =
  {
    render: (props) => (
      <TypographyScope>
        <ProfessionalPracticeReviewsSectionComponent {...props} />
      </TypographyScope>
    ),
  };
