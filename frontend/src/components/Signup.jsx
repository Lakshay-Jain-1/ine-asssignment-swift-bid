import { useState } from "react";
import { supabase } from "../supabase-client";

const SignUp = () => {
  const [userData, setUserData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userData);

    const { error } = await supabase.auth.signUp(userData);
    if (error) console.error(error);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <input type="submit" value="Sign Up" />
    </form>
  );
};

export default SignUp;