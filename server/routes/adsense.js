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
		Adsense.findAll({ where: {}, raw: true }).then(adsConfig => {
			return res.json(adsConfig);
		});
	},
);
module.exports = router;
