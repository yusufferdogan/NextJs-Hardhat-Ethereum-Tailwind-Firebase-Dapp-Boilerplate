import Link from 'next/link';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Header({
  walletConnected = false,
  currentAddress = '',
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
            <span className="ml-3 text-xl">NextJS Ethereum Boilerplate</span>
          </a>
        </Link>

        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          <Link href="/">
            <a className="mr-5 hover:text-gray-900">Home</a>
          </Link>

          <Link href="/MintPage">
            <a className="mr-5 hover:text-gray-900">Mint</a>
          </Link>

          <Link href="/MintPage">
            <a className="mr-5 hover:text-gray-900">Wallet</a>
          </Link>
        </nav>
        <ToastContainer />

        {walletConnected ? (
          <button
            className="text-white inline-flex items-center bg-amber-600 border-0 py-1 px-3 focus:outline-none hover:bg-amber-300 rounded text-base mt-4 md:mt-0"
            onClick={() => {
              navigator.clipboard.writeText(currentAddress);
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
            {currentAddress.slice(0, 4) +
              '...' +
              currentAddress.slice(
                currentAddress.length - 4,
                currentAddress.length
              )}
          </button>
        ) : (
          <div></div>
        )}
      </div>
    </header>
  );
}
