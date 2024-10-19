'use client';

import { Input } from '@/components/ui/input';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {  object, string } from "yup";
import toast from "react-hot-toast";
import { Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import {
    Transaction,
    TransactionButton,
    TransactionSponsor,
    TransactionStatus,
    TransactionStatusAction,
    TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';
import {  baseSepolia } from 'wagmi/chains'; 
import { contractABI, ContractAddress } from '@/constants/contract';
import { AbiFunction, ContractFunctionParameters } from 'viem';



const personalDetailsSchema = object({
    productName: string().required('Name is required'),
    description: string().required(),
    price: string().required(),
    imageUrl: string().required(),

}).required();



const AddProduct = () => {
    const formMethods = useForm({ resolver: yupResolver(personalDetailsSchema) });
    const {  control } = formMethods;
    const router = useRouter()

    const transactionContracts: ContractFunctionParameters[] = [
        {
        address: ContractAddress,
        abi: contractABI as unknown as AbiFunction[],
        functionName: 'addProduct',
        args: [
            formMethods.watch('productName'),
            formMethods.watch('description'),
            formMethods.watch('imageUrl'),
            formMethods.watch('price')
          ]

      }
    ];

    const handleOnStatus = useCallback((status: LifecycleStatus) => {
        console.log('LifecycleStatus', status);
        switch (status.statusName) {
            case 'init':
            case 'transactionIdle':
            case 'transactionPending':
                break;
            case 'error':
                toast.error(`Failed to create account: ${status.statusData.message}`);
                break;
            case 'transactionLegacyExecuted':
                toast.success("Transaction submitted. Waiting for confirmation...");
                break;
            case 'success':
                toast.success("Account created successfully!");
                router.push("/app/merchant/product/dashboard");
                break;
            default:
                console.warn('Unhandled status:', status);
        }
    }, [router]);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-[#FFFFFF] shadow-xl border rounded-xl w-full lg:w-1/2 space-y-4 p-3 flex items-center justify-center ">
                <div className="px-1 pt-4 flex flex-col items-center justify-center w-3/4">
                    <FormProvider {...formMethods}>
                        <form className="flex flex-col w-full">
                            <div className="text-2xl text-[#F09F24] font-bold mb-4">
                                Add Product
                            </div>
                            <div className="flex flex-col justify-between mt-6 gap-2">
                            <label htmlFor="productName" className="text-sm font-bold">
                                    Product Name
                                </label>
                                <Controller
                                    control={control}
                                    name="productName"
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            placeholder="product Name"
                                            {...field}
                                        />
                                    )}
                                />
                                 <label htmlFor="description" className="text-sm font-bold">
                                    Description
                                </label>
                                <Controller
                                    control={control}
                                    name="description"
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            placeholder="Short Descrption ..."
                                            {...field}
                                        />
                                    )}
                                />
                                  <label htmlFor="imageUrl" className="text-sm font-bold">
                                    Image URL
                                </label>
                                 <Controller
                                    control={control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            placeholder="Image"
                                            {...field}
                                        />
                                    )}
                                />
                                  <label htmlFor="price" className="text-sm font-bold">
                                    Price
                                </label>
                                 <Controller
                                    control={control}
                                    name="price"
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            placeholder="price"
                                            {...field}
                                        />
                                    )}
                                />
                                 <Transaction
                                 chainId={baseSepolia.id}
                                 contracts={transactionContracts}
                                 onStatus={handleOnStatus}
                            >
                                <TransactionButton className='bg-[#F09F24] mt-4 w-full' />
                                <TransactionSponsor />
                                <TransactionStatus>
                                    <TransactionStatusLabel />
                                    <TransactionStatusAction />
                                </TransactionStatus>
                            </Transaction>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>

    );
};

export default AddProduct;
