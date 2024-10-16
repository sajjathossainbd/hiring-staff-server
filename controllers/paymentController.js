const stripe = require("stripe")(
  "sk_test_51PL8uBP0ShXafyXSoEPKPfk5IMX7cHHwMsYEVR0KobBjlqsm5i23S0LuGoAZywsxB2wvpSlFUvp4Ww4wbXo0H7z500KP36GHiV"
);

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
