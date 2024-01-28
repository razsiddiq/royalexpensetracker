/* eslint-disable prettier/prettier */
import * as React from 'react';
import { useContext, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import IconButton from '../components/UI/IconButton';
import { GlobalStyles } from '../constants/styles';
import { ExpensesContext } from '../store/expenses-context';
import { AuthContext } from '../store/auth-context';
import ExpenseForm from '../components/ManageExpense/ExpensForm';
import { deleteExpense, storeExpense, updateExpense } from '../util/https';
import LoadingOverlay from '../components/UI/LoadingOverlay';

function ManageExpense({ route, navigation }) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState();
	const expensesCtx = useContext(ExpensesContext);
	const authCtx = useContext(AuthContext);
	const accessToken = authCtx.token;
	const email = authCtx.email;

	const editedExpenseId = route.params?.expenseId;
	const isEditing = !!editedExpenseId;

	const selectedExpense = expensesCtx.expenses.find(
		(expense) => expense.id === editedExpenseId
	);

	useLayoutEffect(() => {
		navigation.setOptions({
			title: isEditing ? 'Edit Expense' : 'Add Expense',
		});
	}, [navigation, isEditing]);

	async function deleteExpenseHandler() {
		setIsSubmitting(true);
		try {
			expensesCtx.deleteExpense(editedExpenseId);
			await deleteExpense(editedExpenseId, accessToken);
			navigation.goBack();
		} catch (error) {
			setError('Could not fetch');
			setIsSubmitting(false);
		}
	}

	function cancelHandler() {
		navigation.goBack();
	}

	async function confirmHandler(expenseData) {
		setIsSubmitting(true);
		try {
			if (isEditing) {
				expensesCtx.updateExpense(editedExpenseId, expenseData);
				await updateExpense(editedExpenseId, expenseData, accessToken);
			} else {
				const id = await storeExpense(expenseData, accessToken);
				expensesCtx.addExpense({ ...expenseData, id: id });
			}
			navigation.goBack();
		} catch (error) {
			setError('Could not fetch');
			setIsSubmitting(false);
		}
	}

	// function errorHandler() {
	// 	setError(null);
	// }

	if (error && !isSubmitting) {
		return <ErrorOverlay message={error} />; //onConfirm={errorHandler}
	}
	if (isSubmitting) {
		return <LoadingOverlay />;
	}
	return (
		<View style={styles.container}>
			<ExpenseForm
				onCancel={cancelHandler}
				onSubmit={confirmHandler}
				submitButtonLabel={isEditing ? 'Update' : 'Add'}
				defaultValues={selectedExpense}
			/>
			{isEditing && email === selectedExpense.email && (
				<View style={styles.deleteContainer}>
					<IconButton
						icon='trash'
						color={GlobalStyles.colors.error500}
						size={36}
						onPress={deleteExpenseHandler}
					/>
				</View>
			)}
		</View>
	);
}

export default ManageExpense;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		backgroundColor: GlobalStyles.colors.primary800,
	},

	deleteContainer: {
		marginTop: 16,
		paddingTop: 8,
		borderTopWidth: 2,
		borderTopColor: GlobalStyles.colors.primary200,
		alignItems: 'center',
	},
});
