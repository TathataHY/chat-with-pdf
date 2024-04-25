import { writable } from "svelte/store";

export const APP_STATUS = {
  INIT: 0,
  LOADING: 1,
  CHAT_MODE: 2,
  ERROR: -1,
};

export const appStatus = writable(APP_STATUS.CHAT_MODE);
export const PDFToChat = writable({
  id: "4a2e623bff1eac8cabef5658b3daa3c9",
  url: "https://res.cloudinary.com/tathata/image/upload/v1714018030/chat-with-pdf/vn0j6gwolwch9o6g9bah.pdf",
  pages: 2,
});

export const setLoading = () => {
  appStatus.set(APP_STATUS.LOADING);
};

export const setError = () => {
  appStatus.set(APP_STATUS.ERROR);
};

export const setChatMode = ({
  id,
  url,
  pages,
}: {
  id: string;
  url: string;
  pages: number;
}) => {
  appStatus.set(APP_STATUS.CHAT_MODE);
  PDFToChat.set({ id, url, pages });
};
