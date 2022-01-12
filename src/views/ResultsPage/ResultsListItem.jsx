import React from 'react';
import * as queryString from 'query-string';

import { useDispatch } from 'react-redux';
import { receiveData } from '../../store/actions';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Checkbox from '../../components/atomic/Checkbox';

import {
	filterSitesByActiveRecruitment,
	isWithinRadius,
} from '../../utilities';
import { NIH_ZIPCODE } from '../../constants';
import { useTracking } from 'react-tracking';
import { useAppSettings } from '../../store/store.js';

const ResultsListItem = ({
	id,
	item,
	isChecked,
	onCheckChange,
	searchCriteria,
	itemIndex,
	resultsPage,
	formType,
}) => {
	const dispatch = useDispatch();
	// const { zipCoords, zipRadius, location, country, states, city, vaOnly } =
	// 	useSelector((store) => store.form);

	const { zipCoords, zipRadius, location, country, states, city, vaOnly, qs } =
		searchCriteria;

	const [{ analyticsName }] = useAppSettings();
	const tracking = useTracking();

	const qsQbj = queryString.parse(qs);
	qsQbj.id = item.nci_id;
	const itemQueryString = queryString.stringify(qsQbj, {
		arrayFormat: 'none',
	});

	//TODO: Add param comments for all of these

	//compare site values against user criteria
	const isLocationParamMatch = (itemSite) => {
		// If search params have a city, but it does
		// not match.
		if (
			city !== '' &&
			(!itemSite.org_city ||
				itemSite.org_city.toLowerCase() !== city.toLowerCase())
		) {
			return false;
		}

		// Now check country
		if (
			country !== '' &&
			(!itemSite.org_country ||
				itemSite.org_country.toLowerCase() !== country.toLowerCase())
		) {
			return false;
		}

		// If states are provided and there is not a state match
		// Note, let's pretend the abbreviation matches against
		// another countries state abbreviation -- the country
		// check would fail in that case...
		if (states.length > 0) {
			// This site has no state so it can't be a match.
			if (!itemSite.org_state_or_province) {
				return false;
			}
			// Extract abbreviations
			const stateAbbrs = states.map((st) => st.abbr.toUpperCase());
			if (!stateAbbrs.includes(itemSite.org_state_or_province.toUpperCase())) {
				return false;
			}
		}

		// If we get here, then everything is a match.
		return true;
	};

	//compare site values against user criteria
	const isNIHParamMatch = (itemSite) => {
		return itemSite.org_postal_code === NIH_ZIPCODE;
	};

	const countNearbySitesByZip = (arr) => {
		return arr.reduce(
			(count, itemSite) =>
				count + isWithinRadius(zipCoords, itemSite.org_coordinates, zipRadius),
			0
		);
	};

	const countNearbySitesByCountryParams = (arr) => {
		return arr.reduce(
			(count, itemSite) => count + isLocationParamMatch(itemSite),
			0
		);
	};

	const countNearbySitesByNIHParams = (arr) => {
		return arr.reduce(
			(count, itemSite) => count + isNIHParamMatch(itemSite),
			0
		);
	};

	const getGenderDisplay = (genderVal) => {
		const displays = {
			MALE: 'Male',
			FEMALE: 'Female',
			BOTH: 'Male or Female',
		};
		return displays[genderVal];
	};

	const getAgeDisplay = () => {
		if (
			item.eligibility.structured.min_age_number === 0 &&
			item.eligibility.structured.max_age_number > 120
		) {
			return 'Not Specified';
		}
		if (
			item.eligibility.structured.min_age_number === 0 &&
			item.eligibility.structured.max_age_number < 120
		) {
			return `${item.eligibility.structured.min_age_number} years and younger`;
		}
		if (
			item.eligibility.structured.min_age_number > 0 &&
			item.eligibility.structured.max_age_number < 120
		) {
			return `${item.eligibility.structured.min_age_number} to ${item.eligibility.structured.max_age_number} years`;
		}
		if (
			item.eligibility.structured.min_age_number > 0 &&
			item.eligibility.structured.max_age_number > 120
		) {
			return `${item.eligibility.structured.min_age_number} years and over`;
		}
	};

	const getLocationDisplay = () => {
		// NOTE: Displays for count should be ONLY US sites
		// unless it is a country search and the country
		// is not US.
		const sitesListAllUnfiltered =
			location === 'search-location-country' && country !== 'United States'
				? item.sites
				: item.sites.filter((site) => site.org_country === 'United States');

		// Filter the sites by active recruitment.
		const sitesListAll = filterSitesByActiveRecruitment(sitesListAllUnfiltered);

		// If there are no sites we need to display special information
		if (sitesListAll.length === 0) {
			// The old code also referenced a "not yet active" status, which does not exist, so
			// we are going to ignore that.
			if (
				item.current_trial_status === 'Approved' ||
				item.current_trial_status === 'In Review'
			) {
				return 'Location information is not yet available';
			} else {
				return (
					<>
						See{' '}
						<a
							href={`https://www.clinicaltrials.gov/show/${item.nct_id}`}
							target="_blank"
							rel="noopener noreferrer">
							ClinicalTrials.gov
						</a>
					</>
				);
			}
		}

		// A single study site shows the name of the organiztion.
		// Don't ask me (bp) what the ID is of a trial that has no
		// US sites and only a single foreign site.
		if (sitesListAll.length === 1) {
			const site = sitesListAll[0];
			let displayText = `${site.org_name}, ${site.org_city}, `;
			displayText +=
				site.org_country === 'United States'
					? site.org_state_or_province
					: site.org_country;
			return displayText;
		}

		// We filter on VA here to cut down on conditionals
		// in all the count by.
		const sitesListForNearCount = vaOnly
			? sitesListAll.filter((site) => site.org_va)
			: sitesListAll;

		// Assume that search-location-zip means that
		// you have a properly filled in zip code.
		if (location === 'search-location-zip') {
			//has a zip
			if (zipCoords.lat !== '' && zipCoords.long !== '') {
				return `${sitesListAll.length} location${
					sitesListAll.length === 1 ? '' : 's'
				}, including ${countNearbySitesByZip(sitesListForNearCount)} near you`;
			}
		} else if (location === 'search-location-country') {
			return `${sitesListAll.length} location${
				sitesListAll.length === 1 ? '' : 's'
			}, including ${countNearbySitesByCountryParams(
				sitesListForNearCount
			)} near you`;
		} else if (location === 'search-location-nih') {
			return `${sitesListAll.length} location${
				sitesListAll.length === 1 ? '' : 's'
			}, including ${countNearbySitesByNIHParams(
				sitesListForNearCount
			)} near you`;
		} else if (vaOnly) {
			// This accounts for search-location-all and vaOnly. The old code made sure
			// hospital + va would not display, but the new logic should not have this
			// issue.
			return `${sitesListAll.length} location${
				sitesListAll.length === 1 ? '' : 's'
			}, including ${sitesListForNearCount.length} near you`;
		}
		return `${sitesListAll.length} location${
			sitesListAll.length === 1 ? '' : 's'
		}`;
	};

	const setCachedTitle = () => {
		dispatch(receiveData('currentTrialTitle', item.brief_title));
	};

	const handleLinkClick = () => {
		tracking.trackEvent({
			// These properties are required.
			type: 'Other',
			event: 'ClinicalTrialsSearchApp:Other:ResultsListItem',
			analyticsName,
			// Any additional properties fall into the "page.additionalDetails" bucket
			// for the event.
			pageNum: resultsPage + 1, // This is obviously 1 based.
			resultsPosition: itemIndex + 1, //This is 1 based.
			formType,
			linkName: 'UnknownLinkName',
		});
		setCachedTitle();
	};

	return (
		<div className="results-list-item results-list__item">
			<div className="results-list-item__checkbox">
				<Checkbox
					id={id || item.nci_id}
					name={item.nci_id}
					checked={isChecked}
					label="Select this article for print"
					hideLabel
					onChange={() => onCheckChange(id)}
					disableTracking={true}
				/>
			</div>
			<div className="results-list-item__contents">
				<div className="results-list-item__title">
					<Link
						to={`/about-cancer/treatment/clinical-trials/search/v?${itemQueryString}`}
						onClick={handleLinkClick}>
						{item.brief_title}
					</Link>
				</div>
				<div className="results-list-item__category">
					<span>Status:</span>
					{item.current_trial_status ? 'Active' : 'Active'}
				</div>
				<div className="results-list-item__category">
					<span>Age:</span>
					{getAgeDisplay()}
				</div>
				<div className="results-list-item__category">
					<span>Gender:</span>
					{item.eligibility &&
						getGenderDisplay(item.eligibility.structured.gender)}
				</div>
				<div className="results-list-item__category">
					<span>Location:</span>
					{item.sites && getLocationDisplay()}
				</div>
			</div>
		</div>
	);
};

ResultsListItem.propTypes = {
	id: PropTypes.string,
	item: PropTypes.object,
	isChecked: PropTypes.bool,
	onCheckChange: PropTypes.func.isRequired,
	searchCriteria: PropTypes.object,
	itemIndex: PropTypes.number,
	resultsPage: PropTypes.number,
	formType: PropTypes.string,
};

ResultsListItem.defaultProps = {
	results: [],
	isChecked: false,
};

export default ResultsListItem;
