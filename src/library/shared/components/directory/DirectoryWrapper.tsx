import { DirectoryGrid as renderConfig } from "./DirectoryWrapper.render";
import type { DirectoryGridProps } from "./DirectoryWrapper.render";
export type { DirectoryGridProps } from "./DirectoryWrapper.render";
export { DirectoryList } from "./DirectoryWrapper.render";
import { FieldLabel } from "@puckeditor/core";
import {
  backgroundColors,
  ThemeOptions,
} from "@yext/visual-editor/section-library-support";
import { msg, pt } from "@yext/visual-editor/section-library-support";
import { isDirectoryGrid } from "@yext/visual-editor/section-library-support";
import {
  createDefaultLinkOverrideFieldValue,
  defaultDirectoryCardSlotData,
  DirectoryCardProps,
} from "./DirectoryCard";
import {
  createDirectoryChildReference,
  getSortedDirectoryChildren,
} from "./directoryChildReference";
import {
  YextComponentConfig,
  type YextCustomFieldRenderProps,
  type YextFieldDefinition,
  YextFields,
} from "@yext/visual-editor/section-library-support";
import { createSlottedItemSource } from "@yext/visual-editor/section-library-support";
import { syncLinkedSlotMappedCards } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { YextAutoField } from "@yext/visual-editor/section-library-support";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@yext/visual-editor/section-library-support";
import { FaInfoCircle } from "react-icons/fa";
import { useTemplateMetadata } from "@yext/visual-editor/section-library-support";
const DirectoryFieldTooltip = () => {
  const templateMetadata = useTemplateMetadata();
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="ve-flex ve-h-4 ve-w-4 ve-items-center ve-justify-center ve-text-gray-500 hover:ve-text-gray-700"
          >
            <FaInfoCircle className="ve-h-4 ve-w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="ve-max-w-[260px] ve-text-left">
          {pt(
            "linkOverrideDirectoryTooltip",
            "Use a custom URL path for each card's title link. If the value is empty, the generated directory URL will be used.",
            {
              entityType: templateMetadata.entityTypeDisplayName,
            },
          )}
          <TooltipArrow fill="ve-bg-popover" />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const linkOverrideField: YextFieldDefinition<
  DirectoryCardProps["data"]["linkOverride"]
> = {
  type: "custom",
  render: ({
    value,
    onChange,
  }: YextCustomFieldRenderProps<
    DirectoryCardProps["data"]["linkOverride"]
  >) => {
    const enabled = value?.enabled ?? false;
    const normalizeLink = value?.normalizeLink ?? false;
    const label = pt("fields.overrideLink", "Override Link");

    return (
      <FieldLabel label={label} icon={<DirectoryFieldTooltip />}>
        <div className="ve-flex ve-flex-col ve-gap-3">
          <YextAutoField
            field={{
              type: "radio",
              options: [
                { label: pt("fields.options.yes", "Yes"), value: true },
                { label: pt("fields.options.no", "No"), value: false },
              ],
            }}
            value={enabled}
            onChange={(nextEnabled) =>
              onChange({
                ...createDefaultLinkOverrideFieldValue(),
                ...value,
                enabled: nextEnabled,
              })
            }
          />
          {enabled && (
            <>
              <YextAutoField
                field={{
                  type: "entityField",
                  label: msg("fields.linkPath", "Link Path"),
                  filter: {
                    types: ["type.string"],
                  },
                  showApplyAllOption: true,
                }}
                value={value}
                onChange={(nextValue) =>
                  onChange({
                    ...nextValue,
                    enabled: true,
                  })
                }
              />
              <FieldLabel label={pt("fields.normalizeLink", "Normalize Link")}>
                <YextAutoField
                  field={{
                    type: "radio",
                    options: [
                      { label: pt("fields.options.yes", "Yes"), value: true },
                      { label: pt("fields.options.no", "No"), value: false },
                    ],
                  }}
                  value={normalizeLink}
                  onChange={(nextNormalizeLink) =>
                    onChange({
                      ...value,
                      normalizeLink: nextNormalizeLink,
                    })
                  }
                />
              </FieldLabel>
            </>
          )}
        </div>
      </FieldLabel>
    );
  },
};

const directoryCardsSource = createSlottedItemSource<
  DirectoryCardProps["data"],
  DirectoryCardProps
>({
  label: msg("components.directoryChildren", "Directory Children"),
  itemLabel: "Directory Card",
  cardName: "DirectoryCard",
  defaultItemProps: () =>
    defaultDirectoryCardSlotData("DirectoryCard", 0).props,
  mappingFields: {
    cardTitle: {
      type: "entityField",
      label: msg("fields.name", "Name"),
      filter: {
        types: ["type.string"],
      },
    },
    linkOverride: linkOverrideField,
    showAddress: {
      type: "radio",
      label: msg("fields.showAddress", "Show Address"),
      options: ThemeOptions.SHOW_HIDE,
    },
    showHoursStatus: {
      type: "radio",
      label: msg("fields.showHoursStatus", "Show Hours Status"),
      options: ThemeOptions.SHOW_HIDE,
    },
    showPhoneNumber: {
      type: "radio",
      label: msg("fields.showPhone", "Show Phone"),
      options: ThemeOptions.SHOW_HIDE,
    },
  },
});

// The linked entity slot helper allows field selection and constant values
// however the directory should be locked to the dm_directoryChildren field.
const getNormalizedDirectoryGridData = (
  value: typeof directoryCardsSource.value | undefined,
): typeof directoryCardsSource.value => ({
  ...directoryCardsSource.defaultValue,
  ...value,
  field: "dm_directoryChildren",
  constantValueEnabled: false,
  constantValue: [],
  mappings: {
    ...directoryCardsSource.defaultValue.mappings!,
    ...value?.mappings,
    cardTitle: {
      ...directoryCardsSource.defaultValue.mappings!.cardTitle,
      ...value?.mappings?.cardTitle,
      field: value?.mappings?.cardTitle?.field || "name",
    },
    linkOverride: {
      ...createDefaultLinkOverrideFieldValue(),
      ...value?.mappings?.linkOverride,
    },
    showAddress: value?.mappings?.showAddress ?? true,
    showHoursStatus: value?.mappings?.showHoursStatus ?? true,
    showPhoneNumber: value?.mappings?.showPhoneNumber ?? true,
  },
});

const directoryGridFields: YextFields<DirectoryGridProps> = {
  data: {
    ...directoryCardsSource.field,
    disableConstantValueToggle: true,
    fixedRepeatedField: "dm_directoryChildren",
    hideRequirementsTooltip: true,
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
    },
  },
  slots: {
    type: "object",
    objectFields: {
      CardSlot: { type: "slot", allow: [] },
    },
    visible: false,
  },
  manualSlots: {
    type: "object",
    objectFields: {
      CardSlot: { type: "slot", allow: [] },
    },
    visible: false,
  },
};

