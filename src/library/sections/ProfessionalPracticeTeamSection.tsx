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
type TeamMemberFields = {
  image: YextEntityField<TranslatableAssetImage>;
  name: YextEntityField<string>;
  jobTitle: YextEntityField<string>;
};

const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};
const teamImageUrls = [
  "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
  "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
  "https://a.mktgcdn.com/p/Qdlacb36DqN5Lt3q6V9jw-qSMmbPyl_AeMEI_CyDkHc/1267x1900.jpg",
];

const teamMembersSource = createItemSource<TeamMemberFields>({
  label: "Team Members",
  mappingFields: {
    image: {
      type: "entityField",
      label: "Image",
      filter: { types: ["type.image"] },
    },
    name: {
      type: "entityField",
      label: "Name",
      filter: { types: ["type.string"] },
    },
    jobTitle: {
      type: "entityField",
      label: "Job Title",
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
  intro: StyledRtfProps;
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
    members: {
      label: "Team Members",
      type: "object",
      objectFields: {
        data: teamMembersSource.field,
        styles: {
          label: "Team Card Presentation",
          type: "object",
          objectFields: {
            image: { label: "Image Styles", type: "styledImage" },
            imageAspectRatio: { label: "Image Aspect Ratio", type: "number" },
            fallbackAvatarBackgroundColor: {
              label: "Fallback Avatar Background Color",
              type: "basicSelector",
              options: "BACKGROUND_COLOR",
            },
            name: { label: "Name Styles", type: "styledText" },
            nameFontColor: {
              label: "Name Font Color",
              type: "basicSelector",
              options: "SITE_COLOR",
            },
            jobTitle: { label: "Job Title Styles", type: "styledText" },
            jobTitleFontColor: {
              label: "Job Title Font Color",
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
  const locale = streamDocument.locale ?? "en";
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
  const intro = resolveComponentData(props.intro.text, locale, streamDocument, {
    richTextStyleOverrides: introOverrides,
  });

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
                                className="flex aspect-square items-center justify-center text-4xl font-semibold"
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
    label: "Team Section",
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
      <ProfessionalPracticeTeamSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeTeamSection",
  displayName: "Team Section",
  description: "Team Section",
  pageSetTypes: ["ENTITY"],
};
