/* eslint-disable prettier/prettier */
import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GlobalStyles } from '../../constants/styles';

function UserItem({  email,totalAmount,items }) {
    const entries = items.length;
	return (
		<Pressable
			onPress={()=>{}}
			style={({ pressed }) => pressed && styles.pressed}
		>
			<View style={styles.expenseItem}>
				<View>
					<Text style={[styles.textBase, styles.description]}>
						{(email.split('@')[0])}
					</Text>
					 <Text style={styles.textBase}>Total {entries} Entr{entries > 1 ?'ies':'y'}</Text>
				</View>
				<View style={styles.amountContainer}>
					<Text style={styles.amount}>Rs.{totalAmount}</Text>
				</View>
			</View>
		</Pressable>
	);
}
export default UserItem;

const styles = StyleSheet.create({
	pressed: {
		opacity: 0.75,
	},
	expenseItem: {
		padding: 12,
		marginVertical: 8,
		backgroundColor: GlobalStyles.colors.primary500,
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderRadius: 6,
		elevation: 3,
		shadowColor: GlobalStyles.colors.gray500,
		shadowRadius: 4,
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0.4,
	},
	textBase: {
		color: GlobalStyles.colors.primary50,
	},
	description: {
		fontSize: 16,
		marginBottom: 4,
		fontWeight: 'bold',
	},
	amountContainer: {
		paddingHorizontal: 12,
		paddingVertical: 4,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 4,
		minWidth: 80,
	},
	amount: {
		color: GlobalStyles.colors.primary100,
		fontWeight: 'bold',
	},
});
