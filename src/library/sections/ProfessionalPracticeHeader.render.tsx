import type { SectionRenderConfig } from "@yext/visual-editor";
import { resolveTextStyles, TypographyScope } from "../shared/typography";
import * as React from "react";
import { PuckComponent } from "@puckeditor/core";
import { useTranslation } from "react-i18next";
import {
  AnalyticsScopeProvider,
  Link,
  type ComplexImageType,
  type ImageType,
  type LinkType,
  useAnalytics,
} from "@yext/pages-components";
import {
  Background,
  ComprehensiveCTA,
  type ComprehensiveCTAValue,
  EntityField,
  Image,
  type StreamDocument,
  type StyledImageValue,
  type StyledLinkValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableString,
  VisibilityWrapper,
  type YextEntityField,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  isDarkColor,
  normalizeLink,
  normalizeThemeColorToken,
  resolveComponentData,
  useDocument,
} from "@yext/visual-editor";
type SharedHeaderVariant =
  | "centerLogoSplitNav"
  | "logoLeftInlineNav"
  | "stackedNavBelow"
  | "utilityTopRow";

export type SharedHeaderLink = {
  label: TranslatableString;
  link: TranslatableString;
  linkType: LinkType;
  normalizeLink: boolean;
  openInNewTab: boolean;
};

export type SharedHeaderAction = SharedHeaderLink & {
  iconImage: {
    image: YextEntityField<
      ImageType | ComplexImageType | TranslatableAssetImage
    >;
    aspectRatio: number;
    imageConstrain: "fixed" | "filled";
    styles?: StyledImageValue;
  };
};

export type ProfessionalPracticeHeaderProps = {
  variant: SharedHeaderVariant;
  section: {
    visibleOnLivePage: boolean;
    backgroundColor: ThemeColor;
    dividerColor?: ThemeColor;
  };
  navigation: {
    show: boolean;
    links: SharedHeaderLink[];
    fontColor?: ThemeColor;
    styles: StyledLinkValue;
  };
  utilities: {
    show: boolean;
    items: SharedHeaderAction[];
  };
  cta: {
    show: boolean;
    items: Array<{
      cta: ComprehensiveCTAValue;
    }>;
  };
  logoImage: {
    show: boolean;
    image: YextEntityField<
      ImageType | ComplexImageType | TranslatableAssetImage
    >;
    url: YextEntityField<TranslatableString>;
    aspectRatio: number;
    imageConstrain: "fixed" | "filled";
    styles?: StyledImageValue;
  };
};

const hasExplicitThemeColor = (color?: ThemeColor): color is ThemeColor => {
  return Boolean(normalizeThemeColorToken(color));
};

const resolveBorderRadius = (value?: string): string | undefined => {
  if (!value || value === "default") {
    return undefined;
  }

  return value;
};

const getTextStyles = ({
  color,
  styles,
}: {
  color?: ThemeColor;
  styles: Pick<
    StyledLinkValue,
    | "fontFamily"
    | "fontSize"
    | "fontWeight"
    | "fontStyle"
    | "textTransform"
    | "letterSpacing"
  >;
}): React.CSSProperties => {
  return {
    color: getThemeColorCssValue(color),
    ...resolveTextStyles(styles),
  };
};

const resolveString = (
  value: TranslatableString | undefined,
  locale: string,
  streamDocument: StreamDocument,
): string => {
  if (!value) {
    return "";
  }

  return resolveComponentData(value, locale, streamDocument) || "";
};

const normalizeResolvedLink = ({
  link,
  linkType,
  shouldNormalize,
}: {
  link: string;
  linkType: LinkType;
  shouldNormalize: boolean;
}): string => {
  if (!shouldNormalize) {
    return link;
  }

  return normalizeLink(link, linkType);
};

const hasImageSource = (
  image: ImageType | ComplexImageType | TranslatableAssetImage | undefined,
): boolean => {
  if (!image || typeof image !== "object") {
    return false;
  }

  if ("url" in image && typeof image.url === "string" && image.url.trim()) {
    return true;
  }

  if (
    "image" in image &&
    image.image &&
    typeof image.image === "object" &&
    "url" in image.image &&
    typeof image.image.url === "string" &&
    image.image.url.trim()
  ) {
    return true;
  }

  return false;
};

