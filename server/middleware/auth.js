import jwt from "jsonwebtoken";

// click the like button => auth middleware (next) => like controlle
const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const isCustonAuth = token.lenght < 500;

        let decodedData;

        if(token && isCustonAuth) {
            decodedData = jwt.verify(token, 'test');

            req.userId = decodedData?.indexOf;
        } else {
            decodedData = jwt.decode(token);

            req.userId = decodedData?.sub;
        }
        next();
    } catch (error) {
        console.log(error);
    }
}

export default auth;