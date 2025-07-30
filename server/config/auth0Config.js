import {auth} from 'express-oauth2-jwt-bearer'

const jwtCheck = auth({
    audience: "https://real-estate-silk-xi-63.vercel.app/api",
    issuerBaseURL: "https://dev-fsh61roj257231uq.us.auth0.com",
    tokenSigningAlg: "RS256"
})

export default jwtCheck