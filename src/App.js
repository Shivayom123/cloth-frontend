import React from 'react';
import Excel from './Components/Excel'
import Footer from './Components/Footer';




function App() {
  // Restore user from localStorage when app first loads
   window.__user = {
  firstName: localStorage.getItem("firstName") || ""
};

  return (
    <div>
    <Excel/>
    <Footer/>
    
    
    </div>
  );
}

export default App;