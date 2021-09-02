const Admin = require('../model/admin')

module.exports = async function isadmin(req, res, next) {
    var login_id = req.params.id;
    const admin_present = await Admin.findOne({ login_id }).lean()
    if(admin_present){
        next()
    }else{
        return res.status(403).json({ error: "Not access"})
    }
}