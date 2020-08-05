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
    database:"penyewaan_mobil"
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
            data:rst
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
    return(req,res,next)=>{
        if(!req.get("Token")){
            res.json({
                message: "Accsess Forbiden"
            })
        }else {
            let token = req.get("Token")
            let decryptToken = crypt.decrypt(token)
            let sql = "select * from karyawan where ?"
            let param = {id_karyawan: decryptToken}

            db.query(sql,param,(error,result)=>{
                if(error) throw error

                if(result.length > 0){
                    next()
                }else {
                    res.json({
                        message: "Invalid Token"
                    })
                }
            })
        }
    }
}


//CURD MOBIL
//end-point tampil data mobil (GAMBAR 1)
app.get("/mobil",validateToken(),(req,res)=>{
    let sql = "select * from mobil"

    //run sql
    db.query(sql,(error,result)=>{
        errorFunc(error,result)
        res.json(response)
    })
})

//end-point tampil data mobil menggunakan id_mobil (GAMBAR 2)
app.get("/mobil/:id",validateToken(),(req,res)=>{
    let data = {
        id_mobil:req.params.id
    }

    let sql = "select*from mobil where ?"

    //run sql
    db.query(sql,data,(error,result)=>{
        errorFunc(error,result)
        res.json(response)
    })
})

//end-point tambah data mobil (GAMBAR 3)
app.post("/mobil",validateToken(),(req,res)=>{
    let data = {
        id_mobil:req.body.id_mobil,
        nomor_mobil:req.body.nomor_mobil,
        merk:req.body.merk,
        jenis:req.body.jenis,
        warna:req.body.warna,
        tahun_pembuatan:req.body.tahun_pembuatan,
        biaya_sewa_per_hari:req.body.biaya_sewa_per_hari,
        image:req.body.image
    }

    let sql = "insert into mobil set ?"

    //run sql
    db.query(sql,data,(error,result)=>{
        errnoelse(error)
        response = {
            message: result.affectedRows + " data inserted"
        }

        res.json(response)
    })
})

//end-point edit data mobil (GAMBAR 4)
app.put("/mobil",validateToken(),(req,res)=>{
    let data = [
        {
            nomor_mobil:req.body.nomor_mobil,
            merk:req.body.merk,
            jenis:req.body.jenis,
            warna:req.body.warna,
            tahun_pembuatan:req.body.tahun_pembuatan,
            biaya_sewa_per_hari:req.body.biaya_sewa_per_hari,
            image:req.body.image
        },
        {
            id_mobil:req.body.id_mobil
        }
    ]

    let sql = "update mobil set? where ?"

    //run sql
    db.query(sql,data,(error,result)=>{
        errnoelse(error)
        response = {
            message:result.affectedRows+" data update"
        }

        res.json(response)
    })
})

//end-point hapus data mobil (GAMBAR 5)
app.delete("/mobil/:id",validateToken(),(req,res)=>{
    let data = {
        id_mobil:req.params.id
    }

    let sql = "delete from mobil where ?"

    //run query
    db.query(sql,data,(error,result)=>{
        errnoelse(error)
        response = {
            message: result.affectedRows+" data deleted"
        }

        res.json(response)
    })
})


//CURD PELANGGAN
//end-point tampil semua data pelanggan (GAMBAR 6)
app.get("/pelanggan",validateToken(),(req,res)=>{
    let sql = "select * from pelanggan"

    //run query
    db.query(sql,(error,result)=>{
        errorFunc(error,result)
        res.json(response)
    })
})


//end-point tampil data pelanggan menggunakan id (GAMBAR 7)
app.get("/pelanggan/:id",validateToken(),(req,res)=>{
    let data = {
        id_pelanggan:req.params.id
    }

    let sql = "select * from pelanggan where ?"

    //run sql
    db.query(sql,data,(error,result)=>{
        errorFunc(error,result)
        res.json(response)
    })
})

