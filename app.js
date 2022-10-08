const express=require("express");
const mysql=require("mysql2");
const bodyParser=require("body-parser");
var app=express();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));
const con=mysql.createConnection({
    host:"containers-us-west-33.railway.app",
    user:"root",
    port:"5837",
    password:"tRHIHcSWTjKcPdwwoTRX",
    database:"railway"
});
try{
    con.connect();
    console.log("se conecto a la bd");
}catch(err){
    console.log("Error al contectar a la bd");
}
app.post("/agregarLugar",(req,res)=>{
    try{
        const name=req.body.name;
        const desc=req.body.desc;
        const dir=req.body.dir;
        const tipo=req.body.tipo;
        con.query(`insert into establecimientos values('${name}','${desc}','${dir}','${tipo}');`,(err)=>{
            if(err){
                res.send(`<h1>Error<h1>`)
                console.log(err);
            }else{
                res.send(`
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet">
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js"></script>
                
                <div class="container-fluid p-5 bg-primary text-white text-center">
                    <h1>Dar de alta establecimientos</h1>
                    <a href="../index.html" class="btn btn-primary">Regresar a principal</a>
                </div>
                <div class="container mt-3">
                    <h1 class="display-1">Se ha añadido correctamente el lugar.</h1>
                    <a href="/Lugares" class="btn btn-primary">Consultar Establecimientos</a>
                </div>
                <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-bottom">
                <div class="container-fluid">
                    <a class="navbar-brand">CRUDE Gabow v0.0.1</a>
                </div>
            </nav>
                `);
            }
        });
    }catch(err){
        console.log(err);
    }
});
app.get("/Lugares/Eliminar/:lugar",(req,res)=>{
    const establecimiento=req.params['lugar'];
    con.query(`select * from establecimientos where nombre='${establecimiento}'`,(err,result)=>{
        if(result.length==0){
            res.sendStatus(404);
            console.log("ERROR");
        }
        else{
            con.query(`delete from establecimientos where nombre='${establecimiento}';`,(err)=>{
                if(err){console.log(err);}else{
                    res.redirect("/Lugares");
                }
            });
        }
    });
});
app.get("/Lugares",(req,res)=>{
    res.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet">
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js"></script>
        </head>
        <body>
            <script>
                const redirigir=(fila)=>{
                    const lugar=document.getElementsByName("LugarNombre"+fila)[0].childNodes[0].textContent;
                    const placement=window.location.href;
                    window.location.href=placement+"/"+lugar;
                }
                const redirigiarEliminar=(fila)=>{
                    const lugar=document.getElementsByName("LugarNombre"+fila)[0].childNodes[0].textContent;
                    const placement=window.location.href;
                    window.location.href=placement+"/Eliminar/"+lugar;
                }
            </script>
            <div class="container-fluid p-5 bg-primary text-white text-center">
                <h1>Consultar Establecimientos</h1>
                <a href="index.html" class="btn btn-primary">Regresar a principal</a>
            </div>
            <div class="container mt-3">
                <table class="table table-striped" name="table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripcion</th>
                            <th>Direccion</th>
                            <th>Tipo</th>
                            <th>Modificar</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
    `);
    let i=1;
    con.query("select * from establecimientos;",(err,result)=>{
        if(err){res.send(`<h1>${err}</h1>`)}
        result.map((item)=>{
            res.write(`
                <tr>
                    <td name="LugarNombre${i}">${item.nombre}</td>
                    <td name="LugarDes${i}">${item.descripcion}</td>
                    <td name="LugarDir${i}">${item.direccion}</td>
                    <td name="LugarTipo${i}">${item.tipo}</td>
                    <td><button onclick="redirigir(${i})" class="btn btn-dark">Modificar</button></td>
                    <td><button onclick="redirigiarEliminar(${i})" class="btn btn-dark">Eliminar</button></td>
                </tr>
            `)
            i++;
        });
        res.write(`
        </tbody>
        </table>
        <br>
        <br>
        <br>
    `)
    res.end();
    });
    res.write(`
        <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-bottom">
            <div class="container-fluid">
                <a class="navbar-brand">CRUDE Gabow v0.0.1</a>
            </div>
        </nav>
        </div>
        </body>
        </html>
    `);
});
app.post("/Lugares/modificarLugar",(req,res)=>{
    const newName=req.body.name;
    const newDesc=req.body.desc;
    const newDir=req.body.dir;
    const newTipo=req.body.tipo;
    con.query(`update establecimientos set nombre='${newName}',descripcion='${newDesc}',direccion='${newDir}',tipo='${newTipo}' where nombre='${lugarName}';`,(err)=>{
        if(err){console.log(err)}else{
            res.send(`
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet">
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js"></script>
                
                <div class="container-fluid p-5 bg-primary text-white text-center">
                    <h1>Modificar Establecimientos</h1>
                    <a href="../index.html" class="btn btn-primary">Regresar a principal</a>
                </div>
                <div class="container mt-3">
                    <h1 class="display-1">Se ha modificado correctamente el lugar.</h1>
                    <a href="/Lugares" class="btn btn-primary">Consultar Establecimientos</a>
                </div>
                <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-bottom">
                <div class="container-fluid">
                    <a class="navbar-brand">CRUDE Gabow v0.0.1</a>
                </div>
                </nav>`
            );
        }
    });
})
app.get("/Lugares/:lugar",(req,res)=>{
    globalThis.lugarName=req.params['lugar'];
    //por seguridad hay que validar la entrada del parametro
    con.query(`select * from establecimientos where nombre='${lugarName}'`,(err,result)=>{
        if(result.length==0){
            res.sendStatus(404);
            console.log("ERROR");
        }else{
            //console.log(result);
            res.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet">
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js"></script>
            </head>
            <body>
                <div class="container-fluid p-5 bg-primary text-white text-center">
                    <h1>Modificar Establecimientos</h1>
                    <a href="../index.html" class="btn btn-primary">Regresar a principal</a>
                </div>
                <form action="./modificarLugar" method="post">
                    <div class="container mt-3">
                        <h3>A continuacion rellene los campos solicitados para modificar el establecimiento seleccionado.</h3>
                        <br>
                        <ul class="list-group">
                        <li class="list-group-item active">Nombre</li>
                        <li class="list-group-item">
                            <div class="input-group mb-3">
                                <input value='${result[0].nombre}' type="text" class="form-control" placeholder="Nombre del establecimiento" name="name">
                            </div>
                        </li>
                        </ul>
                        <br>
                        <ul class="list-group">
                            <li class="list-group-item active">Descripción</li>
                            <li class="list-group-item">
                                <div class="form-floating">
                                    <textarea class="form-control" id="comment" name="desc">${result[0].descripcion}</textarea>
                                    <label for="comment">Breve descripcion del lugar</label>
                                </div>
                            </li>
                        </ul>
                        <br>
                        <ul class="list-group">
                            <li class="list-group-item active">Dirección</li>
                            <li class="list-group-item">
                                <div class="input-group mb-3">
                                    <input value='${result[0].direccion}' type="text" class="form-control" placeholder="Direccion completa del lugar" name="dir">
                                </div>
                            </li>
                        </ul>
                        <br>
                        <p>Tipo: </p>   
                        <select class="form-select form-select-lg" name="tipo">
                        `);
                        switch(result[0].tipo){
                            case "CentroComercial":
                                res.write(`
                                    <option>Lugar de tipo...</option>
                                    <option value="CentroComercial" selected>Centro Comercial</option>
                                    <option value="Parque">Parque</option>
                                    <option value="Escuela">Escuela</option>
                                `)
                                break;
                            case "Parque":
                                res.write(`
                                    <option>Lugar de tipo...</option>
                                    <option value="CentroComercial">Centro Comercial</option>
                                    <option value="Parque" selected>Parque</option>
                                    <option value="Escuela">Escuela</option>
                                `);
                                break;
                            case "Escuela":
                                res.write(`
                                    <option>Lugar de tipo...</option>
                                    <option value="CentroComercial">Centro Comercial</option>
                                    <option value="Parque">Parque</option>
                                    <option value="Escuela" selected>Escuela</option>
                                `)
                        }
            res.write(`
                            </select>
                            <br>
                            <button type="submit" class="btn btn-success">Modificar</button>
                        </div>
                    </form>
                    <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-bottom">
                        <div class="container-fluid">
                            <a class="navbar-brand">CRUDE Gabow v0.0.1</a>
                        </div>
                    </nav>
                    <br>
                    <br>
                    <br>
                    <br>
                </body>
                </html>
            `);
        }
        res.end();
    });
});
app.listen(8000,()=>{
    console.log("Server on port 8000");
});