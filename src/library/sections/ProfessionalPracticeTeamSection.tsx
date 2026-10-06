import { resolveTextStyles, TypographyScope } from "../shared/typography";
import { useTranslation } from "react-i18next";
import type { SectionConfig } from "@yext/visual-editor";

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
  Image,
  resolveComponentData,
  type StyledImageValue,
  type ThemeColor,
  type TranslatableAssetImage,
  useDocument,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  defaultTextStyles,
  renderResolvedRichText,
  type StyledRtfWithStylesProps,
  type StyledTextProps,
  type StyledTextValueWithLetterSpacing,
} from "../shared/sectionHelpers";
type TeamMemberFields = {
  image: YextEntityField<TranslatableAssetImage>;
  name: YextEntityField<string>;
  jobTitle: YextEntityField<string>;
};

const teamImageUrls = [
  "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
  "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
  "https://a.mktgcdn.com/p/Qdlacb36DqN5Lt3q6V9jw-qSMmbPyl_AeMEI_CyDkHc/1267x1900.jpg",
];

const teamMembersSource = createItemSource<TeamMemberFields>({
  label: msg("fields.teamMembers", "Team Members"),
  mappingFields: {
    image: {
      type: "entityField",
      label: msg("fields.options.image", "Image"),
      filter: { types: ["type.image"] },
    },
    name: {
      type: "entityField",
      label: msg("fields.name", "Name"),
      filter: { types: ["type.string"] },
    },
    jobTitle: {
      type: "entityField",
      label: msg("fields.jobTitle", "Job Title"),
      filter: { types: ["type.string"] },
    },
  },
  defaultValues: [
    ["Avery Stone", "Lead Groomer"],
    ["Maya Brooks", "Client Care Coordinator"],
    ["Noah Bennett", "Route Operations Lead"],
  ].map(([name, jobTitle], index) => ({
    image: {
      field: "",
      constantValue: { url: teamImageUrls[index], width: 1267, height: 1900 },
      constantValueEnabled: true,
    },
    name: { field: "", constantValue: name, constantValueEnabled: true },
    jobTitle: {
      field: "",
      constantValue: jobTitle,
      constantValueEnabled: true,
    },
  })),
});

type ProfessionalPracticeTeamSectionProps = {
  section: {
    visibleOnLivePage: boolean;
    backgroundColor: ThemeColor;
    cardBackgroundColor: ThemeColor;
  };
  heading: StyledTextProps;
  intro: StyledRtfWithStylesProps;
  members: {
    data: typeof teamMembersSource.value;
    styles: {
      image: StyledImageValue;
      imageAspectRatio: number;
      fallbackAvatarBackgroundColor: ThemeColor;
      name: StyledTextValueWithLetterSpacing;
      nameFontColor?: ThemeColor;
      jobTitle: StyledTextValueWithLetterSpacing;
      jobTitleFontColor?: ThemeColor;
    };
  };
};

