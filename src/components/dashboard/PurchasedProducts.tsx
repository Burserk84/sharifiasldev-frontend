"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PurchasedProducts() {
  const [orders, setOrders] = useState<unknown[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          // --- DEBUG LOG ---
          console.log("--- [Frontend] Data received from /api/orders:", data);
          setOrders(data);
        } else {
          console.error("Failed to fetch orders from /api/orders");
        }
      } catch (error) {
        console.error("Error fetching orders in component:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-white text-right">
        محصولات خریداری شده
      </h2>
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-gray-700 p-4 rounded-md">
              <h3 className="font-bold text-lg text-white mb-4">
                سفارش #{order.attributes.orderId}
              </h3>
              <div className="space-y-3">
                {order.attributes.products.data.map((product: unknown) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-600">
                      <Image
                        src={`${STRAPI_URL}${product.attributes.productImage.data[0].attributes.url}`}
                        alt={product.attributes.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Link
                      href={`/product/${product.attributes.slug}`}
                      className="text-orange-400 hover:underline"
                    >
                      {product.attributes.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-right">
          شما هنوز هیچ محصولی خریداری نکرده‌اید.
        </p>
      )}
    </div>
  );
}
