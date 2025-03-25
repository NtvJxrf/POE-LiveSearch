import axios from "axios"
export class Requester {
    constructor(wsController) {
      this.wsController = wsController;
      this.reqHeap = [];
      this._counter = 0;
      this.intervalId = setInterval(() => this.processRequests(), 8000);
      this.results = {}
    }
  
    async processRequests() {
      if(this.reqHeap.length == 0) return
        const requests = []
        for(let i = 0; i < 12 - this._counter && this.reqHeap.length > 0; i++){
          const ids = this.reqHeap.splice(0,10)
          try{
            const url = `https://www.pathofexile.com/api/trade/fetch/${ids.map(el => {
              this.results[el.tradeId] = {searchId: el.searchId}
              return el.tradeId
            }).join(',')}`
            const response = axios.get(url, {
              headers: {
                  "User-Agent": 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36'
              }
            })
            requests.push(response)
            this._counter++
            setTimeout(() => {
                this._counter--
            }, 6000);
            const responses = await Promise.all(requests)
            responses.forEach((fetchedItems) => {
              fetchedItems.data.result.forEach(item => {
                  this.results[item.id] = {...this.results[item.id], item, expiration: Date.now() + 10_000} //1_800_00 = 30 min,60_000 = 1 min
              })
            })
            for(const item in this.results){
                this.results[item].expiration <= Date.now() && delete this.results[item]
            }
            this.wsController.server.send(JSON.stringify(this.results))
          }
          catch(error){
            console.log(error)
            this.reqHeap = this.reqHeap.concat(ids)
          }
        }
    }
    addRequest(request){
      this.reqHeap.push(request)
    }
    stop() {
      clearInterval(this.intervalId);
    }
  }


// for(let i = 0; i < 20; i++){
//     requester.addRequest({searchId: i, tradeId: i})
// }
// requester.start()


// const response = await axios.get(`https://www.pathofexile.com/character-window/get-stash-items?accountName=Microchelik322%237145&realm=pc&league=Settlers&tabs=0&tabIndex=5`, {
//     headers: {
//         "User-Agent": 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
//         'cookie': 'POESESSID=9fc4dcd0ae6b85c90f6233202b04c7c0'
//     }
// })

// console.log(response.data.items[0])
//https://httpbin.org/ip
//https://www.pathofexile.com/api/trade/fetch/df9c5fb5a2503665a1c7b485ae8d265fe54998080bf0efeb665de455be71498e