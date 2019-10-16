const {fetchWaterData}=require('./getWaterData')
const {allCities,getCityLoc}=require('./getCity')

const partCities=allCities.slice(0,5) //先查5个城市
const promises=allCities.map(cityName=>getCityLoc(cityName))

Promise.all(promises).then(arr=>{
    const loc=[] //用于查询目前数据的城市名称与坐标数据
    for(let i=0,len=arr.length;i<len; i++){
        const item=JSON.parse(arr[i])
        
        if(item && item.message==='ok'){ //请求成功
            //默认取第一个
            const res=item.result
            if(res && res.length){
                loc.push({
                    name:res[0].name,
                    location:res[0].location
                })
                if(res[0].name!==allCities[i]){
                  for(let j=1,resLen=res.length;j<resLen;j++){
                    if(res[j].name===allCities[i]){
                        loc.pop()
                        loc.push({
                            name:res[j].name,
                            location:res[j].location
                        })
                        break
                    }
                  }
                }
            }
        }
    }

    //然后去请求各个城市的地表水数据
    loc.forEach(city=>{
       fetchWaterData(city)
    })
    
}).catch(error=>console.log(error))
