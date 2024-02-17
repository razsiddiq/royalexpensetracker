/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createContext, useState } from 'react';

export const AuthContext = createContext({
	token: '',
	emailId: '',
	isAuthenticated: false,
	authenticate: (token, emailId, password) => {},
	logout: () => {},
});

function AuthContextProvider({ children }) {
	const [authToken, setAuthToken] = useState();
	const [authEmail, setAuthEmail] = useState();
	const [authPassword, setAuthPassword] = useState();

	function authenticate(token, emailId, password, callBack) {
		setAuthToken(token);
		setAuthEmail(emailId);
		setAuthPassword(password);
		AsyncStorage.setItem('token', token);
		AsyncStorage.setItem('email', emailId);
		AsyncStorage.setItem('password', password);
		setTimeout(() => {
			callBack && callBack();
		}, 1000);
	}

	function logout() {
		setAuthToken(null);
		AsyncStorage.removeItem('token');
		AsyncStorage.removeItem('email');
		AsyncStorage.removeItem('password');
	}

	const value = {
		token: authToken,
		email: authEmail,
		password: authPassword,
		isAuthenticated: !!authToken,
		authenticate: authenticate,
		logout: logout,
	};

	// eslint-disable-next-line react/react-in-jsx-scope
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
