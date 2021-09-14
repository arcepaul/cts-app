import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Fieldset, Checkbox } from '../../atomic';
import './TrialPhase.scss';

const TrialPhase = ({ handleUpdate }) => {
	const { trialPhases } = useSelector((store) => store.form);
	const [phases, setPhases] = useState(trialPhases);

	useEffect(() => {
		updateStore();
	}, [phases]);

	const updateStore = () => {
		handleUpdate('trialPhases', [...phases]);
	};

	const handleSelectAll = (e) => {
		setPhases(
			phases.map((phase) => ({
				...phase,
				checked: false,
			}))
		);
	};

	const handleCheckPhase = (e) => {
		const filtered = phases.map((phase) => {
			if (phase.value === e.target.value) {
				return {
					...phase,
					checked: e.target.checked,
				};
			} else {
				return phase;
			}
		});
		setPhases(filtered);
	};

	return (
		<Fieldset
			id="trialphase"
			classes="trial-phase"
			legend="Trial Phase"
			helpUrl="/about-cancer/treatment/clinical-trials/search/help#trialphase">
			<p>
				Select the trial phases for your search. You may check more than one box
				or select "All".
			</p>
			<div className="select-all">
				<Checkbox
					value=""
					name="tp"
					id="tp_all"
					label="All"
					classes="tp-all"
					checked={phases.every((phase) => !phase.checked)}
					onChange={handleSelectAll}
				/>
			</div>
			<div className="group-phases">
				{phases.map((field, idx) => (
					<Checkbox
						id={'tp_' + field.value}
						key={'tp_' + field.value}
						name="tp"
						value={field.value}
						label={field.label}
						onChange={handleCheckPhase}
						checked={field.checked}
					/>
				))}
			</div>
		</Fieldset>
	);
};

TrialPhase.propTypes = {
	phaseFields: PropTypes.array,
	handleUpdate: PropTypes.func,
};

export default TrialPhase;
