-- CreateTable
CREATE TABLE "ReviewUpvote" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "reviewId" TEXT NOT NULL,

    CONSTRAINT "ReviewUpvote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReviewUpvote_userId_reviewId_key" ON "ReviewUpvote"("userId", "reviewId");

-- AddForeignKey
ALTER TABLE "ReviewUpvote" ADD CONSTRAINT "ReviewUpvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewUpvote" ADD CONSTRAINT "ReviewUpvote_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
