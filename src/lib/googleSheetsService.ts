/**
 * Google Sheets Service
 * Handles OAuth authentication and Google Sheets API operations
 * for syncing thoughts between the app and a Google Sheet.
 */

// Type declarations for Google APIs
declare global {
    interface Window {
        google?: {
            accounts: {
                oauth2: {
                    initTokenClient: (config: TokenClientConfig) => TokenClient;
                };
            };
        };
        gapi?: {
            load: (api: string, callback: () => void) => void;
            client: {
                init: (config: { discoveryDocs: string[] }) => Promise<void>;
                sheets: {
                    spreadsheets: {
                        values: {
                            get: (params: { spreadsheetId: string; range: string }) => Promise<SheetsResponse>;
                            append: (params: {
                                spreadsheetId: string;
                                range: string;
                                valueInputOption: string;
                                resource: { values: string[][] };
                            }) => Promise<void>;
                            update: (params: {
                                spreadsheetId: string;
                                range: string;
                                valueInputOption: string;
                                resource: { values: string[][] };
                            }) => Promise<void>;
                        };
                    };
                };
                setToken: (token: { access_token: string }) => void;
            };
        };
    }
}

interface TokenClientConfig {
    client_id: string;
    scope: string;
    callback: (response: TokenResponse) => void;
}

interface TokenClient {
    requestAccessToken: () => void;
}

interface TokenResponse {
    access_token?: string;
    error?: string;
}

interface SheetsResponse {
    result: {
        values?: string[][];
    };
}

export interface SheetThought {
    rowIndex: number;
    timestamp: string;
    title: string;
    content: string;
    synced: boolean;
}

export interface GoogleAuthState {
    isConnected: boolean;
    userEmail: string | null;
    accessToken: string | null;
}

// Constants
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

// State
let tokenClient: TokenClient | null = null;
let accessToken: string | null = null;
let gapiInitialized = false;
let gisInitialized = false;

/**
 * Check if Google API scripts are loaded
 */
export const isGoogleApisLoaded = (): boolean => {
    return typeof window !== 'undefined' &&
        typeof window.google !== 'undefined' &&
        typeof window.gapi !== 'undefined';
};

/**
 * Wait for Google API scripts to load
 */
const waitForGoogleApis = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (isGoogleApisLoaded()) {
            resolve();
            return;
        }

        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max
        const interval = setInterval(() => {
            attempts++;
            if (isGoogleApisLoaded()) {
                clearInterval(interval);
                resolve();
            } else if (attempts >= maxAttempts) {
                clearInterval(interval);
                reject(new Error('Google APIs failed to load. Please refresh the page.'));
            }
        }, 100);
    });
};

/**
 * Initialize GAPI client
 */
const initGapiClient = async (): Promise<void> => {
    if (gapiInitialized) return;

    await new Promise<void>((resolve) => {
        window.gapi!.load('client', resolve);
    });

    await window.gapi!.client.init({
        discoveryDocs: [DISCOVERY_DOC],
    });

    gapiInitialized = true;
};

/**
 * Initialize Google Identity Services
 */
const initGisClient = (clientId: string): void => {
    if (gisInitialized) return;

    tokenClient = window.google!.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES,
        callback: () => { }, // Will be overridden on sign-in
    });

    gisInitialized = true;
};

/**
 * Initialize Google authentication
 */
export const initGoogleAuth = async (clientId: string): Promise<void> => {
    if (!clientId) {
        throw new Error('Google Client ID is required. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID.');
    }

    await waitForGoogleApis();
    await initGapiClient();
    initGisClient(clientId);
};

/**
 * Sign in with Google
 */
export const signIn = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!tokenClient) {
            reject(new Error('Google Auth not initialized. Call initGoogleAuth first.'));
            return;
        }

        // Override callback for this sign-in attempt
        tokenClient = window.google!.accounts.oauth2.initTokenClient({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
            scope: SCOPES,
            callback: (response: TokenResponse) => {
                if (response.error) {
                    reject(new Error(response.error));
                    return;
                }
                if (response.access_token) {
                    accessToken = response.access_token;
                    window.gapi!.client.setToken({ access_token: response.access_token });
                    resolve(response.access_token);
                }
            },
        });

        tokenClient.requestAccessToken();
    });
};

/**
 * Sign out
 */
export const signOut = (): void => {
    accessToken = null;
    if (window.gapi?.client) {
        window.gapi.client.setToken({ access_token: '' });
    }
};

/**
 * Check if authenticated
 */
export const isAuthenticated = (): boolean => {
    return accessToken !== null;
};

/**
 * Get current access token
 */
export const getAccessToken = (): string | null => {
    return accessToken;
};

/**
 * Fetch thoughts from Google Sheet
 */
export const fetchThoughtsFromSheet = async (spreadsheetId: string): Promise<SheetThought[]> => {
    if (!accessToken) {
        throw new Error('Not authenticated. Please sign in first.');
    }

    if (!spreadsheetId) {
        throw new Error('Spreadsheet ID is required.');
    }

    try {
        const response = await window.gapi!.client.sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'A:D', // Timestamp, Title, Content, Synced columns
        });

        const values = response.result.values;
        if (!values || values.length <= 1) {
            return []; // Empty or only header row
        }

        // Skip header row (index 0)
        return values.slice(1).map((row, index) => ({
            rowIndex: index + 2, // 1-indexed, +1 for header
            timestamp: row[0] || '',
            title: row[1] || '',
            content: row[2] || '',
            synced: row[3]?.toLowerCase() === '✓' || row[3]?.toLowerCase() === 'true' || row[3]?.toLowerCase() === 'yes',
        }));
    } catch (error) {
        console.error('Failed to fetch from sheet:', error);
        throw new Error('Failed to fetch thoughts from Google Sheet. Check the Spreadsheet ID.');
    }
};

/**
 * Append a thought to the Google Sheet
 */
export const appendThoughtToSheet = async (
    spreadsheetId: string,
    title: string,
    content: string,
    timestamp?: string
): Promise<void> => {
    if (!accessToken) {
        throw new Error('Not authenticated. Please sign in first.');
    }

    const ts = timestamp || new Date().toISOString();

    try {
        await window.gapi!.client.sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'A:D',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [[ts, title, content, '✓']], // Mark as synced since we're adding from the app
            },
        });
    } catch (error) {
        console.error('Failed to append to sheet:', error);
        throw new Error('Failed to add thought to Google Sheet.');
    }
};

/**
 * Mark a row as synced in the Google Sheet
 */
export const markRowAsSynced = async (
    spreadsheetId: string,
    rowIndex: number
): Promise<void> => {
    if (!accessToken) {
        throw new Error('Not authenticated. Please sign in first.');
    }

    try {
        await window.gapi!.client.sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `D${rowIndex}`, // "Synced" column
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [['✓']],
            },
        });
    } catch (error) {
        console.error('Failed to mark row as synced:', error);
        // Don't throw - this is not critical
    }
};

/**
 * Batch mark multiple rows as synced
 */
export const markRowsAsSynced = async (
    spreadsheetId: string,
    rowIndices: number[]
): Promise<void> => {
    for (const rowIndex of rowIndices) {
        await markRowAsSynced(spreadsheetId, rowIndex);
    }
};

export default {
    initGoogleAuth,
    signIn,
    signOut,
    isAuthenticated,
    getAccessToken,
    fetchThoughtsFromSheet,
    appendThoughtToSheet,
    markRowAsSynced,
    markRowsAsSynced,
    isGoogleApisLoaded,
};
