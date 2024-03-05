import { convertObjectToBase64 } from '../../utilities/objects';

// Action type declarations
// Let's use some constants for our state var so we can handle
// loading, loaded, 404 and error, without resorting to a reducer.
export const pageStates = Object.freeze({
	LOADING_STATE: 'loading_state',
	LOADED_STATE: 'loaded_state',
	NOTFOUND_STATE: 'notfound_state',
	ERROR_STATE: 'error_state',
	REDIR_STATE: 'redir_state',
});

// Action Names
const SUCCESSFUL_FETCH = 'successful_fetch';
const ERROR_OCCURRED = 'error_occurred';
const RESET_LOADING = 'reset_loading';
const REDIRECT_NEEDED = 'redirect_needed';
const STOP_LOADING = 'stop_loading';

// Actions
export const setLoading = () => {
	return {
		type: RESET_LOADING,
	};
};

/**
 * Updates the state to reflect a successful fetch from the API.
 * @param {string} fetchActionsHash a hash of the actions array representing the API calls
 * @param {Array<object>} fetchResponse the objects returned by the API for those calls
 */
export const setSuccessfulFetch = (fetchActionsHash, fetchResponse) => {
	return {
		type: SUCCESSFUL_FETCH,
		payload: {
			fetchActionsHash,
			fetchResponse,
		},
	};
};

export const setFailedFetch = () => {
	return {
		type: ERROR_OCCURRED,
	};
};

const getNonLoadedStatusByAction = (type) => {
	switch (type) {
		case RESET_LOADING:
			return pageStates.LOADING_STATE;
		case ERROR_OCCURRED:
			return pageStates.ERROR_STATE;
		case REDIRECT_NEEDED:
			return pageStates.REDIR_STATE;
	}
};
///

/**
 * Sets/Replaces the fetchActions with the payload
 * @param {<object>} fetchResponse the new seachCriteriaObject
 */
export const setFetchActions = (fetchAction) => {
	return {
		type: 'SET_PROP',
		prop: 'fetchActions',
		payload: [fetchAction],
	};
};

/**
 * Sets/Replaces the searchCriteriaObject with the payload
 * @param {<object>} fetchResponse the new seachCriteriaObject
 */
export const setSearchCriteriaObject = (searchCriteria) => {
	return {
		type: 'SET_PROP',
		prop: 'searchCriteriaObject',
		payload: searchCriteria,
	};
};

export const setSelectAll = (value) => {
	return {
		type: 'SET_PROP',
		prop: 'selectAll',
		payload: value,
	};
};

// Reducer
export const resultsPageReducer = (state = {}, action) => {
	if (action.type === SUCCESSFUL_FETCH) {
		// Did the payload change, or are we trying to update
		// the same object?
		const newResponseHash = convertObjectToBase64(action.payload.fetchResponse);
		const oldResponseHash = convertObjectToBase64(state.trialResults);
		if (newResponseHash === oldResponseHash && action.payload.fetchActionsHash === state.actionsHash) {
			// Same status, same object, same state
			return state;
		} else {
			// Update the state
			return {
				...state,
				selectAll: false,
				pageIsLoading: false,
				isLoading: false,
				isPageLoadReady: true,
				trialResults: action.payload.fetchResponse,
				actionsHash: action.payload.fetchActionsHash,
			};
		}
	} else {
		switch (action.type) {
			case 'SET_PROP':
				return {
					...state,
					[action.prop]: action.payload,
				};
			case STOP_LOADING:
				return {
					...state,
					isLoadingPage: false,
					isLoading: false,
				};
			case RESET_LOADING:
			case ERROR_OCCURRED:
			case REDIRECT_NEEDED: {
				const status = getNonLoadedStatusByAction(action.type);
				if (state.status === status && state.listingData === null && state.actionsHash === '') {
					return state;
				} else {
					return {
						status,
						listingData: null,
						actionsHash: '',
					};
				}
			}

			default:
				return state;
		}
	}
};
