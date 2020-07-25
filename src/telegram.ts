import axios, { AxiosError, AxiosInstance } from "axios";

const tgbBaseUrl = "https://tgb.vercel.app/api/tgproxy/v1";

type KeyboardButton = {
  text: string;
};
type ReplyKeyboardMarkup = {
  keyboard: Array<Array<KeyboardButton>>;
};
// https://core.telegram.org/bots/api#sendmessage
type SendMessageParams = {
  chat_id: number;
  text: string;
  parse_mode?: string;
  reply_markup?: ReplyKeyboardMarkup;
};

type SendPhotoParams = {
  chat_id: number;
  photo: string;
  caption: string;
  parse_mode?: string;
};

export class TelegramService {
  constructor(botToken: string | null, jwt: string | undefined) {
    if (typeof botToken === "string" && botToken !== "") {
      this.axios = axios.create({
        headers: {
          "Content-Type": "application/json",
        },
      });
      this.baseUrl = "https://api.telegram.org/bot" + botToken;
    } else if (typeof jwt === "string" && jwt !== "") {
      this.axios = axios.create({
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
      this.baseUrl = tgbBaseUrl;
    } else {
      throw new Error("botToken or jwt is needed");
    }
  }

  private baseUrl: string;
  private axios: AxiosInstance;

  async sendPhoto(body: SendPhotoParams) {
    const { baseUrl } = this;
    const url = `${baseUrl}/sendPhoto`;
    try {
      await this.axios.post(url, {
        parse_mode: "MarkdownV2",
        ...body,
      });
    } catch (e) {
      this.handleAPIError(e);
    }
  }

  async sendMessage(body: SendMessageParams) {
    const { baseUrl } = this;
    const url = `${baseUrl}/sendMessage`;
    try {
      await this.axios.post(url, {
        parse_mode: "MarkdownV2",
        ...body,
      });
    } catch (e) {
      this.handleAPIError(e);
    }
  }

  handleAPIError(e: AxiosError) {
    if (e.response) {
      const msg = JSON.stringify(e.response.data);
      // I am lazy :(
      throw new Error(`${e.response.status}:${msg}`);
    } else if (e.request) {
      // network error
      throw new Error(`network:error:${e.code}`);
    }
    throw e;
  }
}
