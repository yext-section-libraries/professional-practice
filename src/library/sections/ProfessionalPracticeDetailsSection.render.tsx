import type { SectionRenderConfig } from "@yext/visual-editor";
import {
  resolveTextStyles,
  getBodyTextStyle,
  TypographyScope,
} from "../shared/typography";
import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { parsePhoneNumber } from "awesome-phonenumber";
import { FaMapMarkerAlt, FaRegClock, FaThumbsUp } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import {
  ComprehensiveCTA,
  type ComprehensiveCTAValue,
  EntityField,
  type ThemeColor,
  VisibilityWrapper,
  type YextEntityField,
  Background,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue as resolveThemeColorCssValue,
  isDarkColor,
  resolveComponentData,
  useDocument,
} from "@yext/visual-editor";
import {
  Address,
  AnalyticsScopeProvider,
  type AddressType,
  HoursTable,
  type HoursType,
  Link,
  type DayOfWeekNames,
} from "@yext/pages-components";
import {
  getReadableForegroundColor as resolveReadableForegroundColor,
  type StyledTextProps,
  type StyledTextValueWithLetterSpacing,
} from "../shared/sectionHelpers";
type TextListProps = {
  text: YextEntityField<string[]>;
  styles: StyledTextValueWithLetterSpacing;
  fontColor?: ThemeColor;
};

export type PhoneItemProps = {
  number: YextEntityField<string>;
  label?: string;
};

type PhoneFieldProps = {
  items: PhoneItemProps[];
  phoneFormat: "international" | "domestic";
  includeHyperlink?: boolean;
};

type DetailsIcon = "location" | "clock" | "thumbsUp";

export type ProfessionalPracticeDetailsSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  iconBackgroundColor: ThemeColor;
  summary: {
    icon: DetailsIcon;
    title: StyledTextProps;
    address: YextEntityField<AddressType>;
    showRegion: boolean;
    showCountry: boolean;
    baseHubLabel: StyledTextProps;
    serviceRadiusText: StyledTextProps;
    bookingLabel: StyledTextProps;
    phones: PhoneFieldProps;
    cta: ComprehensiveCTAValue;
  };
  dispatchHours: {
    icon: DetailsIcon;
    title: StyledTextProps;
    hours: YextEntityField<HoursType>;
    hoursStyles: {
      startOfWeek: keyof DayOfWeekNames | "today";
      collapseDays: boolean;
      showAdditionalHoursText: boolean;
      alignment: "items-start" | "items-center" | "items-end";
    };
  };
  perks: {
    icon: DetailsIcon;
    title: StyledTextProps;
    listText: TextListProps;
  };
};

export const iconBackgroundColor: ThemeColor = {
  selectedColor: "palette-tertiary",
  contrastingColor: "palette-tertiary-contrast",
};

const detailsIcons: Record<
  DetailsIcon,
  {
    component: React.ComponentType<{ className?: string }>;
    className: string;
  }
> = {
  location: {
    component: FaMapMarkerAlt,
    className: "h-[18px] w-[14px] text-current",
  },
  clock: {
    component: FaRegClock,
    className: "h-[18px] w-[18px] text-current",
  },
  thumbsUp: {
    component: FaThumbsUp,
    className: "h-[18px] w-[18px] text-current",
  },
};

const formatPhone = (value: string, format: "international" | "domestic") => {
  const parsed = parsePhoneNumber(value.replace(/(?!^\+)\+|[^\d+]/g, ""));
  if (!parsed.valid || !parsed.number) {
    return value;
  }

  return format === "international"
    ? parsed.number.international
    : parsed.number.national;
};

const ProfessionalPracticeDetailsSectionComponent: PuckComponent<
  ProfessionalPracticeDetailsSectionProps
