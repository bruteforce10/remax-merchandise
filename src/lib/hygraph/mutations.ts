import { gql } from "graphql-request";

/** Content mutations (create/update/delete/publish) run via the write client. */

// ── Category ──────────────────────────────────────────────────────────────────
export const CREATE_CATEGORY = gql`
  mutation CreateCategory($data: CategoryCreateInput!) {
    createCategory(data: $data) {
      id
      slug
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($slug: String!, $data: CategoryUpdateInput!) {
    updateCategory(where: { slug: $slug }, data: $data) {
      id
      slug
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($slug: String!) {
    deleteCategory(where: { slug: $slug }) {
      id
    }
  }
`;

export const PUBLISH_CATEGORY = gql`
  mutation PublishCategory($slug: String!) {
    publishCategory(where: { slug: $slug }, to: PUBLISHED) {
      id
    }
  }
`;

// ── Product ───────────────────────────────────────────────────────────────────
export const CREATE_PRODUCT = gql`
  mutation CreateProduct($data: ProductCreateInput!) {
    createProduct(data: $data) {
      id
      slug
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($sku: String!, $data: ProductUpdateInput!) {
    updateProduct(where: { sku: $sku }, data: $data) {
      id
      slug
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($sku: String!) {
    deleteProduct(where: { sku: $sku }) {
      id
    }
  }
`;

export const PUBLISH_PRODUCT = gql`
  mutation PublishProduct($sku: String!) {
    publishProduct(where: { sku: $sku }, to: PUBLISHED) {
      id
    }
  }
`;

export const UNPUBLISH_PRODUCT = gql`
  mutation UnpublishProduct($sku: String!) {
    unpublishProduct(where: { sku: $sku }, from: PUBLISHED) {
      id
    }
  }
`;

// ── Banner ────────────────────────────────────────────────────────────────────
export const CREATE_BANNER = gql`
  mutation CreateBanner($data: BannerCreateInput!) {
    createBanner(data: $data) {
      id
    }
  }
`;

export const UPDATE_BANNER = gql`
  mutation UpdateBanner($id: ID!, $data: BannerUpdateInput!) {
    updateBanner(where: { id: $id }, data: $data) {
      id
    }
  }
`;

export const DELETE_BANNER = gql`
  mutation DeleteBanner($id: ID!) {
    deleteBanner(where: { id: $id }) {
      id
    }
  }
`;

export const PUBLISH_BANNER = gql`
  mutation PublishBanner($id: ID!) {
    publishBanner(where: { id: $id }, to: PUBLISHED) {
      id
    }
  }
`;

export const UNPUBLISH_BANNER = gql`
  mutation UnpublishBanner($id: ID!) {
    unpublishBanner(where: { id: $id }, from: PUBLISHED) {
      id
    }
  }
`;
