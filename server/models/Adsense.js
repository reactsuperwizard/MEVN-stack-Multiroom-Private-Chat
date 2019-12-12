const Sequelize = require('sequelize');
const db = require('../database/db');
module.exports = (function() {
	const Adsense = db.sequelize.define(
		'adsense',
		{
			description: {
				type: Sequelize.STRING,
				required: true,
			},
			destinationId: {
				type: Sequelize.STRING,
				required: true,
			},
			adCode: {
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
