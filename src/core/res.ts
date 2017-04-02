namespace engine {
    export namespace RES {
        var RESOURCE_PATH = "./Resources/";

        export interface Processor {

        load(url: string, callback: Function): void;

        }

        export class ImageProcessor implements Processor {

        load(url: string, callback: Function) {
            // let image = document.createElement("img");
            // image.src = url;
            // image.onload = () => {
            //     callback();
            // }
            return new Promise(function (resolve, reject) {
                var result = document.createElement("img");
                result.src = RESOURCE_PATH + url;
                result.onload = () => {
                    resolve(result);
                    callback(result);
                }
            });
            
        }
    }

    export class TextProcessor implements Processor {
        load(url: string, callback: Function) {
            var xhr = new XMLHttpRequest();
            xhr.open("get", RESOURCE_PATH + url);
            xhr.send();
            xhr.onload = () => {
                callback(xhr.responseText);
            }
        }
    }

    export function mapTypeSelector(typeSelector: (url: string) => string) {
        getTypeByURL = typeSelector;
    }

    var cache = {};

    export function getRES(url: string, callback: (data: any) => void) {
        if(cache[url] == null){
            let type = getTypeByURL(url);
            let processor = createProcessor(type);
            if (processor != null) {
                processor.load(url, (data) => {
                    cache[url] = data;
                    callback(data);
                    return data;
                });
            }
        }
        else
        return cache[url];
    }

    function get(url: string): any {
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