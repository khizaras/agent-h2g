import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuthStatus } from "../redux/slices/authSlice";

export const useCheckAuthStatus = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);
};
