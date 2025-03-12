"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Plus,
  Star,
  ThumbsUp,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { WebsiteProps } from "@/app/dashboard/page";
import axios, { AxiosError } from "axios";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import RecordMedia from "@/components/RecordMedia";

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
  upvotes?: UpvoteProps[];
}

/**
 * Custom hook to fetch website and its associated reviews data.
 *
 * @returns {object} An object containing:
 * - `loading` (boolean): Indicates if the data fetching is in progress.
 * - `website` (WebsiteProps | undefined): The selected website's details.
 * - `reviews` (ReviewProps[] | undefined): An array of reviews related to the selected website.
 * - `setReviews` (React.Dispatch<ReviewProps[]>): State updater function to modify the reviews list.
 */
function useFetchWebsiteAndReviewsData() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [website, setWebsite] = useState<WebsiteProps>();
  const [reviews, setReviews] = useState<ReviewProps[]>();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      axios.get(`http://localhost:8000/api/v1/website/${id}`, {
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
      .catch((error) => {
        if(error instanceof AxiosError){
          toast(error.response?.data.message || 'Something went wrong');
        }else {
          toast('Failed to fetch data');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  return {
    website,
    reviews,
    setReviews,
    loading,
  };
}

export default function Page() {
  const router = useRouter();
  const { id } = useParams();

  /** Loggedin User context */
  const { user } = useUser();

  /**  Call Custom hook for fetch data of website and all reviews of that opened website */
  const { website, reviews, setReviews, loading } = useFetchWebsiteAndReviewsData();

  /** State for dialog box of add review */
  const [dialogOpen, setDialogOpen] = useState(false)

  /** Add new review functionality */
  const [newReviewRatings , setNewReviewRatings] = useState<number>(5);
  const [newReviewContent , setNewReviewContent] = useState<string>('');

  /** State for review video url */
  const [reviewVideoUrl, setReviewVideoUrl] = useState<string | null>(null);

  /** Handle submit review functionality */
  const handleSubmitReview = async() => {
    try {
      const response = await axios.post(`http://localhost:8000/api/v1/review/create/${id}`, {
        rating: newReviewRatings,
        content: newReviewContent,
        videoUrl: reviewVideoUrl
      },{
        withCredentials: true
      })
      if(response.status == 200){
        /** Showing successfull toast */
        toast('Review submitted successfully!')
        /** Set newly created review to existed reviews */
        setReviews([response.data, ...(reviews || [])]);
        /** Close the dialog box of add review */
        setDialogOpen(false);
      }
    } catch (error) {
      if(error instanceof AxiosError){
        toast(error.response?.data.message);
      }else {
        toast('Something went wrong!');
      } 
    }
  }

  /** Get presignedUrl of review(video) and upload it to s3 */
  const handleVideoUpload = useCallback(async(blob : Blob) => {
    try {
      const videoFile = new File([blob as Blob], 'review-video.webm', { type: 'video/webm' });
      const response = await axios.post(`http://localhost:8000/api/v1/review/get-signed-url`, {
        videoName : videoFile.name,
      },{
        withCredentials: true
      })
      if(response.status == 200){
        if(response.data){
          await axios.put(response.data, videoFile, {
            headers: {
              'Content-Type': videoFile.type
            }
          })
          const url = new URL(response.data);
          const myFilePath = `${url.origin}${url.pathname}`;
          setReviewVideoUrl(myFilePath);
          if(url) {
            toast('Media selected successfully!');
          }
        }
      }
    } catch (error) {
      if(error instanceof AxiosError){
        toast(error.response?.data.message || 'Something went wrong');
      }else {
        toast('Failed to upload media');
      }
      console.error('Error occured while uploading video', error);
    }
  },[]);


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
            <div className="flex flex-col md:flex-row gap-2 lg:gap-6 items-start">
              <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-background">
                {website?.iconUrl && 
                  <Image
                    src={website?.iconUrl}
                    alt={`${website?.name} icon`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                }
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                  <h1 className="text-3xl font-bold">{website?.name}</h1>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  {website && 
                    <Link
                      href={website?.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:underline flex items-center"
                    >
                      {website?.websiteUrl}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  }
                </div>

                <p className="mt-2 text-muted-foreground">
                  {website?.description}
                </p>

                <div className="flex flex-wrap items-center gap-6 mt-2">
                  {reviews && reviews?.length > 0 &&
                    <p className="text-md text-muted-foreground">
                      {reviews?.length} reviews
                    </p>
                  }
                  {website && 
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      Added on {new Date(website?.createdAt).toLocaleDateString()}
                    </div>
                  } 
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <main className="px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 lg:mx-40">
          <h2 className="text-2xl font-semibold">Reviews</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Review
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Add a Review</DialogTitle>
                  <DialogDescription>Share your experience with {website?.name}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="rating">Rating</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRatings(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              newReviewRatings >= star ? "text-yellow-500 fill-yellow-500" : "text-muted"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="content">Review Content</Label>
                    <Textarea
                      id="content"
                      rows={5}
                      value={newReviewContent}
                      onChange={(e) => setNewReviewContent(e.target.value)}
                      placeholder="Share details of your experience with this website"
                    />
                  </div>
                  {/* Record user video of review */}
                  <div> 
                  {/** Component for Record review(video) of user 
                     *  @param {function} handleVideoUpload - Function to handle video upload
                    */}
                    <RecordMedia handleVideoUpload={handleVideoUpload}/>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleSubmitReview} disabled={!newReviewContent || !newReviewRatings}>
                    Submit Review
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="w-full gap-6 flex justify-center items-center flex-wrap">
          {loading ? ( <Loading size={40} strokeWidth={2} />) : (
            reviews && reviews?.length > 0 ? (
            reviews?.map((item) => (
              <Card key={item.id} className="w-full lg:w-[calc((100%-12px)/4)] max-h-[430px]  shadow-none py-4 gap-4 rounded-lg">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="overflow-hidden ">
                        <Avatar>
                          <AvatarImage
                            src={item?.user?.avatar}
                            alt={item?.user?.name}
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
                        <h3 className="font-semibold">{item?.user?.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(item?.createdAt).toLocaleDateString()}
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
                <CardContent className="overflow-hidden">
                  <p className="text-muted-foreground">{item.content}</p>
                </CardContent>
                {/* Review Component Upvotes array of reviews passed */}
                <ReviewFooter upvotes={item?.upvotes as UpvoteProps[]} reviewId={item?.id} />
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-xl">No reviews found</p>
          ))}
        </div>
      </main>
    </div>
  );
}

interface ReviewFooterProps {
  upvotes: UpvoteProps[];
  reviewId: string;
}
/**
 * Footer component for a review card, displaying upvote functionality.
 * @param {UpvoteProps[]} review.upvotes - Array of upvotes on a single review
 * @param {string} review.reviewId - Unique identifier of the review
 * 
 * @returns {JSX.Element} UI component representing the footer of a review card
 * - Displays an upvote button
 * - Shows the total number of upvotes
 * - Highlights the upvote icon if the user has already upvoted
 */
function ReviewFooter({upvotes, reviewId}: ReviewFooterProps) {
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
    </CardFooter>
  );
}

/**
 * Custom hook to handle upvoting functionality for reviews.
 * @param {UpvoteProps[]} upvotes - Array of upvotes associated with a particular review.
 * @returns {object} An object containing:
 * - `hasUpvoted` (boolean): Indicates if the current user has upvoted the review.
 * - `upvoteCount` (number): The total number of upvotes on the review.
 * - `handleUpvoteReview` (function): Function to toggle upvote status for the review.
 */
function useReviewUpvote(upvotes: UpvoteProps[]) {
  const { user } = useUser();
  /** Checking user upvote a review or not */
  const [hasUpvoted, setHasUpvoted] = useState(upvotes?.some((item) => item.userId == user?.id));

  /** Total upvote count on a review */
  const [upvoteCount , setUpvoteCount] = useState(upvotes.length);

  const handleUpvoteReview = useCallback(async (id: string) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/v1/upvote/${id}`,{},
        {
          withCredentials: true,
        }
      );
      if (response.status == 200) {
        /** Upvote successfull toast */
        toast(response.data.message);
        /** Mark hasUpvote as true for highlight the color of upvote icon */
        setHasUpvoted((prev) => !prev);
        /** Increase count of upvotes on successfull response */
        setUpvoteCount(prev => prev + 1);
      }
    } catch (error) {
      if(error instanceof AxiosError){
        toast(error.response?.data.message);
      }else {
        toast('Something went wrong!');
      }
    }
  }, []);
  return {
    hasUpvoted,
    upvoteCount,
    handleUpvoteReview,
  };
}