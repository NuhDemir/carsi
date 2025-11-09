import { HStack, Box, Text, Icon } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import React from "react";
import { FiTruck, FiShield, FiRepeat, FiHeadphones } from "react-icons/fi";

const ICON_MAP = {
  truck: FiTruck,
  shield: FiShield,
  repeat: FiRepeat,
  headset: FiHeadphones,
};

const TrustBar = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <Box my={6}>
      <HStack spacing={6} justify="center" flexWrap="wrap">
        {items.map((it, idx) => {
          // support both string items and object items from backend: { key, label, icon }
          const label =
            typeof it === "string" ? it : it?.label || it?.key || "–";
          const iconKey = typeof it === "string" ? null : it.icon;
          const IconComp = iconKey
            ? ICON_MAP[iconKey] || CheckCircleIcon
            : CheckCircleIcon;

          return (
            <HStack
              key={idx}
              spacing={2}
              px={3}
              py={2}
              borderRadius="md"
              bg="white"
              _dark={{ bg: "gray.700" }}
              boxShadow="sm"
            >
              <Icon as={IconComp} color="green.400" />
              <Text fontSize="sm">{label}</Text>
            </HStack>
          );
        })}
      </HStack>
    </Box>
  );
};

export default TrustBar;
