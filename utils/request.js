import fetch from "node-fetch";
export async function geturldata(url, data, suc, parms) {
    if (parms) {
        url += parms
    }
    console.log(url);
    try {
        if (data === 0) {
            let response = await fetch(url);
            let data = await response.text();
            suc({ data: data, responseStatus: response.status })
        } else if (data === 1) {
            let response = await fetch(url);
            suc({ responseStatus: response.status })
        } else if (data === 3) {
            let response = await fetch(url);

        } else {
            let respon = await fetch(url)
            let json = await respon.json()
            let dc = json
            if (data) {
                for (let i in data) {
                    dc = dc[data[i]]
                }
            }
            suc({ data: dc, responseStatus: respon.status })
        }
    } catch (error) {
        return { iserror: true }
    }
}