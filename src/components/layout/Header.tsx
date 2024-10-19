'use client';

import React from 'react'
import { WalletComponents } from '../OnchainkitComponents/WalletComponent';


const Header = () => {

    return (
        <div className='mt-6  mb-12 flex flex-row space-x-4 items-center justify-center'>
            <h1 className='font-bold text-xl text-[#F09F24]'></h1>
            <div className="flex-grow"></div>
            <div className="ml-auto flex flex-row">
                <WalletComponents />
            </div>
            <hr />
        </div>
    )
}

export default Header
