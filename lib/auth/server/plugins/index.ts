import { telegramAuthPlugin } from "./telegram-auth";
import { telegramAccountLinkingPlugin } from "./telegram-account-linking";

const plugins = [
  telegramAuthPlugin,
  telegramAccountLinkingPlugin,
];

export default plugins;
