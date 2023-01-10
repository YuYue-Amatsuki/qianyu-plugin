import fetch from "node-fetch";
export async function geturldata(data, suc) {
    if (data.parms) {
        data.url += data.parms
    }
    try {
        let response = await fetch(data.url, {
            headers: data.headers
        });
        if (data.data === 0) {
            let rep = await response.text();
            suc({ data: rep, responseStatus: response.status })
        } else if (data.data === 1) {
            suc({ responseStatus: response.status })
        }
        else {
            let json = await response.json()
            let dc = json
            if (data.data) {
                for (let i in data.data) {
                    dc = dc[data.data[i]]
                }
            }
            suc({ data: dc, responseStatus: response.status })
        }
    } catch (error) {
        return { iserror: true }
    }
}