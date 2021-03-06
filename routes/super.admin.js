const express = require("express");
const router = express.Router();

const superAdmin = require("./../services/super.admin");

router.get("/", (req, res) => {
	res.render("super_admin/index", {title: "Super Admin"});
});

router.post("/", async (req, res) => {
	try {
		await superAdmin.login(req, res);
	} catch (e) {
		console.log(e);
		res.render("super_admin/index", {title: "Super Admin", message: e.message});
	}
});

router.get("/dashboard", async (req, res) => {
	try {
		await superAdmin.checkLogin(req, res);
		const data = await superAdmin.getCollegeData();
		// res.send(data);
		res.render("super_admin/dashboard", {data, isLogedin: true});
	} catch (e) {
		// console.log(e)
		res.render("super_admin/index", {title: "Super Admin", message: e.message});
	}
});

/**
 * GET /super/admin/college/:id for accepting the college
 * @function acceptCollege(id)
 * @param {string} id college id to accept the college
 */
router.get("/college/accept/:id", async (req, res) => {
	try {
		await superAdmin.checkLogin(req, res);
		await superAdmin.acceptCollege(req.params.id);
		res.redirect("/super/admin/dashboard");
	} catch (e) {
		res.render("super_admin/index", {title: "Super Admin", message: e.message});
	}
});

router.delete("/college/remove/:id", async (req, res) => {
	try {
		await superAdmin.checkLogin(req, res);
		await superAdmin.removeCollege(req, res);
		res.redirect("/super/admin/dashboard");
	} catch (e) {
		const data = await superAdmin.getCollegeData();
		res.render("super_admin/dashboard", {data, message: e.message});
	}
});

router.get("/logout", async (req, res) => {
	await superAdmin.logout(req, res);
});


module.exports = router;
