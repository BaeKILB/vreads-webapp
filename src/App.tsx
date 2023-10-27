import { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

import RootLayout from "./components/rootLayout";
import Login from "./routes/Auth/Login.tsx";
import Home from "./routes/Home/Home.tsx";
import Profile from "./routes/User/Profile.tsx";
import CreateAccount from "./routes/Auth/CreateAccount.tsx";
import HomeUnLogin from "./routes/Home/HomeUnLogin.tsx";
import SearchVreads from "./routes/search/SearchVreads.tsx";
import ProtectedRoute from "./components/auth-components/protected-route.tsx";
import LoginCheckRoute from "./components/auth-components/loginCheck.tsx";

import { auth } from "./fbCode/fbase.ts";
import SearchSubtag from "./routes/search/SearchSubtag.tsx";
import SearchBakers from "./routes/search/SearchBakers.tsx";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const init = async () => {
    // firebase 가 쿠키와 토큰을 읽고 로그인 여부를 확인하는 메서드
    await auth.authStateReady();

    setIsLoading(false);
  };

  useEffect(() => {
    setTimeout(() => {
      init();
    }, 500);
  }, []);

  const GlobalStyles = createGlobalStyle`
  ${reset}
  *{
    box-sizing: border-box;
  }
  body {
    background-color: black;
    color:white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  `;
  const Warpper = styled.main`
    height: 100vh;
    display: flex;
    justify-content: center;
  `;

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <RootLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "", element: <Home /> },
        {
          path: "profile",
          element: <Profile />,
          children: [{ path: ":anotherUserUid", element: <Profile /> }],
        },
        { path: "search", element: <SearchVreads /> },
        {
          path: "subtag",
          element: <SearchSubtag />,
          children: [{ path: ":subTag", element: <SearchSubtag /> }],
        },
        { path: "bakers", element: <SearchBakers /> },
      ],
    },
    {
      path: "welcome",
      element: (
        <LoginCheckRoute>
          <HomeUnLogin />
        </LoginCheckRoute>
      ),
    },
    {
      path: "login",
      element: (
        <LoginCheckRoute>
          <Login />
        </LoginCheckRoute>
      ),
    },

    {
      path: "createAccount",
      element: (
        <LoginCheckRoute>
          <CreateAccount />
        </LoginCheckRoute>
      ),
    },
  ]);

  return (
    <Warpper>
      <GlobalStyles />
      {isLoading ? "Loading..." : <RouterProvider router={router} />}
    </Warpper>
  );
}

export default App;
