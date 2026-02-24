const ADJECTIVES = [
  "happy", "bright", "clever", "swift", "brave", "kind", "loyal", "smart",
  "bold", "gentle", "quick", "strong", "wise", "calm", "cheerful", "proud",
  "noble", "eager", "lively", "sunny", "active", "keen", "mighty", "jolly",
];

const ANIMALS = [
  "beagle", "corgi", "husky", "poodle", "boxer", "collie", "spaniel",
  "falcon", "panda", "tiger", "eagle", "dolphin", "fox", "hawk", "wolf",
  "lynx", "otter", "raven", "cobra", "jaguar", "phoenix", "dragon",
];

function generateRandomUsername(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const num = Math.floor(Math.random() * 1000);
  return `${adj}${animal}${num}`;
}

export function handleTelegramUserData(user: Record<string, any>): Record<string, any> {
  try {
    const isTelegramUser = user.email?.includes("@telegram.local");
    if (!isTelegramUser) return user;

    let username = user.username;
    if (!username) {
      if (user.name) {
        const namePart = user.name.toLowerCase().replace(/\s/g, "_");
        const randomChars = Math.random().toString(36).substring(2, 6);
        username = `${namePart}_${randomChars}`;
      } else {
        username = generateRandomUsername();
      }
    }

    return {
      ...user,
      name: user.name || username,
      username: username,
      emailVerified: true,
      image: user.image,
    };
  } catch (error) {
    console.error("Error processing Telegram user data:", error);
    return user;
  }
}
