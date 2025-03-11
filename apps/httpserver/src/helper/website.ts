const FETCH_TIMEOUT_MS = 5000;

async function checkIsWebsiteExist (url : string) : Promise<boolean>  {
    try {
        new URL(url);
    } catch (e) {
        throw new Error("Invalid URL format");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
        const response = await fetch(url, {
            method: 'HEAD',
            signal :  controller.signal
        });
        return response.ok;
    } catch (error : unknown) {
        if (error instanceof Error) {
            if (error.name === "AbortError") {
                throw new Error(`Request timed out after ${FETCH_TIMEOUT_MS * 1000}s`);
            } else {
                throw new Error(`Failed to verify website`);
            }
        }
        throw new Error("Something went wrong!");
    } finally {
        clearTimeout(timeout);
    }
}

export { checkIsWebsiteExist }