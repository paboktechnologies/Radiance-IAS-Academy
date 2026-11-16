
const getImageUrl = (originalUrl) => {
    if (!originalUrl) {
        return "https://placehold.co/600x400?text=Course";
    }

    try {
        const url = new URL(originalUrl);

        if (
            url.hostname === "drive.google.com" ||
            url.hostname === "www.drive.google.com"
        ) {
            let fileId = "";

            // Google Drive /file/d/FILE_ID/view link
            const pathMatch = url.pathname.match(/\/file\/d\/([^/]+)/);

            if (pathMatch) {
                fileId = pathMatch[1];
            }

            // Google Drive open?id=FILE_ID link
            if (!fileId) {
                fileId = url.searchParams.get("id") || "";
            }

            if (fileId) {
                return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
            }
        }

        return originalUrl;

    } catch {
        return "https://placehold.co/600x400?text=Invalid+Image+URL";
    }
};

export default getImageUrl;
