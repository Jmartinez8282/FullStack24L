import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Text,
  Badge
} from "@chakra-ui/react";
import ColorModeSwitch from "./ColorModeSwitch";
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constant";
import ProductSkeleton from "./ProductSkeleton";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  isInStore: boolean;
}

const ProductTable = () => {
  //UseStates
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState("");

  //function to help us fetch our data with axios, handle our error
  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(BASE_URL+"Product")
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

  if(isLoading) return <ProductSkeleton/>

  return (
    <>
      <ColorModeSwitch />
      <Box m={32} shadow={"md"} rounded={"md"}>
        <Flex justifyContent={"space-between"} px={"5"}>
          <Heading fontSize={25}>Product List</Heading>
          <Button color="teal.300" leftIcon={<AddIcon />}>
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
                      <Avatar size={'sm'} name={product.name}/>
                      <Text>{product.name}</Text>
                    </HStack>
                  </Td>

                
                  <Td>{product.description}</Td>
                  <Td>

                    <Badge>{product.isInStore ? "Yes": "No"}</Badge>
                  </Td>
                  <Td>{product.price}</Td>
                  <Td>
                    <HStack>
                      <EditIcon boxSize={23} color={"orange.200"}/>
                      <DeleteIcon boxSize={23} color={"red.400"}/>
                      <ViewIcon boxSize={23} color={"green.300"}/>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
            
          </Table>
        </TableContainer>
        {data.length == 0 &&  <Heading p={5} textAlign={'center'} fontSize={24}>No Data</Heading>}
      </Box>
    </>
  );
};

export default ProductTable;
