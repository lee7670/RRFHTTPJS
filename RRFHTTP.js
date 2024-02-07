class RRF {
    constructor(ipaddress, password = null) {
        this.ipaddress = ipaddress;
        this.password = password;
        //todo, handle session keys and add getters and setters
    }
    async RRFconnect(){
        let getURL = "http://" + this.ipaddress +"/rr_connect";
        if(null != this.password) {
            getURL = getURL + "?password=" + this.password;
        }
        let response = await fetch(getURL, {
            method: "GET",
            mode: "cors", 
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "error"
        });
        //add error handling for failed connection
        console.log(response);
        let decode = await response.json();
        console.log(decode);
    }
    async RRFObjectModelQuery (key) {
        //todo, optional input flags
        let getURL = "http://" + this.ipaddress + "/rr_model?key="+key;
        let response = null;
        let model = null;
        try{
            response = await fetch(getURL, {
                method: "GET",
                mode: "cors",
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "error"
            });
        } catch(error) {
            console.error(error);
        }
        if(!response.ok && response.status == 401) {
            try {
                await this.RRFconnect();
                response = await fetch(getURL, {
                    method: "GET",
                    mode: "cors",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    redirect: "error"
                });
            } catch (error) {
                console.error(error);
            }
        }
        try {
            model = await response.json();
        }catch(error) {
            console.error(error);
        }
        //todo, handle errors

        console.log(model.result);
        return model.result;
    }
    async GCode(gcode) {
        let getURL = "http://" + this.ipaddress + "/rr_gcode?gcode="+gcode;
        let bufferspace = await fetch(getURL, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "error"
        });
        if(!response.ok && response.status == 401) {
            try {
                await this.RRFconnect();
                response = await fetch(getURL, {
                    method: "GET",
                    mode: "cors",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    redirect: "error"
                });
            } catch (error) {
                console.error(error);
            }
        }
        //todo, handle errors, return bufferspace
        console.log(bufferspace);
    }
    async RRFReply() {
        let getreplyURL = "http://" + this.ipaddress + "/rr_reply";
        let gcodereplyobject = await fetch(getreplyURL, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-Type": "text/plain",
            },
            redirect: "error"
        });
        if(!response.ok && response.status == 401) {
            try {
                await this.RRFconnect();
                gcodereplyobject = await fetch(getreplyURL, {
                    method: "GET",
                    mode: "cors",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "text/plain",
                    },
                    redirect: "error"
                });
            } catch (error) {
                console.error(error);
            }
        }
        let gcodereply = await gcodereplyobject.text();
        return gcodereply;
    }
    async GCodewithReply(gcode){
        let getgcodeURL = "http://" + this.ipaddress + "/rr_gcode?gcode="+gcode;
        let bufferspace = await fetch(getgcodeURL, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "error"
        });
        console.log("bufferspace:"+bufferspace);
        //wait for reply data to be available
        let gcodereply = await this.RRFReply();
        console.log(gcodereply);
        return gcodereply;

    }
}