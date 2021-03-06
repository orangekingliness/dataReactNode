const express = require('express')
const path = require('path')
const request=require('request')
const port = process.env.PORT || 3003
const app = express()

app.use(express.static(__dirname + '/public'))


// 允许访问api的时候跨域
app.use((req,res,next)=>{
    // 增加了cors跨域的请求头
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();
})



// 获取电影列表数据方法
app.get('/getMovieListData',(req,res,next)=>{
    console.log('请求了服务器的getMovieListData方法吧')

    const message=JSON.parse(req.query.message)

    const url=`https://api.douban.com/v2/movie/${message.movieType}?start=${message.start}&count=${message.count}`

    request(url,function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(JSON.parse(response.body));
        }
        else{
            res.send({errMessage:error})
        }
    })

})

// 获取电影详细数据方法
app.get('/getMovieDetailData',(req,res,next)=>{
    console.log('请求了服务器的getMovieDetailData方法吧')
    const id=req.query.message
    const url=`https://api.douban.com/v2/movie/subject/${id}`
    request(url,function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(JSON.parse(response.body));
        }
        else{
            res.send({errMessage:error})
        }
    })

})


// 通过关键词获取电影信息
app.get('/getMovieListByKey',(req,res,next)=>{
    console.log('请求了服务器的getMovieListByKey方法吧')

    const message=JSON.parse(req.query.message)
    console.log(message.key)
    const key=encodeURI(message.key)
    const url=`https://api.douban.com/v2/movie/search?q=${key}&start=${message.start}&count=${message.count}`

    request(url,function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(JSON.parse(response.body));
        }
        else{
            res.send({errMessage:error})
        }
    })
})


app.get('*', function (req, res){
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})



const server = app.listen(port, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
