import { prisma } from "../utils/db";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const createNewUser = async () => {
    const { userId } = auth();
    if (!userId) {
        console.log("No user ID found");
        return;
    }

    try {
        const user = await clerkClient.users.getUser(userId);
        console.log("test user created");
        console.log("userId", userId);
        console.log("user", user);

        if (user) {
            const match = await prisma.user.findUnique({
                where: {
                    clerkId: user.id as string,
                },
            });

            if (!match) {
                await prisma.user.create({
                    data: {
                        clerkId: user.id,
                        email: user.emailAddresses[0].emailAddress,
                    },
                });
            }

            redirect("/journal");
        }
    } catch (error) {
        console.error("Error fetching user:", error);
    }
}

const NewUser = async () => {
    await createNewUser();
    return <div>...loading</div>
}

export default NewUser;
