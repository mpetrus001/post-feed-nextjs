import { useRouter } from "next/router";
import { useEffect } from "react";
import { isServer } from "./_isServer";
import { useMeQuery } from "../generated/graphql";

const useRequireAuth = () => {
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const router = useRouter();
  useEffect(() => {
    if (!fetching && !data?.me) {
      router.replace("/login");
    }
  }, [fetching, data, router]);
  return [{ data, fetching }];
};

export default useRequireAuth;
