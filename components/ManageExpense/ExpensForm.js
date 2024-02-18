/* eslint-disable prettier/prettier */
import * as React from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity, Modal, Keyboard  } from 'react-native';
import { useState, useContext } from 'react';

import DatePicker from 'react-native-modern-datepicker';

import Input from './Input';
import Button from '../UI/Button';
import { getFormattedDate } from '../../util/date';
import { GlobalStyles } from '../../constants/styles';

import { AuthContext } from '../../store/auth-context';

function ExpenseForm({ submitButtonLabel, onCancel, onSubmit, defaultValues, isEditing }) {
	const authCtx = useContext(AuthContext);
	const [open,setOpen] = useState(false);
	const email = authCtx.email;

	function handleOnPress(){
		Keyboard.dismiss();
		setOpen(!open);
	}

	const [inputs, setInputs] = useState({
		amount: {
			value: defaultValues ? defaultValues.amount.toString() : '',
			isValid: true,
		},
		date: {
			value: defaultValues ? getFormattedDate(defaultValues.date) : '',
			isValid: true,
		},
		description: {
			value: defaultValues ? defaultValues.description : '',
			isValid: true,
		},
	});

	function inputChangeHandler(inputIdentifier, enteredValue) {
		setInputs((curInputs) => {
			return {
				...curInputs,
				[inputIdentifier]: { value: inputIdentifier === 'date' ? enteredValue.replace(/\//g, '-') : enteredValue, isValid: true },
			};
		});
	}

	function submitHandler() {
		const expenseData = {
			amount: +inputs.amount.value,
			date: new Date(inputs.date.value),
			description: inputs.description.value,
			email: email,
		};
		const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
		const dateIsValid = expenseData.date.toString() !== 'Invalid Date';
		const descriptionIsValid = expenseData.description.trim().length > 0;
		if (!amountIsValid || !dateIsValid || !descriptionIsValid) {
			Alert.alert('Invalid input', 'Please check your input values');
			setInputs((curInputs) => {
				return {
					amount: { value: curInputs.amount.value, isValid: amountIsValid },
					date: { value: curInputs.date.value, isValid: dateIsValid },
					description: {
						value: curInputs.description.value,
						isValid: descriptionIsValid,
					},
				};
			});
			return;
		}
		onSubmit(expenseData);
	}

	const formIsInvalid =
		!inputs.amount.isValid ||
		!inputs.date.isValid ||
		!inputs.description.isValid;

	return (
		<View style={styles.form}>
			<TouchableOpacity onPress={handleOnPress}>
				<Text>Open</Text>
			</TouchableOpacity>
			<Modal
			animationType="slide"
			transparent={true}
			visible={open}
			>
				<View style={styles.modalView}>
					<DatePicker
						mode="calendar"
						selectedDate={inputs.date.value}
						onDateChange={inputChangeHandler.bind(this, 'date')}
						format="YYYY-MM-DD"
					/>
					<TouchableOpacity onPress={handleOnPress}>
						<Text>Close</Text>
					</TouchableOpacity>
				</View>
			</Modal>
			<Text style={styles.title}>Your Expense</Text>
			<View style={styles.inputRow}>
				<Input
					style={styles.rowInput}
					label={'Amount'}
					invalid={!inputs.amount.isValid}
					textInputConfig={{
						keyboardType: 'decimal-pad',
						onChangeText: inputChangeHandler.bind(this, 'amount'),
						value: inputs.amount.value,
					}}
				/>	
				<Input
					style={styles.rowInput}
					label={'date'}
					invalid={!inputs.date.isValid}
					textInputConfig={{
						onPressIn: handleOnPress,
						placeholder: 'YYYY-MM-DD',
						maxLength: 10,
						onChangeText: inputChangeHandler.bind(this, 'date'),
						value: inputs.date.value,
					}}
				/>
			</View>
			<Input
				label={'Description'}
				invalid={!inputs.description.isValid}
				textInputConfig={{
					multiline: true,
					// autoCapitalize:'none',
					// autoCorrect:false,
					onChangeText: inputChangeHandler.bind(this, 'description'),
					value: inputs.description.value,
				}}
			/>
			{formIsInvalid && (
				<Text style={styles.errorText}>
					Invalid input values - please check your entered data!
				</Text>
			)}
			<View style={styles.buttons}>
				<Button style={styles.button} mode='flat' onPress={onCancel}>
					Cancel
				</Button>
				{(!isEditing || (isEditing && email === defaultValues.email)) && (
				<Button style={styles.button} onPress={submitHandler}>
					{submitButtonLabel}
				</Button>)}
			</View>
		</View>
	);
}

export default ExpenseForm;

const styles = StyleSheet.create({
	form: {
		marginTop: 80,
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		color: 'white',
		marginVertical: 24,
		textAlign: 'center',
	},
	inputRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	rowInput: {
		flex: 1,
	},
	errorText: {
		textAlign: 'center',
		color: GlobalStyles.colors.error500,
		margin: 8,
	},
	buttons: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	button: {
		minWidth: 120,
		marginHorizontal: 8,
	},
	modalView:{
		margin:20,
		backgroundColor:'white',
		borderRadius:20,
		width:'90%',
		padding:35,
		alignItems:'center',
		shadowColor:'#000',
		shadowOffset:{
			width:0,
			height:2,
		},
		shadowOpacity:0.25,
		shadowRadius:4,
		elevation:5,
	}
});
