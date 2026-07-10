import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import Googlelogin from "./Googlelogin";

function Singup() {
  const navigate = useNavigate();
  const [singupd, setsingupd] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [err, seterr] = useState({});


  async function handlesubmit(e) {
    e.preventDefault();
    const obj = {};

    if (singupd.name === "") obj.name = "name is required";
    if (singupd.email === "") obj.email = "email is required";
    if (singupd.phone === "") obj.phone = "phone is required";
    if (singupd.password === "") obj.password = "password is required";

    seterr(obj);
    if (Object.keys(obj).length === 0) {
      try {
        const result = await axios.post(
          `${import.meta.env.VITE_API_URL}/task/singup`,
          singupd,
        );

        register(singupd.email, singupd.password);
        alert(result?.data?.message);

        if (result.status === 201) {
          setsingupd({
            name: "",
            email: "",
            phone: "",
            password: "",
          });
        }
      } catch (err) {
        alert(err);
      }
    }
  }

  return (
    <div className="app-page flex items-center justify-center overflow-y-auto">
      <div className="surface flex w-full max-w-md items-center justify-center rounded-2xl p-6">
        <form
          action=""
          onSubmit={handlesubmit}
          className="flex w-full flex-col gap-5"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Create account
            </h1>
            <p className="mt-1 text-sm opacity-70">
              Set up your task manager profile.
            </p>
          </div>

          <div className="flex flex-col">
            <label htmlFor="" className="mb-2 text-sm font-bold text-teal-700">
              Name
            </label>
            <input
              value={singupd.name}
              onChange={(e) => setsingupd({ ...singupd, name: e.target.value })}
              type="text"
              className="field"
            />
            <p className="mt-1 text-sm font-semibold text-rose-500">
              {err.name}
            </p>
          </div>

          <div className="flex flex-col">
            <label htmlFor="" className="mb-2 text-sm font-bold text-teal-700">
              Email
            </label>
            <input
              value={singupd.email}
              onChange={(e) =>
                setsingupd({ ...singupd, email: e.target.value })
              }
              type="text"
              className="field"
            />
            <p className="mt-1 text-sm font-semibold text-rose-500">
              {err.email}
            </p>
          </div>

          <div className="flex flex-col">
            <label htmlFor="" className="mb-2 text-sm font-bold text-teal-700">
              Phone no.
            </label>
            <input
              value={singupd.phone}
              onChange={(e) =>
                setsingupd({ ...singupd, phone: e.target.value })
              }
              type="text"
              className="field"
            />
            <p className="mt-1 text-sm font-semibold text-rose-500">
              {err.phone}
            </p>
          </div>

          <div className="flex flex-col">
            <label htmlFor="" className="mb-2 text-sm font-bold text-teal-700">
              Password
            </label>
            <input
              value={singupd.password}
              onChange={(e) =>
                setsingupd({ ...singupd, password: e.target.value })
              }
              type="text"
              className="field"
            />
            <p className="mt-1 text-sm font-semibold text-rose-500">
              {err.password}
            </p>
          </div>

          <button className="btn-primary cursor-pointer" type="submit">
            Sign up
          </button>

          <Googlelogin/>

          <button
            className="btn-secondary cursor-pointer"
            type="button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Singup;
