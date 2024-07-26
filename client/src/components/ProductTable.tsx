import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Badge,
  useDisclosure,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  PopoverFooter,
  useToast,
} from "@chakra-ui/react";
import ColorModeSwitch from "./ColorModeSwitch";
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constant";
import ProductSkeleton from "./ProductSkeleton";
import ProductForm from "./ProductForm";

export interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  isInStore: boolean;
}

const ProductTable = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  //UseStates
  const [currentData, setCurrentData] = useState<Product>({} as Product);
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState("");

  //function to help us fetch our data with axios, handle our error

  const toast = useToast();
  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(BASE_URL + "Product")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getProduct = (id: number) => {
    axios
      .get(BASE_URL + "Product/" + id)
      .then((res) => {
        setCurrentData(res.data);
        onOpen();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (isLoading) return <ProductSkeleton />;

  const handleAdd = () => {
    onOpen();
    setCurrentData({} as Product);
  };


    const handleDelete = (id:number) => {
      axios.delete(BASE_URL+'Product/'+id)
      .then(() => {
        toast({
          title: "Product Deleted.",
          description: "Product Deleted",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        fetchData();
      }).catch(error => {
        console.log(error);
        
      })
    }

  return (
    <>
      <ColorModeSwitch />
      <Box m={32} shadow={"md"} rounded={"md"}>
        <Flex justifyContent={"space-between"} px={"5"}>
          <Heading fontSize={25}>Product List</Heading>
          <Button
            onClick={() => handleAdd()}
            color="teal.300"
            leftIcon={<AddIcon />}
          >
            {" "}
            Add Product
          </Button>
        </Flex>

        <TableContainer>
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Id</Th>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Is In Stock</Th>
                <Th isNumeric>Price</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((product: Product) => (
                <Tr key={product.id}>
                  <Td>{product.id}</Td>
                  <Td>
                    <HStack>
                      <Avatar size={"sm"} name={product.name} />
                      <Text>{product.name}</Text>
                    </HStack>
                  </Td>

                  <Td>{product.description}</Td>
                  <Td>
                    <Badge>{product.isInStore ? "Yes" : "No"}</Badge>
                  </Td>
                  <Td>{product.price}</Td>
                  <Td>
                    <HStack>
                      <EditIcon
                        onClick={() => getProduct(product.id)}
                        boxSize={23}
                        color={"orange.200"}
                      />
                      <Popover>
                        <PopoverTrigger>
                      <DeleteIcon boxSize={23} color={"red.400"} />
                        
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverHeader>Confirmation!</PopoverHeader>
                          <PopoverBody>
                            Are you sure you want to Delete?
                          </PopoverBody>
                          <PopoverFooter>
                            <Button colorScheme="red" variant={"outline"} onClick={() => handleDelete(product.id)}>Delete</Button>
                          </PopoverFooter>
                        </PopoverContent>
                      </Popover>
                      <ViewIcon boxSize={23} color={"green.300"} />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        {data.length == 0 && (
          <Heading p={5} textAlign={"center"} fontSize={24}>
            No Data
          </Heading>
        )}
        {isOpen && (
          <ProductForm
            currentData={currentData}
            fetchProduct={fetchData}
            isOpen={isOpen}
            onClose={onClose}
          />
        )}
      </Box>
    </>
  );
};

export default ProductTable;
