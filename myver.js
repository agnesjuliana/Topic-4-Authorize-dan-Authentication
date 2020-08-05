//Include Library
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql")
const md5 = require("md5")
const moment = require("moment")
const Cryptr = require("cryptr")
const crypt = new Cryptr("140533601726") 

//call library
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//Database conection
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"pelanggaran_siswa"
})
//Check database connection
db.connect(error =>{
    if(error){
        console.log(error.message)
    }else{
        console.log("MySQL Connected")
    }
})

//Server port 8000 connection
app.listen(8000,() =>{
    console.log("Run on port 8000")
})


//Function error response
let response = null
function errorFunc(er,rst) {
    if(er){
        response = {
            message: error.message
        }
    }else{
        response = {
            count: rst.length,
            siswa: rst
        }
    }
}

//Function error response without else
function errnoelse(error){
    if(error){
        response = {
            message: error.message
        }
    }
}






//VALIDATE TOKEN
validateToken = () => {
    return (req,res,next)=>{
        //jika token tidak ditemukan
        if(!req.get("Token")) {
            res.json({
                message: "Accsess Forbiden"
            })
        }else {
            let token = req.get("Token") // Mengambil nilai token
            let decryptToken = crypt.decrypt(token) //decrypt token menjadi id_user
            let sql = "select * from user where ?"
            let param = {id_user: decryptToken} //persiapan parameter untuk sql

            db.query(sql,param,(error,result)=>{
                if (error) throw error

                if(result.length > 0 ){
                    next() // INI APA MAKSUDNYA
                } else {
                    res.json({
                        message: "Invalid Token"
                    })
                }
            })
        }
    }
}


//create end-point data siswa secara keseluruhan (GAMBAR 1)
app.get("/siswa",validateToken(),(req,res)=>{
    let sql = "select * from siswa"

    //run query
    db.query(sql, (error, result)=>{
        errorFunc(error,result) //call error func
        res.json(response) //send response
    })
})

//create end-point data siswa berdasakan id (GAMBAR 2)
app.get("/siswa/:id",validateToken(),(req,res)=>{
    let data = {
        id_siswa:req.params.id
    }

    let sql = "select * from siswa where ?"

    //run query
    db.query(sql, data, (error,result)=>{
        errorFunc(error,result)
        res.json(response)
    })
})


//end-point tambah data siswa(GAMBAR 3)
app.post("/siswa",validateToken(),(req,res)=>{

    //data
    let data = {
        nis: req.body.nis,
        nama_siswa: req.body.nama_siswa,
        kelas: req.body.kelas,
        poin: req.body.poin
    }

    let sql = "insert into siswa set ?"

    //run query
    db.query(sql, data, (error,result)=>{
        errnoelse(error)
        response = {
            message: result.affectedRows + " data inserted"
        }
        res.json(response)
    })
})


//end-point delete data siswa (GAMBAR 4)
app.delete("/siswa/:id",validateToken(),(req,res)=>{
    //prepare id
    let data = {
        id_siswa:req.params.id
    }

    let sql = "delete from siswa where ?"

    //run query
    db.query(sql,data,(error,result)=>{
        errnoelse(error)
        response = {
            message:result.affectedRows+ " data deleted"
        }

        res.json(response)
    })
})


//end-point update data siswa (GAMBAR 5)
app.put("/siswa",validateToken(), (req,res)=>{
    
    //Array untuk menyimpan data baru dan primary key
    let data = [
        //data baru
        {
            nis: req.body.nis,
            nama_siswa: req.body.nama_siswa,
            kelas: req.body.kelas,
            poin: req.body.poin
        },

        //primary key
        {
            id_siswa: req.body.id_siswa
        }
    ]

    let sql = "update siswa set ? where ?"

    //run query
    db.query(sql, data, (error,result)=>{
        errnoelse(error)
        response = {
            message:result.affectedRows+ "data update"
        }

        res.json(response)
    })
})



