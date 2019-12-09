const express = require('express');
const router = express.Router();
const passport = require('passport');

const Adsense = require('../models/Adsense');

/**
 * @description GET /api/adsens
 */

router.get(
	'/',
	passport.authenticate('jwt', {
		session: false,
	}),
	async (req, res) => {
		Adsense.findOne({ where: {}, raw: true }).then(adsConfig => {
			return res.json({
				chatInputClientId: adsConfig.chatInputClientId,
				chatInputSlotId: adsConfig.chatInputSlotId,
				sidebarClientId: adsConfig.sidebarClientId,
				sidebarSlotId: adsConfig.sidebarSlotId,
				sideBarAdsExpr: adsConfig.sideBarAdsExpr,
				chatInputAdsExpr: adsConfig.chatInputAdsExpr,
			});
		});
	},
);
module.exports = router;
