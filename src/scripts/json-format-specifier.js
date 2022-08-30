class JsonParseClass {
    #stringHeader = "";
    #objectProperties = undefined;
    #dateTypeOfData = undefined;

    constructor(stringHeader, objectProperties, dateTypeOfDataContainer) {
        if (stringHeader.constructor !== String) {
            throw "ERROR: <stringHeader> parameter is supposed to be of type <String>!";
        } else if (objectProperties.constructor !== Array) {
            throw "ERROR: <objectProperties> parameter is supposed to be of type <Array>!";

            for (const propertyString of objectProperties) {
                if (propertyString.constructor !== String) {
                    throw "ERROR: <objectProperties> parameter is supposed to be an Array of <Strings>!";
                }
            }
        }
    }
}