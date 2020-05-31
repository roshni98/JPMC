import { ServerRespond } from './DataStreamer';

export interface Row {
  //the return object corresponds to the schema of the table & this is the structure of the return object
  price_abc:number,
  price_def:number,
  ratio:number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert:number | undefined,
}

export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    //generateRow processes the raw server data passed to it so that it can return the processed data which gets rendered by the Graph componenets table
    const priceABC =(serverRespond[0].top_ask.price+serverRespond[0].top_bid.price)/2;
    const priceDEF =(serverRespond[1].top_ask.price+serverRespond[1].top_bid.price)/2;
    const ratio =  priceABC/priceDEF; //computing ratio
    const upperBound=1+0.05; //upper & lower bound are used to maintain steady upper and lower lines in the graph
    const lowerBound=1-0.05;
    return {
      price_abc: priceABC,
      price_def:priceDEF,
      ratio,
      timestamp:serverRespond[0].timestamp > serverRespond[1].timestamp ? serverRespond[0].timestamp : serverRespond[1].timestamp,
      upper_bound:upperBound,
      lower_bound:lowerBound,
      trigger_alert:(ratio>upperBound || ratio<lowerBound)? ratio:undefined, // the trigger alert is a value that checks if it remains within the threshold then no value/undefined will suffice
    };
  }
}