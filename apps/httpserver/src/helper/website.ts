async function checkIsWebsiteExist (url : string)  {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
        const response = await fetch(url, {
            method: 'HEAD',
            signal :  controller.signal
        });
        if(response.ok) {
            return true;
        }
        return false;
    } catch (error : any) {
        if (error.name === "AbortError") {
            throw new Error("Request timed out.");
        } else {
            throw new Error("Error verifying website. Please try again later.")
        }
    } finally {
        clearTimeout(timeout);
    }
}

export { checkIsWebsiteExist }