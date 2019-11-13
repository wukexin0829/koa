let connection=require("./db.js")
module.exports=(sql,params=[])=>{
    return new Promise((reslove,reject)=>{
        connection.query(sql,params,(error,data)=>{
            if(error){
                reject({msg:'error',error})
            }else{
                reslove({msg:'sucess',data})
            }
        })
    })
}