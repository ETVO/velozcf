import React, { useState, Fragment } from 'react'
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

import { authUser } from './helpers/helpers';

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
const SHOW_EMPRE = process.env.REACT_APP_SHOW_EMPRE

const initialUser = {
	username: '',
	email: '',
	password: '',
	role: ''
}

function App() {

	const [token, setToken] = useState();

	// Filter function to set token state value
	const setTokenFilter = (value) => {
		if (value) {
			// Stringify JSON then encode it as base64 (to prevent adulteration)
			localStorage.setItem(
				'token',
				Buffer.from(
					JSON.stringify(value)
				).toString('base64')
			);
			setToken(value);
		}
		else {
			localStorage.removeItem('token');
			setToken(value);
		}
	}

	if (!token) {
		// Decode token from base64 then parse to JSON
		let sessionToken = localStorage.getItem('token')
		if (sessionToken)
			setToken(
				JSON.parse(
					Buffer.from(
						sessionToken,
						'base64'
					).toString('utf8')
				)
			);

		return (
			<Router>
				<div className="App">
					<Routes>
						<Route exact path="*" element={(<Navigate to="/login" />)}></Route>
						<Route path="/login" element={(<Login setToken={setTokenFilter} />)}></Route>
					</Routes>
				</div>
			</Router>
		)
	}

	return (
		<Router>
			<Header token={token} />
			<div className="App">
				<Routes>
					<Route path="*" element={<Navigate to="/" />}></Route>
					<Route exact path="/" element={(<Home />)}></Route>

					{(token.role === 'venda') ?
						<Fragment>
							<Route exact path="/users" element={<Navigate to={'/user/' + token.id} />}></Route>
							<Route exact path="/user" element={<Navigate to={'/user/' + token.id} />}></Route>
							<Route path="/user/*" element={<Navigate to={'/user/' + token.id} />}></Route>
							<Route exact path='/user/:id' element={(<User token={token} />)}></Route>
						</Fragment>
						:
						<Fragment>
							{(SHOW_EMPRE) ? (
								<Fragment>
									<Route exact path="/empreendimentos" element={(<Empreendimentos />)}></Route>
									<Route exact path="/empreendimento" element={(<Empreendimento />)}></Route>
									<Route exact path="/empreendimento/:id" element={(<Empreendimento />)}></Route>
								</Fragment>	
							) : ''}
							<Route exact path="/cabanas" element={(<Cabanas />)}></Route>
							<Route exact path="/cabana" element={(<Cabana />)}></Route>
							<Route exact path="/cabana/:id" element={(<Cabana />)}></Route>
							<Route exact path="/images" element={(<Images />)}></Route>
							<Route exact path="/image" element={(<Image />)}></Route>
							<Route exact path="/image/:id" element={(<Image />)}></Route>
							<Route exact path="/users" element={(<Users />)}></Route>
							<Route exact path="/user" element={(<User token={token} />)}></Route>
							<Route exact path="/user/:id" element={(<User token={token} />)}></Route>
							<Route exact path="/propostas" element={(<Propostas />)}></Route>
							<Route exact path="/imobiliarias" element={(<Imobiliarias />)}></Route>
							<Route exact path="/imobiliaria" element={(<Imobiliaria />)}></Route>
							<Route exact path="/imobiliaria/:id" element={(<Imobiliaria />)}></Route>
							<Route exact path="/configuracoes" element={(<Config />)}></Route>
						</Fragment>
					}
				</Routes>
			</div>
			<Footer token={token} setToken={setTokenFilter} />
		</Router>
	)
}

export default App
