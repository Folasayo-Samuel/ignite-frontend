"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const ScrollToTop = () => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [pathname, isMounted]);

  return null;
};

export default ScrollToTop;
