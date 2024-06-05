const {z} = require("zod");

const loginSchema = z.object({
    mobile_number:z.number({required_error:"Mobile Number required"}),
    password:z.string({required_error:"Password Required"}).trim().min(8,{message:"Password must be at lest of 8 character"}).max(20,{message:"Password must be at lest of 20 character"})
})

module.exports = loginSchema;