/* eslint-disable prettier/prettier */
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useContext } from 'react';
import { FlatList } from 'react-native';
import { ExpensesContext } from '../store/expenses-context';
import UserItem from '../components/ExpensesOutput/UserItem';
import { GlobalStyles } from '../constants/styles';
import ExpensesSummary from '../components/ExpensesOutput/ExpensesSummary';

function renderUsersItem(itemData) {
	return <UserItem {...itemData.item} />;
}

function formatDataByEmail(data) {
    const result = {};
    data.forEach(item => {
      const email = item.email;
      if (!result[email]) {
        result[email] = [];
      }
      result[email].push(item);
    });
    for (const email in result) {
      const totalAmount = result[email].reduce((sum, item) => sum + item.amount, 0);
      result[email] = { email, totalAmount, items: result[email] };
    }
    return Object.values(result);
  }

function AllUsers() {
	const expensesCtx = useContext(ExpensesContext);
    const formatData = formatDataByEmail(expensesCtx.expenses);
	return (
        <View style={styles.container}>
          <ExpensesSummary expenses={expensesCtx.expenses} periodName={'Total'} />
        <FlatList
			data={formatData}
			renderItem={renderUsersItem}
			keyExtractor={(item) => item.email}
		/>
        </View>
	);
}

export default AllUsers;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 24,
		paddingTop: 24,
		paddingBottom: 0,
		backgroundColor: GlobalStyles.colors.primary700,
	},
});