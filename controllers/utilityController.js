const User = require('../schema');
const jwt = require("jsonwebtoken")
var SimpleCrypto = require("simple-crypto-js").default
require('dotenv').config();

const noteDecoder = (notes, key) => {
    const simpleCrypto = new SimpleCrypto(key)
    const arr = [];
    notes.forEach((data) => {
        arr.push({
            id: data._id,
            title: simpleCrypto.decrypt(data.title),
            content: simpleCrypto.decrypt(data.content),
            createdAt: data.createdAt
        })
    })

    return arr;
}
const noteEncoder = (notes, key) => {
    const simpleCrypto = new SimpleCrypto(key)
    const arr = [];
    notes.forEach((data) => {
        arr.push({
            title: simpleCrypto.encrypt(data.title),
            content: simpleCrypto.encrypt(data.content),
        })
    })

    return arr;
}

module.exports.profile = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const user = await User.findById(decoded.id);

        res.status(200).json({ name: user.name, username: user.username, joinedAt: user.joinedAt, totalNotes: user.totalNotes });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

module.exports.createNote = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const note = req.body
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findById(decoded.id);
        const secretKey = user.username + user.password.slice(0, 20) + process.env.CRYPTO_KEY + token.slice(10, 40);
        const simpleCrypto = new SimpleCrypto(secretKey)
        const noteTitle = simpleCrypto.encrypt(note.title)
        const noteContent = simpleCrypto.encrypt(note.content)
        user.notes.push({ title: noteTitle, content: noteContent });
        user.totalNotes += 1 
        await user.save()

        res.status(200).json({ success: true, message: "Note Posted Successfully" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

module.exports.getNote = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findById(decoded.id);
        const secretKey = user.username + user.password.slice(0, 20) + process.env.CRYPTO_KEY + token.slice(10, 40);
        if (!user.notes?.length) {
            return res.status(404).json({ success: false, message: "No notes found" });
          }
        const notesArr = noteDecoder(user.notes,secretKey)
        res.status(200).json({ success: true, notes: notesArr });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
module.exports.putNote = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const modifiedNote = req.body; // contains id, title, content, maybe extra
  
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      const user = await User.findById(decoded.id);
  
      const secretKey =
        user.username +
        user.password.slice(0, 20) +
        process.env.CRYPTO_KEY +
        token.slice(10, 40);
  
      if (!user.notes?.length) {
        return res.status(404).json({ success: false, message: "No notes found" });
      }
      const notesArr = noteDecoder(user.notes, secretKey);
      const index = notesArr.findIndex(n => n.id.toString() === modifiedNote.id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Note not found" });
      }
      notesArr[index] = {
        ...notesArr[index],
        title: modifiedNote.title,
        content: modifiedNote.content,
        createdAt: new Date() 
      };
  
      user.notes = noteEncoder(notesArr, secretKey);
  
      await user.save();
  
      res.status(200).json({ success: true, message: "Note updated", notes: notesArr });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  };
  
  module.exports.deleteNote = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const id = req.body.id; 
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      const user = await User.findById(decoded.id)


      if (!user.notes?.length) {
        return res.status(404).json({ success: false, message: "No notes found" });
      }
      const userNotes = (user.notes).filter(data => data.id != id);
      user.notes = userNotes;
      user.totalNotes -= 1 
      await user.save();
  
      res.status(200).json({ success: true, message: "Note Deleted", notes: user.note });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  };
