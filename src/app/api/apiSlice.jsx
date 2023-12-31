import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { setCreadentials, logout } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery ({
  baseUrl: "http://127.0.0.1:5173/",
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token
    if (token) {
      headers.set("authorization", `Bearer ${token}`)
    }
    return headers
  }
})

const baseQueryWithReact = async (args, api, extraOptions) =>{
  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.originalStatus === 403){
    console.log('sending refresh token')

    // send refresh token to get new access token
    const refreshResult = await baseQuery('/refresh', api, extraOptions)
    console.log(refreshResult)
    if (refreshResult?.data){
      const user = api.getState().auth.user

      // store the new token
      api.dispatch(setCreadentials({...refreshResult.data, user}))
      // retry the original query with new access token
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(logout())
    }
  }  

  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReact,
  endpoints: builder => ({})
})