const ProfessionalPracticeTeamSectionFields: YextFields<ProfessionalPracticeTeamSectionProps> =
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
        cardBackgroundColor: {
          label: msg("fields.cardBackgroundColor", "Card Background Color"),
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
    intro: {
      label: msg("fields.intro", "Intro"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.options.text", "Text"),
          filter: { types: ["type.rich_text_v2"] },
        },
        styles: { label: msg("fields.textStyles", "Text Styles"), type: "styledText" },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    members: {
      label: msg("fields.teamMembers", "Team Members"),
      type: "object",
      objectFields: {
        data: teamMembersSource.field,
        styles: {
          label: msg("fields.teamCardPresentation", "Team Card Presentation"),
          type: "object",
          objectFields: {
            image: { label: msg("fields.imageStyles", "Image Styles"), type: "styledImage" },
            imageAspectRatio: { label: msg("fields.imageAspectRatio", "Image Aspect Ratio"), type: "number" },
            fallbackAvatarBackgroundColor: {
              label: msg("fields.fallbackAvatarBackgroundColor", "Fallback Avatar Background Color"),
              type: "basicSelector",
              options: "BACKGROUND_COLOR",
            },
            name: { label: msg("fields.nameStyles", "Name Styles"), type: "styledText" },
            nameFontColor: {
              label: msg("fields.nameFontColor", "Name Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
            jobTitle: { label: msg("fields.jobTitleStyles", "Job Title Styles"), type: "styledText" },
            jobTitleFontColor: {
              label: msg("fields.jobTitleFontColor", "Job Title Font Color"),
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
  ...resolveTextStyles(styles),
  color: color ? getThemeColorCssValue(color.selectedColor) : undefined,
});
const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

const ProfessionalPracticeTeamSectionComponent: PuckComponent<
  ProfessionalPracticeTeamSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const members = teamMembersSource.resolveItems(
    props.members.data,
    streamDocument,
  );
  const authoredMembers = props.members.data.constantValueEnabled
    ? props.members.data.constantValue
    : undefined;
  const introOverrides = {
    ...props.intro.styles,
    color: props.intro.fontColor,
  };
  const intro = resolveComponentData(props.intro.text, locale, streamDocument);

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`ProfessionalPracticeTeamSection${getAnalyticsScopeHash(props.id)}`}
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
                {renderResolvedRichText(intro, introOverrides)}
              </EntityField>
              <EntityField
                displayName="Team Members"
                fieldId={props.members.data.field}
                constantValueEnabled={props.members.data.constantValueEnabled}
              >
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {members.map((member, index) => {
                    const authoredMember =
                      authoredMembers?.[index] ?? props.members.data.mappings;
                    const resolvedName = authoredMember?.name
                      ? resolveComponentData(
                          authoredMember.name,
                          locale,
                          streamDocument,
                        )
                      : undefined;
                    const name =
                      typeof resolvedName === "string"
                        ? resolvedName
                        : "";
                    const resolvedJobTitle = authoredMember?.jobTitle
                      ? resolveComponentData(
                          authoredMember.jobTitle,
                          locale,
                          streamDocument,
                        )
                      : undefined;
                    const jobTitle =
                      typeof resolvedJobTitle === "string"
                        ? resolvedJobTitle
                        : "";
                    const resolvedImage = authoredMember?.image
                      ? resolveComponentData(
                          authoredMember.image,
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
                    return (
                      <Background
                        key={`${name || "member"}-${index}`}
                        background={props.section.cardBackgroundColor}
                      >
                        <article
                          className="flex h-full flex-col overflow-hidden rounded-[16px]"
                          style={getSurfaceColorStyle(
                            props.section.cardBackgroundColor,
                            streamDocument,
                          )}
                        >
                          <EntityField
                            displayName="Image"
                            fieldId={authoredMember?.image.field}
                            constantValueEnabled={
                              authoredMember?.image.constantValueEnabled
                            }
                          >
                            {image ? (
                              <Image
                                image={image}
                                className="h-full w-full object-cover"
                                style={{
                                  aspectRatio:
                                    props.members.styles.imageAspectRatio,
                                  borderRadius:
                                    props.members.styles.image.borderRadius ===
                                    "default"
                                      ? undefined
                                      : props.members.styles.image.borderRadius,
                                }}
                              />
                            ) : (
                              <div
                                className="flex aspect-square items-center justify-center"
                                style={getSurfaceColorStyle(
                                  props.members.styles
                                    .fallbackAvatarBackgroundColor,
                                  streamDocument,
                                )}
                              >
                                {getInitials(name)}
                              </div>
                            )}
                          </EntityField>
                          <div className="flex flex-col gap-2 p-6">
                            <EntityField
                              displayName="Name"
                              fieldId={authoredMember?.name.field}
                              constantValueEnabled={
                                authoredMember?.name.constantValueEnabled
                              }
                            >
                              <h3
                                className="m-0"
                                style={textStyle(
                                  props.members.styles.name,
                                  props.members.styles.nameFontColor,
                                )}
                              >
                                {name}
                              </h3>
                            </EntityField>
                            <EntityField
                              displayName="Job Title"
                              fieldId={authoredMember?.jobTitle.field}
                              constantValueEnabled={
                                authoredMember?.jobTitle.constantValueEnabled
                              }
                            >
                              <p
                                className="m-0"
                                style={textStyle(
                                  props.members.styles.jobTitle,
                                  props.members.styles.jobTitleFontColor,
                                )}
                              >
                                {jobTitle}
                              </p>
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

export const ProfessionalPracticeTeamSection: YextComponentConfig<ProfessionalPracticeTeamSectionProps> =
  {
    label: "Team",
    fields: ProfessionalPracticeTeamSectionFields,
    defaultProps: {
      section: {
        visibleOnLivePage: true,
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "palette-secondary",
        },
        cardBackgroundColor: {
          selectedColor: "palette-quaternary",
          contrastingColor: "palette-quaternary-contrast",
        },
      },
      heading: {
        text: {
          field: "",
          constantValue: "Meet The Grooming Team",
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
              "Our experienced team brings calm, detail-oriented care to every appointment.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      members: {
        data: teamMembersSource.defaultValue,
        styles: {
          image: { borderRadius: "default" },
          imageAspectRatio: 1,
          fallbackAvatarBackgroundColor: {
            selectedColor: "palette-primary",
            contrastingColor: "palette-primary-contrast",
          },
          name: defaultTextStyles,
          nameFontColor: undefined,
          jobTitle: defaultTextStyles,
          jobTitleFontColor: undefined,
        },
      },
    },
    render: (props) => (
      <TypographyScope>
        <ProfessionalPracticeTeamSectionComponent {...props} />
      </TypographyScope>
    ),
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeTeamSection",
  displayName: "Team",
  description: "Team Section",
  pageSetTypes: ["ENTITY"],
};
