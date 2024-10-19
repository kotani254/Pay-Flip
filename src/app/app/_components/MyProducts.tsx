'use client';

import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ethers } from 'ethers';
import { useAuth } from '@/context/AuthContext';
import {ContractAddress, contractABI} from '@/constants/contract'
// import { useReadContract } from 'wagmi';


interface ProductData {
    productName: string;
    description: string;
    price: string;
}

const MyProducts = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<ProductData[]>([]);


    // const { data: MyProducts } = useReadContract({
    //     abi: contractABI,
    //     address: ContractAddress,
    //     functionName: 'getProductsByMerchant',
    //     args: [user?.address],
    //   }) as { data: ProductData | undefined };
    
    //   console.log("MyProducts", MyProducts)

    //   if (MyProducts && Array.isArray(MyProducts)) {
    //     const formattedProducts = MyProducts.map((product: ProductData[]) => ({
    //         productName: product[0],
    //         description: product[1],
    //         price: product[3],
    //     })) as unknown as ProductData[];
    //     // setProducts(formattedProducts)
    //   }

    useEffect(() => {
        const fetchData = async () => {
            const provider = new ethers.JsonRpcProvider('https://base-sepolia.g.alchemy.com/v2/XJjEhlbtuCP5a6aZvpacjn16Aqd9G0z1');
            const contract = new ethers.Contract(ContractAddress, contractABI, provider);

            try {
                const productDetails = await contract.getProductsByMerchant(user?.address);
                const formattedProducts = productDetails.map((product: ProductData[]) => ({
                    productName: product[0],
                    description: product[1],
                    price: product[3].toString(),
                    // merchantAddress: product[4]
                }));
                setProducts(formattedProducts);
            } catch (err) {
                console.error("Error fetching product details:", err);
            }
        };

        if (user?.address) {
            fetchData();
            const intervalId = setInterval(fetchData, 10000); // Fetch every 10 seconds
            return () => clearInterval(intervalId);
        }
    }, [user]);

    

    return (
        <div>
            <div className='mt-10 flex flex-row space-x-4 items-center justify-center'>
                <h1 className='font-bold text-lg'>Products</h1>
                <div className="flex-grow"></div>
            </div>
            <div className='mt-8'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product, index) => (
                            <TableRow key={index} className='hover:bg-gray-200'>
                                <TableCell>{product.productName}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>{product.description}</TableCell>
                                <TableCell>
                                    <Button className='bg-[#F09F24] w-full transform rounded-lg p-2'>
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default MyProducts;