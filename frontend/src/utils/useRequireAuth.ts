import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";
import { isServer } from "./isServer";

const useRequireAuth = () => {
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const router = useRouter();
  useEffect(() => {
    if (!fetching && !data?.me) {
      router.replace(`/login?next=${router.pathname}`);
    }
  }, [fetching, data, router]);
  return [{ data, fetching }];
};

export default useRequireAuth;
