"use client";
import { scrapeAndStoreProduct } from "@/lib/action";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

const Searchbar = () => {
  const [searchPrompt, setSetsearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isValidDarazProductURL = (url: string) => {
    try {
      const parsedURL = new URL(url);
      const hostName = parsedURL.hostname;
      if (
        hostName.includes("daraz.com") ||
        hostName.includes("daraz.") ||
        hostName.endsWith("daraz")
      ) {
        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidDarazProductURL(searchPrompt);
    // alert(isValidLink ? "Valid Link" : "Invalid Link");

    if (!isValidLink) {
      return alert("Please Provide a Valid Daraz Product URL");
    }

    try {
      setIsLoading(true);
      const productId = await scrapeAndStoreProduct(searchPrompt);
      router.push(`/products/${productId}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchPrompt}
        onChange={(e) => setSetsearchPrompt(e.target.value)}
        placeholder="Enter product Link"
        className="searchbar-input"
      ></input>
      <button
        disabled={searchPrompt === ""}
        type="submit"
        className="searchbar-btn"
      >
        {isLoading ? "Searching...." : "Search"}
      </button>
    </form>
  );
};

export default Searchbar;
