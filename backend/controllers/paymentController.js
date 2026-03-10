const service = require("../services/paymentService")

// GET unpaid flats
exports.getPaymentEntry = async (req,res)=>{

  try{

    const admin_id = req.user.user_id
    const { month } = req.query

    const data = await service.getPaymentEntry(admin_id,month)

    res.json(data)

  }catch(err){

    console.error(err)

    res.status(500).json({
      message:"Failed to load payment entries"
    })

  }

}


// POST payment
exports.createPaymentEntry = async (req,res)=>{

  try{

    const admin_id = req.user.user_id

    const result = await service.createPaymentEntry(req.body,admin_id)

    res.json(result)

  }catch(err){

    console.error(err)

    res.status(500).json({
      message:"Payment entry failed"
    })

  }

}