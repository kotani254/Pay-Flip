
'use client';
import { useRouter } from "next/navigation";
import Head from "next/head";
import { IoMdLogIn } from "react-icons/io";
import { FiUserPlus } from "react-icons/fi";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useEffect, useState } from "react";
import { WalletComponents } from "@/components/OnchainkitComponents/WalletComponent";
import LandingPage from "@/components/layout/LandingPage";
import { useAuth } from "@/context/AuthContext";
import RoleSelectModal from "@/components/modal/role"
import { ethers } from 'ethers';
import {ContractAddress, contractABI} from '@/constants/contract'

import { useReadContract } from 'wagmi'

interface UserDetails {
  userName: string;
  userRole: number;
  address: string;
}

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  console.log(user)
  const [showRoleSelectModal, setShowRoleSelectModal] = useState(false);


  const toggleRoleSelectModal = () => {
    setShowRoleSelectModal(!showRoleSelectModal);
  };

  const { data: userDetails } = useReadContract({
    abi: contractABI,
    address: ContractAddress,
    functionName: 'getUserByAddress',
    args: [user?.address],
  }) as { data: UserDetails | undefined };

  console.log(userDetails)

  if (userDetails && Array.isArray(userDetails) && userDetails.length === 3) {
    const userName = userDetails[0];  
    const userRole = userDetails[1]; 
    const address = userDetails[2];  
  
    console.log('User Name:', userName);
    console.log('User Role:', userRole);
    console.log('Address:', address);
  
    const roleMapping: { [key: string]: number } = {
      Buyer: 0,
      Merchant: 1,
    };
  
    const roleNumeric = Number(userRole);
    const roleString = Object.keys(roleMapping).find(key => roleMapping[key] === roleNumeric);
  
    if (roleString === 'Buyer') {
      router.push('/app/buyer/products/view'); 
    } else if (roleString === 'Merchant') {
      router.push('/app/merchant/product/dashboard'); 
    } else {
      router.push('/');
    }
  } else {
    console.log('No valid user details found for address', user?.address);
    router.push('/');
  }
  

  return (
    <>
      <Head>
        <title>Payflip | Home</title>
      </Head>
      <div className="mx-auto h-screen bg-[#FFF]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 after:absolute after:opacity-25 after:left-0 after:right-0 after:top-0 after:bottom-0 after:bg-transparent after:z-[-1] bg-[#FFF]">
          <div>
            <p className="text-[#F09F24] text-4xl font-bold">PayFlip</p>

            <img src="https://static.scientificamerican.com/sciam/cache/file/3FE9ABC3-2CC3-41D8-AE636C8A1CD61909_source.jpeg?w=1200" alt="payflip" className="object-cover h-[99vh] bg-gray-100" />
          </div>
          {user?.isConnecting ?
            (
              <LoadingSpinner />
            ) : user?.isConnected ?
              (
                <div className="relative flex items-center justify-center w-full md:w-[11/12] xl:w-[8/12] mx-auto">
                  <div className="flex flex-col items-center justify-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-short">
                      <span className="block xl:inline text-[#F09F24]">Welcome to PayFlip</span>
                    </h1>
                    <p className="mt-3 sm:mt-5 md:mt-5 mx-auto sm:mx-0 mb-6 text-xl md:text-xl text-[#F09F24] leading-base">
                      Set Up an Account as a Merchant or Buyer.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center mb-4 md:mb-8 space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                      <button className="bg-[#F09F24] hover:bg-[#FFE841] text-white font-bold py-2 px-4 rounded inline-flex items-center" onClick={() => toggleRoleSelectModal()}>
                        <FiUserPlus className="w-6 h-6 mr-1" />
                        Set Up Profile
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 mt-4 mr-4">
                    <WalletComponents />
                  </div>
                </div>
              ) : (
                <LandingPage />
              )}

        </div>
      </div>
      {showRoleSelectModal && (
        <RoleSelectModal
          isOpen={showRoleSelectModal}
          onClose={() => setShowRoleSelectModal(false)}
        />
      )}
    </>
  );
};



