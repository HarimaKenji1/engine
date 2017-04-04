namespace engine {
    export namespace RES {
        var RESOURCE_PATH = "./Resources/";

        export interface Processor {

        load(url: string, callback: Function): void;

        }

        export class ImageProcessor implements Processor {

        load(url: string, callback: Function) {
                var result = document.createElement("img");
                result.src = RESOURCE_PATH + url;
                result.onload = () => {
                    callback(result);
                    return result;
                }
            // let image = document.createElement("img");
            // image.src = url;
            // image.onload = () => {
            //     callback();
            // }
            // return new Promise(function (resolve, reject) {
            //     var result = document.createElement("img");
            //     result.src = RESOURCE_PATH + url;
            //     result.onload = () => {
            //         resolve(result);
            //         callback(result);
            //     }
            // });
            
        }
    }

    export class TextProcessor implements Processor {
        load(url: string, callback: Function) {
            var xhr = new XMLHttpRequest();
            xhr.open("get", RESOURCE_PATH + url);
            xhr.send();
            xhr.onload = () => {
            xhr.open('GET', url, true);
            xhr.send();
            xhr.onreadystatechange = function () {
                // 通信成功时，状态值为4
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var obj = eval('(' + xhr.responseText + ')'); 
                        return xhr.responseText;
                    } else {
                        console.error(xhr.statusText);
                    }
                }
            };
            xhr.onerror = function (e) {
                console.error(xhr.statusText);
            };
            }
        }
    }

    export function mapTypeSelector(typeSelector: (url: string) => string) {
        getTypeByURL = typeSelector;
    }

    var cache = {};

    export function getRES(url: string, callback: (data: any) => void) {
        if(cache[url] == null || 
        (getTypeByURL(url) == "image" && cache[url].src == null)){
            let type = getTypeByURL(url);
            let processor = createProcessor(type);
            if (processor != null) {
                processor.load(url, (data) => {
                    cache[url] = data;
                    callback(data);
                    return cache[url];
                });
            }
        }
        return cache[url];
    }

    export function loadConfig(preloadJson,callback? : () => void){
        preloadJson.resources.foreach((config) => {
                if(config.type == "image"){
                    var preloadResource = new Image();
                    preloadResource.width = config.width;
                    preloadResource.height = config.height;
                }

                cache[config.url] = preloadResource;
            });
        callback();
    }

    export function get(url: string): any {
        return cache[url];
    }

    var getTypeByURL = (url: string): string => {
        if (url.indexOf(".jpg") >= 0) {
            return "image";
        }
        else if (url.indexOf(".mp3") >= 0) {
            return "sound";
        }
        else if (url.indexOf(".json") >= 0) {
            return "text";
        }
    }

    let hashMap = {
        "image": new ImageProcessor(),
        "text": new TextProcessor()
    }
    function createProcessor(type: string) {
        let processor: Processor = hashMap[type];
        return processor;
    }

    export function map(type: string, processor: Processor) {
        hashMap[type] = processor;
    }

        // export function getRes(path: string) {
        //     return new Promise(function (resolve, reject) {
        //         var result = new Image();
        //         result.src = RESOURCE_PATH + path;
        //         result.onload = () => {
        //             resolve(result);
        //         }
        //     });
        //     // var result = new Image();
        //     // result.src = path;
        //     // result.onload = () => {
        //     //         return(result);
        //     // }
        // }
    }
}