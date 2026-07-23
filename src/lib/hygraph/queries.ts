import { gql } from "graphql-request";

/** Reusable GraphQL fragments + read queries for Hygraph content. */

export const CATEGORY_FIELDS = gql`
  fragment CategoryFields on Category {
    slug
    name
    icon
    material
    branding
    colors
    sizes
    description
  }
`;

export const CATEGORIES_QUERY = gql`
  ${CATEGORY_FIELDS}
  query Categories {
    categories(first: 100, orderBy: createdAt_ASC) {
      ...CategoryFields
    }
  }
`;

export const CATEGORY_BY_SLUG_QUERY = gql`
  ${CATEGORY_FIELDS}
  query CategoryBySlug($slug: String!) {
    category(where: { slug: $slug }) {
      ...CategoryFields
    }
  }
`;

export const PRODUCT_FIELDS = gql`
  fragment ProductFields on Product {
    sku
    slug
    name
    shortDescription
    price
    stock
    badge
    category {
      slug
    }
  }
`;

export const PRODUCTS_QUERY = gql`
  ${PRODUCT_FIELDS}
  query Products {
    products(
      first: 500
      where: { publishStatus: Published }
      orderBy: createdAt_DESC
    ) {
      ...ProductFields
    }
  }
`;

export const PRODUCT_BY_SLUG_QUERY = gql`
  ${PRODUCT_FIELDS}
  query ProductBySlug($slug: String!) {
    products(where: { slug: $slug, publishStatus: Published }, first: 1) {
      ...ProductFields
    }
  }
`;

export const PRODUCTS_BY_CATEGORY_QUERY = gql`
  ${PRODUCT_FIELDS}
  query ProductsByCategory($slug: String!) {
    products(
      first: 500
      where: { publishStatus: Published, category: { slug: $slug } }
      orderBy: createdAt_DESC
    ) {
      ...ProductFields
    }
  }
`;
