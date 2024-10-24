const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.postPayment = async (req, res) => {
  try {
    const { price } = req.body;


    if (!price || price <= 0) {
      return res.status(400).send("Invalid price value");
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: price * 100,
      currency: "usd",
    });


    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error.message);
    res.status(500).send("Error creating payment intent");
  }
};
