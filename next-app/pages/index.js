import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Web3Modal from 'web3modal';
import { providers, Contract } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import { WHITELIST_CONTRACT_ADDRESS, abi } from '../constants';
import { lorem } from '../constants/lorem';
import Header from './components/header';
import Footer from './components/footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { app, database } from '../firebaseConfig';
import {
  addDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

const dbInstance = collection(database, 'addresses2');

export default function Home() {
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  // joinedWhitelist keeps track of whether the current metamask address has joined the Whitelist or not
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  // loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);
  // numberOfWhitelisted tracks the number of addresses's whitelisted
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();

  const [currentAddress, setCurrentAddress] = useState('');

  const [registeredAddresses, setRegisteredAddresses] = useState([]);

  const getAddresses = () => {
    getDocs(dbInstance).then((data) => {
      setRegisteredAddresses(
        data.docs.map((item) => {
          return { ...item.data(), id: item.id };
        })
      );
    });
  };

  const saveAddress = (asd) => {
    addDoc(dbInstance, {
      address: asd,
    }).then(() => {
      console.log('saveX added', asd);
      getAddresses();
    });
  };

  /**
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   *
   * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
   * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
   * request signatures from the user using Signer functions.
   *
   * @param {*} needSigner - True if you need the signer, default false otherwise
   */
  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Rinkeby network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      // window.alert('Change the network to Rinkeby');
      // throw new Error('Change network to Rinkeby');
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x5' }], // chainId must be in hexadecimal numbers
      });
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  /**
   * addAddressToWhitelist: Adds the current connected address to the whitelist
   */
  const addAddressToWhitelist = async () => {
    try {
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      // call the addAddressToWhitelist from the contract
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
      // get the updated number of addresses in the whitelist
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);

      saveAddress(currentAddress);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * getNumberOfWhitelisted:  gets the number of whitelisted addresses
   */
  const getNumberOfWhitelisted = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // No need for the Signer here, as we are only reading state from the blockchain
      const provider = await getProviderOrSigner();
      // We connect to the Contract using a Provider, so we will only
      // have read-only access to the Contract
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      // call the numAddressesWhitelisted from the contract
      const _numberOfWhitelisted =
        await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * checkIfAddressInWhitelist: Checks if the address is in whitelist
   */
  const checkIfAddressInWhitelist = async () => {
    try {
      // We will need the signer later to get the user's address
      // Even though it is a read transaction, since Signers are just special kinds of Providers,
      // We can use it in it's place
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      // Get the address associated to the signer which is connected to  MetaMask
      const address = await signer.getAddress();
      // call the whitelistedAddresses from the contract
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );
      setJoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  };

  /*
    connectWallet: Connects the MetaMask wallet
  */
  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      const signer = await getProviderOrSigner(true);
      setCurrentAddress(await signer.getAddress());
      console.log(await signer.getAddress());
      setWalletConnected(true);

      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();

      setTimeout(() => {}, 1000);
      getAddresses();
      console.log('currentAddress::', currentAddress);
    } catch (err) {
      console.error(err);
    }
  };

  const buttonStyle2 =
    'inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg';
  /*
    renderButton: Returns a button based on the state of the dapp
  */
  const renderButton = () => {
    if (walletConnected) {
      console.log('renderButton:::joinedWhitelist:::', joinedWhitelist);
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>
            Thanks for joining the Whitelist!
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={buttonStyle2}>
          Connect your wallet
        </button>
      );
    }
  };

  // useEffects are used to react to changes in state of the website
  // The array at the end of function call represents what state changes will trigger this effect
  // In this case, whenever the value of `walletConnected` changes - this effect will be called
  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal className to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: 'goerli',
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      getAddresses();
      checkIfAddressInWhitelist();
      console.log(registeredAddresses);
      console.log('joinedWhitelist', joinedWhitelist);
      console.log('currentAddress,,useEffect', currentAddress);
      // addToDatabase();
    }
  }, [walletConnected, currentAddress, registeredAddresses, joinedWhitelist]);

  return (
    <div>
      <Head>
        <title>NextJS Ethereum Boilerplate</title>
        <meta name="description" content="NextJS Ethereum Boilerplate" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {Header({
        walletConnected,
        currentAddress,
      })}

      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
              @YusufErdogan NextJs-Hardhat-Ethereum-Tailwind-Firebase Dapp
              Boilerplate
              <br className="hidden lg:inline-block" />
            </h1>
            <p className="mb-8 leading-relaxed"> {lorem}</p>
            <div className="flex justify-center">{renderButton()}</div>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <img src="./crypto-devs.svg" />
          </div>
        </div>
      </section>

      <div>
        <h3 className="container mx-auto flex px-5 pb-3 md:flex-row flex-col items-center font-bold	">
          Registered Addresses
        </h3>
        <br></br>
        {registeredAddresses.map((note) => {
          return (
            <div className="container mx-auto flex px-6 md:flex-row flex-col items-center">
              <p>{note.address}</p>
            </div>
          );
        })}
      </div>

      {Footer()}
    </div>
  );
}
