import type { SectionRenderConfig } from "@yext/visual-editor";
import { getBodyTextStyle, TypographyScope } from "../shared/typography";
import { useTranslation } from "react-i18next";
import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { parsePhoneNumber } from "awesome-phonenumber";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaSnapchatGhost,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import {
  EntityField,
  type EnhancedTranslatableCTA,
  type ThemeColor,
  VisibilityWrapper,
  type YextCTAField,
  type YextEntityField,
  Background,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  resolveComponentData,
  useDocument,
} from "@yext/visual-editor";
import {
  Address,
  AnalyticsScopeProvider,
  Link,
  type AddressType,
} from "@yext/pages-components";
import {
  getReadableForegroundColor as resolveReadableForegroundColor,
  type StyledTextProps,
} from "../shared/sectionHelpers";
export type SocialLink = {
  cta: YextCTAField;
  ariaLabel: string;
  icon:
    | "linkedin"
    | "instagram"
    | "youtube"
    | "facebook"
    | "pinterest"
    | "snapchat"
    | "tiktok";
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

export type FooterNavigationLink = {
  cta: YextCTAField;
};

export type ProfessionalPracticeFooterProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  brand: StyledTextProps;
  socialLinks: SocialLink[];
  navigationLinks: FooterNavigationLink[];
  metaAddress: YextEntityField<AddressType>;
  showRegion: boolean;
  showCountry: boolean;
  phones: PhoneFieldProps;
  website: YextCTAField;
};

const socialIcons: Record<
  SocialLink["icon"],
  React.ComponentType<{ className?: string }>
