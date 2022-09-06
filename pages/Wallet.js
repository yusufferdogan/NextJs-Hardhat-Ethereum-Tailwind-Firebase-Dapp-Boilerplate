import { useEffect, useState } from 'react';
import { CONTRACT_ADDRESS, abi } from '../constants/mint';
import Header from './components/header';
import { useMoralis, useWeb3Contract, Moralis } from 'react-moralis';
import { ToastContainer, toast } from 'react-toastify';
import NFTBox from './components/NftBox';
import { providers, Contract, ethers, BigNumber } from 'ethers';
// import Moralis from 'moralis';

export default function WalletPage() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [theArray, setTheArray] = useState([]);
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const { account, enableWeb3, isWeb3Enabled } = useMoralis();

  const runMethod = async () => {
    const { ethereum } = window;

    if (ethereum) {
      toast.info('Loading', { hideProgressBar: true });
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(ethereum);
      console.log('provider:', provider);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      const balance = await contract.balanceOf(currentAccount);
      console.log(balance);
      const arr = [];
      for (let i = 0; i < balance; i++) {
        const id = await contract.tokenOfOwnerByIndex(currentAccount, i);
        arr.push(id.toNumber());
        console.log(id);
      }
      setTheArray(arr);
      console.log('theArray:', theArray);
      console.log('arr', arr);
      setLoading(false);
      setLoaded(true);
      toast.dismiss();
    } else {
      toast.error('Wallet Not Connected');
    }
  };
  const checkIsAuthenticated = async () => {
    try {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      if (!ethereum) {
        return toast('No ethereum wallet found');
      }
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts?.length) {
        const acc = accounts[0];
        setCurrentAccount(acc);
        console.log('checkIsAuthenticated:accounts?.length::', acc);
      }
      console.log('currentAccount:', currentAccount);
      const { chainId } = await provider.getNetwork();
      if (chainId != '0x5') {
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x5' }],
          });
        } catch (e) {
          toast.error(e.message);
          setCurrentAccount('');
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const switchNetwork = async () => {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const { chainId } = await provider.getNetwork();
      if (chainId != '0x5')
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x5' }],
        });
    };
    console.log('loaded', loaded);
    // if (!isWeb3Enabled) {
    //   enableWeb3({ chainId: '0x5' }).then((e) => {
    //     console.log(account);
    //     setTimeout(() => {
    //       runMethod();
    //     }, 1000);
    //   });
    // }
    checkIsAuthenticated();
  }, [theArray, loading, loaded]);

  return (
    <>
      <ToastContainer />
      {Header({
        currentAddress: currentAccount,
        walletConnected: isWeb3Enabled,
        click: () => {
          runMethod();
        },
      })}

      <div className="container my-24 px-6 mx-auto">
        <section className="mb-32 text-gray-800 text-center lg:text-left">
          <h2 className="text-3xl font-bold mb-12 text-center">Your Wallet</h2>
          {!loading ? (
            <div className="grid lg:grid-cols-3 gap-x-6">
              {theArray.map((id) => (
                <NFTBox key={id} id={id}></NFTBox>
              ))}
            </div>
          ) : (
            <div role="status" className="flex justify-center">
              <svg
                className="inline mr-2 w-24 h-24 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
