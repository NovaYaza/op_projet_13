import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Appel API pour récupérer le profil
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (token, thunkAPI) => {
    try {
      const response = await fetch("http://localhost:3001/api/v1/user/profile", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) return data.body;
      return thunkAPI.rejectWithValue(data.message);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Erreur Réseau");
    }
  }
);

// Appel API pour modifier le nom
export const updateUserName = createAsyncThunk(
  "user/updateName",
  async ({ token, firstName, lastName }, thunkAPI) => {
    try {
      const response = await fetch("http://localhost:3001/api/v1/user/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName }),
      });
      const data = await response.json();
      if (response.ok) return data.body;
      return thunkAPI.rejectWithValue(data.message);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Erreur Réseau");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    firstName: "",
    lastName: "",
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.error = null;
      })
      .addCase(updateUserName.fulfilled, (state, action) => {
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
      });
  },
});

export default userSlice.reducer;