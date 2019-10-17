import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Fieldset, Autocomplete } from '../../atomic';
import { getDiseasesForSimpleTypeAhead } from '../../../store/actions';

const CancerTypeKeyword = ({ handleUpdate }) => {
  const dispatch = useDispatch();
  const { keywordPhrases, cancerType } = useSelector(store => store.form);
  const { diseases = [] } = useSelector(store => store.cache);

  const [CTK, setCTK] = useState({ value: (cancerType.name)? cancerType.name : keywordPhrases });

  useEffect(() => {
    dispatch(getDiseasesForSimpleTypeAhead({name: CTK.value}));
  }, [CTK, dispatch]);

  const matchItemToTerm = (item, value) => {
    return item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
  };

  // when selecting from dropdown, make it the cancer type and clear keywords/phrases
  const handleSelection = (diseaseResult) => {
    handleUpdate('cancerType', diseaseResult);
    handleUpdate('keywordPhrases', '');
  }

  return (
    <Fieldset
      id="type"
      legend="Cancer Type/Keyword"
      helpUrl="https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/help#basicsearch"
    >
      <Autocomplete
        id="ctk"
        label="Cancer Type/Keyword"
        value={CTK.value}
        inputProps={{ placeholder: 'Start typing to select a cancer type or keyword' }}
        wrapperStyle={{ position: 'relative', display: 'inline-block' }}
        items={diseases}
        getItemValue={item => item.name}
        shouldItemRender={matchItemToTerm}
        onChange={(event, value) => {
          setCTK({ value });
          handleUpdate('cancerType', {name: '', codes: []})
          handleUpdate('keywordPhrases', value);
        }}
        onSelect={(value, item) => {
          setCTK({ value });
          handleSelection(item);
        }}
        renderMenu={children => (
          <div className="cts-autocomplete__menu --q">{children}</div>
        )}
        renderItem={(item, isHighlighted) => (
          <div
            className={`cts-autocomplete__menu-item ${
              isHighlighted ? 'highlighted' : ''
            }`}
            key={item.codes[0]}
          >
            {item.name}
          </div>
        )}
      />
    </Fieldset>
  );
};

export default CancerTypeKeyword;
