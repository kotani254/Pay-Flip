import React from 'react'
import { WalletComponents } from '../OnchainkitComponents/WalletComponent'
import { IoMdLogIn } from 'react-icons/io'
import { FiUserPlus } from 'react-icons/fi'
import Head from "next/head";


const LandingPage = () => {
    return (
        <>
            <Head>
                <title>Payflip | Home</title>
            </Head>

            <div className="relative flex items-center justify-center w-full">
                <div className="flex flex-col">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-short text-gray-900 dark:text-white">
                        <span className="block xl:inline text-[#FFE840]">Welcome to PayFlip</span>
                    </h1>
                    <p className="mt-3 sm:mt-5 md:mt-5 mx-auto sm:mx-0 mb-6 text-lg md:text-xl text-[#FFE840] leading-base">
                        Flip the script on payments: local currency in, stablecoins out with PayFlip.
                    </p>
                </div>
                <div className="absolute top-0 right-0 mt-4 mr-4">
           <WalletComponents />
          </div>
            </div>
        </>
    )
}

export default LandingPage