//END POINT DATA PELANGGARAN
//end-point menampilkan semua data pelanggaran (GAMBAR 6)
app.get("/pelanggaran",validateToken(),(req,res)=>{
    let sql = "select * from pelanggaran"

    db.query(sql,(error,result)=>{
        errorFunc(error,result)
        res.json(response)
    })
})

//end-point menampilkan data pelanggaran menggunakan id (GAMBAR 7)
app.get("/pelanggaran/:id",validateToken(),(req,res)=>{
    let data = {
        id_pelanggaran:req.params.id
    }

    let sql = "select * from pelanggaran where ?"

    db.query(sql,data,(error,result)=>{
        errorFunc(error,result)
        res.json(response)
    })
})

//end-point menambahkan data pelanggaran (GAMBAR 8)
app.post("/pelanggaran",validateToken(),(req,res)=>{
    let data = {
        nama_pelanggaran: req.body.nama_pelanggaran,
        poin: req.body.poin
    }

    let sql = "insert into pelanggaran set ?"

    db.query(sql,data,(error,result)=>{
        errnoelse(error)
        response = {
            message: result.affectedRows + " data inserted"
        }

        res.json(response)
    })
})

//end-point menghapus data pelanggaran (GAMBAR 9)
app.delete("/pelanggaran/:id",validateToken(),(req,res)=>{
    let data = {
        id_pelanggaran: req.params.id
    }

    let sql = "delete from pelanggaran where ?"

    db.query(sql,data,(error,result)=>{
        errnoelse(error)
        response = {
            message: result.affectedRows + " data deleted"
        }
        res.json(response)
    })
})

//end-point update data pelanggaran (GAMBAR 10)
app.put("/pelanggaran",validateToken(),(req,res)=>{
    let data = [
        {
            nama_pelanggaran: req.body.nama_pelanggaran,
            poin: req.body.poin
        },

        {
            id_pelanggaran: req.body.id_pelanggaran
        }    
    ]
    
    let sql = "update pelanggaran set ? where ?"

    db.query(sql,data,(error,result)=>{
        errnoelse(error)
        response = {
            message: result.affectedRows + " data update"
        }

        res.json(response)
    })
})




//END POINT USER
//end-point menampilkan semua data user (GAMBAR 11)
app.get("/user",validateToken(),(req,res)=>{
    let sql = "select * from user"

    db.query(sql,(error,result)=>{
        errorFunc(error,result)
        res.json(response)
    })
})

//end-point menampilkan data user menggunakan id (GAMBAR 12)
app.get("/user/:id",validateToken(),(req,res)=>{
    let data = {
        id_user: req.params.id
    }

    let sql = "select * from user where ?"

    db.query(sql,data,(error,result)=>{
        errorFunc(error,result)
        res.json(response)
    })
})

//end-point menambahkan data user (GAMBAR 13)
app.post("/user",(req,res)=>{
    let data = {
        nama_user: req.body.nama_user,
        username: req.body.username,
        password: md5(req.body.password)
    }

    let sql = "insert into user set ?"

    db.query(sql,data,(error,result)=>{
        errnoelse(error)
        response = {
            message: result.affectedRows + " data inserted"
        }

        res.json(response)
    })
})

//end-point menghapus data user (GAMBAR 14)
app.delete("/user/:id",validateToken(),(req,res)=>{
    let data = {
        id_user: req.params.id
    }

    let sql = "delete from user where ?"

    db.query(sql,data,(error,result)=>{
        errnoelse(error)
        response = {
            message: result.affectedRows + " data deleted"
        }
        res.json(response)
    })
})

//end-point update data user (GAMBAR 15)
app.put("/user",validateToken(),(req,res)=>{
    let data = [
        {
            nama_user: req.body.nama_user,
            username: req.body.username,
            password: md5(req.body.password)
        },

        {
            id_user: req.body.id_user
        }    
    ]
    
    let sql = "update user set ? where ?"

    db.query(sql,data,(error,result)=>{
        errnoelse(error)
        response = {
            message: result.affectedRows + " data update"
        }

        res.json(response)
    })
})




