import type { SectionRenderConfig } from "@yext/visual-editor";
import React from "react";
import { PuckComponent, Slot } from "@puckeditor/core";
import { ThemeColor } from "@yext/visual-editor/section-library-support";
import { Body } from "@yext/visual-editor/section-library-support";
import { MaybeLink } from "@yext/visual-editor/section-library-support";
import { PageSection } from "@yext/visual-editor/section-library-support";
import { CardContextProvider } from "@yext/visual-editor/section-library-support";
import { sortAlphabetically } from "@yext/visual-editor/section-library-support";
import { DirectoryCardProps } from "./DirectoryCard.render";
import { StreamDocument } from "@yext/visual-editor/section-library-support";
import { resolveDirectoryListChildren } from "@yext/visual-editor/section-library-support";
import { getThemeValue } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import {
  DirectoryChildrenProvider,
  getSortedDirectoryChildren,
} from "./directoryChildReference";
import type { createSlottedItemSource } from "@yext/visual-editor/section-library-support";
export type DirectoryGridProps = {
  data: ReturnType<
    typeof createSlottedItemSource<
      DirectoryCardProps["data"],
      DirectoryCardProps
    >
  >["value"];
  styles: {
    backgroundColor?: ThemeColor;
  };
  /** @internal */
  manualSlots?: {
    CardSlot: Slot;
  };
  slots: {
    CardSlot: Slot;
  };
};

export const DirectoryList = ({
  streamDocument,
  directoryChildren,
  relativePrefixToRoot,
  backgroundColor,
  linkColor,
}: {
  streamDocument: StreamDocument;
  directoryChildren: {
    id: string;
    name: string;
    slug: string;
    meta?: {
      entityType?: {
        id: "dm_country" | "dm_region" | "dm_city";
      };
    };
    dm_addressCountryDisplayName?: string;
    dm_addressRegionDisplayName?: string;
  }[];
  relativePrefixToRoot: string;
  backgroundColor: ThemeColor;
  linkColor?: ThemeColor;
}) => {
  const sortedDirectoryChildren = sortAlphabetically(
    [...directoryChildren],
    "name",
  );
  const linkTextTransformValue = (
    getThemeValue("--textTransform-link-textTransform", streamDocument) ?? ""
  ).toLowerCase();
  const shouldTitleCase =
    linkTextTransformValue === "none" || linkTextTransformValue === "normal";

  return (
    <PageSection verticalPadding="sm" background={backgroundColor}>
      <ul className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {sortedDirectoryChildren.map((child, idx) => {
          const childSlug = resolveDirectoryListChildren(streamDocument, child);
          let label;
          switch (child?.meta?.entityType?.id) {
            case "dm_country":
              label = child.dm_addressCountryDisplayName ?? child.name;
              break;
            case "dm_region":
              label = child.dm_addressRegionDisplayName ?? child.name;
              break;
            case "dm_city":
              label = child.name;
              break;
            default:
              label = child.name;
          }

          return (
            <li key={idx}>
              <MaybeLink
                eventName={`child${idx}`}
                variant="directoryLink"
                color={linkColor}
                href={
                  relativePrefixToRoot
                    ? relativePrefixToRoot + childSlug
                    : childSlug
                }
              >
                <Body
                  style={{
                    textTransform: shouldTitleCase
                      ? ("capitalize" as React.CSSProperties["textTransform"])
                      : ("var(--textTransform-link-textTransform)" as React.CSSProperties["textTransform"]),
                  }}
                >
                  {label}
                </Body>
              </MaybeLink>
            </li>
          );
        })}
      </ul>
    </PageSection>
  );
};

const DirectoryGridWrapper: PuckComponent<DirectoryGridProps> = (props) => {
  const { styles, slots } = props;
  const streamDocument = useDocument<StreamDocument>();
  const sortedDirectoryChildren = React.useMemo(
    () => getSortedDirectoryChildren(streamDocument.dm_directoryChildren),
    [streamDocument.dm_directoryChildren],
  );

  return (
    <DirectoryChildrenProvider directoryChildren={sortedDirectoryChildren}>
      <CardContextProvider>
        <PageSection
          verticalPadding="sm"
          background={styles.backgroundColor}
          className={"flex min-h-0 min-w-0 mx-auto"}
        >
          <slots.CardSlot
            className="flex min-h-0 min-w-0 mx-auto flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8"
            allow={[]}
            style={{ height: "auto" }}
          />
        </PageSection>
      </CardContextProvider>
    </DirectoryChildrenProvider>
  );
};

export const DirectoryGrid: SectionRenderConfig<DirectoryGridProps> = {
  // Only structural fields are needed by live Puck rendering.
  fields: {
    slots: { type: "object", objectFields: { CardSlot: { type: "slot" } } },
    manualSlots: {
      type: "object",
      objectFields: { CardSlot: { type: "slot" } },
    },
  } as SectionRenderConfig<DirectoryGridProps>["fields"],
  render: (props) => <DirectoryGridWrapper {...props} />,
};
