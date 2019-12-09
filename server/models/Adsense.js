const Sequelize = require('sequelize');
const db = require('../database/db');
module.exports = (function() {
	const Adsense = db.sequelize.define(
		'adsense',
		{
			chatInputClientId: {
				type: Sequelize.STRING,
				required: true,
			},
			chatInputSlotId: {
				type: Sequelize.STRING,
				required: true,
			},
			sidebarClientId: {
				type: Sequelize.STRING,
				required: true,
			},
			sidebarSlotId: {
				type: Sequelize.STRING,
				required: true,
			},
			chatInputAdsExpr: {
				type: Sequelize.STRING,
				required: true,
			},
			sideBarAdsExpr: {
				type: Sequelize.STRING,
				required: true,
			},
		},
		{
			timestamps: {
				createdAt: 'created_at',
			},
		},
	);
	return Adsense;
})();
