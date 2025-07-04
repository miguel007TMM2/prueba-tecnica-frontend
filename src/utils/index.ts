
import { getCookie } from "cookies-next";

 export function getToken(): string {
    const cookieValue = getCookie("token");
    let token: string = "";
    if (cookieValue) {
      try {
        const parsed = JSON.parse(cookieValue as string);
        token = parsed.token;
      } catch {
        token = cookieValue as string;
      }
    }
    return token;
  }

