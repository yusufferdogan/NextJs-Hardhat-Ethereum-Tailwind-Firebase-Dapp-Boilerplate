import { useEffect } from 'react';
import { CONTRACT_ADDRESS, abi } from '../constants/mint';
import Footer from './components/footer';
import Header from './components/header';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import { ToastContainer, toast } from 'react-toastify';

export default function MintPage({}) {
  const { enableWeb3, isWeb3Enabled, account, provider, chainId } =
    useMoralis();
  const { data, error, runContractFunction, isFetching, isLoading } =
    useWeb3Contract({
      abi: abi,
      contractAddress: CONTRACT_ADDRESS,
      functionName: 'mint',
    });

  useEffect(() => {
    const switchNetwork = async () => {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x5' }],
      });
    };
    // const web3 = await Moralis.Web3.enable();
    try {
      if (isWeb3Enabled && chainId != '0x5') switchNetwork();
    } catch (error) {
      alert(error.message);
    }
  }, []);

  return (
    <>
      <ToastContainer />
      {Header({ show: false })}

      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
              NFT Mint Page
            </h1>
            <div className="my-12"></div>
            <div className="flex justify-center">
              <div className="flex justify-center">
                {isWeb3Enabled ? (
                  <button
                    className="inline-flex text-white bg-green-700 hover:bg-green-600 border-0 py-2 px-6 focus:outline-none  rounded text-lg"
                    onClick={() => {
                      navigator.clipboard.writeText(account);
                      toast.info('Text copied to clipboard', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      });
                    }}
                  >
                    {account.slice(0, 4) +
                      '...' +
                      account.slice(account.length - 4, account.length)}
                  </button>
                ) : (
                  <button
                    onClick={() => enableWeb3({ chainId: '0x5' })}
                    className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  >
                    Connect Wallet
                  </button>
                )}
                <div className="px-12"></div>
                <button
                  onClick={() => runContractFunction()}
                  className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                >
                  {isFetching || isLoading ? 'Loading' : 'Mint'}
                </button>
              </div>
            </div>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <img src="./crypto-devs.svg" />
          </div>
        </div>
      </section>
      <div className="absolute bottom-0" s>
        <Footer></Footer>
      </div>
    </>
  );
}
