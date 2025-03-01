import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Star, Video, MessageSquare, Globe, TrendingUp, Shield, ChevronRight } from "lucide-react"
import ReviewImg from "@/components/icons/ReviewImg"
import Header from "@/components/Header"



export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header  */}
      <Header/>
      <main className="flex-1">
        {/* Hero  */}
        <section className="w-full py-6 md:py-12 lg:py-16 xl:py-24">
          <div className="container mx-auto md:mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Share Your Experience With Any Website
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Submit and discover honest reviews for any website on the internet. Share your thoughts in text or
                    video format and help others make informed decisions.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="gap-1">
                    Start Reviewing <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Explore Reviews
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-full md:h-[450px] lg:h-[500px]">
                  <ReviewImg/>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search  */}
        <section id="search" className="w-full py-6 md:py-12 lg:py-16 bg-muted">
          <div className="container mx-auto md:mx-auto">
            <div className="mx-auto flex max-w-[800px] flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Find Reviews For Any Website</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Looking for honest opinions before you visit a website? Search our database of user-submitted reviews.
              </p>
              <div className="w-full max-w-sm space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Enter website URL or name..."
                    className="w-full appearance-none bg-background pl-8 shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features  */}
        <section id="features" className="w-full py-12 md:py-20 lg:py-24">
          <div className="container mx-auto md:mx-auto">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Powerful Review Features</h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl">
                Our platform offers multiple ways to share and discover website reviews
              </p>
            </div>
            <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 lg:gap-8 mt-8">
              <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <MessageSquare className="h-12 w-12 text-primary" />
                  <div className="space-y-2">
                    <h3 className="font-bold">Text Reviews</h3>
                    <p className="text-sm text-muted-foreground">
                      Share detailed written reviews about your website experiences
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <Video className="h-12 w-12 text-primary" />
                  <div className="space-y-2">
                    <h3 className="font-bold">Video Reviews</h3>
                    <p className="text-sm text-muted-foreground">
                      Record and upload video reviews for more engaging feedback
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <Globe className="h-12 w-12 text-primary" />
                  <div className="space-y-2">
                    <h3 className="font-bold">Any Website</h3>
                    <p className="text-sm text-muted-foreground">
                      Review any website on the internet without restrictions
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <TrendingUp className="h-12 w-12 text-primary" />
                  <div className="space-y-2">
                    <h3 className="font-bold">Trending Reviews</h3>
                    <p className="text-sm text-muted-foreground">Discover popular websites and trending reviews</p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <Shield className="h-12 w-12 text-primary" />
                  <div className="space-y-2">
                    <h3 className="font-bold">Verified Reviews</h3>
                    <p className="text-sm text-muted-foreground">
                      Trust our verification system for authentic feedback
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <Star className="h-12 w-12 text-primary" />
                  <div className="space-y-2">
                    <h3 className="font-bold">Rating System</h3>
                    <p className="text-sm text-muted-foreground">
                      Rate websites on multiple factors for comprehensive reviews
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA  */}
        <section id="cta" className="w-full py-6 md:py-12 lg:py-16">
          <div className="container mx-auto md:mx-auto">
            <div className="mx-auto flex max-w-[50rem] flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Start Sharing Your Experiences Today</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Join our community of reviewers and help others make informed decisions about the websites they visit
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="gap-1">
                  Create Free Account <ChevronRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer  */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 Critique. All rights reserved.</p>
        <Link href={'https://x.com/priyanshuxkumar'} className="mx-auto text-xs cursor-pointer" target="_blank"><span>Made by Priyanshu Kumar</span></Link>
        <nav className="flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
