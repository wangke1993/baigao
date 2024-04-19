const xml2js = require('xml2js');
export const js2xml = (data: any) => {
    const builder = new xml2js.Builder();
    return builder.buildObject({ xml: data }).replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', "");
}