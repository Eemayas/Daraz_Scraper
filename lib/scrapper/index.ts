import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "../utils";
import { Product } from "@/types";
export async function scrapeDarazProduct(
  url: string
): Promise<Product | undefined> {
  if (!url) return;

  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password: password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };

  try {
    let data: Product | undefined = undefined;
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);
    let match;
    $("script").each((_index, element) => {
      const scriptContent = $(element).html();
      const pattern = /define\('app\/pc', \[.*?\], function\(app\) {(.*?)}\)/s;

      const matchs = scriptContent?.match(pattern);
      if (matchs) {
        match = matchs;
        const scriptContent = match[1];
        const tryBlockMatches = scriptContent.substring(34) + "}";
        // to find any filed uncomment below code and go json formattor
        // console.log(tryBlockMatches);
        let jsonObject = JSON.parse(tryBlockMatches);
        jsonObject = jsonObject["data"]["root"]["fields"];
        // console.log(JSON.stringify(jsonObject));

        //Detail about seller
        const sellerShopName = jsonObject["seller"]["name"];
        const sellerShopURL = jsonObject["seller"]["url"];
        const positiveSellerRating = jsonObject["seller"]["percentRate"];

        //Details about product rating
        const productRating = jsonObject["review"]["ratings"]["average"];
        const reviewCount = jsonObject["review"]["ratings"]["reviewCount"];
        const rateCount = jsonObject["review"]["ratings"]["rateCount"];
        const reviewScores = jsonObject["review"]["ratings"]["scores"];

        //Detail about the prodct Brand
        const productBrand = jsonObject["product"]["brand"]["name"];

        //Detail about product
        const productTitle = jsonObject["product"]["title"];
        const productDescription =
          jsonObject["product"]["highlights"] + jsonObject["product"]["desc"];
        // const productPhotos = jsonObject["skuGalleries"]["0"];
        const productTag = jsonObject["tag"];
        const productURL = jsonObject["product"]["link"];
        const productCategories =
          jsonObject["skuInfos"]["0"]["dataLayer"]["pdt_category"];
        const productImage = jsonObject["skuInfos"]["0"]["image"];

        //Detail about product price
        const currencyCode =
          jsonObject["skuInfos"]["0"]["dataLayer"]["core"]["currencyCode"];
        const productDiscount =
          jsonObject["skuInfos"]["0"]["price"]["discount"];

        const productOriginalPrice =
          jsonObject["skuInfos"]["0"]["price"]["originalPrice"];
        const productSalePrice =
          jsonObject["skuInfos"]["0"]["price"]["salePrice"];

        //Detail abouth availability of product stock
        const productQuantityValue =
          jsonObject["skuInfos"]["0"]["quantity"]["limit"]["max"];
        const outOfStock = productQuantityValue == 0 ? true : false;

        data = {
          default: [],
          url,
          currency: currencyCode == "NPR" ? "Rs" : currencyCode || "RS",
          image: productImage,
          title: productTitle,
          category: productCategories,
          // productPhotos,
          // productTag,

          currentPrice: productSalePrice || productOriginalPrice,
          originalPrice: productOriginalPrice || productSalePrice,
          priceHistory: [],
          discountRate: productDiscount,

          description: productDescription,

          reviewsCount: reviewCount,
          rateCount,
          reviewScores,
          productQuantityValue,
          stars: productRating,

          isOutOfStock: outOfStock,

          productBrand,

          sellerShopName,
          sellerShopURL,
          positiveSellerRating,
          lowestPrice: productSalePrice || productOriginalPrice,
          highestPrice: productOriginalPrice || productSalePrice,
          averagePrice: productSalePrice || productOriginalPrice,
        };
        // return data;
      }
    });

    return data;
  } catch (error: any) {
    throw new Error(`Failed to scrape Daraz Product: ${error.message}`);
  }
}
