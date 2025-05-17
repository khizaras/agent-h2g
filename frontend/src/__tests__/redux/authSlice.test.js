import authReducer, {
  reset,
  register,
  login,
  logout,
  checkAuthStatus,
} from "../../redux/slices/authSlice";
import authService from "../../services/authService";

// Mock the auth service
jest.mock("../../services/authService");

describe("Auth Slice", () => {
  const initialState = {
    user: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("reducers", () => {
    it("should return the initial state", () => {
      expect(authReducer(undefined, { type: "unknown" })).toEqual(initialState);
    });

    it("should handle reset", () => {
      const state = {
        ...initialState,
        isLoading: true,
        isSuccess: true,
        isError: true,
        message: "Error message",
      };

      expect(authReducer(state, reset())).toEqual({
        ...state,
        isLoading: false,
        isSuccess: false,
        isError: false,
        message: "",
      });
    });
  });

  describe("async thunks", () => {
    describe("register", () => {
      it("should set user on fulfilled state", async () => {
        // Mock data
        const userData = {
          name: "Test User",
          email: "test@example.com",
          password: "password",
        };

        const mockUser = {
          id: 1,
          name: "Test User",
          email: "test@example.com",
          token: "testtoken",
        };

        // Mock service call
        authService.register.mockResolvedValue(mockUser);

        // Test the async thunk
        const dispatched = [];
        const dispatch = (action) => {
          dispatched.push(action);
          return action;
        };

        const getState = () => ({});
        const thunkAPI = { dispatch, getState, rejectWithValue: jest.fn() };

        // Execute the thunk
        await register(userData)(dispatch, getState, thunkAPI);

        // Check pending and fulfilled actions were dispatched
        expect(dispatched[0].type).toBe("auth/register/pending");
        expect(dispatched[1].type).toBe("auth/register/fulfilled");
        expect(dispatched[1].payload).toEqual(mockUser);

        // Test reducer with fulfilled action
        const state = authReducer(initialState, dispatched[1]);
        expect(state).toEqual({
          ...initialState,
          isLoading: false,
          isSuccess: true,
          user: mockUser,
        });
      });

      it("should handle rejection", async () => {
        // Mock data
        const userData = {
          name: "Test User",
          email: "test@example.com",
          password: "password",
        };

        // Mock service error
        const error = new Error("Registration failed");
        error.response = { data: { error: "Email already exists" } };
        authService.register.mockRejectedValue(error);

        // Test the async thunk
        const dispatched = [];
        const dispatch = (action) => {
          dispatched.push(action);
          return action;
        };

        const getState = () => ({});
        const rejectWithValue = jest
          .fn()
          .mockReturnValue("Email already exists");
        const thunkAPI = { dispatch, getState, rejectWithValue };

        // Execute the thunk
        await register(userData)(dispatch, getState, thunkAPI);

        // Check pending and rejected actions were dispatched
        expect(dispatched[0].type).toBe("auth/register/pending");
        expect(dispatched[1].type).toBe("auth/register/rejected");
        expect(dispatched[1].payload).toEqual("Email already exists");

        // Test reducer with rejected action
        const state = authReducer(initialState, dispatched[1]);
        expect(state).toEqual({
          ...initialState,
          isLoading: false,
          isError: true,
          message: "Email already exists",
          user: null,
        });
      });
    });

    describe("login", () => {
      it("should set user on fulfilled state", async () => {
        // Mock data
        const userData = {
          email: "test@example.com",
          password: "password",
        };

        const mockUser = {
          id: 1,
          name: "Test User",
          email: "test@example.com",
          token: "testtoken",
        };

        // Mock service call
        authService.login.mockResolvedValue(mockUser);

        // Test the async thunk
        const dispatched = [];
        const dispatch = (action) => {
          dispatched.push(action);
          return action;
        };

        const getState = () => ({});
        const thunkAPI = { dispatch, getState, rejectWithValue: jest.fn() };

        // Execute the thunk
        await login(userData)(dispatch, getState, thunkAPI);

        // Check pending and fulfilled actions were dispatched
        expect(dispatched[0].type).toBe("auth/login/pending");
        expect(dispatched[1].type).toBe("auth/login/fulfilled");
        expect(dispatched[1].payload).toEqual(mockUser);

        // Test reducer with fulfilled action
        const state = authReducer(initialState, dispatched[1]);
        expect(state).toEqual({
          ...initialState,
          isLoading: false,
          isSuccess: true,
          user: mockUser,
        });
      });
    });

    describe("logout", () => {
      it("should clear user state", async () => {
        // Mock service call
        authService.logout.mockResolvedValue();

        // Test the async thunk
        const dispatched = [];
        const dispatch = (action) => {
          dispatched.push(action);
          return action;
        };

        // Execute the thunk
        await logout()(dispatch);

        // Check fulfilled action was dispatched
        expect(dispatched[0].type).toBe("auth/logout/pending");
        expect(dispatched[1].type).toBe("auth/logout/fulfilled");

        // Test reducer with fulfilled action
        const stateWithUser = {
          ...initialState,
          user: { id: 1, name: "Test User" },
        };

        const state = authReducer(stateWithUser, dispatched[1]);
        expect(state).toEqual({
          ...stateWithUser,
          user: null,
        });
      });
    });

    describe("checkAuthStatus", () => {
      it("should update user state if token is valid", async () => {
        // Mock data
        const mockUser = {
          id: 1,
          name: "Test User",
          email: "test@example.com",
        };

        // Mock service call
        authService.getCurrentUser.mockResolvedValue(mockUser);

        // Test the async thunk
        const dispatched = [];
        const dispatch = (action) => {
          dispatched.push(action);
          return action;
        };

        const getState = () => ({
          auth: {
            user: { token: "validtoken" },
          },
        });

        const thunkAPI = { dispatch, getState, rejectWithValue: jest.fn() };

        // Execute the thunk
        await checkAuthStatus()(dispatch, getState, thunkAPI);

        // Check pending and fulfilled actions were dispatched
        expect(dispatched[0].type).toBe("auth/checkStatus/pending");
        expect(dispatched[1].type).toBe("auth/checkStatus/fulfilled");
        expect(dispatched[1].payload).toEqual(mockUser);

        // Test reducer with fulfilled action
        const initialStateWithUser = {
          ...initialState,
          user: { id: 1, token: "validtoken" },
        };

        const state = authReducer(initialStateWithUser, dispatched[1]);
        expect(state).toEqual({
          ...initialStateWithUser,
          isLoading: false,
          user: {
            id: 1,
            token: "validtoken",
            name: "Test User",
            email: "test@example.com",
          },
        });
      });

      it("should clear user state if token is invalid", async () => {
        // Mock service call with error
        authService.getCurrentUser.mockRejectedValue(
          new Error("Invalid token")
        );
        authService.logout.mockResolvedValue();

        // Test the async thunk
        const dispatched = [];
        const dispatch = (action) => {
          dispatched.push(action);
          return action;
        };

        const getState = () => ({
          auth: {
            user: { token: "invalidtoken" },
          },
        });

        const rejectWithValue = jest
          .fn()
          .mockReturnValue("Session expired. Please login again.");
        const thunkAPI = { dispatch, getState, rejectWithValue };

        // Execute the thunk
        await checkAuthStatus()(dispatch, getState, thunkAPI);

        // Check pending and rejected actions were dispatched
        expect(dispatched[0].type).toBe("auth/checkStatus/pending");
        expect(dispatched[1].type).toBe("auth/checkStatus/rejected");

        // Test reducer with rejected action
        const initialStateWithUser = {
          ...initialState,
          user: { id: 1, token: "invalidtoken" },
        };

        const state = authReducer(initialStateWithUser, dispatched[1]);
        expect(state.user).toBeNull();
      });
    });
  });
});
