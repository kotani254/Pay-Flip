'use client';

import { Input } from '@/components/ui/input';
import React, { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from "yup";
import toast from "react-hot-toast";
import { Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
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
    name: string().required('Name is required'),
    phone: string().matches(/^[0-9]+$/, 'Phone number must only contain numbers').required('Phone number is required'),
}).required();

interface RoleProps {
    role: "Buyer" | "Merchant";
}

const PersonalDetails = ({ role }: RoleProps) => {
    const formMethods = useForm({ resolver: yupResolver(personalDetailsSchema) });
    const {  control, watch } = formMethods;
    const router = useRouter();

    const name = watch('name');

  

    const roleMapping = {
        Buyer: 0,
        Merchant: 1,
    };

    const numericRole = roleMapping[role];

    const transactionContracts: ContractFunctionParameters[] = [
        {
        address: ContractAddress,
        abi: contractABI as unknown as AbiFunction[],
        functionName: 'createUser',
        args: [name, numericRole],
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
        <div className="flex items-center justify-center h-screen bg-[#B2BEB5]">
            <div className=" border rounded-xl w-full lg:w-1/2 space-y-4 p-8 flex items-center justify-center ">
                <div className="px-1 pt-8 flex flex-col items-center justify-center ">
                    <FormProvider {...formMethods}>
                        <form className="flex flex-col gap-8 w-full max-w-xs">
                            <div className="text-2xl text-[#FFF] font-bold mb-4">
                                Create Merchant Account
                            </div>
                            <Controller
                                control={control}
                                name="name"
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder="Enter your Name"
                                        {...field}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="phone"
                                render={({ field }) => (
                                    <Input
                                        type="tel"
                                        placeholder="Enter your PhoneNumber"
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
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    );
};

export default PersonalDetails;