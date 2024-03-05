/// <reference types="Cypress" />
import { Then, When } from 'cypress-cucumber-preprocessor/steps';

/**
 * Converts a string value to a native data type if indicated in the map.
 * @param {string} val the proposed value
 */
const convertValue = (val) => {
	if (typeof val === 'string') {
		if (val.indexOf('(int)') === 0) {
			return parseInt(val.replace('(int)', ''));
		} else if (val.indexOf('(arr)') === 0) {
			return val.replace('(arr)', '').split(',');
		} else if (val.indexOf('(bool)') === 0) {
			return val.replace('(bool)', '') === 'true' ? true : false;
		} else if (val.indexOf('(arrInt)') === 0) {
			const convertedArr = [];
			val
				.replace('(arrInt)', '')
				.split(',')
				.forEach((element) => {
					convertedArr.push(parseInt(element));
				});
			return convertedArr;
		}
	}
	return val;
};

/**
 * Converts an object with a.b.c styled keys into an
 * object with properties.
 * @param {object} obj The DataTable.hashes()
 */
const convertAnalyticsDatatableObject = (obj) => {
	const objPass1 = Object.keys(obj)
		.map((key) => {
			const [first, ...rest] = key.split('.');
			if (rest.length > 0) {
				const newRestKey = rest.join('.');
				const value = convertValue(obj[first + '.' + newRestKey]);
				return {
					first,
					rest: {
						[newRestKey]: value,
					},
				};
			} else {
				return {
					first,
					value: obj[first],
				};
			}
		})
		.reduce((ac, curr) => {
			const newKey = curr.first;

			if (curr.value !== undefined) {
				if (ac[newKey]) {
					throw new Error(`Key, ${newKey}, is already defined.`);
				}
				return {
					[newKey]: curr.value,
					...ac,
				};
			} else if (curr.rest) {
				if (ac[newKey] && typeof ac[newKey] !== 'object') {
					throw new Error(`Key, ${newKey}, is mixing values and objects.`);
				}

				return {
					...ac,
					[newKey]: {
						...ac[newKey],
						...curr.rest,
					},
				};
			} else {
				// This is not good
				return ac;
			}
		}, {});
	return Object.entries(objPass1).reduce((ac, [key, val] = {}) => {
		return {
			...ac,
			[key]: typeof val === 'object' ? convertAnalyticsDatatableObject(val) : val,
		};
	}, {});
};

/**
 * Finds an event with the following information.
 * @param {string} type The type of the event -- PageLoad or Other
 * @param {string} event The name of the event
 */
const getEventFromEDDL = (win, type, event) => {
	return win.NCIDataLayer.filter((evt) => evt.type === type && evt.event === event);
};

When('the NCIDataLayer is cleared', () => {
	cy.window().then((win) => {
		// For now while win.NCIDataLayer is normal array we can reset the
		// datalayer to an empty array.
		win.NCIDataLayer = [];
		console.log('win.NCIDataLayer has been reset');
	});
});

// So this is going to find the page load event with the name, and then
// basically build up an object from the data table for comparison to the
// matched event. Note we do not just look at the page here since in the
// future we could have additional data points.
Then('there should be an analytics event with the following details', (datatable) => {
	cy.window().then((win) => {
		console.log('finding analytics event for analytics step');
		// First convert the datatable into nested object.
		const rawDataObj = convertAnalyticsDatatableObject(datatable.rowsHash());
		// Gotta strip the header row. (key/value)
		const dataObj = Object.entries(rawDataObj).reduce((ac, [key, val]) => {
			if (key === 'key') {
				return ac;
			}
			return {
				...ac,
				[key]: val,
			};
		}, {});

		if (!dataObj.event) {
			throw new Error('Datatable is missing the event name');
		}

		if (!dataObj.type) {
			throw new Error('Datatable is missing the event type');
		}

		// Find the matching events, this should be only one.
		const matchedEvents = getEventFromEDDL(win, dataObj.type, dataObj.event);
		expect(matchedEvents).to.have.length(1);

		const eventData = matchedEvents[0];
		//this still need regex support, but new function checks for exact num of values in the event
		expect(deepEqual(eventData, dataObj)).to.be.true;
	});
});

//this still need regex support, but new function checks for exact num of values in the event
function deepEqual(eventObj, expectedObj) {
	const keys1 = Object.keys(eventObj);
	const keys2 = Object.keys(expectedObj);

	if (keys1.length !== keys2.length) {
		return false;
	}

	for (const key of keys1) {
		const val1 = eventObj[key];
		const val2 = expectedObj[key];
		const areObjects = isObject(val1) && isObject(val2);
		if ((areObjects && !deepEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
			return false;
		}
	}

	return true;
}

function isObject(object) {
	return object != null && typeof object === 'object';
}

///this is needed to capture event after eddl was refreshed and no longer contain past events (such as FormAbandon before page is reloaded.
// It is using global cy.NCIDataLayer instead of win.NCIDataLayer and cy has to be set(copied from win.NCIDataLayer) in the navigation step that will trigger
//page reload:
//cy.window().then(win=>{
//   cy.NCIDataLayer = Object.assign(win.NCIDataLayer)
// })
Then('there should be preserved analytics event with the following details', (datatable) => {
	cy.window().then(() => {
		console.log('finding analytics event for analytics step');
		// First convert the datatable into nested object.
		const rawDataObj = convertAnalyticsDatatableObject(datatable.rowsHash());
		// Gotta strip the header row. (key/value)
		const dataObj = Object.entries(rawDataObj).reduce((ac, [key, val]) => {
			if (key === 'key') {
				return ac;
			}
			return {
				...ac,
				[key]: val,
			};
		}, {});

		if (!dataObj.event) {
			throw new Error('Datatable is missing the event name');
		}

		if (!dataObj.type) {
			throw new Error('Datatable is missing the event type');
		}

		// Find the matching events, this should be only one.
		const matchedEvents = getPastEventFromEDDL(dataObj.type, dataObj.event);
		expect(matchedEvents).to.have.length(1);

		const eventData = matchedEvents[0];

		expect(deepEqual(eventData, dataObj)).to.be.true;
	});
});
///this is to use global cy instead of win
const getPastEventFromEDDL = (type, event) => {
	return cy.NCIDataLayer.filter((evt) => evt.type === type && evt.event === event);
};
