import { Directory as renderConfig } from "./Directory.render";
import type { DirectoryProps } from "./Directory.render";
export type { DirectoryStyles, DirectoryProps } from "./Directory.render";
import { backgroundColors } from "@yext/visual-editor/section-library-support";
import { msg } from "@yext/visual-editor/section-library-support";
import { HeadingTextProps } from "../contentBlocks/HeadingText";
import { BreadcrumbsSectionProps } from "../pageSections/Breadcrumbs";
import { setDeep } from "@puckeditor/core";
import { isDirectoryGrid } from "@yext/visual-editor/section-library-support";
import {
  toPuckFields,
  YextComponentConfig,
  YextFields,
} from "@yext/visual-editor/section-library-support";
const directoryFields: YextFields<DirectoryProps> = {
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      backgroundColor: {
        type: "basicSelector",
        label: msg("fields.headingBackgroundColor", "Heading Background Color"),
        options: "BACKGROUND_COLOR",
      },
      listBackgroundColor: {
        type: "basicSelector",
        label: msg(
          "fields.directoryListBackgroundColor",
          "Directory List Background Color",
        ),
        options: "BACKGROUND_COLOR",
      },
      linkColor: {
        type: "basicSelector",
        label: msg("fields.linkColor", "Link Color"),
        options: "SITE_COLOR",
      },
    },
  },
  slots: {
    type: "object",
    objectFields: {
      TitleSlot: { type: "slot", allow: [] },
      SiteNameSlot: { type: "slot", allow: [] },
      BreadcrumbsSlot: { type: "slot", allow: [] },
      DirectoryGrid: { type: "slot", allow: [] },
    },
    visible: false,
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
};

/**
 * The Directory Page component serves as a navigational hub,
 * displaying a list of child entities within a hierarchical structure
 * (e.g., a list of states in a country, or cities in a state).
 * It includes breadcrumbs for easy navigation and renders each child item as a distinct card.
 * Available on Directory templates.
 */
export const Directory: YextComponentConfig<DirectoryProps> = {
  label: msg("components.directory", "Directory"),
  fields: directoryFields,
  resolveFields: (data, params) => {
    if (
      params.metadata.streamDocument?.dm_directoryChildren &&
      isDirectoryGrid(params.metadata.streamDocument.dm_directoryChildren)
    ) {
      const updatedFields = setDeep(
        directoryFields,
        "styles.objectFields.listBackgroundColor.visible",
        false,
      );
      return toPuckFields(
        setDeep(updatedFields, "styles.objectFields.linkColor.visible", false),
      );
    }
    return toPuckFields(directoryFields);
  },
  defaultProps: {
    styles: {
      backgroundColor: backgroundColors.background1.value,
      listBackgroundColor: backgroundColors.background1.value,
    },
    slots: {
      TitleSlot: [
        {
          type: "HeadingTextSlot",
          props: {
            data: {
              text: {
                constantValue: { defaultValue: "" },
                constantValueEnabled: false,
                field: "name",
              },
            },
            styles: { level: 2, align: "center" },
          } satisfies HeadingTextProps,
        },
      ],
      SiteNameSlot: [
        {
          type: "HeadingTextSlot",
          props: {
            data: {
              text: {
                constantValue: { defaultValue: "" },
                constantValueEnabled: true,
                field: "name",
              },
            },
            styles: { level: 4, align: "center" },
          } satisfies HeadingTextProps,
        },
      ],
      BreadcrumbsSlot: [
        {
          type: "BreadcrumbsSlot",
          props: {
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
              scope: "directory",
            },
            liveVisibility: true,
          } satisfies BreadcrumbsSectionProps,
        },
      ],
      DirectoryGrid: [
        {
          type: "DirectoryGrid",
          props: {
            data: {
              field: "dm_directoryChildren",
              constantValueEnabled: false,
              constantValue: [],
              mappings: {
                cardTitle: {
                  field: "name",
                  constantValueEnabled: false,
                  constantValue: undefined,
                },
              },
            },
            styles: {
              backgroundColor: backgroundColors.background1.value,
            },
            slots: {
              CardSlot: [],
            },
          },
        },
      ],
    },
    analytics: {
      scope: "directory",
    },
  },
  render: renderConfig.render,
};
