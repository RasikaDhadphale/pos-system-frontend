import { MenuItem} from '../types/types';

const API_BASE_URL = 'https://localhost:7230/';
// const API_BASE_URL = '/';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
};


async function handleResponse(response:any, url:String) {
    if (!response.ok) {
        let errorDetail = 'Unknown error';
        try {
            // Attempt to read error message from body
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const errorBody = isJson ? await response.json() : await response.text();
            errorDetail = (isJson && (errorBody.message || errorBody.error || errorBody.title)) || `Status: ${response.status} ${response.statusText}`;
        } catch (e) {
            // If parsing fails, use status text
            errorDetail = `Status: ${response.status} ${response.statusText}`;
        }
        throw new Error(`API Request failed for ${url}: ${errorDetail}`);
    }

    // Handle 204 No Content (often used for successful DELETE/PUT where no body is returned)
    if (response.status === 204) {
        return {};
    }

    // Attempt to parse JSON for success cases (200, 201, 202, etc.)
    try {
        return await response.data;
    } catch (e) {
        // If response is OK but body is empty or not JSON, return empty object
        return {};
    }
}


export async function postNewOrder(url:String, data:any) {
  const finalUrl = `${API_BASE_URL}${url}`;

  console.log(`[API] Sending POST request: ${finalUrl}`);
    try {
        const response = await fetch(finalUrl, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify(data),
        });

        const final_response = handleResponse(response, finalUrl);
        return final_response;

    } catch (error:any) {
        console.error('[API] POST operation failed:', error.message);
        throw error;
    }
}

export async function getIdByDishName(url:String, name: string) {
  const finalUrl = `${API_BASE_URL}${url}{name}`;

  console.log(`[API] Sending GET request: ${finalUrl}`);
    try {
        const response = await fetch(finalUrl, {
            method: 'GET',
            headers: JSON_HEADERS,
        });
        const final_response = handleResponse(response, finalUrl);
        return final_response;
    } catch (error:any) {
        console.error('[API] GET operation failed:', error.message);
        throw error;
    }
}

export async function getAllDishes(url:String): Promise<MenuItem[]> {
    const finalUrl = `${API_BASE_URL}${url}`;

    try {
        const response = await fetch(finalUrl, {
            method: 'GET',
            headers: JSON_HEADERS,
        });

        if (!response.ok) {
            // Throw an error with the status code for better debugging
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: MenuItem[] = await response.json();

        // const final_response = handleResponse(response, finalUrl);
        return data;
    } catch (error:any) {
        console.error('[API] GET operation failed:', error.message);
        throw error;
    }
}

export async function getAllOrders(url:String): Promise<any> {
  const finalUrl = `${API_BASE_URL}${url}`;

    try {
        const response = await fetch(finalUrl, {
            method: 'GET',
            headers: JSON_HEADERS,
        });

        if (!response.ok) {
            // Throw an error with the status code for better debugging
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: any = await response.json();

        // const final_response = handleResponse(response, finalUrl);
        return data;
    } catch (error:any) {
        console.error('[API] GET operation failed:', error.message);
        throw error;
    }
};
