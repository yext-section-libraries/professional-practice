import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  EntityField,
  type StyledTextValue,
  type ThemeColor,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  getAnalyticsScopeHash,
  isDarkColor,
  resolveBreadcrumbs,
  resolveComponentData,
  useDocument,
  useTemplateProps,
} from "@yext/visual-editor";
import { AnalyticsScopeProvider, Link } from "@yext/pages-components";

type StyledTextProps = {
  text: YextEntityField<string>;
  styles: StyledTextValueWithLetterSpacing;
  fontColor?: ThemeColor;
};

type StyledTextValueWithLetterSpacing = StyledTextValue & {
  letterSpacing?: string;
};

type BreadcrumbItem = {
  name?: string;
  slug?: string;
};

type ProfessionalPracticeBreadcrumbsSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  rootLabel: StyledTextProps;
  includeCurrentLocation: boolean;
};

const defaultSectionColor: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "palette-secondary",
};

const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};

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

const ProfessionalPracticeBreadcrumbsSectionFields: YextFields<ProfessionalPracticeBreadcrumbsSectionProps> =
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
    rootLabel: {
      label: "Root Label",
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
    includeCurrentLocation: {
      label: "Include Current Location",
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
  };

const ProfessionalPracticeBreadcrumbsSectionComponent: PuckComponent<
  ProfessionalPracticeBreadcrumbsSectionProps
> = (props) => {
    const streamDocument = useDocument();
  const { relativePrefixToRoot } = useTemplateProps<{
    relativePrefixToRoot?: string;
  }>();
    const locale = streamDocument.locale ?? "en";
  const rootLabelColor = resolveReadableForegroundColor(
    props.rootLabel.fontColor,
    props.section.backgroundColor,
    streamDocument,
  );
    const breadcrumbTextColor = resolveReadableForegroundColor(
      undefined,
      props.section.backgroundColor,
      streamDocument,
    );
    const rootLabel =
      resolveComponentData(props.rootLabel.text, locale, streamDocument) || "";
    const allBreadcrumbs =
      (resolveBreadcrumbs(streamDocument) as BreadcrumbItem[] | undefined) ?? [];
  const breadcrumbs =
    props.includeCurrentLocation || allBreadcrumbs.length <= 1
      ? allBreadcrumbs
      : allBreadcrumbs.slice(0, -1);

    if (!breadcrumbs.length) {
    return props.puck.isEditing ? (
      <p
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "18px 24px",
        }}
      >
        No breadcrumbs available (section will be hidden on live page). Create a
        directory to enable breadcrumbs.
      </p>
    ) : (
      <></>
    );
    }

    return (
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <AnalyticsScopeProvider
          name={`ProfessionalPracticeBreadcrumbsSection${getAnalyticsScopeHash(props.id)}`}
        >
          <section
            data-ypp-scope="breadcrumbs-section"
            style={{
              backgroundColor: resolveThemeColorCssValue(
                props.section.backgroundColor,
              ),
            }}
          >
            <style>{`
              [data-ypp-scope="breadcrumbs-section"] .ypp-typography p {
                font-family: var(--fontFamily-body-fontFamily);
                font-size: var(--fontSize-body-fontSize);
                line-height: 1.5;
                font-weight: var(--fontWeight-body-fontWeight);
                font-style: var(--fontStyle-body-fontStyle);
                text-transform: var(--textTransform-body-textTransform);
              }

              [data-ypp-scope="breadcrumbs-section"] .ypp-typography li {
                font-family: var(--fontFamily-body-fontFamily);
                font-size: var(--fontSize-body-fontSize);
                line-height: 1.5;
                font-weight: var(--fontWeight-body-fontWeight);
                font-style: var(--fontStyle-body-fontStyle);
                text-transform: var(--textTransform-body-textTransform);
              }

              [data-ypp-scope="breadcrumbs-section"] .ypp-typography h1 {
                font-family: var(--fontFamily-h1-fontFamily);
                font-size: var(--fontSize-h1-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h1-fontWeight);
                font-style: var(--fontStyle-h1-fontStyle);
                text-transform: var(--textTransform-h1-textTransform);
              }

              [data-ypp-scope="breadcrumbs-section"] .ypp-typography h2 {
                font-family: var(--fontFamily-h2-fontFamily);
                font-size: var(--fontSize-h2-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h2-fontWeight);
                font-style: var(--fontStyle-h2-fontStyle);
                text-transform: var(--textTransform-h2-textTransform);
              }

              [data-ypp-scope="breadcrumbs-section"] .ypp-typography h3 {
                font-family: var(--fontFamily-h3-fontFamily);
                font-size: var(--fontSize-h3-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h3-fontWeight);
                font-style: var(--fontStyle-h3-fontStyle);
                text-transform: var(--textTransform-h3-textTransform);
              }

              [data-ypp-scope="breadcrumbs-section"] .ypp-typography h4 {
                font-family: var(--fontFamily-h4-fontFamily);
                font-size: var(--fontSize-h4-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h4-fontWeight);
                font-style: var(--fontStyle-h4-fontStyle);
                text-transform: var(--textTransform-h4-textTransform);
              }

              [data-ypp-scope="breadcrumbs-section"] .ypp-typography h5 {
                font-family: var(--fontFamily-h5-fontFamily);
                font-size: var(--fontSize-h5-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h5-fontWeight);
                font-style: var(--fontStyle-h5-fontStyle);
                text-transform: var(--textTransform-h5-textTransform);
              }

              [data-ypp-scope="breadcrumbs-section"] .ypp-typography h6 {
                font-family: var(--fontFamily-h6-fontFamily);
                font-size: var(--fontSize-h6-fontSize);
                line-height: 1.2;
                font-weight: var(--fontWeight-h6-fontWeight);
                font-style: var(--fontStyle-h6-fontStyle);
                text-transform: var(--textTransform-h6-textTransform);
              }

              [data-ypp-scope="breadcrumbs-section"] .ypp-typography a {
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
            <div className="mx-auto max-w-[1280px] px-4 py-4 md:px-8 xl:px-20">
              <ol
                className="ypp-typography m-0 flex flex-wrap items-center gap-2 p-0"
                style={{ color: breadcrumbTextColor }}
              >
                {breadcrumbs.map((breadcrumb, index) => {
                  const isRoot = index === 0;
                  const isCurrent = index === breadcrumbs.length - 1;
                  const label = isRoot
                    ? rootLabel || breadcrumb.name || "All Locations"
                    : isCurrent
                      ? streamDocument.name || breadcrumb.name || ""
                      : breadcrumb.name || "";
                  const href = breadcrumb.slug
                    ? `${relativePrefixToRoot ?? ""}${breadcrumb.slug}`
                    : "";

                  return (
                    <li
                      key={`${breadcrumb.slug || label}-${index}`}
                      className="flex items-center gap-2 list-none"
                    >
                      {index > 0 ? (
                        <span aria-hidden style={{ color: breadcrumbTextColor }}>
                          /
                        </span>
                      ) : null}
                      {isRoot ? (
                        <EntityField
                          displayName="Root Label"
                          fieldId={props.rootLabel.text.field}
                        constantValueEnabled={
                          props.rootLabel.text.constantValueEnabled
                        }
                        >
                          {isCurrent ? (
                            <span
                              style={{
                                fontFamily:
                                  props.rootLabel.styles.fontFamily === "default"
                                    ? undefined
                                    : props.rootLabel.styles.fontFamily,
                                fontSize:
                                  props.rootLabel.styles.fontSize === "default"
                                    ? undefined
                                    : props.rootLabel.styles.fontSize,
                                color: rootLabelColor,
                                fontWeight:
                                  props.rootLabel.styles.fontWeight === "default"
                                    ? undefined
                                    : props.rootLabel.styles.fontWeight,
                                fontStyle:
                                  props.rootLabel.styles.fontStyle === "default"
                                    ? undefined
                                    : props.rootLabel.styles.fontStyle,
                                textTransform:
                                props.rootLabel.styles.textTransform ===
                                "default"
                                    ? undefined
                                    : props.rootLabel.styles.textTransform,
                                letterSpacing:
                                props.rootLabel.styles.letterSpacing ===
                                "default"
                                    ? undefined
                                    : props.rootLabel.styles.letterSpacing,
                              }}
                            >
                              {label}
                            </span>
                          ) : (
                            <Link
                              href={href}
                              eventName={`link${index}`}
                              style={{
                                fontFamily:
                                  props.rootLabel.styles.fontFamily === "default"
                                    ? undefined
                                    : props.rootLabel.styles.fontFamily,
                                fontSize:
                                  props.rootLabel.styles.fontSize === "default"
                                    ? undefined
                                    : props.rootLabel.styles.fontSize,
                                color: rootLabelColor,
                                fontWeight:
                                  props.rootLabel.styles.fontWeight === "default"
                                    ? undefined
                                    : props.rootLabel.styles.fontWeight,
                                fontStyle:
                                  props.rootLabel.styles.fontStyle === "default"
                                    ? undefined
                                    : props.rootLabel.styles.fontStyle,
                                textTransform:
                                props.rootLabel.styles.textTransform ===
                                "default"
                                    ? undefined
                                    : props.rootLabel.styles.textTransform,
                                letterSpacing:
                                props.rootLabel.styles.letterSpacing ===
                                "default"
                                    ? undefined
                                    : props.rootLabel.styles.letterSpacing,
                              }}
                            >
                              {label}
                            </Link>
                          )}
                        </EntityField>
                      ) : isCurrent ? (
                        <span
                          className="font-medium"
                          style={{ color: breadcrumbTextColor }}
                        >
                          {label}
                        </span>
                      ) : (
                        <Link
                          href={href}
                          eventName={`link${index}`}
                          style={{
                            color: breadcrumbTextColor,
                          }}
                        >
                          {label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>
        </AnalyticsScopeProvider>
      </VisibilityWrapper>
    );
  };

export const ProfessionalPracticeBreadcrumbsSection: YextComponentConfig<ProfessionalPracticeBreadcrumbsSectionProps> =
  {
    label: "Breadcrumbs Section",
    fields: ProfessionalPracticeBreadcrumbsSectionFields,
    defaultProps: {
      section: {
        backgroundColor: defaultSectionColor,
        visibleOnLivePage: true,
      },
      rootLabel: {
        text: {
          field: "",
          constantValue: "All Locations",
          constantValueEnabled: true,
        },
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      includeCurrentLocation: true,
    },
    render: (props) => (
      <ProfessionalPracticeBreadcrumbsSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeBreadcrumbsSection",
  displayName: "Breadcrumbs Section",
  description: "Breadcrumbs Section",
  pageSetTypes: ["ENTITY"],
};
