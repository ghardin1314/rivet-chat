import { useQuery } from "@tanstack/react-query";
import { authClient } from "../lib/auth";

export const useSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: () =>
      authClient.getSession().then((res) => {
        if (res.error) {
          throw res.error;
        }

        return res.data;
      }),
  });
};
