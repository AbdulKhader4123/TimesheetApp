import { API_PATHS } from "../constants";

export const basePath_URL = "http://localhost:5000/api/";

export const environment = {
    production: false,
    msalConfig: {
        auth: {
            clientId: process.env["CLIENT_ID"] || "",
            authority: `https://login.microsoftonline.com/${process.env["TENANT_ID"]}/`
        }
    },
    apiConfig: {
        scopes: ['user.read'],
        uri: 'https://graph.microsoft.com/v1.0/me'
    }
};
export const protectedResources = [
    {
        endpoint: `${basePath_URL}${API_PATHS.TimeSheet}`,
        scopes: {
            read: [`api://${process.env["SERVER_ID"]}/TimeSheetList.Read` ],
            write: [ `api://${process.env["SERVER_ID"]}/TimeSheetList.ReadWrite` ]
        }
    },
    {
        endpoint: `${basePath_URL}${API_PATHS.TimeSheetTemplate}`,
        scopes: {
            read: [`api://${process.env["SERVER_ID"]}/TimeSheetTemplate.Read` ],
            write: [ `api://${process.env["SERVER_ID"]}/TimeSheetTemplate.ReadWrite` ]
        }
    },
]

