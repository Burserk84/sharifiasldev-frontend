"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel, { EmblaCarouselType } from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/definitions";

interface ProductSliderProps {
  products: Product[];
}

export default function ProductSlider({ products }: ProductSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    direction: "rtl",
  });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      {/* The Slider Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {products.map((product) => {
            const imageUrl = product.productImage?.[0]?.url
              ? `http://localhost:1337${product.productImage[0].url}`
              : "https://placehold.co/1600x900/1f2937/f97616?text=No+Image";

            const descriptionText =
              product.description?.[0]?.children?.[0]?.text ||
              "No description available.";

            const formattedPrice = new Intl.NumberFormat("fa-IR", {
              style: "currency",
              currency: "IRR",
              maximumFractionDigits: 0,
            })
              .format(product.price * 10)
              .replace("ریال", "تومان");

            return (
              <div
                className="flex-shrink-0 flex-grow-0 basis-full md:basis-1/2 lg:basis-1/3 p-4"
                key={product.id}
              >
                <Link
                  href={`/product/${product.slug}`}
                  className="block h-full group"
                >
                  <div className="bg-gray-700 p-6 rounded-lg shadow-xl text-right h-full flex flex-col transition-transform duration-300 group-hover:-translate-y-2">
                    <div className="relative w-full aspect-video rounded-md overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col flex-grow mt-6">
                      <h3 className="text-xl font-bold">{product.name}</h3>
                      <p className="mt-2 text-gray-400 leading-relaxed flex-grow">
                        {descriptionText}
                      </p>
                      <p className="mt-4 text-2xl font-bold text-orange-400 text-left">
                        {formattedPrice}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slider Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-0 sm:-px-4">
        <button
          onClick={scrollPrev}
          disabled={prevBtnDisabled}
          className="w-12 h-12 rounded-full bg-gray-800/50 hover:bg-gray-800 disabled:opacity-30 flex items-center justify-center text-white transition -mr-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          onClick={scrollNext}
          disabled={nextBtnDisabled}
          className="w-12 h-12 rounded-full bg-gray-800/50 hover:bg-gray-800 disabled:opacity-30 flex items-center justify-center text-white transition -ml-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
