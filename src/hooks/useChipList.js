import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useChipList = (chiplistName, handleUpdate) => {
	const list = useSelector((store) => store.form[chiplistName]);
	const [chips, setChips] = useState([]);
	useEffect(() => {
		handleUpdate(chiplistName, [...chips]);
	}, [chips, chiplistName, handleUpdate]);
	const add = (item) => {
		//prevent dupes
		const newChips = [...chips, { label: item }];
		setChips([...new Set(newChips)]);
	};
	const remove = (item) => {
		let newChips = chips.filter((value) => {
			return value.label !== item;
		});
		setChips([...newChips]);
	};

	return {
		list,
		add,
		remove,
	};
};
