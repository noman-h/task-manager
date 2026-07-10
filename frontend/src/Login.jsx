import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import Googlelogin from "./Googlelogin";

function Login() {
  const navigate = useNavigate();
  const [err, seterr] = useState({});

  const [logind, setlogind] = useState({
    email: "",
    password: "",
  });

  async function handlesubmit(e) {
    e.preventDefault();
    const obj = {};

    if (logind.email === "") obj.email = "email is required";
    if (logind.password === "") obj.password = "password is required";

    if (Object.keys(obj).length === 0) {
      try {
        const result = await axios.post(`${import.meta.env.VITE_API_URL}/task/login`, {
          email: logind.email,
          password: logind.password,
        });

        const token = result?.data?.token;
        const role = result?.data?.result?.role;
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("email", logind.email);
          localStorage.setItem("theme", result?.data?.result?.theme);
          localStorage.setItem("user", role);
          alert("logined successfully");
          setlogind({
            email: "",
            password: "",
          });
          navigate("/");
        }
      } catch (err) {
        if (err.status === 404) {
          obj.email = "email not found";
        } else if (err.status === 400) {
          obj.password = "wrong password";
        } else {
          alert(err.message);
        }
      }
    }
    seterr(obj);
  }

  return (
    <div className="app-page flex items-center justify-center overflow-y-auto">
      <div className="surface flex w-full max-w-md items-center justify-center rounded-2xl p-6">
        <form
          action=""
          className="flex w-full flex-col gap-5"
          onSubmit={handlesubmit}
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight">Welcome back</h1>
            <p className="mt-1 text-sm opacity-70">
              Sign in to manage your tasks.
            </p>
          </div>

          <div className="flex flex-col">
            <label htmlFor="" className="mb-2 text-sm font-bold text-teal-700">
              Email
            </label>
            <input
              value={logind.email}
              onChange={(e) => setlogind({ ...logind, email: e.target.value })}
              type="text"
              className="field"
            />
            <p className="mt-1 text-sm font-semibold text-rose-500">
              {err.email}
            </p>
          </div>

          <div className="flex flex-col">
            <label htmlFor="" className="mb-2 text-sm font-bold text-teal-700">
              Password
            </label>
            <input
              value={logind.password}
              onChange={(e) =>
                setlogind({ ...logind, password: e.target.value })
              }
              type="password"
              className="field"
            />
            <p className="mt-1 text-sm font-semibold text-rose-500">
              {err.password}
            </p>
          </div>

          <button className="btn-primary cursor-pointer" type="submit">
            Login
          </button>

          <Googlelogin />

          <button
            className="btn-secondary cursor-pointer"
            type="button"
            onClick={() => navigate("/forgetpass")}
          >
            Forgot password
          </button>

          <button
            className="btn-secondary cursor-pointer"
            type="button"
            onClick={() => navigate("/singup")}
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
