/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext({
	token: '',
	emailId: '',
	isAuthenticated: false,
	authenticate: (token, emailId) => {},
	logout: () => {},
});

function AuthContextProvider({ children }) {
	const [authToken, setAuthToken] = useState();
	const [authEmail, setAuthEmail] = useState();

	function authenticate(token, emailId) {
		setAuthToken(token);
		setAuthEmail(emailId);
		AsyncStorage.setItem('token', token);
		AsyncStorage.setItem('email', emailId);
	}

	function logout() {
		setAuthToken(null);
		AsyncStorage.removeItem('token');
		AsyncStorage.removeItem('email');
	}

	const value = {
		token: authToken,
		email: authEmail,
		isAuthenticated: !!authToken,
		authenticate: authenticate,
		logout: logout,
	};

	// eslint-disable-next-line react/react-in-jsx-scope
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
