export type TokenResponse = {
    token?: string;
    message?: string;
    error?: string;
};

export const getToken = async (accessToken: string): Promise<TokenResponse> => {
    return fetch('/auth/code-begin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: accessToken }),
    }).then(async response => {
        if (response.ok) {
            return (await response.json()) as TokenResponse;
        } else {
            return { error: `Authentication failed ${response.statusText}` };
        }
    }).catch(error => {
        return { error: `Error reaching the server: ${error.message}` };
    });
};