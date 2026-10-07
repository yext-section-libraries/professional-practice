import { DirectoryCard as renderConfig } from "./DirectoryCard.render";
import type {
  DirectoryCardLinkOverrideFieldValue,
  DirectoryCardProps,
} from "./DirectoryCard.render";
export type {
  DirectoryCardLinkOverrideFieldValue,
  DirectoryCardProps,
} from "./DirectoryCard.render";
import { msg } from "@yext/visual-editor/section-library-support";
import { backgroundColors } from "@yext/visual-editor/section-library-support";
import { bindSlots } from "@yext/visual-editor/section-library-support";
import { TranslatableString } from "@yext/visual-editor/section-library-support";
import { AddressProps } from "../contentBlocks/Address";
import { HeadingTextProps } from "../contentBlocks/HeadingText";
import { HoursStatusProps } from "../contentBlocks/HoursStatus";
import { PhoneProps } from "../contentBlocks/Phone";
import { DirectoryChildReference } from "./directoryChildReference";
import {
  YextComponentConfig,
  YextFields,
} from "@yext/visual-editor/section-library-support";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
const defaultCardTitle: YextEntityField<TranslatableString> = {
  field: "name",
  constantValue: { defaultValue: "[[name]]" },
  constantValueEnabled: false,
};

export const createDefaultLinkOverrideFieldValue =
  (): DirectoryCardLinkOverrideFieldValue => ({
    enabled: false,
    normalizeLink: false,
    field: "",
    constantValue: {
      defaultValue: "",
      hasLocalizedValue: "true",
    },
    constantValueEnabled: false,
  });

const isHeadingTextField = (
  value: unknown,
): value is HeadingTextProps["data"]["text"] =>
  typeof value === "object" &&
  value !== null &&
  ("field" in value || "constantValue" in value);

export const defaultDirectoryCardSlotData = (
  id: string,
  index: number,
  childRef?: DirectoryChildReference,
  existingCardStyle?: DirectoryCardProps["styles"],
  existingSlots?: DirectoryCardProps["slots"],
) => {
  const existingHeadingText =
    existingSlots?.HeadingSlot?.[0]?.props?.data?.text;
  const existingHeadingStyles = existingSlots?.HeadingSlot?.[0]?.props?.styles;
  const existingAddressStyles = existingSlots?.AddressSlot?.[0]?.props?.styles;
  const existingPhoneStyles = existingSlots?.PhoneSlot?.[0]?.props?.styles;
  const existingHoursStyles = existingSlots?.HoursSlot?.[0]?.props?.styles;
  const headingTextField = isHeadingTextField(existingHeadingText)
    ? existingHeadingText
    : {
        field: "",
        constantValue: existingHeadingText ?? defaultCardTitle.constantValue,
        constantValueEnabled: true,
      };

  return {
    type: "DirectoryCard",
    props: {
      id,
      index,
      data: {
        cardTitle: defaultCardTitle,
        linkOverride: createDefaultLinkOverrideFieldValue(),
        showAddress: true,
        showHoursStatus: true,
        showPhoneNumber: true,
      },
      styles: {
        backgroundColor:
          existingCardStyle?.backgroundColor ??
          backgroundColors.background1.value,
      },
      slots: {
        HeadingSlot: [
          {
            type: "HeadingTextSlot",
            props: {
              ...(id && { id: `${id}-heading` }),
              data: {
                text: headingTextField,
              },
              styles: {
                ...existingHeadingStyles,
                level: existingHeadingStyles?.level ?? 3,
                align: existingHeadingStyles?.align ?? "left",
              },
            } satisfies HeadingTextProps,
          },
        ],
        AddressSlot: [
          {
            type: "AddressSlot",
            props: {
              ...(id && { id: `${id}-address` }),
              data: {
                address: {
                  field: "address",
                  constantValue: {
                    line1: "",
                    city: "",
                    postalCode: "",
                    countryCode: "",
                  },
                },
              },
              styles: {
                ...existingAddressStyles,
                showRegion: existingAddressStyles?.showRegion ?? true,
                showCountry: existingAddressStyles?.showCountry ?? true,
                showGetDirectionsLink:
                  existingAddressStyles?.showGetDirectionsLink ?? false,
                ctaVariant: existingAddressStyles?.ctaVariant ?? "link",
              },
              parentData: {
                field: "profile.address",
              },
            } satisfies AddressProps,
          },
        ],
        PhoneSlot: [
          {
            type: "PhoneSlot",
            props: {
              ...(id && { id: `${id}-phone` }),
              data: {
                number: {
                  constantValue: "",
                  field: "mainPhone",
                },
                label: {
                  constantValue: "",
                  hasLocalizedValue: "true",
                  field: "",
                },
              },
              styles: {
                ...existingPhoneStyles,
                phoneFormat: existingPhoneStyles?.phoneFormat ?? "domestic",
                includePhoneHyperlink:
                  existingPhoneStyles?.includePhoneHyperlink ?? true,
                includeIcon: existingPhoneStyles?.includeIcon ?? false,
              },
              parentData: {
                field: "profile.mainPhone",
              },
            } satisfies PhoneProps,
          },
        ],
        HoursSlot: [
          {
            type: "HoursStatusSlot",
            props: {
              ...(id && { id: `${id}-hours` }),
              data: {
                hours: {
                  constantValue: {},
                  field: "hours",
                },
              },
              styles: {
                ...existingHoursStyles,
                dayOfWeekFormat: existingHoursStyles?.dayOfWeekFormat ?? "long",
                showDayNames: existingHoursStyles?.showDayNames ?? true,
                showCurrentStatus:
                  existingHoursStyles?.showCurrentStatus ?? true,
                className:
                  existingHoursStyles?.className ??
                  "mb-2 font-semibold font-body-fontFamily text-body-fontSize h-full",
              },
              parentData: {
                field: "profile.hours",
              },
            } satisfies HoursStatusProps,
          },
        ],
      },
      ...(childRef
        ? {
            parentData: {
              childRef,
            },
          }
        : {}),
    },
  };
};

const directoryCardFields: YextFields<DirectoryCardProps> = {
  // The data fields are configured by directoryCardsSource.mappingFields in DirectoryWrapper.tsx.
  data: {
    type: "custom",
    visible: false,
    render: () => <></>,
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
      HeadingSlot: { type: "slot" },
      AddressSlot: { type: "slot" },
      PhoneSlot: { type: "slot" },
      HoursSlot: { type: "slot" },
    },
    visible: false,
  },
};

export const DirectoryCard: YextComponentConfig<DirectoryCardProps> = {
  label: msg("slots.directoryCard", "Directory Card"),
  fields: directoryCardFields,
  defaultProps: {
    data: {
      cardTitle: defaultCardTitle,
      linkOverride: createDefaultLinkOverrideFieldValue(),
      showAddress: true,
      showHoursStatus: true,
      showPhoneNumber: true,
    },
    styles: {
      backgroundColor: backgroundColors.background1.value,
    },
    slots: {
      HeadingSlot: [],
      PhoneSlot: [],
      HoursSlot: [],
      AddressSlot: [],
    },
  },
  resolveData: (data) =>
    bindSlots(data, {
      HeadingSlot:
        typeof data.props.data?.cardTitle === "string"
          ? ({
              field: data.props.field ?? "name",
              text: data.props.data.cardTitle,
            } satisfies HeadingTextProps["parentData"])
          : undefined,
    }),
  render: renderConfig.render,
};
