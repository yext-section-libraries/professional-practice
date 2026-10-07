import type { SectionRenderConfig } from "@yext/visual-editor";
import { PuckComponent, Slot } from "@puckeditor/core";
import React from "react";
import { useCardContext } from "@yext/visual-editor/section-library-support";
import {
  TemplatePropsContext,
  useTemplateProps,
} from "@yext/visual-editor/section-library-support";
import { useGetCardSlots } from "@yext/visual-editor/section-library-support";
import {
  backgroundColors,
  ThemeColor,
} from "@yext/visual-editor/section-library-support";
import { deepMerge } from "@yext/visual-editor/section-library-support";
import {
  mergeMeta,
  resolveUrlTemplateOfChild,
} from "@yext/visual-editor/section-library-support";
import { TranslatableString } from "@yext/visual-editor/section-library-support";
import { Background } from "@yext/visual-editor/section-library-support";
import { MaybeLink } from "@yext/visual-editor/section-library-support";
import {
  DirectoryChildReference,
  getSortedDirectoryChildren,
  resolveDirectoryChildFromReference,
  useDirectoryChildren,
} from "./directoryChildReference";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { normalizeSlug } from "@yext/visual-editor/section-library-support";
// DirectoryCardLinkOverrideField is a yes/no toggle
// that displays an entity field selector when set to yes.
export type DirectoryCardLinkOverrideFieldValue =
  YextEntityField<TranslatableString> & {
    enabled: boolean;
    normalizeLink: boolean;
  };

export type DirectoryCardProps = {
  /** @internal */
  field?: string;

  data: {
    cardTitle: YextEntityField<TranslatableString>;
    linkOverride: DirectoryCardLinkOverrideFieldValue;
    showAddress: boolean;
    showHoursStatus: boolean;
    showPhoneNumber: boolean;
  };

  /** Styling for all the cards. */
  styles: {
    /** The background color of each directory card */
    backgroundColor?: ThemeColor;
  };

  /** @internal */
  slots: {
    HeadingSlot: Slot;
    AddressSlot: Slot;
    PhoneSlot: Slot;
    HoursSlot: Slot;
  };

  /** @internal */
  parentData?: {
    childRef: DirectoryChildReference;
  };

  /** @internal */
  index?: number;
};

