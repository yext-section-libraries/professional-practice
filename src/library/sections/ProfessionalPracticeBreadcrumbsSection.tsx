import { resolveTextStyles, TypographyScope } from "../shared/typography";
import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { useTranslation } from "react-i18next";
import {
  msg,
  pt,
  EntityField,
  type ThemeColor,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextFields,
  Background,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  resolveBreadcrumbs,
  resolveComponentData,
  useDocument,
  useTemplateProps,
} from "@yext/visual-editor";
import { AnalyticsScopeProvider, Link } from "@yext/pages-components";
import {
  defaultTextStyles,
  getReadableForegroundColor as resolveReadableForegroundColor,
  type StyledTextProps,
} from "../shared/sectionHelpers";

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

const ProfessionalPracticeBreadcrumbsSectionFields: YextFields<ProfessionalPracticeBreadcrumbsSectionProps> =
  {
    section: {
      label: msg("fields.section", "Section"),
      type: "object",
      objectFields: {
        backgroundColor: {
          label: msg("fields.backgroundColor", "Background Color"),
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
        visibleOnLivePage: {
          label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
      },
    },
    rootLabel: {
      label: msg("fields.rootLabel", "Root Label"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.options.text", "Text"),
          filter: {
            types: ["type.string"],
          },
        },
        styles: {
          label: msg("fields.textStyles", "Text Styles"),
          type: "styledText",
        },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    includeCurrentLocation: {
      label: msg("fields.includeCurrentLocation", "Include Current Location"),
      type: "radio",
      options: [
        { label: msg("fields.options.yes", "Yes"), value: true },
        { label: msg("fields.options.no", "No"), value: false },
      ],
    },
  };

const ProfessionalPracticeBreadcrumbsSectionComponent: PuckComponent<
  ProfessionalPracticeBreadcrumbsSectionProps
> = (props) => {
    const { t, i18n } = useTranslation();
    const streamDocument = useDocument();
  const { relativePrefixToRoot } = useTemplateProps<{
    relativePrefixToRoot?: string;
  }>();
    const locale = i18n.language;
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
          padding: "18px 24px",
        }}
      >
        {pt(
          "noBreadcrumbsAvailable",
          "No breadcrumbs available (section will be hidden on live page). Create a directory to enable breadcrumbs.",
        )}
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
          <Background background={props.section.backgroundColor}>
            <section
              data-ypp-scope="breadcrumbs-section"
              style={getSurfaceColorStyle(
                props.section.backgroundColor,
                streamDocument,
              )}
            >
            <style>{`

              [data-ypp-scope="breadcrumbs-section"] .ypp-typography a {

                text-decoration: underline;
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
                    ? rootLabel ||
                      breadcrumb.name ||
                      t("allLocations", "All Locations")
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
                                ...resolveTextStyles(props.rootLabel.styles),
                                color: rootLabelColor,
                              }}
                            >
                              {label}
                            </span>
                          ) : (
                            <Link
                              href={href}
                              eventName={`link${index}`}
                              style={{
                                ...resolveTextStyles(props.rootLabel.styles),
                                color: rootLabelColor,
                              }}
                            >
                              {label}
                            </Link>
                          )}
                        </EntityField>
                      ) : isCurrent ? (
                        <span
                          className=""
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
          </Background>
        </AnalyticsScopeProvider>
      </VisibilityWrapper>
    );
  };

export const ProfessionalPracticeBreadcrumbsSection: YextComponentConfig<ProfessionalPracticeBreadcrumbsSectionProps> =
  {
    label: "Breadcrumbs",
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
      <TypographyScope>
        <ProfessionalPracticeBreadcrumbsSectionComponent {...props} />
      </TypographyScope>
    ),
  };

export const config: SectionConfig = {
  id: "ProfessionalPracticeBreadcrumbsSection",
  displayName: "Breadcrumbs",
  description: "Breadcrumbs Section",
  pageSetTypes: ["ENTITY"],
};
