import { useEffect } from "react";
import DiagramSingle from "../layouts/DiagramSingle";
import NewsItem from "../layouts/NewsItem";
import { useSearchParams } from "react-router-dom";
function Item(){
    const [params]=useSearchParams();
    const item_id=params.get("item_id");
    console.log("item_id: ",item_id)
    return(
        <div>
            <div>{item_id}</div>
            <div style={{height:'15px'}}></div>
            <DiagramSingle item_id={item_id}/>
            <NewsItem item_id={item_id} />
        </div>
    )
}
export default Item;