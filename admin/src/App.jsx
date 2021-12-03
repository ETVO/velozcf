import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

// import pages & components
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Empreendimentos from './pages/Empreendimentos'
import Empreendimento from './pages/Empreendimento'
import Cabanas from './pages/Cabanas'
import Cabana from './pages/Cabana'
import Images from './pages/Images'
import Image from './pages/Image'
import Imobiliarias from './pages/Imobiliarias'
import Propostas from './pages/Propostas'
import Users from './pages/Users'

// import styling
import './scss/App.scss'

const API_URL = process.env.REACT_APP_API_URL

function App() {
		
  return (
    <Router>
      <Header />
      <div className="App">
        <Routes>
          <Route path="*" element={<Navigate to="/" />}></Route>
          <Route exact path="/" element={(<Home />)}></Route>
          <Route exact path="/empreendimentos" element={(<Empreendimentos />)}></Route>
          <Route exact path="/empreendimento" element={(<Empreendimento />)}></Route>
          <Route exact path="/empreendimento/:id" element={(<Empreendimento />)}></Route>
          <Route exact path="/cabanas" element={(<Cabanas />)}></Route>
          <Route exact path="/cabana" element={(<Cabana />)}></Route>
          <Route exact path="/cabana/:id" element={(<Cabana />)}></Route>
          <Route exact path="/images" element={(<Images />)}></Route>
          <Route exact path="/image" element={(<Image />)}></Route>
          <Route exact path="/image/:id" element={(<Image />)}></Route>
          <Route exact path="/propostas" element={(<Propostas />)}></Route>
          <Route exact path="/users" element={(<Users />)}></Route>
          <Route exact path="/imobiliarias" element={(<Imobiliarias />)}></Route>
        </Routes>
      </div>
      <Footer />
    </Router>
  )
}

export default App
