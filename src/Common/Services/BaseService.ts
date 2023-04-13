import axios, {AxiosInstance} from 'axios'

export class BaseService {

    // Token
    protected token: string | undefined;
    
    // Client instance for HTTP requests
    protected client: AxiosInstance;

    constructor() {

        // Create instance
        this.client = axios.create({
            baseURL: `http://localhost:5000`
        })

        // Request interceptor
        this.client.interceptors.response.use(
            // OK
            response => {
                return response;
            },

            // Error
            function (error) {

                // Bad Request /Validations
                if (error.response.status === 400) {
                    return {status: error.response.data};
                }

                // Unauthorized
                if (error.response.status === 401) {
                    return {status: error.response.status};
                }

                // Not found
                if (error.response.status === 404) {
                    return {status: error.response.status};
                }

                // Uknown error
                return Promise.reject(error.response);
            });
    }

    // returns bearer token strign
    protected bearerAuth() : string {
        if (!this.token) {
            console.warn(`You wanted to add bearer, but it is null`);
        }
        return `bearer ${this.token}`
    }
}