type Address = {
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
};

type GeoCoordinates = {
  latitude: number;
  longitude: number;
};

type SchemaBaseParams = {
  name: string;
  description: string;
  url: string;
  logo?: string;
  image?: string;
  telephone?: string;
  email?: string;
  address?: Address;
  geo?: GeoCoordinates;
  priceRange?: string;
  taxID?: string;
};

/**
 * Generates JSON-LD schema for a Local Business.
 */
export function generateLocalBusinessSchema(params: SchemaBaseParams) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    ...buildCommonSchemaProperties(params),
  };
}

/**
 * Generates JSON-LD schema for a Professional Service.
 */
export function generateProfessionalServiceSchema(params: SchemaBaseParams) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    ...buildCommonSchemaProperties(params),
  };
}

function buildCommonSchemaProperties(params: SchemaBaseParams) {
  const schema: Record<string, unknown> = {
    name: params.name,
    description: params.description,
    url: params.url,
  };

  if (params.logo) schema.logo = params.logo;
  if (params.image) schema.image = params.image;
  if (params.telephone) schema.telephone = params.telephone;
  if (params.email) schema.email = params.email;
  if (params.priceRange) schema.priceRange = params.priceRange;
  if (params.taxID) schema.taxID = params.taxID;

  if (params.address) {
    schema.address = {
      "@type": "PostalAddress",
      ...params.address,
    };
  }

  if (params.geo) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: params.geo.latitude,
      longitude: params.geo.longitude,
    };
  }

  return schema;
}
