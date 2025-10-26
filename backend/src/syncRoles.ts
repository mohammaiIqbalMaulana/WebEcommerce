import { auth } from "./config/firebase";
import prisma from "./config/prisma-client";

const syncRoles = async () => {
    try {
        const users = await prisma.user.findMany();
        for (const user of users) {
            await auth.setCustomUserClaims(user.firebaseId, { role: user.role });
            console.log(`Synced role for user ${user.email}: ${user.role}`);
        }
        console.log("All roles synced successfully");
    } catch (error) {
        console.error("Error syncing roles:", error);
    }
};

syncRoles();
