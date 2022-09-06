import { useState } from 'react';
import { useEffect } from 'react';
import { baseUri } from '../../constants/mint';

export default function NFTBox(props) {
  const [data, setData] = useState({});
  const [rarity, setRarity] = useState(0.0);
  useEffect(() => {
    fetch(`${baseUri}/${props.id}.json`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setRarity(data.attributes[0].rarity);
      });
  }, []);
  //          src={`${baseUri}/${props.id}.svg`}

  return (
    <div className="container mb-12 lg:mb-0 py-6">
      <div
        className="shadow-lg rounded-lg relative overflow-hidden bg-no-repeat bg-cover mb-6"
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
      >
        <img src={`${baseUri}/${props.id}.svg`} className="w-full" />

        <a href="#!">
          <div className="mask absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
        </a>
      </div>

      <h5 className="text-lg font-bold mb-3">{data.name}</h5>
      <div className="mb-3 text-blue-600 font-medium text-sm flex items-center justify-center lg:justify-start">
        <svg
          className="w-4 h-4 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path
            fill="currentColor"
            d="M437.2 403.5L320 215V64h8c13.3 0 24-10.7 24-24V24c0-13.3-10.7-24-24-24H120c-13.3 0-24 10.7-24 24v16c0 13.3 10.7 24 24 24h8v151L10.8 403.5C-18.5 450.6 15.3 512 70.9 512h306.2c55.7 0 89.4-61.5 60.1-108.5zM137.9 320l48.2-77.6c3.7-5.2 5.8-11.6 5.8-18.4V64h64v160c0 6.9 2.2 13.2 5.8 18.4l48.2 77.6h-172z"
          />
        </svg>
        Rarity: {rarity}
      </div>
      <p className="text-gray-500">{data.description}</p>
    </div>
  );
}
