import jwt from 'jsonwebtoken'

// to like a post
// click on like btn => auth middleware (next) => like controller

const auth = async (req, res, next) => { // next is for do something n move ahead

    try {

        const token = req.headers.authorization?.split(" ")[1] // get token from header
        const isCustomAuth = token.length < 500 // check if token is from google or custom

        let decodedData

        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, 'test') // verify token
            req.userId = decodedData?.id // get id from token - as we're populating the id here, it will be available in the req object in the controller where we're using this middleware
        }
        else {
            decodedData = jwt.decode(token) // decode token
            req.userId = decodedData?.sub // get id from token
        }

        next() // move ahead

    } catch (error) {
        console.log(error)
    }

}

export default auth