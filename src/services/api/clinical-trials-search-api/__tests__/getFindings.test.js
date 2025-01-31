import axios from 'axios';
import querystring from 'query-string';
import nock from 'nock';

import clinicalTrialsSearchClientFactory from '../clinicalTrialsSearchClientFactory';
import { ACTIVE_TRIAL_STATUSES } from '../../../../constants';
import { getFindings } from '../getFindings';
import { getFindingsAction } from '../../../../store/actionsV2';

const mock = {
	data: [
		{
			name: 'BRCA1 Mutation Carrier',
			codes: ['C115197'],
			ancestor_ids: ['C4872'],
			type: ['finding'],
			parent_ids: [],
			synonyms: [],
			count: 1,
		},
		{
			name: 'BRCA2 Mutation Carrier',
			codes: ['C115198'],
			ancestor_ids: ['C4872'],
			type: ['finding'],
			parent_ids: [],
			synonyms: [],
			count: 1,
		},
		{
			name: 'Cancer Survivor',
			codes: ['C18673'],
			ancestor_ids: [
				'C127153',
				'C136478',
				'C136479',
				'C136480',
				'C136481',
				'C2955',
				'C3850',
				'C3998',
				'C4872',
				'C4878',
				'C5099',
				'C7626',
				'C7771',
				'C8953',
				'C9238',
				'C9292',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: ['Survivor, Cancer'],
			count: 1,
		},
		{
			name: 'Cytochrome P450 2D6',
			codes: ['C17287'],
			ancestor_ids: [
				'C127155',
				'C129707',
				'C134191',
				'C134192',
				'C134193',
				'C134194',
				'C134195',
				'C134196',
				'C134197',
				'C134198',
				'C134921',
				'C134925',
				'C134927',
				'C134928',
				'C134930',
				'C139541',
				'C139542',
				'C139543',
				'C139544',
				'C139545',
				'C139582',
				'C139583',
				'C139584',
				'C139585',
				'C139587',
				'C139806',
				'C139807',
				'C139808',
				'C139809',
				'C139810',
				'C139811',
				'C139812',
				'C139813',
				'C139814',
				'C139971',
				'C139972',
				'C139973',
				'C139974',
				'C139975',
				'C139976',
				'C139977',
				'C139978',
				'C139979',
				'C153066',
				'C153069',
				'C153238',
				'C153348',
				'C156064',
				'C156068',
				'C156069',
				'C156096',
				'C159676',
				'C162194',
				'C162475',
				'C162648',
				'C2955',
				'C3261',
				'C3262',
				'C3850',
				'C4872',
				'C4908',
				'C61574',
				'C9118',
				'C9292',
				'C9306',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: [
				'CYP2D6',
				'CYPIID6',
				'Cytochrome P450 Subfamily IID Polypeptide 6',
				'Cytochrome P450, Subfamily IID',
				'Cytochrome P450, Subfamily IID-Like 1',
				'Cytochrome P450-DB1',
				'Debrisoquine 4-Hydroxylase',
				'EC 1.14.14.1',
				'Flavoprotein-Linked Monooxygenase',
				'Microsomal Monooxygenase',
				'P450-2D6',
				'P450-DB1',
				'P450DB1',
				'Xenobiotic Monooxygenase',
			],
			count: 1,
		},
		{
			name: 'Deleterious CDH1 Gene Mutation',
			codes: ['C162747'],
			ancestor_ids: [
				'C3262',
				'C3867',
				'C40022',
				'C4872',
				'C4908',
				'C4913',
				'C61574',
				'C7558',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: [
				'Deleterious Arc-1 Gene Mutation',
				'Deleterious CD324 Gene Mutation',
				'Deleterious CDHE Gene Mutation',
				'Deleterious Cadherin 1 Gene Mutation',
				'Deleterious Cadherin 1, Type 1, E-Cadherin (Epithelial) Gene Mutation',
				'Deleterious Cadherin, Epithelial Gene Mutation',
				'Deleterious Calcium-Dependent Adhesion Protein, Epithelial Gene Mutation',
				'Deleterious E-Cadherin Gene Mutation',
				'Deleterious ECAD Gene Mutation',
				'Deleterious LCAM Gene Mutation',
				'Deleterious UVO Gene Mutation',
			],
			count: 1,
		},
		{
			name: 'Deleterious DICER1 Gene Mutation',
			codes: ['C162745'],
			ancestor_ids: [
				'C3262',
				'C3867',
				'C40022',
				'C4872',
				'C4908',
				'C4913',
				'C61574',
				'C7558',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: [
				'DCR1 Gene Mutation',
				'Deleterious DCR-1 Gene Mutation',
				'Deleterious DICER Gene Mutation',
				'Deleterious Dicer 1, Double-Stranded RNA-Specific Endoribonuclease Gene Mutation',
				'Deleterious Dicer 1, Ribonuclease III Gene Mutation',
				'Deleterious Dicer 1, Ribonuclease Type III Gene Mutation',
				'Deleterious HERNA Gene Mutation',
				'Deleterious MNG1 Gene Mutation',
				'Deleterious RMSE2 Gene Mutation',
			],
			count: 1,
		},
		{
			name: 'Deleterious SMARCA4 Gene Mutation',
			codes: ['C162746'],
			ancestor_ids: [
				'C3262',
				'C3867',
				'C40022',
				'C4872',
				'C4908',
				'C4913',
				'C61574',
				'C7558',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: [
				'Deleterious BAF190 Gene Mutation',
				'Deleterious BAF190A Gene Mutation',
				'Deleterious BRG-1 Gene Mutation',
				'Deleterious BRG1 Gene Mutation',
				'Deleterious BRM/SWI2-Related Gene 1 Mutation',
				'Deleterious SNF2 Gene Mutation',
				'Deleterious SNF2-Beta Gene Mutation',
				'Deleterious SNF2L4 Gene Mutation',
				'Deleterious SNF2LB Gene Mutation',
				'Deleterious SWI/SNF Related, Matrix Associated, Actin Dependent Regulator of Chromatin, Subfamily A, Member 4 Gene Mutation',
				'Deleterious SWI1 Gene Mutation',
				'Deleterious hSNF2b Gene Mutation',
			],
			count: 1,
		},
		{
			name: 'Deleterious STK11 Gene Mutation',
			codes: ['C162744'],
			ancestor_ids: [
				'C3262',
				'C3867',
				'C40022',
				'C4872',
				'C4908',
				'C4913',
				'C61574',
				'C7558',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: [
				'Deleterious LKB1 Gene Mutation',
				'Deleterious Liver Kinase B1 Gene Mutation',
				'Deleterious STK11 Mutation',
				'Deleterious Serine/Threonine Kinase 11 Gene Mutation',
			],
			count: 1,
		},
		{
			name: 'EGFR Positive',
			codes: ['C134501'],
			ancestor_ids: [
				'C129707',
				'C129861',
				'C133650',
				'C133651',
				'C133652',
				'C133653',
				'C133663',
				'C133665',
				'C133666',
				'C133667',
				'C133668',
				'C134191',
				'C134192',
				'C134193',
				'C134194',
				'C134195',
				'C134196',
				'C134197',
				'C134198',
				'C134520',
				'C134521',
				'C134522',
				'C134523',
				'C134524',
				'C134525',
				'C134921',
				'C134925',
				'C134927',
				'C134928',
				'C134930',
				'C136478',
				'C136479',
				'C136480',
				'C136481',
				'C136482',
				'C136483',
				'C136484',
				'C136877',
				'C136878',
				'C136886',
				'C136887',
				'C136888',
				'C136889',
				'C137655',
				'C137656',
				'C137670',
				'C137671',
				'C137672',
				'C137673',
				'C137675',
				'C137677',
				'C139541',
				'C139542',
				'C139543',
				'C139544',
				'C139545',
				'C139582',
				'C139583',
				'C139584',
				'C139585',
				'C139587',
				'C139749',
				'C139750',
				'C139752',
				'C139753',
				'C139754',
				'C139755',
				'C140325',
				'C140326',
				'C148493',
				'C153169',
				'C153170',
				'C153172',
				'C156294',
				'C160296',
				'C162158',
				'C162475',
				'C162648',
				'C162653',
				'C165299',
				'C165300',
				'C27134',
				'C28302',
				'C2916',
				'C2926',
				'C2955',
				'C3099',
				'C3208',
				'C3224',
				'C3510',
				'C35850',
				'C3850',
				'C4872',
				'C4878',
				'C4911',
				'C4914',
				'C4917',
				'C7927',
				'C9039',
				'C9292',
				'C9384',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: [
				'ERBB Positive',
				'ERBB1 Positive',
				'Epidermal Growth Factor Receptor Positive',
				'HER1 Positive',
				'c-erbB1 Positive',
			],
			count: 1,
		},
		{
			name: 'Elobixibat',
			codes: ['C171820'],
			ancestor_ids: [
				'C126465',
				'C127155',
				'C128797',
				'C128798',
				'C133007',
				'C133008',
				'C133009',
				'C133010',
				'C133011',
				'C133093',
				'C133160',
				'C133161',
				'C133162',
				'C133163',
				'C133164',
				'C133404',
				'C133405',
				'C133406',
				'C133407',
				'C133408',
				'C133409',
				'C133410',
				'C133418',
				'C133419',
				'C133420',
				'C133421',
				'C133422',
				'C133423',
				'C133424',
				'C133425',
				'C133426',
				'C133434',
				'C133435',
				'C133436',
				'C133437',
				'C133438',
				'C133439',
				'C133440',
				'C133556',
				'C133557',
				'C133558',
				'C133560',
				'C133575',
				'C133577',
				'C133579',
				'C133580',
				'C133581',
				'C133582',
				'C133586',
				'C133587',
				'C133588',
				'C133589',
				'C133590',
				'C133591',
				'C133650',
				'C133651',
				'C133652',
				'C133653',
				'C133663',
				'C133665',
				'C133666',
				'C133667',
				'C133668',
				'C133672',
				'C133673',
				'C136478',
				'C136479',
				'C136480',
				'C136481',
				'C136482',
				'C136483',
				'C136484',
				'C139541',
				'C139542',
				'C139543',
				'C139544',
				'C139545',
				'C139582',
				'C139583',
				'C139584',
				'C139585',
				'C139587',
				'C150577',
				'C153200',
				'C153213',
				'C153238',
				'C153320',
				'C153348',
				'C153359',
				'C156073',
				'C156081',
				'C156082',
				'C156085',
				'C156087',
				'C157056',
				'C157364',
				'C157365',
				'C158752',
				'C160920',
				'C162759',
				'C162772',
				'C165491',
				'C165560',
				'C168777',
				'C168783',
				'C168976',
				'C170782',
				'C171014',
				'C171281',
				'C171286',
				'C2916',
				'C2926',
				'C3513',
				'C35850',
				'C3999',
				'C4034',
				'C4855',
				'C4872',
				'C4878',
				'C4911',
				'C6076',
				'C7624',
				'C7771',
				'C8051',
				'C8990',
				'C9105',
				'C9241',
				'C9292',
				'C9315',
				'C9465',
				'C9466',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: ['ELOBIXIBAT'],
			count: 1,
		},
		{
			name: 'Endocervical Cancer',
			codes: ['C28327'],
			ancestor_ids: [
				'C127155',
				'C129707',
				'C133093',
				'C133258',
				'C133259',
				'C133404',
				'C133405',
				'C133406',
				'C133407',
				'C133408',
				'C133409',
				'C133410',
				'C133418',
				'C133419',
				'C133420',
				'C133421',
				'C133422',
				'C133423',
				'C133424',
				'C133425',
				'C133426',
				'C133434',
				'C133435',
				'C133436',
				'C133437',
				'C133438',
				'C133439',
				'C133440',
				'C133449',
				'C133450',
				'C133451',
				'C133452',
				'C133453',
				'C133455',
				'C133456',
				'C133457',
				'C133458',
				'C133459',
				'C133460',
				'C133461',
				'C133532',
				'C133534',
				'C133535',
				'C133536',
				'C133537',
				'C133538',
				'C133539',
				'C133541',
				'C133542',
				'C133650',
				'C133651',
				'C133652',
				'C133653',
				'C133663',
				'C133665',
				'C133666',
				'C133667',
				'C133668',
				'C133672',
				'C133673',
				'C134191',
				'C134192',
				'C134193',
				'C134194',
				'C134195',
				'C134196',
				'C134197',
				'C134198',
				'C134921',
				'C134925',
				'C134927',
				'C134928',
				'C134930',
				'C136403',
				'C136404',
				'C136405',
				'C136406',
				'C136478',
				'C136479',
				'C136480',
				'C136481',
				'C136482',
				'C136483',
				'C136484',
				'C137655',
				'C137656',
				'C137670',
				'C137671',
				'C137672',
				'C137673',
				'C137675',
				'C137677',
				'C139541',
				'C139542',
				'C139543',
				'C139544',
				'C139545',
				'C139582',
				'C139583',
				'C139584',
				'C139585',
				'C139587',
				'C139749',
				'C139750',
				'C139752',
				'C139753',
				'C139754',
				'C139755',
				'C139971',
				'C139972',
				'C139973',
				'C139974',
				'C139975',
				'C139976',
				'C139977',
				'C139978',
				'C139979',
				'C140325',
				'C140326',
				'C148494',
				'C150595',
				'C151993',
				'C153169',
				'C153170',
				'C153238',
				'C153320',
				'C153387',
				'C156064',
				'C156073',
				'C156094',
				'C156096',
				'C156294',
				'C156295',
				'C157623',
				'C158960',
				'C160599',
				'C160783',
				'C160920',
				'C162158',
				'C162475',
				'C162648',
				'C162752',
				'C162766',
				'C162772',
				'C164214',
				'C165252',
				'C165299',
				'C165458',
				'C167072',
				'C168976',
				'C168994',
				'C168995',
				'C170978',
				'C170979',
				'C170980',
				'C171573',
				'C171574',
				'C175935',
				'C180891',
				'C27814',
				'C2926',
				'C2955',
				'C3058',
				'C3059',
				'C3224',
				'C3234',
				'C3268',
				'C3510',
				'C3513',
				'C35850',
				'C3850',
				'C4436',
				'C4872',
				'C4878',
				'C4908',
				'C4911',
				'C4914',
				'C7865',
				'C8925',
				'C9039',
				'C9292',
				'C9293',
				'C9384',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: [
				'Carcinoma of Endocervix',
				'Carcinoma of the Endocervix',
				'Endocervical Adenocarcinoma',
				'Endocervical Carcinoma',
			],
			count: 1,
		},
		{
			name: 'Estrogen Receptor Negative',
			codes: ['C15493'],
			ancestor_ids: [
				'C133258',
				'C133259',
				'C133709',
				'C134928',
				'C134930',
				'C136478',
				'C136479',
				'C136480',
				'C136481',
				'C136482',
				'C136483',
				'C136484',
				'C136702',
				'C136703',
				'C136705',
				'C136706',
				'C136774',
				'C136775',
				'C136777',
				'C136778',
				'C136783',
				'C136784',
				'C136785',
				'C136786',
				'C136816',
				'C136817',
				'C136818',
				'C136819',
				'C139291',
				'C139541',
				'C139542',
				'C139543',
				'C139544',
				'C139545',
				'C139582',
				'C139583',
				'C139584',
				'C139585',
				'C139587',
				'C139971',
				'C139972',
				'C139973',
				'C139974',
				'C139975',
				'C139976',
				'C139977',
				'C139978',
				'C139979',
				'C153238',
				'C156069',
				'C160296',
				'C162194',
				'C162648',
				'C165458',
				'C168985',
				'C171264',
				'C175236',
				'C27134',
				'C2916',
				'C2929',
				'C3158',
				'C3161',
				'C3163',
				'C3208',
				'C3211',
				'C3242',
				'C3262',
				'C35850',
				'C3850',
				'C4665',
				'C4872',
				'C4878',
				'C4908',
				'C4914',
				'C4917',
				'C5007',
				'C7024',
				'C7025',
				'C71732',
				'C7539',
				'C7886',
				'C8489',
				'C8645',
				'C8701',
				'C8841',
				'C8842',
				'C8852',
				'C8853',
				'C8856',
				'C8857',
				'C8858',
				'C8862',
				'C9118',
				'C9251',
				'C9270',
				'C9306',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: [
				'ER Alpha Negative',
				'ER Negative',
				'ER-',
				'ER-Alpha Negative',
				'ERA Negative',
				'ESR Negative',
				'ESR1 Negative',
				'ESRA Negative',
				'ESTRR Negative',
				'Estrogen Receptor 1 Negative',
				'Estrogen Receptor Alpha Negative',
				'NR3A1 Negative',
				'Negative',
				'Negative Estrogen Receptor',
				'Nuclear Receptor Subfamily 3 Group A Member 1 Negative',
				'estrogen receptor negative',
			],
			count: 1,
		},
		{
			name: 'Estrogen Receptor Positive',
			codes: ['C15492'],
			ancestor_ids: [
				'C4872',
				'C139541',
				'C139542',
				'C139543',
				'C139544',
				'C139545',
				'C139582',
				'C139583',
				'C139584',
				'C139585',
				'C139587',
				'C147965',
				'C153238',
				'C157056',
				'C162648',
				'C46073',
				'C5454',
				'C5455',
				'C7768',
				'C7771',
				'C8287',
				'C85835',
				'C85836',
				'C88375',
				'C9245',
				'C94774',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: [
				'ER Alpha Positive',
				'ER Positive',
				'ER+',
				'ER-Alpha Positive',
				'ERA Positive',
				'ESR Positive',
				'ESR1 Positive',
				'ESRA Positive',
				'ESTRR Positive',
				'Estrogen Receptor 1 Positive',
				'Estrogen Receptor Alpha Positive',
				'NR3A1 Positive',
				'Nuclear Receptor Subfamily 3 Group A Member 1 Positive',
				'Positive',
				'Positive Estrogen Receptor',
				'estrogen receptor positive',
			],
			count: 2,
		},
		{
			name: 'Germline BRCA1 Gene Mutation',
			codes: ['C150629'],
			ancestor_ids: [
				'C139541',
				'C139542',
				'C139543',
				'C139544',
				'C139545',
				'C139582',
				'C139583',
				'C139584',
				'C139585',
				'C139587',
				'C153238',
				'C162182',
				'C4872',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: [
				'Germline BRCA1 Mutation',
				'Germline BROVCA1 Gene Mutation',
				'Germline Breast Cancer Type 1 Susceptibility Gene Mutation',
			],
			count: 1,
		},
		{
			name: 'Germline BRCA2 Gene Mutation',
			codes: ['C150630'],
			ancestor_ids: [
				'C139541',
				'C139542',
				'C139543',
				'C139544',
				'C139545',
				'C139582',
				'C139583',
				'C139584',
				'C139585',
				'C139587',
				'C153238',
				'C162182',
				'C4872',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: [
				'Germline BRCA2 Mutation',
				'Germline Breast Cancer Type 2 Susceptibility Gene Mutation',
				'Germline FANCD1 Gene Mutation',
				'Germline XRCC11 Gene Mutation',
			],
			count: 1,
		},
		{
			name: 'HER2/Neu Negative',
			codes: ['C68749'],
			ancestor_ids: [
				'C4872',
				'C139541',
				'C139542',
				'C139543',
				'C139544',
				'C139545',
				'C139582',
				'C139583',
				'C139584',
				'C139585',
				'C139587',
				'C153238',
				'C162648',
				'C133258',
				'C133259',
				'C133709',
				'C134928',
				'C134930',
				'C136478',
				'C136479',
				'C136480',
				'C136481',
				'C136482',
				'C136483',
				'C136484',
				'C136702',
				'C136703',
				'C136705',
				'C136706',
				'C136774',
				'C136775',
				'C136777',
				'C136778',
				'C136783',
				'C136784',
				'C136785',
				'C136786',
				'C136816',
				'C136817',
				'C136818',
				'C136819',
				'C139291',
				'C139971',
				'C139972',
				'C139973',
				'C139974',
				'C139975',
				'C139976',
				'C139977',
				'C139978',
				'C139979',
				'C147965',
				'C156069',
				'C157056',
				'C160296',
				'C162194',
				'C165458',
				'C168985',
				'C171264',
				'C175236',
				'C27134',
				'C2916',
				'C2929',
				'C3158',
				'C3161',
				'C3163',
				'C3208',
				'C3211',
				'C3242',
				'C3262',
				'C35850',
				'C3850',
				'C3995',
				'C4665',
				'C4878',
				'C4908',
				'C4914',
				'C4917',
				'C5007',
				'C7024',
				'C7025',
				'C71732',
				'C7539',
				'C7771',
				'C7886',
				'C8489',
				'C8645',
				'C8701',
				'C8841',
				'C8842',
				'C8852',
				'C8853',
				'C8856',
				'C8857',
				'C8858',
				'C8862',
				'C9118',
				'C9251',
				'C9270',
				'C9306',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: ['ERBB2 Negative', 'HER-2 Negative', 'HER2 Negative'],
			count: 3,
		},
		{
			name: 'High Risk Breast Carcinoma',
			codes: ['C179421'],
			ancestor_ids: [
				'C139569',
				'C139571',
				'C139572',
				'C139582',
				'C139583',
				'C139584',
				'C139585',
				'C4872',
				'C71732',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: ['High-Risk Breast Carcinoma'],
			count: 1,
		},
		{
			name: 'High-Frequency Microsatellite Instability',
			codes: ['C36493'],
			ancestor_ids: [
				'C126109',
				'C127155',
				'C129707',
				'C132819',
				'C132820',
				'C132821',
				'C132822',
				'C133258',
				'C133259',
				'C133556',
				'C133557',
				'C133558',
				'C133560',
				'C133575',
				'C133577',
				'C133579',
				'C133580',
				'C133581',
				'C133582',
				'C133650',
				'C133651',
				'C133652',
				'C133653',
				'C133663',
				'C133665',
				'C133666',
				'C133667',
				'C133668',
				'C133800',
				'C133801',
				'C133802',
				'C133803',
				'C133804',
				'C134520',
				'C134521',
				'C134522',
				'C134523',
				'C134524',
				'C134525',
				'C134761',
				'C134762',
				'C134763',
				'C134764',
				'C134921',
				'C134925',
				'C134927',
				'C134928',
				'C134930',
				'C136478',
				'C136479',
				'C136480',
				'C136481',
				'C136482',
				'C136483',
				'C136484',
				'C137655',
				'C137656',
				'C137670',
				'C137671',
				'C137672',
				'C137673',
				'C137675',
				'C137677',
				'C139291',
				'C139541',
				'C139542',
				'C139543',
				'C139544',
				'C139545',
				'C139582',
				'C139583',
				'C139584',
				'C139585',
				'C139587',
				'C139749',
				'C139750',
				'C139752',
				'C139753',
				'C139754',
				'C139755',
				'C139814',
				'C139971',
				'C139972',
				'C139973',
				'C139974',
				'C139975',
				'C139976',
				'C139977',
				'C139978',
				'C139979',
				'C139991',
				'C139992',
				'C139993',
				'C139994',
				'C139995',
				'C139996',
				'C139997',
				'C139998',
				'C139999',
				'C140008',
				'C140009',
				'C140010',
				'C140011',
				'C140012',
				'C140013',
				'C140014',
				'C140084',
				'C140085',
				'C140086',
				'C140087',
				'C140169',
				'C140170',
				'C140171',
				'C140172',
				'C140173',
				'C140174',
				'C140175',
				'C140325',
				'C140326',
				'C147983',
				'C148153',
				'C148493',
				'C148514',
				'C148515',
				'C150577',
				'C150595',
				'C153081',
				'C153169',
				'C153170',
				'C153319',
				'C153348',
				'C153387',
				'C154091',
				'C156063',
				'C156064',
				'C156069',
				'C156079',
				'C156094',
				'C156095',
				'C156286',
				'C156294',
				'C157631',
				'C159548',
				'C160296',
				'C162158',
				'C164236',
				'C165452',
				'C165458',
				'C166255',
				'C167203',
				'C167336',
				'C167395',
				'C167396',
				'C172252',
				'C173335',
				'C173338',
				'C174201',
				'C175236',
				'C175383',
				'C175491',
				'C176891',
				'C27814',
				'C2916',
				'C2926',
				'C3099',
				'C3224',
				'C3510',
				'C35850',
				'C3850',
				'C3867',
				'C3871',
				'C40022',
				'C4436',
				'C4863',
				'C4866',
				'C4872',
				'C4878',
				'C4908',
				'C4911',
				'C4914',
				'C4917',
				'C61574',
				'C7729',
				'C7927',
				'C8711',
				'C8925',
				'C8945',
				'C9039',
				'C9061',
				'C9291',
				'C9292',
				'C9384',
				'C9466',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: [
				'High',
				'MSI high',
				'MSI-H',
				'Microsatellite Instability High',
				'Microsatellite Instability-High',
			],
			count: 1,
		},
		{
			name: 'Homologous Recombination Deficiency',
			codes: ['C120465'],
			ancestor_ids: [
				'C127155',
				'C129707',
				'C133737',
				'C134921',
				'C134925',
				'C134927',
				'C134928',
				'C134930',
				'C139541',
				'C139542',
				'C139543',
				'C139544',
				'C139582',
				'C139583',
				'C139584',
				'C139585',
				'C139971',
				'C139972',
				'C139973',
				'C139974',
				'C139975',
				'C139976',
				'C140169',
				'C140170',
				'C140171',
				'C140172',
				'C140173',
				'C140174',
				'C140175',
				'C142808',
				'C147965',
				'C150091',
				'C153238',
				'C156064',
				'C156069',
				'C156284',
				'C162648',
				'C165452',
				'C165458',
				'C167255',
				'C27134',
				'C3850',
				'C4863',
				'C4872',
				'C4908',
				'C8946',
				'C9292',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: [
				'HRD',
				'HRR Deficiency',
				'Homologous Recombination Repair Deficiency',
			],
			count: 1,
		},
		{
			name: 'Hormone Receptor/HER2 Positive',
			codes: ['C118311'],
			ancestor_ids: [
				'C129707',
				'C129861',
				'C133650',
				'C133651',
				'C133652',
				'C133653',
				'C133663',
				'C133665',
				'C133666',
				'C133667',
				'C133668',
				'C134191',
				'C134192',
				'C134193',
				'C134194',
				'C134195',
				'C134196',
				'C134197',
				'C134198',
				'C134520',
				'C134521',
				'C134522',
				'C134523',
				'C134524',
				'C134525',
				'C134921',
				'C134925',
				'C134927',
				'C134928',
				'C134930',
				'C136478',
				'C136479',
				'C136480',
				'C136481',
				'C136482',
				'C136483',
				'C136484',
				'C136877',
				'C136878',
				'C136886',
				'C136887',
				'C136888',
				'C136889',
				'C137655',
				'C137656',
				'C137670',
				'C137671',
				'C137672',
				'C137673',
				'C137675',
				'C137677',
				'C139541',
				'C139542',
				'C139543',
				'C139544',
				'C139545',
				'C139582',
				'C139583',
				'C139584',
				'C139585',
				'C139587',
				'C139749',
				'C139750',
				'C139752',
				'C139753',
				'C139754',
				'C139755',
				'C140325',
				'C140326',
				'C148493',
				'C153169',
				'C153170',
				'C153172',
				'C156294',
				'C160296',
				'C162158',
				'C162475',
				'C162648',
				'C162653',
				'C165299',
				'C165300',
				'C27134',
				'C28302',
				'C2916',
				'C2926',
				'C2955',
				'C3099',
				'C3208',
				'C3224',
				'C3510',
				'C35850',
				'C3850',
				'C4872',
				'C4878',
				'C4911',
				'C4914',
				'C4917',
				'C7927',
				'C9039',
				'C9292',
				'C9384',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: [
				'Hormone Receptor/Epidermal Growth Factor Receptor 2 Positive',
				'Triple Positive',
				'Triple-Positive',
				'Triple-Positive Breast Cancer Finding',
			],
			count: 1,
		},
		{
			name: 'Left-Sided Breast Carcinoma',
			codes: ['C169111'],
			ancestor_ids: [
				'C139535',
				'C139536',
				'C139537',
				'C139538',
				'C139539',
				'C139540',
				'C139541',
				'C139542',
				'C139543',
				'C139544',
				'C139545',
				'C139556',
				'C139557',
				'C139558',
				'C139569',
				'C139571',
				'C139572',
				'C139582',
				'C139583',
				'C139584',
				'C139585',
				'C139587',
				'C3262',
				'C3576',
				'C4505',
				'C4565',
				'C4872',
				'C9335',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: [],
			count: 1,
		},
		{
			name: 'Mastectomy Patient',
			codes: ['C157605'],
			ancestor_ids: ['C4872'],
			type: ['finding'],
			parent_ids: [],
			synonyms: [],
			count: 1,
		},
		{
			name: 'Microsatellite Instability',
			codes: ['C36318'],
			ancestor_ids: [
				'C129707',
				'C129861',
				'C133650',
				'C133651',
				'C133652',
				'C133653',
				'C133663',
				'C133665',
				'C133666',
				'C133667',
				'C133668',
				'C134191',
				'C134192',
				'C134193',
				'C134194',
				'C134195',
				'C134196',
				'C134197',
				'C134198',
				'C134520',
				'C134521',
				'C134522',
				'C134523',
				'C134524',
				'C134525',
				'C134921',
				'C134925',
				'C134927',
				'C134928',
				'C134930',
				'C136478',
				'C136479',
				'C136480',
				'C136481',
				'C136482',
				'C136483',
				'C136484',
				'C136877',
				'C136878',
				'C136886',
				'C136887',
				'C136888',
				'C136889',
				'C137655',
				'C137656',
				'C137670',
				'C137671',
				'C137672',
				'C137673',
				'C137675',
				'C137677',
				'C139541',
				'C139542',
				'C139543',
				'C139544',
				'C139545',
				'C139582',
				'C139583',
				'C139584',
				'C139585',
				'C139587',
				'C139749',
				'C139750',
				'C139752',
				'C139753',
				'C139754',
				'C139755',
				'C140325',
				'C140326',
				'C148493',
				'C153169',
				'C153170',
				'C153172',
				'C156294',
				'C160296',
				'C162158',
				'C162475',
				'C162648',
				'C162653',
				'C165299',
				'C165300',
				'C27134',
				'C28302',
				'C2916',
				'C2926',
				'C2955',
				'C3099',
				'C3208',
				'C3224',
				'C3510',
				'C35850',
				'C3850',
				'C4872',
				'C4878',
				'C4911',
				'C4914',
				'C4917',
				'C7927',
				'C9039',
				'C9292',
				'C9384',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: [
				'MSI',
				'MSI Positive',
				'MSI Present',
				'Microsatellite Instability Positive',
				'Microsatellite Instability Present',
				'microsatellite instability',
			],
			count: 1,
		},
		{
			name: 'Mismatch Repair Deficiency',
			codes: ['C136712'],
			ancestor_ids: [
				'C126109',
				'C127155',
				'C129707',
				'C132819',
				'C132820',
				'C132821',
				'C132822',
				'C133258',
				'C133259',
				'C133556',
				'C133557',
				'C133558',
				'C133560',
				'C133575',
				'C133577',
				'C133579',
				'C133580',
				'C133581',
				'C133582',
				'C133650',
				'C133651',
				'C133652',
				'C133653',
				'C133663',
				'C133665',
				'C133666',
				'C133667',
				'C133668',
				'C133800',
				'C133801',
				'C133802',
				'C133803',
				'C133804',
				'C134520',
				'C134521',
				'C134522',
				'C134523',
				'C134524',
				'C134525',
				'C134761',
				'C134762',
				'C134763',
				'C134764',
				'C134921',
				'C134925',
				'C134927',
				'C134928',
				'C134930',
				'C136478',
				'C136479',
				'C136480',
				'C136481',
				'C136482',
				'C136483',
				'C136484',
				'C137655',
				'C137656',
				'C137670',
				'C137671',
				'C137672',
				'C137673',
				'C137675',
				'C137677',
				'C139291',
				'C139541',
				'C139542',
				'C139543',
				'C139544',
				'C139545',
				'C139582',
				'C139583',
				'C139584',
				'C139585',
				'C139587',
				'C139749',
				'C139750',
				'C139752',
				'C139753',
				'C139754',
				'C139755',
				'C139814',
				'C139971',
				'C139972',
				'C139973',
				'C139974',
				'C139975',
				'C139976',
				'C139977',
				'C139978',
				'C139979',
				'C139991',
				'C139992',
				'C139993',
				'C139994',
				'C139995',
				'C139996',
				'C139997',
				'C139998',
				'C139999',
				'C140008',
				'C140009',
				'C140010',
				'C140011',
				'C140012',
				'C140013',
				'C140014',
				'C140084',
				'C140085',
				'C140086',
				'C140087',
				'C140169',
				'C140170',
				'C140171',
				'C140172',
				'C140173',
				'C140174',
				'C140175',
				'C140325',
				'C140326',
				'C147983',
				'C148153',
				'C148493',
				'C148514',
				'C148515',
				'C150577',
				'C150595',
				'C153081',
				'C153169',
				'C153170',
				'C153319',
				'C153348',
				'C153387',
				'C154091',
				'C156063',
				'C156064',
				'C156069',
				'C156079',
				'C156094',
				'C156095',
				'C156286',
				'C156294',
				'C157631',
				'C159548',
				'C160296',
				'C162158',
				'C164236',
				'C165452',
				'C165458',
				'C166255',
				'C167203',
				'C167336',
				'C167395',
				'C167396',
				'C172252',
				'C173335',
				'C173338',
				'C174201',
				'C175236',
				'C175383',
				'C175491',
				'C176891',
				'C27814',
				'C2916',
				'C2926',
				'C3099',
				'C3224',
				'C3510',
				'C35850',
				'C3850',
				'C3867',
				'C3871',
				'C40022',
				'C4436',
				'C4863',
				'C4866',
				'C4872',
				'C4878',
				'C4908',
				'C4911',
				'C4914',
				'C4917',
				'C61574',
				'C7729',
				'C7927',
				'C8711',
				'C8925',
				'C8945',
				'C9039',
				'C9061',
				'C9291',
				'C9292',
				'C9384',
				'C9466',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: [
				'Deficient DNA Mismatch Repair',
				'MMR Deficiency',
				'MMR Deficient',
				'Mismatch Repair Deficient',
				'dMMR',
			],
			count: 1,
		},
		{
			name: 'Mutation Carrier',
			codes: ['C93175'],
			ancestor_ids: ['C36102', 'C4503', 'C4872', 'C4908', 'C54705', 'C8494'],
			type: ['finding'],
			parent_ids: [],
			synonyms: ['mutation carrier'],
			count: 1,
		},
		{
			name: 'Non-Metastatic Prostate Carcinoma',
			codes: ['C162638'],
			ancestor_ids: [
				'C139535',
				'C139536',
				'C139537',
				'C139538',
				'C139539',
				'C139540',
				'C139541',
				'C139542',
				'C139543',
				'C139544',
				'C139556',
				'C139557',
				'C139558',
				'C139569',
				'C139571',
				'C139572',
				'C139582',
				'C139583',
				'C139584',
				'C139585',
				'C140164',
				'C140165',
				'C140166',
				'C140167',
				'C140168',
				'C140169',
				'C140170',
				'C140171',
				'C140172',
				'C162782',
				'C4863',
				'C4872',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: [],
			count: 1,
		},
		{
			name: 'Progesterone Receptor Negative',
			codes: ['C15497'],
			ancestor_ids: [
				'C4872',
				'C133258',
				'C133259',
				'C133709',
				'C134928',
				'C134930',
				'C136478',
				'C136479',
				'C136480',
				'C136481',
				'C136482',
				'C136483',
				'C136484',
				'C136702',
				'C136703',
				'C136705',
				'C136706',
				'C136774',
				'C136775',
				'C136777',
				'C136778',
				'C136783',
				'C136784',
				'C136785',
				'C136786',
				'C136816',
				'C136817',
				'C136818',
				'C136819',
				'C139291',
				'C139541',
				'C139542',
				'C139543',
				'C139544',
				'C139545',
				'C139582',
				'C139583',
				'C139584',
				'C139585',
				'C139587',
				'C139971',
				'C139972',
				'C139973',
				'C139974',
				'C139975',
				'C139976',
				'C139977',
				'C139978',
				'C139979',
				'C153238',
				'C156069',
				'C160296',
				'C162194',
				'C162648',
				'C165458',
				'C168985',
				'C171264',
				'C175236',
				'C27134',
				'C2916',
				'C2929',
				'C3158',
				'C3161',
				'C3163',
				'C3208',
				'C3211',
				'C3242',
				'C3262',
				'C35850',
				'C3850',
				'C3995',
				'C4665',
				'C4878',
				'C4908',
				'C4914',
				'C4917',
				'C5007',
				'C7024',
				'C7025',
				'C71732',
				'C7539',
				'C7886',
				'C8489',
				'C8645',
				'C8701',
				'C8841',
				'C8842',
				'C8852',
				'C8853',
				'C8856',
				'C8857',
				'C8858',
				'C8862',
				'C9118',
				'C9251',
				'C9270',
				'C9306',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: [
				'Negative',
				'PGR Negative',
				'PR Negative',
				'PR-',
				'progesterone receptor negative',
			],
			count: 2,
		},
		{
			name: 'Progesterone Receptor Positive',
			codes: ['C15496'],
			ancestor_ids: [
				'C4872',
				'C139541',
				'C139542',
				'C139543',
				'C139544',
				'C139545',
				'C139582',
				'C139583',
				'C139584',
				'C139585',
				'C139587',
				'C147965',
				'C153238',
				'C157056',
				'C162648',
				'C3995',
				'C46073',
				'C5454',
				'C5455',
				'C7768',
				'C7771',
				'C8287',
				'C85835',
				'C85836',
				'C88375',
				'C9245',
				'C94774',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: [
				'PGR Positive',
				'PR Positive',
				'PR+',
				'Positive',
				'progesterone receptor positive',
			],
			count: 3,
		},
		{
			name: 'RB1 Positive',
			codes: ['C128842'],
			ancestor_ids: ['C139545', 'C139587', 'C153238', 'C4872'],
			type: ['finding'],
			parent_ids: [],
			synonyms: [
				'RB Positive',
				'RB+',
				'RB1+',
				'Retinoblastoma 1 Positive',
				'Retinoblastoma Positive',
			],
			count: 1,
		},
		{
			name: 'Somatic BRCA1 Gene Mutation',
			codes: ['C162184'],
			ancestor_ids: [
				'C139541',
				'C139542',
				'C139543',
				'C139544',
				'C139545',
				'C139582',
				'C139583',
				'C139584',
				'C139585',
				'C139587',
				'C153238',
				'C162182',
				'C4872',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: [
				'Somatic BRCA1 Mutation',
				'Somatic BROVCA1 Gene Mutation',
				'Somatic Breast Cancer Type 1 Susceptibility Gene Mutation',
			],
			count: 1,
		},
		{
			name: 'Somatic BRCA2 Gene Mutation',
			codes: ['C162183'],
			ancestor_ids: [
				'C139541',
				'C139542',
				'C139543',
				'C139544',
				'C139545',
				'C139582',
				'C139583',
				'C139584',
				'C139585',
				'C139587',
				'C153238',
				'C162182',
				'C4872',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: [
				'Somatic BRCA2 Mutation',
				'Somatic BROVCA2 Gene Mutation',
				'Somatic Breast Cancer Type 2 Susceptibility Gene Mutation',
				'Somatic FANCD1 Gene Mutation',
				'Somatic XRCC11 Gene Mutation',
			],
			count: 1,
		},
		{
			name: 'Surgery Patient',
			codes: ['C158375'],
			ancestor_ids: [
				'C132146',
				'C2955',
				'C3224',
				'C3262',
				'C3513',
				'C35850',
				'C4013',
				'C4863',
				'C4872',
				'C4878',
				'C9292',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: [],
			count: 1,
		},
		{
			name: 'Triple-Negative Breast Cancer Finding',
			codes: ['C71428'],
			ancestor_ids: [
				'C139545',
				'C157056',
				'C180924',
				'C4872',
				'C5214',
				'C53556',
			],
			type: ['finding'],
			parent_ids: [],
			synonyms: [
				'ER-Negative PR-Negative ERBB2-Negative',
				'ER-PR-HER2/neu-',
				'ER-negative PR-negative HER2/neu-negative',
				'ER/PR/HER2 Negative',
				'ESR1/PGR/ERBB2 Negative Finding',
				'Triple Negative Breast Cancer Finding',
				'Triple Negative Breast Cancer Result',
				'Triple-Negative Breast Cancer Result',
				'triple-negative breast cancer',
			],
			count: 1,
		},
	],
	total: 33,
};

// Required for unit tests to not have CORS issues
axios.defaults.adapter = require('axios/lib/adapters/http');

const client = clinicalTrialsSearchClientFactory('http://example.org');

describe('getFindings', () => {
	beforeAll(() => {
		nock.disableNetConnect();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		nock.cleanAll();
		nock.enableNetConnect();
	});

	it('makes a request to the api and matches returned result for specified ancestor id', async () => {
		const ancestorIds = ['C4872', 'C94774'];
		const query = getFindingsAction(ancestorIds);

		const requestQuery = {
			type: 'finding',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			maintype: ancestorIds,
		};

		const scope = nock('http://example.org')
			.get(`/diseases?${querystring.stringify(requestQuery)}`)
			.reply(200, mock);
		const response = await getFindings(client, query.payload.requestParams);
		expect(response).toEqual(mock);
		scope.isDone();
	});

	it('throws a 400 error', async () => {
		const ancestorIds = ['C4872', 'C94774'];
		const query = getFindingsAction(ancestorIds);

		const requestQuery = {
			type: 'finding',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			maintype: ancestorIds,
		};

		const scope = nock('http://example.org')
			.get(`/diseases?${querystring.stringify(requestQuery)}`)
			.reply(400);
		await expect(
			getFindings(client, query.payload.requestParams)
		).rejects.toThrow('Unexpected status 400 for fetching findings');
		scope.isDone();
	});

	it('throws a 500 error status', async () => {
		const ancestorIds = ['C4872', 'C94774'];
		const query = getFindingsAction(ancestorIds);

		const requestQuery = {
			type: 'finding',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			maintype: ancestorIds,
		};

		const scope = nock('http://example.org')
			.get(`/diseases?${querystring.stringify(requestQuery)}`)
			.reply(500);
		await expect(
			getFindings(client, query.payload.requestParams)
		).rejects.toThrow('Unexpected status 500 for fetching findings');
		scope.isDone();
	});

	it('throws a 204 error status', async () => {
		const ancestorIds = ['C4872', 'C94774'];
		const query = getFindingsAction(ancestorIds);

		const requestQuery = {
			type: 'finding',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			maintype: ancestorIds,
		};

		const scope = nock('http://example.org')
			.get(`/diseases?${querystring.stringify(requestQuery)}`)
			.reply(204);
		await expect(
			getFindings(client, query.payload.requestParams)
		).rejects.toThrow('Unexpected status 204 for fetching findings');
		scope.isDone();
	});

	it('handles an error thrown by http client', async () => {
		const ancestorIds = ['C4872', 'C94774'];
		const query = getFindingsAction(ancestorIds);

		const requestQuery = {
			type: 'finding',
			current_trial_status: ACTIVE_TRIAL_STATUSES,
			maintype: ancestorIds,
		};

		const scope = nock('http://example.org')
			.get(`/diseases?${querystring.stringify(requestQuery)}`)
			.replyWithError('connection refused');
		await expect(
			getFindings(client, query.payload.requestParams)
		).rejects.toThrow('connection refused');
		scope.isDone();
	});
});
