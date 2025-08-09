import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const SignUp: React.FC = () => {
  // Validation Schema
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Passwords must match")
      .required("Confirm password is required"),
  });

  // Initial form values
  const initialValues = {
    username: "",
    password: "",
    confirmPassword: "",
  };

  // Form submit handler
  const onSubmit = async (values: typeof initialValues) => {
    try {
        const response = await fetch("http://localhost:3001/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
    } catch (error) {
        console.log(error);
    }
    console.log("Form Data:", values);
    alert("Signup Successful!");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className="space-y-4">
            {/* Username */}
            <div>
              <label className="block mb-1">Username</label>
              <Field
                type="text"
                name="username"
                className="w-full p-2 border rounded"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1">Password</label>
              <Field
                type="password"
                name="password"
                className="w-full p-2 border rounded"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-1">Confirm Password</label>
              <Field
                type="password"
                name="confirmPassword"
                className="w-full p-2 border rounded"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;
