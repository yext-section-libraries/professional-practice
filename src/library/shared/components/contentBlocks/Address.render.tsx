import type { SectionRenderConfig } from "@yext/visual-editor";
import { useTranslation } from "react-i18next";
import { PuckComponent } from "@puckeditor/core";
import {
  AddressType,
  getDirections,
  Address as RenderAddress,
} from "@yext/pages-components";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { EntityField } from "@yext/visual-editor/section-library-support";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
import { CTA, CTAVariant } from "@yext/visual-editor/section-library-support";
import { pt } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { ThemeColor } from "@yext/visual-editor/section-library-support";
/** Props for the Address component */
export interface AddressProps {
  data: {
    /** The address data to display. */
    address: YextEntityField<AddressType>;
  };

  styles: {
    /**
     * Whether to include the region in the Address
     * @defaultValue true
     */
    showRegion?: boolean;

    /**
     * Whether to include the country in the Address
     * @defaultValue false
     */
    showCountry?: boolean;

    /** Whether to include a "Get Directions" CTA to Google Maps */
    showGetDirectionsLink: boolean;

    /** The variant of the get directions button */
    ctaVariant: CTAVariant;

    color?: ThemeColor;
  };

  /** @internal */
  parentData?: {
    field: string;
    address?: AddressType;
  };
}

const AddressComponent: PuckComponent<AddressProps> = (props) => {
  const { data, styles, puck, parentData } = props;
  const { t, i18n } = useTranslation();
  const streamDocument = useDocument();

  const resolvedColor = styles.color;
  const address =
    parentData?.address ??
    (resolveComponentData(
      data.address,
      i18n.language,
      streamDocument,
    ) as unknown as AddressType | undefined);

  const listings = streamDocument.ref_listings ?? [];
  const listingsLink = getDirections(
    undefined,
    listings,
    undefined,
    { provider: "google" },
    undefined,
  );
  const addressLink = getDirections(
    address as AddressType,
    undefined,
    undefined,
    { provider: "google" },
  );

  // If ref_listings doesn't exist or the address field selected isn't just address, use the address link.
  const useAddressLink: boolean =
    data.address.field !== "address" || !streamDocument.ref_listings?.length;

  // Only show the address component if there's at least one line of the address
  const showAddress = !!(
    address?.line1 ||
    address?.line2 ||
    address?.city ||
    address?.region ||
    address?.postalCode
  );

  return showAddress ? (
    <div className="flex flex-col gap-2 text-body-fontSize font-body-fontWeight font-body-fontFamily">
      <EntityField
        displayName={parentData ? parentData.field : pt("address", "Address")}
        fieldId={data.address.field}
        constantValueEnabled={!parentData && data.address.constantValueEnabled}
      >
        <RenderAddress
          address={address}
          showRegion={styles.showRegion}
          showCountry={styles.showCountry}
        />
      </EntityField>
      {(useAddressLink ? !!addressLink : !!listingsLink) &&
        styles.showGetDirectionsLink && (
          <CTA
            setPadding={true}
            ctaType="getDirections"
            eventName={`getDirections`}
            link={useAddressLink ? addressLink : listingsLink}
            label={t("getDirections", "Get Directions")}
            linkType="DRIVING_DIRECTIONS"
            normalizeLink={false}
            target="_blank"
            variant={styles.ctaVariant}
            color={resolvedColor}
          />
        )}
    </div>
  ) : puck.isEditing ? (
    <div className="min-h-[40px]"></div>
  ) : (
    <></>
  );
};

export const Address: SectionRenderConfig<AddressProps> = {
  render: (props) => <AddressComponent {...props} />,
};
