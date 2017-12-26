//对文件的访问-》将index.html放到服务器环境下-》服务器通过fs读取index.html,响应到客户端
//2.对端口的访问-》/get->向酷狗发起请求(http.request)->利用cheerio第三方包获取歌单-》返回客户端
const http=require('http');
const url=require('url');
const zlib=require('zlib');
const cheerio=require('cheerio');
http.createServer((req,res)=>{
	res.writeHeader(200,{
		'Content-type':'text/plain;charset:utf-8'
	});
	//将路径后转一下(转对象)
	const pathname=url.parse(req.url,true).pathname; //  /+输入地址栏的东西
	//console.log(pathname);
	const ext=require('path').extname(pathname);
	if(ext){
		try{
			res.end(fs.readFileSync(path.join(__dirname,pathname)));
		}catch(e){
			res.end('不好意思，你访问的页面不存在');
		}
	}else{
		switch(pathname){
			case "/getData":
				getData();
			break;
			default:
				res.end('bad requeat!');
		}
	}
}).listen(8080);
//getData->向酷狗发起请求(http.requeat)->利用cheerio第三方包抓歌单-》返回客户端
 const getData=()=>{
 	http.requeat({
 		host:'www.kugou.com',
 		port:'80',
 		path:'/yy/html/rank.html',
 		method:'get',
 		headers:{

 		}
 	},res=>{
 		//部分抓取
 		const arr=[];
 		res.on('data',chunk=>{
 			arr.push(chunk);
 		});
 		res.on('end',()=>{
 			const buf=Buffer.concat(arr); 
 			//console.log(buf)
 			//1.解压 2.抓取 3.返回
 			zlib.unzip(buf,(err,decoded)=>{
 				if(err){
 					res.end('sorry');
 				}
 				const data=decoded.toString();
 				const $=req('cheerio').load(data);
 				$('.pc_temp_songlist>ul>li>a').each(function(){
 				songList[$(this).text()]=$(this).attr('href');
 				});
 				res.end(JSON.stringify(songList));
 			});

 		});
 	}).end();
 };
