import { db } from "../connect.js";

export const getUserRelationships = (req, res) => {
    const q = `SELECT id,name,profilePic FROM users`;
  
    db.query(q,(err, data) => {
      if (err) return res.status(500).json(err);
  
      return res.json(data);
    });
};
