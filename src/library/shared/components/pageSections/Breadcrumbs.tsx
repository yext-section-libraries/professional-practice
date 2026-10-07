import { BreadcrumbsSection as renderConfig } from "./Breadcrumbs.render";
import type { BreadcrumbsSectionProps } from "./Breadcrumbs.render";
export type {
  BreadcrumbsData,
  BreadcrumbsStyles,
  BreadcrumbsSectionProps,
} from "./Breadcrumbs.render";
export { BreadcrumbsComponent } from "./Breadcrumbs.render";
import { msg } from "@yext/visual-editor/section-library-support";
import {
  backgroundColors,
  ThemeOptions,
} from "@yext/visual-editor/section-library-support";
import { setDeep } from "@puckeditor/core";
import { resolveBreadcrumbs } from "@yext/visual-editor/section-library-support";
import {
  toPuckFields,
  YextComponentConfig,
  YextFields,
} from "@yext/visual-editor/section-library-support";
const breadcrumbsSectionFields: YextFields<BreadcrumbsSectionProps> = {
  data: {
    type: "object",
    label: msg("fields.data", "Data"),
    objectFields: {
      directoryRoot: {
        type: "translatableString",
        label: msg(
          "fields.directoryRootLinkLabel",
          "Directory Root Link Label",
        ),
        filter: { types: ["type.string"] },
      },
      currentPage: {
        type: "entityField",
        label: msg("fields.currentPageLinkLabel", "Current Page Link Label"),
        filter: { types: ["type.string"] },
      },
    },
  },
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      backgroundColor: {
        type: "basicSelector",
        label: msg("fields.backgroundColor", "Background Color"),
        options: "BACKGROUND_COLOR",
      },
      linkColor: {
        type: "basicSelector",
        label: msg("fields.linkColor", "Link Color"),
        options: "SITE_COLOR",
      },
      showCurrentPage: {
        label: msg(
          "fields.showCurrentPagesLinkLabel",
          "Show Current Page's Link Label",
        ),
        type: "radio",
        options: ThemeOptions.SHOW_HIDE,
      },
    },
  },
  analytics: {
    type: "object",
    label: msg("fields.analytics", "Analytics"),
    visible: false,
    objectFields: {
      scope: {
        label: msg("fields.scope", "Scope"),
        type: "text",
      },
    },
  },
  liveVisibility: {
    label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
    type: "radio",
    options: [
      { label: msg("fields.options.show", "Show"), value: true },
      { label: msg("fields.options.hide", "Hide"), value: false },
    ],
  },
};

/**
 * The Breadcrumbs component automatically generates and displays a navigational hierarchy based on a page's position within a Yext directory structure. It renders a list of links showing the path from the main directory root to the current page, helping users understand their location on the site.
 * Available on Location templates.
 */
export const BreadcrumbsSection: YextComponentConfig<BreadcrumbsSectionProps> =
  {
    label: msg("components.breadcrumbs", "Breadcrumbs"),
    fields: breadcrumbsSectionFields,
    resolveFields: (_data, params) => {
      const streamDocument = params.metadata?.streamDocument;
      if (!streamDocument) {
        return toPuckFields<BreadcrumbsSectionProps>(breadcrumbsSectionFields);
      }

      // On root pages there is only one breadcrumb, so "currentPage" duplicates "directoryRoot".
      const breadcrumbCount = resolveBreadcrumbs(streamDocument).length;
      return setDeep(
        toPuckFields<BreadcrumbsSectionProps>(breadcrumbsSectionFields),
        "data.objectFields.currentPage.visible",
        breadcrumbCount !== 1,
      );
    },
    defaultProps: {
      data: {
        directoryRoot: { defaultValue: "Directory Root" },
        currentPage: {
          constantValue: { defaultValue: "[[name]]" },
          field: "name",
          constantValueEnabled: false,
        },
      },
      styles: {
        backgroundColor: backgroundColors.background1.value,
        showCurrentPage: true,
      },
      analytics: {
        scope: "breadcrumbs",
      },
      liveVisibility: true,
    },
    render: renderConfig.render,
  };
