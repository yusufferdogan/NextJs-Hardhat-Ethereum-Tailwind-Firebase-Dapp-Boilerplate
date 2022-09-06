import Footer from './footer';
import styles from '../styles/../../styles/Home.module.css';
import Header from './header';
import Image from 'next/image';
import { app, database } from '../../firebaseConfig';
import { useEffect, useRef, useState } from 'react';
import {
  addDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

const dbInstance = collection(database, 'notes');
export default function FirebasePage({}) {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDesc, setNoteDesc] = useState('');
  const [notesArray, setNotesArray] = useState([]);

  const saveNote = () => {
    addDoc(dbInstance, {
      noteTitle: noteTitle,
      noteDesc: noteDesc,
    }).then(() => {
      setNoteTitle('');
      setNoteDesc('');
      getNotes();
    });
  };

  const getNotes = () => {
    getDocs(dbInstance).then((data) => {
      setNotesArray(
        data.docs.map((item) => {
          return { ...item.data(), id: item.id };
        })
      );
    });
  };

  useEffect(() => {
    getNotes();
  }, []);
  return (
    <>
      {Header({ currentAddress: '', walletConnected: false })}
      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 py-12 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
              Note app using Firebase
              <br className="hidden lg:inline-block" />
            </h1>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <Image src="./crypto-devs.svg" alt="devs" />
          </div>
        </div>
      </section>

      <div className="container row-auto mx-auto my-auto px-5 py-12">
        <div className="columns-2">
          <label htmlFor="title" className="leading-7 text-sm text-gray-600">
            title
          </label>
          <input
            type="title"
            id="title"
            name="title"
            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            onChange={(e) => setNoteTitle(e.target.value)}
            value={noteTitle}
          />
        </div>
        <div className="columns-2">
          <label
            htmlFor="description"
            className="leading-7 text-sm text-gray-600"
          >
            description
          </label>
          <input
            type="description"
            id="description"
            name="description"
            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            onChange={(e) => setNoteDesc(e.target.value)}
            value={noteDesc}
          />
        </div>
        <button
          className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
          onClick={saveNote}
        >
          Submit
        </button>
      </div>

      <div className={styles.codeBlock}>
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
          <p className="font-bold">NOTES:</p>
          <br />
          <div>
            {notesArray.map((note) => {
              return (
                <div key={note.id}>
                  <p>
                    {note.noteTitle} {note.noteDesc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
