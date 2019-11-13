const Koa=require("koa")
const app=new Koa()
const bodyparser=require("koa-bodyparser")
//处理静态资源
const static=require('koa-static')
const path=require('path')
const router=require("koa-router")()
const query=require("./db/query.js")
app.use(static(path.join(process.cwd(),'public')))
app.use(bodyparser())
app.use(router.routes())
app.use(router.allowedMethods())
router.get('/api/list',async ctx=>{
    let data=await query('select * from userlist')
    ctx.body=data//给后台响应数
    
})
router.post('/api/add',async ctx=>{
    let {username,password,idcard}=ctx.request.body

    if(username && password && idcard){//容错处理
        //去重
        let user= await query('select * from userlist where idcard=?',[idcard])
        console.log(idcard)
            if(user.data.length){//存在
                ctx.body={
                    code:0,
                    msg:"存在"
                }
            }else{
                let data=await query('insert into userlist (username,password,idcard) values(?,?,?)',[username,password,idcard])
                if(data.msg==="error"){
                    ctx.body={
                        code:0,
                        msg:error
                    }
                }else{
                    ctx.body={
                        code:1,
                           msg:"添加成功",
                       }
                }
            }
        
    }else{
        ctx.body={
            code:2,
            msg:'参数缺失'
        }
    }
})
//删除
router.get('/api/del',async ctx=>{
    let {id}=ctx.query;
    if(id || id===0){
        try{
            await query('delete from userlist where id=?',[id])
            ctx.body={
                code:1,
                msg:"删除成功"
            }
        }catch(e){
            ctx.body={
                code:0,
                mag:e.error
            }
        }
    }else{
        ctx.body={
            code:2,msg:"参数缺失"
        }
    }

})
//修改
router.post("/api/edit",async ctx=>{
    let {username,password,idcard,id}=ctx.request.body
    if(id && username && password && idcard){
            try{
                await query('update userlist set username=?,password=?,idcard=? where id=?',[username,password,idcard,id])
                ctx.body={
                    code:1,
                    msg:"修改成功"
                }
            }catch(e){
                ctx.body={
                    code:0,
                    msg:e.error
                }
            }

    }else{
        ctx.body={
            code:2,
            msg:"参数缺失"
        }
    }
})
//模糊搜索
router.get('/api/search',async ctx=>{
    let {key}=ctx.query;//key 搜索关键字
    let sql=''
    //如果没有传 搜索全部
    if(!key){
       sql+='select * from product_list'
    }else{
        sql+=`select * from product_list where name like '%${key}%'`;
    }
    try{
        let list=await query(sql);
        ctx.body={
            code:1,
            data:list
        }

    }catch(e){
        ctx.body={
            code:0,
            msg:error
        } 
    }
})
router.get
app.listen(process.env.PORT||3000,()=>{
    console.log("服务器启动成功")
}) 