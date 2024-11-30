const invalidResponse = "Invalid response format"

const actions = {
    400: parseCommonError,
    401: parseCommonError,
    403: parseCommonError,
    404: parseCommonError,
    409: parseDatabaseConflictError,
    422: parseValidationError,
    503: parseCommonError,
}

export function parseResponseError(errorCode, errorBody) {
    if (!actions.hasOwnProperty(errorCode))
        return invalidResponse;

    return actions[errorCode](errorBody);
}

function parseCommonError(errorBody) {
    return errorBody?.detail ?? invalidResponse;
}


function parseDatabaseConflictError(errorBody) {
    const fields = errorBody?.detail?.[0]?.fields;
    if (!fields) 
        return invalidResponse;

    return `Database conflict. Affecting fields: ${fields.join(", ")}`;
}


function parseValidationError(errorBody) {
    const location = errorBody?.detail?.[0]?.loc?.[1];
    const message = errorBody?.detail?.[0]?.msg;

    if (!location || !message) return invalidResponse;

    const errorMessage = `${capitalize(location)}: ${uncapitalize(message)}`;
    return errorMessage;
}

function capitalize(str) {
    if (!str) return '';
    return str[0].toUpperCase() + str.slice(1);
}

function uncapitalize(str) {
    if (!str) return '';
    return str[0].toLowerCase() + str.slice(1);
}
