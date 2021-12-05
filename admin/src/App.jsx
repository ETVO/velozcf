import React, { useState } from 'react'
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

// import pages & components
import Login from './pages/Login'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Empreendimentos from './pages/Empreendimentos'
import Empreendimento from './pages/Empreendimento'
import Cabanas from './pages/Cabanas'
import Cabana from './pages/Cabana'
import Images from './pages/Images'
import Image from './pages/Image'
import Users from './pages/Users'
import User from './pages/User'
import Imobiliarias from './pages/Imobiliarias'
import Imobiliaria from './pages/Imobiliaria'
import Propostas from './pages/Propostas'
import Config from './pages/Config'

// import styling
import './scss/App.scss'

const API_URL = process.env.REACT_APP_API_URL

const initialUser = {
    username: '',
    email: '',
    password: '',
    role: '',
    info: {
		nome_completo: ''
	},
    photo: {
        id: 0,
    }
}

function App() {

	const [user, setUser] = useState(initialUser)

	const [loggedIn, setLoggedIn] = useState(false);

	// if (user === initialUser) {
	// 	let sessionUser = sessionStorage.getItem('user');
	// 	if(sessionUser) {
	// 		setUser(sessionUser);
	// 	}
	// }
	// else {
	// 	if(authUser(user.username, user.password)) {

	// 	}
	// }

	if (!loggedIn) {
		if (sessionStorage.getItem('loggedIn'))
			setLoggedIn(true);

		return (
			<Router>
				<div className="App">
					<Routes>
						<Route exact path="*" element={(<Navigate to="/login" />)}></Route>
						<Route path="/login" element={(<Login setLoggedIn={setLoggedIn} />)}></Route>
					</Routes>
				</div>
			</Router>
		)
	}

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
					<Route exact path="/users" element={(<Users />)}></Route>
					<Route exact path="/user" element={(<User />)}></Route>
					<Route exact path="/user/:id" element={(<User />)}></Route>
					<Route exact path="/propostas" element={(<Propostas />)}></Route>
					<Route exact path="/imobiliarias" element={(<Imobiliarias />)}></Route>
					<Route exact path="/imobiliaria" element={(<Imobiliaria />)}></Route>
					<Route exact path="/imobiliaria/:id" element={(<Imobiliaria />)}></Route>
					<Route exact path="/configuracoes" element={(<Config />)}></Route>
				</Routes>
			</div>
			<Footer setLoggedIn={setLoggedIn} />
		</Router>
	)
}

export default App
