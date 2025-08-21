import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const navigate = useNavigate();
  const initialValues = {
    title: "",
    postText: "",
  };
  const postSchema = Yup.object().shape({
    title: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    postText: Yup.string()
      .min(2, "Too Short!")
      .max(510, "Too Long!")
      .required("Required"),
  });
  const handlePostSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:3001/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accessToken: localStorage.getItem("accessToken"),
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log(result);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Create Post
        </h2>

        <Formik initialValues={initialValues} onSubmit={handlePostSubmit} validationSchema={postSchema}>
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm text-gray-600 mb-1"
                >
                  Title
                </label>
                <Field
                  id="title"
                  name="title"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="postText"
                  className="block text-sm text-gray-600 mb-1"
                >
                  Post Text
                </label>
                <Field
                  as="textarea"
                  id="postText"
                  name="postText"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                />
                <ErrorMessage
                  name="postText"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Submit Post
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreatePost;
