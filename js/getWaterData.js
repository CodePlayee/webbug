// 免责声明：本脚本仅用于非营利性科学研究。
const qs=require('querystring')
const fs=require('fs')
const path=require('path')
//const cheerio=require('cheerio') //jquery写法获取爬取页面的dom元素
const request=require('request')

//通用请求配置
const commonOpt={
    url:'http://www.lvwang.org.cn/water/get-position-data',
    method:'POST',
    headers:{
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': 'UM_distinctid=16db08c8aaa62a-0065c1fa211c23-5e4f281b-144000-16db08c8aab708; PHPSESSID=ea2a6b7e282b42u4m12iauoq81; _csrf=b0a2ee85a15da42aa47a78982b1574d15f0f3752ce19db207d51aae9164c4ebea%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22bUR9dmzHLWHFftVZvejTIba9hj82Q1rB%22%3B%7D; CNZZDATA1261313176=1804495874-1570625061-%7C1570668378; city_history=%5B%5D; now_position=114.3162001%2C30.58108413; g_now_city=%E6%AD%A6%E6%B1%89',
        'Host': 'www.lvwang.org.cn',
        'Origin': 'http://www.lvwang.org.cn',
        'Referer': 'http://www.lvwang.org.cn/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
    },
    //body:stringifiedPostData
}

function fetchWaterData(cityObj){
    const {location,name:city}=cityObj
    const postData={
        position:location.lng+','+location.lat, //'114.3162001,30.58108413'
        city, //'武汉'
       // _csrf: 'dqdr-_Hg8ErIwp8rEh40Kxguv06UxZTg1wBbUmZLqFQU8jnClY2KAoSV1210amJxbkvVGt2n9dm_amNgN3raFg=='
    }
    const stringifiedPostData=qs.stringify(postData)
    const options={...commonOpt,...{body:stringifiedPostData}}

    request(options,(error,res,body)=>{
        if (!error && res.statusCode == 200) {
            // 请求成功的处理逻辑
            // body 是字符串
            const parsedBodyObj=JSON.parse(body)
            for(let key of Object.keys(parsedBodyObj)){
                if(key==='data'){
                    const rawData=parsedBodyObj[key]
                    const filePath=path.join(path.resolve(__dirname,'..'),'data',`${city}_${key}.json`)
                    fs.writeFile(filePath, JSON.stringify(rawData), error => {
                        if (error) return console.log("写入文件失败,原因是" + error.message);
                        console.log("写入成功");
                      });
                }
            }
        } else if(!error){
            console.log(res.statusCode)
        }else{
            console.log(error)
        }
    })
}

module.exports={
    fetchWaterData
}
 



