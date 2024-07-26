import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  Input,
  Textarea,
  Text,
  Switch,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { BASE_URL } from "../constant";
import axios from "axios";
import { Product } from "./ProductTable";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  fetchProduct: () => void;
  currentData?: Product;
}

const ProductForm = ({
  isOpen,
  onClose,
  fetchProduct,
  currentData,
}: ProductFormProps) => {
  const toast = useToast();
  const [product, setProduct] = useState({
    id:currentData?.id || 0,
    name:currentData?.name || "",
    description:currentData?.description || "",
    price:currentData?.price || "",
    isInStore:currentData?.isInStore || false,
  });
  const onSave = () => {
    if(currentData?.id)
    {
      editProduct()
    }else{
      addProduct()
    }

  };

  const editProduct = () => {
    axios
      .put(BASE_URL + "Product/" + currentData?.id,product)
      .then(() => {
        onClose();
        fetchProduct();
        toast({
          title: "Product Updated.",
          description: "Product Updated Succesfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addProduct = () => {
    axios
      .post(BASE_URL + "Product", product)
      .then((response) => {
        onClose();
        fetchProduct();
        toast({
          title: "Product Added.",
          description: "Product Added Succesfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(product);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack gap={3} alignItems={"self-start"}>
              <Input
                type="text"
                placeholder="Name"
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
              />
              <Textarea
                placeholder="Description"
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Price"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
              />
              <Text>Is in Store?</Text>
              <Switch
                isChecked={product.isInStore}
                onChange={(e) =>
                  setProduct({ ...product, isInStore: e.target.checked })
                }
              />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={onSave} colorScheme="teal">
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProductForm;