//end-point tambah data pelanggan (GAMBAR 8)
app.post("/pelanggan",validateToken(),(req,res)=>{
    let data = {
        id_pelanggan:req.body.id_pelanggan,
        nama_pelanggan:req.body.nama_pelanggan,
        alamat_pelanggan:req.body.alamat_pelanggan,
        kontak:req.body.kontak
    }

    let sql = "insert into pelanggan set ?"

    //run sql
    db.query(sql,data,(error,result)=>{
        errnoelse(error)
        response = {
            message: result.affectedRows+ " data inserted"
        }

        res.json(response)
    })
})

//end-point update data pelanggan (GAMBAR 9)
app.put("/pelanggan",validateToken(),(req,res)=>{
    let data = [
        {
            nama_pelanggan:req.body.nama_pelanggan,
            alamat_pelanggan:req.body.alamat_pelanggan,
            kontak:req.body.kontak
        },
        {
            id_pelanggan:req.body.id_pelanggan
        }
    ]

    let sql = "update pelanggan set ? where ?"

    //run sql
    db.query(sql,data,(error,result)=>{
        errnoelse(error)
        response = {
            message: result.affectedRows+ " data update"
        }

        res.json(response)
    })
})

//end-point delete data pelanggan (GAMBAR 10)
app.delete("/pelanggan/:id",validateToken(),(req,res)=>{
    let data = {
        id_pelanggan:req.params.id
    }

    let sql = "delete from pelanggan where ?"

    //run sql
    db.query(sql,data,(error,result)=>{
        errnoelse(error)
        response = {
            message: result.affectedRows+ " data deleted"
        }
        res.json(response)
    })
})



//CURD KARYAWAN
//end-point menampilkan semua data karyawan (GAMBAR 11)
app.get("/karyawan",validateToken(),(req,res)=>{
    let sql = "select * from karyawan"

    db.query(sql,(error,result)=>{
        errorFunc(error,result)
        res.json(response)
    })
})

//end-point menampilkan data karyawan menggunakan id (GAMBAR 12)
app.get("/karyawan/:id",validateToken(),(req,res)=>{
    let data = {
        id_karyawan: req.params.id
    }

    let sql = "select * from karyawan where ?"

    db.query(sql,data,(error,result)=>{
        errorFunc(error,result)
        res.json(response)
    })
})

//end-point menambahkan data karyawan (GAMBAR 13)
app.post("/karyawan",validateToken(),(req,res)=>{
    let data = {
        id_karyawan: req.body.id_karyawan,
        nama_karyawan: req.body.nama_karyawan,
        alamat_karyawan: req.body.alamat_karyawan,
        kontak: req.body.kontak,
        username: req.body.username,
        password: md5(req.body.password)
    }

    let sql = "insert into karyawan set ?"

    db.query(sql,data,(error,result)=>{
        errnoelse(error)
        response = {
            message: result.affectedRows + " data inserted"
        }

        res.json(response)
    })
})

//end-point menghapus data karyawan (GAMBAR 14)
app.delete("/karyawan/:id",validateToken(),(req,res)=>{
    let data = {
        id_karyawan: req.params.id
    }

    let sql = "delete from karyawan where ?"

    db.query(sql,data,(error,result)=>{
        errnoelse(error)
        response = {
            message: result.affectedRows + " data deleted"
        }
        res.json(response)
    })
})

//end-point update data user (GAMBAR 15)
app.put("/karyawan",validateToken(),(req,res)=>{
    let data = [
        {
            nama_karyawan: req.body.nama_karyawan,
            alamat_karyawan: req.body.alamat_karyawan,
            kontak: req.body.kontak,
            username: req.body.username,
            password: md5(req.body.password)
        },

        {
            id_karyawan: req.body.id_karyawan
        }    
    ]
    
    let sql = "update karyawan set ? where ?"

    db.query(sql,data,(error,result)=>{
        errnoelse(error)
        response = {
            message: result.affectedRows + " data update"
        }

        res.json(response)
    })
})



