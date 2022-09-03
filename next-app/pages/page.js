import Footer from './components/footer';
import styles from '../styles/Home.module.css';
import Header from './components/header';
import { app, database } from '../firebaseConfig';
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
export default function Page({}) {
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
            <img src="./crypto-devs.svg" />
          </div>
        </div>
      </section>
    </>
  );
}
