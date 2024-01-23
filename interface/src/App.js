// import React from 'react';

// const App = () => {
//   // Array representing the placeholders for task cards
//   const taskCards = Array.from({ length: 15 }, (_, index) => index);

//   return (
//     <div className="bg-gray-800 min-h-screen">
//       <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
//         <h1 className="text-xl">My New Taskboard</h1>
//         <div className="flex gap-4">
//           <button className="bg-blue-600 py-2 px-4 rounded">Update</button>
//           <button className="py-2 px-4 rounded">Edit</button>
//           <button className="bg-blue-600 py-2 px-4 rounded">Open</button>
//           <button className="py-2 px-4 rounded">New</button>
//           <button className="py-2 px-4 rounded">Settings</button>
//         </div>
//       </nav>
//       <div className="grid grid-cols-5 gap-4 p-4">
//         {taskCards.map(card => (
//           <div key={card} className="bg-gray-700 aspect-square"></div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default App;









import React from 'react';
import Settings from './components/settings'; 

const App = () => {
  return (
    <div className="bg-gray-800 min-h-screen">
      <header className="py-4">
        <div className="container mx-auto flex justify-between items-center px-6">
          {/* <h1 className="text-white text-lg">My New Taskboard</h1> */}
          <button className="bg-blue-600 text-white py-2 px-4 rounded">My New Taskboard</button>
          <nav>
            <ul className="flex space-x-4">
              <li><button className="bg-blue-600 text-white py-2 px-4 rounded">Update</button></li>
              <li><button className="bg-blue-600 text-white py-2 px-4 rounded">Edit</button></li>
              <li><button className="bg-blue-600 text-white py-2 px-4 rounded">Open</button></li>
              <li><button className="bg-blue-600 text-white py-2 px-4 rounded">New</button></li>
              <li><button className="bg-blue-600 text-white py-2 px-4 rounded">Settings</button></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="grid grid-cols-4 gap-6">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="bg-gray-700 h-40 rounded-lg"></div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
