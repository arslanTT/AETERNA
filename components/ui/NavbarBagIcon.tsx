"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

export default function NavbarBagIcon() {
  const itemCount = useCartStore((s) => s.itemCount);

  return (
    <div
      className={`
        fixed top-6 right-6 z-50
        transition-all duration-500 ease-out
        ${itemCount > 0 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}
      `}
      aria-hidden={itemCount === 0}
    >
      <div className="relative p-2 rounded-md border border-border-default bg-bg-surface/80 backdrop-blur-md">
        <ShoppingBag className="h-5 w-5 text-text-primary" />
        {itemCount > 0 && (
          <span
            className="
              absolute -top-1.5 -right-1.5
              w-5 h-5 rounded-full
              bg-accent-primary text-bg-base
              text-[10px] font-semibold
              flex items-center justify-center
              shadow-[0_0_12px_rgba(201,168,76,0.5)]
            "
          >
            {itemCount}
          </span>
        )}
      </div>
    </div>
  );
}
