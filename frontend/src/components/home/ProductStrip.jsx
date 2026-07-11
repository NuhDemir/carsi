import {
  Box,
  Heading,
  HStack,
  IconButton,
  VStack,
  Text,
  Stack,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import React, { useRef, useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard.jsx";
import PropTypes from "prop-types";

const ProductStrip = ({
  title,
  products = [],
  showCountdown = false,
  productsDeals = [],
  hideScrollbar = true,
}) => {
  const ref = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const buttonBg = useColorModeValue("white", "gray.800");
  const buttonHoverBg = useColorModeValue("gray.50", "gray.700");
  const headingColor = useColorModeValue("gray.800", "white");
  const dealBg = useColorModeValue("red.50", "red.900");

  // Check scroll position
  const checkScroll = () => {
    if (!ref.current) return;
    const el = ref.current;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = ref.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [products]);

  const scroll = (dir = "right") => {
    if (!ref.current) return;
    const el = ref.current;
    const delta =
      dir === "right" ? el.clientWidth * 0.7 : -el.clientWidth * 0.7;
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
    if (diff <= 0)
      return (
        <Text fontSize="xs" fontWeight="medium">
          Bitti
        </Text>
      );
    const secs = Math.floor(diff / 1000) % 60;
    const mins = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return (
      <Text fontSize="xs" fontWeight="bold" color="red.500">
        {days > 0 ? `${days}g ` : ""}
        {String(hours).padStart(2, "0")}:{String(mins).padStart(2, "0")}:
        {String(secs).padStart(2, "0")}
      </Text>
    );
  };

  return (
    <Box my={{ base: 6, md: 10 }} position="relative">
      {/* Header with Navigation Buttons */}
      <Flex
        direction="row"
        align="center"
        justify="space-between"
        mb={{ base: 4, md: 6 }}
        px={{ base: 1, md: 0 }}
      >
        <Heading 
          size={{ base: "md", md: "lg" }}
          fontWeight="bold"
          color={headingColor}
        >
          {title}
        </Heading>        {/* Navigation Buttons - Only show if scrollable */}
        {products.length > 3 && (
          <HStack spacing={2} display={{ base: "none", sm: "flex" }}>
            <IconButton
              aria-label="Önceki"
              icon={<ChevronLeftIcon boxSize={6} />}
              size="md"
              variant="outline"
              borderRadius="full"
              bg={buttonBg}
              borderColor={borderColor}
              _hover={{
                bg: buttonHoverBg,
                transform: "scale(1.05)",
                boxShadow: "md",
              }}
              _active={{ transform: "scale(0.95)" }}
              transition="all 0.2s"
              onClick={() => scroll("left")}
              isDisabled={!canScrollLeft}
              opacity={canScrollLeft ? 1 : 0.4}
            />
            <IconButton
              aria-label="Sonraki"
              icon={<ChevronRightIcon boxSize={6} />}
              size="md"
              variant="outline"
              borderRadius="full"
              bg={buttonBg}
              borderColor={borderColor}
              _hover={{
                bg: buttonHoverBg,
                transform: "scale(1.05)",
                boxShadow: "md",
              }}
              _active={{ transform: "scale(0.95)" }}
              transition="all 0.2s"
              onClick={() => scroll("right")}
              isDisabled={!canScrollRight}
              opacity={canScrollRight ? 1 : 0.4}
            />
          </HStack>
        )}
      </Flex>

      {/* Products Scroll Container */}
      <Box
        ref={ref}
        className="product-strip-container"
        overflowX="auto"
        overflowY="hidden"
        whiteSpace="nowrap"
        py={3}
        px={1}
        sx={
          hideScrollbar
            ? {
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }
            : {}
        }
      >
        <HStack spacing={{ base: 3, md: 4 }} align="stretch" pb={2}>
          {products.map((p) => (
            <Box
              key={p._id || p.id}
              minW={{ base: "180px", sm: "220px", md: "240px" }}
              maxW={{ base: "180px", sm: "220px", md: "240px" }}
              display="inline-block"
              whiteSpace="normal"
            >
              <ProductCard product={p} />
              {showCountdown && (
                <VStack align="start" mt={2} spacing={1} px={2}>
                  {(() => {
                    const deal = dealMap.get((p._id || p.id || "").toString());
                    if (!deal) return null;
                    return (
                      <>
                        {deal.discountPercent && (
                          <Text 
                            fontSize="sm" 
                            fontWeight="bold" 
                            color="red.500"
                            bg={dealBg}
                            px={2}
                            py={1}
                            borderRadius="md"
                          >
                            %{deal.discountPercent} İndirim
                          </Text>
                        )}
                        {deal.endsAt && (
                          <HStack spacing={1}>
                            <Text fontSize="xs" color="gray.500">
                              Kalan:
                            </Text>
                            <Countdown endsAt={deal.endsAt} />
                          </HStack>
                        )}
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

ProductStrip.propTypes = {
  title: PropTypes.string.isRequired,
  products: PropTypes.array,
  showCountdown: PropTypes.bool,
  productsDeals: PropTypes.array,
  hideScrollbar: PropTypes.bool,
};

export default ProductStrip;
