'use client'

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import Link from "next/link";

export interface WebsiteProps {
  id: string;
  name: string;
  websiteUrl: string;
  iconUrl: string;
  description: string;
  createdAt: Date
}


export default function Page() {
  const router = useRouter();
  const [searchQuery , setSearchQuery] = useState<string>('');
  const [websites, setWebsites] = useState<WebsiteProps[]>([]);
  const [loading , setLoading] = useState(true);

  const fetchWebsite = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/apps`, {
        withCredentials: true,
      });
      if (response.status == 200) {
        setWebsites(response.data);
      }
    } catch (error) {
      console.error("Error occured while fetch website", error);
    }finally{
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWebsite();
  }, [fetchWebsite]);

  const filteredWebsites = websites.filter((site) =>
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.websiteUrl.toLowerCase().includes(searchQuery.toLowerCase()),
  )
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Websites Dashboard</h1>
          <p className="text-muted-foreground">Manage and review your websites in one place</p>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search websites by name or URL..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-medium mb-4">Your Websites</h2>

          {loading ? (<Loading size={40} strokeWidth={1}/>) : (filteredWebsites.length === 0 && searchQuery ? (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">No websites found matching your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredWebsites.map((site) => (
                <Card onClick={() => router.push(`/website/${site.id}/reviews`) } key={site.id} className="overflow-hidden transition-all hover:shadow-md cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={site.iconUrl || "/placeholder.svg"}
                          alt={`${site.name} icon`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{site.name}</CardTitle>
                        <CardDescription className="truncate max-w-[200px]">{site.websiteUrl}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      This website is available for review. Click the button below to see detailed analytics and
                      performance metrics.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Link
                      href={site.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      Visit site
                    </Link>
                    <Button size="sm">Review</Button>
                  </CardFooter>
                </Card>
                
              ))}
            </div>
          ))}
        </div>
        <div className="rounded-lg p-6 mt-8">
          <h2 className="text-xl font-medium mb-2">Add a new website</h2>
          <p className="text-muted-foreground mb-4">Want to add another website to your dashboard?</p>
          <Button>Add Website</Button>
        </div>
    </main>
  </div>
  );
}
