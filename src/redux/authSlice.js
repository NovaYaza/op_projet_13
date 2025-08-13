import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// URLs API
const API_LOGIN = "http://localhost:3001/api/v1/user/login";
const API_PROFILE = "http://localhost:3001/api/v1/user/profile";

// Thunk pour la connexion utilisateur
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await fetch(API_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();

      if (response.ok) {
        return data.body; // { token: "..." }
      } else {
        return thunkAPI.rejectWithValue(data.message || "Invalid credentials");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Network error");
    }
  }
);

// Thunk pour récupérer le profil utilisateur
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    try {
      const response = await fetch(API_PROFILE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        return data.body; // { firstName, lastName, email }
      } else {
        return thunkAPI.rejectWithValue(data.message || "Failed to fetch profile");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Network error");
    }
  }
);

// Initialisation du token depuis localStorage
const initialToken = localStorage.getItem("token");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: initialToken || null,
    firstName: null,
    lastName: null,
    email: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.firstName = null;
      state.lastName = null;
      state.email = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // FETCH PROFILE
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.email = action.payload.email;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;