//API TRANSAKSI (GAMBAR 16)
app.post("/pelanggaran_siswa",validateToken(),(req,res)=>{
    let data = {
        id_siswa:req.body.id_siswa,
        id_user:req.body.id_user,
        waktu: moment().format('YYYY-MM-DD HH:mm:ss')
    }

    //Rubah data menjadi format JSON
    let pelanggaran = JSON.parse(req.body.pelanggaran)

    let sql = "insert into pelanggaran_siswa set ?"

    //run query
    db.query(sql,data,(error,result)=>{
        if(error){
            res.json({message:error.message})
        }else{
            // get last inserted id_pelanggaran
            let lastID = result.insertId

            // prepare data to detail_pelanggaran
            let data = []
            for (let index = 0; index < pelanggaran.length; index++) {
                data.push([
                    lastID, pelanggaran[index].id_pelanggaran
                ])                
            }

            // create query insert detail_pelanggaran
            let sql = "insert into detail_pelanggaran_siswa values ?"

            db.query(sql, [data], (error, result) => {
                if (error) {
                    res.json({message: error.message})
                } else {
                    res.json({message: "Data has been inserted"})
                }
            })
        }
    })
})

// end-point tampilkan data pelanggaran (GAMBAR 17)
app.get("/pelanggaran_siswa",validateToken(), (req,res) => {

    let sql = "select p.id_pelanggaran_siswa, p.id_siswa,p.waktu, s.nis, s.nama_siswa, p.id_user, u.nama_user " +
     "from pelanggaran_siswa p join siswa s on p.id_siswa = s.id_siswa " +
     "join user u on p.id_user = u.id_user"

    // run query
    db.query(sql, (error, result) => {
        if (error) {
            res.json({ message: error.message})   
        }else{
            res.json({
                count: result.length,
                pelanggaran_siswa: result
            })
        }
    })
})

// end-point untuk menampilkan detail pelanggaran (GAMBAR 18)
app.get("/pelanggaran_siswa/:id_pelanggaran_siswa",validateToken(), (req,res) => {
    let param = { id_pelanggaran_siswa: req.params.id_pelanggaran_siswa}

    // create sql query
    let sql = "select p.nama_pelanggaran, p.poin " + 
    "from detail_pelanggaran_siswa dps join pelanggaran p "+
    "on p.id_pelanggaran = dps.id_pelanggaran " +
    "where ?"

    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({ message: error.message})   
        }else{
            res.json({
                count: result.length,
                detail_pelanggaran_siswa: result
            })
        }
    })
})


// end-point untuk menghapus data pelanggaran_siswa (GAMBAR 19)
app.delete("/pelanggaran_siswa/:id_pelanggaran_siswa",validateToken(), (req, res) => {
    let param = { id_pelanggaran_siswa: req.params.id_pelanggaran_siswa}

    // create sql query delete detail_pelanggaran
    let sql = "delete from detail_pelanggaran_siswa where ?"

    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({ message: error.message})
        } else {
            let param = { id_pelanggaran_siswa: req.params.id_pelanggaran_siswa}
            // create sql query delete pelanggaran_siswa
            let sql = "delete from pelanggaran_siswa where ?"

            db.query(sql, param, (error, result) => {
                if (error) {
                    res.json({ message: error.message})
                } else {
                    res.json({message: "Data has been deleted"})
                }
            })
        }
    })

})








//PROSES AUTHENTICATION

//end point login
app.post("/user/auth", (req,res) => {
    let param = [
        req.body.username,
        md5(req.body.password)
    ]

    let sql = "select * from user where username = ? and password = ?"

    //run query
    db.query(sql,param, (error,result)=>{
        if (error) throw error

        if (result.length > 0) {
            res.json({
                message: "Longged",
                token: crypt.encrypt(result[0].id_user),
                data: result
            })
        } else {
            res.json({
                message: "Invalid Username/password"
            })
        }
    })
})


