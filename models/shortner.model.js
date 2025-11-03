import { db } from "../config/db-client.js"



export const loadLinks = async () =>{
    const [result] = await db.execute("select * from links")
    return result;
}

export const saveLinks = async ({url, shortCode}) =>{
    await db.execute("insert into links(shortcode, url) values(?,?)", [shortCode, url])
}

export const getLinkByShortCode = async (shortCode) =>{
    const [link] = await db.execute("select * from links where shortcode = ?", [shortCode])
    if(link.length > 0){
        return link[0]
    }
    return null
}