> = (props) => {
  const { t, i18n } = useTranslation();
  const streamDocument = useDocument();
  const locale = i18n.language;
  const dayOfWeekNames = React.useMemo<DayOfWeekNames>(() => {
    const formatter = new Intl.DateTimeFormat(locale, {
      timeZone: "UTC",
      weekday: "long",
    });
    const formatWeekday = (day: number) =>
      formatter.format(new Date(Date.UTC(2024, 0, day)));

    return {
      sunday: formatWeekday(7),
      monday: formatWeekday(8),
      tuesday: formatWeekday(9),
      wednesday: formatWeekday(10),
      thursday: formatWeekday(11),
      friday: formatWeekday(12),
      saturday: formatWeekday(13),
    };
  }, [locale]);
  const address = resolveComponentData(
    props.summary.address,
    locale,
    streamDocument,
  ) as AddressType | undefined;
  const hours = resolveComponentData(
    props.dispatchHours.hours,
    locale,
    streamDocument,
  ) as HoursType | undefined;
  const summaryTitle =
    resolveComponentData(props.summary.title.text, locale, streamDocument) ||
    "";
  const summaryIcon = detailsIcons[props.summary.icon];
  const SummaryIconComponent = summaryIcon.component;
  const baseHubLabel =
    resolveComponentData(
      props.summary.baseHubLabel.text,
      locale,
      streamDocument,
    ) || "";
  const serviceRadiusText =
    resolveComponentData(
      props.summary.serviceRadiusText.text,
      locale,
      streamDocument,
    ) || "";
  const bookingLabel =
    resolveComponentData(
      props.summary.bookingLabel.text,
      locale,
      streamDocument,
    ) || "";
  const dispatchHoursTitle =
    resolveComponentData(
      props.dispatchHours.title.text,
      locale,
      streamDocument,
    ) || "";
  const dispatchHoursIcon = detailsIcons[props.dispatchHours.icon];
  const DispatchHoursIconComponent = dispatchHoursIcon.component;
  const perksTitle =
    resolveComponentData(props.perks.title.text, locale, streamDocument) || "";
  const perksIcon = detailsIcons[props.perks.icon];
  const PerksIconComponent = perksIcon.component;
  const perks =
    (resolveComponentData(props.perks.listText.text, locale, streamDocument) as
      string[] | undefined) ?? [];
  const additionalHoursText =
    typeof (streamDocument as any).additionalHoursText === "string"
      ? (streamDocument as any).additionalHoursText.trim()
      : "";
  const phones = (props.summary.phones.items ?? [])
    .map((item) => {
      const number = resolveComponentData(item.number, locale, streamDocument);
      const trimmed = typeof number === "string" ? number.trim() : "";
      if (!trimmed) {
        return null;
      }
      return {
        fieldId: item.number.field,
        constantValueEnabled: item.number.constantValueEnabled,
        label: item.label?.trim() ?? "",
        formatted: formatPhone(trimmed, props.summary.phones.phoneFormat),
        telValue: trimmed.replace(/\D/g, ""),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const iconForegroundColor = isDarkColor(
    props.iconBackgroundColor,
    streamDocument,
  )
    ? "#ffffff"
    : "#000000";
  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`ProfessionalPracticeDetailsSection${getAnalyticsScopeHash(props.id)}`}
      >
        <Background background={props.section.backgroundColor}>
          <section
            data-ypp-scope="details-section"
            style={getSurfaceColorStyle(
              props.section.backgroundColor,
              streamDocument,
            )}
          >
            <style>{`

            [data-ypp-scope="details-section"] .ypp-typography a {

              text-decoration: underline;
            }

            [data-ypp-scope="details-section"] .ypp-cta-button {
              transition:
                background-color 0.2s ease,
                border-color 0.2s ease,
                color 0.2s ease,
                box-shadow 0.2s ease,
                transform 0.2s ease;
            }

            [data-ypp-scope="details-section"] .ypp-cta-button:hover,
            [data-ypp-scope="details-section"] .ypp-cta-button:focus-visible {
              transform: translateY(-1px);
              box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
            }

            [data-ypp-scope="details-section"] .ypp-cta-button--filled:hover,
            [data-ypp-scope="details-section"] .ypp-cta-button--filled:focus-visible {
              box-shadow:
                0 10px 20px rgba(15, 23, 42, 0.12),
                inset 0 0 0 999px rgba(0, 0, 0, 0.06);
            }

            [data-ypp-scope="details-section"] .ypp-cta-button--outline:hover,
            [data-ypp-scope="details-section"] .ypp-cta-button--outline:focus-visible {
              background-color: color-mix(in srgb, currentColor 8%, transparent);
              border-color: currentColor;
              box-shadow:
                0 10px 20px rgba(15, 23, 42, 0.12),
                inset 0 0 0 1px currentColor;
            }
          `}</style>
            <div className="mx-auto flex max-w-[1280px] flex-col gap-10 px-4 py-[30px] md:px-8 md:py-[60px] xl:flex-row xl:gap-8 xl:px-20">
              <div className="ypp-typography flex flex-1 flex-col gap-6">
                <div className="flex items-center gap-5">
                  <span
                    className="flex h-[52px] w-[52px] items-center justify-center rounded-[6px]"
                    style={{
                      backgroundColor: resolveThemeColorCssValue(
                        props.iconBackgroundColor,
                      ),
                      color: iconForegroundColor,
                    }}
                  >
                    <SummaryIconComponent
                      aria-hidden="true"
                      className={summaryIcon.className}
                    />
                  </span>
                  <EntityField
                    displayName="Summary Title"
                    fieldId={props.summary.title.text.field}
                    constantValueEnabled={
                      props.summary.title.text.constantValueEnabled
                    }
                  >
                    <h2
                      className=""
                      style={{
                        ...resolveTextStyles(props.summary.title.styles),
                        color: resolveReadableForegroundColor(
                          props.summary.title.fontColor,
                          props.section.backgroundColor,
                          streamDocument,
                        ),
                      }}
                    >
                      {summaryTitle}
                    </h2>
                  </EntityField>
                </div>
                <div className="flex flex-col gap-2">
                  <EntityField
                    displayName="Base Hub Label"
                    fieldId={props.summary.baseHubLabel.text.field}
                    constantValueEnabled={
                      props.summary.baseHubLabel.text.constantValueEnabled
                    }
                  >
                    <p
                      className=""
                      style={{
                        ...getBodyTextStyle(props.summary.baseHubLabel.styles),
                        color: resolveReadableForegroundColor(
                          props.summary.baseHubLabel.fontColor,
                          props.section.backgroundColor,
                          streamDocument,
                        ),
                      }}
                    >
                      {baseHubLabel}
                    </p>
                  </EntityField>
                  {address ? (
                    <EntityField
                      displayName="Address"
                      fieldId={props.summary.address.field}
                      constantValueEnabled={
                        props.summary.address.constantValueEnabled
                      }
                    >
                      <Address
                        address={address}
                        showRegion={props.summary.showRegion}
                        showCountry={props.summary.showCountry}
                      />
                    </EntityField>
                  ) : null}
                  <EntityField
                    displayName="Service Radius Text"
                    fieldId={props.summary.serviceRadiusText.text.field}
                    constantValueEnabled={
                      props.summary.serviceRadiusText.text.constantValueEnabled
                    }
                  >
                    <p
                      style={{
                        ...getBodyTextStyle(
                          props.summary.serviceRadiusText.styles,
                        ),
                        color: resolveReadableForegroundColor(
                          props.summary.serviceRadiusText.fontColor,
                          props.section.backgroundColor,
                          streamDocument,
                        ),
                      }}
                    >
                      {serviceRadiusText}
                    </p>
                  </EntityField>
                </div>
                <div className="flex flex-col gap-2">
                  <EntityField
                    displayName="Booking Label"
                    fieldId={props.summary.bookingLabel.text.field}
                    constantValueEnabled={
                      props.summary.bookingLabel.text.constantValueEnabled
                    }
                  >
                    <p
                      className=""
                      style={{
                        ...getBodyTextStyle(props.summary.bookingLabel.styles),
                        color: resolveReadableForegroundColor(
                          props.summary.bookingLabel.fontColor,
                          props.section.backgroundColor,
                          streamDocument,
                        ),
                      }}
                    >
                      {bookingLabel}
                    </p>
                  </EntityField>
                  {phones.map((phone, index) => {
                    const content = (
                      <span>
                        {phone.label
                          ? `${phone.label} ${phone.formatted}`
                          : phone.formatted}
                      </span>
                    );
                    return (
                      <EntityField
                        key={`${phone.formatted}-${index}`}
                        displayName="Phone"
                        fieldId={phone.fieldId}
                        constantValueEnabled={phone.constantValueEnabled}
                      >
                        {props.summary.phones.includeHyperlink ? (
                          <Link
                            cta={{
                              link: phone.telValue,
                              linkType: "PHONE",
                            }}
                            eventName={`summaryPhone${index}`}
                            className="underline decoration-current underline-offset-2"
                          >
                            {content}
                          </Link>
                        ) : (
                          content
                        )}
                      </EntityField>
                    );
                  })}
                </div>
                <EntityField
                  displayName="Summary Call to Action"
                  fieldId={props.summary.cta.data.cta.field}
                  constantValueEnabled={
                    props.summary.cta.data.cta.constantValueEnabled
                  }
                >
                  <ComprehensiveCTA
                    value={props.summary.cta as Partial<ComprehensiveCTAValue>}
                    eventName="summaryCta"
                    className={`inline-flex min-h-12 w-fit items-center justify-center px-4${
                      ["primary", "solid"].includes(
                        props.summary.cta.styles.variant ?? "",
                      )
                        ? " ypp-cta-button ypp-cta-button--filled"
                        : ["secondary", "outline"].includes(
                              props.summary.cta.styles.variant ?? "",
                            )
                          ? " ypp-cta-button ypp-cta-button--outline"
                          : ""
                    }`}
                    style={
                      ["primary", "secondary", "solid", "outline"].includes(
                        props.summary.cta.styles.variant ?? "",
                      )
                        ? {
                            textDecoration: "none",
                            ...(["secondary", "outline"].includes(
                              props.summary.cta.styles.variant ?? "",
                            ) &&
                            (!props.summary.cta.styles.color?.selectedColor ||
                              props.summary.cta.styles.color.selectedColor ===
                                "default")
                              ? {
                                  color: resolveReadableForegroundColor(
                                    undefined,
                                    props.section.backgroundColor,
                                    streamDocument,
                                  ),
                                }
                              : {}),
                            ...(["secondary", "outline"].includes(
                              props.summary.cta.styles.variant ?? "",
                            )
                              ? { borderColor: "currentColor" }
                              : {}),
                          }
                        : undefined
                    }
                  />
                </EntityField>
              </div>
              <div className="ypp-typography flex flex-1 flex-col gap-6">
                <div className="flex items-center gap-5">
                  <span
                    className="flex h-[52px] w-[52px] items-center justify-center rounded-[6px]"
                    style={{
                      backgroundColor: resolveThemeColorCssValue(
                        props.iconBackgroundColor,
                      ),
                      color: iconForegroundColor,
                    }}
                  >
                    <DispatchHoursIconComponent
                      aria-hidden="true"
                      className={dispatchHoursIcon.className}
                    />
                  </span>
                  <EntityField
                    displayName="Dispatch Hours Title"
                    fieldId={props.dispatchHours.title.text.field}
                    constantValueEnabled={
                      props.dispatchHours.title.text.constantValueEnabled
                    }
                  >
                    <h2
                      className=""
                      style={{
                        ...resolveTextStyles(props.dispatchHours.title.styles),
                        color: resolveReadableForegroundColor(
                          props.dispatchHours.title.fontColor,
                          props.section.backgroundColor,
                          streamDocument,
                        ),
                      }}
                    >
                      {dispatchHoursTitle}
                    </h2>
                  </EntityField>
                </div>
                {hours ? (
                  <EntityField
                    displayName="Hours"
                    fieldId={props.dispatchHours.hours.field}
                    constantValueEnabled={
                      props.dispatchHours.hours.constantValueEnabled
                    }
                  >
                    <div
                      className={`flex flex-col ${props.dispatchHours.hoursStyles.alignment}`}
                    >
                      <HoursTable
                        hours={hours}
                        comingSoon={(streamDocument as any).comingSoon}
                        dayOfWeekNames={dayOfWeekNames}
                        startOfWeek={
                          props.dispatchHours.hoursStyles.startOfWeek
                        }
                        collapseDays={
                          props.dispatchHours.hoursStyles.collapseDays
                        }
                        intervalTranslations={{
                          isClosed: t("closed", "Closed"),
                          open24Hours: t("open24Hours", "Open 24 Hours"),
                          reopenDate: t("reopenDate", "Reopen Date"),
                          timeFormatLocale: locale,
                        }}
                      />
                    </div>
                  </EntityField>
                ) : null}
                {props.dispatchHours.hoursStyles.showAdditionalHoursText &&
                additionalHoursText ? (
                  <p className="max-w-[22rem]">{additionalHoursText}</p>
                ) : null}
              </div>
              <div className="ypp-typography flex flex-1 flex-col gap-6">
                <div className="flex items-center gap-5">
                  <span
                    className="flex h-[52px] w-[52px] items-center justify-center rounded-[6px]"
                    style={{
                      backgroundColor: resolveThemeColorCssValue(
                        props.iconBackgroundColor,
                      ),
                      color: iconForegroundColor,
                    }}
                  >
                    <PerksIconComponent
                      aria-hidden="true"
                      className={perksIcon.className}
                    />
                  </span>
                  <EntityField
                    displayName="Perks Title"
                    fieldId={props.perks.title.text.field}
                    constantValueEnabled={
                      props.perks.title.text.constantValueEnabled
                    }
                  >
                    <h2
                      className=""
                      style={{
                        ...resolveTextStyles(props.perks.title.styles),
                        color: resolveReadableForegroundColor(
                          props.perks.title.fontColor,
                          props.section.backgroundColor,
                          streamDocument,
                        ),
                      }}
                    >
                      {perksTitle}
                    </h2>
                  </EntityField>
                </div>
                <EntityField
                  displayName="Text List"
                  fieldId={props.perks.listText.text.field}
                  constantValueEnabled={
                    props.perks.listText.text.constantValueEnabled
                  }
                >
                  <ul
                    className="flex list-none flex-col gap-2 pl-0"
                    style={{
                      ...getBodyTextStyle(props.perks.listText.styles),
                      color: resolveReadableForegroundColor(
                        props.perks.listText.fontColor,
                        props.section.backgroundColor,
                        streamDocument,
                      ),
                    }}
                  >
                    {perks.map((item) => (
                      <li
                        key={item}
                        className="relative pl-6 before:absolute before:left-0 before:top-[7px] before:h-1.5 before:w-1.5 before:rounded-full before:bg-current before:content-['']"
                        style={{
                          color: "inherit",
                          fontFamily: "inherit",
                          fontSize: "inherit",
                          fontWeight: "inherit",
                          fontStyle: "inherit",
                          textTransform: "inherit",
                          letterSpacing: "inherit",
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </EntityField>
              </div>
            </div>
          </section>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const ProfessionalPracticeDetailsSection: SectionRenderConfig<ProfessionalPracticeDetailsSectionProps> =
  {
    render: (props) => (
      <TypographyScope>
        <ProfessionalPracticeDetailsSectionComponent {...props} />
      </TypographyScope>
    ),
  };
