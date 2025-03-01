import Image from "next/image";
import LoginImage from "@/public/login.jpg";

export default function LoginPageImg() {
  return (
    <Image
      src={LoginImage}
      priority={false}
      alt="LoginPageImage"
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
    />
  );
}
