import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    selectUser,
    selectToken,
    selectIsAuthenticated,
    selectAuthLoading,
    selectAuthError,
    selectAuthSuccess,
    selectCodeRequested,
    selectEmailVerified,
    logout,
    clearMessages,
} from "@features/auth/authSlice";
import {
    loginUser,
    registerUser,
    generateCode,
    verifyEmail,
    forgotPassword,
    fetchCurrentUser,
    updateUser,
    deleteUser,
} from "@features/auth/authSlice";

const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(selectUser);
    const token = useSelector(selectToken);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);
    const successMsg = useSelector(selectAuthSuccess);
    const codeRequested = useSelector(selectCodeRequested);
    const emailVerified = useSelector(selectEmailVerified);

    const handleLogin = async (credentials) => {
        const result = await dispatch(loginUser(credentials));

        if (result['payload']['non_field_errors']?.[0] == "User account is disabled") {
            navigate("/verify-email", { state: { email: credentials.identifier, password: credentials.password } });
        }

        if (loginUser.fulfilled.match(result)) {
            navigate("/dashboard");
        }
    };

    const handleRegister = async (data) => {
        const result = await dispatch(registerUser(data));
        if (registerUser.fulfilled.match(result)) {
            navigate("/verify-email", { state: { email: data.email, password: data.password } });
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const handleGenerateCode = (payload) =>
        dispatch(generateCode(payload));

    const handleVerifyEmail = async (payload) => {
        const result = await dispatch(verifyEmail(payload));
        if (verifyEmail.fulfilled.match(result)) {
            handleLogin({ identifier: payload.email, password: payload.password })
        }
    };

    const handleForgotPassword = async (payload) => {
        const result = await dispatch(forgotPassword(payload));
        if (forgotPassword.fulfilled.match(result)) {
            navigate("/login");
        }
    };

    const handleUpdateUser = (pk, data) =>
        dispatch(updateUser({ pk, data }));

    const handleDeleteUser = async (pk) => {
        const result = await dispatch(deleteUser(pk));
        if (deleteUser.fulfilled.match(result)) {
            navigate("/login");
        }
    };

    const handleClearMessages = () => dispatch(clearMessages());

    return {
        // State
        user,
        token,
        isAuthenticated,
        loading,
        error,
        successMsg,
        codeRequested,
        emailVerified,

        // Actions
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        generateCode: handleGenerateCode,
        verifyEmail: handleVerifyEmail,
        forgotPassword: handleForgotPassword,
        updateUser: handleUpdateUser,
        deleteUser: handleDeleteUser,
        fetchUser: (pk) => dispatch(fetchCurrentUser(pk)),
        clearMessages: handleClearMessages,
    };
};

export default useAuth;