"use client";

import { ThemeToggle } from "@/components/theme-toggle";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Wifi } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Product = {
  id: number;
  name: string;
  price: number;
  points: number;
  img: string;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const products: Product[] = [
  { id: 1, name: "Protective Gloves",     price: 120,  points: 50,  img: "/images/protective-gloves.png" },
  { id: 2, name: "Reflective Jacket",     price: 300,  points: 110, img: "/images/reflective-jacket.png" },
  { id: 3, name: "Waste Collection Bag",  price: 80,   points: 30,  img: "/images/waste-bag.png"         },
  { id: 4, name: "IoT Fill-Level Sensor", price: 2500, points: 950, img: "/images/sensor.png"            },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Store() {
  const [cart, setCart] = useState<number[]>([]);

  const addToCart = (id: number) =>
    setCart((prev) => (prev.includes(id) ? prev : [...prev, id]));

  return (
    <div className="min-h-screen bg-white dark:bg-background transition-colors duration-300">
      <div className="max-w-2xl mx-auto pb-16">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-card px-6 pt-8 pb-5 shadow-sm sticky top-0 z-10 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-foreground">
              Volunteer Store
            </h1>
            <div className="flex items-center gap-2">
              {/* Dark mode toggle */}
              <ThemeToggle />

              {/* Cart icon with badge */}
              <div className="relative">
                <button
                  aria-label="Cart"
                  className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                >
                  <ShoppingCart size={20} className="text-blue-600 dark:text-blue-400" />
                </button>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pt-6 space-y-6">

          {/* ── SwachhPoints Wallet ──────────────────────────────────────── */}
          <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 p-5 rounded-2xl flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-gray-700 dark:text-blue-200 font-semibold text-lg">
              Your SwachhPoints
            </p>
            <p className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mt-1 tabular-nums">
              240
            </p>
            <button className="mt-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-full transition-colors text-sm">
              Redeem Now
            </button>
          </div>

          {/* ── Volunteer Gear ───────────────────────────────────────────── */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-foreground mb-3">
              🧤 Volunteer Gear
            </h2>

            <div className="space-y-3">
              {products.map((item) => (
                <Card
                  key={item.id}
                  className="rounded-2xl border border-gray-100 dark:border-border bg-gray-50 dark:bg-card shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-3 flex items-center gap-3">
                    {/* Product image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200 dark:bg-muted flex-shrink-0">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            `https://placehold.co/80x80/e5e7eb/9ca3af?text=${encodeURIComponent(item.name.slice(0, 6))}`;
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 dark:text-foreground text-base truncate">
                        {item.name}
                      </p>
                      <p className="text-gray-500 dark:text-muted-foreground text-sm mt-0.5">
                        ₹{item.price}
                      </p>
                      <p className="text-green-600 dark:text-green-400 font-semibold text-sm">
                        {item.points} pts
                      </p>
                    </div>

                    {/* Buy button */}
                    <button
                      onClick={() => addToCart(item.id)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors flex-shrink-0 ${
                        cart.includes(item.id)
                          ? "bg-green-500 dark:bg-green-600 text-white cursor-default"
                          : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                      }`}
                    >
                      {cart.includes(item.id) ? "Added ✓" : "Buy"}
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ── IoT Section ──────────────────────────────────────────────── */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 pb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-foreground mb-3">
              📡 IoT Tools{" "}
              <span className="text-xs font-normal text-gray-400 dark:text-muted-foreground">
                (Advanced Users)
              </span>
            </h2>

            <Card className="rounded-2xl border border-gray-100 dark:border-border bg-gray-50 dark:bg-card shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Wifi size={22} className="text-blue-600 dark:text-blue-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 dark:text-foreground font-semibold text-base">
                      Fill-Level Sensor
                    </p>
                    <p className="text-gray-500 dark:text-muted-foreground text-sm mt-0.5 leading-snug">
                      Monitor waste bins in real time with smart IoT integration.
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-green-600 dark:text-green-400 font-bold text-base">
                        950 pts
                      </span>
                      <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2 rounded-full transition-colors">
                        Redeem
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>
      </div>
    </div>
  );
}