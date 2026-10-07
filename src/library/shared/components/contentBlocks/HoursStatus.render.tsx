import type { SectionRenderConfig } from "@yext/visual-editor";
import { useTranslation } from "react-i18next";
import { PuckComponent } from "@puckeditor/core";
import { HoursType } from "@yext/pages-components";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { EntityField } from "@yext/visual-editor/section-library-support";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
import { pt } from "@yext/visual-editor/section-library-support";
import { HoursStatusAtom } from "@yext/visual-editor/section-library-support";
export interface HoursStatusProps {
  data: {
    /** The hours field to display the status for */
    hours: YextEntityField<HoursType>;
  };

  styles: {
    /** Whether to show the open status ("Open Now" or "Closed") */
    showCurrentStatus?: boolean;
    /** The time format to use */
    timeFormat?: "12h" | "24h";
    /** The day of week format ("Mon" vs. "Monday") */
    dayOfWeekFormat?: "short" | "long";
    /** Whether to show day names ("Monday", "Tuesday") */
    showDayNames?: boolean;
    /** Additional class names to apply to the underlying component */
    className?: string;
    /** The body size variant */
    bodyVariant?: "lg" | "base" | "sm";
  };

  /** @internal */
  parentData?: {
    field: string;
    hours?: HoursType;
    comingSoon?: boolean;
    timezone?: string;
  };
}

const HoursStatusWrapper: PuckComponent<HoursStatusProps> = ({
  data,
  styles,
  puck,
  parentData,
}) => {
  const streamDocument = useDocument();
  const { i18n } = useTranslation();
  const comingSoon = parentData?.comingSoon ?? !!streamDocument.comingSoon;
  const hours =
    parentData?.hours ??
    resolveComponentData(data.hours, i18n.language, streamDocument);
  const timezone = parentData?.timezone ?? streamDocument.timezone;

  return hours || comingSoon ? (
    <EntityField
      displayName={parentData ? parentData.field : pt("hours", "Hours")}
      fieldId={data.hours.field}
      constantValueEnabled={!parentData && data.hours.constantValueEnabled}
    >
      <HoursStatusAtom
        hours={hours ?? {}}
        comingSoon={comingSoon}
        timezone={timezone}
        className={styles.className}
        showCurrentStatus={styles.showCurrentStatus}
        showDayNames={styles.showDayNames}
        timeFormat={styles.timeFormat}
        dayOfWeekFormat={styles.dayOfWeekFormat}
        bodyVariant={styles.bodyVariant}
      />
    </EntityField>
  ) : puck.isEditing ? (
    <div className="h-10" />
  ) : (
    <></>
  );
};

export const HoursStatus: SectionRenderConfig<HoursStatusProps> = {
  render: (props) => <HoursStatusWrapper {...props} />,
};
