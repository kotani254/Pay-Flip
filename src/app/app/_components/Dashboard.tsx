'use client';

import { useAuth } from '@/context/AuthContext';
import React, { useEffect, useState } from 'react';
import Moralis from 'moralis';
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { TokenImage } from '@coinbase/onchainkit/token';
interface Balance {
    symbol: string;
    formatted_balance: string;
}
const Dashboard = () => {
    const { user } = useAuth();
    const [balances, setBalances] = useState<Array<Balance>>([]);
    // const [balances, setBalances] = useState([]);

    useEffect(() => {
        const initializeMoralis = async () => {
            if (!Moralis.Core.isStarted) {
                await Moralis.start({
                    apiKey: "P1ZvrguGccwivEz7eObhSySzgrVUptRqaZoNigQy7XRwKUoHewAMTA7B37k4P3Rk",
                });
            }
        };

        initializeMoralis();
    }, []);

    useEffect(() => {
        const getBalance = async () => {
            if (user?.address) {
                console.log(user?.address)
                try {
                    const address = user.address;
                    const chain = EvmChain.BASE;

                    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
                        address,
                        chain
                    });

                    const formattedBalances = response.toJSON().map((token) => ({
                        ...token,
                        formatted_balance: (parseInt(token.balance) / Math.pow(10, token.decimals)).toFixed(token.decimals)
                    }));

                    setBalances(formattedBalances);
                    console.log(user?.address)

                    console.log(formattedBalances);
                } catch (error) {
                    console.error("Error fetching balances:", error);
                }
            }
        };

        getBalance();
    }, [user]);

    return (
        <div>
            <TokenImage
                token={  {
                    name: 'USDC',
                    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
                    symbol: 'USDC',
                    decimals: 6,
                    image:
                      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
                    chainId: 8453,
                  }}
                size={32}
            />
            <ul>
                {balances.map((token, index) => (
                    <li key={index} className='font-bold text-xl text-[#cbceeb]'>
                        {token.formatted_balance}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;