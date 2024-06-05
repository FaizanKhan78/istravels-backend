const validate = (schema) => async (req,res,next) =>{
    try {
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next();
    } catch (err) {
        // console.log(err)
        const status  = 500;
        const message = "Fill The input Properly";
        const extraDetails  = err.errors[0].message;

        const error={
            status,
            message,
            extraDetails,
        }
        next(error)
    }
}

module.exports = validate;