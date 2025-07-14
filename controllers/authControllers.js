const User = require('../schema');
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
var SimpleCrypto = require("simple-crypto-js").default

require('dotenv').config();


const createToken = (id,password)=>{
const secretKey = password+process.env.CRYPTO_KEY;
const simpleCrypto = new SimpleCrypto(secretKey)
const keyValue = simpleCrypto.encrypt(id)
const payload = {id,key:keyValue}
return jwt.sign(payload,process.env.JWT_KEY)
}



module.exports.sign_up = async (req, res) => {
  try {
    const {name,username,password} = req.body;
    const salt = await bcrypt.genSalt()
    const pass = await bcrypt.hash(password,salt)
    const user = await User.create({name,username,password:pass});
    const token = createToken(user._id,password);
    res.json({ success: true, message:"Sign Up Sucessfull",userToken:token });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


module.exports.log_in = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const user = await User.findOne({ username });
      console.log(user) 
  
      if (!user) {
        return res.status(404).json({ success: false, message: "Username not found" });
      }
  
      const match = await bcrypt.compare(password, user.password);
  
      if (match) {
        const token = createToken(user._id,password);
        return res.status(200).json({ success: true, message: "Log in Successful", userToken: token });
      } else {
        return res.status(400).json({ success: false, message: "Incorrect Password" });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };
  