> = {
  linkedin: FaLinkedinIn,
  instagram: FaInstagram,
  youtube: FaYoutube,
  facebook: FaFacebookF,
  pinterest: FaPinterestP,
  snapchat: FaSnapchatGhost,
  tiktok: FaTiktok,
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

const ProfessionalPracticeFooterComponent: PuckComponent<
  ProfessionalPracticeFooterProps
> = (props) => {
  const streamDocument = useDocument();
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const footerTextColor = resolveReadableForegroundColor(
    undefined,
    props.section.backgroundColor,
    streamDocument,
  );
  const brandColor = resolveReadableForegroundColor(
    props.brand.fontColor,
    props.section.backgroundColor,
    streamDocument,
  );
  const brand =
    resolveComponentData(props.brand.text, locale, streamDocument) || "";
  const address = resolveComponentData(
    props.metaAddress,
    locale,
    streamDocument,
  ) as AddressType | undefined;
  const resolvedWebsite = resolveComponentData(
    props.website,
    locale,
    streamDocument,
  ) as EnhancedTranslatableCTA | undefined;
  const resolvedNavigationLinks = (props.navigationLinks ?? [])
    .map((item, index) => {
      const resolved = resolveComponentData(
        item.cta,
        locale,
        streamDocument,
      ) as EnhancedTranslatableCTA | undefined;
      const label =
        typeof resolved?.label === "string"
          ? resolved.label
          : (resolved?.label?.defaultValue ?? "");
      const link =
        typeof resolved?.link === "string"
          ? resolved.link
          : (resolved?.link?.defaultValue ?? "");

      if (!label || !link) {
        return null;
      }

      return {
        key: `${label}-${index}`,
        fieldId: item.cta.field,
        constantValueEnabled: item.cta.constantValueEnabled,
        label,
        link,
        linkType: resolved?.linkType ?? "URL",
        openInNewTab: resolved?.openInNewTab ?? false,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const resolvedSocialLinks = (props.socialLinks ?? [])
    .map((item, index) => {
      const resolved = resolveComponentData(
        item.cta,
        locale,
        streamDocument,
      ) as EnhancedTranslatableCTA | undefined;
      const link =
        typeof resolved?.link === "string"
          ? resolved.link
          : (resolved?.link?.defaultValue ?? "");

      if (!link) {
        return null;
      }

      return {
        key: `${item.ariaLabel}-${index}`,
        fieldId: item.cta.field,
        constantValueEnabled: item.cta.constantValueEnabled,
        link,
        linkType: resolved?.linkType ?? "URL",
        openInNewTab: resolved?.openInNewTab ?? false,
        ariaLabel: item.ariaLabel,
        icon: item.icon,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const phones = (props.phones.items ?? [])
    .map((item) => {
      const resolvedPhone = resolveComponentData(
        item.number,
        locale,
        streamDocument,
      );
      const trimmed =
        typeof resolvedPhone === "string" ? resolvedPhone.trim() : "";
      if (!trimmed) {
        return null;
      }
      return {
        fieldId: item.number.field,
        constantValueEnabled: item.number.constantValueEnabled,
        formatted: formatPhone(trimmed, props.phones.phoneFormat),
        telValue: trimmed.replace(/\D/g, ""),
        label: item.label?.trim() ?? "",
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const websiteLabel =
    typeof resolvedWebsite?.label === "string"
      ? resolvedWebsite.label
      : (resolvedWebsite?.label?.defaultValue ?? "");
  const websiteLink =
    typeof resolvedWebsite?.link === "string"
      ? resolvedWebsite.link
      : (resolvedWebsite?.link?.defaultValue ?? "");
  const websiteLinkType = resolvedWebsite?.linkType ?? "URL";
  const websiteOpenInNewTab = resolvedWebsite?.openInNewTab ?? true;

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`ProfessionalPracticeFooter${getAnalyticsScopeHash(props.id)}`}
      >
        <Background background={props.section.backgroundColor}>
          <footer
            data-ypp-scope="footer"
            style={{
              ...getSurfaceColorStyle(
                props.section.backgroundColor,
                streamDocument,
              ),
              color: footerTextColor,
            }}
          >
            <style>{`

              [data-ypp-scope="footer"] .ypp-typography a {

                text-decoration: none;
              }

              [data-ypp-scope="footer"] .footer__nav-link:hover,
              [data-ypp-scope="footer"] .footer__nav-link:focus-visible,
              [data-ypp-scope="footer"] .footer__website-link:hover,
              [data-ypp-scope="footer"] .footer__website-link:focus-visible {
                text-decoration: underline;
              }

              @media (max-width: 1023px) {
                [data-ypp-scope="footer"] .footer__website-link {
                  display: inline-block;
                  max-width: 100%;
                  overflow-wrap: anywhere;
                  word-break: break-word;
                }
              }
            `}</style>
            <div className="mx-auto flex max-w-[1280px] flex-col gap-[30px] px-4 pt-[60px] pb-[30px] md:px-8 md:py-[30px] xl:px-20 xl:py-[60px]">
              <div className="flex flex-col gap-[30px] lg:flex-row lg:items-center lg:justify-between">
                <EntityField
                  displayName="Brand"
                  fieldId={props.brand.text.field}
                  constantValueEnabled={props.brand.text.constantValueEnabled}
                >
                  <p
                    className="ypp-typography m-0"
                    style={{
                      ...getBodyTextStyle(props.brand.styles),
                      color: brandColor,
                    }}
                  >
                    {brand}
                  </p>
                </EntityField>
                <div className="flex items-center gap-[6px]">
                  {resolvedSocialLinks.map((item, index) => {
                    const SocialIcon = socialIcons[item.icon];
                    return (
                      <EntityField
                        key={item.key}
                        displayName="Social Link"
                        fieldId={item.fieldId}
                        constantValueEnabled={item.constantValueEnabled}
                      >
                        <Link
                          cta={{
                            link: item.link,
                            linkType: item.linkType,
                          }}
                          eventName={`footerSocial${index}`}
                          target={item.openInNewTab ? "_blank" : undefined}
                          rel={
                            item.openInNewTab
                              ? "noopener noreferrer"
                              : undefined
                          }
                          aria-label={item.ariaLabel}
                          className="flex h-8 w-8 items-center justify-center border border-current/20 p-1"
                        >
                          <SocialIcon className="h-[14px] w-[14px]" />
                        </Link>
                      </EntityField>
                    );
                  })}
                </div>
              </div>
              <nav className="ypp-typography grid grid-cols-2 gap-x-6 gap-y-4 md:flex md:flex-wrap md:items-center md:gap-8 xl:flex-nowrap">
                {resolvedNavigationLinks.map((item, index) => (
                  <EntityField
                    key={item.key}
                    displayName="Navigation Link"
                    fieldId={item.fieldId}
                    constantValueEnabled={item.constantValueEnabled}
                  >
                    <Link
                      cta={{
                        link: item.link,
                        linkType: item.linkType,
                      }}
                      eventName={`footerLink${index}`}
                      target={item.openInNewTab ? "_blank" : undefined}
                      rel={
                        item.openInNewTab ? "noopener noreferrer" : undefined
                      }
                      className="footer__nav-link"
                    >
                      {item.label}
                    </Link>
                  </EntityField>
                ))}
              </nav>
              <div className="ypp-typography flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:gap-8 xl:justify-between">
                {address ? (
                  <EntityField
                    displayName="Address"
                    fieldId={props.metaAddress.field}
                    constantValueEnabled={
                      props.metaAddress.constantValueEnabled
                    }
                  >
                    <Address
                      address={address}
                      showRegion={props.showRegion}
                      showCountry={props.showCountry}
                    />
                  </EntityField>
                ) : null}
                {phones.length > 0 ? (
                  <div className="flex flex-col gap-4 md:flex-1 md:flex-row md:flex-wrap md:items-center md:gap-x-8 md:gap-y-4">
                    {phones.map((phone, index) => (
                      <EntityField
                        key={`${phone.formatted}-${index}`}
                        displayName="Phone"
                        fieldId={phone.fieldId}
                        constantValueEnabled={phone.constantValueEnabled}
                      >
                        {props.phones.includeHyperlink ? (
                          <Link
                            cta={{
                              link: phone.telValue,
                              linkType: "PHONE",
                            }}
                            eventName={`footerPhone${index}`}
                            className="underline decoration-current underline-offset-2"
                          >
                            {phone.label
                              ? `${phone.label} ${phone.formatted}`
                              : phone.formatted}
                          </Link>
                        ) : (
                          <span>
                            {phone.label
                              ? `${phone.label} ${phone.formatted}`
                              : phone.formatted}
                          </span>
                        )}
                      </EntityField>
                    ))}
                  </div>
                ) : null}
                {websiteLabel && websiteLink ? (
                  <EntityField
                    displayName="Website"
                    fieldId={props.website.field}
                    constantValueEnabled={props.website.constantValueEnabled}
                  >
                    <Link
                      cta={{
                        link: websiteLink,
                        linkType: websiteLinkType,
                      }}
                      eventName="footerWebsite"
                      className="footer__website-link"
                      target={websiteOpenInNewTab ? "_blank" : undefined}
                      rel={
                        websiteOpenInNewTab ? "noopener noreferrer" : undefined
                      }
                    >
                      {websiteLabel}
                    </Link>
                  </EntityField>
                ) : null}
              </div>
            </div>
          </footer>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const ProfessionalPracticeFooter: SectionRenderConfig<ProfessionalPracticeFooterProps> =
  {
    render: (props) => (
      <TypographyScope>
        <ProfessionalPracticeFooterComponent {...props} />
      </TypographyScope>
    ),
  };
