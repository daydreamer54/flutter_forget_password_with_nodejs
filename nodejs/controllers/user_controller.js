const User = require('../models/user_model')
const common_methods = require('../common/common_methods/common_methods')
const messages = require('../common/common_messages/return_messages')

//  add a new user into database
const addNewUser = async (req, res) => {
    const user = new User(req.body)
    try {
        if (user) {
            await user.save()

            //  user saved successfully
            return res.status(201).json({
                ok: true,
                message: messages.returnMessages.PROCESS_SUCCESS
            })
        } else {

            //error occurred while saving user
            return res.status(400).json({
                ok: false,
                message: messages.returnMessages.ERROR_OCCURRED
            })
        }
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: messages.returnMessages.SERVER_ERROR
        })
    }
}

//  generate && send new password
const forgetPassword = async (req, res) => {
    const user = await User.findOne({ mail: req.params.mail })
    console.log(user);
    try {
        if (user) {
            //  user found
            const newPassword = common_methods.generateRandomPassword()
            const updatedUser = await User.findOneAndUpdate({ mail: req.params.mail }, {
                $set: {
                    password: newPassword
                }
            }, { lean: true })

            if (updatedUser) {
                //  password updated successfully
                common_methods.sendMail(req.params.mail, newPassword)
                return res.status(201).json({
                    ok: true,
                    message: messages.returnMessages.MAIL_SUCCESS
                });
            }

        } else {
            //  invalid mail address
            return res.status(404).json({
                ok: false,
                message: messages.returnMessages.NOT_FOUND
            })
        }
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: messages.returnMessages.SERVER_ERROR
        })
    }
}

//  check user
const checkUser = async (req, res) => {
    try {
        const user = await User.findOne({ mail:req.body.mail , password:req.body.password })

        if (user) {
            //  user found
            return res.status(200).json({
                ok: true,
                message: messages.returnMessages.VALID_USER
            })
        } else {
            //  user not found
            return res.status(404).json({
                ok:false,
                message:messages.returnMessages.INVALID_USER
            })
        }
    } catch (error) {
        return res.status(500).json({
            ok:false,
            message:messages.returnMessages.SERVER_ERROR
        })
    }
}

module.exports = {
    addNewUser,
    forgetPassword,
    checkUser
}