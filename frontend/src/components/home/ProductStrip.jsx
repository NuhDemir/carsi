import {
  Box,
  Heading,
  HStack,
  IconButton,
  VStack,
  Text,
  Stack,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import React, { useRef, useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard.jsx";

const ProductStrip = ({
  title,
  products = [],
  showCountdown = false,
  productsDeals = [],
}) => {
  const ref = useRef(null);

  const scroll = (dir = "right") => {
    if (!ref.current) return;
    const el = ref.current;
    const delta =
      dir === "right" ? el.clientWidth * 0.6 : -el.clientWidth * 0.6;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  if (!products || products.length === 0) return null;

  // Build a quick map from product id to deal (if any) for efficient lookup
  const dealMap = new Map();
  if (productsDeals && productsDeals.length > 0) {
    productsDeals.forEach((d) => {
      const pid = d.product?._id || d.product;
      if (pid) dealMap.set(pid.toString(), d);
    });
  }

  // Simple Countdown component for individual deals
  const Countdown = ({ endsAt }) => {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
      if (!endsAt) return;
      const t = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(t);
    }, [endsAt]);
    if (!endsAt) return null;
    const diff = new Date(endsAt).getTime() - now;
    if (diff <= 0) return <Text fontSize="xs">Bitti</Text>;
    const secs = Math.floor(diff / 1000) % 60;
    const mins = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return (
      <Text fontSize="xs" color="red.500">
        {days > 0 ? `${days}g ` : ""}
        {String(hours).padStart(2, "0")}:{String(mins).padStart(2, "0")}:
        {String(secs).padStart(2, "0")}
      </Text>
    );
  };

  return (
    <Box my={8}>
      <Stack direction="row" align="center" justify="space-between" mb={4}>
        <Heading size="md">{title}</Heading>
        <HStack spacing={2}>
          <IconButton
            aria-label="left"
            icon={<ChevronLeftIcon />}
            size="sm"
            onClick={() => scroll("left")}
          />
          <IconButton
            aria-label="right"
            icon={<ChevronRightIcon />}
            size="sm"
            onClick={() => scroll("right")}
          />
        </HStack>
      </Stack>

      <Box ref={ref} overflowX="auto" whiteSpace="nowrap" py={2}>
        <HStack spacing={4} align="stretch">
          {products.map((p) => (
            <Box key={p._id || p.id} minW="220px" display="inline-block">
              <ProductCard product={p} horizontal />
              {showCountdown && (
                <VStack align="start" mt={2} spacing={0}>
                  {(() => {
                    const deal = dealMap.get((p._id || p.id || "").toString());
                    if (!deal)
                      return (
                        <Text fontSize="sm" color="gray.600">
                          &nbsp;
                        </Text>
                      );
                    return (
                      <>
                        {deal.discountPercent && (
                          <Text fontSize="sm" color="red.500">
                            {deal.discountPercent}% indirim
                          </Text>
                        )}
                        {deal.endsAt && <Countdown endsAt={deal.endsAt} />}
                      </>
                    );
                  })()}
                </VStack>
              )}
            </Box>
          ))}
        </HStack>
      </Box>
    </Box>
  );
};

export default ProductStrip;
