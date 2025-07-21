import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt'));
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;
    await addDoc(collection(db, 'messages'), {
      text,
      createdAt: serverTimestamp(),
      sender: 'user',
    });
    setText('');
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white border rounded-xl shadow-lg">
      <div className="p-4 border-b font-bold text-lg text-gray-800 bg-gray-100 rounded-t-xl">
        Live Chat
      </div>
      <div className="h-64 overflow-y-scroll p-4 space-y-2 bg-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg max-w-xs ${
              msg.sender === 'user' ? 'bg-blue-100 self-end ml-auto' : 'bg-gray-200'
            }`}
          >
            <div className="text-sm text-gray-700">
              <strong>{msg.sender}</strong>: {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center p-4 border-t bg-gray-50 rounded-b-xl">
        <input
          className="flex-grow border border-gray-300 rounded px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}




// // Chat.js
// import { useState, useEffect } from 'react';
// import { db } from './firebase';
// import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore';

// export default function Chat() {
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState('');

//   useEffect(() => {
//     const q = query(collection(db, 'messages'), orderBy('createdAt'));
//     const unsub = onSnapshot(q, (snapshot) => {
//       setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     });
//     return () => unsub();
//   }, []);

//   const sendMessage = async () => {
//     if (!text.trim()) return;
//     await addDoc(collection(db, 'messages'), {
//       text,
//       createdAt: serverTimestamp(),
//       sender: 'user'
//     });
//     setText('');
//   };

//   return (
//     <div>
//       <div style={{ height: 300, overflowY: 'scroll' }}>
//         {messages.map(msg => (
//           <div key={msg.id}><strong>{msg.sender}</strong>: {msg.text}</div>
//         ))}
//       </div>
//       <input value={text} onChange={e => setText(e.target.value)} placeholder="Type..." />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// }
