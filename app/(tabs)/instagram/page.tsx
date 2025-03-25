"use client";
import { useEffect } from "react";
//redirecting to client instagram
const InstagramRedirectPage = () => {
  useEffect(() => {
    window.location.href = "https://www.instagram.com/rollinindoughvernon/";
  }, []);

  return (
    <div>
      <p>Redirecting to Instagram...</p>
    </div>
  );
};

export default InstagramRedirectPage;
