import type { StatusParams } from "@yext/pages-components";
import type { TFunction } from "i18next";
import * as React from "react";

type TranslatedHoursStatusProps = {
  params: StatusParams;
  t: TFunction;
  locale: string;
  showCurrentStatus?: boolean;
  showDayNames?: boolean;
  className?: string;
  style?: React.CSSProperties;
  currentStyle?: React.CSSProperties;
};

export const renderTranslatedHoursStatus = ({
  params,
  t,
  locale,
  showCurrentStatus = true,
  showDayNames = true,
  className,
  style,
  currentStyle,
}: TranslatedHoursStatusProps): React.ReactNode => {
  const isComingSoon = Boolean(params.comingSoon);
  const isOpen24Hours = Boolean(params.currentInterval?.is24h?.());
  const isIndefinitelyClosed = !params.futureInterval;
  const hasFutureStatus = !isOpen24Hours && !isIndefinitelyClosed;
  const interval = params.isOpen
    ? params.currentInterval
    : params.futureInterval;
  const time = params.isOpen
    ? (interval?.getEndTime(locale, params.timeOptions) ?? "")
    : (interval?.getStartTime(locale, params.timeOptions) ?? "");
  const dayOfWeek =
    showDayNames && hasFutureStatus && interval
      ? params.isOpen
        ? (interval.end
            ?.setLocale(locale)
            .toLocaleString(params.dayOptions) ?? "")
        : (interval.start
            ?.setLocale(locale)
            .toLocaleString(params.dayOptions) ?? "")
      : "";

  const currentStatusText = isComingSoon
    ? t("comingSoon", "Coming Soon")
    : isOpen24Hours
      ? t("open24Hours", "Open 24 Hours")
      : isIndefinitelyClosed
        ? t("temporarilyClosed", "Temporarily Closed")
        : params.isOpen
          ? t("openNow", "Open Now")
          : t("closed", "Closed");

  const futureStatusText =
    !isComingSoon && hasFutureStatus && time
      ? params.isOpen
        ? dayOfWeek
          ? t("closesAtTimeWeek", "Closes at {{time}} {{dayOfWeek}}", {
              time,
              dayOfWeek,
            })
          : t("closesAtTime", "Closes at {{time}}", { time })
        : dayOfWeek
          ? t("opensAtTimeWeek", "Opens at {{time}} {{dayOfWeek}}", {
              time,
              dayOfWeek,
            })
          : t("opensAtTime", "Opens at {{time}}", { time })
      : "";

  return (
    <div className={className ?? "HoursStatus"} style={style}>
      {(showCurrentStatus || isComingSoon) && (
        <span
          className="HoursStatus-current"
          style={{ fontWeight: "bolder", ...currentStyle }}
        >
          {currentStatusText}
        </span>
      )}
      {showCurrentStatus && futureStatusText ? (
        <>
          <span className="HoursStatus-separator"> • </span>
          <span className="HoursStatus-future">{futureStatusText}</span>
        </>
      ) : null}
    </div>
  );
};
