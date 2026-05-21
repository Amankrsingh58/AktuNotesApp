// AuthInit.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useMeQuery } from "../api/authApi";
import { setAuth, clearAuth } from "./authSlice";
import { isAction } from "@reduxjs/toolkit";

const AuthInit = () => {
  const dispatch = useDispatch();
  const { data, isError, isLoading } = useMeQuery();

  useEffect(() => {
    if (data) {
      // restore auth
      dispatch(
        setAuth({
          isAuthenticated: data.isAuthenticated,
          user: data.user,
          role: data.role,
        })
      );
    }

    if (isError) {
      dispatch(clearAuth());
    }
  }, [data, isError, dispatch]);

  return null;
};

export default AuthInit;
