import {
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  Grid,
  VStack,
  Heading,
  Link as ChakraLink,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";

// Basit ana grup tanımları ve anahtar kelimeler (Türkçe/İngilizce karışık)
const GROUPS = [
  {
    id: "electronics",
    title: "Elektronik",
    keywords: [
      "telefon",
      "elektronik",
      "tv",
      "televizyon",
      "bilgisayar",
      "laptop",
      "kamera",
    ],
  },
  {
    id: "home",
    title: "Ev & Yaşam",
    keywords: ["ev", "mobilya", "mutfak", "dekor", "bahçe", "yaşam"],
  },
  {
    id: "fashion",
    title: "Moda",
    keywords: [
      "giyim",
      "moda",
      "kıyafet",
      "ayakkabı",
      "aksesuar",
      "tshirt",
      "pantolon",
    ],
  },
  {
    id: "beauty",
    title: "Güzellik & Sağlık",
    keywords: ["güzellik", "kozmetik", "bakım", "saglık", "sağlık", "parfüm"],
  },
  {
    id: "sports",
    title: "Spor & Outdoor",
    keywords: ["spor", "fitness", "outdoor", "kamp", "bisiklet", "yürüyüş"],
  },
  {
    id: "kids",
    title: "Çocuk & Oyuncak",
    keywords: ["çocuk", "oyuncak", "bebek", "oyun", "lego"],
  },
];

function assignToGroups(categories) {
  const groups = GROUPS.map((g) => ({ ...g, items: [] }));
  const others = [];

  categories.forEach((cat) => {
    const name = (cat.name || "").toLowerCase();
    const matched = groups.find((g) =>
      g.keywords.some((kw) => name.includes(kw))
    );
    if (matched) matched.items.push(cat);
    else others.push(cat);
  });

  // Eğer bazı gruplar boşsa ve others çok fazlaysa, dağıt
  // Basit yaklaşım: eşit dağıtma yerine others'u 'Diğer' grubunda bırak
  return { groups, others };
}

const MegaMenu = ({ categories = [] }) => {
  const { groups, others } = assignToGroups(categories);

  // Kaç sütun gösterilecek: sadece ana gruplar (5-7 önerisi) kullanıyoruz
  const visibleGroups = groups.filter((g) => g.items.length > 0);
  const columns = Math.max(2, Math.min(visibleGroups.length, 6));

  return (
    <Popover
      trigger="hover"
      placement="bottom-start"
      isLazy
      openDelay={150}
      closeDelay={200}
    >
      <PopoverTrigger>
        <Button
          as="div"
          variant="ghost"
          fontWeight="medium"
          color={{ base: "gray.600", _dark: "gray.400" }}
          _hover={{ bg: { base: "gray.100", _dark: "gray.700" } }}
        >
          Kategoriler
        </Button>
      </PopoverTrigger>

      <PopoverContent w={{ base: "full", md: "760px" }} borderRadius="lg" p={4}>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={4}>
            {visibleGroups.map((group) => (
              <VStack key={group.id} align="start">
                <Heading size="sm">{group.title}</Heading>
                {group.items.slice(0, 8).map((c) => (
                  <ChakraLink
                    as={RouterLink}
                    to={`/category/${c._id}`}
                    key={c._id}
                    _hover={{ textDecoration: "none", color: "blue.600" }}
                    onClick={() => {
                      /* Popover kapanması otomatik */
                    }}
                  >
                    <Text fontSize="sm">
                      {c.name}{" "}
                      <Text as="span" color="gray.500" fontSize="xs">
                        ({c.productCount ?? 0})
                      </Text>
                    </Text>
                  </ChakraLink>
                ))}
              </VStack>
            ))}

            {/* Diğerler sütunu (eğer varsa) */}
            {others.length > 0 && (
              <VStack align="start">
                <Heading size="sm">Diğer Kategoriler</Heading>
                {others.slice(0, 12).map((c) => (
                  <ChakraLink
                    as={RouterLink}
                    to={`/category/${c._id}`}
                    key={c._id}
                    _hover={{ textDecoration: "none", color: "blue.600" }}
                  >
                    <Text fontSize="sm">
                      {c.name}{" "}
                      <Text as="span" color="gray.500" fontSize="xs">
                        ({c.productCount ?? 0})
                      </Text>
                    </Text>
                  </ChakraLink>
                ))}
              </VStack>
            )}
          </Grid>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

MegaMenu.propTypes = {
  categories: PropTypes.array,
};

export default MegaMenu;
