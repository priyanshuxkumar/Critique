import Image from "next/image";
import ReviewImage from "@/public/review.jpg";

export default function ReviewImg() {
    return(
        <Image
            src={ReviewImage}
            priority={false}
            alt="LoginPageImage"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
    )
}