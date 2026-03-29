"use client";

import Link from "next/link";
import { ExternalLink, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface VideoSolutionsProps {
  problemTitle: string;
  videoIds?: string[];
  videoKeywords?: string;
}

const youtubeIdPattern = /^[a-zA-Z0-9_-]{11}$/;

export function VideoSolutions({ problemTitle, videoIds = [], videoKeywords }: VideoSolutionsProps) {
  const embedVideoIds = Array.from(new Set(videoIds.filter((id) => youtubeIdPattern.test(id)))).slice(0, 3);
  const searchQuery = (videoKeywords?.trim() || `car ${problemTitle} fix`).trim();
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Video className="size-5 text-primary" />
          Video Solutions
        </h3>
        <Button asChild variant="outline" size="sm">
          <Link href={searchUrl} target="_blank" rel="noopener noreferrer">
            Search more videos
            <ExternalLink className="ml-2 size-4" />
          </Link>
        </Button>
      </div>

      {embedVideoIds.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {embedVideoIds.map((videoId, index) => (
            <Card key={videoId} className="border-border/70">
              <CardContent className="p-3">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={`${problemTitle} video solution ${index + 1}`}
                  loading="lazy"
                  className="h-64 w-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
                <p className="mt-2 text-sm font-medium">Video Solution {index + 1}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border/70">
          <CardContent className="p-4 text-sm text-muted-foreground">
            Video IDs are not available for this issue yet. Use "Search more videos" to find tutorials for this
            problem.
          </CardContent>
        </Card>
      )}
    </section>
  );
}
