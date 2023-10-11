const express=require('express');
const router=express.Router();
const {add_raw_data ,extract_entity,top_entity}=require("./../middleware/raw_data");

//router.route("/get").post(get_admin);
router.route("/add").post(add_raw_data);
router.route("/get").post(extract_entity);
router.route("/top").post(top_entity);
//router.route("/update").patch(update_admin);
//router.route("/delete").delete(delete_admin);

module.exports=router;