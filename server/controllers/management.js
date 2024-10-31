import mongoose from "mongoose";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";


export const getAdmins = async (req, res) => {
    try {

        const admins = await User.find({role: "admin"}).select("-password");
        res.status(200).json(admins);
    }catch (error) { 
        res.status(404).json({ message: error.message })
    }
};

export const getUserPerformance = async (req, res) => {
    try {
        const {id} = req.params;
        console.log("Requested User ID:", id); // Add this line for debugging


        //aggregate call does sanme thing as function but faster and is better practice 
        const userWithStats = await User.aggregate([
            { $match: {_id: new mongoose.Types.ObjectId(id) }},
            {
                $lookup: {
                    from: "affiliatestats",
                    localField: "_id",
                    foreignField: "userId",
                    as: "affiliateStats"
                },
                
            },
            { $unwind: "$affiliateStats"}
        ]);
        console.log("User with Stats:", userWithStats); // Add this line
        if (!userWithStats.length) {
            return res.status(404).json({ message: "User or affiliate stats not found" });
        }

        const saleTransactions = await Promise.all(
            userWithStats[0].affiliateStats.affiliateSales.map((id) => {
                return Transaction.findById(id);
            })
        );
        const filteredSaleTransactions = saleTransactions.filter(
            (transactions) => transactions !== null
        );
        res.status(200).json({ user: userWithStats[0], sales: filteredSaleTransactions });


    }catch (error) { 
        res.status(404).json({ message: error.message })
    }
};