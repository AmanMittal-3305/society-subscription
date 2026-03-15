const express = require("express")
const cors = require("cors")
require("dotenv").config()
const session = require("express-session");
const passport = require("./config/passport");


const adminRoutes = require("./routes/adminRoutes")
// const flatRoutes = require("./routes/flatRoutes")
// const subscriptionRoutes = require("./routes/subscriptionRoutes")
// const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const authRoutes = require("./routes/authRoutes")
const residentRoutes =  require("./routes/residentRoutes")



const app = express()

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const bootup = async () => {
    await dbConnection()
    await adminSeeding()
}

const dbConnection = () => {

}

const adminSeeding = () => {

}

app.use(cors())
app.use(express.json())

app.use("/api/admin", adminRoutes)
// app.use("/api/subscriptions", subscriptionRoutes)

app.use("/api/resident", residentRoutes)

app.use("/api/auth", authRoutes)


app.get("/", (req, res) => {
    res.send("Society API Running")
})

const PORT = 5000

app.listen(PORT, () => {
    bootup()
    console.log(`Server running on port ${PORT}`)
})