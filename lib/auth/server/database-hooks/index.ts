import { handleTelegramUserData } from "./user/handle-telegram-user-data";

const databaseHooks = {
  user: {
    create: {
      before: async (user: Record<string, any>) => {
        try {
          const processedUser = handleTelegramUserData(user);
          return { data: processedUser };
        } catch (error) {
          console.error("Error in user create before hook:", error);
          return { data: user };
        }
      },
    },
  },
};

export default databaseHooks;
