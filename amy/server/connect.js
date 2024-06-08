import mysql from "mysql"

export const db=mysql.createConnection(
    {
        host:"localhost",
        user:"root",
        password:"Songtimem9$",
        database:"amy",
        charset: 'utf8mb4'
    }
)
