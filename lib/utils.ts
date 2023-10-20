// export function extractPrice(...elements: any) {
//   for (const element of elements) {
//     const priceText = element.text().trim();

//     if (priceText) return priceText.replace(/[^\d.]/g, "");
//   }
//   return "";
// }
// export function extractCurrency(element: any) {
//   const currencyText = element.text().trim().slice(0, 1);

//   return currencyText ? currencyText : "";
// }
// // Extracts description from two possible elements from daraz
// export function extractDescription($: any) {
//   // these are possible elements holding description of the product
//   const selectors = [
//     ".a-unordered-list .a-list-item",
//     ".a-expander-content p",
//     // Add more selectors here if needed
//   ];

//   for (const selector of selectors) {
//     const elements = $(selector);
//     if (elements.length > 0) {
//       const textContent = elements
//         .map((_: any, element: any) => $(element).text().trim())
//         .get()
//         .join("\n");
//       return textContent;
//     }
//   }

//   // If no matching elements were found, return an empty string
//   return "";
// }

import { Price, PriceHistoryItem, Product } from "@/types";

const Notification = {
  WELCOME: "WELCOME",
  CHANGE_OF_STOCK: "CHANGE_OF_STOCK",
  LOWEST_PRICE: "LOWEST_PRICE",
  THRESHOLD_MET: "THRESHOLD_MET",
};

const THRESHOLD_PERCENTAGE = 40;

// Extracts and returns the price from a list of possible elements.
export function extractPrice(...elements: any) {
  for (const element of elements) {
    const priceText = element.text().trim();

    if (priceText) {
      const cleanPrice = priceText.replace(/[^\d.]/g, "");

      let firstPrice;

      if (cleanPrice) {
        firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
      }

      return firstPrice || cleanPrice;
    }
  }

  return "";
}

// Extracts and returns the currency symbol from an element.
export function extractCurrency(element: any) {
  const currencyText = element.text().trim().slice(0, 1);
  return currencyText ? currencyText : "";
}

// Extracts description from two possible elements from daraz
export function extractDescription($: any) {
  // these are possible elements holding description of the product
  const selectors = [
    ".a-unordered-list .a-list-item",
    ".a-expander-content p",
    // Add more selectors here if needed
  ];

  for (const selector of selectors) {
    const elements = $(selector);
    if (elements.length > 0) {
      const textContent = elements
        .map((_: any, element: any) => $(element).text().trim())
        .get()
        .join("\n");
      return textContent;
    }
  }

  // If no matching elements were found, return an empty string
  return "";
}

export function getHighestPrice(priceList: PriceHistoryItem[]) {
  let highestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price.value > highestPrice.price.value) {
      highestPrice = priceList[i];
    }
  }

  return highestPrice.price;
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
  let lowestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price.value < lowestPrice.price.value) {
      lowestPrice = priceList[i];
    }
  }

  return lowestPrice.price;
}

export function getAveragePrice(priceList: PriceHistoryItem[]): Price {
  const sumOfPrices = priceList.reduce(
    (acc: number, curr) => acc + curr.price.value,
    0
  );
  const averagePrice = sumOfPrices / priceList.length || 0;
  const averages: Price = {
    text: `Rs ${averagePrice}`,
    value: averagePrice,
  };
  return averages;
}

export const getEmailNotifType = (
  scrapedProduct: Product,
  currentProduct: Product
) => {
  const lowestPrice = getLowestPrice(currentProduct.priceHistory);

  if (scrapedProduct.currentPrice < lowestPrice) {
    return Notification.LOWEST_PRICE as keyof typeof Notification;
  }
  if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
    return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
  }
  if (
    Number(scrapedProduct.discountRate.replace("%", "")) >= THRESHOLD_PERCENTAGE
  ) {
    return Notification.THRESHOLD_MET as keyof typeof Notification;
  }

  return null;
};

export const formatNumber = (num: number = 0) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
