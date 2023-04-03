import './App.css';
import { auth, db } from "./firebase.config";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getDocs, collection } from 'firebase/firestore'
import { useState, useEffect } from 'react'

function App() {

  const [currentUser, setCurrentUser] = useState(null);
  const [collectionArray, setCollectionArray] = useState([]);

  // auth
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
    })
    return unsubscribe
  }, [])

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password).then(() => {
      const user = auth.currentUser;

      setCurrentUser(user);

      console.log(user);

      return;
    })
  }

  const handleEmail = (e) => {
    setEmail(e.target.value);
  }

  const handlePassword = (e) => {
    setPassword(e.target.value);
  }

  async function fetchAllProductLinks() {
    try {
      const productLinksCollection = collection(db, "product-links");
      const querySnapshot = await getDocs(productLinksCollection);
      const documents = querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }));

      console.log("Successfully retrieved all documents in the product-links collection:", documents);

      setCollectionArray(documents);
      return documents;
    } catch (error) {
      console.error("Error retrieving documents in the product-links collection:", error);
    }
  }

  return (
    <div className="text-5xl min-h-screen  bg-white p-3">
      <h1 className='text-black'>Product bank </h1>
      {currentUser === null ? (
        <div>
          <div className='flex flex-col gap-3 pt-8'>
            <label htmlFor="" className='text-black text-lg'>email</label>
            <input onInput={handleEmail} type="text" className='bg-white border-black outline-none text-lg text-black border-2 w-1/3' />
          </div>
          <div className='flex flex-col gap-3 pt-8'>
            <label htmlFor="" className='text-black text-lg'>password</label>
            <input onInput={handlePassword} type="password" className='bg-white border-black outline-none text-lg text-black border-2 w-1/3' />
          </div>
          <button onClick={() => { logIn(email, password)} } className=' border-black w-[9rem] text-lg text-black border-2'>enter</button>
        </div>
      ) : (
        <div className='flex flex-col gap-3 '>
          <button onClick={() => {
            fetchAllProductLinks();
          }} className='text-lg w-[6rem] border-2 border-pink-600 mt-2'>reveal list</button>
          <div>
            {collectionArray.map(date => {
              console.log(date);
              return (
                <>
                  <div key={Math.random() * 838}>{date.id}</div>
                  <div className='text-[1rem] flex flex-col gap-3 w-[50rem] break-all'>{date.data.links.map(link => {
                    return (
                      <a href={`${link}`} className='underline' target="_blank" rel="noopener noreferrer">{link}</a>
                    )
                  })}
                  </div>
                </>
              )
            })}
          </div>
        </div>

      )}
    </div>
  );
}

export default App;
