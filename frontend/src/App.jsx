import React, {useState} from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

// import pages & components
import Login from './pages/Login'
import Empreendimentos from './pages/Empreendimentos'
import Empreendimento from './pages/Empreendimento'
import Proposta from './pages/Proposta'
import Header from './components/Header'

// import hooks
import useToken from './hooks/useToken'

import history from './helpers/history';

// import styling
import './scss/App.scss'
import { apiRead } from './helpers/helpers'

const API_URL = process.env.REACT_APP_API_URL

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
			<Router history={history}>
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
		<Router history={history}>
			<Header token={token} setToken={setTokenFilter} ></Header>

			<div className="App">
				<Routes>
					<Route path="*" element={<Navigate to="/" />}></Route>
					<Route exact path="/" element={(<Empreendimentos />)}></Route>
					<Route exact path="/empreendimentos" element={(<Empreendimentos />)}></Route>
					<Route exact path="/empreendimento/:id" element={(<Empreendimento />)}></Route>
					<Route exact path="/proposta/:id" element={(<Proposta user={token} />)}></Route>
				</Routes>
			</div>
		</Router>
	)
}

export default App
