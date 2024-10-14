'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { InferType, object, string } from "yup";
import { encodeFunctionData } from 'viem';
import toast from "react-hot-toast";
import { Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import {
    Transaction,
    TransactionButton,
    TransactionSponsor,
    TransactionStatus,
    TransactionStatusAction,
    TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';
import { base, baseSepolia } from 'wagmi/chains'; 
import { contractABI, ContractAddress } from '@/constants/contract';
import { AbiFunction, ContractFunctionParameters } from 'viem';



// Define the schema for personal details validation
const personalDetailsSchema = object({
    productName: string().required('Name is required'),
    description: string().required(),
    price: string().required(),
    imageUrl: string().required(),

}).required();



const AddProduct = () => {
    const formMethods = useForm({ resolver: yupResolver(personalDetailsSchema) });
    const { handleSubmit, control } = formMethods;
    const [loading, setLoading] = useState<boolean>(false);
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
            <div className="bg-[#FFFFFF] border rounded-xl w-full lg:w-1/2 space-y-4 p-8 flex items-center justify-center ">
                <div className="px-1 pt-8 flex flex-col items-center justify-center ">
                    <FormProvider {...formMethods}>
                        <form className="flex flex-col gap-8 w-full max-w-xs">
                            <div className="text-[18px] font-semibold mb-4">
                                Add Product
                            </div>
                            <div className="flex flex-col justify-between gap-6">
                                

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
                                 <Controller
                                    control={control}
                                    name="price"
                                    render={({ field }) => (
                                        <Input
                                            type="num"
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
                                <TransactionButton className='bg-[#FFE840]' />
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
