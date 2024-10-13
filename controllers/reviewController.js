const { client } = require("../config/db");
const reviewCollection = client.db("hiringStaffDB").collection("reviews");

const postReviews = async (req, res) => {
    const review = req.body;
    const result = await reviewCollection.insertOne(review);
    res.send(result)
}


const getReviews = async (req, res) => {
    const cursor = reviewCollection.find().sort({ _id: -1 });
    const result = await cursor.toArray();
    res.send(result);
}

module.exports = { postReviews, getReviews };