export const DirectoryGrid: YextComponentConfig<DirectoryGridProps> = {
  label: msg("components.directoryGrid", "Directory Grid"),
  fields: directoryGridFields,
  defaultProps: {
    ...directoryCardsSource.defaultWrapperProps,
    data: getNormalizedDirectoryGridData(directoryCardsSource.defaultValue),
    styles: {
      backgroundColor: backgroundColors.background1.value,
    },
  },
  resolveData: (data, params) => {
    const streamDocument = params.metadata.streamDocument;

    if (
      !streamDocument?.dm_directoryChildren ||
      !isDirectoryGrid(streamDocument.dm_directoryChildren)
    ) {
      return data;
    }

    const sortedDirectoryChildren = getSortedDirectoryChildren(
      streamDocument.dm_directoryChildren,
    );
    const normalizedData = getNormalizedDirectoryGridData(data.props.data);
    const titleField = normalizedData.mappings?.cardTitle.constantValueEnabled
      ? ""
      : normalizedData.mappings?.cardTitle.field || "name";
    const titleItems = directoryCardsSource.resolveItems(normalizedData, {
      ...streamDocument,
      dm_directoryChildren: sortedDirectoryChildren,
    });
    const firstCardProps = data.props.slots?.CardSlot?.[0]?.props;
    const updatedCards = syncLinkedSlotMappedCards({
      items: sortedDirectoryChildren.map((child, index) => ({
        child,
        childIndex: index,
      })),
      currentCards: data.props.slots.CardSlot,
      createCard: (id, index) =>
        defaultDirectoryCardSlotData(
          id,
          index,
          createDirectoryChildReference(sortedDirectoryChildren[index], index),
          firstCardProps?.styles,
          firstCardProps?.slots,
        ),
      toParentData: ({ child, childIndex }) => ({
        childRef: createDirectoryChildReference(child, childIndex),
      }),
      normalizeId: (id) => `DirectoryCard-${id}`,
    }).map((card, index) => {
      const cardTitle =
        titleItems[index]?.cardTitle !== undefined
          ? resolveComponentData(
              titleItems[index].cardTitle,
              streamDocument.locale || "en",
              streamDocument,
              { output: "plainText" },
            )
          : "[[name]]";
      const cardSlots = card.props.slots ?? {};

      return {
        ...card,
        props: {
          ...card.props,
          field: titleField,
          data: {
            ...card.props.data,
            cardTitle,
            linkOverride: normalizedData.mappings?.linkOverride,
            showAddress: normalizedData.mappings?.showAddress,
            showHoursStatus: normalizedData.mappings?.showHoursStatus,
            showPhoneNumber: normalizedData.mappings?.showPhoneNumber,
          },
          slots: {
            ...cardSlots,
            HeadingSlot: (cardSlots.HeadingSlot ?? []).map(
              (headingSlot, headingIndex) =>
                headingIndex === 0
                  ? {
                      ...headingSlot,
                      props: {
                        ...headingSlot.props,
                        parentData: {
                          field: titleField,
                          text: cardTitle,
                        },
                      },
                    }
                  : headingSlot,
            ),
          },
        },
      };
    });

    return {
      ...data,
      props: {
        ...data.props,
        data: normalizedData,
        slots: {
          ...data.props.slots,
          CardSlot: updatedCards,
        },
      },
    };
  },
  render: renderConfig.render,
};