//API TRANSAKSI PENYEWAAN MOBIL (GAMBAR 16)
app.post("/sewa",validateToken(),(req,res)=>{
    var a = moment(req.body.tgl_sewa) //mengambil tanggal sewa menggunakan format moment Moment<2020-02-01T00:00:00+07:00>
    var b = moment(req.body.tgl_kembali) // mengambil tanggal kembali mengguankan format moment
    var hari = b.diff(a, 'days')//menghitung selisih sewa dan kembali

    //mengambil id_mobil
    let id_mobil = {
        id_mobil:req.body.id_mobil
    }

    //sql untuk harga sewa
    let sqlM = "SELECT biaya_sewa_per_hari FROM mobil WHERE ?"

    //run sql harga sewa
    db.query(sqlM,id_mobil,(error,result)=>{
        //mengubah raw data dari [ RowDataPacket { harga_hari: 100000 } ] menjadi string
        var string=JSON.stringify(result);

        //mengubah string menjadi format json
        var json =  JSON.parse(string);

        //mengambil value json
        let total = json[0].biaya_sewa_per_hari*hari

        let data = {
            id_sewa: req.body.id_sewa,
            id_mobil: req.body.id_mobil,
            id_karyawan: req.body.id_karyawan,
            id_pelanggan: req.body.id_pelanggan,
            tgl_sewa: req.body.tgl_sewa,
            tgl_kembali: req.body.tgl_kembali,
            total_bayar: total
        }
    

        let sql = "insert into sewa set?"

        db.query(sql,data,(error,result)=> {
            if (error) {
                res.json({message: error.message})
            } else {
                res.json({message: "Data has been inserted"})
            }
        })

    })
})

//Menampilkan data sewa raw id (GAMBAR 17)
app.get("/sewa",validateToken(),(req,res)=>{
    let sql = "select * from sewa"

    //run query
    db.query(sql,(error,result)=>{
        errorFunc(error,result)
        res.json(response)
    })
})

//menampilkan detail sewa (GAMBAR 18)
app.get("/detail_sewa",validateToken(),(req,res)=>{
    let sql = "SELECT s.id_sewa,p.id_pelanggan,p.nama_pelanggan,m.id_mobil,m.nomor_mobil,m.merk,k.id_karyawan,k.nama_karyawan " +
    "FROM sewa s JOIN pelanggan p ON s.id_pelanggan = p.id_pelanggan "+
    "JOIN mobil m ON s.id_mobil = m.id_mobil " +
    "JOIN karyawan k ON s.id_karyawan = k.id_karyawan"

    //run sql
    db.query(sql,(error,result)=>{
        errorFunc(error,result)
        res.json(response)
    })
})

//menampilkan detail sewa menggunakan id pelanggan (GAMBAR 19)
app.get("/sewa/:id",validateToken(),(req,res)=>{
    let data = {
        id_pelanggan: req.params.id
    }

    let sql = "SELECT p.id_pelanggan,s.id_sewa,p.nama_pelanggan,m.id_mobil,m.nomor_mobil,m.merk,k.id_karyawan,k.nama_karyawan " +
    "FROM sewa s JOIN pelanggan p ON s.id_pelanggan = p.id_pelanggan "+
    "JOIN mobil m ON s.id_mobil = m.id_mobil " +
    "JOIN karyawan k ON s.id_karyawan = k.id_karyawan WHERE p.?"

    //run sql
    db.query(sql,data,(error,result)=>{
        if(error){
            response = {
                message: error.message
            }
        }else{
            response = {
                count: result.length,
                data: result
            }
        }

        res.json(response)
    })
})

 
//delete data sewa (GAMBAR 20)
app.delete("/sewa/:id",validateToken(),(req,res)=>{
    let data = {
        id_sewa: req.params.id
    }

    let sql = "delete from sewa where ?"

    db.query(sql,data,(error,result)=>{
        errnoelse(error)
        response = {
            message: result.affectedRows + " data deleted"
        }
        res.json(response)
    })
})



//PROSES AUTHENTICATION

//end point login
app.post("/karyawan/auth", (req,res) => {
    let param = [
        req.body.username,
        md5(req.body.password)
    ]

    let sql = "select * from karyawan where username = ? and password = ?"

    //run query
    db.query(sql,param, (error,result)=>{
        if (error) throw error

        if (result.length > 0) {
            res.json({
                message: "Longged",
                token: crypt.encrypt(result[0].id_karyawan),
                data: result
            })
        } else {
            res.json({
                message: "Invalid Username/password"
            })
        }
    })
})