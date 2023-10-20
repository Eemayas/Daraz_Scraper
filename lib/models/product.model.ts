import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, unique: true },
    currency: { type: String, required: true },
    image: { type: String, required: true },
    title: { type: String, required: true },
    category: [{ type: String }],

    currentPrice: {
      text: { type: String, required: true },
      value: { type: Number, required: true },
    },
    originalPrice: {
      text: { type: String, required: true },
      value: { type: Number, required: true },
    },
    priceHistory: [
      {
        price: {
          text: { type: String, required: true },
          value: { type: Number, required: true },
        },
        date: { type: Date, default: Date.now },
      },
    ],
    discountRate: { type: String },
    description: { type: String },

    reviewsCount: { type: Number },
    rateCount: { type: Number },
    reviewScores: [{ type: Number }],
    productQuantityValue: { type: Number },
    stars: { type: Number },

    isOutOfStock: { type: Boolean, default: false },

    productBrand: { type: String },

    sellerShopName: { type: String },
    sellerShopURL: { type: String },
    positiveSellerRating: { type: String },

    users: [{ email: { type: String, required: true } }],
    default: [],

    lowestPrice: {
      text: { type: String, required: true },
      value: { type: Number, required: true },
    },
    highestPrice: {
      text: { type: String, required: true },
      value: { type: Number, required: true },
    },
    averagePrice: {
      text: { type: String, required: true },
      value: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