const SharedHeaderDefaultUtilityIcon = () => (
  <svg
    fill="none"
    height="32"
    viewBox="0 0 32 32"
    width="32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m11.75 9h.25c.275 0 .5.225.5.5s-.225.5-.5.5h-.25c-.9656 0-1.75.7844-1.75 1.75v.25c0 .275-.225.5-.5.5s-.5-.225-.5-.5v-.25c0-1.5187 1.2313-2.75 2.75-2.75zm-2.25 5c.275 0 .5.225.5.5v3c0 .275-.225.5-.5.5s-.5-.225-.5-.5v-3c0-.275.225-.5.5-.5zm13 0c.275 0 .5.225.5.5v3c0 .275-.225.5-.5.5s-.5-.225-.5-.5v-3c0-.275.225-.5.5-.5zm0-1.5c-.275 0-.5-.225-.5-.5v-.25c0-.9656-.7844-1.75-1.75-1.75h-.25c-.275 0-.5-.225-.5-.5s.225-.5.5-.5h.25c1.5188 0 2.75 1.2313 2.75 2.75v.25c0 .275-.225.5-.5.5zm.5 7.5v.25c0 1.5188-1.2312 2.75-2.75 2.75h-.25c-.275 0-.5-.225-.5-.5s.225-.5.5-.5h.25c.9656 0 1.75-.7844 1.75-1.75v-.25c0-.275.225-.5.5-.5s.5.225.5.5zm-13 0v.25c0 .9656.7844 1.75 1.75 1.75h.25c.275 0 .5.225.5.5s-.225.5-.5.5h-.25c-1.5187 0-2.75-1.2312-2.75-2.75v-.25c0-.275.225-.5.5-.5s.5.225.5.5zm4.5 3c-.275 0-.5-.225-.5-.5s.225-.5.5-.5h3c.275 0 .5.225.5.5s-.225.5-.5.5zm-.5-13.5c0-.275.225-.5.5-.5h3c.275 0 .5.225.5.5s-.225.5-.5.5h-3c-.275 0-.5-.225-.5-.5z"
      fill="none"
      stroke="currentColor"
    />
  </svg>
);

const ProfessionalPracticeHeaderComponent: PuckComponent<
  ProfessionalPracticeHeaderProps
