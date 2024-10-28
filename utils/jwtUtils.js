
const jwt = require("jsonwebtoken");

const postJwt = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        // Generate JWT token
        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "6h",
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error generating JWT:", error); // Check this log
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = postJwt;