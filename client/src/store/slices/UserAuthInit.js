import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserAuth, clearUserAuth } from "./userSlice";
import { useMeQuery } from "../../features/user/userApi";

const UserAuthInit = () => {
  const dispatch = useDispatch();
  const { data, isSuccess, isError, isLoading } = useMeQuery();

  useEffect(() => {
    if (isSuccess && data?.user) {
      dispatch(setUserAuth(data.user));
    } else if (isError && !isLoading) {
      dispatch(clearUserAuth());
    }
  }, [isSuccess, isError, data, dispatch, isLoading]);

  return null;
};

export default UserAuthInit;