> = (props) => {
  const { t, i18n } = useTranslation();
  const analytics = useAnalytics();
  const streamDocument = useDocument<StreamDocument>();
  const locale = i18n.language;
  const [menuOpen, setMenuOpen] = React.useState(false);

  const resolvedLogoImage = resolveComponentData(
    props.logoImage.image,
    locale,
    streamDocument,
  ) as ImageType | ComplexImageType | TranslatableAssetImage | undefined;
  const resolvedLogoUrl = (
    resolveComponentData(props.logoImage.url, locale, streamDocument) || ""
  )
    .toString()
    .trim();
  const logoUrl = resolvedLogoUrl
    ? normalizeLink(resolvedLogoUrl, "URL")
    : undefined;

  const showNavigation = props.navigation.show;
  const showUtilities = props.utilities.show;
  const showCta = props.cta.show;
  const showLogo = props.logoImage.show;

  const headerSurfaceStyle = getSurfaceColorStyle(
    props.section.backgroundColor,
    streamDocument,
  );
  const headerCtaFallbackColor = isDarkColor(
    props.section.backgroundColor,
    streamDocument,
  )
    ? "#ffffff"
    : "#000000";
  const navigationColor = hasExplicitThemeColor(props.navigation.fontColor)
    ? props.navigation.fontColor
    : undefined;
  const dividerColorValue = getThemeColorCssValue(props.section.dividerColor);
  const dividerStyle = dividerColorValue
    ? ({ borderColor: dividerColorValue } as React.CSSProperties)
    : undefined;

  const navigationTextStyles = getTextStyles({
    color: navigationColor,
    styles: props.navigation.styles,
  });

  const logoWrapperStyle: React.CSSProperties = {
    height: "50px",
    width:
      props.logoImage.aspectRatio > 0
        ? `${50 * props.logoImage.aspectRatio}px`
        : "50px",
    borderRadius: resolveBorderRadius(props.logoImage.styles?.borderRadius),
    overflow: "hidden",
  };

  const logoStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: props.logoImage.aspectRatio > 0 ? "cover" : "contain",
  };

  const navigationLinks = (props.navigation.links ?? [])
    .map((item, index) => {
      const label = resolveString(item.label, locale, streamDocument);
      const resolvedLink = resolveString(item.link, locale, streamDocument);
      const link = normalizeResolvedLink({
        link: resolvedLink,
        linkType: item.linkType,
        shouldNormalize: item.normalizeLink,
      });

      return {
        eventName: `headerLink${index}`,
        label,
        link,
        linkType: item.linkType,
        openInNewTab: item.openInNewTab,
      };
    })
    .filter((item) => Boolean(item.label) && Boolean(item.link));

  const utilityLinks = (props.utilities.items ?? [])
    .map((item, index) => {
      const label = resolveString(item.label, locale, streamDocument);
      const resolvedLink = resolveString(item.link, locale, streamDocument);
      const link = normalizeResolvedLink({
        link: resolvedLink,
        linkType: item.linkType,
        shouldNormalize: item.normalizeLink,
      });
      const resolvedIconImage = resolveComponentData(
        item.iconImage.image,
        locale,
        streamDocument,
      ) as ImageType | ComplexImageType | TranslatableAssetImage | undefined;

      return {
        eventName: `headerUtility${index}`,
        iconImage: resolvedIconImage,
        iconImageProps: item.iconImage,
        label,
        link,
        linkType: item.linkType,
        openInNewTab: item.openInNewTab,
      };
    })
    .filter((item) => Boolean(item.label) && Boolean(item.link));

  const ctaItems = props.cta.items ?? [];
  const topBarCtaItem = ctaItems[0];
  const drawerCtaItems = topBarCtaItem ? ctaItems.slice(1) : ctaItems;
  const mobileDrawerCtaItems = ctaItems;

  const renderUtilityIcon = ({
    iconImage,
    iconImageProps,
  }: {
    iconImage?: ImageType | ComplexImageType | TranslatableAssetImage;
    iconImageProps: SharedHeaderAction["iconImage"];
  }) => {
    if (!hasImageSource(iconImage)) {
      return <SharedHeaderDefaultUtilityIcon />;
    }

    const resolvedIconImage = iconImage as
      ImageType | ComplexImageType | TranslatableAssetImage;
    const iconHeight = 32;
    const iconAspectRatio =
      iconImageProps.aspectRatio > 0 ? iconImageProps.aspectRatio : 1;
    const iconUrl =
      "image" in resolvedIconImage
        ? typeof resolvedIconImage.image?.url === "string"
          ? resolvedIconImage.image.url
          : undefined
        : typeof resolvedIconImage.url === "string"
          ? resolvedIconImage.url
          : undefined;
    if (!iconUrl) {
      return <SharedHeaderDefaultUtilityIcon />;
    }
    const wrapperStyle: React.CSSProperties = {
      width: `${iconHeight * iconAspectRatio}px`,
      height: `${iconHeight}px`,
      borderRadius: resolveBorderRadius(iconImageProps.styles?.borderRadius),
      overflow: "hidden",
      flexShrink: 0,
    };

    const imageStyle: React.CSSProperties = {
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "cover",
    };

    return (
      <div style={wrapperStyle}>
        <img
          alt=""
          src={iconUrl}
          className="h-full w-full"
          style={imageStyle}
        />
      </div>
    );
  };

  const desktopSharedRightSide = (
    <div className="flex items-center justify-end gap-3">
      {showUtilities && utilityLinks.length > 0 ? (
        <div className="flex items-center gap-2">
          {utilityLinks.map((item) => (
            <Link
              key={`${item.eventName}-${item.link}`}
              cta={{
                link: item.link,
                linkType: item.linkType,
              }}
              eventName={item.eventName}
              target={item.openInNewTab ? "_blank" : undefined}
              rel={item.openInNewTab ? "noopener noreferrer" : undefined}
              aria-label={item.label}
              className="inline-flex h-8 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-80"
              style={{
                color: getThemeColorCssValue(navigationColor),
              }}
            >
              <EntityField
                displayName="Utility Icon Image"
                fieldId={item.iconImageProps.image.field}
                constantValueEnabled={
                  item.iconImageProps.image.constantValueEnabled
                }
              >
                <span className="flex h-full items-center justify-center">
                  {renderUtilityIcon({
                    iconImage: item.iconImage,
                    iconImageProps: item.iconImageProps,
                  })}
                </span>
              </EntityField>
            </Link>
          ))}
        </div>
      ) : null}
      {showCta ? (
        <div className="flex flex-wrap items-center justify-end gap-3">
          {ctaItems.map((item, index) => (
            <EntityField
              key={`desktop-cta-${index}`}
              displayName="Header Call to Action"
              fieldId={item.cta.data.cta.field}
              constantValueEnabled={item.cta.data.cta.constantValueEnabled}
            >
              <ComprehensiveCTA
                value={item.cta as Partial<ComprehensiveCTAValue>}
                eventName={`headerCta${index}`}
                className={`inline-flex h-10 items-center justify-center px-5${
                  ["primary", "solid"].includes(item.cta.styles.variant ?? "")
                    ? " ypp-cta-button ypp-cta-button--filled"
                    : ["secondary", "outline"].includes(
                          item.cta.styles.variant ?? "",
                        )
                      ? " ypp-cta-button ypp-cta-button--outline"
                      : ""
                }`}
                style={
                  ["primary", "secondary", "solid", "outline"].includes(
                    item.cta.styles.variant ?? "",
                  )
                    ? {
                        textDecoration: "none",
                        ...(["secondary", "outline"].includes(
                          item.cta.styles.variant ?? "",
                        ) && !hasExplicitThemeColor(item.cta.styles.color)
                          ? { color: headerCtaFallbackColor }
                          : {}),
                        ...(["secondary", "outline"].includes(
                          item.cta.styles.variant ?? "",
                        )
                          ? { borderColor: "currentColor" }
                          : {}),
                      }
                    : undefined
                }
              />
            </EntityField>
          ))}
        </div>
      ) : null}
    </div>
  );

  const renderNavigationLinks = (orientation: "row" | "column") => (
    <nav aria-label={t("primaryNavigation", "Primary navigation")}>
      <ul
        className={
          orientation === "row"
            ? "flex flex-wrap items-center gap-6"
            : "flex flex-col gap-5"
        }
      >
        {showNavigation
          ? navigationLinks.map((item) => (
              <li key={`${item.eventName}-${item.link}`}>
                <Link
                  cta={{
                    link: item.link,
                    linkType: item.linkType,
                  }}
                  eventName={item.eventName}
                  target={item.openInNewTab ? "_blank" : undefined}
                  rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
                  style={navigationTextStyles}
                >
                  <span>{item.label}</span>
                </Link>
              </li>
            ))
          : null}
      </ul>
    </nav>
  );

  const renderLogo = () => {
    if (!showLogo || !hasImageSource(resolvedLogoImage)) {
      return null;
    }

    const logoContent = (
      <EntityField
        displayName="Logo Image"
        fieldId={props.logoImage.image.field}
        constantValueEnabled={props.logoImage.image.constantValueEnabled}
      >
        <div style={logoWrapperStyle}>
          <Image
            image={
              resolvedLogoImage as
                ImageType | ComplexImageType | TranslatableAssetImage
            }
            className="h-full w-full"
            style={logoStyle}
          />
        </div>
      </EntityField>
    );

    return logoUrl ? (
      <EntityField
        displayName="Logo URL"
        fieldId={props.logoImage.url.field}
        constantValueEnabled={props.logoImage.url.constantValueEnabled}
      >
        <Link
          cta={{
            link: logoUrl,
            linkType: "URL",
          }}
          eventName="headerLogo"
          className="inline-flex transition-opacity hover:opacity-80"
          aria-label={t("logo", "Logo")}
        >
          {logoContent}
        </Link>
      </EntityField>
    ) : (
      logoContent
    );
  };

  const logoElement = renderLogo();

  const desktopVariantContent = (() => {
    if (props.variant === "centerLogoSplitNav") {
      return (
        <div className="grid min-h-[82px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-8 px-12 py-4">
          <div className="flex items-center justify-start">
            {renderNavigationLinks("row")}
          </div>
          {logoElement ? (
            <div className="flex items-center justify-center">
              {logoElement}
            </div>
          ) : null}
          <div>{desktopSharedRightSide}</div>
        </div>
      );
    }

    if (props.variant === "logoLeftInlineNav") {
      return (
        <div className="flex min-h-[82px] items-center gap-8 px-12 py-4">
          {logoElement ? <div className="shrink-0">{logoElement}</div> : null}
          <div className="min-w-0 flex-1">{renderNavigationLinks("row")}</div>
          <div className="min-w-0 w-full max-w-[calc((100%-theme(spacing.32))/2)]">
            {desktopSharedRightSide}
          </div>
        </div>
      );
    }

    if (props.variant === "stackedNavBelow") {
      return (
        <div className="py-4">
          <div className="flex items-center justify-between gap-8 pb-4">
            {logoElement ? (
              <div className="shrink-0 px-12">{logoElement}</div>
            ) : null}
            <div className="min-w-0 w-full max-w-[calc((100%-theme(spacing.16))/2)] px-12">
              {desktopSharedRightSide}
            </div>
          </div>
          <div className="border-t border-current/10 pt-4" style={dividerStyle}>
            <div className="px-12">{renderNavigationLinks("row")}</div>
          </div>
        </div>
      );
    }

    return (
      <div className="pt-5">
        <div className="flex items-center justify-end pb-4">
          <div className="ml-auto min-w-0 w-full max-w-[calc((100%-theme(spacing.16))/2)] px-12">
            {desktopSharedRightSide}
          </div>
        </div>
        <div
          className="flex min-h-[82px] items-center gap-8 border-t border-current/10 px-12"
          style={dividerStyle}
        >
          {logoElement ? <div className="shrink-0">{logoElement}</div> : null}
          <div className="min-w-0 flex-1">{renderNavigationLinks("row")}</div>
          {showCta ? null : <div className="w-10" />}
        </div>
      </div>
    );
  })();

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <Background
        as="header"
        data-ypp-scope="header"
        background={props.section.backgroundColor}
        className="relative"
        style={{
          ...headerSurfaceStyle,
          ...(getThemeColorCssValue(navigationColor)
            ? { color: getThemeColorCssValue(navigationColor) }
            : {}),
        }}
      >
        <style>{`
          [data-ypp-scope="header"] .ypp-cta-button {
            transition:
              background-color 0.2s ease,
              border-color 0.2s ease,
              color 0.2s ease,
              box-shadow 0.2s ease,
              transform 0.2s ease;
          }

          [data-ypp-scope="header"] .ypp-cta-button:hover,
          [data-ypp-scope="header"] .ypp-cta-button:focus-visible {
            transform: translateY(-1px);
            box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
          }

          [data-ypp-scope="header"] .ypp-cta-button--filled:hover,
          [data-ypp-scope="header"] .ypp-cta-button--filled:focus-visible {
            box-shadow:
              0 10px 20px rgba(15, 23, 42, 0.12),
              inset 0 0 0 999px rgba(0, 0, 0, 0.06);
          }

          [data-ypp-scope="header"] .ypp-cta-button--outline:hover,
          [data-ypp-scope="header"] .ypp-cta-button--outline:focus-visible {
            background-color: color-mix(in srgb, currentColor 8%, transparent);
            border-color: currentColor;
            box-shadow:
              0 10px 20px rgba(15, 23, 42, 0.12),
              inset 0 0 0 1px currentColor;
          }
        `}</style>
        <div className="hidden lg:block">{desktopVariantContent}</div>

        <div className="flex min-h-[82px] items-center gap-4 px-6 md:px-8 lg:hidden">
          <div className="min-w-0 flex-1">{logoElement}</div>
          {showCta && topBarCtaItem ? (
            <div className="hidden items-center gap-3 md:flex">
              <EntityField
                displayName="Header Call to Action"
                fieldId={topBarCtaItem.cta.data.cta.field}
                constantValueEnabled={
                  topBarCtaItem.cta.data.cta.constantValueEnabled
                }
              >
                <ComprehensiveCTA
                  value={topBarCtaItem.cta as Partial<ComprehensiveCTAValue>}
                  eventName="responsiveTopBarCta"
                  className={`inline-flex h-10 items-center justify-center px-5${
                    ["primary", "solid"].includes(
                      topBarCtaItem.cta.styles.variant ?? "",
                    )
                      ? " ypp-cta-button ypp-cta-button--filled"
                      : ["secondary", "outline"].includes(
                            topBarCtaItem.cta.styles.variant ?? "",
                          )
                        ? " ypp-cta-button ypp-cta-button--outline"
                        : ""
                  }`}
                  style={
                    ["primary", "secondary", "solid", "outline"].includes(
                      topBarCtaItem.cta.styles.variant ?? "",
                    )
                      ? {
                          textDecoration: "none",
                          ...(["secondary", "outline"].includes(
                            topBarCtaItem.cta.styles.variant ?? "",
                          ) &&
                          !hasExplicitThemeColor(topBarCtaItem.cta.styles.color)
                            ? { color: headerCtaFallbackColor }
                            : {}),
                          ...(["secondary", "outline"].includes(
                            topBarCtaItem.cta.styles.variant ?? "",
                          )
                            ? { borderColor: "currentColor" }
                            : {}),
                        }
                      : undefined
                  }
                />
              </EntityField>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => {
              analytics?.track({
                action: menuOpen ? "COLLAPSE" : "EXPAND",
                eventName: "mobileMenuToggle",
              });
              setMenuOpen((currentValue) => !currentValue);
            }}
            aria-expanded={menuOpen}
            aria-label={
              menuOpen
                ? t("closeNavigationMenu", "Close navigation menu")
                : t("openNavigationMenu", "Open navigation menu")
            }
            className="inline-flex h-10 w-10 items-center justify-center rounded-full"
            style={{
              color: getThemeColorCssValue(navigationColor),
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              {menuOpen ? (
                <path d="M6 6 18 18M18 6 6 18" />
              ) : (
                <>
                  <path d="M3 7h18" />
                  <path d="M3 12h18" />
                  <path d="M3 17h18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {menuOpen ? (
          <div
            className="absolute inset-x-0 top-full z-20 max-h-[calc(100vh-82px)] overflow-y-auto px-6 py-6 md:px-8 lg:hidden"
            style={headerSurfaceStyle}
          >
            <div className="space-y-6">
              {navigationLinks.length > 0
                ? renderNavigationLinks("column")
                : null}
              {((showUtilities && utilityLinks.length > 0) || showCta) && (
                <div
                  className="border-t border-current/10 pt-6"
                  style={dividerStyle}
                >
                  {showCta && drawerCtaItems.length > 0 ? (
                    <div className="hidden flex-col gap-3 md:flex">
                      {drawerCtaItems.map((item, index) => (
                        <EntityField
                          key={`tablet-cta-${index}`}
                          displayName="Header Call to Action"
                          fieldId={item.cta.data.cta.field}
                          constantValueEnabled={
                            item.cta.data.cta.constantValueEnabled
                          }
                        >
                          <ComprehensiveCTA
                            value={item.cta as Partial<ComprehensiveCTAValue>}
                            eventName={`tabletOverlayCta${index}`}
                            className={`inline-flex h-10 w-full items-center justify-center px-5${
                              ["primary", "solid"].includes(
                                item.cta.styles.variant ?? "",
                              )
                                ? " ypp-cta-button ypp-cta-button--filled"
                                : ["secondary", "outline"].includes(
                                      item.cta.styles.variant ?? "",
                                    )
                                  ? " ypp-cta-button ypp-cta-button--outline"
                                  : ""
                            }`}
                            style={
                              [
                                "primary",
                                "secondary",
                                "solid",
                                "outline",
                              ].includes(item.cta.styles.variant ?? "")
                                ? {
                                    textDecoration: "none",
                                    ...(["secondary", "outline"].includes(
                                      item.cta.styles.variant ?? "",
                                    ) &&
                                    !hasExplicitThemeColor(
                                      item.cta.styles.color,
                                    )
                                      ? { color: headerCtaFallbackColor }
                                      : {}),
                                    ...(["secondary", "outline"].includes(
                                      item.cta.styles.variant ?? "",
                                    )
                                      ? { borderColor: "currentColor" }
                                      : {}),
                                  }
                                : undefined
                            }
                          />
                        </EntityField>
                      ))}
                    </div>
                  ) : null}
                  {showCta && mobileDrawerCtaItems.length > 0 ? (
                    <div className="flex flex-col gap-3 md:hidden">
                      {mobileDrawerCtaItems.map((item, index) => (
                        <EntityField
                          key={`mobile-cta-${index}`}
                          displayName="Header Call to Action"
                          fieldId={item.cta.data.cta.field}
                          constantValueEnabled={
                            item.cta.data.cta.constantValueEnabled
                          }
                        >
                          <ComprehensiveCTA
                            value={item.cta as Partial<ComprehensiveCTAValue>}
                            eventName={`mobileOverlayCta${index}`}
                            className={`inline-flex h-10 w-full items-center justify-center px-5${
                              ["primary", "solid"].includes(
                                item.cta.styles.variant ?? "",
                              )
                                ? " ypp-cta-button ypp-cta-button--filled"
                                : ["secondary", "outline"].includes(
                                      item.cta.styles.variant ?? "",
                                    )
                                  ? " ypp-cta-button ypp-cta-button--outline"
                                  : ""
                            }`}
                            style={
                              [
                                "primary",
                                "secondary",
                                "solid",
                                "outline",
                              ].includes(item.cta.styles.variant ?? "")
                                ? {
                                    textDecoration: "none",
                                    ...(["secondary", "outline"].includes(
                                      item.cta.styles.variant ?? "",
                                    ) &&
                                    !hasExplicitThemeColor(
                                      item.cta.styles.color,
                                    )
                                      ? { color: headerCtaFallbackColor }
                                      : {}),
                                    ...(["secondary", "outline"].includes(
                                      item.cta.styles.variant ?? "",
                                    )
                                      ? { borderColor: "currentColor" }
                                      : {}),
                                  }
                                : undefined
                            }
                          />
                        </EntityField>
                      ))}
                    </div>
                  ) : null}
                  {showUtilities && utilityLinks.length > 0 ? (
                    <div
                      className={`flex flex-wrap items-center gap-3${
                        showCta &&
                        (drawerCtaItems.length > 0 ||
                          mobileDrawerCtaItems.length > 0)
                          ? " mt-6"
                          : ""
                      }`}
                    >
                      {utilityLinks.map((item) => (
                        <Link
                          key={`${item.eventName}-mobile-${item.link}`}
                          cta={{
                            link: item.link,
                            linkType: item.linkType,
                          }}
                          eventName={`${item.eventName}Mobile`}
                          target={item.openInNewTab ? "_blank" : undefined}
                          rel={
                            item.openInNewTab
                              ? "noopener noreferrer"
                              : undefined
                          }
                          aria-label={item.label}
                          className="inline-flex h-8 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-80"
                          style={{
                            color: getThemeColorCssValue(navigationColor),
                          }}
                        >
                          <span className="flex h-full items-center justify-center">
                            {renderUtilityIcon({
                              iconImage: item.iconImage,
                              iconImageProps: item.iconImageProps,
                            })}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </Background>
    </VisibilityWrapper>
  );
};

export const ProfessionalPracticeHeader: SectionRenderConfig<ProfessionalPracticeHeaderProps> =
  {
    render: (props) => (
      <TypographyScope>
        <AnalyticsScopeProvider
          name={`ProfessionalPracticeHeader${getAnalyticsScopeHash(props.id)}`}
        >
          <ProfessionalPracticeHeaderComponent {...props} />
        </AnalyticsScopeProvider>
      </TypographyScope>
    ),
  };
