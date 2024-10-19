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
import Pay from '@/components/modal/pay';
import { contractABI, ContractAddress } from '@/constants/contract';

interface ProductData {
    productName: string;
    description: string;
    imageUrl: string;
    price: number;
    merchantAddress: string; 
}

interface Product {
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    merchant: string; 
}



const Products = () => {
    const [products, setProducts] = useState<ProductData[]>([]);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<string>('');
  const [price, setPrice] = useState<number>(0);

  const handleBuy = (merchantAddress: string, price: number) => {
    console.log("Opening pay modal"); 
    setSelectedMerchant(merchantAddress);
    setPrice(price)
    setShowPayModal(true);
  };


    useEffect(() => {
        const fetchData = async () => {
            const provider = new ethers.JsonRpcProvider('https://base-sepolia.g.alchemy.com/v2/XJjEhlbtuCP5a6aZvpacjn16Aqd9G0z1');
            const contract = new ethers.Contract(ContractAddress, contractABI, provider);

            try {
                const allProducts = await contract.getAllProducts();
                const formattedProducts = allProducts.map((product: Product) => ({
                    productName: product.name,
                    description: product.description,
                    // imageUrl: product.imageUrl,
                    price: product.price.toString(),
                    merchantAddress: product.merchant
                }));
                setProducts(formattedProducts);
            } catch (err) {
                console.error("Error fetching product details:", err);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 10000);
        return () => clearInterval(intervalId);
    }, []);

  

    return (
        <>
        <div>
            <div className='mt-10 flex flex-row space-x-4 items-center justify-center'>
                <h1 className='font-bold text-lg'>All Products</h1>
                <div className="flex-grow"></div>
            </div>
            <div className='mt-8'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Description</TableHead>
                            {/* <TableHead>Image</TableHead> */}
                            <TableHead>Merchant Address</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product, index) => (
                            <TableRow key={index} className='hover:bg-gray-200'>
                                <TableCell>{product.productName}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>{product.description}</TableCell>
                                {/* <TableCell>
                                    <img src={product.imageUrl} alt={product.productName} className="w-16 h-16 object-cover" />
                                </TableCell> */}
                                <TableCell>{product.merchantAddress}</TableCell>
                                <TableCell>
                                    <Button className='bg-[#F09F24] w-full transform rounded-lg p-2' onClick={() => handleBuy(product.merchantAddress, product.price)}>
                                        Buy
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
         {showPayModal && (
            <Pay
              isOpen={showPayModal}
              onClose={() => setShowPayModal(false)}
              merchantAddress={selectedMerchant}
              price={price}
            />
          )}
          </>
    );
};

export default Products;