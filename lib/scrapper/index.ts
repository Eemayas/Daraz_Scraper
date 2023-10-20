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

        //Detail baout product
        const productTitle = jsonObject["product"]["title"];
        const productDescription = jsonObject["product"]["desc"];
        // const productPhotos = jsonObject["skuGalleries"]["0"];
        const productTag = jsonObject["tag"];
        const productURL = jsonObject["product"]["link"];
        const productCategories =
          jsonObject["skuInfos"]["0"]["dataLayer"]["pdt_category"];
        const productImage =
          // jsonObject["skuInfos"]["0"]["dataLayer"]["pdt_photo"];
          jsonObject["skuInfos"]["0"]["image"];
        // const productDiscount1 =
        //   jsonObject["skuInfos"]["0"]["dataLayer"]["pdt_discount"] ?? "0%";

        // const productOriginalPrice1 =
        //   jsonObject["skuInfos"]["0"]["dataLayer"]["pdt_price"];

        //Detail about product price
        const currencyCode =
          jsonObject["skuInfos"]["0"]["dataLayer"]["core"]["currencyCode"];
        const productDiscount =
          jsonObject["skuInfos"]["0"]["price"]["discount"];
        // "originalPrice": {
        //   "text": "Rs. 89",
        //   "value": 89
        // },
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

//   $("script").each((index, element) => {
//     const scriptContent = $(element).html();
//     const defineFunctionRegex =
//       /define\('app\/pc', \[.*?\], function\(app\) {(.*?)}/s;
//     const defineFunctionMatches =
//       scriptContent?.match(defineFunctionRegex);
//     if (defineFunctionMatches) {
//       const defineFunctionContent = defineFunctionMatches[1];
//       console.log(defineFunctionContent);
//     }
//   });
// })

//   $("script").each((index, element) => {
//     const scriptContent = $(element).html();
//     const tryBlockRegex = /try{(.*?)}/s;
//     const tryBlockMatches = scriptContent?.match(tryBlockRegex);
//     if (tryBlockMatches) {
//       const tryBlockContent = tryBlockMatches;
//       console.log(tryBlockContent);
//     }
//   });
// })

// $("script").each((index, element) => {
//   const scriptContent = $(element).html();
//   const pattern =
//     /define\('app\/pc', \[.*?\], function\(app\) {(.*?)}\)/s;
//   const match = scriptContent?.match(pattern);
//   if (match) {
//     const scriptContent = match[1];
//     console.log(
//       "Script content inside define function:",
//       scriptContent
//     );

//   } else {
//     // console.log("No match found.");
//   }

//   $("script").each((index, element) => {
//     const scriptContent = $(element).html();
//     const tryBlockRegex = /try{(.*?)}/s;
//     const tryBlockMatches = scriptContent?.match(tryBlockRegex);
//     if (tryBlockMatches) {
//       const tryBlockContent = tryBlockMatches[3];
//       // const tryBlockContent = ` app.run({"data":{"root":{"fields":{"seller":{"chatResponsiveRate":{"labelText":"Chat Response Rate","value":"85%")`;

//       const appRunRegex = /app\.run\((.*?)\)/s;
//       const appRunMatches = tryBlockContent.match(appRunRegex);
//       if (appRunMatches) {
//         const appRunContent = appRunMatches[1];
//         console.log(appRunContent);
//       }
//     }
//   });
// })

//   const response = await axios.get(url, options);
//   const $ = cheerio.load(response.data);

//   const title = $(".page-title").text().trim();

//   // const currentPrice = $(".price-box .price-final_price span.normal-price")
//   //   .text()
//   //   .trim();
//   const currentPrice = $("span.price-wrapper span.price ").text().trim();
//   // extractPrice(
//   //   $(".price-box .price-final_price span.normal-price")
//   // );

//   // const originalPrice = $(".price-box .price-final_price")["1"]["children"];
//   const originalPrice1 = $(".price-box .price-final_price").text();
//   console.log(response.data);
//   // console.log({ title, currentPrice, originalPrice1 });
//   // return data;

//   extractPrice(

// );

// const outOfStock =
//   $("#availability span").text().trim().toLowerCase() ===
//   "currently unavailable";

// const images =
//   $("#imgBlkFront").attr("data-a-dynamic-image") ||
//   $("#landingImage").attr("data-a-dynamic-image") ||
//   "{}";

// const imageUrls = Object.keys(JSON.parse(images));

// const currency = extractCurrency($(".a-price-symbol"));
// const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");

// const description = extractDescription($);
// // Construct data object with scraped information
// const data = {
//   // url,
//   // currency: currency || "Rs",
//   // image: imageUrls[0],
//   title,
//   // currentPrice: Number(currentPrice) || Number(originalPrice),
//   // originalPrice: Number(originalPrice) || Number(currentPrice),
//   // priceHistory: [],
//   // discountRate: Number(discountRate),
//   // category: "category",
//   // reviewsCount: 100,
//   // stars: 4.5,
//   // isOutOfStock: outOfStock,
//   // description,
//   // lowestPrice: Number(currentPrice) || Number(originalPrice),
//   // highestPrice: Number(originalPrice) || Number(currentPrice),
//   // averagePrice: Number(currentPrice) || Number(originalPrice),
// };
// // console.log(response.data);
