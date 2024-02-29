import { StyleSheet } from "react-native";
import {
  Card,
  Image,
  Text,
  VStack,
  Heading,
  Box,
  // Button,
  ButtonText,
} from "@gluestack-ui/themed";
import { Button } from "../button/Button";

interface ProductCardProps {

};

export const ProductCard = (props: ProductCardProps) => {
  return (
    <Card p="$5" borderRadius="$lg" maxWidth={420} m="$3">
      <Image
        alt="Product"
        mb="$6"
        h={240}
        // width="$full"
        // borderRadius="$md"
        source={{
          uri: "https://rainbowplantlife.com/wp-content/uploads/2021/06/dal-makhani-flatlay-closeup-with-spoon-819x1024.jpg",
        }}
        style={styles.image}
      />
      <Text
        fontSize="$sm"
        fontStyle="normal"
        fontFamily="$heading"
        fontWeight="$normal"
        lineHeight="$sm"
        mb="$2"
        sx={{
          color: "$textLight700",
          _dark: {
            color: "$textDark200",
          },
        }}
      >
        Indian
      </Text>
      <VStack mb="$6">
        <Heading size="md" fontFamily="$heading" mb="$4">
          Dal Makhani
        </Heading>
        <Text size="sm" fontFamily="$heading">
          Dal Makhani is one of the most popular Indian dals, and this vegan version makes no sacrifices. The flavors are complex and the texture is velvety and luxurious.
        </Text>
      </VStack>
      <Box
        flexDirection="column"
        sx={{
          "@sm": {
            flexDirection: "row",
          },
        }}
      >
        <Button
          px="$4"
          py="$2"
          // fontFamily="$heading"
          mr="$0"
          mb="$3"
          sx={{
            "@sm": {
              mr: "$3",
              mb: "$0",
              flex: 1,
            },
          }}
        >
          <ButtonText size="sm">Order</ButtonText>
        </Button>
        {/* <Button
          px="$4"
          py="$2"
          variant="outline"
          // fontFamily="$heading"
          borderColor="$borderLight300"
          $dark-borderColor="$backgroundDark600"
          sx={{
            "@sm": {
              flex: 1,
            },
          }}
        >
          <ButtonText
            size="sm"
            color="$textLight600"
            $dark-color="$textDark400"
          >
            Wishlist
          </ButtonText>
        </Button> */}
      </Box>
    </Card>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    borderRadius: 8,
  },
});
