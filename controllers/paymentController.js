const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.postPayment = async (req, res) => {
    try {
        const { price } = req.body;

        console.log("Price Received:", price); // Check if price is received correctly

        if (!price || price <= 0) {
            return res.status(400).send("Invalid price value");
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: price * 100, // Price should be in cents
            currency: "usd",
        });

        console.log("Generated Client Secret:", paymentIntent.client_secret); // Log the client secret

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Error creating payment intent:", error.message);
        res.status(500).send("Error creating payment intent");
    }
};
