import type { SectionRenderConfig } from "@yext/visual-editor";
import { resolveTextStyles, TypographyScope } from "../shared/typography";
import type { PuckComponent } from "@puckeditor/core";
import { useTranslation } from "react-i18next";
import {
  pt,
  EntityField,
  type ThemeColor,
  VisibilityWrapper,
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
  getReadableForegroundColor as resolveReadableForegroundColor,
  type StyledTextProps,
} from "../shared/sectionHelpers";
type BreadcrumbItem = {
  name?: string;
  slug?: string;
};

export type ProfessionalPracticeBreadcrumbsSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  rootLabel: StyledTextProps;
  includeCurrentLocation: boolean;
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
                        <span
                          aria-hidden
                          style={{ color: breadcrumbTextColor }}
                        >
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

export const ProfessionalPracticeBreadcrumbsSection: SectionRenderConfig<ProfessionalPracticeBreadcrumbsSectionProps> =
  {
    render: (props) => (
      <TypographyScope>
        <ProfessionalPracticeBreadcrumbsSectionComponent {...props} />
      </TypographyScope>
    ),
  };