const DirectoryCardComponent: PuckComponent<DirectoryCardProps> = (props) => {
  const { data, styles, slots, parentData, index, puck } = props;
  const { document: streamDocument, relativePrefixToRoot } = useTemplateProps();
  const directoryChildrenFromContext = useDirectoryChildren();
  const sortedDirectoryChildren = React.useMemo(
    () =>
      directoryChildrenFromContext.length
        ? directoryChildrenFromContext
        : getSortedDirectoryChildren(streamDocument.dm_directoryChildren),
    [directoryChildrenFromContext, streamDocument.dm_directoryChildren],
  );
  const resolvedChild = React.useMemo(
    () =>
      resolveDirectoryChildFromReference(
        sortedDirectoryChildren,
        parentData?.childRef,
      ),
    [parentData?.childRef, sortedDirectoryChildren],
  );
  // Give nested slots a child-scoped document context instead of duplicating
  // child values into each slot's parentData.
  const childDocumentContext = React.useMemo(
    () =>
      resolvedChild
        ? {
            document: {
              ...streamDocument,
              ...mergeMeta(resolvedChild, streamDocument),
            },
            relativePrefixToRoot,
          }
        : {
            document: streamDocument,
            relativePrefixToRoot,
          },
    [resolvedChild, relativePrefixToRoot, streamDocument],
  );

  const linkOverrideValue = data.linkOverride.enabled
    ? resolveComponentData(
        data.linkOverride,
        streamDocument.locale || "en",
        childDocumentContext.document,
      )
    : "";
  const resolvedLinkOverride =
    typeof linkOverrideValue === "string"
      ? data.linkOverride.normalizeLink
        ? normalizeSlug(linkOverrideValue)
        : linkOverrideValue
      : "";

  // If there is a value for link override, it should be used.
  // Otherwise, construct the url based on the entity page's url template.
  let resolvedUrl: undefined | string;
  if (resolvedLinkOverride) {
    resolvedUrl = resolvedLinkOverride;
  } else if (resolvedChild) {
    resolvedUrl = resolveUrlTemplateOfChild(
      resolvedChild,
      streamDocument,
      relativePrefixToRoot,
    );
  }

  const { sharedCardProps, setSharedCardProps } = useCardContext<{
    cardStyles: DirectoryCardProps["styles"];
    slotStyles: Record<string, DirectoryCardProps["styles"]>;
  }>();

  const { slotStyles, getPuck, slotProps } =
    useGetCardSlots<DirectoryCardProps>(props.id);

  // sharedCardProps useEffect
  // When the context changes, dispatch an update to sync the changes to puck
  React.useEffect(() => {
    if (!puck.isEditing || !sharedCardProps || !getPuck) {
      return;
    }

    if (
      JSON.stringify(sharedCardProps?.cardStyles) === JSON.stringify(styles) &&
      JSON.stringify(slotStyles) === JSON.stringify(sharedCardProps?.slotStyles)
    ) {
      return;
    }

    const { dispatch, getSelectorForId } = getPuck();
    const selector = getSelectorForId(props.id);
    if (!selector || !slotProps) {
      return;
    }

    const newSlotData: DirectoryCardProps["slots"] = {
      HeadingSlot: [],
      PhoneSlot: [],
      HoursSlot: [],
      AddressSlot: [],
    };
    Object.entries(slotProps).forEach(([key, value]) => {
      const nextSlotValue = deepMerge(
        { props: { styles: { ...sharedCardProps?.slotStyles?.[key] } } },
        value[0],
      );
      newSlotData[key as keyof DirectoryCardProps["slots"]] = [
        {
          ...nextSlotValue,
        },
      ];
    });

    // oxlint-disable-next-line no-unused-vars: remove props.puck before dispatching to avoid writing it to the saved data
    const { puck: _, editMode: __, ...otherProps } = props;
    dispatch({
      type: "replace" as const,
      destinationIndex: selector.index,
      destinationZone: selector.zone,
      data: {
        type: "DirectoryCard",
        props: {
          ...otherProps,
          data: props.data,
          styles: {
            backgroundColor:
              sharedCardProps?.cardStyles.backgroundColor ||
              backgroundColors.background1.value,
          },
          slots: newSlotData,
        } satisfies DirectoryCardProps,
      },
    });
  }, [sharedCardProps]);

  // styles and slotStyles useEffect
  // When the card's shared props or the card's slots' shared props change, update the context
  React.useEffect(() => {
    if (!puck.isEditing || !slotProps) {
      return;
    }

    if (
      JSON.stringify(sharedCardProps?.cardStyles) === JSON.stringify(styles) &&
      JSON.stringify(sharedCardProps?.slotStyles) === JSON.stringify(slotStyles)
    ) {
      return;
    }

    setSharedCardProps({
      cardStyles: styles,
      slotStyles: slotStyles,
    });
  }, [styles, slotStyles]);

  return (
    <Background
      className="h-full flex flex-col p-8 border border-gray-400 rounded gap-4"
      background={styles.backgroundColor}
    >
      <TemplatePropsContext.Provider value={childDocumentContext}>
        <div className="mb-2 max-w-full w-full">
          <MaybeLink
            eventName={`link${index}`}
            alwaysHideCaret={true}
            className="text-wrap break-words block w-full"
            href={resolvedUrl}
            disabled={puck.isEditing}
          >
            <slots.HeadingSlot style={{ height: "auto" }} />
          </MaybeLink>
        </div>
        {data.showHoursStatus && resolvedChild?.hours && (
          <slots.HoursSlot style={{ height: "auto" }} />
        )}
        {data.showPhoneNumber && resolvedChild?.mainPhone && (
          <slots.PhoneSlot style={{ height: "auto" }} />
        )}
        {data.showAddress && resolvedChild?.address && (
          <div className="font-body-fontFamily font-body-fontWeight text-body-fontSize">
            <slots.AddressSlot style={{ height: "auto" }} />
          </div>
        )}
      </TemplatePropsContext.Provider>
    </Background>
  );
};

export const DirectoryCard: SectionRenderConfig<DirectoryCardProps> = {
  // Only structural fields are needed by live Puck rendering.
  fields: {
    slots: {
      type: "object",
      objectFields: {
        HeadingSlot: { type: "slot" },
        AddressSlot: { type: "slot" },
        PhoneSlot: { type: "slot" },
        HoursSlot: { type: "slot" },
      },
    },
  } as SectionRenderConfig<DirectoryCardProps>["fields"],
  render: (props) => <DirectoryCardComponent {...props} />,
};
