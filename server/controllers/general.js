import User from "../models/User.js";
import OverallStat from "../models/OverallStat.js";
import Transaction from "../models/Transaction.js"



export const getUser = async (req, res) => {
    try {

        {/**this function is trying to find the user based
     on the params of the id and sends the user info to 
    front end otherwise sends error */}
    
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error ) {
        res.status(404).json({ message : error.message})
    }
 }

 export const getDashboardStats = async (req, res) => {
    try {
      const currentMonth = "November";
      const currentYear = 2021;
      const currentDay = "2021-11-15";
  
      const transactions = await Transaction.find().limit(50).sort({ createdOn: -1 });
  
      // Fetch the overall stats for the current year
      const overallStat = await OverallStat.find({ year: currentYear });
  
      if (!overallStat || overallStat.length === 0) {
        return res.status(404).json({ message: "No statistics found for the current year." });
      }
  
      // Destructure or set defaults if any field is undefined
      const {
        totalCustomers = 0,
        yearlyTotalSoldUnits = 0,
        yearlySalesTotal = 0,
        monthlyData = [],
        salesByCategory = {}
      } = overallStat[0];
  
      const thisMonthStats = monthlyData.find(({ month }) => month === currentMonth) || { totalSales: 0, totalUnits: 0 };
      const todayStats = overallStat[0].dailyData.find(({ date }) => date === currentDay) || { totalSales: 0, totalUnits: 0 };
  
      res.status(200).json({
        totalCustomers,
        yearlyTotalSoldUnits,
        yearlySalesTotal,
        monthlyData,
        salesByCategory,
        thisMonthStats,
        todayStats,
        transactions
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };