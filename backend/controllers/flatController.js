const flatService = require("../services/flatService")

const getFlats = async (req, res) => {

  const adminId = req.user.user_id

  const flats = await flatService.getAllFlats(adminId)

  res.json(flats)
}

const createFlat = async (req, res) => {

  const adminId = req.user.user_id

  const flat = await flatService.createFlat({
    ...req.body,
    admin_id: adminId
  })

  res.json(flat)
}

const updateFlat = async (req, res) => {
  const flat = await flatService.updateFlat(req.params.id, req.body)
  res.json(flat)
}

const deleteFlat = async (req, res) => {
  await flatService.deleteFlat(req.params.id)
  res.json({ message: "Flat deleted" })
}

const getFlatById = async (req, res) => {

  const flat = await flatService.getFlatById(req.params.id)

  if(!flat){
    return res.status(404).json({message:"Flat not found"})
  }

  res.json(flat)
}

module.exports = { getFlats, createFlat, updateFlat, deleteFlat, getFlatById }