"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Ellipsis,
  ExternalLink,
  Star,
  ThumbsUp,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { WebsiteProps } from "@/app/dashboard/page";
import axios from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Loading from "@/components/Loading";
import { useUser } from "@/context/user.context";
import Navbar from "@/components/Navbar";

interface UpvoteProps {
  id: string;
  userId: number;
  reviewId: string;
}

interface ReviewProps {
  id: string;
  content: string;
  rating: number;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
  createdAt: Date;
  upvotes: UpvoteProps[];
}

function useFetchWebsiteAndReviewsData() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [website, setWebsite] = useState<WebsiteProps>();
  const [reviews, setReviews] = useState<ReviewProps[]>();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      axios.get(`http://localhost:8000/api/v1/apps/${id}`, {
        withCredentials: true,
      }),
      axios.get(`http://localhost:8000/api/v1/review/${id}`, {
        withCredentials: true,
      }),
    ])
      .then(([websiteRes, reviewsRes]) => {
        setWebsite(websiteRes.data);
        setReviews(reviewsRes.data);
      })
      .catch((err) => console.error("Error fetching data:", err))
      .finally(() => setLoading(false));
  }, [id]);

  return {
    website,
    reviews,
    loading,
  };
}

export default function Page() {
  const router = useRouter();
  const { user } = useUser();
  const { website, reviews, loading } = useFetchWebsiteAndReviewsData();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-slate-50 sticky top-0 z-50">
        <Navbar/>
        <div className="container mx-auto px-4 py-4">
          <div
            className="flex items-center mb-4 cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" strokeWidth={3} />
            Back to Dashboard
          </div>

          {loading ? (
            <Loading size={40} strokeWidth={2} />
          ) : (
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-background">
                <Image
                  src={website?.iconUrl || "/placeholder.svg"}
                  alt={`${website?.name} icon`}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                  <h1 className="text-3xl font-bold">{website?.name}</h1>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <a
                    href={website?.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:underline flex items-center"
                  >
                    {website?.websiteUrl}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>

                <p className="mt-2 text-muted-foreground">
                  {website?.description || "No description available."}
                </p>

                <div className="flex flex-wrap items-center gap-6 mt-2">
                  <p className="text-md text-muted-foreground">
                    {reviews?.length} reviews
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    Added on 22/12/12
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <main className="container mx-auto px-4 py-4">
        <div className="space-y-6">
          {loading ? (
            <Loading size={40} strokeWidth={2} />
          ) : (
            reviews?.map((item) => (
              <Card key={item.id} className="overflow-hidden shadow-none py-4 gap-4 rounded-lg">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="overflow-hidden ">
                        <Avatar>
                          <AvatarImage
                            src={item.user.avatar}
                            alt={item.user.name}
                          />
                          <AvatarFallback className="uppercase text-black/70 text-xl font-semibold">
                            {user?.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.user.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            item.rating >= star
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.content}</p>
                </CardContent>
                {/* Review Component  */}
                <ReviewFooter upvotes={item?.upvotes} reviewId={item.id} />
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function ReviewFooter({upvotes,reviewId,}: {
  upvotes: UpvoteProps[];
  reviewId: string;
}) {
  const { hasUpvoted, upvoteCount, handleUpvoteReview } = useReviewUpvote(upvotes);
  return (
    <CardFooter className="border-t pt-3 flex justify-between items-center">
      <Button
        onClick={() => handleUpvoteReview(reviewId)}
        variant="ghost"
        size="sm"
        className="text-muted-foreground"
      >
        {hasUpvoted ? (
          <ThumbsUp className="h-4 w-4 mr-1" color="#E50046" fill="#E50046" />
        ) : (
          <ThumbsUp className="h-4 w-4 mr-1" />
        )}
        {upvoteCount > 0 && <span className="font-medium">{upvoteCount}</span>}
        Upvote
      </Button>
      <div>
        <Ellipsis />
      </div>
    </CardFooter>
  );
}

function useReviewUpvote(upvotes: UpvoteProps[]) {
  const { user } = useUser();
  /**
   *  Checking user upvote a review or not
   */
  const [hasUpvoted, setHasUpvoted] = useState(upvotes?.some((item) => item.userId == user?.id));
  const [upvoteCount , setUpvoteCount] = useState(upvotes.length);
  const handleUpvoteReview = useCallback(async (id: string) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/v1/upvote/${id}`,{},
        {
          withCredentials: true,
        }
      );
      if (response.status == 200) {
        setHasUpvoted((prev) => !prev);
        setUpvoteCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error occured upvote review", error);
    }
  }, []);
  return {
    hasUpvoted,
    upvoteCount,
    handleUpvoteReview,
  };
}
