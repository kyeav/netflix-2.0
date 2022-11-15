import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import useAuth from "../hooks/useAuth";

interface Inputs {
  email: string;
  password: string;
}

function login() {
  const [login, setLogin] = useState(false);
  const { signIn, signUp } = useAuth();

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    console.log(email, password);

    if (login) {
      await signIn(email, password);
    } else {
      await signUp(email, password);
    }
  };

  return (
    <div className="relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent">
      <Head>
        <title>Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Image
        src="https://rb.gy/p2hphi"
        layout="fill"
        className="-z-10 !hidden opacity-60 sm:!inline"
        objectFit="cover"
        alt=""
      />

      <img
        src="https://rb.gy/ulxxee"
        className="absolute left-4 top-4 cursor-pointer object-contain md:left-10 md:top-6"
        width={150}
        height={150}
      />
      {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative mt-24 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-md md:px-14"
      >
        <h1 className="text-4xl font-semibold">Sign In</h1>

        <div className="space-y-4">
          <label>
            {/* register your input into the hook by invoking the "register" function */}
            {/* include validation with required or other standard HTML validation rules */}
            <input
              // spread operator -> ...
              // pattern -> register
              {...register("email", { required: true })}
              type="email"
              placeholder="Email"
              className={`input ${
                errors.email && "border-b-2 border-orange-500"
              }`}
            />
            {/* errors will return when field validation fails  */}
            {errors.email && (
              <p className="p-1 text-[13px] font-light text-orange-500">
                Please enter a valid email.
              </p>
            )}
          </label>

          <label>
            <input
              {...register("password", { required: true })}
              type="password"
              placeholder="Password"
              className={`input ${
                errors.password && "border-b-2 border-orange-500"
              }`}
            />
            {errors.password && (
              <p className="p-1 text-[13px] font-light text-orange-500">
                Your password must contain between 6 and 60 characters.
              </p>
            )}
          </label>
        </div>

        <button
          onClick={() => setLogin(true)}
          type="submit"
          className="w-full rounded bg-[#e50914] py-3 font-semibold"
        >
          Sign In
        </button>

        <div className="text-[gray]">
          New to Netflix?{" "}
          <button
            onClick={() => setLogin(false)}
            type="submit"
            className="text-white hover:underline"
          >
            Sign Up Now
          </button>
        </div>
      </form>
    </div>
  );
}

export default login;
