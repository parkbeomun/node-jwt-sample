const User = require('../../../models/user')
const jwt = require('jsonwebtoken')

/*

    POST /api/auth/register
    {
        username,
        password
    }

 */

exports.register = (req,res) => {
    const { username, password } = req.body
    let newUser = null

    //create a new user if does not exist
    const create = (user) => {
        if(user) {
            throw new Error('username exists')
        } else {
            return User.create(username, password)
        }
    }

    //count the number of the user
    const count = (user) => {
        newUser = user
        return User.count({}).exec()
    }

    //assing admin if count is 1
    const assign = (count) => {
        if(count === 1) {
           return newUser.assignAdmin()
        } else {
            //if not, return a promise that returns false
            return Promise.resolve(false)
        }
    }

    //repond the the client
    const respond = (isAdmin) => {
        res.json({
            message: 'registered successfully',
            admin: isAdmin ? true : false
        })
    }

    //run when there is error (username exists_
    const onError = (error) => {
        res.status(409).json({
            message: 'onError ' + error.message + ":" + username
        })
    }

    // check username duplication
    User.findOneByUsername(username)
        .then(create)
        .then(count)
        .then(assign)
        .then(respond)
        .catch(onError)

}


/*
    POST /api/auth/login
    {
        username,
        password
    }
*/

exports.login = (req, res) => {
    //res.send('login api is working')
    const {username, password} = req.body
    const secret = req.app.get('jwt-secret')

    //check the user info & generate the jwt
    const check = (user) => {
        if(!user) {
            //user does not exists
            throw new Error('login failed')
        } else {
            //user exists, check the password
            if(user.verify(password)) {
                //create a promise that generates jwt asynchrously
                const p = new Promise((resolve, reject) => {
                    jwt.sign(
                        {
                            _id: user._id,
                            username: user.username,
                            admin: user.admin
                        },
                        secret,
                        {
                            expiresIn: '7d',
                            issuer: '',
                            subject: 'userinfo'
                        }, (err, token) => {
                            if(err) reject(err)
                            resolve(token)
                        })
                })
                return p
            } else {
                throw new Error('login failed')
            }
        }
    }

    //respond the token
    const respond = (token) => {
        res.json({
            message: 'logged in successfully',
            token
        })
    }

    //error occured
    const onError = (error) => {
        res.status(403).json({
            message: error.message
        })
    }

    //find the user
    User.findOneByUsername(username)
        .then(check)
        .then(respond)
        .catch(onError)
}

/*
    GET /api/auth/check
*/

exports.check = (req,res) => {
    res.json({
        success: true,
        info: req.decoded
    })
}