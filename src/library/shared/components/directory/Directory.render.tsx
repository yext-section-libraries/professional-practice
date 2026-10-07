import type { SectionRenderConfig } from "@yext/visual-editor";
import { useTemplateProps } from "@yext/visual-editor/section-library-support";
import { ThemeColor } from "@yext/visual-editor/section-library-support";
import { PageSection } from "@yext/visual-editor/section-library-support";
import { Background } from "@yext/visual-editor/section-library-support";
import { PuckComponent, Slot } from "@puckeditor/core";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import { DirectoryList } from "./DirectoryWrapper.render";
import { isDirectoryGrid } from "@yext/visual-editor/section-library-support";
export interface DirectoryStyles {
  /**
   * The background color for the directory page heading area.
   * @defaultValue Background Color 1
   */
  backgroundColor: ThemeColor;

  /**
   * The background color for the directory list area.
   * @defaultValue Background Color 1
   */
  listBackgroundColor: ThemeColor;

  /**
   * The color of links in the directory list layout.
   */
  linkColor?: ThemeColor;
}

export interface DirectoryProps {
  /**
   * This object contains properties for customizing the component's appearance.
   * @propCategory Style Props
   */
  styles: DirectoryStyles;

  /** @internal */
  slots: {
    TitleSlot: Slot;
    SiteNameSlot: Slot;
    BreadcrumbsSlot: Slot;
    DirectoryGrid: Slot;
  };

  /** @internal */
  analytics: {
    scope?: string;
  };
}

const DirectoryComponent: PuckComponent<DirectoryProps> = ({
  styles,
  slots,
}) => {
  const { document: streamDocument, relativePrefixToRoot } = useTemplateProps();

  return (
    <Background background={styles.backgroundColor}>
      <slots.BreadcrumbsSlot style={{ height: "auto" }} />
      <PageSection className="flex flex-col items-center gap-2">
        <slots.SiteNameSlot style={{ height: "auto", width: "100%" }} />
        <slots.TitleSlot style={{ height: "auto", width: "100%" }} />
      </PageSection>
      {streamDocument.dm_directoryChildren &&
        isDirectoryGrid(streamDocument.dm_directoryChildren) && (
          <slots.DirectoryGrid style={{ height: "auto" }} />
        )}
      {streamDocument.dm_directoryChildren &&
        !isDirectoryGrid(streamDocument.dm_directoryChildren) && (
          <DirectoryList
            streamDocument={streamDocument}
            directoryChildren={streamDocument.dm_directoryChildren}
            relativePrefixToRoot={relativePrefixToRoot ?? ""}
            linkColor={styles.linkColor}
            backgroundColor={styles.listBackgroundColor}
          />
        )}
    </Background>
  );
};

export const Directory: SectionRenderConfig<DirectoryProps> = {
  // Only structural fields are needed by live Puck rendering.
  fields: {
    slots: {
      type: "object",
      objectFields: {
        TitleSlot: { type: "slot" },
        SiteNameSlot: { type: "slot" },
        BreadcrumbsSlot: { type: "slot" },
        DirectoryGrid: { type: "slot" },
      },
    },
  } as SectionRenderConfig<DirectoryProps>["fields"],
  render: (props) => (
    <AnalyticsScopeProvider name={props?.analytics?.scope ?? "directory"}>
      <DirectoryComponent {...props} />
    </AnalyticsScopeProvider>
  ),
};
