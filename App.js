/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable prettier/prettier */
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
// import { StatusBar } from 'expo-status-bar';
import {NavigationContainer} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import AppLoading from 'expo-app-loading';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ManageExpense from './screens/ManageExpense';
import RecentExpense from './screens/RecentExpenses';
import AllExpenses from './screens/AllExpenses';
import AllUsers from './screens/AllUsers';
import {GlobalStyles} from './constants/styles';
import IconButton from './components/UI/IconButton';
import ExpensesContextProvider from './store/expenses-context';
import AuthContextProvider, { AuthContext } from './store/auth-context';

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: GlobalStyles.colors.primary500},
        headerTintColor: 'white',
        contentStyle: {backgroundColor: GlobalStyles.colors.primary100},
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
				headerTintColor: 'white',
			}}
		>
			<Stack.Screen
				name='ExpensesOverview'
				component={ExpensesOverview}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name='ManageExpense'
				component={ManageExpense}
				options={{
					presentation: 'modal',
				}}
			/>
		</Stack.Navigator>
	);
}


function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
  	async function fetchToken() {
  		const storedToken = await AsyncStorage.getItem('token');
  		const storedEmail = await AsyncStorage.getItem('email');
  		if (storedToken) {
  			authCtx.authenticate(storedToken, storedEmail);
  		}
  		setIsTryingLogin(false);
  	}

  	fetchToken();
  }, []);

  // if (isTryingLogin) {
  // 	return <AppLoading />;
  // }

  return <Navigation/>;
}

function ExpensesOverview() {
	const authCtx = useContext(AuthContext);
	return (
		<BottomTabs.Navigator
			screenOptions={({ navigation }) => ({
				headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
				headerTintColor: 'white',
				tabBarStyle: { backgroundColor: GlobalStyles.colors.primary500 },
				tabBarActiveTintColor: GlobalStyles.colors.accent500,
				// eslint-disable-next-line react/no-unstable-nested-components
				headerLeft: ({ tintColor }) => {
					return (
						<IconButton
							icon='add'
							size={24}
							color={tintColor}
							onPress={() => {
								navigation.navigate('ManageExpense');
							}}
						/>
					);
				},
				headerRight: ({ tintColor }) => {
					return (
						<IconButton
							icon='exit'
							color={tintColor}
							size={24}
							onPress={authCtx.logout}
						/>
					);
				},
			})}
		>
			<BottomTabs.Screen
				name='RecentExpenses'
				component={RecentExpense}
				options={{
					title: 'Recent Expenses',
					tabBarLabel: 'Recent',
					// eslint-disable-next-line react/no-unstable-nested-components
					tabBarIcon: ({ color, size }) => (
						<Icon name="hourglass" size={size} color={color} />
					),
				}}
			/>
			<BottomTabs.Screen
				name='AllExpenses'
				component={AllExpenses}
				options={{
					title: 'All Expenses',
					tabBarLabel: 'All Expenses',
					// eslint-disable-next-line react/no-unstable-nested-components
					tabBarIcon: ({ color, size }) => (
						<Icon name="calendar" size={size} color={color} />
					),
				}}
			/>
			<BottomTabs.Screen
				name='Users'
				component={AllUsers}
				options={{
					title: 'Users Wise Expenses',
					tabBarLabel: 'Users',
					// eslint-disable-next-line react/no-unstable-nested-components
					tabBarIcon: ({ color, size }) => (
						<Icon name="people" size={size} color={color} />
					),
				}}
			/>
		</BottomTabs.Navigator>
	);
}

export default function App() {
  return (
    <>
      {/* <StatusBar style='light' /> */}
       <AuthContextProvider> 
       <ExpensesContextProvider>
          <Root />
        </ExpensesContextProvider> 
     </AuthContextProvider> 
    </>
  );
}
