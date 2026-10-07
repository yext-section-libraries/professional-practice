import type { SectionRenderConfig } from "@yext/visual-editor";
import { useTranslation } from "react-i18next";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { EntityField } from "@yext/visual-editor/section-library-support";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
import { PhoneAtom } from "@yext/visual-editor/section-library-support";
import { pt } from "@yext/visual-editor/section-library-support";
import { TranslatableString } from "@yext/visual-editor/section-library-support";
import {
  ThemeColor,
  backgroundColors,
} from "@yext/visual-editor/section-library-support";
/** The props for the Phone component */
export interface PhoneProps {
  data: {
    /** The phone number data to display */
    number: YextEntityField<string>;
    /** The text to display before the phone number */
    label: TranslatableString;
  };

  styles: {
    /** Whether to format the phone number like a domestic or international number */
    phoneFormat: "domestic" | "international";
    /** Whether to make the phone number a clickable link */
    includePhoneHyperlink: boolean;
    /** Whether to include the phone icon, defaults to true */
    includeIcon?: boolean;
    /** The color applied to both the phone icon background and the phone link. */
    color?: ThemeColor;
  };

  /** @internal */
  parentData?: {
    field: string;
    phoneNumber?: string;
  };
}

const PhoneComponent = ({ data, styles, parentData }: PhoneProps) => {
  const { i18n } = useTranslation();
  const streamDocument = useDocument();
  const resolvedPhone =
    parentData?.phoneNumber ??
    resolveComponentData(data.number, i18n.language, streamDocument);

  if (!resolvedPhone) {
    return;
  }

  return (
    <EntityField
      displayName={
        parentData ? parentData.field : pt("fields.phoneNumber", "Phone Number")
      }
      fieldId={data.number.field}
      constantValueEnabled={!parentData && data.number.constantValueEnabled}
    >
      <PhoneAtom
        backgroundColor={styles.color ?? backgroundColors.background2.value}
        eventName={`phone`}
        format={styles.phoneFormat}
        label={resolveComponentData(data.label, i18n.language, streamDocument)}
        phoneNumber={resolvedPhone}
        includeHyperlink={styles.includePhoneHyperlink}
        includeIcon={styles.includeIcon ?? true}
        linkColor={styles.color}
      />
    </EntityField>
  );
};

export const Phone: SectionRenderConfig<PhoneProps> = {
  render: (props) => <PhoneComponent {...props} />,
};
