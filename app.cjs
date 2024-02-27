const axios = import('axios');
const { graphql } = import('graphql');

// Replace with placeholders from your environment variables
const G2A_API_URL = 'https://api.g2a.com/v2/products'; // Replace with actual G2A API URL
const G2A_CLIENT_ID = process.env.KsvHFDCUZrNgJaYh;
const G2A_CLIENT_SECRET = process.env.bGWSKqHIaauyItHxVXvaWGtstUKODRDU;

// Replace with placeholders from your Shopify admin panel
const SHOPIFY_API_URL = 'https://studying-plaza-radical-engines.trycloudflare.com//'; // Replace with actual Shopify API URL
const SHOPIFY_CLIENT_ID = process.env.db3a710f6c200ebd99df5a58736571d7;
const SHOPIFY_CLIENT_SECRET = process.env.fd60e0925f2861e167280a410803c198;

async function getG2AProducts(productIds) {
  const headers = {
    'Authorization': `Basic ${Buffer.from(`${G2A_CLIENT_ID}:${G2A_CLIENT_SECRET}`).toString('base64')}`,
    'Content-Type': 'application/json',
  };

  const query = `
    query GetProducts($productIds: [String!]!) {
      products(productIds: $productIds) {
        nodes {
          id
          name
          slug
          description
          images {
            url
          }
          variants {
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const variables = { productIds };

  try {
    const response = await axios.post(G2A_API_URL, { query, variables }, { headers });
    return response.data.data.products.nodes;
  } catch (error) {
    console.error('Error fetching G2A products:', error);
    throw error; // Re-throw the error for handling in the main function
  }
}

async function createShopifyProduct(productData) {
    const headers = {
      'X-Shopify-Access-Token': await getShopifyAccessToken(), // Implement logic to obtain and store the access token securely
      'Content-Type': 'application/json',
    };
  
    const mutation = `
      mutation CreateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            description
            images {
              src
            }
            variants {
              price
            }
          }
        }
      }
    `;
  
    const variables = { input: productData };
  
    try {
      const response = await axios.post(SHOPIFY_API_URL, { query: mutation, variables }, { headers });
      // Return the data here after successful response
      return response.data.data.productCreate.product;
    } catch (error) {
      console.error('Error creating Shopify product:', error);
      throw error; // Re-throw the error for handling in the main function
    }
  }
  