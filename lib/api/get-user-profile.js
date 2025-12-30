export async function getUserProfile(axiosInstance = null) {
    if (!axiosInstance) return null;
    try {
        const response = await axiosInstance.get("/user/details");
        return response?.data?.data || {};
    } catch (err) {
        console.error("Failed to fetch user profile:", err);
        throw err;
    }
}
