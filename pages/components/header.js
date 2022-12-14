import Link from 'next/link';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Header({
  walletConnected = false,
  currentAddress = '',
  show = true,
  click = () => console.log('NAN'),
}) {
  useEffect(() => {}, []);
  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link href={'/'}>
          <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="ml-3 text-2xl">NextJS Ethereum Boilerplate</span>
          </a>
        </Link>

        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          <Link href="/">
            <a className="mr-5 hover:text-gray-900 text-2xl">Whitelist</a>
          </Link>

          <Link href="/MintPage">
            <a className="mr-5 hover:text-gray-900 text-2xl">Mint</a>
          </Link>

          <Link href="/Wallet">
            <a className="mr-5 hover:text-gray-900 text-2xl ">Wallet</a>
          </Link>
        </nav>
        <ToastContainer />

        {show ? (
          walletConnected ? (
            <button
              className="text-center mx-auto inline-flex text-white bg-green-700 hover:bg-green-600 border-0 py-2 px-6 focus:outline-none  rounded text-lg"
              onClick={() => {
                navigator.clipboard.writeText(currentAddress);
                toast.info('Text copied to clipboard', {
                  position: 'bottom-center',
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              }}
            >
              {currentAddress != ''
                ? currentAddress.slice(0, 4) +
                  '...' +
                  currentAddress.slice(
                    currentAddress.length - 4,
                    currentAddress.length
                  )
                : ''}
            </button>
          ) : (
            <button
              onClick={() => click()}
              className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            >
              Connect Wallet
            </button>
          )
        ) : (
          <div></div>
        )}
      </div>
    </header>
  );
}
