import React from 'react'
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

const API_URL = process.env.REACT_APP_API_URL

function App() {

	// const { token, setToken } = useToken()

	const token = true;
	const setToken = (val) => {
		console.log('setToken with ', val)
	}

	const user = {
		fullname: 'Usuário Teste',
		id: 1,
		id: 1,
		photo: { url: '../public/images/snow.jpg' }
	}

	if (!token) {
		return (
			<Router history={history}>
				<div className="App">
					<Routes>
						<Route exact path="*" element={(<Navigate to="/login" />)}></Route>
						<Route path="/login" element={(<Login setToken={setToken} />)}></Route>
					</Routes>
				</div>
			</Router>
		)
	}
	// else if(token.user.confirmed && !token.user.blocked) {
	else if (token) {

		const logOut = e => {
			sessionStorage.clear()
			localStorage.clear()
			setToken(null)
		}

		return (
			<Router history={history}>
				<Header logOut={logOut} user={user}>

				</Header>
				<div className="App">
					<Routes>
						<Route path="*" element={<Navigate to="/" />}></Route>
						<Route exact path="/" element={(<Empreendimentos />)}></Route>
						<Route exact path="/empreendimentos" element={(<Empreendimentos />)}></Route>
						<Route exact path="/empreendimento/:id" element={(<Empreendimento />)}></Route>
						<Route exact path="/proposta/:id" element={(<Proposta user={user} />)}></Route>
					</Routes>
				</div>
			</Router>
		)
	}
}

export default App
