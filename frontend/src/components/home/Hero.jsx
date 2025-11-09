import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  Image,
  Link,
} from "@chakra-ui/react";
import React from "react";

const Hero = ({ campaign }) => {
  if (!campaign) return null;

  const { title, subtitle, ctaText = "İncele", ctaUrl = "/", image } = campaign;

  return (
    <Box as="section" w="100%" bg="gray.50" _dark={{ bg: "gray.800" }}>
      <Box maxW="container.xl" mx="auto" py={{ base: 8, md: 12 }} px={4}>
        <Stack
          direction={{ base: "column", md: "row" }}
          align="center"
          spacing={8}
        >
          <Stack flex="1" spacing={4}>
            <Heading as="h2" size="2xl" lineHeight="short">
              {title}
            </Heading>
            {subtitle && (
              <Text
                color="gray.600"
                _dark={{ color: "gray.300" }}
                fontSize="lg"
              >
                {subtitle}
              </Text>
            )}
            <Link href={ctaUrl} _hover={{ textDecoration: "none" }}>
              <Button colorScheme="blue" size="lg" mt={2}>
                {ctaText}
              </Button>
            </Link>
          </Stack>

          {image && (
            <Box flex="1" maxW={{ base: "100%", md: "50%" }}>
              {/*
                  Help LCP by giving the browser hints: loading="eager" and fetchPriority="high".
                  Also set a max height and objectFit so layout is stable (reduce CLS).
                  Note: best practice is to serve optimized images via a CDN or image proxy.
                */}
              <Image
                src={image}
                alt={title}
                borderRadius="md"
                boxShadow="md"
                w="100%"
                h={{ base: "220px", md: "340px" }}
                objectFit="cover"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default Hero;
