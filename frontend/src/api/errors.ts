import axios from "axios";

export function getApiErrorMessage(
error: unknown,
fallbackMessage = "Something went wrong. Please try again.",
): string {
if (axios.isAxiosError(error)) {
const data: unknown = error.response?.data;


if (typeof data === "string" && data.trim()) {
  return data;
}

if (data && typeof data === "object") {
  const messages = Object.values(data as Record<string, unknown>)
    .flatMap((value) => {
      if (typeof value === "string") {
        return [value];
      }

      if (Array.isArray(value)) {
        return value.filter(
          (item): item is string => typeof item === "string",
        );
      }

      return [];
    })
    .filter(Boolean);

  if (messages.length > 0) {
    return messages.join(" ");
  }
}

if (!error.response) {
  return "Unable to connect to the server. Please check your connection.";
}


}

if (error instanceof Error && error.message) {
return error.message;
}

return fallbackMessage;
}
